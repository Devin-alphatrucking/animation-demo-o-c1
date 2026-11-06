import type { Metadata } from "next";
import Link from "next/link";
import { GROUPS, siteFacts } from "@/lib/data";
import { PROMISES, SITE } from "@/data/site";
import { PageHero } from "@/components/page/PageHero";
import { Split } from "@/components/motion/Split";
import { Photo } from "@/components/ui/Photo";
import { Arrow } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.legalName}: phones, laptops and electronics, sold by people who use them.`,
  alternates: { canonical: "/about-us" },
};

export default function AboutPage() {
  const f = siteFacts();
  return (
    <>
      <PageHero
        kicker={SITE.legalName}
        lines={["Connecting you,", "*everyday.*"]}
        intro="We sell phones, laptops and electronics from the brands people trust, and we'd rather you leave with the right device than the most expensive one."
        crumbs={[{ label: "About" }]}
        photo="phone-glow"
        photoAlt="A phone screen glowing in a dark room"
      />
      <section className="room-paper py-24 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]" data-clip>
            <div className="absolute -inset-y-[12%] inset-x-0" data-drift="14">
              <Photo name="store-counter" alt="A customer and staff member looking at a tablet across a store counter" sizes="(min-width:1024px) 50vw, 100vw" />
            </div>
          </div>
          <div>
            <Split as="h2" lines={["How we", "*work.*"]} className="display text-title" />
            <ol className="mt-10">
              {PROMISES.map((p, i) => (
                <li key={p.title} className="border-t border-line-light py-6 last:border-b" data-reveal data-delay={i * 80}>
                  <h3 className="display-soft text-2xl">
                    <span className="num mr-4 text-sm text-om">{String(i + 1).padStart(2, "0")}</span>
                    {p.title}
                  </h3>
                  <p className="mt-2 pl-10 text-ink-2">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="room-night py-24" aria-label="What we sell">
        <div className="shell">
          <p className="kicker text-om">What we sell</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {GROUPS.map((g) => (
              <li key={g.key} data-reveal>
                <Link href={g.href} className="display inline-block rounded-full border border-white/15 px-6 py-3 text-[clamp(1.4rem,2.4vw,2.2rem)] transition-colors hover:border-om hover:bg-om">
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-xl text-white/60">
            {f.products} models from {f.brands} brands to compare online{SITE.demoCatalogue ? " (sample catalogue)" : ""}.
          </p>
          <Link href="/stores" className="pill pill-om mt-8" data-magnetic>
            Visit a store <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
