/* Ashford Vale | Static admin studio
   No server, API token, analytics, or third-party admin service required. */
(function () {
  "use strict";

  var CONTENT_KEY = "ashford-vale-site-content-v1";
  var AUTH_KEY = "ashford-vale-admin-password-v1";
  var defaults = window.DEFAULT_SITE_CONTENT;
  var state;
  var editor = document.getElementById("editor");
  var saveStatus = document.getElementById("save-status");

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function storageGet(key) { try { return localStorage.getItem(key); } catch (error) { return null; } }
  function storageSet(key, value) { try { localStorage.setItem(key, value); return true; } catch (error) { return false; } }
  function merge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) ? override : base;
    if (!base || typeof base !== "object") return override == null ? base : override;
    Object.keys(override || {}).forEach(function (key) { base[key] = key in base ? merge(base[key], override[key]) : override[key]; });
    return base;
  }
  function loadContent() {
    try {
      var raw = storageGet(CONTENT_KEY), parsed = raw ? JSON.parse(raw) : null;
      if (parsed && parsed.version === defaults.version) return merge(clone(defaults), parsed);
    } catch (error) { /* Fall back to repository defaults. */ }
    return clone(defaults);
  }
  function getPath(object, path) { return path.split(".").reduce(function (value, part) { return value == null ? "" : value[part]; }, object); }
  function setPath(object, path, value) {
    var parts = path.split("."), target = object;
    parts.slice(0, -1).forEach(function (part) { target = target[part]; });
    target[parts[parts.length - 1]] = value;
  }
  function esc(value) { return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function pathId(path) { return "field-" + path.replace(/[^a-z0-9]+/gi, "-").toLowerCase(); }
  function field(label, path, kind, hint, full) {
    var value = getPath(state, path), inputType = kind === "email" ? "email" : "text";
    var control = kind === "textarea" ? '<textarea data-path="' + path + '" data-kind="textarea" id="' + pathId(path) + '">' + esc(value) + "</textarea>" : '<input id="' + pathId(path) + '" data-path="' + path + '" data-kind="' + (kind || "text") + '" type="' + inputType + '" value="' + esc(value) + '">';
    return '<div class="field' + (full ? " full" : "") + '"><label for="' + pathId(path) + '">' + esc(label) + '</label>' + control + (hint ? '<small>' + esc(hint) + '</small>' : "") + "</div>";
  }
  function section(title, intro, body, extra) { return '<section class="editor-section ' + (extra || "") + '"><div class="section-head"><div><h2>' + title + '</h2><p>' + intro + '</p></div></div>' + body + '</section>'; }
  function grid(fields) { return '<div class="field-grid">' + fields.join("") + "</div>"; }
  function repeatCard(title, body) { return '<article class="repeat-card"><h3>' + esc(title) + '</h3>' + grid(body) + "</article>"; }
  function repeatGrid(cards) { return '<div class="repeat-grid">' + cards.join("") + "</div>"; }

  function render() {
    var trustCards = state.trust.map(function (item, i) { return repeatCard("Trust item " + (i + 1), [field("Title", "trust." + i + ".title"), field("Detail", "trust." + i + ".detail")]); });
    var practiceCards = state.practice.map(function (item, i) {
      var fields = [field("Practice title", "practice." + i + ".title"), field("Description", "practice." + i + ".description", "textarea", "Short paragraph shown on the homepage.", true)];
      item.items.forEach(function (entry, j) { fields.push(field("List item " + (j + 1), "practice." + i + ".items." + j)); });
      fields.push(field("Button label", "practice." + i + ".linkLabel"));
      return repeatCard("Practice area " + (i + 1), fields);
    });
    var quoteCards = state.clients.quotes.map(function (item, i) { return repeatCard("Quote " + (i + 1), [field("Quote", "clients.quotes." + i + ".quote", "textarea", "Use an approved client comment only.", true), field("Attribution", "clients.quotes." + i + ".attribution"), field("Matter detail", "clients.quotes." + i + ".detail")]); });
    var partnerCards = state.people.partners.map(function (item, i) { return repeatCard("Partner " + (i + 1), [field("Name", "people.partners." + i + ".name"), field("Focus", "people.partners." + i + ".focus"), field("Email", "people.partners." + i + ".email", "email"), field("Portrait alt text", "people.partners." + i + ".imageAlt")]); });
    var urls = [
      ["Work navigation URL", "header.nav.workUrl", "Destination for the Our work navigation link."],
      ["Clients navigation URL", "header.nav.clientsUrl", "Destination for the Clients navigation link."],
      ["People navigation URL", "header.nav.peopleUrl", "Destination for the Our people navigation link."],
      ["Header button URL", "header.nav.ctaUrl", "Destination for the header call to action."],
      ["Header phone URL", "header.phoneHref", "Use a tel: URL for a phone link."],
      ["Hero primary button", "hero.primaryUrl", "Use #contact, a page path, or a full https:// URL."],
      ["Hero secondary button", "hero.secondaryUrl", "Destination for the secondary hero action."],
      ["Hero image URL", "hero.imageUrl", "Use a relative GitHub asset path for a self-contained site."],
      ["Lead contact URL or email", "people.lead.email", "Use a mailto email, an internal path, or a full https:// URL."],
      ["Lead partner image URL", "people.lead.imageUrl", "Portrait source used in the people section."],
      ["Contact email URL", "contact.emailHref", "Destination for the displayed contact email."],
      ["Contact phone URL", "contact.phoneHref", "Use a tel: URL for the displayed contact phone."],
      ["Formspree endpoint URL", "contact.formAction", "Paste the full URL from Formspree, for example https://formspree.io/f/abc12345."],
      ["Contact privacy link", "contact.privacyUrl", "Relative path or full URL."],
      ["Footer privacy link", "footer.privacyUrl", "Relative path or full URL."],
      ["Footer complaints link", "footer.complaintsUrl", "Relative path or full URL."],
      ["Footer accessibility link", "footer.accessibilityUrl", "Relative path or full URL."]
    ];
    state.practice.forEach(function (item, i) { urls.push(["Practice area " + (i + 1) + " button URL", "practice." + i + ".linkUrl", "Destination for this practice card button."]); });
    state.people.partners.forEach(function (item, i) {
      urls.push([item.name + " contact URL or email", "people.partners." + i + ".email", "Use a mailto email, an internal path, or a full https:// URL."]);
      urls.push([item.name + " image URL", "people.partners." + i + ".imageUrl", "Partner portrait source."]);
    });
    var urlRows = urls.map(function (entry) { return '<div class="url-row"><div><strong>' + esc(entry[0]) + '</strong><span>' + esc(entry[1]) + '</span></div><div>' + field(entry[0], entry[1], "url", entry[2], true) + "</div></div>"; });

    editor.innerHTML =
      section("Site and navigation", "Control browser metadata, the firm identity, top line, phone number, and navigation labels.", grid([
        field("Browser title", "meta.title", "textarea", "Shown in the browser tab and search results.", true),
        field("Meta description", "meta.description", "textarea", "Short search description.", true),
        field("Social title", "meta.ogTitle"), field("Social description", "meta.ogDescription", "textarea"),
        field("Firm name", "brand.name"), field("Descriptor", "brand.descriptor"), field("Logo letter", "brand.mark"),
        field("Top line message", "header.strapline", "textarea", "Message above the navigation.", true),
        field("Phone display", "header.phoneDisplay"), field("Work navigation label", "header.nav.work"),
        field("Clients navigation label", "header.nav.clients"), field("People navigation label", "header.nav.people"), field("Header button label", "header.nav.cta")
      ])) +
      section("Hero", "Edit the first screen visitors see. Button destinations and the image URL live in the URL key below.", grid([
        field("Headline", "hero.title", "textarea", "Keep this concise for the visual layout.", true), field("Intro text", "hero.lede", "textarea", "The paragraph below the headline.", true),
        field("Primary button label", "hero.primaryLabel"), field("Secondary button label", "hero.secondaryLabel"),
        field("Image alt text", "hero.imageAlt", "textarea", "Describe the image for accessibility.", true), field("Image caption", "hero.caption")
      ])) +
      section("Trust strip", "Four credibility statements displayed below the hero.", repeatGrid(trustCards)) +
      section("Practice areas", "Edit each practice card, its list, and its button label. Use the URL key to change destinations.", repeatGrid(practiceCards)) +
      section("Client proof", "Edit the client-facing introduction and approved testimonial copy.", grid([
        field("Section title", "clients.title"), field("Section intro", "clients.intro", "textarea", "", true),
        field("Lead quote", "clients.leadQuote", "textarea", "Use approved wording only.", true), field("Lead attribution", "clients.leadAttribution"), field("Lead matter detail", "clients.leadDetail"), field("Disclosure note", "clients.finePrint", "textarea", "Keep any required legal disclosure.", true)
      ]) + repeatGrid(quoteCards)) +
      section("People", "Update the lead partner and partner roster. Email and image destinations are also listed in the URL key.", grid([
        field("Section title", "people.title"), field("Section intro", "people.intro", "textarea", "", true),
        field("Lead name", "people.lead.name"), field("Lead role", "people.lead.role"), field("Lead biography", "people.lead.bio", "textarea", "", true),
        field("Lead focus", "people.lead.focus"), field("Lead base", "people.lead.based"), field("Portrait alt text", "people.lead.imageAlt"),
        field("Lead button label", "people.lead.buttonLabel"), field("Lead quote", "people.lead.quote", "textarea", "", true), field("Quote attribution", "people.lead.quoteAttribution", "text", "", true)
      ]) + repeatGrid(partnerCards)) +
      section("Contact and enquiry", "Edit office details, the Formspree enquiry destination, and the thank-you message shown after a successful submission.", grid([
        field("Section title", "contact.title"), field("Intro", "contact.lede", "textarea", "", true), field("London address", "contact.london", "textarea"), field("Email", "contact.email", "email"), field("Phone", "contact.phone"), field("Other offices", "contact.otherOffices", "textarea"), field("Availability", "contact.availability", "textarea"), field("Form subject", "contact.formSubject"), field("Thank-you note", "contact.successMessage", "textarea", "Shown after Formspree accepts the enquiry.", true), field("Error note", "contact.errorMessage", "textarea", "Shown if the submission fails.", true), field("Privacy link text", "contact.privacyLabel")
      ])) +
      section("Footer", "Replace regulatory, copyright, and legal-link text before publishing.", grid([
        field("Regulatory text", "footer.legal", "textarea", "Confirm this with the firm before launch.", true), field("Copyright line", "footer.copyright", "textarea", "", true)
      ])) +
      section("URL key and destinations", "This is the control room for every homepage button, image source, email destination, form target, and legal link.", urlRows.join(""), "url-key");

    bindFields();
  }
  function bindFields() {
    editor.querySelectorAll("[data-path]").forEach(function (el) {
      el.addEventListener("input", function () { setPath(state, el.getAttribute("data-path"), el.value); });
      el.addEventListener("change", function () { setPath(state, el.getAttribute("data-path"), el.value); });
    });
  }
  function save() {
    var ok = storageSet(CONTENT_KEY, JSON.stringify(state));
    saveStatus.textContent = ok ? "Saved in this browser. Preview to check the homepage." : "This browser blocked local storage; export the content file instead.";
    saveStatus.style.color = ok ? "var(--green)" : "var(--danger)";
  }
  function download(name, textValue, type) {
    var blob = new Blob([textValue], { type: type });
    var link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = name; link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 500);
  }
  function exportJson() { download("ashford-vale-content.json", JSON.stringify(state, null, 2), "application/json"); }
  function exportGithubFile() { download("site-content.js", "/* Exported from Ashford Vale Content Studio */\n(function () {\n  window.DEFAULT_SITE_CONTENT = " + JSON.stringify(state, null, 2) + ";\n})();\n", "text/javascript"); }
  function setAuthView(login) {
    document.getElementById("auth-title").textContent = login ? "Admin sign in" : "Content studio";
    document.getElementById("auth-copy").textContent = login ? "Enter the password created for this browser." : "Set a local admin password to manage the homepage on this browser.";
    document.getElementById("password-label").textContent = login ? "Admin password" : "Create admin password";
    document.getElementById("confirm-wrap").style.display = login ? "none" : "grid";
    document.getElementById("auth-submit").textContent = login ? "Sign in" : "Create local access";
  }
  function showApp() { document.getElementById("auth").style.display = "none"; document.getElementById("app").classList.add("is-visible"); render(); }
  function showAuth() { document.getElementById("app").classList.remove("is-visible"); document.getElementById("auth").style.display = "grid"; setAuthView(Boolean(storageGet(AUTH_KEY))); document.getElementById("password-form").reset(); }
  async function hash(value) {
    if (window.crypto && window.crypto.subtle) {
      var bytes = new TextEncoder().encode(value), digest = await crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest)).map(function (byte) { return byte.toString(16).padStart(2, "0"); }).join("");
    }
    var result = 2166136261; for (var i = 0; i < value.length; i++) result = Math.imul(result ^ value.charCodeAt(i), 16777619); return "fallback-" + (result >>> 0).toString(16);
  }

  document.getElementById("password-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    var password = document.getElementById("password").value, confirm = document.getElementById("confirm-password").value, existing = storageGet(AUTH_KEY), status = document.getElementById("auth-status");
    status.textContent = "";
    if (password.length < 8) { status.textContent = "Use at least 8 characters."; return; }
    if (!existing && password !== confirm) { status.textContent = "The passwords do not match."; return; }
    var digest = await hash(password);
    if (!existing) { if (!storageSet(AUTH_KEY, digest)) { status.textContent = "This browser cannot save local access."; return; } showApp(); return; }
    if (digest !== existing) { status.textContent = "That password is not correct."; return; }
    showApp();
  });
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("preview").addEventListener("click", function () { window.open(new URL("../", window.location.href).href, "_blank", "noopener"); });
  document.getElementById("export").addEventListener("click", exportJson);
  document.getElementById("download-file").addEventListener("click", exportGithubFile);
  document.getElementById("lock").addEventListener("click", showAuth);
  document.getElementById("import-file").addEventListener("change", function (event) {
    var file = event.target.files[0]; if (!file) return;
    var reader = new FileReader(); reader.onload = function () { try { var imported = JSON.parse(reader.result); if (imported.version !== defaults.version) throw new Error("version"); state = imported; render(); saveStatus.textContent = "Imported. Review the fields, then save changes."; saveStatus.style.color = "var(--green)"; } catch (error) { saveStatus.textContent = "That file is not a compatible Ashford Vale content export."; saveStatus.style.color = "var(--danger)"; } };
    reader.readAsText(file); event.target.value = "";
  });

  state = loadContent();
  setAuthView(Boolean(storageGet(AUTH_KEY)));
})();
