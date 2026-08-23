import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/widget-preview")({
  head: () => ({
    meta: [
      { title: "Preview do widget de avaliações do Google" },
      {
        name: "description",
        content:
          "Visualize como o widget de avaliações do Google aparece antes de incorporá-lo no seu site.",
      },
      { property: "og:title", content: "Preview do widget de avaliações" },
      {
        property: "og:description",
        content: "Teste o widget de avaliações do Google antes de incorporar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WidgetPreview,
});

function WidgetPreview() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(10);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";
    const target = document.createElement("div");
    target.setAttribute("data-google-reviews", "");
    target.setAttribute("data-limit", String(limit));
    target.setAttribute("data-per-page", String(perPage));
    host.appendChild(target);

    const s = document.createElement("script");
    s.src = `/api/public/reviews-widget.js?v=${Date.now()}`;
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [limit, perPage]);

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Preview do widget</h1>
          <p className="text-sm text-muted-foreground">
            Assim o widget vai renderizar no seu site (ele herda fonte e cor do
            tema do site de destino).
          </p>
        </header>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            Reviews:
            <input
              type="number"
              min={1}
              max={10}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-20 rounded border border-border bg-card px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-2">
            Por slide:
            <input
              type="number"
              min={1}
              max={6}
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="w-20 rounded border border-border bg-card px-2 py-1"
            />
          </label>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div ref={hostRef} />
        </div>

        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-xs">
{`<div data-google-reviews data-limit="${limit}" data-per-page="${perPage}" data-autoplay="true" data-interval="6000"></div>
<script async src="https://latest-insight-bot.lovable.app/api/public/reviews-widget.js"></script>`}
        </pre>
      </div>
    </main>
  );
}
