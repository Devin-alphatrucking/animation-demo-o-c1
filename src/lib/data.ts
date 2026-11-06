import { BRANDS, CATEGORIES, PRODUCTS, type P } from "@/data/catalog-source";
import { STORE_SOURCE } from "@/data/stores-source";
import { POSTS } from "@/data/posts";
import type { PhotoKey } from "@/data/images.generated";
import type { DeviceKind, GroupKey } from "@/data/types";
import { discountPercent, slugify } from "@/lib/format";

/* Everything here is computed once from the static data files at build time. */

export type Group = { key: GroupKey; label: string; short: string; href: string; blurb: string; line: string; photo: PhotoKey; alt: string };

export const GROUPS: Group[] = [
  { key: "mobiles", short: "Mobiles", label: "Mobiles", href: "/mobiles", blurb: "5G phones from every major brand", line: "The phone you'll reach for a hundred times a day.", photo: "phone-apps-night", alt: "Smartphone screen glowing in a dark room" },
  { key: "laptops", short: "Laptops", label: "Laptops", href: "/laptops", blurb: "Thin, light and built for work", line: "For the assignment, the start-up and the late shift.", photo: "laptop-desk", alt: "Laptop on a wooden desk beside a coffee mug and phone" },
  { key: "tablets", short: "Tablets", label: "Tablets", href: "/tablets", blurb: "Draw, study, stream", line: "A bigger canvas for notes, sketches and films.", photo: "tablet-sketch", alt: "Hand sketching on a tablet with a stylus" },
  { key: "smartwatches", short: "Watches", label: "Smartwatches", href: "/smartwatches", blurb: "Health and notifications on your wrist", line: "Steps, sleep and messages — without reaching for your phone.", photo: "watch-wrist", alt: "Smartwatch on a wrist showing the time" },
  { key: "accessories", short: "Audio", label: "Audio & accessories", href: "/accessories", blurb: "Earbuds, headphones, chargers", line: "The small things that make a phone yours.", photo: "earbuds-neon", alt: "Wireless earbuds and case under red and blue light" },
  { key: "electronics", short: "TV & Gaming", label: "TV & gaming", href: "/electronics", blurb: "Smart TVs, speakers, controllers", line: "Match night, movie night, game night.", photo: "tv-cheer", alt: "Person cheering in front of a television in a living room" },
];

export const groupByKey = (k: string) => GROUPS.find((g) => g.key === k);

export type Category = { name: string; slug: string; kind: DeviceKind; group: GroupKey; description: string };
export const CATEGORY_LIST: Category[] = CATEGORIES.map((c) => ({ name: c.name, slug: slugify(c.name), kind: c.kind, group: c.navGroup as GroupKey, description: c.description }));

export type Brand = { name: string; slug: string; tagline: string; accent: string; featured: boolean; count: number };

export type Variant = { sku: string; storage: string | null; color: string; hex: string; price: number; mrp: number };

export type Product = {
  slug: string;
  name: string;
  brand: { name: string; slug: string };
  category: Category;
  group: GroupKey;
  short: string;
  highlights: string[];
  variants: Variant[];
  price: number;
  mrp: number;
  discount: number;
  colors: { name: string; hex: string }[];
  storages: string[];
  trending: boolean;
  bestseller: boolean;
  isNew: boolean;
  labels: string[];
  launch: string | null;
};

function toProduct(p: P): Product {
  const category = CATEGORY_LIST.find((c) => c.name === p.category)!;
  const variants: Variant[] = p.variants.map((v) => ({
    sku: slugify(`${p.name}-${v.storage ?? "std"}-${v.color}`),
    storage: v.storage ?? null,
    color: v.color,
    hex: v.hex,
    price: v.price,
    mrp: v.mrp,
  }));
  const cheapest = variants.reduce((a, b) => (b.price < a.price ? b : a));
  const colors = [...new Map(variants.map((v) => [v.color, v.hex])).entries()].map(([name, hex]) => ({ name, hex }));
  const storages = [...new Set(variants.map((v) => v.storage).filter((s): s is string => !!s))];
  return {
    slug: slugify(p.name),
    name: p.name,
    brand: { name: p.brand, slug: slugify(p.brand) },
    category,
    group: category.group,
    short: p.short,
    highlights: p.highlights,
    variants,
    price: cheapest.price,
    mrp: cheapest.mrp,
    discount: discountPercent(cheapest.price, cheapest.mrp),
    colors,
    storages,
    trending: !!p.flags?.includes("trending"),
    bestseller: !!p.flags?.includes("bestseller"),
    isNew: !!p.flags?.includes("new"),
    labels: p.labels ?? [],
    launch: p.launch ?? null,
  };
}

