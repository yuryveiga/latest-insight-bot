import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/preview-maracana")({
  head: () => ({
    meta: [
      { title: "Preview: avaliações no Maracanã Matchday" },
      {
        name: "description",
        content:
          "Simulação de como o carrossel de avaliações do Google ficaria na seção REVIEWS do site Maracanã Matchday.",
      },
      { property: "og:title", content: "Preview: avaliações no Maracanã Matchday" },
      {
        property: "og:description",
        content: "Simulação do widget de avaliações aplicado ao estilo do site.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreviewMaracana,
});

const GOOGLE_URL =
  "https://www.google.com.br/search?sca_esv=93bf05b8ac35d58d&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYC1ZWaQaJ2_8W2vlbFkad7xchq12lDaF-pmq7nrTcapnqpNRlYe_58wx9IdpTJu0iAEhHNmwUOOIxT5SVnya2dV-7tHb4DDN-6x7coGoM2gpEGOSvszN5YUEzMm-2rFUr8pLfE%3D&q=Brazilian+Football+Experience+Coment%C3%A1rios";

const EMBED = `<div
  data-google-reviews
  data-limit="12"
  data-per-page="3"
  data-autoplay="true"
  data-interval="6000"
  data-star-color="#84cc16"
  data-card-bg="#ffffff"
  data-card-border="#e5e7eb"
  data-radius="16px"
  data-avatar-bg="#cfeaf5"
></div>
<script async src="https://latest-insight-bot.lovable.app/api/public/reviews-widget.js"></script>`;

function PreviewMaracana() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";
    const target = document.createElement("div");
    const attrs: Record<string, string> = {
      "data-google-reviews": "",
      "data-limit": "12",
      "data-per-page": "3",
      "data-autoplay": "true",
      "data-interval": "6000",
      "data-star-color": "#84cc16",
      "data-card-bg": "#ffffff",
      "data-card-border": "#e5e7eb",
      "data-radius": "16px",
      "data-avatar-bg": "#cfeaf5",
    };
    Object.entries(attrs).forEach(([k, v]) => target.setAttribute(k, v));
    host.appendChild(target);

    const s = document.createElement("script");
    s.src = `/api/public/reviews-widget.js?v=${Date.now()}`;
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  return (
    <main
      style={{
        background: "#fafafa",
        color: "#111827",
        fontFamily: "Inter, system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Reviews
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
            marginBottom: 32,
            fontSize: ".95rem",
          }}
        >
          <span style={{ color: "#84cc16", letterSpacing: 2 }}>★★★★★</span>
          <strong>5.0</strong>
          <a
            href={GOOGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4b5563", textDecoration: "underline" }}
          >
            — 2200 reviews on Google
          </a>
        </div>

        <div ref={hostRef} />
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 64px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>
          Código para substituir o carrossel atual
        </h2>
        <pre
          style={{
            overflowX: "auto",
            background: "#111827",
            color: "#e5e7eb",
            padding: 16,
            borderRadius: 12,
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          {EMBED}
        </pre>
      </section>
    </main>
  );
}
