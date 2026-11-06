"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { finePointer, getLenis, loadGsap, reducedMotion, requestRefresh, startLenis } from "@/lib/motion";

/**
 * One motion runtime for the whole site.
 *
 *  One-shot reveals (IntersectionObserver → GSAP tween; never ScrollTrigger, so they
 *  can't misfire when pins are added or fonts/images change the layout):
 *    [data-split]   word-mask rise (words split on the server); data-split="now" plays on load
 *    [data-reveal]  rise / fade ("fade"), data-delay in ms
 *    [data-clip]    image unmask with a slow zoom-out
 *    [data-count]   count-up number
 *  Scrubbed (ScrollTrigger):
 *    [data-drift]   parallax, value = % travel
 *  Also: Lenis smooth scroll on the GSAP ticker, magnetic buttons, layout-change refreshes.
 */
let popNav = false;
const positions = new Map<string, number>();

export function MotionRuntime() {
  const pathname = usePathname();

  // Smooth scroll (fine pointers only, never with reduced motion)
  useEffect(() => {
    if (reducedMotion() || !finePointer()) return;
    let off = false;
    let destroy = () => {};
    startLenis().then((d) => {
      if (off) d();
      else destroy = d;
    });
    const onIntroDone = () => {
      getLenis()?.start();
      requestRefresh(0);
    };
    window.addEventListener("om:intro-done", onIntroDone);
    return () => {
      off = true;
      destroy();
      window.removeEventListener("om:intro-done", onIntroDone);
    };
  }, []);

  // Recalculate scroll scenes whenever the layout settles (fonts, images, resizes).
  useEffect(() => {
    const onLoadCapture = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === "IMG") requestRefresh(150);
    };
    document.addEventListener("load", onLoadCapture, true);
    window.addEventListener("load", () => requestRefresh(0), { once: true });
    document.fonts?.ready.then(() => requestRefresh(0));
    return () => document.removeEventListener("load", onLoadCapture, true);
  }, []);

  // Remember where the visitor was on each page (pinned scenes make the browser's own
  // restoration unreliable: the page is briefly shorter until the pins are rebuilt).
  useEffect(() => {
    let raf = 0;
    const save = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => positions.set(location.pathname, window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    const onPop = () => (popNav = true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // New pages start at the top; Back/Forward returns to the saved position once the
  // page's scroll scenes have been rebuilt.
  useEffect(() => {
    const target = popNav ? (positions.get(pathname) ?? 0) : 0;
    popNav = false;
    const to = (y: number) => {
      const l = getLenis();
      if (l) l.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    to(0);
    requestRefresh(60);
    if (target <= 0) return;
    const timer = setTimeout(() => {
      to(target);
      loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.update());
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  // One-shot reveals
  useEffect(() => {
    if (reducedMotion()) return;
    let off = false;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    loadGsap().then(({ gsap }) => {
      if (off) return;
      const play = (el: HTMLElement) => {
        const delay = Number(el.dataset.delay ?? 0) / 1000;
        if (el.hasAttribute("data-split")) {
          gsap.fromTo(el.querySelectorAll(".w-in"), { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.06, delay });
        } else if (el.hasAttribute("data-reveal")) {
          gsap.to(el, { opacity: 1, y: 0, duration: 1.15, ease: "expo.out", delay });
        } else if (el.hasAttribute("data-clip")) {
          gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.5, ease: "expo.inOut", delay });
          const img = el.querySelector("img");
          if (img) gsap.to(img, { scale: 1, duration: 1.9, ease: "expo.out", delay: delay + 0.1 });
        } else if (el.hasAttribute("data-count")) {
          const end = Number(el.dataset.count);
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", delay, onUpdate: () => (el.textContent = String(Math.round(o.v))) });
        }
      };

      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io!.unobserve(e.target);
            (e.target as HTMLElement).dataset.played = "";
            play(e.target as HTMLElement);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
      );

      const scan = () => {
        document.querySelectorAll<HTMLElement>("[data-split]:not([data-played]), [data-reveal]:not([data-played]), [data-clip]:not([data-played]), [data-count]:not([data-played])").forEach((el) => {
          if (el.dataset.split === "manual") return;
          if (el.dataset.split === "now") {
            el.dataset.played = "";
            play(el);
          } else io!.observe(el);
        });
      };
      scan();
      // Catch elements rendered later (client components, filters, overlays).
      mo = new MutationObserver(() => scan());
      mo.observe(document.body, { childList: true, subtree: true });
    });

    return () => {
      off = true;
      io?.disconnect();
      mo?.disconnect();
    };
  }, [pathname]);

  // Scrubbed parallax
  useEffect(() => {
    if (reducedMotion()) return;
    let off = false;
    let revert = () => {};
    // setTimeout (not rAF) so it also runs in background tabs; it just waits for the new route's DOM.
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"));
      if (!els.length) return;
      loadGsap().then(({ gsap }) => {
        if (off) return;
        const ctx = gsap.context(() => {
          els.forEach((el) => {
            const a = Number(el.dataset.drift || 12);
            gsap.fromTo(el, { yPercent: -a / 2 }, { yPercent: a / 2, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
          });
        });
        revert = () => ctx.revert();
        requestRefresh();
      });
    }, 0);
    return () => {
      off = true;
      clearTimeout(timer);
      revert();
    };
  }, [pathname]);

  // Magnetic buttons
  useEffect(() => {
    if (reducedMotion() || !finePointer()) return;
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px, 0)`;
    };
    const onOut = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (t && !t.contains(e.relatedTarget as Node)) t.style.transform = "";
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return null;
}
