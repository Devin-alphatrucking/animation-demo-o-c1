import Link from "next/link";
import { BRAND_LIST, GROUPS, POST_LIST, productsInGroup, siteFacts, storeDirectory, trending } from "@/lib/data";
import { PROMISES, SAVINGS, SITE } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { LogoIntro } from "@/components/intro/LogoIntro";
import { ScreenHero } from "@/components/home/ScreenHero";
import { BrandTicker } from "@/components/home/BrandTicker";
import { Statement } from "@/components/home/Statement";
import { GroupIndex } from "@/components/home/GroupIndex";
import { TrendingRail } from "@/components/home/TrendingRail";
import { SavingsStack } from "@/components/home/SavingsStack";
import { Split } from "@/components/motion/Split";
import { Photo } from "@/components/ui/Photo";
import { Arrow, ArrowUpRight } from "@/components/ui/icons";
import { PostRow } from "@/components/content/PostRow";

export default function HomePage() {
  const facts = siteFacts();
  const dir = storeDirectory();
  const cities = dir.flatMap((s) => s.cities.map((c) => ({ ...c, state: s.slug })));
  const waBase = whatsappUrl(SITE.whatsapp, "Hi OM Telecom!");
  const phones = trending().filter((p) => p.group === "mobiles");

  return (
    <>
      <LogoIntro />
      <ScreenHero brandCount={BRAND_LIST.filter((b) => productsInGroup("mobiles").some((p) => p.brand.slug === b.slug)).length} />
      <BrandTicker brands={BRAND_LIST.filter((b) => b.featured)} />

      <Statement
        kicker="Why people come back"
        text="Everyone sells the phones people talk about. What brings customers back is simpler — a real person replies when you message, tells you honestly which one fits, and helps you set it up."
        accent={["honestly", "real", "person"]}
      />

      {/* Product rooms */}
      <section className="room-paper pb-28 md:pb-40" aria-labelledby="rooms">
        <div className="shell">
          <div className="mb-12 flex items-end justify-between gap-6">
            <Split as="h2" lines={["Shop by", "*room*"]} className="display text-title" />
            <p id="rooms" className="max-w-xs text-ink-2" data-reveal>
              Six rooms, {facts.products} models, {facts.brands} brands. Hover a room to look inside.
            </p>
          </div>
          <GroupIndex rows={GROUPS.map((g) => ({ ...g, count: productsInGroup(g.key).length }))} />
        </div>
      </section>

      <TrendingRail products={phones} kicker="Trending now" title="The phones everyone's asking about" href="/mobiles" />

      {/* Promises */}
      <section className="room-paper py-28 md:py-40" aria-labelledby="promises">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-om" data-reveal>
              How buying works
            </p>
            <Split as="h2" lines={["Chat first.", "*Pay when*", "*you're sure.*"]} className="display text-title mt-5" />
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[32px] lg:block" data-clip>
              <Photo name="store-counter" alt="A customer and staff member looking at a tablet across a store counter" sizes="40vw" />
            </div>
          </div>
          <ol id="promises" className="lg:col-span-6 lg:col-start-7 lg:pt-24">
            {PROMISES.map((p, i) => (
              <li key={p.title} className="border-t border-line-light py-9 last:border-b" data-reveal data-delay={i * 80}>
                <div className="flex gap-6">
                  <span className="num pt-2 text-sm text-om">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display-soft text-[clamp(1.7rem,2.6vw,2.4rem)]">{p.title}</h3>
                    <p className="mt-3 max-w-lg text-ink-2">{p.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ways to save — stacking cards */}
      <section className="room-paper pb-10" aria-labelledby="save">
        <div className="shell">
          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
            <Split as="h2" lines={["More phone,", "*less spend.*"]} className="display text-title" />
            <p id="save" className="max-w-sm text-ink-2 md:justify-self-end" data-reveal>
              Offers change through the year, so we don&apos;t print dates we can&apos;t keep. Ask the team what&apos;s live when you message.
            </p>
          </div>
          <SavingsStack items={SAVINGS} waUrl={waBase} />
        </div>
      </section>

      {/* Facts — real counts from the catalogue and store list */}
      <section className="room-night py-24 md:py-32" aria-label="OM Telecom in numbers">
        <div className="shell grid grid-cols-2 gap-y-14 md:grid-cols-4">
          {[
            { n: facts.stores, label: "stores", sub: `across ${facts.cities} cities` },
            { n: facts.brands, label: "brands", sub: "phones to TVs" },
            { n: facts.products, label: "models", sub: "to compare online" },
            { n: GROUPS.length, label: "rooms", sub: "of technology" },
          ].map((f, i) => (
            <div key={f.label} className="border-l border-line-dark pl-6" data-reveal data-delay={i * 90}>
              <p className="display text-[clamp(4rem,9vw,8.5rem)] leading-none">
                <span data-count={f.n}>{f.n}</span>
              </p>
              <p className="mt-3 text-lg">{f.label}</p>
              <p className="text-sm text-white/50">{f.sub}</p>
            </div>
          ))}
        </div>
        {(SITE.demoStores || SITE.demoCatalogue) && <p className="shell mt-12 text-xs text-white/40">Counts are calculated from the current sample catalogue and store list.</p>}
      </section>

      {/* Stores */}
      <section className="room-paper relative py-28 md:py-40" aria-labelledby="stores-h">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[32px] md:aspect-[4/3] lg:aspect-[5/6]" data-clip>
            <div className="absolute -inset-y-[12%] inset-x-0" data-drift="14">
              <Photo name="store-aisle" alt="A shopper browsing devices in a brightly lit electronics store" sizes="(min-width:1024px) 50vw, 100vw" />
            </div>
          </div>
          <div>
            <p className="kicker text-om" data-reveal>
              Stores
            </p>
            <Split as="h2" id="stores-h" lines={["Come in.", "*Pick it up.*", "Try it."]} className="display text-title mt-5" />
            <p className="text-lead mt-6 max-w-md text-ink-2" data-reveal>
              Specs only tell you so much. Hold the phones you&apos;ve shortlisted, side by side, with someone who uses them every day.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" data-reveal>
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/stores/${c.state}/${c.slug}`} className="inline-flex items-center gap-2 rounded-full border border-line-light px-4 py-2 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                    {c.name}
                    <span className="num text-xs text-mute">{c.stores.length}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/stores" className="pill pill-ink mt-10" data-magnetic>
              Find your nearest store <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* Franchise — full-bleed parallax */}
      <section className="room-night relative isolate flex min-h-[90svh] items-end overflow-hidden" aria-labelledby="fr-h">
        <div className="absolute -inset-y-[15%] inset-x-0 -z-10" data-drift="18">
          <Photo name="local-shop" alt="A shop owner surrounded by shelves of electronics accessories" sizes="100vw" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-night/10" />
        <div className="shell grid gap-10 pb-16 pt-40 md:pb-24 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="kicker text-om" data-reveal>
              Franchise
            </p>
            <Split as="h2" id="fr-h" lines={["Your city.", "*Our name.*"]} className="display text-hero mt-5" />
          </div>
          <div className="lg:justify-self-end">
            <p className="text-lead max-w-md text-white/75" data-reveal>
              Know your market and want to run a modern phone store? Talk to us about opening an OM Telecom franchise.
            </p>
            <Link href="/franchise" className="pill pill-light mt-8" data-magnetic>
              Explore the franchise <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="room-paper py-28 md:py-36" aria-labelledby="guides-h">
        <div className="shell">
          <div className="mb-10 flex items-end justify-between">
            <Split as="h2" id="guides-h" lines={["Before you buy,", "*read this.*"]} className="display text-title" />
            <Link href="/blog" className="link-grow hidden font-semibold md:inline">
              All guides
            </Link>
          </div>
          <ul>
            {POST_LIST.map((p, i) => (
              <PostRow key={p.slug} post={p} index={i} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
