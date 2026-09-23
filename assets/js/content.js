/* HartvaleLegal | Homepage content renderer */
(function () {
  "use strict";

  var defaults = window.DEFAULT_SITE_CONTENT;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function merge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) ? override : base;
    if (!base || typeof base !== "object") return override == null ? base : override;
    Object.keys(override || {}).forEach(function (key) { base[key] = key in base ? merge(base[key], override[key]) : override[key]; });
    return base;
  }
  // Ask Supabase for the live content. Returns null (rather than throwing)
  // if Supabase isn't configured yet, or the request fails for any reason --
  // callers should keep showing the repository defaults in that case.
  async function fetchLiveContent() {
    var client = typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!client) return null;
    try {
      var result = await client.from("site_content").select("data").eq("id", 1).single();
      if (result.error || !result.data || !result.data.data) return null;
      var live = result.data.data;
      if (!live || typeof live !== "object" || Object.keys(live).length === 0) return null;
      return merge(clone(defaults), live);
    } catch (error) { return null; }
  }
  function text(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value == null ? "" : value;
  }
  function textIn(root, selector, value) {
    var el = root.querySelector(selector);
    if (el) el.textContent = value == null ? "" : value;
  }
  function textAll(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) { el.textContent = value == null ? "" : value; });
  }
  function safeUrl(value, fallback) {
    var url = String(value || "").trim();
    if (/^(javascript|data|vbscript):/i.test(url)) return fallback || "#";
    if (/^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(url)) return url;
    return fallback || "#";
  }
  function href(selector, value, fallback) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute("href", safeUrl(value, fallback));
  }
  function image(selector, value, alt) {
    var el = document.querySelector(selector);
    if (!el) return;
    var source = safeUrl(value, el.getAttribute("src"));
    el.setAttribute("src", source);
    el.setAttribute("alt", alt || "");
  }
  function imageIn(root, selector, value, alt) {
    var el = root.querySelector(selector);
    if (!el) return;
    el.setAttribute("src", safeUrl(value, el.getAttribute("src")));
    el.setAttribute("alt", alt || "");
  }
  function lines(value) { return String(value || "").split(/\n/); }
  function multiline(el, value) {
    if (!el) return;
    el.replaceChildren();
    lines(value).forEach(function (line, index) {
      if (index) el.appendChild(document.createElement("br"));
      el.appendChild(document.createTextNode(line));
    });
  }
  function mail(value) { return "mailto:" + String(value || "").trim(); }
  function contactHref(value) {
    var raw = String(value || "").trim();
    return /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(raw) ? safeUrl(raw) : mail(raw);
  }
  function tel(value) {
    var number = String(value || "").replace(/[^\d+]/g, "");
    return number ? "tel:" + number : "#";
  }
  function brand(name, descriptor, mark) {
    textAll(".brand .mark", mark);
    document.querySelectorAll(".brand .wordmark").forEach(function (el) {
      if (el.firstChild) el.firstChild.nodeValue = name;
      var small = el.querySelector("small");
      if (small) small.textContent = descriptor;
    });
  }

  function applyContent(content) {
  document.title = content.meta.title;
  var descriptionMeta = document.querySelector('meta[name="description"]');
  var ogTitleMeta = document.querySelector('meta[property="og:title"]');
  var ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", content.meta.description);
  if (ogTitleMeta) ogTitleMeta.setAttribute("content", content.meta.ogTitle);
  if (ogDescriptionMeta) ogDescriptionMeta.setAttribute("content", content.meta.ogDescription);

  brand(content.brand.name, content.brand.descriptor, content.brand.mark);
  text(".tl-left", content.header.strapline);
  text(".topline a", content.header.phoneDisplay);
  href(".topline a", content.header.phoneHref);
  var navLinks = document.querySelectorAll(".navlinks > a");
  if (navLinks[0]) { navLinks[0].textContent = content.header.nav.work; navLinks[0].href = safeUrl(content.header.nav.workUrl, "#practice"); }
  if (navLinks[1]) { navLinks[1].textContent = content.header.nav.clients; navLinks[1].href = safeUrl(content.header.nav.clientsUrl, "#clients"); }
  if (navLinks[2]) { navLinks[2].textContent = content.header.nav.people; navLinks[2].href = safeUrl(content.header.nav.peopleUrl, "#people"); }
  if (navLinks[3]) { navLinks[3].textContent = content.header.nav.cta; navLinks[3].href = safeUrl(content.header.nav.ctaUrl, "#contact"); }

  text("#hero-title", content.hero.title);
  text(".hero .lede", content.hero.lede);
  var heroButtons = document.querySelectorAll(".hero-actions a");
  if (heroButtons[0]) { heroButtons[0].textContent = content.hero.primaryLabel; heroButtons[0].setAttribute("href", safeUrl(content.hero.primaryUrl)); }
  if (heroButtons[1]) { heroButtons[1].textContent = content.hero.secondaryLabel; heroButtons[1].setAttribute("href", safeUrl(content.hero.secondaryUrl)); }
  image(".hero-media img", content.hero.imageUrl, content.hero.imageAlt);
  text(".hero-media figcaption", content.hero.caption);

  document.querySelectorAll(".trust li").forEach(function (el, index) {
    var item = content.trust[index];
    if (!item) return;
    textIn(el, "strong", item.title);
    var detail = el.querySelector("[data-trust-detail]");
    if (detail) detail.textContent = item.detail;
  });

  document.querySelectorAll(".practice").forEach(function (el, index) {
    var item = content.practice[index];
    if (!item) return;
    textIn(el, "h3", item.title);
    textIn(el, "p", item.description);
    el.querySelectorAll("li").forEach(function (li, itemIndex) { li.textContent = item.items[itemIndex] || ""; });
    var link = el.querySelector(".textlink");
    if (link) { link.textContent = item.linkLabel; link.setAttribute("href", safeUrl(item.linkUrl)); }
  });

  text(".clients .section-head h2", content.clients.title);
  text(".clients .section-head p", content.clients.intro);
  var leadQuote = document.querySelector(".lead-quote");
  if (leadQuote) {
    textIn(leadQuote, "blockquote p", content.clients.leadQuote);
    var leadCaption = leadQuote.querySelector("figcaption");
    if (leadCaption) {
      leadCaption.replaceChildren();
      var leadStrong = document.createElement("strong");
      leadStrong.textContent = content.clients.leadAttribution;
      leadCaption.append(leadStrong, document.createTextNode(content.clients.leadDetail));
    }
  }
  document.querySelectorAll(".quotes-grid figure").forEach(function (el, index) {
    var item = content.clients.quotes[index];
    if (!item) return;
    textIn(el, "blockquote p", item.quote);
    var caption = el.querySelector("figcaption");
    textIn(el, "figcaption strong", item.attribution);
    if (caption) caption.lastChild.nodeValue = item.detail;
  });
  text(".fine-print", content.clients.finePrint);

  text(".people .section-head h2", content.people.title);
  text(".people .section-head p", content.people.intro);
  var lead = content.people.lead;
  text(".lead-copy h3", lead.name); text(".lead-copy .role", lead.role); text(".lead-copy .bio", lead.bio);
  var factValues = document.querySelectorAll(".facts dd");
  if (factValues[0]) factValues[0].textContent = lead.focus;
  if (factValues[1]) factValues[1].textContent = lead.based;
  image(".lead-portrait img", lead.imageUrl, lead.imageAlt);
  var leadButton = document.querySelector(".lead-copy .btn");
  if (leadButton) { leadButton.textContent = lead.buttonLabel; leadButton.setAttribute("href", contactHref(lead.email)); }
  text(".standard blockquote p", lead.quote); text(".standard figcaption", lead.quoteAttribution);
  document.querySelectorAll(".roster li").forEach(function (el, index) {
    var person = content.people.partners[index];
    if (!person) return;
    textIn(el, "strong", person.name); textIn(el, "span", person.focus);
    var email = el.querySelector("a");
    if (email) { email.textContent = "Contact"; email.setAttribute("href", contactHref(person.email)); }
    imageIn(el, "img", person.imageUrl, person.imageAlt);
  });

  text(".contact h2", content.contact.title); text(".contact-lede", content.contact.lede);
  var detailBlocks = document.querySelectorAll(".details > div");
  if (detailBlocks[0]) multiline(detailBlocks[0].querySelector("dd"), content.contact.london);
  if (detailBlocks[1]) {
    var direct = detailBlocks[1].querySelector("dd");
    if (direct) { direct.replaceChildren(); var email = document.createElement("a"); email.href = safeUrl(content.contact.emailHref, mail(content.contact.email)); email.textContent = content.contact.email; var br = document.createElement("br"); var phone = document.createElement("a"); phone.href = safeUrl(content.contact.phoneHref, tel(content.contact.phone)); phone.textContent = content.contact.phone; direct.append(email, br, phone); }
  }
  if (detailBlocks[2]) multiline(detailBlocks[2].querySelector("dd"), content.contact.otherOffices);
  if (detailBlocks[3]) multiline(detailBlocks[3].querySelector("dd"), content.contact.availability);
  var form = document.getElementById("lead-form");
  if (form) { form.action = safeUrl(content.contact.formAction, form.action); var subject = form.querySelector('[name="_subject"]'); if (subject) subject.value = content.contact.formSubject; }
  var privacy = document.querySelector(".consent a");
  if (privacy) { privacy.textContent = content.contact.privacyLabel; privacy.href = safeUrl(content.contact.privacyUrl); }

  text(".reg", content.footer.legal);
  var copyright = document.querySelector(".footer-bottom > span");
  if (copyright) copyright.lastChild.nodeValue = " " + content.footer.copyright;
  var legalLinks = document.querySelectorAll(".footer-bottom nav a");
  if (legalLinks[0]) legalLinks[0].href = safeUrl(content.footer.privacyUrl);
  if (legalLinks[1]) legalLinks[1].href = safeUrl(content.footer.complaintsUrl);
  if (legalLinks[2]) legalLinks[2].href = safeUrl(content.footer.accessibilityUrl);

  window.__HARTVALE_CONTENT__ = content;
  window.dispatchEvent(new CustomEvent("hartvalelegal:content-ready"));
  }

  async function init() {
    // Paint the repository defaults straight away so the page is never blank
    // and works even if Supabase is unreachable (or not configured yet).
    applyContent(clone(defaults));
    var live = await fetchLiveContent();
    if (live) applyContent(live);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
