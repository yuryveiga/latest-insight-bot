import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getReviews, refreshReviews } from "@/lib/reviews.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reviews Google — Brazilian Football Experience" },
      {
        name: "description",
        content:
          "As 10 avaliações mais recentes do Google sobre a Brazilian Football Experience, coletadas automaticamente toda semana.",
      },
      { property: "og:title", content: "Reviews Google — Brazilian Football Experience" },
      {
        property: "og:description",
        content: "Monitoramento semanal das avaliações mais recentes no Google.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getReviews(),
  component: Index,
});

function Stars({ rating }: { rating: number | null }) {
  if (rating == null) return null;
  const full = Math.round(rating);
  return (
    <span className="text-accent" aria-label={`${rating} de 5 estrelas`}>
      {"★".repeat(full)}
      <span className="text-muted-foreground">{"★".repeat(Math.max(0, 5 - full))}</span>
    </span>
  );
}

function Index() {
  const { reviews, lastRun } = Route.useLoaderData();
  const router = useRouter();
  const refresh = useServerFn(refreshReviews);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onRefresh = async () => {
    setBusy(true);
    setMsg(null);
    const res = (await refresh()) as { success: boolean; count: number; error?: string };
    setMsg(res.success ? `${res.count} avaliações atualizadas.` : `Falha: ${res.error}`);
    await router.invalidate();
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Monitoramento semanal
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            Reviews do Google
          </h1>
          <p className="mt-3 text-muted-foreground">
            As 10 avaliações mais recentes de <strong>Brazilian Football Experience</strong>,
            coletadas automaticamente toda semana.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={busy}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Coletando..." : "Coletar agora"}
            </button>
            {lastRun && (
              <span className="text-xs text-muted-foreground">
                Última coleta:{" "}
                {new Date(lastRun.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}{" "}
                — {lastRun.status === "success" ? `${lastRun.found_count} avaliações` : "erro"}
              </span>
            )}
          </div>
          {msg && <p className="mt-3 text-sm text-foreground">{msg}</p>}
        </header>

        {reviews.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            Nenhuma avaliação coletada ainda. Clique em “Coletar agora”.
          </div>
        ) : (
          <ol className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-semibold text-card-foreground">{r.author}</h2>
                  <span className="text-xs text-muted-foreground">{r.relative_time}</span>
                </div>
                <div className="mt-1 text-sm">
                  <Stars rating={r.rating} />
                </div>
                {r.review_text && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {r.review_text}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
