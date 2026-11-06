/**
 * Builds a wa.me link. `number` must include the country code (e.g. 919876543210).
 * Returns null when no number is configured so callers never render a dead button.
 */
export function whatsappUrl(number: string | null | undefined, message: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(input: {
  productName: string;
  variant?: string | null;
  price?: string | null;
  url: string;
  city?: string | null;
}) {
  const lines = [
    "Hi OM Telecom, I'd like to buy:",
    `• ${input.productName}${input.variant ? ` (${input.variant})` : ""}`,
  ];
  if (input.price) lines.push(`• Listed price: ${input.price}`);
  if (input.city) lines.push(`• My city: ${input.city}`);
  lines.push(`• Link: ${input.url}`);
  lines.push("", "Please confirm availability and the best offer.");
  return lines.join("\n");
}
