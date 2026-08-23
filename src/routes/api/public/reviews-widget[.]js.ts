import { createFileRoute } from "@tanstack/react-router";

const GOOGLE_URL =
  "https://www.google.com.br/search?sca_esv=93bf05b8ac35d58d&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYC1ZWaQaJ2_8W2vlbFkad7xchq12lDaF-pmq7nrTcapnqpNRlYe_58wx9IdpTJu0iAEhHNmwUOOIxT5SVnya2dV-7tHb4DDN-6x7coGoM2gpEGOSvszN5YUEzMm-2rFUr8pLfE%3D&q=Brazilian+Football+Experience+Coment%C3%A1rios";

const SCRIPT = `(function () {
  var GOOGLE_URL = ${JSON.stringify(GOOGLE_URL)};
  var current = document.currentScript;
  var base = current ? new URL(current.src, location.href).origin : "";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c];
    });
  }

  function stars(n) {
    var full = Math.round(n || 0);
    return '<span class="gr-stars" aria-label="' + full + ' de 5 estrelas">' +
      '<span class="gr-stars-on">' + "\\u2605".repeat(full) + "</span>" +
      '<span class="gr-stars-off">' + "\\u2605".repeat(Math.max(0, 5 - full)) + "</span></span>";
  }

  function card(r) {
    return '<a class="gr-card" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer">' +
      '<div class="gr-head"><p class="gr-author">' + esc(r.author) + "</p>" +
      '<span class="gr-time">' + esc(r.relative_time || "") + "</span></div>" +
      (r.rating != null ? stars(r.rating) : "") +
      (r.review_text ? '<p class="gr-text">' + esc(r.review_text) + "</p>" : "") +
      "</a>";
  }

  var css = ""
    + ".gr-widget{font:inherit;color:inherit}"
    + ".gr-carousel{position:relative;overflow:hidden}"
    + ".gr-track{display:flex;transition:transform .4s ease;margin:0;padding:0;list-style:none;gap:16px}"
    + ".gr-slide{flex:0 0 100%;display:grid;gap:16px;list-style:none;margin:0;padding:0}"
    + "@media(min-width:640px){.gr-slide{grid-template-columns:repeat(2,1fr)}}"
    + "@media(min-width:1024px){.gr-slide{grid-template-columns:repeat(3,1fr)}}"
    + ".gr-card{display:block;text-decoration:none;color:inherit;border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:18px;background:rgba(255,255,255,.03);transition:border-color .2s,transform .2s}"
    + ".gr-card:hover{border-color:currentColor;transform:translateY(-2px)}"
    + ".gr-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}"
    + ".gr-author{font-weight:700;margin:0;font-size:1rem}"
    + ".gr-time{font-size:.8rem;opacity:.65}"
    + ".gr-stars{letter-spacing:2px;font-size:.95rem}"
    + ".gr-stars-on{color:#f5b301}.gr-stars-off{opacity:.25}"
    + ".gr-text{margin:10px 0 0;font-size:.925rem;line-height:1.6;opacity:.85;white-space:pre-line}"
    + ".gr-nav{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:16px}"
    + ".gr-btn{appearance:none;border:1px solid rgba(0,0,0,.18);background:transparent;color:inherit;width:40px;height:40px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s;line-height:1;padding:0}"
    + ".gr-btn:hover{background:rgba(0,0,0,.06);border-color:currentColor}"
    + ".gr-btn:disabled{opacity:.35;cursor:default}"
    + ".gr-dots{display:flex;gap:6px}"
    + ".gr-dot{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.25;border:none;cursor:pointer;padding:0;transition:opacity .2s}"
    + ".gr-dot.active{opacity:1}"
    + ".gr-more{display:block;text-align:center;margin-top:14px;font-size:.875rem;text-decoration:underline}";

  function mount(el) {
    var limit = parseInt(el.getAttribute("data-limit") || "10", 10);
    var perPage = parseInt(el.getAttribute("data-per-page") || "3", 10);
    perPage = Math.max(1, Math.min(6, perPage));
    fetch(base + "/api/public/reviews.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = (d.reviews || []).slice(0, limit);
        if (!items.length) { el.innerHTML = ""; return; }
        el.classList.add("gr-widget");

        var slides = [];
        for (var i = 0; i < items.length; i += perPage) {
          slides.push(items.slice(i, i + perPage));
        }
        var total = slides.length;
        var cur = 0;

        function render() {
          var dots = "";
          for (var j = 0; j < total; j++) {
            dots += '<button class="gr-dot' + (j === cur ? " active" : "") + '" data-i="' + j + '" aria-label="Slide ' + (j+1) + '"></button>';
          }
          return "<style>" + css + "</style>" +
            '<div class="gr-carousel">' +
            '<ul class="gr-track" style="transform:translateX(-' + (cur * 100) + '%)">' +
            slides.map(function (s) {
              return '<li class="gr-slide">' + s.map(card).join("") + "</li>";
            }).join("") +
            "</ul></div>" +
            '<div class="gr-nav">' +
              '<button class="gr-btn gr-prev" aria-label="Anterior">' + "\\u2039" + "</button>" +
              '<div class="gr-dots">' + dots + "</div>" +
              '<button class="gr-btn gr-next" aria-label="Pr\\u00f3ximo">' + "\\u203a" + "</button>" +
            "</div>" +
            '<a class="gr-more" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer">Ver todas as avaliações no Google</a>';
        }

        el.innerHTML = render();

        function go(n) {
          cur = Math.max(0, Math.min(total - 1, n));
          var track = el.querySelector(".gr-track");
          if (track) track.style.transform = "translateX(-" + (cur * 100) + "%)";
          el.querySelectorAll(".gr-dot").forEach(function (d, idx) {
            d.classList.toggle("active", idx === cur);
          });
          var prev = el.querySelector(".gr-prev");
          var next = el.querySelector(".gr-next");
          if (prev) prev.disabled = cur === 0;
          if (next) next.disabled = cur === total - 1;
        }

        el.querySelector(".gr-prev").addEventListener("click", function () { go(cur - 1); });
        el.querySelector(".gr-next").addEventListener("click", function () { go(cur + 1); });
        el.querySelectorAll(".gr-dot").forEach(function (d) {
          d.addEventListener("click", function () { go(parseInt(d.getAttribute("data-i"), 10)); });
        });
        go(0);
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
