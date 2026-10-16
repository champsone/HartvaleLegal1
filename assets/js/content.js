/* NorthmereLegal | Homepage content renderer */
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

  var ICONS = {
    person: '<circle cx="17" cy="24" r="8"/><path d="M25 24h18M37 24v6M43 24v4"/>',
    building: '<path d="M10 42V12l14-6 14 6v30M6 42h36"/><path d="M18 18h4M26 18h4M18 25h4M26 25h4M18 32h4M26 32h4"/>',
    scales: '<path d="M24 8v32M14 40h20M10 14h28"/><path d="M10 14L4 28h12zM38 14l-6 14h12z"/>'
  };
  var ICON_ORDER = ["person", "building", "scales"];
  function make(tag, props, kids) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) { if (props[key] != null) node.setAttribute(key, props[key]); });
    (kids || []).forEach(function (kid) { node.append(kid); });
    return node;
  }
  function fill(selector, nodes) {
    var host = document.querySelector(selector);
    if (host) host.replaceChildren.apply(host, nodes);
  }
  function icon(name, index) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    ["viewBox:0 0 48 48", "fill:none", "stroke:currentColor", "stroke-width:1.5", "stroke-linecap:round", "stroke-linejoin:round", "aria-hidden:true", "class:practice-icon"].forEach(function (pair) {
      var i = pair.indexOf(":"); svg.setAttribute(pair.slice(0, i), pair.slice(i + 1));
    });
    svg.innerHTML = ICONS[name] || ICONS[ICON_ORDER[index % ICON_ORDER.length]];
    return svg;
  }
  function links(items, fallback) {
    return (items || []).map(function (item) {
      return make("a", { href: safeUrl(item.url, fallback) }, [document.createTextNode(item.label || "")]);
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

  fill(".trust ul", (content.trust || []).map(function (item) {
    return make("li", {}, [make("strong", {}, [item.title || ""]), make("span", { "data-trust-detail": "" }, [item.detail || ""])]);
  }));

  text("#practice-title", content.practiceSection.title);
  text("#practice .section-head p", content.practiceSection.intro);
  fill(".practice-grid", (content.practice || []).map(function (item, index) {
    return make("article", { "class": "practice" }, [
      icon(item.icon, index),
      make("h3", {}, [item.title || ""]),
      make("p", {}, [item.description || ""]),
      make("ul", {}, (item.items || []).filter(Boolean).map(function (entry) { return make("li", {}, [entry]); })),
      make("a", { "class": "textlink", href: safeUrl(item.linkUrl, "#contact") }, [item.linkLabel || ""])
    ]);
  }));

  text(".clients .section-head h2", content.clients.title);
  text(".clients .section-head p", content.clients.intro);
  var leadQuote = document.querySelector(".lead-quote");
  if (leadQuote) {
    textIn(leadQuote, "blockquote p", content.clients.leadQuote);
    var leadCaption = leadQuote.querySelector("figcaption");
    if (leadCaption) {
      leadCaption.replaceChildren();
      leadCaption.append(make("strong", {}, [content.clients.leadAttribution]), document.createTextNode(content.clients.leadDetail));
    }
  }
  fill(".quotes-grid", (content.clients.quotes || []).map(function (item, index) {
    return make("figure", index === 0 ? { "class": "quote--feature" } : {}, [
      make("blockquote", {}, [make("p", {}, [item.quote || ""])]),
      make("figcaption", {}, [make("strong", {}, [item.attribution || ""]), document.createTextNode(item.detail || "")])
    ]);
  }));
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
  text(".roster-title", content.people.rosterTitle);
  fill(".roster", (content.people.partners || []).map(function (person) {
    return make("li", {}, [
      make("img", { src: safeUrl(person.imageUrl, ""), alt: person.imageAlt || "", width: "48", height: "48", loading: "lazy", decoding: "async" }),
      make("div", {}, [make("strong", {}, [person.name || ""]), make("span", {}, [person.focus || ""])]),
      make("a", { href: contactHref(person.email), "aria-label": "Contact " + (person.name || "") }, ["Contact"])
    ]);
  }));

  var c = content.contact;
  text(".contact h2", c.title); text(".contact-lede", c.lede);
  text(".contact-assurance strong", c.assuranceTitle); text(".contact-assurance p", c.assuranceText);
  fill(".contact-points", (c.steps || []).map(function (step, index) {
    var number = String(index + 1); if (number.length < 2) number = "0" + number;
    return make("div", {}, [make("span", {}, [number]), make("p", {}, [make("strong", {}, [step.title || ""]), make("br"), document.createTextNode(step.text || "")])]);
  }));
  var detailBlocks = document.querySelectorAll(".details > div");
  var labels = c.labels || {};
  [labels.address, labels.direct, labels.offices, labels.hours].forEach(function (label, i) {
    if (detailBlocks[i]) textIn(detailBlocks[i], "dt", label);
  });
  if (detailBlocks[0]) multiline(detailBlocks[0].querySelector("dd"), c.london);
  if (detailBlocks[1]) {
    var direct = detailBlocks[1].querySelector("dd");
    if (direct) {
      direct.replaceChildren();
      if (c.email) direct.append(make("a", { href: safeUrl(c.emailHref, mail(c.email)) }, [c.email]));
      if (c.email && c.phone) direct.append(make("br"));
      if (c.phone) direct.append(make("a", { href: safeUrl(c.phoneHref, tel(c.phone)) }, [c.phone]));
    }
  }
  if (detailBlocks[2]) multiline(detailBlocks[2].querySelector("dd"), c.otherOffices);
  if (detailBlocks[3]) multiline(detailBlocks[3].querySelector("dd"), c.availability);
  document.querySelectorAll(".details > div").forEach(function (block) {
    var dd = block.querySelector("dd");
    block.hidden = !(dd && dd.textContent.trim());
  });
  var detailList = document.querySelector(".details");
  if (detailList) detailList.hidden = !detailList.querySelector("div:not([hidden])");

  var form = document.getElementById("lead-form");
  if (form) {
    form.action = safeUrl(c.formAction, form.action);
    form.setAttribute("data-label", c.formLabel || "");
    var subject = form.querySelector('[name="_subject"]'); if (subject) subject.value = c.formSubject;
    var select = form.querySelector("#matter");
    if (select) {
      select.replaceChildren(make("option", { value: "", selected: "" }, [c.matterPlaceholder || ""]));
      (c.matterOptions || []).filter(Boolean).forEach(function (option) { select.append(make("option", {}, [option])); });
    }
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.textContent = c.submitLabel || "Send enquiry";
  }
  var privacy = document.querySelector(".consent a");
  if (privacy) { privacy.textContent = c.privacyLabel; privacy.href = safeUrl(c.privacyUrl); }

  text(".reg", content.footer.legal);
  var copyright = document.querySelector(".footer-bottom > span");
  if (copyright) copyright.lastChild.nodeValue = " " + content.footer.copyright;
  fill(".footer-top nav", links(content.footer.links, "#top"));
  fill(".footer-bottom nav", links(content.footer.legalLinks, "#contact"));

  window.__NORTHMERE_CONTENT__ = content;
  window.dispatchEvent(new CustomEvent("northmerelegal:content-ready"));
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
