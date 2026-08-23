import { createFileRoute } from "@tanstack/react-router";

const GOOGLE_URL =
  "https://www.google.com.br/search?sca_esv=93bf05b8ac35d58d&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYC1ZWaQaJ2_8W2vlbFkad7xchq12lDaF-pmq7nrTcapnqpNRlYe_58wx9IdpTJu0iAEhHNmwUOOIxT5SVnya2dV-7tHb4DDN-6x7coGoM2gpEGOSvszN5YUEzMm-2rFUr8pLfE%3D&q=Brazilian+Football+Experience+Coment%C3%A1rios";

const SCRIPT = `(function () {
  var GOOGLE_URL = ${JSON.stringify(GOOGLE_URL)};
  var current = document.currentScript;
  var base = current ? new URL(current.src, location.href).origin : "";
  var uid = 0;

  var ENT = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ENT[c]; });
  }

  function stars(n) {
    var full = Math.round(n || 0);
    return '<span class="gr-stars" role="img" aria-label="' + full + ' de 5 estrelas">' +
      '<span class="gr-stars-on" aria-hidden="true">' + "\\u2605".repeat(full) + "</span>" +
      '<span class="gr-stars-off" aria-hidden="true">' + "\\u2605".repeat(Math.max(0, 5 - full)) + "</span></span>";
  }

  function clamp(t, max) {
    var w = String(t == null ? "" : t).trim().split(/\\s+/);
    if (w.length <= max) return w.join(" ");
    return w.slice(0, max).join(" ") + "\\u2026";
  }

  function card(r) {
    var label = "Avaliação de " + (r.author || "visitante") +
      (r.rating != null ? ", " + Math.round(r.rating) + " de 5 estrelas" : "") +
      " — abrir no Google em nova aba";
    return '<li class="gr-item"><a class="gr-card" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(label) + '">' +
      '<div class="gr-head"><p class="gr-author">' + esc(r.author) + "</p>" +
      '<span class="gr-time">' + esc(r.relative_time || "") + "</span></div>" +
      (r.rating != null ? stars(r.rating) : "") +
      (r.review_text ? '<p class="gr-text">' + esc(clamp(r.review_text, 30)) + "</p>" : "") +
      "</a></li>";
  }

  var css = ""
    + ".gr-widget{font:inherit;color:inherit}"
    + ".gr-carousel{position:relative;overflow:hidden}"
    + ".gr-track{display:flex;transition:transform .4s ease;margin:0;padding:0;list-style:none}"
    + ".gr-slide{flex:0 0 100%;display:grid;gap:16px;list-style:none;margin:0;padding:2px}"
    + "@media(min-width:640px){.gr-slide{grid-template-columns:repeat(2,1fr)}}"
    + "@media(min-width:1024px){.gr-slide{grid-template-columns:repeat(3,1fr)}}"
    + ".gr-item{list-style:none;margin:0;padding:0;display:flex}"
    + ".gr-card{display:block;width:100%;text-decoration:none;color:inherit;border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:18px;background:rgba(255,255,255,.03);transition:border-color .2s,transform .2s}"
    + ".gr-card:hover{border-color:currentColor;transform:translateY(-2px)}"
    + ".gr-widget :focus-visible{outline:3px solid currentColor;outline-offset:3px;border-radius:12px}"
    + ".gr-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}"
    + ".gr-author{font-weight:700;margin:0;font-size:1rem}"
    + ".gr-time{font-size:.8rem;opacity:.65}"
    + ".gr-stars{letter-spacing:2px;font-size:.95rem}"
    + ".gr-stars-on{color:#f5b301}.gr-stars-off{opacity:.25}"
    + ".gr-text{margin:10px 0 0;font-size:.925rem;line-height:1.6;opacity:.85;white-space:pre-line}"
    + ".gr-nav{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:16px;flex-wrap:wrap}"
    + ".gr-btn{appearance:none;border:1px solid rgba(0,0,0,.18);background:transparent;color:inherit;min-width:44px;min-height:44px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s;line-height:1;padding:0}"
    + ".gr-btn:hover{background:rgba(0,0,0,.06);border-color:currentColor}"
    + ".gr-btn:disabled{opacity:.35;cursor:default}"
    + ".gr-dots{display:flex;gap:4px}"
    + ".gr-dot{width:24px;height:44px;background:transparent;border:none;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center}"
    + ".gr-dot::before{content:'';width:9px;height:9px;border-radius:50%;background:currentColor;opacity:.25;transition:opacity .2s}"
    + ".gr-dot[aria-current='true']::before{opacity:1}"
    + ".gr-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}"
    + ".gr-more-wrap{display:flex;justify-content:center;margin-top:16px}"
    + ".gr-more{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:10px 20px;border:1px solid currentColor;border-radius:999px;color:inherit;text-decoration:none;font-size:.9rem;font-weight:600;transition:background .2s}"
    + ".gr-more:hover{background:rgba(0,0,0,.06)}"
    + ".gr-skel{display:grid;gap:16px;grid-template-columns:1fr}"
    + "@media(min-width:640px){.gr-skel{grid-template-columns:repeat(2,1fr)}}"
    + "@media(min-width:1024px){.gr-skel{grid-template-columns:repeat(3,1fr)}}"
    + ".gr-skel-card{border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:18px;min-height:var(--gr-card-h,196px)}"
    + ".gr-line{height:12px;border-radius:6px;background:currentColor;opacity:.12;margin-bottom:10px;animation:gr-pulse 1.4s ease-in-out infinite}"
    + "@keyframes gr-pulse{0%,100%{opacity:.10}50%{opacity:.2}}"
    + "@media(prefers-reduced-motion:reduce){.gr-track{transition:none}.gr-card:hover{transform:none}.gr-line{animation:none}}";

  function mount(el) {
    var limit = parseInt(el.getAttribute("data-limit") || "10", 10);
    var perPage = parseInt(el.getAttribute("data-per-page") || "3", 10);
    var autoplay = el.getAttribute("data-autoplay") !== "false";
    var interval = Math.max(2000, parseInt(el.getAttribute("data-interval") || "6000", 10));
    perPage = Math.max(1, Math.min(6, perPage));
    var id = "gr" + ++uid;

    el.classList.add("gr-widget");
    el.style.minHeight = el.style.minHeight || "";
    var skel = "";
    for (var k = 0; k < perPage; k++) {
      skel += '<div class="gr-skel-card"><div class="gr-line" style="width:45%"></div>' +
        '<div class="gr-line" style="width:30%"></div><div class="gr-line"></div>' +
        '<div class="gr-line"></div><div class="gr-line" style="width:70%"></div></div>';
    }
    el.innerHTML = "<style>" + css + "</style>" +
      '<div class="gr-skel" role="status" aria-live="polite" aria-busy="true">' +
      '<span class="gr-sr">Carregando avaliações\\u2026</span>' + skel + "</div>";

    fetch(base + "/api/public/reviews.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = (d.reviews || []).slice(0, limit);
        if (!items.length) { el.innerHTML = ""; return; }
        el.classList.add("gr-widget");

        var slides = [];
        for (var i = 0; i < items.length; i += perPage) slides.push(items.slice(i, i + perPage));
        var total = slides.length;
        var cur = 0;
        var timer = null;
        var paused = false;

        var dots = "";
        for (var j = 0; j < total; j++) {
          dots += '<button type="button" class="gr-dot" data-i="' + j + '" aria-current="' + (j === 0 ? "true" : "false") +
            '" aria-controls="' + id + '-track" aria-label="Ir para o grupo ' + (j + 1) + ' de ' + total + '"></button>';
        }

        el.innerHTML = "<style>" + css + "</style>" +
          '<section class="gr-region" role="region" aria-roledescription="carrossel" aria-label="Avaliações do Google" tabindex="0">' +
          '<p class="gr-sr">Use as setas do teclado para navegar entre as avaliações.</p>' +
          '<div class="gr-carousel">' +
          '<ul class="gr-track" id="' + id + '-track" aria-live="polite">' +
          slides.map(function (s, idx) {
            return '<li class="gr-slide" role="group" aria-roledescription="slide" aria-label="Grupo ' + (idx + 1) + ' de ' + total + '">' +
              "<ul style=\\"display:contents;list-style:none;margin:0;padding:0\\">" + s.map(card).join("") + "</ul></li>";
          }).join("") +
          "</ul></div>" +
          '<div class="gr-nav">' +
            '<button type="button" class="gr-btn gr-prev" aria-label="Avaliações anteriores" aria-controls="' + id + '-track"><span aria-hidden="true">\\u2039</span></button>' +
            '<div class="gr-dots">' + dots + "</div>" +
            '<button type="button" class="gr-btn gr-next" aria-label="Próximas avaliações" aria-controls="' + id + '-track"><span aria-hidden="true">\\u203a</span></button>' +
            (autoplay && total > 1 ? '<button type="button" class="gr-btn gr-play" aria-label="Pausar rotação automática"><span aria-hidden="true">\\u23F8</span></button>' : "") +
          "</div>" +
          '<div class="gr-more-wrap"><a class="gr-more" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer">Ver todas as avaliações<span class="gr-sr"> no Google (abre em nova aba)</span></a></div>' +
          "</section>";

        var region = el.querySelector(".gr-region");
        var track = el.querySelector(".gr-track");
        var prev = el.querySelector(".gr-prev");
        var next = el.querySelector(".gr-next");
        var play = el.querySelector(".gr-play");
        var dotEls = el.querySelectorAll(".gr-dot");
        var slideEls = el.querySelectorAll(".gr-slide");

        function go(n, wrap) {
          if (wrap) cur = (n + total) % total;
          else cur = Math.max(0, Math.min(total - 1, n));
          track.style.transform = "translateX(-" + (cur * 100) + "%)";
          dotEls.forEach(function (d, idx) { d.setAttribute("aria-current", idx === cur ? "true" : "false"); });
          slideEls.forEach(function (s, idx) {
            var hidden = idx !== cur;
            s.setAttribute("aria-hidden", hidden ? "true" : "false");
            s.querySelectorAll("a").forEach(function (a) {
              if (hidden) a.setAttribute("tabindex", "-1");
              else a.removeAttribute("tabindex");
            });
          });
          if (prev) prev.disabled = total <= 1;
          if (next) next.disabled = total <= 1;
        }

        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        function start() {
          if (!autoplay || paused || total < 2) return;
          if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          stop();
          timer = setInterval(function () { go(cur + 1, true); }, interval);
        }
        function setPaused(v) {
          paused = v;
          if (play) {
            play.setAttribute("aria-label", v ? "Retomar rotação automática" : "Pausar rotação automática");
            play.innerHTML = '<span aria-hidden="true">' + (v ? "\\u25B6" : "\\u23F8") + "</span>";
          }
          if (v) stop(); else start();
        }

        prev.addEventListener("click", function () { setPaused(true); go(cur - 1, true); });
        next.addEventListener("click", function () { setPaused(true); go(cur + 1, true); });
        dotEls.forEach(function (d) {
          d.addEventListener("click", function () { setPaused(true); go(parseInt(d.getAttribute("data-i"), 10)); });
        });
        if (play) play.addEventListener("click", function () { setPaused(!paused); });

        region.addEventListener("keydown", function (e) {
          if (e.key === "ArrowLeft") { e.preventDefault(); setPaused(true); go(cur - 1, true); }
          else if (e.key === "ArrowRight") { e.preventDefault(); setPaused(true); go(cur + 1, true); }
          else if (e.key === "Home") { e.preventDefault(); setPaused(true); go(0); }
          else if (e.key === "End") { e.preventDefault(); setPaused(true); go(total - 1); }
        });

        el.addEventListener("mouseenter", stop);
        el.addEventListener("mouseleave", function () { if (!paused) start(); });
        el.addEventListener("focusin", stop);
        el.addEventListener("focusout", function () { if (!paused) start(); });
        el.addEventListener("touchstart", function () { setPaused(true); }, { passive: true });
        document.addEventListener("visibilitychange", function () {
          if (document.hidden) stop(); else if (!paused) start();
        });

        go(0);
        start();
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
