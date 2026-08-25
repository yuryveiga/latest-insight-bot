// Local exato: "Brazilian Football Experience" (Google Maps place id)
const PLACE_ID = "ChIJTYojf15_mQARNJDqBE-G5zs";
const TARGET_URL = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`;

const APIFY_ACTOR = "compass~Google-Maps-Reviews-Scraper";

export type ScrapedReview = {
  author: string;
  rating: number | null;
  relative_time: string | null;
  review_text: string | null;
  published_at?: string | null;
  review_id?: string | null;
};

type ApifyReview = {
  name?: string;
  stars?: number;
  publishAt?: string;
  publishedAtDate?: string;
  text?: string | null;
  reviewId?: string;
  placeId?: string;
};

export async function scrapeLatestReviews(): Promise<ScrapedReview[]> {
  const token = process.env["APIFY_TOKEN"];
  if (!token) throw new Error("APIFY_TOKEN não configurado");

  const res = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startUrls: [{ url: TARGET_URL }],
        maxReviews: 15,
        reviewsSort: "newest",
        language: "pt-BR",
        personalData: true,
      }),
    },
  );

  const data = (await res.json()) as ApifyReview[] | { error?: { message?: string } };

  if (!res.ok || !Array.isArray(data)) {
    const msg = !Array.isArray(data) ? data?.error?.message : undefined;
    throw new Error(msg || `Apify falhou [${res.status}]`);
  }

  return data
    .filter((r) => !r.placeId || r.placeId === PLACE_ID)
    .sort((a, b) =>
      String(b.publishedAtDate ?? "").localeCompare(String(a.publishedAtDate ?? "")),
    )
    .slice(0, 15)
    .map((r) => ({
      author: String(r.name ?? "Anônimo"),
      rating: typeof r.stars === "number" ? r.stars : null,
      relative_time: r.publishAt ?? null,
      review_text: r.text ?? null,
      published_at: r.publishedAtDate ?? null,
      review_id: r.reviewId ?? null,
    }));
}


export function fingerprint(r: ScrapedReview): string {
  if (r.review_id) return r.review_id;
  return `${r.author}|${(r.review_text ?? "").slice(0, 120)}`.toLowerCase();
}

export async function runReviewScrape() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    const reviews = await scrapeLatestReviews();

    if (reviews.length > 0) {
      await supabaseAdmin.from("google_reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const rows = reviews.map((r, i) => ({
        fingerprint: fingerprint(r),
        author: r.author,
        rating: r.rating,
        relative_time: r.relative_time,
        review_text: r.review_text,
        published_at: r.published_at ?? null,
        position: i,
        scraped_at: new Date().toISOString(),
      }));

      const { error } = await supabaseAdmin.from("google_reviews").upsert(rows, {
        onConflict: "fingerprint",
      });
      if (error) throw new Error(error.message);
    }

    await supabaseAdmin
      .from("review_scrape_runs")
      .insert({ status: "success", found_count: reviews.length });

    return { success: true, count: reviews.length };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabaseAdmin
      .from("review_scrape_runs")
      .insert({ status: "error", found_count: 0, error: message });
    throw e;
  }
}
