import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_LIST } from "@/lib/data";
import { PageHero } from "@/components/page/PageHero";

export const metadata: Metadata = { title: "Brands", description: "Every brand available at OM Telecom.", alternates: { canonical: "/brands" } };

export default function BrandsPage() {
  return (
    <>
      <PageHero kicker={`${BRAND_LIST.length} brands`} lines={["Every name", "*you'd expect.*"]} crumbs={[{ label: "Brands" }]} />
      <section className="room-paper shell py-16 md:py-24">
        <ul className="grid border-l border-t border-line-light sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_LIST.map((b, i) => (
            <li key={b.slug} className="border-b border-r border-line-light" data-reveal data-delay={(i % 3) * 80}>
              <Link href={`/brands/${b.slug}`} className="group relative flex h-full min-h-56 flex-col justify-between overflow-hidden p-8">
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" style={{ background: b.accent }} />
                <span className="relative flex justify-between">
                  <span className="num text-sm text-mute transition-colors group-hover:text-white/70">{String(i + 1).padStart(2, "0")}</span>
                  <span className="num text-sm text-mute transition-colors group-hover:text-white/70">{b.count} models</span>
                </span>
                <span className="relative">
                  <span className="display block text-[clamp(2.4rem,4vw,3.6rem)] transition-colors duration-500 group-hover:text-white">{b.name}</span>
                  <span className="mt-2 block text-sm text-ink-2 transition-colors group-hover:text-white/80">{b.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
