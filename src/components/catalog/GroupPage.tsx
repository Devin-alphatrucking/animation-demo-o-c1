import type { Metadata } from "next";
import type { GroupKey } from "@/data/types";
import { CATEGORY_LIST, groupByKey, productsInGroup } from "@/lib/data";
import { PageHero } from "@/components/page/PageHero";
import { Collection } from "@/components/catalog/Collection";

const HEADLINES: Record<GroupKey, string[]> = {
  mobiles: ["Phones,", "*picked by people*", "who use them."],
  laptops: ["Laptops for", "*real work.*"],
  tablets: ["A bigger", "*canvas.*"],
  smartwatches: ["Time, health,", "*and the rest.*"],
  accessories: ["Sound and", "*small essentials.*"],
  electronics: ["Bigger screens,", "*better nights.*"],
};

export function groupMetadata(key: GroupKey): Metadata {
  const g = groupByKey(key)!;
  return { title: g.label, description: `${g.blurb}. ${g.line} Compare models and buy over WhatsApp or in store.`, alternates: { canonical: g.href } };
}

export function GroupPage({ groupKey }: { groupKey: GroupKey }) {
  const g = groupByKey(groupKey)!;
  const products = productsInGroup(groupKey);
  const cats = CATEGORY_LIST.filter((c) => c.group === groupKey);
  return (
    <>
      <PageHero kicker={`${g.label} · ${products.length} models`} lines={HEADLINES[groupKey]} intro={g.line} crumbs={[{ label: g.label }]} photo={g.photo} photoAlt={g.alt}>
        {cats.length > 1 && (
          <p className="mt-8 text-sm text-white/55" data-reveal data-delay={350}>
            Includes {cats.map((c) => c.name.toLowerCase()).join(", ")}.
          </p>
        )}
      </PageHero>
      <section className="room-paper shell py-12 md:py-16">
        <Collection products={products} />
      </section>
    </>
  );
}
