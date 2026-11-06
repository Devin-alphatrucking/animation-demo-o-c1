"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { withGsap } from "@/lib/motion";

/**
 * Endless brand ticker. Scroll velocity speeds it up, scroll direction flips it, hover
 * slows it. One looping tween; speed and skew are eased on the GSAP ticker (no tweens are
 * created per scroll event).
 */
export function BrandTicker({ brands }: { brands: { name: string; slug: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      withGsap(root.current, ({ gsap, ScrollTrigger }) => {
        const t = track.current!;
        const el = root.current!;
        const loop = gsap.to(t, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
        const skewTo = gsap.quickTo(t, "skewX", { duration: 0.5, ease: "power3" });
        let dir = 1;
        let boost = 0;
        let hover = false;
        let speed = 1;

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            dir = self.direction;
            const v = self.getVelocity();
            boost = Math.max(boost, Math.min(5, Math.abs(v) / 400));
            skewTo(gsap.utils.clamp(-6, 6, -v / 300));
          },
        });

        const tick = () => {
          boost *= 0.92;
          const target = dir * (hover ? 0.25 : 1 + boost);
          speed += (target - speed) * 0.08;
          loop.timeScale(speed);
          if (boost < 0.05) skewTo(0);
        };
        gsap.ticker.add(tick);

        const on = () => (hover = true);
        const off = () => (hover = false);
        el.addEventListener("mouseenter", on);
        el.addEventListener("mouseleave", off);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          el.removeEventListener("mouseenter", on);
          el.removeEventListener("mouseleave", off);
        };
      }),
    [],
  );

  const row = (dup: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={dup || undefined}>
      {brands.map((b) => (
        <li key={b.slug} className="flex items-center">
          <Link href={`/brands/${b.slug}`} tabIndex={dup ? -1 : undefined} className="display px-7 text-[clamp(2.6rem,6vw,5.5rem)] text-white/90 transition-colors duration-300 hover:text-om md:px-10">
            {b.name}
          </Link>
          <span className="text-2xl text-om" aria-hidden="true">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className="room-night overflow-hidden border-y border-line-dark py-8 md:py-10" aria-label="Brands we sell">
      <div ref={track} className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
