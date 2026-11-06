import type { Metadata } from "next";
import { POLICIES } from "@/data/site";
import { PageHero } from "@/components/page/PageHero";
import { RichText } from "@/components/content/RichText";

type Key = keyof typeof POLICIES;

export const policyMetadata = (k: Key): Metadata => ({ title: POLICIES[k].title, alternates: { canonical: `/${k}` }, robots: { index: false } });

/** Policy text lives in src/data/site.ts (drafts until reviewed). */
export function PolicyPage({ k }: { k: Key }) {
  const doc = POLICIES[k];
  return (
    <>
      <PageHero kicker="Policy" lines={[doc.title]} crumbs={[{ label: doc.title }]} />
      <article className="room-paper shell max-w-3xl py-16 md:py-24">
        <RichText text={doc.body} />
      </article>
    </>
  );
}
