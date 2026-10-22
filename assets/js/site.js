/* NorthmereLegal | Site behaviour: mobile menu, active-section highlight, enquiry form. */
(function () {
  "use strict";

  /* Mobile menu */
  var header = document.querySelector(".topbar");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("navlinks");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    var ui = (window.__NORTHMERE_CONTENT__ && window.__NORTHMERE_CONTENT__.ui) || {};
    toggle.textContent = open ? (ui.menuClose || "✕ Close") : (ui.menuOpen || "☰ Menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) { if (nav.classList.contains("open") && !header.contains(e.target)) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });
    window.matchMedia("(min-width: 761px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
  }

  /* Highlight the nav link for the section in view. Links are looked up at the moment a
     section scrolls into view, so they keep working after the header is re-rendered from
     live content. */
  if (nav && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = (en.target.id === "hero" || !en.target.id) ? "top" : en.target.id;
        var links = nav.querySelectorAll("a:not(.btn)");
        var match = null;
        links.forEach(function (a) { a.classList.remove("active"); if (a.getAttribute("href") === "#" + id) match = a; });
        if (match) match.classList.add("active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["hero", "services", "clients", "about", "people", "insights", "contact"].forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* Enquiry form (submits to Formspree) */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var btn = form.querySelector("button[type=submit]");
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function content() { return (window.__NORTHMERE_CONTENT__ && window.__NORTHMERE_CONTENT__.contact) || {}; }
  function say(msg, kind) {
    status.hidden = !msg;
    status.textContent = msg || "";
    status.className = "form-status" + (kind ? " is-" + kind : "");
  }
  function mark(el, bad) {
    el.setAttribute("aria-invalid", bad ? "true" : "false");
    var f = el.closest(".field"); if (f) f.classList.toggle("has-error", !!bad);
  }
  function fail(el, msg) { mark(el, true); say(msg, "error"); el.focus(); }
  Array.prototype.forEach.call(form.elements, function (el) {
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") mark(el, false); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var c = content(), E = c.errors || {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name) mark(el, false); });
    say("");
    var el = form.elements;
    var name = el.name.value.trim(), email = el.email.value.trim(), message = el.message.value.trim();
    if (!name) return fail(el.name, E.name || "Please enter your name.");
    if (!EMAIL.test(email)) return fail(el.email, E.email || "Please enter a valid email address.");
    if (message.length < 10) return fail(el.message, E.message || "Please add a short summary of how we can help.");
    if (el.consent && !el.consent.checked) return fail(el.consent, "Please confirm that we may use your details to respond to your enquiry.");
    if (el._gotcha && el._gotcha.value) { form.reset(); say(c.successMessage || "Thank you. Your enquiry has been received.", "success"); return; }

    var action = String(c.formAction || "").trim();
    if (!/^https:\/\//i.test(action)) action = form.getAttribute("action");
    var data = new FormData(form);
    data.append("_subject", (c.formSubject || "New enquiry via website") + " - " + name);
    var label = btn.textContent;
    btn.disabled = true; btn.setAttribute("aria-busy", "true"); btn.textContent = "Sending…";
    say("Sending your enquiry…", "info");

    fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw j; }); })
      .then(function () {
        form.reset();
        say(c.successMessage || "Thank you. Your enquiry has been received and a member of our team will be in touch shortly.", "success");
        status.setAttribute("tabindex", "-1"); status.focus();
      })
      .catch(function () {
        var fb = String(c.email || "").trim();
        say((c.errorMessage || "We could not send your enquiry just now. Please try again shortly") + (EMAIL.test(fb) ? ", or email us directly at " + fb + "." : "."), "error");
      })
      .then(function () { btn.disabled = false; btn.removeAttribute("aria-busy"); btn.textContent = label; });
  });
})();
