"use client";

import { useEffect, useRef } from "react";
import { withGsap } from "@/lib/motion";

/** A paragraph that "lights up" word by word as it scrolls through the viewport. */
export function Statement({ text, kicker, accent = [] }: { text: string; kicker: string; accent?: string[] }) {
  const root = useRef<HTMLElement>(null);

  useEffect(
    () =>
      withGsap(root.current, ({ gsap }) => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 45%", scrub: true } },
        );
      }),
    [],
  );

  return (
    <section ref={root} className="room-paper shell py-28 md:py-40" aria-label={kicker}>
      <p className="kicker mb-8 text-om">{kicker}</p>
      <p className="display-soft max-w-[18ch] text-[clamp(2.2rem,5.4vw,5.6rem)] leading-[1.02]" aria-label={text}>
        {text.split(" ").map((w, i) => {
          const clean = w.replace(/[^\w’']/g, "");
          return (
            <span key={i} aria-hidden="true">
              <span data-word className={accent.includes(clean) ? "text-om" : undefined}>
                {w}
              </span>{" "}
            </span>
          );
        })}
      </p>
    </section>
  );
}
