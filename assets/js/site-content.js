/* Ashford Vale | Shared homepage content
   This file is the safe, dependency-free default for GitHub Pages. */
(function () {
  "use strict";

  window.DEFAULT_SITE_CONTENT = {
    version: 1,
    meta: {
      title: "Ashford Vale | Independent legal advice in London, Oxford and Edinburgh",
      description: "Ashford Vale provides clear, considered legal advice to private clients, businesses and institutions across the UK.",
      ogTitle: "Ashford Vale | Independent legal advice",
      ogDescription: "Clear, considered legal advice for private clients, businesses and institutions."
    },
    brand: { name: "Ashford Vale", descriptor: "Solicitors", mark: "A" },
    header: {
      strapline: "Clear, considered legal advice in London, Oxford and Edinburgh",
      phoneDisplay: "020 7946 0180",
      phoneHref: "tel:+442079460180",
      nav: { work: "Our work", workUrl: "#practice", clients: "Clients", clientsUrl: "#clients", people: "Our people", peopleUrl: "#people", cta: "Start a conversation", ctaUrl: "#contact" }
    },
    hero: {
      title: "Clarity in complexity.",
      lede: "Ashford Vale advises private clients, businesses and institutions on decisions that deserve careful thought, sound judgement and a clear way forward.",
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
      leadQuote: "Ashford Vale took a complicated family and property position and turned it into a plan we could act on. Every conversation was direct, and we always knew who was responsible.",
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
        focus: "Private clients and property", based: "London and Oxford", email: "oliver.smith@ashfordvale.co.uk", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85", imageAlt: "Portrait of Oliver Smith, senior partner", buttonLabel: "Contact Oliver", quote: "Understand the issue fully. Give advice that can be acted on.", quoteAttribution: "Oliver Smith, senior partner"
      },
      partners: [
        { name: "Priya Hart", focus: "Business and disputes", email: "priya.hart@ashfordvale.co.uk", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Priya Hart" },
        { name: "Marcus Bell", focus: "Property and the built world", email: "marcus.bell@ashfordvale.co.uk", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Marcus Bell" },
        { name: "Eleanor Shaw", focus: "Private wealth and family", email: "eleanor.shaw@ashfordvale.co.uk", imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Eleanor Shaw" }
      ]
    },
    contact: {
      title: "Find the right way forward.",
      lede: "Tell us briefly what you are dealing with. We will review your enquiry and come back to you with a sensible next step.",
      london: "1 Farringdon Street\nLondon EC4A 4BL",
      email: "hello@ashfordvale.co.uk",
      emailHref: "mailto:hello@ashfordvale.co.uk",
      phone: "+44 (0)20 7946 0180",
      phoneHref: "tel:+442079460180",
      otherOffices: "Oxford and Edinburgh\nBy appointment",
      availability: "Monday to Friday\n08:30 to 18:00, UK time",
      formSubject: "New Ashford Vale enquiry",
      formAction: "https://formspree.io/f/YOUR_FORM_ID",
      successMessage: "Thank you. Your enquiry has been sent. We will be in touch shortly.",
      errorMessage: "We could not send your enquiry right now. Please try again or email us directly.",
      privacyLabel: "privacy notice",
      privacyUrl: "#"
    },
    footer: {
      legal: "Ashford Vale LLP is a limited liability partnership registered in England and Wales (number OC000000) and is authorised and regulated by the Solicitors Regulation Authority (SRA number 000000). Scottish legal services are provided through our Edinburgh office and regulated by the Law Society of Scotland. Registered office: 1 Farringdon Street, London EC4A 4BL.",
      copyright: "Ashford Vale LLP. Concept website: the firm, names and portraits are illustrative.",
      privacyUrl: "#",
      complaintsUrl: "#",
      accessibilityUrl: "#"
    }
  };
})();
