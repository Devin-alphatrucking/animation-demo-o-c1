import type { Metadata } from "next";
import { FRANCHISE, SITE } from "@/data/site";
import { PageHero } from "@/components/page/PageHero";
import { Split } from "@/components/motion/Split";
import { Photo } from "@/components/ui/Photo";
import { WhatsAppForm } from "@/components/forms/WhatsAppForm";

export const metadata: Metadata = {
  title: "Franchise",
  description: "Open an OM Telecom store in your city. Learn how the franchise works and send us your details.",
  alternates: { canonical: "/franchise" },
};

export default function FranchisePage() {
  return (
    <>
      <PageHero kicker="Franchise" lines={["Your city.", "*Our name.*"]} intro={FRANCHISE.intro} crumbs={[{ label: "Franchise" }]} photo="local-shop-2" photoAlt="A shopkeeper smiling in a busy open-front store">
        <a href="#apply" className="pill pill-om mt-10" data-magnetic data-reveal data-delay={350}>
          Start the conversation
        </a>
      </PageHero>

      <section className="room-paper py-24 md:py-32" aria-labelledby="why">
        <div className="shell">
          <Split as="h2" id="why" lines={["What you get", "*from day one.*"]} className="display text-title" />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {FRANCHISE.benefits.map((b, i) => (
              <div key={b.title} className="rounded-[28px] bg-white p-8 ring-1 ring-black/5 md:p-10" data-reveal data-delay={i * 100}>
                <span className="num text-sm text-om">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-soft mt-10 text-3xl">{b.title}</h3>
                <p className="mt-3 text-ink-2">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="room-night py-24 md:py-32" aria-label="How the model works">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]" data-clip>
            <Photo name="store-crowd" alt="Customers browsing phones in a busy electronics store" sizes="(min-width:1024px) 50vw, 100vw" />
          </div>
          <div className="space-y-10">
            {[
              { t: "The model", d: FRANCHISE.model },
              { t: "Support", d: FRANCHISE.support },
              { t: "Investment", d: FRANCHISE.investment },
            ].map((x, i) => (
              <div key={x.t} className="border-t border-line-dark pt-8" data-reveal data-delay={i * 100}>
                <h3 className="kicker text-om">{x.t}</h3>
                <p className="display-soft mt-4 text-[clamp(1.4rem,2.2vw,2rem)] text-white/90">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="room-paper py-24 md:py-32" aria-labelledby="steps">
        <div className="shell">
          <Split as="h2" id="steps" lines={["Four steps", "*to opening day.*"]} className="display text-title" />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-line-light md:grid-cols-4">
            {FRANCHISE.steps.map((s, i) => (
              <li key={s.title} className="bg-paper p-8" data-reveal data-delay={i * 100}>
                <span className="display text-6xl text-om/25">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-soft mt-6 text-2xl">{s.title}</h3>
                <p className="mt-2 text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="room-paper scroll-mt-24 pb-28" aria-labelledby="apply-h">
        <div className="shell grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Split as="h2" id="apply-h" lines={["Tell us", "*about you.*"]} className="display text-title" />
            <div className="mt-10 space-y-2">
              {FRANCHISE.faqs.map((f) => (
                <details key={f.q} className="group border-t border-line-light py-5 last:border-b">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                    {f.q}
                    <span className="text-2xl text-om transition-transform duration-500 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] bg-paper-2 p-6 md:p-10" data-reveal>
            <WhatsAppForm
              number={SITE.whatsapp}
              intro="Hi OM Telecom, I'm interested in opening a franchise store."
              submitLabel="Send on WhatsApp"
              fields={[
                { name: "name", label: "Full name", required: true, half: true, autoComplete: "name" },
                { name: "phone", label: "Mobile number", type: "tel", required: true, half: true, autoComplete: "tel" },
                { name: "city", label: "City", required: true, half: true, autoComplete: "address-level2" },
                { name: "state", label: "State", required: true, half: true, autoComplete: "address-level1" },
                { name: "area", label: "Preferred area / market", placeholder: "Road, market or locality" },
                { name: "business", label: "Current business (if any)", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
