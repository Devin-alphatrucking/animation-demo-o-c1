import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { directionsUrl, mapEmbedUrl, STORES } from "@/lib/data";
import { SITE } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/page/PageHero";
import { ArrowUpRight, WhatsAppIcon } from "@/components/ui/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return STORES.map((s) => ({ state: s.stateSlug, city: s.citySlug, store: s.slug }));
}

type P = { params: Promise<{ state: string; city: string; store: string }> };
const find = async ({ params }: P) => {
  const { state, city, store } = await params;
  return STORES.find((s) => s.stateSlug === state && s.citySlug === city && s.slug === store) ?? null;
};

export async function generateMetadata(props: P): Promise<Metadata> {
  const s = await find(props);
  if (!s) return {};
  return { title: `${s.name}, ${s.city}`, description: `${s.name} in ${s.area}, ${s.city}: map, directions and contact.`, alternates: { canonical: `/stores/${s.stateSlug}/${s.citySlug}/${s.slug}` }, robots: SITE.demoStores ? { index: false } : undefined };
}

export default async function StorePage(props: P) {
  const s = await find(props);
  if (!s) notFound();
  const wa = whatsappUrl(SITE.whatsapp, `Hi OM Telecom, I'd like to visit your ${s.area}, ${s.city} store.`);
  return (
    <>
      {!SITE.demoStores && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ElectronicsStore", name: s.name, address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: s.city, addressRegion: s.state, postalCode: s.pincode, addressCountry: "IN" }, geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng }, ...(s.phone ? { telephone: s.phone } : {}) }).replace(/</g, "\u003c"),
          }}
        />
      )}
      <PageHero kicker={`${s.city} · ${s.state}`} lines={[s.area]} crumbs={[{ label: "Stores", href: "/stores" }, { label: s.city, href: `/stores/${s.stateSlug}/${s.citySlug}` }, { label: s.area }]}>
        <div className="mt-10 flex flex-wrap gap-3" data-reveal data-delay={300}>
          <a href={directionsUrl(s)} target="_blank" rel="noopener noreferrer" className="pill pill-om" data-magnetic>
            Get directions <ArrowUpRight />
          </a>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="pill pill-wa">
              <WhatsAppIcon className="size-5" /> Message before you visit
            </a>
          )}
          {s.phone && (
            <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="pill pill-ghost">
              Call {s.phone}
            </a>
          )}
        </div>
      </PageHero>
      <section className="room-paper shell grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr]">
        <dl className="divide-y divide-line-light border-y border-line-light">
          {[
            { k: "Address", v: `${s.address}, ${s.city} ${s.pincode}` },
            { k: "Hours", v: s.hours || "Shared soon" },
            { k: "Phone", v: s.phone || "Shared soon" },
          ].map((r) => (
            <div key={r.k} className="grid grid-cols-[7rem_1fr] gap-4 py-6" data-reveal>
              <dt className="kicker pt-1 text-mute">{r.k}</dt>
              <dd className="display-soft text-xl">{r.v}</dd>
            </div>
          ))}
          {SITE.demoStores && <p className="py-6 text-xs text-mute">Sample location used for layout. Real address and contact details will replace it.</p>}
        </dl>
        <div className="overflow-hidden rounded-[32px]" data-reveal>
          <iframe title={`Map of ${s.name}`} src={mapEmbedUrl(s)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[420px] w-full md:h-[520px]" />
        </div>
      </section>
      <section className="room-paper shell pb-24">
        <Link href="/stores" className="link-grow font-semibold">
          ← All stores
        </Link>
      </section>
    </>
  );
}
