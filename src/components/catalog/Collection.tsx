"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/data";
import { reducedMotion } from "@/lib/motion";
import { ProductCard } from "@/components/product/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "newest";
const BANDS = [
  { key: "all", label: "Any price", min: 0, max: Infinity },
  { key: "u20", label: "Under ₹20k", min: 0, max: 20000 },
  { key: "20-50", label: "₹20k–50k", min: 20000, max: 50000 },
  { key: "50-100", label: "₹50k–1L", min: 50000, max: 100000 },
  { key: "100", label: "Above ₹1L", min: 100000, max: Infinity },
];

/**
 * Client-side filtering over static data. When the result set changes, GSAP Flip animates
 * cards from their old positions to the new ones (entering cards scale in, leaving fade).
 */
export function Collection({ products, showBrands = true }: { products: Product[]; showBrands?: boolean }) {
  const [brand, setBrand] = useState<string>("all");
  const [band, setBand] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<unknown>(null);

  const brands = useMemo(() => {
    const m = new Map<string, { name: string; slug: string; n: number }>();
    for (const p of products) {
      const b = m.get(p.brand.slug) ?? { ...p.brand, n: 0 };
      b.n++;
      m.set(p.brand.slug, b);
    }
    return [...m.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  }, [products]);

  const shown = useMemo(() => {
    const b = BANDS.find((x) => x.key === band)!;
    const list = products.filter((p) => (brand === "all" || p.brand.slug === brand) && p.price >= b.min && p.price < b.max);
    const score = (p: Product) => Number(p.bestseller) * 2 + Number(p.trending) + Number(p.isNew) * 0.5;
    return [...list].sort((x, y) => {
      if (sort === "price-asc") return x.price - y.price;
      if (sort === "price-desc") return y.price - x.price;
      if (sort === "newest") return (y.launch ?? "").localeCompare(x.launch ?? "") || score(y) - score(x);
      return score(y) - score(x) || x.name.localeCompare(y.name);
    });
  }, [products, brand, band, sort]);

  // Capture positions before React commits the new order…
  const capture = async () => {
    if (reducedMotion() || !grid.current) return;
    const { Flip } = await import("gsap/Flip");
    const { gsap } = await import("gsap");
    gsap.registerPlugin(Flip);
    flipState.current = Flip.getState(grid.current.children);
  };
  const update = (fn: () => void) => {
    capture().finally(fn);
  };

  // …then animate from them after it does.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    Promise.all([import("gsap"), import("gsap/Flip")]).then(([{ gsap }, { Flip }]) => {
      gsap.registerPlugin(Flip);
      Flip.from(state as Parameters<typeof Flip.from>[0], {
        targets: grid.current!.children,
        duration: 0.8,
        ease: "expo.inOut",
        stagger: 0.02,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.25 }),
      });
    });
  }, [shown]);

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${active ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-black/8 hover:ring-black/30"}`;

  return (
    <div>
      <div className="under-header sticky z-20 -mx-5 mb-10 border-b border-line-light bg-paper/90 px-5 py-4 backdrop-blur-lg md:-mx-10 md:px-10 xl:-mx-14 xl:px-14">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {showBrands && brands.length > 1 ? (
            <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Filter by brand">
              <button type="button" className={chip(brand === "all")} aria-pressed={brand === "all"} onClick={() => update(() => setBrand("all"))}>
                All brands
              </button>
              {brands.map((b) => (
                <button key={b.slug} type="button" className={chip(brand === b.slug)} aria-pressed={brand === b.slug} onClick={() => update(() => setBrand(b.slug))}>
                  {b.name} <span className="num ml-1 text-xs opacity-50">{b.n}</span>
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="band">
              Price
            </label>
            <select id="band" value={band} onChange={(e) => update(() => setBand(e.target.value))} className="h-10 rounded-full bg-white px-4 text-sm font-medium ring-1 ring-black/8 outline-none">
              {BANDS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="sort">
              Sort
            </label>
            <select id="sort" value={sort} onChange={(e) => update(() => setSort(e.target.value as Sort))} className="h-10 rounded-full bg-white px-4 text-sm font-medium ring-1 ring-black/8 outline-none">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <p className="kicker mb-6 text-mute" aria-live="polite">
        {shown.length} model{shown.length === 1 ? "" : "s"}
      </p>
      {shown.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-line-light p-14 text-center">
          <p className="display-soft text-3xl">Nothing in this range.</p>
          <button type="button" onClick={() => update(() => (setBrand("all"), setBand("all")))} className="link-grow mt-4 font-semibold text-om">
            Clear filters
          </button>
        </div>
      ) : (
        <ul ref={grid} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <li key={p.slug} data-flip-id={p.slug}>
              <ProductCard p={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
