import { createFileRoute } from "@tanstack/react-router";

const GOOGLE_URL =
  "https://www.google.com.br/search?sca_esv=93bf05b8ac35d58d&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYC1ZWaQaJ2_8W2vlbFkad7xchq12lDaF-pmq7nrTcapnqpNRlYe_58wx9IdpTJu0iAEhHNmwUOOIxT5SVnya2dV-7tHb4DDN-6x7coGoM2gpEGOSvszN5YUEzMm-2rFUr8pLfE%3D&q=Brazilian+Football+Experience+Coment%C3%A1rios";

const SCRIPT = `(function () {
  var GOOGLE_URL = ${JSON.stringify(GOOGLE_URL)};
  var current = document.currentScript;
  var base = current ? new URL(current.src, location.href).origin : "";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function stars(n) {
    var full = Math.round(n || 0);
    return '<span class="gr-stars" aria-label="' + full + ' de 5 estrelas">' +
      '<span class="gr-stars-on">' + "\\u2605".repeat(full) + "</span>" +
      '<span class="gr-stars-off">' + "\\u2605".repeat(Math.max(0, 5 - full)) + "</span></span>";
  }

  var css = ""
    + ".gr-widget{font:inherit;color:inherit}"
    + ".gr-list{list-style:none;margin:0;padding:0;display:grid;gap:16px}"
    + "@media(min-width:768px){.gr-list.gr-cols{grid-template-columns:repeat(2,1fr)}}"
    + ".gr-card{display:block;text-decoration:none;color:inherit;border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:18px;background:rgba(255,255,255,.03);transition:border-color .2s,transform .2s}"
    + ".gr-card:hover{border-color:currentColor;transform:translateY(-2px)}"
    + ".gr-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}"
    + ".gr-author{font-weight:700;margin:0;font-size:1rem}"
    + ".gr-time{font-size:.8rem;opacity:.65}"
    + ".gr-stars{letter-spacing:2px;font-size:.95rem}"
    + ".gr-stars-on{color:#f5b301}.gr-stars-off{opacity:.25}"
    + ".gr-text{margin:10px 0 0;font-size:.925rem;line-height:1.6;opacity:.85;white-space:pre-line}"
    + ".gr-more{display:inline-block;margin-top:16px;font-size:.875rem;text-decoration:underline}";

  function mount(el) {
    var limit = parseInt(el.getAttribute("data-limit") || "10", 10);
    var cols = el.getAttribute("data-columns") !== "1";
    fetch(base + "/api/public/reviews.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = (d.reviews || []).slice(0, limit);
        if (!items.length) { el.innerHTML = ""; return; }
        el.classList.add("gr-widget");
        el.innerHTML =
          "<style>" + css + "</style>" +
          '<ol class="gr-list' + (cols ? " gr-cols" : "") + '">' +
          items.map(function (r) {
            return "<li>" +
              '<a class="gr-card" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer">' +
              '<div class="gr-head"><p class="gr-author">' + esc(r.author) + "</p>" +
              '<span class="gr-time">' + esc(r.relative_time || "") + "</span></div>" +
              (r.rating != null ? stars(r.rating) : "") +
              (r.review_text ? '<p class="gr-text">' + esc(r.review_text) + "</p>" : "") +
              "</a></li>";
          }).join("") +
          "</ol>" +
          '<a class="gr-more" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer">Ver todas as avaliações no Google</a>';
      })
      .catch(function () { el.innerHTML = ""; });
  }

  function init() {
    document.querySelectorAll("[data-google-reviews]").forEach(mount);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();`;

export const Route = createFileRoute("/api/public/reviews-widget.js")({
  server: {
    handlers: {
      GET: async () =>
        new Response(SCRIPT, {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=300",
          },
        }),
    },
  },
});
