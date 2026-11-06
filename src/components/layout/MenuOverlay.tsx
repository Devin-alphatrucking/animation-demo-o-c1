"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GROUPS } from "@/lib/data";
import { SITE } from "@/data/site";
import { lockScroll, loadGsap, reducedMotion } from "@/lib/motion";
import { whatsappUrl } from "@/lib/whatsapp";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppIcon } from "@/components/ui/icons";

const SECONDARY = [
  { href: "/brands", label: "Brands" },
  { href: "/offers", label: "Offers" },
  { href: "/stores", label: "Store locator" },
  { href: "/franchise", label: "Franchise" },
  { href: "/blog", label: "Buying guides" },
  { href: "/about-us", label: "About us" },
  { href: "/contact-us", label: "Contact" },
];

/** Full-screen index: a curtain drops, numbered rows rise, hovering previews the room's photo. */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);
  const wasOpen = useRef(false);
  const wa = whatsappUrl(SITE.whatsapp, "Hi OM Telecom, I have a question.");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (open || wasOpen.current) lockScroll(open);
    wasOpen.current = open;
    if (reducedMotion()) {
      el.style.visibility = open ? "visible" : "hidden";
      return;
    }
    let tl: gsap.core.Timeline | undefined;
    loadGsap().then(({ gsap }) => {
      if (open) {
        tl = gsap.timeline();
        tl.set(el, { visibility: "visible" })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
          .fromTo(el.querySelectorAll("[data-m-row]"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05, ease: "expo.out" }, 0.35)
          .fromTo(el.querySelectorAll("[data-m-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04 }, 0.5);
      } else {
        tl = gsap.timeline();
        tl.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" }).set(el, { visibility: "hidden" });
      }
    });
    return () => {
      tl?.kill();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="room-night fixed inset-0 z-40 overflow-y-auto pt-24 md:pt-28"
      style={{ visibility: "hidden" }}
    >
      {(
        <div className="shell grid min-h-[calc(100dvh-7rem)] gap-10 pb-10 lg:grid-cols-[1.25fr_1fr]">
          <nav aria-label="Shop" className="flex flex-col justify-center">
            <ol>
              {GROUPS.map((g, i) => (
                <li key={g.key} className="overflow-hidden border-b border-line-dark first:border-t">
                  <Link
                    href={g.href}
                    onClick={onClose}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    data-m-row
                    className="group flex items-baseline gap-5 py-2.5 md:py-3"
                  >
                    <span className="num w-8 text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display text-[clamp(1.9rem,min(5.2vw,7.2vh),4.4rem)] transition-[color,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3 group-hover:text-om">{g.label}</span>
                    <span className="ml-auto hidden text-sm text-mute md:block">{g.blurb}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex flex-col gap-8">
            <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[32px] lg:block" data-m-fade>
              {GROUPS.map((g, i) => (
                <div key={g.key} className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${i === hover ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}>
                  <Photo name={g.photo} alt="" sizes="40vw" />
                </div>
              ))}
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-lg text-white">{GROUPS[hover].line}</p>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[1.05rem]">
              {SECONDARY.map((l) => (
                <li key={l.href} data-m-fade>
                  <Link href={l.href} onClick={onClose} className="link-grow text-white/80 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="pill pill-wa self-start" data-m-fade>
                <WhatsAppIcon className="size-5" /> Chat with us on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
