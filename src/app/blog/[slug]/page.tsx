import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, POST_LIST } from "@/lib/data";
import { SITE } from "@/data/site";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/page/PageHero";
import { RichText } from "@/components/content/RichText";

export const dynamicParams = false;
export const generateStaticParams = () => POST_LIST.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", publishedTime: p.date } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, datePublished: p.date, author: { "@type": "Organization", name: SITE.legalName } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <PageHero kicker={`${p.kind} · ${formatDate(p.date)}`} lines={[p.title]} intro={p.excerpt} crumbs={[{ label: "Guides", href: "/blog" }, { label: p.kind }]} />
      <article className="room-paper shell max-w-3xl py-16 md:py-24">
        <RichText text={p.content} />
        <Link href="/blog" className="link-grow mt-12 inline-block font-semibold">
          ← All guides
        </Link>
      </article>
    </>
  );
}
