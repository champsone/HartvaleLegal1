/* NorthmereLegal | Homepage renderer.
   Built-in defaults render immediately. Live content from Supabase replaces them when it
   is available and current (see "revision" in site-content.js). Every dynamic string is
   written with textContent, never innerHTML, so content can never inject markup. */
(function () {
  "use strict";

  var defaults = window.DEFAULT_SITE_CONTENT;

  /* ---------- helpers ---------- */
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function merge(base, over) {
    if (Array.isArray(base)) return Array.isArray(over) ? over : base;
    if (!base || typeof base !== "object") return over == null ? base : over;
    Object.keys(over || {}).forEach(function (k) { base[k] = k in base ? merge(base[k], over[k]) : over[k]; });
    return base;
  }
  function safeUrl(value, fallback) {
    var u = String(value || "").trim();
    if (u === "#practice") u = "#services";
    if (u === "#main") u = "#top";
    if (/^(javascript|data|vbscript):/i.test(u)) return fallback || "#";
    return /^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(u) ? u : (fallback || "#");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function set(el, value) { if (el) el.textContent = value == null ? "" : String(value); }
  function setHref(el, value, fallback) { if (el) el.setAttribute("href", safeUrl(value, fallback)); }
  function make(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function add(parent, tag, cls, text) { var e = make(tag, cls, text); parent.appendChild(e); return e; }
  function show(el, on) { if (el) el.hidden = !on; }

  /* ---------- icons (constant, trusted SVG markup) ---------- */
  var ICONS = {
    person: '<path d="M16 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M5 27c0-6 5-9 11-9s11 3 11 9"/>',
    building: '<path d="M6 27V9l10-5 10 5v18"/><path d="M3 27h26"/><path d="M12 27v-7h8v7"/><path d="M12 12h2M18 12h2M12 16h2M18 16h2"/>',
    scales: '<path d="M16 4v23M9 27h14"/><path d="M5 9h22"/><path d="M5 9l-4 9a4 4 0 0 0 8 0L5 9Z"/><path d="M27 9l-4 9a4 4 0 0 0 8 0l-4-9Z"/>',
    shield: '<path d="M16 3l11 4v8c0 7-4.5 11.5-11 14C9.5 26.5 5 22 5 15V7l11-4Z"/><path d="M11 16l4 4 6-8"/>',
    partner: '<circle cx="12" cy="11" r="4"/><circle cx="22" cy="12" r="3"/><path d="M4 26c0-5 3.5-8 8-8s8 3 8 8"/><path d="M21 19c4 0 7 2.5 7 7"/>',
    plain: '<path d="M7 4h14l5 5v19H7V4Z"/><path d="M21 4v5h5"/><path d="M11 15h11M11 19h11M11 23h7"/>',
    lock: '<rect x="6" y="14" width="20" height="14" rx="2"/><path d="M10 14v-3a6 6 0 0 1 12 0v3"/><path d="M16 20v3"/>'
  };
  var TRUST_ICONS = ["shield", "partner", "plain", "lock"];
  var PRACTICE_ICONS = ["person", "building", "scales"];
  function icon(name, cls) {
    var span = make("span", cls || "icon");
    span.setAttribute("aria-hidden", "true");
    var svg = '<svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.shield) + "</svg>";
    span.innerHTML = svg; /* constant string from ICONS above, no user content */
    return span;
  }

  /* ---------- section renderers ---------- */
  function renderBrand(c) {
    var bn = c.brand.name || "NorthmereLegal";
    $$(".brand").forEach(function (b) {
      set($(".monogram", b), c.brand.mark);
      var word = $(".wordmark", b);
      if (word) {
        word.replaceChildren();
        var m = /^(.*?)(Legal)$/.exec(bn);
        if (m && m[1]) { word.appendChild(document.createTextNode(m[1])); add(word, "span", "", m[2]); }
        else word.appendChild(document.createTextNode(bn));
        add(word, "small", "", c.brand.descriptor || "Solicitors");
      }
      b.setAttribute("aria-label", bn + " home");
    });
  }

  function renderNav(c) {
    var host = $("#navlinks"); if (!host) return;
    host.replaceChildren();
    ((c.header && c.header.links) || []).filter(function (l) { return l && l.label; }).forEach(function (l) {
      var a = add(host, "a", "", l.label); setHref(a, l.url, "#top");
    });
    var n = (c.header && c.header.nav) || {};
    if (n.cta) { var b = add(host, "a", "btn btn-outline", n.cta); setHref(b, n.ctaUrl, "#contact"); }
    var first = $("a:not(.btn)", host); if (first) first.classList.add("active");
    var ui = c.ui || {};
    set($(".skip"), ui.skipLink || "Skip to content");
    var tg = $(".menu-toggle");
    if (tg && tg.getAttribute("aria-expanded") !== "true") set(tg, ui.menuOpen || "☰ Menu");
  }

  function renderHero(c) {
    var h = c.hero, root = $(".hero-inner");
    if (!root) return;
    set($(".eyebrow", root), h.eyebrow);
    var title = $("h1", root);
    if (title) {
      title.replaceChildren(document.createTextNode(h.title || ""));
      if (h.titleAccent) { add(title, "br"); add(title, "em", "", h.titleAccent); }
    }
    set($(".hero-lede", root), h.lede);
    var a = $$(".actions a", root);
    if (a[0]) { set(a[0], (h.primaryLabel || "Explore our services") + "  →"); setHref(a[0], h.primaryUrl, "#services"); }
    if (a[1]) { set(a[1], h.secondaryLabel || "Book a consultation"); setHref(a[1], h.secondaryUrl, "#contact"); }
    set($(".hero-caption"), h.caption); show($(".hero-caption"), !!h.caption);
    set($(".hero-image-alt"), h.imageAlt);
    var hero = $(".hero");
    if (hero && h.imageUrl) hero.style.setProperty("--hero-image", 'url("' + String(h.imageUrl).replace(/["\\()\s]/g, "") + '")');
  }

  function renderTrust(c) {
    var host = $(".trustgrid"); if (!host) return;
    host.replaceChildren();
    (c.trust || []).forEach(function (t, i) {
      var item = add(host, "div", "trustitem");
      item.appendChild(icon(TRUST_ICONS[i % TRUST_ICONS.length], "trusticon"));
      var body = add(item, "div");
      add(body, "strong", "", t.title);
      add(body, "span", "", t.detail);
    });
  }

  function renderServices(c) {
    var sec = $("#services"); if (!sec) return;
    var ps = c.practiceSection || {};
    set($(".section-head .eyebrow", sec), ps.eyebrow || "What we do");
    set($(".section-head h2", sec), ps.title);
    set($(".section-head .section-intro", sec), ps.intro);
    var host = $(".practice-grid", sec); if (!host) return;
    host.replaceChildren();
    (c.practice || []).forEach(function (p, i) {
      var card = add(host, "article", "practice-card");
      card.appendChild(icon(p.icon && ICONS[p.icon] ? p.icon : PRACTICE_ICONS[i % PRACTICE_ICONS.length], "practice-icon"));
      add(card, "h3", "", p.title);
      add(card, "p", "practice-desc", p.description);
      var items = (p.items || []).filter(Boolean);
      if (items.length) { var ul = add(card, "ul", "practice-list"); items.forEach(function (t) { add(ul, "li", "", t); }); }
      var a = add(card, "a", "card-link", (p.linkLabel || "Discuss a matter") + "  →");
      setHref(a, p.linkUrl, "#contact");
    });
    var more = $(".section-head .textlink", sec);
    if (more) { set(more, ps.linkLabel || "Discuss your matter →"); setHref(more, ps.linkUrl, "#contact"); }
  }

  function renderClients(c) {
    var sec = $("#clients"); if (!sec) return;
    var cl = c.clients || {};
    set($(".section-head .eyebrow", sec), cl.eyebrow || "Client relationships");
    set($(".section-head h2", sec), cl.title);
    set($(".section-head .section-intro", sec), cl.intro);
    set($(".client-lead-quote", sec), cl.leadQuote);
    set($(".client-lead-attribution", sec), (cl.leadAttribution || "") + (cl.leadDetail ? " · " + cl.leadDetail : ""));
    var host = $(".client-proof-list", sec);
    if (host) {
      host.replaceChildren();
      (cl.quotes || []).forEach(function (q) {
        var card = add(host, "article", "client-proof-card");
        add(card, "blockquote", "", q.quote);
        var by = add(card, "p", "client-by");
        add(by, "strong", "", q.attribution);
        add(by, "span", "", q.detail);
      });
    }
    var note = $(".client-proof-note", sec);
    set(note, cl.finePrint); show(note, !!cl.finePrint);
  }

  function renderAbout(c) {
    var sec = $("#about"); if (!sec) return;
    var a = c.about || {}, copy = $(".about-copy", sec);
    if (copy) {
      set($(".eyebrow", copy), a.eyebrow);
      set($("h2", copy), a.title);
      set($(".about-body", copy), a.body);
      var statsHost = $(".stats", copy);
      if (statsHost) {
        statsHost.replaceChildren();
        (a.stats || []).filter(function (s) { return s && (s.value || s.label); }).forEach(function (s) {
          var el = add(statsHost, "div", "stat"); add(el, "strong", "", s.value); add(el, "span", "", s.label);
        });
        show(statsHost, statsHost.children.length > 0);
      }
      var btn = $(".btn", copy);
      set(btn, (a.buttonLabel || "Meet our partners") + "  →"); setHref(btn, a.buttonUrl, "#people");
    }
    var img = $(".about-image", sec);
    if (img && a.imageUrl) img.style.backgroundImage = 'linear-gradient(0deg,rgba(2,25,21,.4),rgba(2,25,21,0)),url("' + String(a.imageUrl).replace(/["\\()\s]/g, "") + '")';
    if (img && a.imageAlt) img.setAttribute("aria-label", a.imageAlt);
  }

  var contactPrefix = "Contact";
  function personCard(p, opts) {
    var card = make("article", opts.lead ? "team-lead" : "team-card");
    var fig = add(card, "div", "team-photo");
    var img = add(fig, "img");
    img.src = safeUrl(p.imageUrl, ""); img.loading = "lazy"; img.decoding = "async";
    img.alt = p.imageAlt || ("Portrait of " + (p.name || "team member"));
    var body = add(card, "div", "team-body");
    add(body, "p", "team-role", p.role || (opts.lead ? "Senior partner" : "Partner"));
    add(body, "h3", "team-name", p.name);
    var meta = [p.focus, p.based].filter(Boolean);
    if (meta.length) { var ml = add(body, "ul", "team-meta"); meta.forEach(function (m) { add(ml, "li", "", m); }); }
    if (p.bio) add(body, "p", "team-bio", p.bio);
    if (opts.lead && p.quote) {
      add(body, "blockquote", "team-quote", p.quote);
      if (p.quoteAttribution) add(body, "p", "team-quote-by", p.quoteAttribution);
    }
    var link = add(body, "a", opts.lead ? "btn btn-gold" : "card-link", (opts.lead ? (p.buttonLabel || "Contact") : (contactPrefix || "Contact") + " " + String(p.name || "").split(" ")[0]) + "  →");
    setHref(link, p.email ? (p.email.indexOf("@") > 0 && !/^[a-z]+:/i.test(p.email) ? "mailto:" + p.email : p.email) : "#contact", "#contact");
    return card;
  }

  function renderPeople(c) {
    var sec = $("#people"); if (!sec) return;
    var p = c.people || {}, wrap = $(".wrap", sec); if (!wrap) return;
    contactPrefix = p.contactPrefix || "Contact";
    wrap.replaceChildren();
    var head = add(wrap, "div", "team-heading");
    add(head, "p", "eyebrow", p.rosterTitle || "Our partners");
    add(head, "h2", "", p.title);
    add(head, "p", "section-intro", p.intro);
    if (p.lead && p.lead.name) wrap.appendChild(personCard(p.lead, { lead: true }));
    var partners = (p.partners || []).filter(function (x) { return x && x.name; });
    if (partners.length) {
      var grid = add(wrap, "div", "team-grid");
      grid.setAttribute("data-count", String(Math.min(partners.length, 4)));
      partners.forEach(function (x) { grid.appendChild(personCard(x, { lead: false })); });
    }
  }

  function renderInsights(c) {
    var sec = $("#insights"); if (!sec) return;
    var ins = c.insights || {};
    set($(".section-head .eyebrow", sec), ins.eyebrow);
    set($(".section-head h2", sec), ins.title);
    set($(".section-head .section-intro", sec), ins.intro);
    var host = $(".insight-grid", sec); if (!host) return;
    host.replaceChildren();
    (ins.cards || []).forEach(function (x) {
      var card = add(host, "article", "insight-card");
      add(card, "p", "insight-tag", x.category);
      add(card, "h3", "", x.title);
      add(card, "p", "insight-desc", x.description);
      var a = add(card, "a", "card-link", x.linkLabel || "Talk to our team →");
      setHref(a, x.linkUrl, "#contact");
    });
  }

  function renderContact(c) {
    var sec = $("#contact"); if (!sec) return;
    var ct = c.contact || {}, L = ct.labels || {}, F = ct.fields || {};
    set($(".section-head .eyebrow", sec), ct.eyebrow || "Get in touch");
    set($(".section-head h2", sec), ct.title);
    set($(".section-head .section-intro", sec), ct.lede);
    set($(".assurance-title", sec), ct.assuranceTitle); show($(".assurance-title", sec), !!ct.assuranceTitle);
    set($(".contact-intro", sec), ct.assuranceText);
    var steps = $(".contact-steps", sec);
    if (steps) {
      steps.replaceChildren();
      (ct.steps || []).filter(function (s) { return s && (s.title || s.text); }).forEach(function (s) {
        var li = add(steps, "li"); add(li, "strong", "", s.title); if (s.text) add(li, "span", "", s.text);
      });
      show(steps, steps.children.length > 0);
    }
    set($(".form-heading", sec), ct.formLabel); show($(".form-heading", sec), !!ct.formLabel);
    var email = (ct.email || "").trim(), phone = (ct.phone || "").trim();
    var emailHref = ct.emailHref || (email ? "mailto:" + email : "");
    var phoneHref = ct.phoneHref || (phone ? "tel:" + phone.replace(/[^\d+]/g, "") : "");
    var entries = [[L.address, [ct.london, ct.otherOffices].filter(Boolean).join(" · "), ""],
                   [L.direct, email, emailHref], [L.offices, phone, phoneHref], [L.hours, ct.availability || "", ""]];
    $$(".info-item", sec).forEach(function (item, i) {
      var e = entries[i]; if (!e) return;
      set($("strong", item), e[0]);
      var span = $("span", item); span.replaceChildren();
      if (e[2] && e[1]) { var link = add(span, "a", "", e[1]); setHref(link, e[2], "#contact"); } else span.textContent = e[1];
      show(item, !!e[1]);
    });
    var grid = $(".contact-grid", sec), aside = $(".contact-info", sec);
    var hasDetails = $$(".info-item", sec).some(function (el) { return !el.hidden; });
    show(aside, hasDetails);
    if (grid) grid.classList.toggle("no-details", !hasDetails);
    var form = $("form", sec);
    if (form) {
      [["name", F.name], ["email", F.email], ["phone", F.phone], ["matter", F.matter], ["message", F.message]].forEach(function (x) {
        var lab = $('label[for="' + x[0] + '"]', form); if (lab && x[1]) set(lab, x[1]);
      });
      var em = $("#email", form); if (em) em.placeholder = F.emailPlaceholder || "";
      var msg = $("#message", form); if (msg) msg.placeholder = F.messagePlaceholder || "";
      var sel = $("#matter", form);
      if (sel) {
        sel.replaceChildren();
        var first = add(sel, "option", "", ct.matterPlaceholder || "Select a practice area"); first.value = ""; first.disabled = true; first.selected = true;
        (ct.matterOptions || []).forEach(function (m) { var o = add(sel, "option", "", m); o.value = m; });
      }
      set($("#form-notice", form), ct.formNotice);
      if (/^https:\/\//i.test(String(ct.formAction || ""))) form.setAttribute("action", ct.formAction);
      set($("button[type=submit]", form), (ct.submitLabel || "Send enquiry") + "  →");
      var priv = $(".form-privacy", form);
      if (priv) {
        priv.replaceChildren();
        if (ct.privacyLabel) { var pa = add(priv, "a", "", ct.privacyLabel); setHref(pa, ct.privacyUrl, "#contact"); }
        show(priv, !!ct.privacyLabel);
      }
    }
  }

  function renderFooter(c) {
    var f = $(".footer"); if (!f) return;
    var year = new Date().getFullYear();
    var line = $(".copyright-line", f);
    if (line) set(line, "© " + year + " " + c.brand.name + ". " + (c.footer.copyright || "All rights reserved."));
    var legal = $(".legal-links", f);
    if (legal) {
      legal.replaceChildren();
      (c.footer.legalLinks || []).forEach(function (x) { var a = add(legal, "a", "", x.label); setHref(a, x.url, "#contact"); });
    }
    var links = $(".footer-links", f);
    if (links) {
      links.replaceChildren();
      (c.footer.links || []).forEach(function (x) { var a = add(links, "a", "", x.label); setHref(a, x.url, "#top"); });
    }
    set($(".footer-legal", f), c.footer.legal);
  }

  function apply(c) {
    document.title = c.meta.title || c.brand.name;
    var md = $('meta[name="description"]'); if (md) md.content = c.meta.description || "";
    [['meta[property="og:title"]', c.meta.ogTitle || c.meta.title], ['meta[name="twitter:title"]', c.meta.ogTitle || c.meta.title],
     ['meta[property="og:description"]', c.meta.ogDescription || c.meta.description], ['meta[name="twitter:description"]', c.meta.ogDescription || c.meta.description]
    ].forEach(function (m) { var el = $(m[0]); if (el) el.content = m[1] || ""; });
    renderBrand(c); renderNav(c); renderHero(c); renderTrust(c); renderServices(c); renderClients(c);
    renderAbout(c); renderPeople(c); renderInsights(c); renderContact(c); renderFooter(c);
    window.__NORTHMERE_CONTENT__ = c;
    window.dispatchEvent(new CustomEvent("northmerelegal:content-ready"));
  }

  /* ---------- live content ---------- */
  async function fetchLive() {
    var client = window.getSupabaseClient && window.getSupabaseClient();
    if (!client) return null;
    try {
      var r = await client.from("site_content").select("data").eq("id", 1).single();
      if (r.error || !r.data || !r.data.data || !Object.keys(r.data.data).length) return null;
      /* Content saved before the current copy revision is stale: keep the new built-in copy. */
      if ((Number(r.data.data.revision) || 0) < (Number(defaults.revision) || 0)) return null;
      return window.normalizeBrand(merge(clone(defaults), window.cleanLegacyBrand(window.migrateContent(r.data.data))));
    } catch (e) { return null; }
  }
  async function init() {
    apply(window.normalizeBrand(clone(defaults)));
    var live = await fetchLive();
    if (live) apply(live);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
