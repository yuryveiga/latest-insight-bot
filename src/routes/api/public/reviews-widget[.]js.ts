/**
 * WIDGET DE AVALIAÇÕES DO GOOGLE — guia de uso para o dono do site
 * ---------------------------------------------------------------
 * Embed (cole onde as reviews devem aparecer):
 *
 *   <div data-google-reviews data-limit="15">
 *     <!-- conteúdo aqui dentro = fallback: fica visível se a API falhar -->
 *   </div>
 *   <script async src="https://latest-insight-bot.lovable.app/api/public/reviews-widget.js"></script>
 *
 * ATRIBUTOS (todos opcionais, no <div data-google-reviews ...>)
 *
 *  Conteúdo
 *   data-limit="15"          Nº máximo de avaliações carregadas (padrão 15).
 *   data-per-page="3"        Quantas por slide no desktop (1 mobile / 2 tablet). Máx 6.
 *   data-fallback="false"    Desliga o fallback (não restaura o HTML original em caso de erro).
 *
 *  Autoplay
 *   data-autoplay="false"    Desliga a rotação automática.
 *   data-interval="6000"     Intervalo em ms entre slides (mínimo 2000).
 *                            Pausa sozinho no hover, foco, toque e aba oculta.
 *
 *  Controles / layout
 *   data-preset="clean"      Visual minimalista: setas sobre as bordas, sem bolinhas,
 *                            sem botão play/pause e sem botão "Ver todas as avaliações".
 *   data-arrows="edges"      Setas flutuando nas bordas do carrossel.
 *   data-arrows="below"      Setas abaixo do carrossel (padrão).
 *   data-arrows="false"      Sem setas.
 *   data-dots="false"        Esconde as bolinhas indicadoras.
 *   data-play-button="false" Esconde o botão de pausar/retomar (autoplay continua).
 *   data-show-all="false"    Esconde o botão "Ver todas as avaliações".
 *
 *  Aparência
 *   data-avatar="false"      Remove o círculo com a inicial do autor.
 *   data-star-color="#84cc16"    Cor das estrelas.
 *   data-card-bg="#ffffff"       Fundo do card.
 *   data-card-border="#e5e7eb"   Cor da borda do card.
 *   data-radius="16px"           Arredondamento do card.
 *   data-avatar-bg="#f3f4f6"     Fundo do avatar.
 *
 *   Fonte e cor do texto são herdadas do site (font:inherit / color:inherit).
 *   Para ajustes finos, sobrescreva no CSS do site as classes:
 *   .gr-card .gr-author .gr-time .gr-text .gr-stars .gr-btn .gr-dot .gr-more
 *
 * EXEMPLO "idêntico ao layout do site" (clean, setas nas bordas):
 *   <div data-google-reviews data-preset="clean" data-star-color="#84cc16"
 *        data-card-bg="#ffffff" data-card-border="#e5e7eb" data-radius="16px"></div>
 *
 * OBS: as avaliações são atualizadas automaticamente nos dias 1 e 15 de cada mês.
 */
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

  var DTF = null;
  try { DTF = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }); } catch (e) {}
  function fmtDate(r) {
    if (r.published_at) {
      var d = new Date(r.published_at);
      if (!isNaN(d.getTime())) return DTF ? DTF.format(d) : d.toLocaleDateString();
    }
    return r.relative_time || "";
  }

  var showAvatar = true;
  function initial(n) { return (String(n || "?").trim()[0] || "?").toUpperCase(); }

  function card(r) {
    var label = "Avaliação de " + (r.author || "visitante") +
      (r.rating != null ? ", " + Math.round(r.rating) + " de 5 estrelas" : "") +
      " — abrir no Google em nova aba";
    return '<li class="gr-item"><a class="gr-card" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(label) + '">' +
      '<div class="gr-head">' +
      (showAvatar ? '<span class="gr-avatar" aria-hidden="true">' + esc(initial(r.author)) + "</span>" : "") +
      '<div class="gr-who"><p class="gr-author">' + esc(r.author) + "</p>" +
      '<span class="gr-time">' + esc(fmtDate(r)) + "</span></div></div>" +
      (r.rating != null ? stars(r.rating) : "") +
      (r.review_text ? '<p class="gr-text">' + esc(clamp(r.review_text, 30)) + "</p>" : "") +
      "</a></li>";
  }

  var css = ""
    + ".gr-widget{font:inherit;color:inherit;--gr-star:#f5b301;--gr-card-bg:rgba(255,255,255,.03);--gr-card-border:rgba(0,0,0,.12);--gr-radius:12px;--gr-avatar-bg:rgba(0,0,0,.06)}"
    + ".gr-carousel{position:relative;overflow:hidden}"
    + ".gr-track{display:flex;transition:transform .4s ease;margin:0;padding:0;list-style:none}"
    + ".gr-slide{flex:0 0 100%;display:grid;gap:16px;list-style:none;margin:0;padding:2px}"
    + "@media(min-width:640px){.gr-slide{grid-template-columns:repeat(2,1fr)}}"
    + "@media(min-width:1024px){.gr-slide{grid-template-columns:repeat(3,1fr)}}"
    + ".gr-item{list-style:none;margin:0;padding:0;display:flex}"
    + ".gr-card{display:block;width:100%;text-decoration:none;color:inherit;border:1px solid var(--gr-card-border);border-radius:var(--gr-radius);padding:18px;background:var(--gr-card-bg);transition:border-color .2s,transform .2s}"
    + ".gr-card:hover{border-color:currentColor;transform:translateY(-2px)}"
    + ".gr-widget :focus-visible{outline:3px solid currentColor;outline-offset:3px;border-radius:12px}"
    + ".gr-head{display:flex;gap:12px;align-items:center}"
    + ".gr-who{display:flex;flex-direction:column;gap:2px;min-width:0}"
    + ".gr-avatar{flex:0 0 auto;width:40px;height:40px;border-radius:50%;background:var(--gr-avatar-bg);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem}"
    + ".gr-author{font-weight:700;margin:0;font-size:1rem}"
    + ".gr-time{font-size:.8rem;opacity:.65}"
    + ".gr-stars{letter-spacing:2px;font-size:.95rem}"
    + ".gr-stars{display:block;margin-top:12px}"
    + ".gr-stars-on{color:var(--gr-star)}.gr-stars-off{opacity:.25}"
    + ".gr-text{margin:10px 0 0;font-size:.925rem;line-height:1.6;opacity:.85;white-space:pre-line}"
    + ".gr-stage{position:relative}"
    + ".gr-arrow-edge{position:absolute;top:50%;transform:translateY(-50%);z-index:2;background:var(--gr-card-bg,#fff);box-shadow:0 2px 10px rgba(0,0,0,.12);border-color:transparent}"
    + ".gr-arrow-edge.gr-prev{left:-22px}.gr-arrow-edge.gr-next{right:-22px}"
    + "@media(max-width:1100px){.gr-arrow-edge.gr-prev{left:2px}.gr-arrow-edge.gr-next{right:2px}}"
    + ".gr-nav:empty{display:none}"
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
    + ".gr-skel-card{border:1px solid var(--gr-card-border);border-radius:var(--gr-radius);background:var(--gr-card-bg);padding:18px;min-height:var(--gr-card-h,196px)}"
    + ".gr-line{height:12px;border-radius:6px;background:currentColor;opacity:.12;margin-bottom:10px;animation:gr-pulse 1.4s ease-in-out infinite}"
    + "@keyframes gr-pulse{0%,100%{opacity:.10}50%{opacity:.2}}"
    + "@media(prefers-reduced-motion:reduce){.gr-track{transition:none}.gr-card:hover{transform:none}.gr-line{animation:none}}";

  function mount(el) {
    var limit = parseInt(el.getAttribute("data-limit") || "15", 10);
    var perPage = parseInt(el.getAttribute("data-per-page") || "3", 10);
    var autoplay = el.getAttribute("data-autoplay") !== "false";
    var preset = (el.getAttribute("data-preset") || "").toLowerCase();
    var clean = preset === "clean";
    var showAll = el.getAttribute("data-show-all") !== "false" && !(clean && el.getAttribute("data-show-all") === null);
    var arrows = el.getAttribute("data-arrows") || (clean ? "edges" : "below");
    var showDots = el.getAttribute("data-dots") !== "false" && !(clean && el.getAttribute("data-dots") === null);
    var showPlay = el.getAttribute("data-play-button") !== "false" && !(clean && el.getAttribute("data-play-button") === null);
    var interval = Math.max(2000, parseInt(el.getAttribute("data-interval") || "6000", 10));
    perPage = Math.max(1, Math.min(6, perPage));
    var id = "gr" + ++uid;

    el.classList.add("gr-widget");
    showAvatar = el.getAttribute("data-avatar") !== "false";
    var vars = { "data-star-color": "--gr-star", "data-card-bg": "--gr-card-bg", "data-card-border": "--gr-card-border", "data-radius": "--gr-radius", "data-avatar-bg": "--gr-avatar-bg" };
    Object.keys(vars).forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) el.style.setProperty(vars[a], v);
    });
    el.style.minHeight = el.style.minHeight || "";
    var fallbackHTML = el.getAttribute("data-fallback") === "false" ? "" : el.innerHTML;
    function useFallback() {
      el.classList.remove("gr-widget");
      el.innerHTML = fallbackHTML;
    }
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
        if (!items.length) { useFallback(); return; }
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

        function arrowBtn(kind) {
          var edge = arrows === "edges" ? " gr-arrow-edge" : "";
          return '<button type="button" class="gr-btn gr-' + kind + edge + '" aria-label="' +
            (kind === "prev" ? "Avaliações anteriores" : "Próximas avaliações") +
            '" aria-controls="' + id + '-track"><span aria-hidden="true">' +
            (kind === "prev" ? "\\u2039" : "\\u203a") + "</span></button>";
        }

        el.innerHTML = "<style>" + css + "</style>" +
          '<section class="gr-region" role="region" aria-roledescription="carrossel" aria-label="Avaliações do Google" tabindex="0">' +
          '<p class="gr-sr">Use as setas do teclado para navegar entre as avaliações.</p>' +
          '<div class="gr-stage">' +
          '<div class="gr-carousel">' +
          '<ul class="gr-track" id="' + id + '-track" aria-live="polite">' +
          slides.map(function (s, idx) {
            return '<li class="gr-slide" role="group" aria-roledescription="slide" aria-label="Grupo ' + (idx + 1) + ' de ' + total + '">' +
              "<ul style=\\"display:contents;list-style:none;margin:0;padding:0\\">" + s.map(card).join("") + "</ul></li>";
          }).join("") +
          "</div>" +
          (arrows === "edges" ? arrowBtn("prev") + arrowBtn("next") : "") +
          "</div>" +
          '<div class="gr-nav">' +
            (arrows === "below" ? arrowBtn("prev") : "") +
            (showDots ? '<div class="gr-dots">' + dots + "</div>" : "") +
            (arrows === "below" ? arrowBtn("next") : "") +
            (showPlay && autoplay && total > 1 ? '<button type="button" class="gr-btn gr-play" aria-label="Pausar rotação automática"><span aria-hidden="true">\\u23F8</span></button>' : "") +
          "</div>" +
          (showAll ? '<div class="gr-more-wrap"><a class="gr-more" href="' + GOOGLE_URL + '" target="_blank" rel="noopener noreferrer">Ver todas as avaliações<span class="gr-sr"> no Google (abre em nova aba)</span></a></div>' : "") +
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

        if (prev) prev.addEventListener("click", function () { setPaused(true); go(cur - 1, true); });
        if (next) next.addEventListener("click", function () { setPaused(true); go(cur + 1, true); });
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
      .catch(function () { useFallback(); });
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
