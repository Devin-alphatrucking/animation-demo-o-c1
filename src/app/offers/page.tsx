import type { Metadata } from "next";
import { SAVINGS, SITE } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/page/PageHero";
import { SavingsStack } from "@/components/home/SavingsStack";

export const metadata: Metadata = { title: "Offers", description: "Exchange, EMI, bank and festive offers at OM Telecom — ask the team what's running today.", alternates: { canonical: "/offers" } };

export default function OffersPage() {
  return (
    <>
      <PageHero kicker="Ways to save" lines={["More phone,", "*less spend.*"]} intro="Offers change through the year, so we don't print dates we can't keep. Message the team and they'll tell you exactly what applies today." crumbs={[{ label: "Offers" }]} photo="phone-bokeh" photoAlt="A phone held up against colourful bokeh lights" />
      <section className="room-paper shell pt-16 md:pt-24">
        <SavingsStack items={SAVINGS} waUrl={whatsappUrl(SITE.whatsapp, "Hi OM Telecom!")} />
      </section>
    </>
  );
}