export const ALL_PRODUCTS: Product[] = PRODUCTS.map(toProduct);

export const BRAND_LIST: Brand[] = BRANDS.map((b) => ({
  name: b.name,
  slug: slugify(b.name),
  tagline: b.tagline,
  accent: b.accent,
  featured: !!b.featured,
  count: ALL_PRODUCTS.filter((p) => p.brand.name === b.name).length,
}));

export const getProduct = (slug: string) => ALL_PRODUCTS.find((p) => p.slug === slug) ?? null;
export const getBrand = (slug: string) => BRAND_LIST.find((b) => b.slug === slug) ?? null;
export const productsInGroup = (g: GroupKey) => ALL_PRODUCTS.filter((p) => p.group === g);
export const productsOfBrand = (slug: string) => ALL_PRODUCTS.filter((p) => p.brand.slug === slug);
export const trending = () => ALL_PRODUCTS.filter((p) => p.trending);
export const bestSellers = () => ALL_PRODUCTS.filter((p) => p.bestseller);
export const newLaunches = () => ALL_PRODUCTS.filter((p) => p.isNew).sort((a, b) => (b.launch ?? "").localeCompare(a.launch ?? ""));

export function related(p: Product, n = 4) {
  return ALL_PRODUCTS.filter((x) => x.slug !== p.slug && x.category.slug === p.category.slug)
    .sort((a, b) => Number(b.brand.slug === p.brand.slug) - Number(a.brand.slug === p.brand.slug) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, n);
}

// ───────── Stores ─────────

export type Store = {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  area: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
};

export const STORES: Store[] = STORE_SOURCE.map((s) => ({
  name: `OM Telecom ${s.area}`,
  slug: slugify(`${s.area}-${s.city}`),
  state: s.state,
  stateSlug: slugify(s.state),
  city: s.city,
  citySlug: slugify(s.city),
  area: s.area,
  address: `${s.area}, ${s.city}`,
  pincode: s.pincode,
  lat: s.lat,
  lng: s.lng,
  phone: "",
  hours: "",
}));

export function storeDirectory() {
  const states = new Map<string, { name: string; slug: string; cities: Map<string, { name: string; slug: string; stores: Store[] }> }>();
  for (const s of STORES) {
    const st = states.get(s.stateSlug) ?? { name: s.state, slug: s.stateSlug, cities: new Map() };
    const c = st.cities.get(s.citySlug) ?? { name: s.city, slug: s.citySlug, stores: [] };
    c.stores.push(s);
    st.cities.set(s.citySlug, c);
    states.set(s.stateSlug, st);
  }
  return [...states.values()].map((s) => ({ ...s, cities: [...s.cities.values()] }));
}

export const storePath = (s: Pick<Store, "stateSlug" | "citySlug" | "slug">) => `/stores/${s.stateSlug}/${s.citySlug}/${s.slug}`;
export const directionsUrl = (s: Pick<Store, "lat" | "lng">) => `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
export const mapEmbedUrl = (s: Pick<Store, "lat" | "lng">) => `https://www.google.com/maps?q=${s.lat},${s.lng}&z=15&output=embed`;

// ───────── Blog ─────────

export type Post = { slug: string; title: string; kind: string; excerpt: string; content: string; date: string };
export const POST_LIST: Post[] = POSTS.map((p, i) => ({
  slug: slugify(p.title),
  title: p.title,
  kind: ({ GUIDE: "Buying guide", COMPARISON: "Comparison", NEWS: "News" } as Record<string, string>)[p.kind] ?? "Guide",
  excerpt: p.excerpt,
  content: p.content,
  date: ["2026-10-30", "2026-10-22", "2026-10-12"][i] ?? "2026-10-01",
}));
export const getPost = (slug: string) => POST_LIST.find((p) => p.slug === slug) ?? null;

/** Real, countable facts — used by the animated counters. Never hard-code marketing numbers. */
export function siteFacts() {
  const dir = storeDirectory();
  return {
    brands: BRAND_LIST.length,
    products: ALL_PRODUCTS.length,
    stores: STORES.length,
    cities: dir.reduce((n, s) => n + s.cities.length, 0),
  };
}
