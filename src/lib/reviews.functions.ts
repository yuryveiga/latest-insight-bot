import { createServerFn } from "@tanstack/react-start";

export const getReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [{ data: reviews }, { data: runs }] = await Promise.all([
    supabaseAdmin
      .from("google_reviews")
      .select("id, author, rating, relative_time, review_text, position, scraped_at")
      .order("position", { ascending: true })
      .limit(10),
    supabaseAdmin
      .from("review_scrape_runs")
      .select("status, found_count, error, created_at")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  return { reviews: reviews ?? [], lastRun: runs?.[0] ?? null };
});

export const refreshReviews = createServerFn({ method: "POST" }).handler(async () => {
  const { runReviewScrape } = await import("@/lib/reviews.server");
  try {
    return await runReviewScrape();
  } catch (e) {
    return { success: false, count: 0, error: e instanceof Error ? e.message : String(e) };
  }
});
