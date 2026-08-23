import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/reviews.json")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("google_reviews")
          .select("id, author, rating, relative_time, review_text, position")
          .order("position", { ascending: true })
          .limit(10);

        return Response.json(
          { reviews: data ?? [] },
          {
            headers: {
              ...CORS,
              "Cache-Control": "public, max-age=300, s-maxage=3600",
            },
          },
        );
      },
    },
  },
});
