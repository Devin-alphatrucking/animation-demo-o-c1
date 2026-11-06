import Link from "next/link";
import { SITE } from "@/data/site";
import { GROUPS, storeDirectory } from "@/lib/data";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/brand/Logo";
import { Split } from "@/components/motion/Split";
import { ArrowUpRight, WhatsAppIcon } from "@/components/ui/icons";

export function Footer() {
  const wa = whatsappUrl(SITE.whatsapp, "Hi OM Telecom, I have a question.");
  const cities = storeDirectory().flatMap((s) => s.cities.map((c) => ({ ...c, state: s.slug })));
  const socials = Object.entries(SITE.social).filter(([, url]) => url);

  return (
    <footer className="room-night relative overflow-hidden" data-intro-hide>
      <div className="shell grid gap-12 border-b border-line-dark py-20 lg:grid-cols-[1.4fr_1fr] lg:py-28">
        <div>
          <p className="kicker text-om">Still deciding?</p>
          <Split lines={["Ask a person,", "*not a chatbot.*"]} className="display text-hero mt-5" />
        </div>
        <div className="flex flex-col justify-end gap-6">
          <p className="text-lead text-white/70">Send us the phone you&apos;re considering and your budget. Someone from our store team will reply with honest options.</p>
          <div className="flex flex-wrap gap-3">
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="pill pill-wa" data-magnetic>
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp
              </a>
            ) : (
              <Link href="/stores" className="pill pill-om" data-magnetic>
                Visit a store <ArrowUpRight />
              </Link>
            )}
            <Link href="/contact-us" className="pill pill-ghost">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{SITE.description}</p>
          <ul className="mt-5 space-y-1 text-sm text-white/80">
            {SITE.phone && (
              <li>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="link-grow">
                  {SITE.phone}
                </a>
              </li>
            )}
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="link-grow">
                  {SITE.email}
                </a>
              </li>
            )}
            {SITE.address && <li className="text-white/55">{SITE.address}</li>}
          </ul>
        </div>
        <FooterCol title="Shop">
          {GROUPS.map((g) => (
            <FooterLink key={g.key} href={g.href}>
              {g.label}
            </FooterLink>
          ))}
          <FooterLink href="/brands">All brands</FooterLink>
        </FooterCol>
        <FooterCol title="Stores">
          <FooterLink href="/stores">Store locator</FooterLink>
          {cities.slice(0, 6).map((c) => (
            <FooterLink key={c.slug} href={`/stores/${c.state}/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
        </FooterCol>
        <FooterCol title="Company">
          <FooterLink href="/about-us">About</FooterLink>
          <FooterLink href="/franchise">Franchise</FooterLink>
          <FooterLink href="/offers">Offers</FooterLink>
          <FooterLink href="/blog">Buying guides</FooterLink>
          <FooterLink href="/contact-us">Contact</FooterLink>
        </FooterCol>
      </div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="display whitespace-nowrap pl-[2vw] text-[18.5vw] leading-[0.78] text-white/[0.06]">Connecting you</p>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-line-dark py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
        <p>
          © {SITE.legalName}
          {SITE.gstin && <span className="ml-2">· GSTIN {SITE.gstin}</span>}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms-and-conditions" className="hover:text-white">
              Terms
            </Link>
          </li>
          <li>
            <Link href="/return-policy" className="hover:text-white">
              Returns
            </Link>
          </li>
          <li>
            <Link href="/shipping-policy" className="hover:text-white">
              Shipping
            </Link>
          </li>
          {socials.map(([k, url]) => (
            <li key={k}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-white">
                {k}
              </a>
            </li>
          ))}
        </ul>
        <p>Brand names and trademarks belong to their owners. Photography: Unsplash.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="kicker mb-4 text-mute">{title}</p>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="link-grow text-[0.95rem] text-white/80 hover:text-white">
        {children}
      </Link>
    </li>
  );
}
