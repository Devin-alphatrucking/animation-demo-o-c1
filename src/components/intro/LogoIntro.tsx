"use client";

import { useLayoutEffect, useRef } from "react";
import { LOGO_H, LOGO_SRC, LOGO_W } from "@/components/brand/Logo";

const PLAYED_KEY = "om-intro-played";
let mounted = 0;

/**
 * Cinematic homepage intro (gated by the inline script in app/layout.tsx).
 *  1. Logo rises and sharpens at the centre of a white stage   (0.7s)
 *  2. A light sweep crosses the mark                             (0.5s)
 *  3. The SAME element flies into the header logo's exact box   (1.1s, Flip.fit)
 *     while the stage splits open like a curtain onto the night hero
 *  4. The header logo takes over invisibly; hero copy staggers in (0.7s)
 */
export function LogoIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    const logo = logoRef.current;
    const sweep = sweepRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!root || !logo || html.getAttribute("data-intro") !== "play") return;

    try {
      sessionStorage.setItem(PLAYED_KEY, "1");
    } catch {
      /* storage blocked — the intro may replay, which is harmless */
    }
    root.classList.add("is-running");
    mounted++;

    let finished = false;
    let kill = () => {};

    const finish = () => {
      if (finished) return;
      finished = true;
      html.setAttribute("data-intro", "done");
      root.style.display = "none";
      window.dispatchEvent(new Event("om:intro-done"));
    };

    Promise.all([import("gsap"), import("gsap/Flip"), logo.complete && logo.naturalWidth ? Promise.resolve() : logo.decode()])
      .then(([{ gsap }, { Flip }]) => {
        if (finished) return;
        gsap.registerPlugin(Flip);
        const target = document.querySelector<HTMLImageElement>("img[data-site-logo]");
        const tl = gsap.timeline({ onComplete: finish });
        kill = () => tl.kill();
        if (process.env.NODE_ENV !== "production") (window as unknown as { __omIntro?: unknown }).__omIntro = tl;

        tl.fromTo(logo, { opacity: 0, scale: 0.82, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" });
        tl.fromTo(sweep, { xPercent: -130 }, { xPercent: 130, duration: 0.5, ease: "power2.inOut" });

        if (target && target.getBoundingClientRect().width > 0) {
          tl.add(Flip.fit(logo, target, { scale: true, duration: 1.1, ease: "expo.inOut" }) as gsap.core.Tween, ">-0.05");
          tl.to(top, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "<0.2");
          tl.to(bottom, { yPercent: 100, duration: 0.9, ease: "expo.inOut" }, "<");
          tl.to("[data-intro-hide]", { opacity: 1, duration: 0.6, ease: "power2.out" }, "<0.35");
        } else {
          tl.to(root, { opacity: 0, duration: 0.6 });
        }
      })
      .catch(finish);

    return () => {
      mounted--;
      kill();
      finished = true;
      setTimeout(() => {
        if (mounted === 0 && html.getAttribute("data-intro") === "play") html.setAttribute("data-intro", "done");
      }, 0);
    };
  }, []);

  return (
    <div ref={rootRef} className="om-intro fixed inset-0 z-[100]" aria-hidden="true">
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-white" />
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[min(70vw,440px)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- GSAP Flip measures and moves this exact element */}
          <img ref={logoRef} src={LOGO_SRC} width={LOGO_W} height={LOGO_H} alt="" fetchPriority="high" className="relative z-10 h-auto w-full opacity-0 will-change-transform" />
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-soft-light">
            <div ref={sweepRef} className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,.95) 50%, transparent 65%)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
