import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_PRODUCTS, getProduct, groupByKey, related } from "@/lib/data";
import { SITE } from "@/data/site";
import { formatINR } from "@/lib/format";
import { BuyPanel } from "@/components/product/BuyPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { Split } from "@/components/motion/Split";
import { Arrow } from "@/components/ui/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — price & variants`,
    description: `${p.short} From ${formatINR(p.price)}. Compare variants and buy over WhatsApp from OM Telecom.`,
    alternates: { canonical: `/products/${p.slug}` },
    robots: SITE.demoCatalogue ? { index: false, follow: true } : undefined,
  };
}

const KIND_LABEL: Record<string, string> = { PHONE: "Memory & storage", TABLET: "Memory & storage", LAPTOP: "Memory & storage", WATCH: "Size" };

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const g = groupByKey(p.group)!;
  const more = related(p, 4);
  const glowId = `glow-${p.slug}`;
  const url = `${SITE.url}/products/${p.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            brand: { "@type": "Brand", name: p.brand.name },
            category: p.category.name,
            description: p.short,
            url,
            offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: Math.min(...p.variants.map((v) => v.price)), highPrice: Math.max(...p.variants.map((v) => v.price)), offerCount: p.variants.length },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="room-night grain relative isolate overflow-hidden pb-20 pt-32 md:pt-40">
        <div id={glowId} aria-hidden="true" className="absolute -right-[10%] top-[10%] -z-10 size-[min(70vw,760px)] rounded-full opacity-40 blur-[120px]" style={{ background: p.colors[0]?.hex }} />
        <div className="shell">
          <nav aria-label="Breadcrumb" className="kicker mb-10 flex flex-wrap gap-2 text-white/45" data-reveal="fade">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href={g.href} className="hover:text-white">
              {g.label}
            </Link>
            <span>/</span>
            <span className="text-white/80">{p.name}</span>
          </nav>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <Link href={`/brands/${p.brand.slug}`} className="kicker text-om hover:underline" data-reveal="fade">
                {p.brand.name} · {p.category.name}
              </Link>
              <Split as="h1" now lines={[p.name]} className="display text-hero mt-5" />
              <p className="text-lead mt-6 max-w-lg text-white/70" data-reveal data-delay={200}>
                {p.short}
              </p>
              <ul className="mt-10 flex flex-wrap gap-2" data-reveal data-delay={300}>
                {p.labels.map((l) => (
                  <li key={l} className="kicker rounded-full bg-om px-3 py-1.5 text-white">
                    {l}
                  </li>
                ))}
                {p.isNew && !p.labels.includes("New launch") && <li className="kicker rounded-full bg-om px-3 py-1.5 text-white">New</li>}
                <li className="kicker rounded-full px-3 py-1.5 ring-1 ring-white/20">{p.variants.length} variant{p.variants.length > 1 ? "s" : ""}</li>
                <li className="kicker rounded-full px-3 py-1.5 ring-1 ring-white/20">{p.colors.length} finish{p.colors.length > 1 ? "es" : ""}</li>
              </ul>
            </div>
            <div data-reveal data-delay={250}>
              <BuyPanel name={p.name} kindLabel={KIND_LABEL[p.category.kind] ?? "Variant"} variants={p.variants} whatsapp={SITE.whatsapp} pageUrl={url} glowId={glowId} />
            </div>
          </div>
          {SITE.demoCatalogue && <p className="mt-10 text-xs text-white/40">Sample listing — prices and highlights are placeholders until OM Telecom publishes its live catalogue.</p>}
        </div>
      </section>

      <section className="room-paper py-24 md:py-32" aria-labelledby="hl">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker text-om">Highlights</p>
            <Split as="h2" id="hl" lines={["Why people", "*pick this one.*"]} className="display text-title mt-5" />
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {p.highlights.map((h, i) => (
              <li key={h} className="flex items-baseline gap-6 border-t border-line-light py-7 last:border-b" data-reveal data-delay={i * 90}>
                <span className="num text-sm text-om">{String(i + 1).padStart(2, "0")}</span>
                <span className="display-soft text-[clamp(1.6rem,2.8vw,2.6rem)]">{h}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="shell mt-24 grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Pick your variant", d: "Choose storage and finish above — the message fills itself in." },
            { n: "02", t: "Chat with the store", d: "We confirm stock, final price, offers and delivery or pickup." },
            { n: "03", t: "Pay when you're sure", d: "Pay at the store or as agreed in chat. Nothing is charged on this site." },
          ].map((s, i) => (
            <div key={s.n} className="rounded-[28px] bg-white p-8 ring-1 ring-black/5" data-reveal data-delay={i * 100}>
              <span className="num text-sm text-om">{s.n}</span>
              <h3 className="display-soft mt-6 text-2xl">{s.t}</h3>
              <p className="mt-2 text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {more.length > 0 && (
        <section className="room-paper pb-28" aria-labelledby="more">
          <div className="shell">
            <div className="mb-10 flex items-end justify-between">
              <h2 id="more" className="display text-title">
                Also worth a look
              </h2>
              <Link href={g.href} className="link-grow hidden items-center gap-2 font-semibold md:inline-flex">
                All {g.label.toLowerCase()} <Arrow />
              </Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((x) => (
                <li key={x.slug} data-reveal>
                  <ProductCard p={x} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
