const TARGET_URL =
  "https://www.google.com.br/search?sca_esv=93bf05b8ac35d58d&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYC1ZWaQaJ2_8W2vlbFkad7xchq12lDaF-pmq7nrTcapnqpNRlYe_58wx9IdpTJu0iAEhHNmwUOOIxT5SVnya2dV-7tHb4DDN-6x7coGoM2gpEGOSvszN5YUEzMm-2rFUr8pLfE%3D&q=Brazilian+Football+Experience+Coment%C3%A1rios&hl=pt-BR&sort=newest";

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";

export type ScrapedReview = {
  author: string;
  rating: number | null;
  relative_time: string | null;
  review_text: string | null;
};

const reviewSchema = {
  type: "object",
  properties: {
    reviews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          author: { type: "string" },
          rating: { type: "number" },
          relative_time: { type: "string" },
          review_text: { type: "string" },
        },
        required: ["author"],
      },
    },
  },
  required: ["reviews"],
};

export async function scrapeLatestReviews(): Promise<ScrapedReview[]> {
  const apiKey = process.env["FIRECRAWL_API_KEY"];
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY não configurada");

  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: TARGET_URL,
      onlyMainContent: false,
      waitFor: 4000,
      location: { country: "BR", languages: ["pt-BR"] },
      formats: [
        {
          type: "json",
          schema: reviewSchema,
          prompt:
            "Extraia as avaliações (reviews) do Google exibidas nesta página para 'Brazilian Football Experience'. Ordene das mais recentes para as mais antigas usando o tempo relativo (ex.: 'há 2 dias' é mais recente que 'há 1 mês'). Retorne no máximo 10. Campos: author (nome do autor), rating (nota 1-5), relative_time (tempo relativo como exibido), review_text (texto completo do comentário).",
        },
      ],
    }),
  });

  const data = (await res.json()) as {
    json?: { reviews?: ScrapedReview[] };
    data?: { json?: { reviews?: ScrapedReview[] } };
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || `Firecrawl falhou [${res.status}]`);
  }

  const reviews = data.json?.reviews ?? data.data?.json?.reviews ?? [];
  return reviews.slice(0, 10).map((r) => ({
    author: String(r.author ?? "Anônimo"),
    rating: typeof r.rating === "number" ? r.rating : null,
    relative_time: r.relative_time ?? null,
    review_text: r.review_text ?? null,
  }));
}

export function fingerprint(r: ScrapedReview): string {
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
