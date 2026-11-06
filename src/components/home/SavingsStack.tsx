"use client";

import { useEffect, useRef } from "react";
import type { SAVINGS } from "@/data/site";
import { withGsap } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";

/**
 * Stacking cards: each card sticks, and as the next one slides over it the previous card
 * scales back and dims — a deck being dealt as you scroll.
 */
export function SavingsStack({ items, waUrl }: { items: typeof SAVINGS; waUrl: string | null }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      withGsap(root.current, ({ gsap }) => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          const tl = gsap.timeline({ scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true } });
          tl.to(card.querySelector("[data-stack-inner]"), { scale: 0.9 - (cards.length - i) * 0.01, ease: "none" }, 0).to(card.querySelector("[data-stack-shade]"), { opacity: 0.45, ease: "none" }, 0);
        });
      }),
    [],
  );

  return (
    <div ref={root} className="space-y-6 pb-[10vh]">
      {items.map((s, i) => (
        <article key={s.key} data-stack-card className="sticky top-[12vh]" style={{ zIndex: i + 1 }}>
          <div data-stack-inner className="room-night relative grid origin-top overflow-hidden rounded-[32px] will-change-transform md:min-h-[68vh] md:grid-cols-2">
            <div data-stack-shade aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-black opacity-0" />
            <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
              <span className="num text-sm text-white/50">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display text-[clamp(2.4rem,4.6vw,4.6rem)]">{s.title}</h3>
                <p className="text-lead mt-5 max-w-md text-white/70">{s.text}</p>
                {waUrl && (
                  <a href={`${waUrl}${encodeURIComponent(`\nI'm asking about: ${s.title}`)}`} target="_blank" rel="noopener noreferrer" className="link-grow mt-8 inline-block font-semibold text-om">
                    Ask what&apos;s running today →
                  </a>
                )}
              </div>
            </div>
            <div className="relative min-h-[18rem]">
              <Photo name={s.photo} alt="" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
