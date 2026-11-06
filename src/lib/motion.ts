"use client";

import type Lenis from "lenis";

/**
 * Shared GSAP + Lenis runtime.
 *
 * Scroll stability rules (the reasons behind this file):
 *  - ONE frame loop: Lenis is driven by gsap.ticker (autoRaf off), so smooth-scroll
 *    position and ScrollTrigger pins update in the same frame — no jitter.
 *  - ScrollTrigger is used only for scrubbed/pinned scenes. One-shot reveals use
 *    IntersectionObserver (see MotionRuntime), so they can't misfire when pins are
 *    added or the layout shifts.
 *  - Every scene asks for a refresh through requestRefresh(), which batches calls,
 *    sorts triggers into page order and recalculates once.
 */
export type Gsap = typeof import("gsap").gsap;
export type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Bundle = { gsap: Gsap; ScrollTrigger: ST };

let bundle: Promise<Bundle> | null = null;
let lenis: Lenis | null = null;

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
export const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
/** Pinned, scrubbed scenes only run on large screens with a mouse/trackpad. */
export const scenesEnabled = () => !reducedMotion() && isDesktop() && finePointer();

export function loadGsap(): Promise<Bundle> {
  if (!bundle) {
    bundle = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
      const gsap = g.gsap;
      const ScrollTrigger = s.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: "expo.out", duration: 1.1 });
      ScrollTrigger.config({ ignoreMobileResize: true });
      gsap.ticker.lagSmoothing(0);
      // Development aid for inspecting scroll scenes from the console.
      if (process.env.NODE_ENV !== "production") (window as unknown as { __motion?: unknown }).__motion = { gsap, ScrollTrigger, lenis: () => lenis };
      return { gsap, ScrollTrigger };
    });
    // If GSAP can't load (offline, blocked), un-hide everything that was waiting for it.
    bundle.catch(() => document.documentElement.classList.remove("js"));
  }
  return bundle;
}

/** Starts Lenis on the GSAP ticker. Returns a destroy function. */
export async function startLenis(): Promise<() => void> {
  const [{ default: LenisCtor }, { gsap, ScrollTrigger }] = await Promise.all([import("lenis"), loadGsap()]);
  const l = new LenisCtor({ lerp: 0.12, wheelMultiplier: 1, touchMultiplier: 1, autoRaf: false, anchors: { offset: -88 } });
  l.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => l.raf(time * 1000);
  gsap.ticker.add(raf);
  lenis = l;
  // Hold the page still while the logo intro plays.
  if (document.documentElement.getAttribute("data-intro") === "play") l.stop();
  return () => {
    gsap.ticker.remove(raf);
    l.destroy();
    if (lenis === l) lenis = null;
  };
}

export const getLenis = () => lenis;

/** Pause page scroll while an overlay is open. */
export function lockScroll(locked: boolean) {
  const introPlaying = document.documentElement.getAttribute("data-intro") === "play";
  if (lenis) {
    if (locked) lenis.stop();
    else if (!introPlaying) lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
/** Batched, ordered ScrollTrigger refresh. Safe to call often. */
export function requestRefresh(delay = 80) {
  if (typeof window === "undefined") return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    loadGsap().then(({ ScrollTrigger }) => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  }, delay);
}

/**
 * Runs a GSAP setup function inside a gsap.context scoped to `scope`, after GSAP loads,
 * then requests one ordered refresh. Returns a cleanup for useEffect.
 * Skips entirely when the visitor prefers reduced motion.
 */
export function withGsap(scope: Element | null, setup: (b: Bundle) => void | (() => void)) {
  if (!scope || reducedMotion()) return () => {};
  let off = false;
  let revert = () => {};
  loadGsap().then((b) => {
    if (off) return;
    const ctx = b.gsap.context(() => setup(b), scope);
    revert = () => ctx.revert();
    requestRefresh();
  });
  return () => {
    off = true;
    revert();
    requestRefresh();
  };
}
