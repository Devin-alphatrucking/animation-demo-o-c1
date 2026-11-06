import Link from "next/link";

export default function NotFound() {
  return (
    <section className="room-night grain relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div className="shell">
        <p className="kicker text-om">Error 404</p>
        <h1 className="display text-mega mt-4">
          No signal<span className="text-om">.</span>
        </h1>
        <p className="text-lead mt-6 max-w-md text-white/70">This page has moved or never existed. Let&apos;s get you reconnected.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="pill pill-om">
            Back to home
          </Link>
          <Link href="/mobiles" className="pill pill-ghost">
            Browse mobiles
          </Link>
        </div>
      </div>
    </section>
  );
}
