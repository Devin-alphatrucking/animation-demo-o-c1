import type { Metadata } from "next";
import { STORES } from "@/lib/data";
import { SITE } from "@/data/site";
import { PageHero } from "@/components/page/PageHero";
import { StoreLocator } from "@/components/stores/StoreLocator";

export const metadata: Metadata = {
  title: "Store locator",
  description: "Find an OM Telecom store near you, see it on the map and get directions.",
  alternates: { canonical: "/stores" },
};

export default function StoresPage() {
  return (
    <>
      <PageHero kicker={`${STORES.length} stores`} lines={["Come in and", "*hold it first.*"]} intro="Try the phones you've shortlisted side by side, with someone who uses them every day." crumbs={[{ label: "Stores" }]} photo="store-aisle" photoAlt="A shopper browsing devices in a brightly lit electronics store" />
      <section className="room-paper shell py-16 md:py-24">
        <StoreLocator stores={STORES} demo={SITE.demoStores} />
        {SITE.demoStores && <p className="mt-10 text-xs text-mute">Sample locations shown for layout — the real branch list, addresses and phone numbers will replace them.</p>}
      </section>
    </>
  );
}
