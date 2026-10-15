/* Silo site — interactions */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("ac-theme"); } catch (e) {}
  var param = null;
  try {
    param = new URLSearchParams(location.search).get("theme");
  } catch (e) {}
  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", param || stored || (prefersLight ? "light" : "dark"));

  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("ac-theme", next); } catch (e) {}
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Active nav link ---------- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var target = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (target === here) a.classList.add("active");
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Copy to clipboard ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;

    var text = btn.getAttribute("data-copy");
    if (!text) {
      var sel = btn.getAttribute("data-copy-target");
      var src = null;
      if (sel) {
        try { src = document.querySelector(sel); } catch (err) { src = null; }
      }
      if (!src) {
        var box = btn.closest(".copybox");
        if (box) src = box.querySelector("span");
      }
      text = src ? src.textContent.trim() : "";
    }
    if (!text) return;
    var done = function () {
      var old = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = old;
        btn.classList.remove("copied");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) {}
      document.body.removeChild(ta);
      done();
    }
  });

  /* ---------- Bootstrap download detection ---------- */
  document.querySelectorAll("[data-os-hint]").forEach(function (el) {
    var ua = navigator.userAgent;
    var os = /Mac/i.test(ua) ? "macOS" : /Linux/i.test(ua) && !/Android/i.test(ua) ? "Linux" : /Windows|Win/i.test(ua) ? "Windows" : null;
    if (os) el.textContent = os;
  });

  /* ---------- Expose theme toggle for header button ---------- */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-theme-toggle]")) toggleTheme();
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Hero: animated card-template preview ---------- */
  var heroScene = document.querySelector(".scene");
  if (heroScene && heroScene.querySelectorAll(".swap").length) {
    var templates = [
      {
        name: "Custom skin",
        tail: "4291",
        bg: "linear-gradient(135deg, rgba(10,132,255,0.9), rgba(94,92,230,0.85) 45%, rgba(255,55,95,0.8))"
      },
      { name: "Sunset", tail: "7730", bg: "linear-gradient(135deg, #ff9f0a, #ff6482 55%, #ff375f)" },
      { name: "Ocean", tail: "1058", bg: "linear-gradient(135deg, #30d158, #0a84ff 60%, #5e5ce6)" },
      { name: "Noir", tail: "0042", bg: "linear-gradient(135deg, #55555b, #2c2c2e 55%, #1c1c1e)" },
      { name: "Grape", tail: "8816", bg: "linear-gradient(135deg, #5e5ce6, #bf5af2 60%, #ff375f)" }
    ];
    var heroCards = heroScene.querySelectorAll(".swap");
    var statusEl = heroScene.querySelector("[data-hero-status]");
    var phoneEl = heroScene.querySelector(".scene__phone");
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ti = 0;

    var applyTemplate = function (t) {
      heroCards.forEach(function (card) {
        var faces = card.querySelectorAll(".cardface");
        if (faces.length < 2) return;
        var showing = card.querySelector(".cardface.on") || faces[0];
        var next = showing === faces[0] ? faces[1] : faces[0];
        next.style.backgroundImage = t.bg;
        next.classList.add("on");
        showing.classList.remove("on");

        var onPhone = !!card.closest(".wallet");
        var num = card.querySelector(".num");
        var lab = card.querySelector(".brandline");
        if (num) {
          num.textContent = onPhone
            ? "\u2022\u2022\u2022\u2022 " + t.tail
            : "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 " + t.tail;
        }
        if (lab) lab.textContent = onPhone ? t.name : "Apple Pay \u00b7 " + t.name;

        card.classList.remove("swapin");
        void card.offsetWidth;
        card.classList.add("swapin");
      });

      if (phoneEl) {
        phoneEl.classList.remove("hit");
        void phoneEl.offsetWidth;
        phoneEl.classList.add("hit");
      }
      if (statusEl) {
        statusEl.innerHTML = '<span class="dot"></span> Applying ' + t.name + "\u2026";
        setTimeout(function () {
          statusEl.innerHTML = '<span class="dot"></span> Synced to iPhone \u00b7 original face backed up';
        }, 950);
      }
    };

    if (!reduced) {
      setInterval(function () {
        ti = (ti + 1) % templates.length;
        applyTemplate(templates[ti]);
      }, 2800);
    }
  }
})();
