import type { MetadataRoute } from "next";
import { ALL_PRODUCTS, BRAND_LIST, GROUPS, POST_LIST, STORES } from "@/lib/data";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  const cities = [...new Set(STORES.map((s) => `/stores/${s.stateSlug}/${s.citySlug}`))];
  const pages = ["/", "/brands", "/offers", "/stores", "/franchise", "/about-us", "/contact-us", "/blog", ...GROUPS.map((g) => g.href)];
  return [
    ...pages.map((p) => ({ url: u(p), priority: p === "/" ? 1 : 0.8 })),
    ...BRAND_LIST.map((b) => ({ url: u(`/brands/${b.slug}`), priority: 0.6 })),
    ...cities.map((c) => ({ url: u(c), priority: 0.6 })),
    ...POST_LIST.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, priority: 0.5 })),
    // Product and store pages join the sitemap once the catalogue and branch list are real.
    ...(SITE.demoCatalogue ? [] : ALL_PRODUCTS.map((p) => ({ url: u(`/products/${p.slug}`), priority: 0.7 }))),
    ...(SITE.demoStores ? [] : STORES.map((s) => ({ url: u(`/stores/${s.stateSlug}/${s.citySlug}/${s.slug}`), priority: 0.5 }))),
  ];
}
