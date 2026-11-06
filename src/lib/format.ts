const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,29,999 — Indian digit grouping, whole rupees. */
export function formatINR(amount: number) {
  return inr.format(amount);
}

export function discountPercent(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(d: Date | string) {
  return dateFmt.format(typeof d === "string" ? new Date(d) : d);
}

export function formatDateTime(d: Date | string) {
  return dateTimeFmt.format(typeof d === "string" ? new Date(d) : d);
}

/** Collapses a list like ["8 GB / 128 GB", "8 GB / 256 GB"] for compact card display. */
export function uniqueNonEmpty<T>(values: (T | null | undefined)[]) {
  return [...new Set(values.filter((v): v is T => v !== null && v !== undefined && v !== ""))];
}
