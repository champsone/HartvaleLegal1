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
    toggle.textContent = open ? "✕ Close" : "☰ Menu";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) { if (nav.classList.contains("open") && !header.contains(e.target)) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });
    window.matchMedia("(min-width: 761px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
  }

  /* Highlight the nav link for the section in view */
  if (nav && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute("href").slice(1); var el = id ? document.getElementById(id) : document.body; if (el) map[id || "top"] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var a = map[en.target.id || "top"]; if (a) a.classList.add("active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["services", "about", "people", "insights", "contact"].forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
    var hero = document.querySelector(".hero"); if (hero) { hero.id = hero.id || "hero"; map.hero = map.top; spy.observe(hero); }
  }

  /* Enquiry form */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var notice = document.getElementById("form-notice");
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function content() { return (window.__NORTHMERE_CONTENT__ && window.__NORTHMERE_CONTENT__.contact) || {}; }
  function say(msg) { notice.textContent = msg; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form), c = content();
    var name = String(d.get("name") || "").trim(), email = String(d.get("email") || "").trim(), message = String(d.get("message") || "").trim();
    if (!name) { say("Please enter your name."); form.elements.name.focus(); return; }
    if (!EMAIL.test(email)) { say("Please enter a valid email address."); form.elements.email.focus(); return; }
    if (message.length < 10) { say("Please add a short summary of how we can help."); form.elements.message.focus(); return; }

    var action = String(c.formAction || "").trim();
    var subject = c.formSubject || "New enquiry via website";
    var btn = form.querySelector("button[type=submit]");

    if (/^https:\/\//i.test(action)) {
      btn.disabled = true;
      d.append("_subject", subject);
      fetch(action, { method: "POST", body: d, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error("failed"); form.reset(); say(c.successMessage || "Thank you. Your enquiry has been sent."); })
        .catch(function () { say(c.errorMessage || "We could not send your enquiry just now. Please try again later."); })
        .then(function () { btn.disabled = false; });
      return;
    }

    var recipient = String(c.email || "").trim();
    if (!EMAIL.test(recipient)) { say("This form is not connected yet. Please use the contact details on this page."); return; }
    var body = ["Name: " + name, "Email: " + email, "Phone: " + (String(d.get("phone") || "").trim() || "Not provided"), "Practice area: " + (d.get("matter") || "Not specified"), "", message].join("\n");
    window.location.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    say(c.successMessage || "Your email application should open with the enquiry prepared.");
  });
})();
