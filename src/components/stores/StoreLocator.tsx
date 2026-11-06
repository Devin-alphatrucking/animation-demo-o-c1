"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Store } from "@/lib/data";
import { ArrowUpRight } from "@/components/ui/icons";

const directions = (s: Store) => `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
const embed = (s: Store) => `https://www.google.com/maps?q=${s.lat},${s.lng}&z=15&output=embed`;
const path = (s: Store) => `/stores/${s.stateSlug}/${s.citySlug}/${s.slug}`;

/** City tabs + store list + live map of the selected store. */
export function StoreLocator({ stores, demo }: { stores: Store[]; demo: boolean }) {
  const cities = useMemo(() => [...new Map(stores.map((s) => [s.citySlug, s.city])).entries()], [stores]);
  const [city, setCity] = useState("all");
  const [q, setQ] = useState("");
  const list = stores.filter((s) => (city === "all" || s.citySlug === city) && (!q || `${s.area} ${s.city} ${s.pincode}`.toLowerCase().includes(q.toLowerCase())));
  const [selected, setSelected] = useState<string>(stores[0]?.slug ?? "");
  const current = list.find((s) => s.slug === selected) ?? list[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="store-q">
            Search by area or pincode
          </label>
          <input id="store-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Area or pincode" className="h-12 flex-1 rounded-full bg-white px-5 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-om" />
        </div>
        <div className="scrollbar-none -mx-1 mt-4 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Filter by city">
          {[["all", "All cities"] as const, ...cities].map(([slug, name]) => (
            <button key={slug} type="button" aria-pressed={city === slug} onClick={() => setCity(slug)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${city === slug ? "bg-ink text-paper" : "bg-white ring-1 ring-black/8 hover:ring-black/30"}`}>
              {name}
            </button>
          ))}
        </div>

        <ul className="mt-8">
          {list.length === 0 && <li className="py-10 text-ink-2">No stores match that search yet.</li>}
          {list.map((s, i) => (
            <li key={s.slug} className="border-t border-line-light last:border-b">
              <div
                role="button"
                tabIndex={0}
                onMouseEnter={() => setSelected(s.slug)}
                onFocus={() => setSelected(s.slug)}
                onClick={() => setSelected(s.slug)}
                onKeyDown={(e) => e.key === "Enter" && setSelected(s.slug)}
                className={`group grid cursor-pointer grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 transition-colors ${current?.slug === s.slug ? "text-ink" : "text-ink-2"}`}
              >
                <span className={`num text-sm ${current?.slug === s.slug ? "text-om" : "text-mute"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="display-soft block text-2xl md:text-3xl">{s.area}</span>
                  <span className="text-sm text-mute">
                    {s.city}, {s.state} · {s.pincode}
                    {demo && " · sample location"}
                  </span>
                </span>
                <span className="flex gap-2">
                  <a href={directions(s)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hidden rounded-full px-4 py-2 text-sm font-medium ring-1 ring-black/10 transition-colors hover:bg-ink hover:text-paper sm:inline-flex">
                    Directions
                  </a>
                  <Link href={path(s)} onClick={(e) => e.stopPropagation()} aria-label={`${s.name} details`} className="flex size-10 items-center justify-center rounded-full bg-paper-2 transition-[background-color,color,transform] duration-500 hover:rotate-45 hover:bg-om hover:text-white">
                    <ArrowUpRight />
                  </Link>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        {current && (
          <div className="overflow-hidden rounded-[32px] bg-night text-white">
            <iframe key={current.slug} title={`Map of ${current.name}`} src={embed(current)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[340px] w-full grayscale-[35%] md:h-[460px]" />
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="kicker text-om">Selected</p>
                <p className="display-soft mt-1 text-2xl">{current.name}</p>
              </div>
              <a href={directions(current)} target="_blank" rel="noopener noreferrer" className="pill pill-light !h-11">
                Get directions <ArrowUpRight />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
