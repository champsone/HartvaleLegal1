/* HartvaleLegal | Shared homepage content
   This file is the safe, dependency-free default for GitHub Pages. */
(function () {
  "use strict";

  window.DEFAULT_SITE_CONTENT = {
    version: 1,
    meta: {
      title: "HartvaleLegal | Independent legal advice in London, Oxford and Edinburgh",
      description: "HartvaleLegal provides clear, considered legal advice to private clients, businesses and institutions across the UK.",
      ogTitle: "HartvaleLegal | Independent legal advice",
      ogDescription: "Clear, considered legal advice for private clients, businesses and institutions."
    },
    brand: { name: "HartvaleLegal", descriptor: "Solicitors", mark: "H" },
    header: {
      strapline: "Clear, considered legal advice in London, Oxford and Edinburgh",
      phoneDisplay: "TODO: phone number",
      phoneHref: "tel:TODO",
      nav: { work: "Our work", workUrl: "#practice", clients: "Clients", clientsUrl: "#clients", people: "Our people", peopleUrl: "#people", cta: "Start a conversation", ctaUrl: "#contact" }
    },
    hero: {
      title: "Clarity in complexity.",
      lede: "HartvaleLegal advises private clients, businesses and institutions on decisions that deserve careful thought, sound judgement and a clear way forward.",
      primaryLabel: "Arrange a conversation",
      primaryUrl: "#contact",
      secondaryLabel: "View our work",
      secondaryUrl: "#practice",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
      imageAlt: "Geometric glass office facade against a pale sky",
      caption: "Advice for what comes next."
    },
    trust: [
      { title: "Independent", detail: "Owned and run by its partners" },
      { title: "Three offices", detail: "London, Oxford and Edinburgh" },
      { title: "Partner-led", detail: "Senior lawyers on every matter" },
      { title: "Regulated", detail: "Solicitors Regulation Authority" }
    ],
    practice: [
      { title: "Private wealth and family", description: "Practical advice on wealth, succession and family arrangements, handled with discretion and care.", items: ["Wills, trusts and estate planning", "Succession and inheritance disputes", "Divorce and financial remedies", "Family business and wealth structuring"], linkLabel: "Discuss a private matter", linkUrl: "#contact" },
      { title: "Property and the built world", description: "Commercial guidance for acquisitions, development, investment and the places clients are responsible for.", items: ["Acquisitions and disposals", "Development and construction", "Landlord and tenant", "Heritage and listed buildings"], linkLabel: "Discuss a property matter", linkUrl: "#contact" },
      { title: "Business and disputes", description: "Clear strategic advice for businesses facing change, disagreement or a decision with lasting consequences.", items: ["Commercial contracts and governance", "Shareholder and partnership disputes", "Litigation and arbitration", "Employment and senior executive matters"], linkLabel: "Discuss a business matter", linkUrl: "#contact" }
    ],
    clients: {
      title: "What clients say.",
      intro: "Clients come to us for clear judgement, close attention and advice they can act on.",
      leadQuote: "HartvaleLegal took a complicated family and property position and turned it into a plan we could act on. Every conversation was direct, and we always knew who was responsible.",
      leadAttribution: "Private client",
      leadDetail: "Estate and succession planning, London",
      quotes: [
        { quote: "Clear about the risks from the first meeting and realistic about the costs. That made a difficult dispute far easier to manage.", attribution: "Founder, technology company", detail: "Shareholder dispute" },
        { quote: "They understood the building, the planning history and the commercial pressure. Completion arrived on the date we were promised.", attribution: "Director, property investment company", detail: "Acquisition and development" },
        { quote: "Discreet, prompt and always prepared. We never had to explain the same point twice.", attribution: "Trustee, family office", detail: "Trusts and succession, Oxford" }
      ],
      finePrint: "Illustrative client comments written for this concept site."
    },
    people: {
      title: "Advice from senior lawyers.",
      intro: "Every matter is led by a partner, so you always know who is responsible for your advice.",
      lead: {
        name: "Oliver Smith", role: "Senior partner", bio: "Oliver leads the firm’s private client and property work. He advises families, founders and institutions on matters where legal judgement, discretion and a practical view of the future matter.",
        focus: "Private clients and property", based: "London and Oxford", email: "TODO@replace-with-real-email.example", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85", imageAlt: "Portrait of Oliver Smith, senior partner", buttonLabel: "Contact Oliver", quote: "Understand the issue fully. Give advice that can be acted on.", quoteAttribution: "Oliver Smith, senior partner"
      },
      partners: [
        { name: "Priya Hart", focus: "Business and disputes", email: "TODO@replace-with-real-email.example", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Priya Hart" },
        { name: "Marcus Bell", focus: "Property and the built world", email: "TODO@replace-with-real-email.example", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Marcus Bell" },
        { name: "Eleanor Shaw", focus: "Private wealth and family", email: "TODO@replace-with-real-email.example", imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Eleanor Shaw" }
      ]
    },
    contact: {
      title: "Find the right way forward.",
      lede: "Tell us briefly what you are dealing with. We will review your enquiry and come back to you with a sensible next step.",
      london: "TODO: street address\nTODO: city, postcode",
      email: "TODO@replace-with-real-email.example",
      emailHref: "mailto:TODO@replace-with-real-email.example",
      phone: "TODO: phone number",
      phoneHref: "tel:TODO",
      otherOffices: "TODO: other office locations, or delete this row",
      availability: "TODO: opening hours",
      formSubject: "New enquiry",
      formAction: "https://formspree.io/f/YOUR_FORM_ID",
      successMessage: "Thank you. Your enquiry has been sent. We will be in touch shortly.",
      errorMessage: "We could not send your enquiry right now. Please try again or email us directly.",
      privacyLabel: "privacy notice",
      privacyUrl: "#"
    },
    footer: {
      legal: "TODO: replace with your real legal notice \u2014 registered name, company/LLP number, SRA (or other regulator) number, and registered office address. Do not publish this site with placeholder numbers.",
      copyright: "TODO: replace with real firm name, or delete this line if the notice above already covers it.",
      privacyUrl: "#",
      complaintsUrl: "#",
      accessibilityUrl: "#"
    }
  };
})();
