import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";
import { PageHero } from "@/components/page/PageHero";
import { WhatsAppForm } from "@/components/forms/WhatsAppForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask OM Telecom about a product, a store visit, an exchange or after-sales help.",
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  const rows = [
    { k: "Phone", v: SITE.phone, href: SITE.phone ? `tel:${SITE.phone.replace(/\s/g, "")}` : "" },
    { k: "Email", v: SITE.email, href: SITE.email ? `mailto:${SITE.email}` : "" },
    { k: "Address", v: SITE.address, href: "" },
    { k: "Hours", v: SITE.hours, href: "" },
  ].filter((r) => r.v);

  return (
    <>
      <PageHero
        kicker="Contact"
        lines={["Ask us", "*anything.*"]}
        intro="Product questions, exchange quotes, store visits or help after you buy. Message us and a person will reply."
        crumbs={[{ label: "Contact" }]}
        photo="typing"
        photoAlt="Hands typing a message on a smartphone"
      />
      <section className="room-paper shell grid gap-14 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr]">
        <div>
          {rows.length > 0 ? (
            <dl className="divide-y divide-line-light border-y border-line-light">
              {rows.map((r) => (
                <div key={r.k} className="grid grid-cols-[6rem_1fr] gap-4 py-5">
                  <dt className="kicker pt-1 text-mute">{r.k}</dt>
                  <dd className="display-soft text-xl">
                    {r.href ? (
                      <a href={r.href} className="link-grow">
                        {r.v}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-lead text-ink-2">The quickest way to reach us is the form, which opens WhatsApp. Or drop into a store.</p>
          )}
          <Link href="/stores" className="pill pill-ink mt-10">
            Find a store
          </Link>
        </div>
        <div className="rounded-[32px] bg-paper-2 p-6 md:p-10" data-reveal>
          <WhatsAppForm
            number={SITE.whatsapp}
            intro="Hi OM Telecom,"
            submitLabel="Send on WhatsApp"
            fields={[
              { name: "name", label: "Name", required: true, half: true, autoComplete: "name" },
              { name: "topic", label: "Topic", type: "select", half: true, options: ["Product question", "Exchange quote", "Store visit", "After-sales help", "Something else"] },
              { name: "message", label: "Message", type: "textarea", required: true },
            ]}
          />
        </div>
      </section>
    </>
  );
}
