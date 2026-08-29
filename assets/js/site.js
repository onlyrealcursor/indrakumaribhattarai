/* Indra Kumari Bhattarai — portfolio
   ---------------------------------------------------------------------------
   Everything here is an enhancement. With scripting off the page is complete:
   every word is visible and nothing is animated. Nothing below may ever be
   load-bearing for content.

   1. reveal   — blocks rise into place as they arrive
   2. kit      — four brand-colour palettes
   3. counters — honest numbers, counted up once
   4. light    — a pointer-tracked highlight on the work plates
   ------------------------------------------------------------------------- */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  /* ── 1 · REVEAL ──────────────────────────────────────────────────────────
     Deliberately not IntersectionObserver. During fast scrolling the observer
     can skip elements, and a skipped element here would stay invisible for
     good. A rAF-throttled sweep cannot miss: every pending element is re-tested
     on every frame that scrolls, and drops out of the list once it is shown. */
  (function reveal() {
    if (!root.classList.contains("reveal-ready")) return;

    var pending = [].slice.call(document.querySelectorAll(".reveal, .rise, .lag"));
    if (!pending.length) return;

    var ticking = false;

    function sweep() {
      ticking = false;
      var vh = window.innerHeight || root.clientHeight;
      var still = [];

      for (var i = 0; i < pending.length; i++) {
        var el = pending[i];
        var r = el.getBoundingClientRect();
        // Reveal a little before it arrives; anything already scrolled well
        // past must be shown outright rather than left waiting.
        if (r.top < vh * 1.05 && r.bottom > -vh * 0.5) el.classList.add("is-in");
        else if (r.bottom <= -vh * 0.5) el.classList.add("is-in");
        else still.push(el);
      }

      pending = still;
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sweep);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    sweep();
    // Fonts and images landing can move things; re-test after both.
    window.addEventListener("load", sweep);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sweep).catch(function () {});
  })();

  /* ── 2 · KIT ──────────────────────────────────────────────────────────────
     The stored value is a preference, not a tracker: one word, on this device,
     never sent anywhere. The privacy policy says exactly that.

     The controls are native radios, so grouping, arrow-key navigation and
     announcement all come from the platform. They are hidden until this file
     runs, because a control that cannot do anything is worse than none.     */
  var KITS = ["ember", "crimson", "deepsea", "violet"];

  function store(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) {}
  }

  function setKit(kit) {
    if (KITS.indexOf(kit) < 0) return;
    root.setAttribute("data-kit", kit);
    store("ib-kit", kit);
    sync();
  }

  /* Keep every kit control on the page showing the truth. */
  function sync() {
    var kit = root.getAttribute("data-kit") || "ember";
    var i, els = document.querySelectorAll("[data-kit-set]");
    for (i = 0; i < els.length; i++) els[i].checked = els[i].getAttribute("data-kit-set") === kit;
  }

  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (!t || !t.getAttribute) return;
    if (t.hasAttribute("data-kit-set")) setKit(t.getAttribute("data-kit-set"));
  });

  sync();

  /* Arm the palette transition only after the first paint, so applying a
     stored kit never animates from the wrong colours on load. */
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () { root.classList.add("theme-live"); });
  });

  /* ── 3 · COUNTERS ────────────────────────────────────────────────────────
     Every figure counted here is stated in the markup and true of the work
     itself. The animation only reveals a number that is already there.     */
  (function counters() {
    var els = [].slice.call(document.querySelectorAll("[data-count]"));
    if (!els.length || reduced || !window.requestAnimationFrame) return;

    var pending = els.slice(), ticking = false;

    function run(el) {
      var to = parseFloat(el.getAttribute("data-count"));
      if (!isFinite(to)) return;
      var dur = 900, t0 = 0;
      function frame(now) {
        if (!t0) t0 = now;
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 4);           // easeOutQuart
        el.textContent = String(Math.round(to * eased));
        if (p < 1) window.requestAnimationFrame(frame);
        else el.textContent = String(to);
      }
      window.requestAnimationFrame(frame);
    }

    function sweep() {
      ticking = false;
      var vh = window.innerHeight || root.clientHeight, still = [];
      for (var i = 0; i < pending.length; i++) {
        var el = pending[i], r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) run(el);
        else still.push(el);
      }
      pending = still;
      if (!pending.length) window.removeEventListener("scroll", onS);
    }
    function onS() { if (ticking) return; ticking = true; window.requestAnimationFrame(sweep); }
    window.addEventListener("scroll", onS, { passive: true });
    sweep();
  })();

  /* ── 4 · POINTER LIGHT ───────────────────────────────────────────────────
     A soft highlight that follows the pointer across the large plates. Fine
     pointers only — on touch there is no hover to track, and the listener
     would cost battery for nothing.                                        */
  (function pointerLight() {
    if (reduced) return;
    var fine = false;
    try { fine = matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (e) {}
    if (!fine) return;

    var plates = document.querySelectorAll(".lit");
    for (var i = 0; i < plates.length; i++) {
      (function (el) {
        el.addEventListener("pointermove", function (ev) {
          var r = el.getBoundingClientRect();
          el.style.setProperty("--mx", ((ev.clientX - r.left) / r.width * 100).toFixed(2) + "%");
          el.style.setProperty("--my", ((ev.clientY - r.top) / r.height * 100).toFixed(2) + "%");
        }, { passive: true });
      })(plates[i]);
    }
  })();
})();
