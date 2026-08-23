CREATE TABLE public.google_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL UNIQUE,
  author text NOT NULL,
  rating numeric,
  relative_time text,
  review_text text,
  position integer NOT NULL DEFAULT 0,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.google_reviews TO anon;
GRANT SELECT ON public.google_reviews TO authenticated;
GRANT ALL ON public.google_reviews TO service_role;
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON public.google_reviews FOR SELECT USING (true);

CREATE TABLE public.review_scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  found_count integer NOT NULL DEFAULT 0,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.review_scrape_runs TO anon;
GRANT SELECT ON public.review_scrape_runs TO authenticated;
GRANT ALL ON public.review_scrape_runs TO service_role;
ALTER TABLE public.review_scrape_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Runs are publicly readable" ON public.review_scrape_runs FOR SELECT USING (true);