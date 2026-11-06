import Link from "next/link";
import type { ReactNode } from "react";
import type { PhotoKey } from "@/data/images.generated";
import { Split } from "@/components/motion/Split";
import { Photo } from "@/components/ui/Photo";

/** Night-room page opener: breadcrumb, kicker, a headline that rises on load, optional photo. */
export function PageHero({
  kicker,
  lines,
  intro,
  crumbs = [],
  photo,
  photoAlt = "",
  children,
}: {
  kicker: string;
  lines: string[];
  intro?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  photo?: PhotoKey;
  photoAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="room-night grain relative isolate overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      {photo && (
        <>
          <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[55%]">
            <div className="absolute -inset-y-[12%] inset-x-0" data-drift="16">
              <Photo name={photo} alt={photoAlt} sizes="(min-width: 768px) 55vw, 100vw" eager />
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/25 max-md:bg-night/75" />
        </>
      )}
      <div className="shell">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10" data-reveal="fade">
            <ol className="kicker flex flex-wrap items-center gap-2 text-white/45">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/80">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="kicker text-om" data-reveal="fade">
          {kicker}
        </p>
        <Split as="h1" now lines={lines} className="display text-hero mt-5 max-w-[14ch]" />
        {intro && (
          <div className="text-lead mt-8 max-w-xl text-white/70" data-reveal data-delay={250}>
            {intro}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
