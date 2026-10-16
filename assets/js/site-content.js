/* NorthmereLegal | Shared homepage content
   This file is the safe, dependency-free default for GitHub Pages. */
(function () {
  "use strict";

  window.DEFAULT_SITE_CONTENT = {
    version: 1,
    meta: {
      title: "NorthmereLegal | Independent legal advice in London, Oxford and Edinburgh",
      description: "NorthmereLegal provides clear, considered legal advice to private clients, businesses and institutions across the UK.",
      ogTitle: "NorthmereLegal | Independent legal advice",
      ogDescription: "Clear, considered legal advice for private clients, businesses and institutions."
    },
    brand: { name: "NorthmereLegal", descriptor: "Solicitors", mark: "N" },
    header: {
      nav: { work: "Our work", workUrl: "#practice", clients: "Clients", clientsUrl: "#clients", people: "Our people", peopleUrl: "#people", cta: "Start a conversation", ctaUrl: "#contact" }
    },
    hero: {
      eyebrow: "Trusted legal partners",
      title: "Clarity in complexity.",
      lede: "NorthmereLegal advises private clients, businesses and institutions on decisions that deserve careful thought, sound judgement and a clear way forward.",
      primaryLabel: "Arrange a conversation",
      primaryUrl: "#contact",
      secondaryLabel: "View our work",
      secondaryUrl: "#practice",
      imageAlt: "Contemporary professional office interior",
      caption: "Advice for what comes next.",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=88"
    },
    trust: [
      { title: "Independent", detail: "Owned and run by its partners" },
      { title: "Client-focused", detail: "Advice shaped around your situation" },
      { title: "Partner-led", detail: "Senior lawyers on every matter" },
      { title: "Discreet", detail: "Careful handling of sensitive matters" }
    ],
    practiceSection: { title: "Comprehensive Legal Services", intro: "Practical support across the matters that shape your life, business and future.", linkLabel: "Discuss your needs →", linkUrl: "#contact" },
    practice: [
      { icon: "person", title: "Private wealth and family", description: "Practical advice on wealth, succession and family arrangements, handled with discretion and care.", items: ["Wills, trusts and estate planning", "Succession and inheritance disputes", "Divorce and financial remedies", "Family business and wealth structuring"], linkLabel: "Discuss a private matter", linkUrl: "#contact" },
      { icon: "building", title: "Property and the built world", description: "Commercial guidance for acquisitions, development, investment and the places clients are responsible for.", items: ["Acquisitions and disposals", "Development and construction", "Landlord and tenant", "Heritage and listed buildings"], linkLabel: "Discuss a property matter", linkUrl: "#contact" },
      { icon: "scales", title: "Business and disputes", description: "Clear strategic advice for businesses facing change, disagreement or a decision with lasting consequences.", items: ["Commercial contracts and governance", "Shareholder and partnership disputes", "Litigation and arbitration", "Employment and senior executive matters"], linkLabel: "Discuss a business matter", linkUrl: "#contact" }
    ],
    clients: {
      title: "What clients say.",
      intro: "Clients come to us for clear judgement, close attention and advice they can act on.",
      leadQuote: "NorthmereLegal took a complicated family and property position and turned it into a plan we could act on. Every conversation was direct, and we always knew who was responsible.",
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
      rosterTitle: "Our partners",
      title: "Advice from senior lawyers.",
      intro: "Every matter is led by a partner, so you always know who is responsible for your advice.",
      lead: {
        name: "Oliver Smith", role: "Senior partner", bio: "Oliver leads the firm’s private client and property work. He advises families, founders and institutions on matters where legal judgement, discretion and a practical view of the future matter.",
        focus: "Private clients and property", based: "London and Oxford", email: "", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85", imageAlt: "Portrait of Oliver Smith, senior partner", buttonLabel: "Contact Oliver", quote: "Understand the issue fully. Give advice that can be acted on.", quoteAttribution: "Oliver Smith, senior partner"
      },
      partners: [
        { name: "Priya Hart", focus: "Business and disputes", email: "", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Priya Hart" },
        { name: "Marcus Bell", focus: "Property and the built world", email: "", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Marcus Bell" },
        { name: "Eleanor Shaw", focus: "Private wealth and family", email: "", imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85", imageAlt: "Portrait of Eleanor Shaw" }
      ]
    },
    about: {
      eyebrow: "About NorthmereLegal",
      title: "Experience. Integrity. Results.",
      body: "Legal matters are rarely just legal matters. We take time to understand the full picture, explain your options clearly and help you make informed decisions.",
      buttonLabel: "Meet the firm",
      buttonUrl: "#people",
      imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
      stats: [{ value: "01", label: "Clear point of contact" }, { value: "360°", label: "Whole-picture thinking" }, { value: "100%", label: "Focused on your matter" }]
    },
    insights: {
      eyebrow: "Perspectives & insights",
      title: "Make your next decision a stronger one.",
      intro: "Good decisions start with the right questions. Our team can help you understand the issues that matter and the options available to you.",
      cards: [
        { category: "Business", title: "Building stronger commercial agreements", description: "Understand the value of clear responsibilities, workable terms and good governance.", linkLabel: "Talk to our team →", linkUrl: "#contact" },
        { category: "Property", title: "Clarity before a property commitment", description: "Key questions to raise before you make a significant property decision.", linkLabel: "Talk to our team →", linkUrl: "#contact" },
        { category: "Individuals", title: "Handling sensitive matters with care", description: "Why clear advice and a considered plan can make a difficult process easier.", linkLabel: "Talk to our team →", linkUrl: "#contact" }
      ]
    },
    contact: {
      eyebrow: "Get in touch",
      title: "Request a Consultation",
      lede: "Tell us briefly what you are dealing with. We will review your enquiry and come back to you with a sensible next step.",
      assuranceTitle: "A considered first step",
      assuranceText: "Use the form below to start a conversation with our team. Please do not include confidential documents or urgent deadlines in this initial message.",
      formNotice: "This enquiry form must be connected to a secure form service before launch.",
      steps: [
        { title: "We listen first", text: "Understand the issue before discussing options." },
        { title: "Clear next steps", text: "Know what information may be needed next." }
      ],
      labels: { address: "Our Office", direct: "Email Us", offices: "Call Us", hours: "Business Hours" },
      formLabel: "Initial enquiry",
      submitLabel: "Send enquiry",
      matterPlaceholder: "Select a practice",
      matterOptions: ["Private wealth and family", "Property and the built world", "Business and disputes", "General enquiry"],
      london: "",
      email: "",
      emailHref: "",
      phone: "",
      phoneHref: "",
      otherOffices: "",
      availability: "",
      formSubject: "New enquiry",
      formAction: "",
      successMessage: "Thank you. Your enquiry has been sent. We will be in touch shortly.",
      errorMessage: "We could not send your enquiry right now. Please try again later.",
      privacyLabel: "privacy information",
      privacyUrl: "#contact"
    },
    footer: {
      legal: "This is a design concept. Verify all firm, regulatory and contact details before publication.",
      copyright: "Concept website. Names and sample comments are illustrative.",
      links: [
        { label: "Our work", url: "#practice" },
        { label: "Clients", url: "#clients" },
        { label: "Our people", url: "#people" },
        { label: "Contact", url: "#contact" }
      ],
      legalLinks: [
        { label: "Privacy information", url: "#contact" },
        { label: "Complaints information", url: "#contact" },
        { label: "Accessibility statement", url: "#main" }
      ]
    }
  };
})();
