"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { ALL_PRODUCTS, BRAND_LIST, GROUPS } from "@/lib/data";
import { formatINR } from "@/lib/format";
import { lockScroll } from "@/lib/motion";

/** Instant search over the static catalogue — no server round-trip. */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open || wasOpen.current) lockScroll(open);
    wasOpen.current = open;
    if (open) setTimeout(() => input.current?.focus(), 50);
  }, [open]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return { products: [], brands: [] };
    const words = t.split(/\s+/);
    const match = (s: string) => words.every((w) => s.toLowerCase().includes(w));
    return {
      products: ALL_PRODUCTS.filter((p) => match(`${p.name} ${p.brand.name} ${p.category.name}`)).slice(0, 8),
      brands: BRAND_LIST.filter((b) => match(b.name)).slice(0, 4),
    };
  }, [q]);

  const links = [...results.products.map((p) => `/products/${p.slug}`), ...results.brands.map((b) => `/brands/${b.slug}`)];
  const go = (href: string) => {
    onClose();
    setQ("");
    router.push(href);
  };

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-[60] flex flex-col bg-night/96 text-white backdrop-blur-md" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="shell flex items-center gap-4 border-b border-line-dark py-6">
        <Search className="size-6 text-om" />
        <input
          ref={input}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, links.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && links[active]) go(links[active]);
          }}
          placeholder="Search phones, laptops, brands…"
          aria-label="Search the catalogue"
          className="display-soft min-w-0 flex-1 bg-transparent text-[clamp(1.6rem,4vw,3rem)] outline-none placeholder:text-white/25"
        />
        <button type="button" onClick={onClose} aria-label="Close search" className="flex size-12 items-center justify-center rounded-full border border-white/20 hover:border-white/60">
          <X className="size-5" />
        </button>
      </div>
      <div className="shell flex-1 overflow-y-auto py-8">
        {q.trim().length < 2 ? (
          <div>
            <p className="kicker text-mute">Browse</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {GROUPS.map((g) => (
                <li key={g.key}>
                  <button type="button" onClick={() => go(g.href)} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-om hover:text-om">
                    {g.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : links.length === 0 ? (
          <p className="text-lg text-white/60">Nothing matches “{q}”. Try a brand name like Samsung or a model like “Pixel”.</p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <ul>
              {results.products.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} onClick={onClose} onMouseEnter={() => setActive(i)} className={`flex items-baseline justify-between gap-4 border-b border-line-dark py-4 transition-colors ${active === i ? "text-om" : ""}`}>
                    <span>
                      <span className="kicker block text-mute">{p.brand.name}</span>
                      <span className="display-soft text-2xl">{p.name}</span>
                    </span>
                    <span className="num text-sm text-white/70">from {formatINR(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {results.brands.length > 0 && (
              <div>
                <p className="kicker text-mute">Brands</p>
                <ul className="mt-3 space-y-2">
                  {results.brands.map((b) => (
                    <li key={b.slug}>
                      <Link href={`/brands/${b.slug}`} onClick={onClose} className="display-soft text-2xl hover:text-om">
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
