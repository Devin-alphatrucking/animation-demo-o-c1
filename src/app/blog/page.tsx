import type { Metadata } from "next";
import { POST_LIST } from "@/lib/data";
import { PageHero } from "@/components/page/PageHero";
import { PostRow } from "@/components/content/PostRow";

export const metadata: Metadata = {
  title: "Buying guides",
  description: "Practical guides and comparisons to help you choose your next phone, laptop or tablet.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero kicker="Buying guides" lines={["Before you buy,", "*read this.*"]} crumbs={[{ label: "Guides" }]} />
      <section className="room-paper shell py-16 md:py-24">
        <ul>
          {POST_LIST.map((p, i) => (
            <PostRow key={p.slug} post={p} index={i} />
          ))}
        </ul>
      </section>
    </>
  );
}
