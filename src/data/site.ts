import type { PhotoKey } from "@/data/images.generated";

/**
 * Site-wide content and contact details. This is the one file to edit before launch.
 * Empty strings are hidden on the site — nothing here is invented.
 */
type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  url: string;
  description: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  hours: string;
  social: Record<string, string>;
  demoCatalogue: boolean;
  demoStores: boolean;
};

export const SITE: SiteConfig = {
  name: "OM Telecom",
  legalName: "OM Telecom LLP",
  tagline: "Connecting you, everyday",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Smartphones, laptops, tablets, wearables and accessories from the brands you trust. Compare online, then buy over WhatsApp or at an OM Telecom store near you.",

  /** Business WhatsApp number with country code, digits only — e.g. "919876543210". */
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  gstin: "",
  hours: "",
  social: { instagram: "", facebook: "", youtube: "", x: "" },

  /** True while prices/specs are sample data. Shows a small notice on product pages. */
  demoCatalogue: true,
  /** True while store addresses are placeholders. */
  demoStores: true,
};

/** Homepage "why us" points — written as how the service works, not as unverifiable claims. */
export const PROMISES: { title: string; text: string }[] = [
  { title: "Talk before you pay", text: "Every order starts as a WhatsApp chat. Ask about stock, colours, delivery and offers before anything is confirmed." },
  { title: "Hold it first", text: "Visit a branch to try phones in hand and compare them side by side with someone who knows them." },
  { title: "Pay the way that suits you", text: "Ask our team which EMI, exchange and bank offers apply to the device you want." },
  { title: "Set up, not just sold", text: "Our staff help with setup, data transfer and warranty questions after you buy." },
];

/** Ways to save. Kept evergreen on purpose — the team confirms what's live in chat. */
export const SAVINGS: { key: string; title: string; text: string; photo: PhotoKey }[] = [
  { key: "exchange", title: "Exchange your old phone", text: "Bring your current device or send photos on WhatsApp for an exchange value towards a new one.", photo: "android-pair" },
  { key: "emi", title: "EMI options", text: "Spread the cost over months. Ask which EMI plans and cards are eligible for your device.", photo: "typing" },
  { key: "bank", title: "Bank & card offers", text: "Instant discounts run with selected banks from time to time. We'll tell you what applies today.", photo: "phone-modern" },
  { key: "festive", title: "Festive offers", text: "Diwali, Navratri, Eid and year-end — seasonal offers on phones, laptops and accessories.", photo: "phone-bokeh" },
];

export const FRANCHISE = {
  headline: "Open an OM Telecom store in your city",
  intro:
    "We're looking for partners who know their market and want to run a modern phone and electronics store with an established name behind it.",
  model:
    "Partners run an OM Telecom-branded store selling smartphones, accessories and electronics, supported by our central team. Exact terms are shared during the discussion stage.",
  support: "Store design guidance, staff onboarding, sourcing and marketing support are discussed with each partner.",
  investment: "Investment depends on the city, location and store size. Details are shared after an initial conversation.",
  benefits: [
    { title: "A name customers know", text: "Trade under the OM Telecom brand and visual identity." },
    { title: "Central sourcing", text: "Work with our team on product range, merchandising and promotions." },
    { title: "Training", text: "Onboarding for you and your store staff before you open." },
  ],
  steps: [
    { title: "Send your details", text: "Fill in the short form — it opens WhatsApp with your details ready to send." },
    { title: "First conversation", text: "Our franchise team calls you to understand your plans and location." },
    { title: "Location review", text: "We review the proposed site together." },
    { title: "Agreement & launch", text: "Sign, set up and prepare for opening day." },
  ],
  faqs: [
    { q: "How long does it take to open?", a: "It depends on the location and paperwork. We'll share a realistic timeline after the first conversation." },
    { q: "Do I need retail experience?", a: "It helps, but tell us about your background either way — every enquiry is read by the team." },
    { q: "Where are you looking for partners?", a: "Tell us the city and area you have in mind and we'll discuss it with you." },
  ],
};

const DRAFT = "Draft — to be reviewed before launch.";

export const POLICIES: Record<"privacy-policy" | "terms-and-conditions" | "return-policy" | "shipping-policy", { title: string; body: string }> = {
  "privacy-policy": {
    title: "Privacy policy",
    body: `${DRAFT}\n\n## What we collect\nThis website does not use accounts or store your personal details. When you choose to message us on WhatsApp, the conversation takes place in WhatsApp and is covered by WhatsApp's own terms and privacy policy.\n\n## Your browser\nWe may remember small preferences in your browser, such as the city you selected. You can clear them at any time from your browser settings.`,
  },
  "terms-and-conditions": {
    title: "Terms and conditions",
    body: `${DRAFT}\n\n## Prices and availability\nPrices, offers and stock shown on this website are indicative. Our team confirms the final price, availability and offers before any sale.\n\n## Purchases\nPurchases are completed in store or after confirmation with our team over WhatsApp.`,
  },
  "return-policy": {
    title: "Return policy",
    body: `${DRAFT}\n\n## Returns and replacements\nReturns and replacements follow the manufacturer's warranty terms and the conditions confirmed at the time of sale.`,
  },
  "shipping-policy": {
    title: "Shipping policy",
    body: `${DRAFT}\n\n## Delivery and pickup\nDelivery and store pickup options are confirmed with our team over WhatsApp when you place your request.`,
  },
};
