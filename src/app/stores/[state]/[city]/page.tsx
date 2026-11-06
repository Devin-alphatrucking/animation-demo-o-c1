import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORES } from "@/lib/data";
import { SITE } from "@/data/site";
import { PageHero } from "@/components/page/PageHero";
import { StoreLocator } from "@/components/stores/StoreLocator";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Map(STORES.map((s) => [`${s.stateSlug}/${s.citySlug}`, { state: s.stateSlug, city: s.citySlug }])).values()];
}

const inCity = (state: string, city: string) => STORES.filter((s) => s.stateSlug === state && s.citySlug === city);

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state, city } = await params;
  const list = inCity(state, city);
  if (!list.length) return {};
  return {
    title: `Mobile phone stores in ${list[0].city}`,
    description: `OM Telecom in ${list[0].city}, ${list[0].state}: ${list.length} store${list.length > 1 ? "s" : ""}. See the map and get directions.`,
    alternates: { canonical: `/stores/${state}/${city}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ state: string; city: string }> }) {
  const { state, city } = await params;
  const list = inCity(state, city);
  if (!list.length) notFound();
  return (
    <>
      <PageHero kicker={`${list[0].state} · ${list.length} store${list.length > 1 ? "s" : ""}`} lines={["OM Telecom", `*${list[0].city}*`]} crumbs={[{ label: "Stores", href: "/stores" }, { label: list[0].city }]} photo="store-counter" photoAlt="A customer and staff member looking at a tablet across a store counter" />
      <section className="room-paper shell py-16 md:py-24">
        <StoreLocator stores={list} demo={SITE.demoStores} />
      </section>
    </>
  );
}
