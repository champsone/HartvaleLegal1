/* NorthmereLegal | Admin studio, backed by Supabase
   Content is read from and written to a Supabase table. Only a
   signed-in admin account (created in the Supabase dashboard) can save. */
(function () {
  "use strict";

  var defaults = window.DEFAULT_SITE_CONTENT;
  var state;
  var staleLoaded = false;
  var editor = document.getElementById("editor");
  var saveStatus = document.getElementById("save-status");
  var client = typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function merge(base, override) {
    if (Array.isArray(base)) return Array.isArray(override) ? override : base;
    if (!base || typeof base !== "object") return override == null ? base : override;
    Object.keys(override || {}).forEach(function (key) { base[key] = key in base ? merge(base[key], override[key]) : override[key]; });
    return base;
  }
  async function loadContent() {
    if (!client) return clone(defaults);
    try {
      var result = await client.from("site_content").select("data").eq("id", 1).single();
      if (result.error || !result.data || !result.data.data) return clone(defaults);
      var live = result.data.data;
      if (!live || typeof live !== "object" || Object.keys(live).length === 0) return clone(defaults);
      if ((Number(live.revision) || 0) < (Number(defaults.revision) || 0)) { staleLoaded = true; return window.normalizeBrand(clone(defaults)); }
      return window.normalizeBrand(merge(clone(defaults), window.cleanLegacyBrand(window.migrateContent(live))));
    } catch (error) { return clone(defaults); }
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

  var TEMPLATES = {
    trust: { title: "", detail: "" },
    practice: { icon: "person", title: "New practice area", description: "", items: [""], linkLabel: "Discuss a matter", linkUrl: "#contact" },
    quote: { quote: "", attribution: "", detail: "" },
    partner: { name: "New partner", role: "Partner", focus: "", based: "", bio: "", email: "", imageUrl: "", imageAlt: "" },
    insight: { category: "General", title: "New insight", description: "", linkLabel: "Talk to our team →", linkUrl: "#contact" },
    step: { title: "", text: "" },
    stat: { value: "", label: "" },
    link: { label: "", url: "#" },
    text: ""
  };
  function selectField(label, path, options) {
    var value = getPath(state, path);
    var opts = options.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === value ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("");
    return '<div class="field"><label for="' + pathId(path) + '">' + esc(label) + '</label><select id="' + pathId(path) + '" data-path="' + path + '" data-kind="select">' + opts + "</select></div>";
  }
  function tools(list, i, len) {
    return '<div class="card-tools">' +
      '<button type="button" class="btn btn--quiet btn--tiny" data-act="up" data-list="' + list + '" data-index="' + i + '"' + (i === 0 ? " disabled" : "") + ' aria-label="Move up">&uarr;</button>' +
      '<button type="button" class="btn btn--quiet btn--tiny" data-act="down" data-list="' + list + '" data-index="' + i + '"' + (i === len - 1 ? " disabled" : "") + ' aria-label="Move down">&darr;</button>' +
      '<button type="button" class="btn btn--danger btn--tiny" data-act="remove" data-list="' + list + '" data-index="' + i + '">Remove</button></div>';
  }
  function addButton(list, tpl, label) { return '<p><button type="button" class="btn btn--quiet" data-act="add" data-list="' + list + '" data-tpl="' + tpl + '">+ ' + esc(label) + "</button></p>"; }
  function listCard(list, i, len, title, body) { return '<article class="repeat-card"><div class="card-head"><h3>' + esc(title) + "</h3>" + tools(list, i, len) + "</div>" + grid(body) + "</article>"; }
  function stringList(label, list) {
    var items = getPath(state, list) || [];
    var rows = items.map(function (_, j) {
      return '<div class="string-row">' + field(label + " " + (j + 1), list + "." + j) + '<button type="button" class="btn btn--danger btn--tiny" data-act="remove" data-list="' + list + '" data-index="' + j + '">Remove</button></div>';
    }).join("");
    return '<div class="field full">' + rows + addButton(list, "text", "Add " + label.toLowerCase()) + "</div>";
  }

  function render() {
    var trustCards = state.trust.map(function (item, i) { return listCard("trust", i, state.trust.length, "Trust item " + (i + 1), [field("Title", "trust." + i + ".title"), field("Detail", "trust." + i + ".detail")]); });
    var practiceCards = state.practice.map(function (item, i) {
      var fields = [field("Practice title", "practice." + i + ".title"), selectField("Icon", "practice." + i + ".icon", [["person", "Person and family"], ["building", "Building and property"], ["scales", "Scales and disputes"], ["shield", "Shield and protection"], ["plain", "Document"], ["partner", "People"], ["lock", "Confidential"]]), field("Description", "practice." + i + ".description", "textarea", "Short paragraph shown on the homepage.", true), stringList("List item", "practice." + i + ".items"), field("Button label", "practice." + i + ".linkLabel")];
      return listCard("practice", i, state.practice.length, "Practice area " + (i + 1), fields);
    });
    var quoteCards = state.clients.quotes.map(function (item, i) { return listCard("clients.quotes", i, state.clients.quotes.length, "Quote " + (i + 1), [field("Quote", "clients.quotes." + i + ".quote", "textarea", "Use an approved client comment only.", true), field("Attribution", "clients.quotes." + i + ".attribution"), field("Matter detail", "clients.quotes." + i + ".detail")]); });
    var partnerCards = state.people.partners.map(function (item, i) { return listCard("people.partners", i, state.people.partners.length, "Partner " + (i + 1), [field("Name", "people.partners." + i + ".name"), field("Role", "people.partners." + i + ".role"), field("Focus", "people.partners." + i + ".focus"), field("Based in", "people.partners." + i + ".based"), field("Short biography", "people.partners." + i + ".bio", "textarea", "Two sentences is ideal.", true), field("Portrait alt text", "people.partners." + i + ".imageAlt")]); });
    var stepCards = state.contact.steps.map(function (item, i) { return listCard("contact.steps", i, state.contact.steps.length, "Step " + (i + 1), [field("Title", "contact.steps." + i + ".title"), field("Text", "contact.steps." + i + ".text", "textarea")]); });
    var footerLinks = state.footer.links.map(function (item, i) { return listCard("footer.links", i, state.footer.links.length, "Footer link " + (i + 1), [field("Label", "footer.links." + i + ".label"), field("URL", "footer.links." + i + ".url", "url")]); });
    var legalLinks = state.footer.legalLinks.map(function (item, i) { return listCard("footer.legalLinks", i, state.footer.legalLinks.length, "Legal link " + (i + 1), [field("Label", "footer.legalLinks." + i + ".label"), field("URL", "footer.legalLinks." + i + ".url", "url", "Relative path or full URL.")]); });
    var navCards = (state.header.links || []).map(function (item, i) { return listCard("header.links", i, state.header.links.length, "Link " + (i + 1), [field("Label", "header.links." + i + ".label"), field("URL", "header.links." + i + ".url", "url", "#section, a page path or a full https:// URL.")]); });
    var statCards = (state.about.stats || []).map(function (item, i) { return listCard("about.stats", i, state.about.stats.length, "Proof point " + (i + 1), [field("Value", "about.stats." + i + ".value"), field("Label", "about.stats." + i + ".label")]); });
    var urls = [
      ["Header button URL", "header.nav.ctaUrl", "Destination for the header call to action."],
      ["Hero primary button", "hero.primaryUrl", "Use #contact, a page path, or a full https:// URL."],
      ["Hero secondary button", "hero.secondaryUrl", "Destination for the secondary hero action."],
      ["Hero image URL", "hero.imageUrl", "Full https:// image address, or a path to an image in the repository."],
      ["About section image URL", "about.imageUrl", "Background image for the about section."],
      ["About button URL", "about.buttonUrl", "Destination for the about section button."],
      ["Lead contact URL or email", "people.lead.email", "Use an email address, an internal path, or a full https:// URL."],
      ["Lead partner image URL", "people.lead.imageUrl", "Portrait source used in the people section."],
      ["Company email link (optional)", "contact.emailHref", "Use mailto:address@example.com or leave blank to generate it from the company email address."],
      ["Company telephone link (optional)", "contact.phoneHref", "Use tel:+441234567890 or leave blank to generate it from the company telephone number."],
      ["Formspree endpoint URL", "contact.formAction", "Paste the full URL from Formspree, for example https://formspree.io/f/abc12345."],
      ["Contact privacy link", "contact.privacyUrl", "Relative path or full URL."]
    ];
    state.practice.forEach(function (item, i) { urls.push(["Practice area " + (i + 1) + " button URL", "practice." + i + ".linkUrl", "Destination for this practice card button."]); });
    state.people.partners.forEach(function (item, i) {
      urls.push([(item.name || "Partner " + (i + 1)) + " contact URL or email", "people.partners." + i + ".email", "Use an email address, an internal path, or a full https:// URL."]);
      urls.push([(item.name || "Partner " + (i + 1)) + " image URL", "people.partners." + i + ".imageUrl", "Partner portrait source."]);
    });
    var urlRows = urls.map(function (entry) { return '<div class="url-row"><div><strong>' + esc(entry[0]) + '</strong><span>' + esc(entry[1]) + '</span></div><div>' + field(entry[0], entry[1], "url", entry[2], true) + "</div></div>"; });

    editor.innerHTML =
      section("Site and navigation", "Browser metadata, firm identity and navigation labels.", grid([
        field("Browser title", "meta.title", "textarea", "Shown in the browser tab and search results.", true),
        field("Meta description", "meta.description", "textarea", "Short search description.", true),
        field("Social title", "meta.ogTitle"), field("Social description", "meta.ogDescription", "textarea"),
        field("Firm name", "brand.name"), field("Descriptor", "brand.descriptor"), field("Logo letter", "brand.mark", "text", "Set automatically from the first letter of the firm name."),
        field("Header button label", "header.nav.cta"),
        field("Skip-link text", "ui.skipLink", "text", "Hidden link for keyboard and screen-reader users."), field("Mobile menu button", "ui.menuOpen"), field("Mobile menu close button", "ui.menuClose")
      ]) + "<h3>Navigation links</h3>" + repeatGrid(navCards) + addButton("header.links", "link", "Add navigation link")) +
      section("Hero", "The first screen visitors see. Button destinations and the image URL are in the URL key below.", grid([
        field("Eyebrow", "hero.eyebrow"), field("Headline", "hero.title", "textarea", "First line of the headline.", true), field("Headline accent", "hero.titleAccent", "text", "Second line, shown in gold italics. Optional.", true), field("Intro text", "hero.lede", "textarea", "The paragraph below the headline.", true),
        field("Primary button label", "hero.primaryLabel"), field("Secondary button label", "hero.secondaryLabel"),
        field("Image alt text", "hero.imageAlt", "textarea", "Describe the image for accessibility.", true), field("Image caption", "hero.caption")
      ])) +
      section("Trust strip", "Credibility statements shown below the hero. Add, remove and reorder as needed.", repeatGrid(trustCards) + addButton("trust", "trust", "Add trust item")) +
      section("Practice areas", "Section heading, then each practice card with its own list and button.", grid([field("Section label", "practiceSection.eyebrow"), field("Section title", "practiceSection.title"), field("Section intro", "practiceSection.intro", "textarea", "", true), field("More link label", "practiceSection.linkLabel"), field("More link URL", "practiceSection.linkUrl", "url")]) + repeatGrid(practiceCards) + addButton("practice", "practice", "Add practice area")) +
      section("Client proof", "Introduction and approved testimonial copy.", grid([
        field("Section label", "clients.eyebrow"), field("Section title", "clients.title"), field("Section intro", "clients.intro", "textarea", "", true),
        field("Lead quote", "clients.leadQuote", "textarea", "Use approved wording only.", true), field("Lead attribution", "clients.leadAttribution"), field("Lead matter detail", "clients.leadDetail"), field("Disclosure note", "clients.finePrint", "textarea", "Keep any required legal disclosure.", true)
      ]) + repeatGrid(quoteCards) + addButton("clients.quotes", "quote", "Add quote")) +
      section("About section", "Edit the firm introduction, visual, proof points and call-to-action.", grid([
        field("Eyebrow", "about.eyebrow"), field("Heading", "about.title", "textarea", "Use a line break if needed.", true),
        field("Introduction", "about.body", "textarea", "Short, accurate firm introduction.", true), field("Button label", "about.buttonLabel"),
        field("Image alt text", "about.imageAlt", "text", "Describe the about image for accessibility.")
      ]) + repeatGrid(statCards) + addButton("about.stats", "stat", "Add proof point")) +
      section("Insights section", "Edit the perspectives cards shown on the homepage.", grid([
        field("Eyebrow", "insights.eyebrow"), field("Heading", "insights.title", "textarea", "Section heading.", true),
        field("Introduction", "insights.intro", "textarea", "Short introduction.", true)
      ]) + repeatGrid((state.insights.cards || []).map(function (item, i) { return listCard("insights.cards", i, state.insights.cards.length, "Insight " + (i + 1), [field("Category", "insights.cards." + i + ".category"), field("Title", "insights.cards." + i + ".title"), field("Description", "insights.cards." + i + ".description", "textarea", "", true), field("Link label", "insights.cards." + i + ".linkLabel"), field("Link URL", "insights.cards." + i + ".linkUrl", "url")]); })) + addButton("insights.cards", "insight", "Add insight")) +
      section("People", "Lead partner and partner roster. Email and image addresses are in the URL key.", grid([
        field("Section title", "people.title"), field("Section intro", "people.intro", "textarea", "", true),
        field("Lead name", "people.lead.name"), field("Lead role", "people.lead.role"), field("Lead biography", "people.lead.bio", "textarea", "", true),
        field("Lead focus", "people.lead.focus"), field("Lead base", "people.lead.based"), field("Portrait alt text", "people.lead.imageAlt"),
        field("Lead button label", "people.lead.buttonLabel"), field("Lead quote", "people.lead.quote", "textarea", "", true), field("Quote attribution", "people.lead.quoteAttribution", "text", "", true),
        field("Roster heading", "people.rosterTitle"), field("Partner button prefix", "people.contactPrefix", "text", "Shown as Contact + first name on each partner card.")
      ]) + repeatGrid(partnerCards) + addButton("people.partners", "partner", "Add partner")) +
      section("Contact and enquiry", "Office details, reassurance text, the enquiry form and its messages.", grid([
        field("Eyebrow", "contact.eyebrow"), field("Form notice", "contact.formNotice", "textarea", "Shown beneath the form submit button.", true),
        field("Section title", "contact.title"), field("Intro", "contact.lede", "textarea", "", true),
        field("Reassurance heading", "contact.assuranceTitle"), field("Reassurance text", "contact.assuranceText", "textarea", "", true),
        field("Address label", "contact.labels.address"), field("London address", "contact.london", "textarea"),
        field("Email label", "contact.labels.direct"), field("Company email address", "contact.email", "email", "Displayed in the homepage contact panel; visitors can tap to email."), field("Company telephone number", "contact.phone", "text", "Displayed in the homepage contact panel; visitors can tap to call."),
        field("Telephone label", "contact.labels.offices"), field("Other offices", "contact.otherOffices", "textarea"),
        field("Availability label", "contact.labels.hours"), field("Availability", "contact.availability", "textarea"),
        field("Form heading", "contact.formLabel"), field("Form email subject", "contact.formSubject"), field("Send button label", "contact.submitLabel"),
        field("Dropdown placeholder", "contact.matterPlaceholder"),
        field("Name field label", "contact.fields.name"), field("Email field label", "contact.fields.email"), field("Phone field label", "contact.fields.phone"), field("Practice area field label", "contact.fields.matter"), field("Message field label", "contact.fields.message"),
        field("Email placeholder", "contact.fields.emailPlaceholder"), field("Message placeholder", "contact.fields.messagePlaceholder", "textarea"),
        field("Name error", "contact.errors.name"), field("Email error", "contact.errors.email"), field("Message error", "contact.errors.message"), field("Not-connected error", "contact.errors.notConnected", "textarea"),
        stringList("Dropdown option", "contact.matterOptions"),
        field("Thank-you note", "contact.successMessage", "textarea", "Shown after the enquiry is accepted.", true), field("Error note", "contact.errorMessage", "textarea", "Shown if the submission fails.", true), field("Privacy link text", "contact.privacyLabel")
      ]) + repeatGrid(stepCards) + addButton("contact.steps", "step", "Add step")) +
      section("Footer", "Regulatory text, copyright and footer links.", grid([
        field("Regulatory text", "footer.legal", "textarea", "Confirm this with the firm before launch.", true), field("Copyright line", "footer.copyright", "textarea", "", true)
      ]) + repeatGrid(footerLinks) + addButton("footer.links", "link", "Add footer link") + repeatGrid(legalLinks) + addButton("footer.legalLinks", "link", "Add legal link")) +
      section("URL key and destinations", "Every button, image source, email destination and form target in one place.", urlRows.join(""), "url-key");

    bindFields();
  }
  editor.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-act]");
    if (!btn) return;
    var list = getPath(state, btn.getAttribute("data-list"));
    if (!Array.isArray(list)) return;
    var act = btn.getAttribute("data-act"), i = parseInt(btn.getAttribute("data-index"), 10);
    if (act === "add") { var tpl = TEMPLATES[btn.getAttribute("data-tpl")]; list.push(clone({ v: tpl }).v); }
    else if (act === "remove") { if (!window.confirm("Remove this item?")) return; list.splice(i, 1); }
    else if (act === "up" && i > 0) { list.splice(i - 1, 0, list.splice(i, 1)[0]); }
    else if (act === "down" && i < list.length - 1) { list.splice(i + 1, 0, list.splice(i, 1)[0]); }
    var y = window.scrollY; render(); window.scrollTo(0, y);
    saveStatus.textContent = "Unsaved changes. Press Save changes to publish."; saveStatus.style.color = "var(--muted)";
  });
  function bindFields() {
    editor.querySelectorAll("[data-path]").forEach(function (el) {
      el.addEventListener("input", function () { setPath(state, el.getAttribute("data-path"), el.value); });
      el.addEventListener("change", function () { setPath(state, el.getAttribute("data-path"), el.value); });
    });
  }
  async function save() {
    if (!client) { saveStatus.textContent = "Supabase is not configured yet. Fill in assets/js/supabase-config.js first."; saveStatus.style.color = "var(--danger)"; return; }
    saveStatus.textContent = "Saving\u2026"; saveStatus.style.color = "var(--muted)";
    try {
      window.normalizeBrand(state);
      state.revision = defaults.revision;
      var result = await client.from("site_content").upsert({ id: 1, data: state, updated_at: new Date().toISOString() }).select("id");
      if (result.error) throw result.error;
      if (!result.data || !result.data.length) throw new Error("no row was written - check you are signed in and that supabase/setup.sql has been run");
      saveStatus.textContent = "Saved. Live for every visitor now.";
      saveStatus.style.color = "var(--green)";
    } catch (error) {
      saveStatus.textContent = "Could not save (" + (error && error.message ? error.message : "unknown error") + "). Export a JSON backup so you don't lose these edits.";
      saveStatus.style.color = "var(--danger)";
    }
  }
  function download(name, textValue, type) {
    var blob = new Blob([textValue], { type: type });
    var link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = name; link.click();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 500);
  }
  function exportJson() { download("northmerelegal-content.json", JSON.stringify(state, null, 2), "application/json"); }
  async function showApp() {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").classList.add("is-visible");
    state = await loadContent();
    render();
    if (staleLoaded) { saveStatus.textContent = "The saved content is from an older version, so the refreshed copy is loaded here. Review it, then press Save changes to publish."; saveStatus.style.color = "var(--muted)"; }
  }
  function showAuth(message) {
    document.getElementById("app").classList.remove("is-visible");
    document.getElementById("auth").style.display = "grid";
    document.getElementById("password-form").reset();
    var note = document.getElementById("setup-note");
    if (!client) {
      note.textContent = "Supabase is not configured yet. Add your project URL and anon key to assets/js/supabase-config.js, and run supabase/setup.sql in your Supabase project, then reload this page.";
    } else {
      note.textContent = message || "";
    }
  }

  document.getElementById("password-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    var email = document.getElementById("admin-email").value.trim();
    var password = document.getElementById("password").value;
    var status = document.getElementById("auth-status");
    status.textContent = "";
    if (!client) { status.textContent = "Supabase is not configured yet. See the note below."; return; }
    var submitButton = document.getElementById("auth-submit");
    submitButton.disabled = true;
    try {
      var result = await client.auth.signInWithPassword({ email: email, password: password });
      if (result.error) { status.textContent = result.error.message || "Sign-in failed."; return; }
      await showApp();
    } catch (error) {
      status.textContent = "Sign-in failed. Check your connection and try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
  document.getElementById("save").addEventListener("click", save);
  document.getElementById("preview").addEventListener("click", function () { window.open(new URL("../", window.location.href).href, "_blank", "noopener"); });
  document.getElementById("export").addEventListener("click", exportJson);
  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("Replace everything in the editor with the built-in defaults? Nothing goes live until you press Save changes.")) return;
    state = clone(defaults); render();
    saveStatus.textContent = "Defaults loaded. Review, then press Save changes to publish."; saveStatus.style.color = "var(--muted)";
  });
  document.getElementById("lock").addEventListener("click", async function () {
    if (client) { try { await client.auth.signOut(); } catch (error) { /* ignore */ } }
    showAuth();
  });
  document.getElementById("import-file").addEventListener("change", function (event) {
    var file = event.target.files[0]; if (!file) return;
    var reader = new FileReader(); reader.onload = function () { try { var imported = JSON.parse(reader.result); if (imported.version !== defaults.version) throw new Error("version"); state = window.normalizeBrand(merge(clone(defaults), window.cleanLegacyBrand(window.migrateContent(imported)))); state.revision = defaults.revision; render(); saveStatus.textContent = "Imported. Review the fields, then save changes to publish."; saveStatus.style.color = "var(--green)"; } catch (error) { saveStatus.textContent = "That file is not a compatible NorthmereLegal content export."; saveStatus.style.color = "var(--danger)"; } };
    reader.readAsText(file); event.target.value = "";
  });

  (async function start() {
    if (!client) { showAuth(); return; }
    try {
      var sessionResult = await client.auth.getSession();
      if (sessionResult.data && sessionResult.data.session) { await showApp(); return; }
    } catch (error) { /* fall through to the sign-in screen */ }
    showAuth();
  })();
})();
