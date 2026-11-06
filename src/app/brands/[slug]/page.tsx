import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND_LIST, getBrand, productsOfBrand } from "@/lib/data";
import { PageHero } from "@/components/page/PageHero";
import { Collection } from "@/components/catalog/Collection";

export const dynamicParams = false;
export const generateStaticParams = () => BRAND_LIST.map((b) => ({ slug: b.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = getBrand((await params).slug);
  if (!b) return {};
  return { title: `${b.name} at OM Telecom`, description: `${b.tagline} Compare ${b.name} models and buy over WhatsApp or in store.`, alternates: { canonical: `/brands/${b.slug}` } };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = getBrand((await params).slug);
  if (!b) notFound();
  const products = productsOfBrand(b.slug);
  return (
    <>
      <PageHero kicker={`${b.count} models`} lines={[b.name]} intro={b.tagline} crumbs={[{ label: "Brands", href: "/brands" }, { label: b.name }]}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 -z-10 size-[520px] rounded-full opacity-50 blur-[110px]" style={{ background: b.accent === "#000000" || b.accent === "#1d1d1f" ? "#b9aef5" : b.accent }} />
      </PageHero>
      <section className="room-paper shell py-12 md:py-16">
        <Collection products={products} showBrands={false} />
      </section>
    </>
  );
}
