(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- scroll reveal ---------- */
  var revealEls = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        window.setTimeout(function () { el.classList.add("is-visible"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // safety net: never leave content hidden (e.g. print, thumbnails, very tall elements)
    window.setTimeout(function () { revealEls.forEach(function (el) { el.classList.add("is-visible"); }); }, 4000);
  }

  /* ---------- hero parallax ---------- */
  var heroArt = $("[data-hero-art]");
  if (heroArt && !reduceMotion && window.matchMedia("(hover: hover) and (min-width: 981px)").matches) {
    var raf = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 18;
      ty = (e.clientY / window.innerHeight - 0.5) * 12;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        heroArt.style.transform = "translate(calc(-50% + " + tx.toFixed(1) + "px), calc(-50% + " + ty.toFixed(1) + "px))";
      });
    }, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  var toggle = $("[data-nav-toggle]"), nav = $("[data-nav]");
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });
  }

  /* ---------- pre-flight checklist ---------- */
  var ckList = $("[data-checklist]");
  if (ckList) {
    var items = $$(".ck", ckList);
    var status = $("[data-checklist-status]");
    var runBtn = $("[data-run-checklist]");
    var updateStatus = function () {
      var n = items.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; }).length;
      var done = n === items.length;
      status.textContent = done ? "5 / 5 checked · release cleared" : n + " / 5 checked · tap an item to check it";
      status.classList.toggle("is-done", done);
      if (runBtn) runBtn.querySelector(".txt").textContent = done ? "Reset the checklist" : "Run the checklist";
    };
    items.forEach(function (b) {
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
        updateStatus();
      });
    });
    var timers = [];
    if (runBtn) runBtn.addEventListener("click", function () {
      timers.forEach(clearTimeout); timers = [];
      var allDone = items.every(function (b) { return b.getAttribute("aria-pressed") === "true"; });
      if (allDone) { items.forEach(function (b) { b.setAttribute("aria-pressed", "false"); }); updateStatus(); return; }
      items.forEach(function (b, i) {
        timers.push(setTimeout(function () { b.setAttribute("aria-pressed", "true"); updateStatus(); }, reduceMotion ? 0 : 380 * (i + 1)));
      });
    });
    updateStatus();
  }

  /* ---------- AI quality: release comparison ---------- */
  var AI = {
    v14: {
      reply: "Yes. You can return any item within 30 days of delivery.",
      trust: [
        ["Grounding", false, "Policy says 14 days for opened items. The reply says 30."],
        ["Consistency", false, "Five runs: three said 30 days, two said 14."],
        ["Relevance", true, "Answers the question the customer asked."],
        ["Regression", false, "v1.3 answered this correctly."]
      ],
      sum: "<b>Suite green. Trust checks: 3 of 4 failed.</b> This release tells customers they can return items the policy says they can't."
    },
    v13: {
      reply: "Opened items can be returned within 14 days, so at 20 days this one is outside the window. If it's faulty, I can pass you to our support team.",
      trust: [
        ["Grounding", true, "Matches the opened-item rule and the faulty-item exception."],
        ["Consistency", true, "Five of five runs gave the 14-day answer."],
        ["Relevance", true, "Answers the question and offers the next step."],
        ["Regression", true, "Baseline release."]
      ],
      sum: "<b>Suite green. Trust checks: 4 of 4 passed.</b> The existing test gives v1.3 and v1.4 the same result. Only the trust checks tell them apart."
    }
  };
  var verBtns = $$("[data-ver-btn]");
  function renderAI(key) {
    var v = AI[key]; if (!v) return;
    $("[data-ai-reply]").textContent = v.reply;
    $("[data-ai-trust]").innerHTML = v.trust.map(function (t) {
      return "<li><span>" + t[0] + "</span><span class=\"pill " + (t[1] ? "pass\">✓ PASS" : "fail\">✗ FAIL") + "</span><small>" + t[2] + "</small></li>";
    }).join("");
    $("[data-ai-sum]").innerHTML = v.sum;
    verBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-ver-btn") === key ? "true" : "false"); });
  }
  verBtns.forEach(function (b) { b.addEventListener("click", function () { renderAI(b.getAttribute("data-ver-btn")); }); });
  if ($("[data-ai-reply]")) renderAI("v14");

  /* ---------- release-risk check ---------- */
  var RISK = [
    ["Sign-up, checkout and payment have automated regression tests.", "Automate regression on the flows that earn revenue first."],
    ["Those tests run on every pull request or build.", "Run the suite in CI on every build, not only before big releases."],
    ["Flaky tests are fixed or quarantined within a week.", "Flaky tests teach people to ignore red builds. Fix or quarantine them fast."],
    ["APIs are tested directly, not only through the UI.", "Test APIs directly. UI tests hide where a failure started."],
    ["Critical actions are confirmed in the database, not just on screen.", "Check orders and payments in the database, not just on screen."],
    ["Every bug fix ships with a test that would have caught it.", "Make every fix ship with a regression test."],
    ["AI features are tested for grounding and consistency (or you don't ship any).", "Test AI answers for grounding and consistency, not just for a response."],
    ["One named person makes the go/no-go call, with evidence.", "Give the release decision an owner and an evidence pack."]
  ];
  var answers = [1, 1, 0, 0, 1, 0, 0, 0]; // example answers shown on first load
  var riskList = $("[data-risk-list]");
  function renderRisk() {
    var score = answers.reduce(function (a, b) { return a + b; }, 0);
    $("[data-risk-score]").textContent = String(score);
    $("[data-risk-needle]").style.left = ((score + 0.5) / 9 * 100).toFixed(2) + "%";
    var verdict = score <= 3 ? "Grounded. Failures will reach users before you see them."
      : score <= 6 ? "Holding pattern. The basics are there, but gaps let defects through."
      : "Cleared for takeoff. Keep it that way as the product changes.";
    $("[data-risk-verdict]").textContent = verdict;
    var gaps = [];
    answers.forEach(function (a, i) { if (!a && gaps.length < 3) gaps.push(RISK[i][1]); });
    if (!gaps.length) gaps.push("No gaps flagged. A review can confirm the controls hold on a real release.");
    $("[data-risk-gaps]").innerHTML = gaps.map(function (g) { return "<li>" + g + "</li>"; }).join("");
    var body = "Pre-flight check result: " + score + "/8 (" + verdict.split(".")[0] + ")\n\n" +
      RISK.map(function (r, i) { return (answers[i] ? "[yes] " : "[no]  ") + r[0]; }).join("\n") +
      "\n\nWhat we're shipping next:\n";
    var mail = $("[data-risk-mail]");
    if (mail) mail.href = "mailto:justin_m01@outlook.com?subject=" + encodeURIComponent("Pre-flight check: " + score + "/8") + "&body=" + encodeURIComponent(body);
  }
  if (riskList) {
    riskList.innerHTML = RISK.map(function (r, i) {
      return "<div class=\"rq\"><span id=\"rq-" + i + "\">" + r[0] + "</span>" +
        "<span class=\"yn\" role=\"group\" aria-labelledby=\"rq-" + i + "\">" +
        "<button type=\"button\" id=\"rq-" + i + "-y\" data-q=\"" + i + "\" data-v=\"1\">Yes</button>" +
        "<button type=\"button\" id=\"rq-" + i + "-n\" data-q=\"" + i + "\" data-v=\"0\">No</button></span></div>";
    }).join("");
    function syncButtons() {
      $$("button[data-q]", riskList).forEach(function (b) {
        b.setAttribute("aria-pressed", String(answers[+b.getAttribute("data-q")] === +b.getAttribute("data-v")));
      });
    }
    riskList.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-q]"); if (!b) return;
      answers[+b.getAttribute("data-q")] = +b.getAttribute("data-v");
      syncButtons(); renderRisk();
    });
    syncButtons(); renderRisk();
  }

  /* ---------- copy email ---------- */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1800); };
      var fallback = function () {
        var code = btn.previousElementSibling;
        var r = document.createRange(); r.selectNodeContents(code);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = "Selected";
        setTimeout(function () { btn.textContent = "Copy"; }, 1800);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
      } catch (e) { fallback(); }
    });
  });

  /* ---------- mobile action bar ---------- */
  var bar = $("[data-actionbar]");
  var hero = $(".hero"), contact = $("#contact");
  if (bar && hero && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var update = function () { bar.classList.toggle("show", !heroVisible && !contactVisible); };
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; update(); }).observe(hero);
    if (contact) new IntersectionObserver(function (es) { contactVisible = es[0].isIntersecting; update(); }).observe(contact);
  }

  /* ---------- Calendly popup, lazy-loaded on click ---------- */
  var calLoaded = false, calLoading = false, calPending = [];
  function loadCalendly(onReady, onError) {
    if (calLoaded) { onReady(); return; }
    calPending.push({ ready: onReady, error: onError });
    if (calLoading) return;
    calLoading = true;
    var css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js"; s.async = true;
    var timer = setTimeout(function () { s.onerror(); }, 6000);
    s.onload = function () {
      clearTimeout(timer); calLoaded = true; calLoading = false;
      calPending.forEach(function (p) { p.ready(); }); calPending = [];
    };
    s.onerror = function () {
      clearTimeout(timer); if (calLoaded) return; calLoading = false;
      calPending.forEach(function (p) { p.error(); }); calPending = [];
    };
    document.body.appendChild(s);
  }
  $$("[data-calendly-popup]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let people open in a new tab
      var url = a.getAttribute("data-calendly-popup");
      e.preventDefault();
      loadCalendly(function () {
        if (window.Calendly && window.Calendly.initPopupWidget) window.Calendly.initPopupWidget({ url: url });
        else window.location.href = url;
      }, function () { window.location.href = url; });
    });
  });
})();
