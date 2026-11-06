"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Group } from "@/lib/data";
import { finePointer, withGsap } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { ArrowUpRight } from "@/components/ui/icons";

/**
 * Numbered index of product rooms. On desktop a photo follows the cursor (quickTo, so it
 * trails smoothly) and swaps with a clip wipe; on touch each row shows its photo inline.
 */
export function GroupIndex({ rows }: { rows: (Group & { count: number })[] }) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(
    () =>
      withGsap(root.current, ({ gsap }) => {
        if (!finePointer()) return;
        const c = card.current!;
        const xTo = gsap.quickTo(c, "x", { duration: 0.7, ease: "power3" });
        const yTo = gsap.quickTo(c, "y", { duration: 0.7, ease: "power3" });
        const rTo = gsap.quickTo(c, "rotation", { duration: 0.9, ease: "power3" });
        let lastX = 0;
        const move = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect();
          xTo(e.clientX - r.left - c.offsetWidth / 2);
          yTo(e.clientY - r.top - c.offsetHeight / 2);
          rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
        };
        root.current!.addEventListener("pointermove", move);
        return () => root.current?.removeEventListener("pointermove", move);
      }),
    [],
  );

  return (
    <div ref={root} className="relative" onPointerLeave={() => setActive(null)}>
      <ol>
        {rows.map((g, i) => (
          <li key={g.key} className="overflow-hidden border-b border-line-light first:border-t">
            <Link href={g.href} data-reveal data-delay={i * 70} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[4rem_1fr_1fr_auto] md:py-8">
              <span className="num text-sm text-mute">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[clamp(2.2rem,5.4vw,5.2rem)] transition-[transform,color] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4 group-hover:text-om">{g.label}</span>
              <span className="hidden text-ink-2 md:block">{g.line}</span>
              <span className="flex items-center gap-3">
                <span className="num hidden text-sm text-mute sm:inline">{g.count} models</span>
                <span className="flex size-12 items-center justify-center rounded-full bg-paper-2 transition-[background-color,color,transform] duration-500 group-hover:rotate-45 group-hover:bg-om group-hover:text-white">
                  <ArrowUpRight />
                </span>
              </span>
              <span className="relative col-span-3 mt-2 block aspect-[16/9] overflow-hidden rounded-2xl md:hidden">
                <Photo name={g.photo} alt={g.alt} sizes="100vw" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {/* Cursor-follow preview (desktop) */}
      <div ref={card} aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 z-10 hidden h-[22rem] w-[17rem] overflow-hidden rounded-[28px] shadow-2xl transition-[opacity,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:block ${active === null ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}>
        {rows.map((g, i) => (
          <div key={g.key} className="absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)]" style={{ clipPath: active === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}>
            <Photo name={g.photo} alt="" sizes="272px" />
          </div>
        ))}
      </div>
    </div>
  );
}
