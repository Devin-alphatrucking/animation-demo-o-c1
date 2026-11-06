"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { scenesEnabled, withGsap } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { Arrow } from "@/components/ui/icons";

/**
 * Signature hero: a phone-shaped window of night-city light sits between the two halves of
 * the headline. Scrolling opens the "screen" into a full-bleed photograph while the words
 * part and the caption rises (pinned + scrubbed on desktop). On touch / reduced motion it
 * is a static composition.
 */
export function ScreenHero({ brandCount }: { brandCount: number }) {
  const root = useRef<HTMLElement>(null);

  // Layout effect: the pin is reverted before React removes the DOM on navigation.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reveal = () =>
      withGsap(el, ({ gsap }) => {
        // Entrance
        gsap.fromTo(el.querySelectorAll("[data-hero-word]"), { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.08, ease: "expo.out" });
        gsap.fromTo(el.querySelector("[data-hero-window]"), { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out" });
        gsap.fromTo(el.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, delay: 0.5 });

        if (!scenesEnabled()) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=130%", scrub: 0.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10 },
        });
        // Start from the phone-shaped window measured in px (CSS calc() can't be tweened).
        const start = () => {
          const t = innerHeight * 0.17;
          const s = innerWidth / 2 - innerHeight * 0.17;
          return `inset(${t}px ${s}px ${t}px ${s}px round 44px)`;
        };
        tl.fromTo("[data-hero-window]", { clipPath: start }, { clipPath: "inset(0px 0px 0px 0px round 0px)", immediateRender: false }, 0)
          .fromTo("[data-hero-window] img", { scale: 1.35 }, { scale: 1 }, 0)
          .to("[data-hero-island]", { opacity: 0, y: -20, duration: 0.15 }, 0)
          .to("[data-hero-left]", { xPercent: -70, opacity: 0 }, 0)
          .to("[data-hero-right]", { xPercent: 70, opacity: 0 }, 0)
          .to("[data-hero-hint]", { opacity: 0, duration: 0.1 }, 0)
          .fromTo("[data-hero-shade]", { opacity: 0 }, { opacity: 1 }, 0.35)
          .fromTo("[data-hero-caption] > *", { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: 0.04 }, 0.5);
      });

    let cleanup = () => {};
    if (document.documentElement.getAttribute("data-intro") === "play") {
      const onDone = () => (cleanup = reveal());
      window.addEventListener("om:intro-done", onDone, { once: true });
      return () => {
        window.removeEventListener("om:intro-done", onDone);
        cleanup();
      };
    }
    cleanup = reveal();
    return () => cleanup();
  }, []);

  // The outer div is what React mounts/unmounts; GSAP wraps the inner <section> in a
  // pin-spacer, so React never has to remove a node that GSAP has moved.
  return (
    <div>
      <section ref={root} aria-label="OM Telecom" className="room-night grain relative isolate h-[100svh] min-h-[40rem] overflow-hidden">
        {/* The screen */}
        <div
          data-hero-window
          className="absolute inset-0 [clip-path:inset(17vh_calc(50%_-_17vh)_17vh_calc(50%_-_17vh)_round_44px)] max-lg:[clip-path:inset(29vh_calc(50%_-_15.5vh)_17vh_calc(50%_-_15.5vh)_round_34px)]"
        >
          <Photo name="hero-night" alt="A phone held up on a busy street at night, its screen lit with the city behind it" eager sizes="100vw" position="50% 45%" className="scale-[1.35]" />
          <div data-hero-shade className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/10 opacity-0" />
          <span data-hero-island aria-hidden="true" className="absolute left-1/2 top-[calc(17vh_+_14px)] h-6 w-[min(30%,7rem)] -translate-x-1/2 rounded-full bg-black max-lg:top-[calc(29vh_+_12px)]" />
        </div>

        {/* Headline halves */}
        <h1 className="display hero-headline pointer-events-none absolute inset-x-0 top-[13vh] flex flex-col items-center text-center lg:top-1/2 lg:-translate-y-1/2 lg:flex-row lg:justify-between lg:px-[2.5vw] lg:text-left">
          <span data-hero-left className="block overflow-hidden pb-[0.06em]">
            <span data-hero-word className="block">
              Your next
            </span>
          </span>
          <span data-hero-right className="block overflow-hidden pb-[0.06em] lg:text-right">
            <span data-hero-word className="block text-om">
              phone.
            </span>
          </span>
        </h1>

        {/* Caption revealed as the screen opens (always visible below lg) */}
        <div data-hero-caption className="absolute inset-x-0 bottom-0 z-10 hidden lg:block">
          <div className="shell flex items-end justify-between gap-10 pb-14">
            <div>
              <p className="kicker text-om">{brandCount} brands · one store team</p>
              <p className="display-soft mt-4 max-w-2xl text-[clamp(2rem,3.6vw,3.8rem)]">Compare it in hand. Buy it over WhatsApp.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/mobiles" className="pill pill-om" data-magnetic>
                Shop mobiles <Arrow />
              </Link>
              <Link href="/stores" className="pill pill-ghost">
                Find a store
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-4 px-5 lg:hidden">
          <p data-hero-fade className="max-w-xs text-center text-sm text-white/70">
            Compare it in hand. Buy it over WhatsApp.
          </p>
          <div data-hero-fade className="flex gap-2">
            <Link href="/mobiles" className="pill pill-om !h-12">
              Shop mobiles
            </Link>
            <Link href="/stores" className="pill pill-ghost !h-12">
              Stores
            </Link>
          </div>
        </div>

        <p data-hero-hint data-hero-fade aria-hidden="true" className="kicker absolute bottom-9 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-white/50 lg:flex">
          <span className="block h-8 w-px animate-pulse bg-white/40" /> Scroll to open the screen
        </p>
      </section>
    </div>
  );
}
