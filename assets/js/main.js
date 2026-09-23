/* Ashford Vale | Site behaviour
   1. Mobile navigation (used in narrow desktop windows)
   2. Header shadow and reveal on scroll
   3. Footer year
   4. Enquiry form (validation and submission) */

(function () {
  "use strict";

  /* 1. Mobile navigation */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("open") && !header.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (e) {
    if (e.matches) setMenu(false);
  });

  /* Header shadow once the page scrolls */
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* 2. Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* 3. Enquiry form */
  var form = document.getElementById("lead-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  var fields = Array.prototype.slice.call(form.querySelectorAll("[data-required]"));
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate(el) {
    var ok;
    if (el.type === "checkbox") {
      ok = el.checked;
    } else {
      var v = el.value.trim();
      ok = v.length > 0;
      if (ok && el.type === "email") ok = EMAIL.test(v);
      if (ok && el.name === "message") ok = v.length >= 10;
    }
    el.closest(".field").classList.toggle("invalid", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  fields.forEach(function (el) {
    el.addEventListener("blur", function () {
      if (el.type !== "checkbox" && el.value.trim()) validate(el);
    });
    var evt = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () {
      if (el.closest(".field").classList.contains("invalid")) validate(el);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";

    var invalid = fields.filter(function (el) { return !validate(el); });
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    var endpoint = form.getAttribute("action");
    var submit = form.querySelector('button[type="submit"]');
    var contactContent = window.__ASHFORD_CONTENT__ && window.__ASHFORD_CONTENT__.contact || {};
    var successMessage = contactContent.successMessage || "Thank you. Your enquiry has been sent.";
    var errorMessage = contactContent.errorMessage || "We could not send your enquiry. Please try again or email us directly.";

    if (endpoint.indexOf("YOUR_FORM_ID") !== -1) {
      status.textContent = "Add your Formspree form URL in Admin > URL key and destinations before publishing.";
      return;
    }

    if (endpoint.indexOf("mailto:") === 0) {
      var data = new FormData(form);
      var body = [
        "Name: " + data.get("name"),
        "Email: " + data.get("email"),
        "Phone: " + (data.get("phone") || "Not provided"),
        "Matter: " + data.get("matter"),
        "",
        String(data.get("message"))
      ].join("\n");
      var subject = encodeURIComponent(String(data.get("_subject") || "New enquiry"));
      window.location.href = endpoint + "?subject=" + subject + "&body=" + encodeURIComponent(body);
      form.reset();
      status.textContent = successMessage;
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        status.textContent = successMessage;
      })
      .catch(function () {
        status.textContent = errorMessage;
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = "Send enquiry";
      });
  });
})();
