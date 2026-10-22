/* NorthmereLegal | Shared homepage content
   This file is the safe, dependency-free default for GitHub Pages. */
(function () {
  "use strict";

  /* The firm was previously called "Hartvale". Content saved in Supabase before the
     rename can still contain the old name, so every loader runs it through this. */
  window.cleanLegacyBrand = function clean(value) {
    if (typeof value === "string") {
      return value.replace(/hartvale(\s*legal)?/gi, function (m) {
        var full = /legal/i.test(m), lower = m === m.toLowerCase(), upper = m === m.toUpperCase();
        var out = full ? "NorthmereLegal" : "Northmere";
        return lower ? out.toLowerCase() : upper ? out.toUpperCase() : out;
      });
    }
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === "object") {
      var o = {}; Object.keys(value).forEach(function (k) { o[k] = clean(value[k]); }); return o;
    }
    return value;
  };

  /* Brand integrity. Guarantees the logo letter, firm name, descriptor and copyright
     line are consistent whatever is stored in the database:
     - name falls back to NorthmereLegal and never repeats itself
     - logo letter is always the first letter of the firm name (a stale "H" cannot survive)
     - descriptor never just repeats the firm name
     - copyright line never starts with the firm name again */
  window.normalizeBrand = function (c) {
    if (!c || typeof c !== "object") return c;
    c.brand = c.brand || {};
    var name = String(c.brand.name || "").replace(/\s+/g, " ").trim();
    var rep = /^(.{3,}?)\s*\1$/i.exec(name);
    if (rep) name = rep[1].trim();
    if (!name) name = "NorthmereLegal";
    c.brand.name = name;
    c.brand.mark = name.charAt(0).toUpperCase();
    var d = String(c.brand.descriptor || "").trim();
    if (!d || /northmere/i.test(d) || d.toLowerCase() === name.toLowerCase()) d = "Solicitors";
    c.brand.descriptor = d;
    if (c.footer && typeof c.footer.copyright === "string") {
      c.footer.copyright = c.footer.copyright.replace(/^\s*northmere\s*legal\b[.,:;\s-]*/i, "").trim();
    }
    return c;
  };

  /* Migration. Older saved content stored header navigation as fixed slots
     (header.nav.work / people). The header is now a free list (header.links), so carry
     any saved labels and destinations across instead of losing them. */
  window.migrateContent = function (c) {
    if (!c || typeof c !== "object") return c;
    var h = c.header;
    if (h && h.nav && !Array.isArray(h.links)) {
      var links = window.DEFAULT_SITE_CONTENT.header.links.map(function (l) { return { label: l.label, url: l.url }; });
      links.forEach(function (l) {
        if (l.url === "#services" && h.nav.work) { l.label = h.nav.work; if (h.nav.workUrl) l.url = h.nav.workUrl; }
        if (l.url === "#people" && h.nav.people) { l.label = h.nav.people; if (h.nav.peopleUrl) l.url = h.nav.peopleUrl; }
      });
      h.links = links;
    }
    return c;
  };

  window.DEFAULT_SITE_CONTENT = {
    version: 1,
    revision: 4,
    meta: {
      title: "NorthmereLegal | Independent solicitors in London, Oxford and Edinburgh",
      description: "NorthmereLegal is an independent, partner-led law firm advising private clients, businesses and institutions on wealth, property and disputes across the UK.",
      ogTitle: "NorthmereLegal | Independent, partner-led legal advice",
      ogDescription: "Clear advice on wealth, property and disputes from senior lawyers who stay with your matter from first call to final outcome."
    },
    brand: { name: "NorthmereLegal", descriptor: "Solicitors", mark: "N" },
    header: {
      links: [
        { label: "Home", url: "#top" },
        { label: "Services", url: "#services" },
        { label: "About", url: "#about" },
        { label: "Our Team", url: "#people" },
        { label: "Insights", url: "#insights" },
        { label: "Contact", url: "#contact" }
      ],
      nav: { cta: "Book a Consultation", ctaUrl: "#contact" }
    },
    ui: { skipLink: "Skip to content", menuOpen: "☰ Menu", menuClose: "✕ Close" },
    hero: {
      eyebrow: "Independent. Partner-led.",
      title: "Legal advice that gives you",
      titleAccent: "a clear way forward.",
      lede: "NorthmereLegal advises families, founders and institutions on the decisions that matter most. A senior partner leads every matter, so you always know who is responsible and what happens next.",
      primaryLabel: "Explore our services",
      primaryUrl: "#services",
      secondaryLabel: "Book a consultation",
      secondaryUrl: "#contact",
      imageAlt: "A bright, contemporary professional office",
      caption: "Advice for what comes next.",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=88"
    },
    trust: [
      { title: "Independent", detail: "Owned and run by our partners" },
      { title: "Partner-led", detail: "A senior lawyer on every matter" },
      { title: "Plain-English advice", detail: "Clear options, honest costs" },
      { title: "Discreet", detail: "Confidential by default" }
    ],
    practiceSection: { eyebrow: "What we do", title: "Advice across three core practice areas", intro: "Whether you are protecting a family, shaping a property or resolving a dispute, we give you focused advice and a plan you can act on.", linkLabel: "Discuss your matter →", linkUrl: "#contact" },
    practice: [
      { icon: "person", title: "Private wealth and family", description: "Considered advice on protecting and passing on what you have built, handled with discretion.", items: ["Wills, trusts and estate planning", "Succession and inheritance disputes", "Divorce and financial remedies", "Family business and wealth structuring"], linkLabel: "Discuss a private matter", linkUrl: "#contact" },
      { icon: "building", title: "Property and development", description: "Commercial guidance for buying, selling, developing and managing property of every kind.", items: ["Acquisitions and disposals", "Development and construction", "Landlord and tenant", "Heritage and listed buildings"], linkLabel: "Discuss a property matter", linkUrl: "#contact" },
      { icon: "scales", title: "Business and disputes", description: "Practical, proportionate advice when a business faces change, disagreement or a defining decision.", items: ["Commercial contracts and governance", "Shareholder and partnership disputes", "Litigation and arbitration", "Employment and senior executive matters"], linkLabel: "Discuss a business matter", linkUrl: "#contact" }
    ],
    clients: {
      eyebrow: "Client relationships",
      title: "What our clients value",
      intro: "People choose us for sound judgement, close attention and advice they can act on.",
      leadQuote: "NorthmereLegal turned a complicated family and property position into a plan we could act on. Every conversation was direct, and we always knew who was responsible.",
      leadAttribution: "Private client",
      leadDetail: "Estate and succession planning, London",
      quotes: [
        { quote: "They were clear about the risks from the first meeting and realistic about cost, which made a difficult dispute far easier to manage.", attribution: "Founder, technology company", detail: "Shareholder dispute" },
        { quote: "They understood the building, the planning history and the commercial pressure. Completion arrived on the date we were promised.", attribution: "Director, property investment company", detail: "Acquisition and development" },
        { quote: "Discreet, prompt and always prepared. We never had to explain the same point twice.", attribution: "Trustee, family office", detail: "Trusts and succession, Oxford" }
      ],
      finePrint: "Illustrative client comments written for this concept site. Replace with approved testimonials before launch."
    },
    people: {
      rosterTitle: "Our partners",
      contactPrefix: "Contact",
      title: "Senior lawyers, from first call to final outcome",
      intro: "Every matter is led by a partner. You will always know who is advising you and how to reach them.",
      lead: {
        name: "Oliver Smith", role: "Senior partner", bio: "Oliver leads our private client and property work. He advises families, founders and institutions on matters where legal judgement, discretion and a practical view of the future all count.",
        focus: "Private clients and property", based: "London and Oxford", email: "", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&crop=faces&w=900&q=90", imageAlt: "Mature, natural professional portrait of Oliver Smith, senior partner", buttonLabel: "Contact Oliver", quote: "Understand the issue fully, then give advice that can be acted on.", quoteAttribution: "Oliver Smith, Senior partner"
      },
      partners: [
        { name: "Priya Hart", role: "Partner", focus: "Business and disputes", based: "London", bio: "Priya guides businesses and their owners through shareholder disputes, commercial claims and contested transactions.", email: "", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&w=700&q=90", imageAlt: "Mature, natural professional portrait of Priya Hart, partner" },
        { name: "Marcus Bell", role: "Partner", focus: "Property and development", based: "Oxford", bio: "Marcus advises investors, developers and landowners on acquisitions, planning-led projects and complex lettings.", email: "", imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&crop=faces&w=700&q=90", imageAlt: "Mature, natural professional portrait of Marcus Bell, partner" },
        { name: "Eleanor Shaw", role: "Partner", focus: "Private wealth and family", based: "Edinburgh", bio: "Eleanor helps families plan for succession, resolve inheritance questions and navigate separation with care.", email: "", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=700&q=90", imageAlt: "Mature, natural professional portrait of Eleanor Shaw, partner" }
      ]
    },
    about: {
      eyebrow: "About NorthmereLegal",
      title: "Experience. Integrity. Results.",
      body: "Legal matters are rarely only legal. They shape your plans, your relationships and your future. We take the time to understand the full picture, explain your options plainly and support you in making confident decisions.",
      buttonLabel: "Meet our partners",
      buttonUrl: "#people",
      imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
      imageAlt: "A bright, contemporary professional office",
      stats: [{ value: "1", label: "Named partner on every matter" }, { value: "3", label: "Offices: London, Oxford, Edinburgh" }, { value: "100%", label: "Focused on your outcome" }]
    },
    insights: {
      eyebrow: "Perspectives and insights",
      title: "Questions worth asking before you decide",
      intro: "Good decisions start with the right questions. Here are three places our clients often begin.",
      cards: [
        { category: "Business", title: "Building stronger commercial agreements", description: "Why clear responsibilities, workable terms and good governance protect relationships as well as revenue.", linkLabel: "Talk to our team →", linkUrl: "#contact" },
        { category: "Property", title: "Clarity before a property commitment", description: "The key questions to raise before you commit to a significant purchase, sale or development.", linkLabel: "Talk to our team →", linkUrl: "#contact" },
        { category: "Individuals", title: "Handling sensitive matters with care", description: "How a calm, considered plan can make a difficult personal or family process easier.", linkLabel: "Talk to our team →", linkUrl: "#contact" }
      ]
    },
    contact: {
      eyebrow: "Get in touch",
      title: "Request a consultation",
      lede: "Tell us briefly what you are dealing with. We will review your enquiry and reply with a sensible next step.",
      assuranceTitle: "A considered first step",
      assuranceText: "Use the form to start a conversation with our team. Please do not include confidential documents or urgent deadlines in this first message.",
      formNotice: "Your details are sent securely and used only to respond to your enquiry. We aim to reply within one working day.",
      steps: [
        { title: "We listen first", text: "We understand the issue before we discuss options." },
        { title: "Clear next steps", text: "You know what we need from you and what happens next." }
      ],
      labels: { address: "Our offices", direct: "Email", offices: "Telephone", hours: "Opening hours" },
      formLabel: "Initial enquiry",
      fields: { name: "Full name *", email: "Email address *", phone: "Phone number", matter: "Practice area", message: "How can we help? *", emailPlaceholder: "you@example.com", messagePlaceholder: "A brief, non-confidential summary of your enquiry" },
      errors: { name: "Please enter your name.", email: "Please enter a valid email address.", message: "Please add a short summary of how we can help.", notConnected: "This form is not connected yet. Please use the contact details on this page." },
      submitLabel: "Send enquiry",
      matterPlaceholder: "Select a practice area",
      matterOptions: ["Private wealth and family", "Property and development", "Business and disputes", "General enquiry"],
      london: "",
      email: "contact@NorthmereLegal.com",
      emailHref: "mailto:contact@NorthmereLegal.com",
      phone: "+447378107979",
      phoneHref: "tel:+447378107979",
      otherOffices: "",
      availability: "",
      formSubject: "New enquiry via website",
      formAction: "https://formspree.io/f/xeaeybpl",
      successMessage: "Thank you. Your enquiry has been received and a member of our team will be in touch shortly.",
      errorMessage: "We could not send your enquiry just now. Please try again later.",
      privacyLabel: "privacy information",
      privacyUrl: "#contact"
    },
    footer: {
      legal: "Concept site. Verify all firm, regulatory and contact details before publication.",
      copyright: "All rights reserved. Concept website; names and comments are illustrative.",
      links: [
        { label: "Services", url: "#services" },
        { label: "Clients", url: "#clients" },
        { label: "Our Team", url: "#people" },
        { label: "Contact", url: "#contact" }
      ],
      legalLinks: [
        { label: "Privacy notice", url: "#contact" },
        { label: "Complaints", url: "#contact" },
        { label: "Accessibility", url: "#top" }
      ]
    }
  };
})();
