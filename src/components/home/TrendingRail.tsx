"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/data";
import { scenesEnabled, withGsap } from "@/lib/motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Arrow } from "@/components/ui/icons";

/**
 * Pinned horizontal rail: vertical scroll drives the track sideways on desktop, with a
 * progress bar. Touch devices get a native swipeable row instead.
 */
export function TrendingRail({ products, title, kicker, href }: { products: Product[]; title: string; kicker: string; href: string }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      withGsap(root.current, ({ gsap }) => {
        if (!scenesEnabled()) return;
        const t = track.current!;
        const distance = () => Math.max(0, t.scrollWidth - t.clientWidth);
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 5,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });
      }),
    [],
  );

  return (
    <section ref={root} className="room-night relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-20 lg:h-[100svh] lg:min-h-[40rem] lg:py-12" aria-label={title}>
      <div className="shell flex items-end justify-between gap-6">
        <div>
          <p className="kicker text-om">{kicker}</p>
          <h2 className="display text-title mt-4">{title}</h2>
        </div>
        <Link href={href} className="pill pill-ghost hidden md:inline-flex" data-magnetic>
          View all <Arrow />
        </Link>
      </div>
      <ul ref={track} className="scrollbar-none mt-12 flex lg:mt-[min(3rem,5vh)] snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:px-10 lg:snap-none lg:overflow-visible lg:px-14">
        {products.map((p, i) => (
          <li key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[24rem] lg:w-[26rem]" data-reveal data-delay={Math.min(i, 4) * 80}>
            <ProductCard p={p} tone="night" index={i} className="min-h-[23rem] lg:min-h-[min(23rem,52vh)]" />
          </li>
        ))}
        <li className="flex w-[60vw] shrink-0 snap-start items-center justify-center sm:w-[18rem]">
          <Link href={href} className="display group flex flex-col items-center gap-4 text-center text-4xl">
            <span className="flex size-24 items-center justify-center rounded-full border border-white/25 transition-[background-color,border-color] duration-500 group-hover:border-om group-hover:bg-om">
              <Arrow className="size-7" />
            </span>
            See every model
          </Link>
        </li>
      </ul>
      <div className="shell mt-10 hidden lg:block">
        <div className="h-px w-full bg-white/10">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-om" />
        </div>
      </div>
    </section>
  );
}
