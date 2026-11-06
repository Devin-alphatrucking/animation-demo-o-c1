import Image from "next/image";
import Link from "next/link";

export const LOGO_SRC = "/brand/om-telecom-logo.webp";
export const LOGO_W = 1477;
export const LOGO_H = 1065;

/**
 * The official OM Telecom LLP logo, untouched. It has a white background, so it always
 * sits on a white "tile" — on dark rooms that tile becomes a deliberate badge.
 */
export function Logo({ className = "h-12", eager = false, siteLogo = false, tile = true }: { className?: string; eager?: boolean; siteLogo?: boolean; tile?: boolean }) {
  return (
    <Link href="/" aria-label="OM Telecom LLP — home" className={`inline-flex shrink-0 items-center ${tile ? "rounded-2xl bg-white px-1.5 py-1" : ""}`}>
      <Image
        src={LOGO_SRC}
        alt="OM Telecom LLP"
        width={LOGO_W}
        height={LOGO_H}
        sizes="140px"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        className={`${className} w-auto`}
        draggable={false}
        {...(siteLogo ? { "data-site-logo": "" } : {})}
      />
    </Link>
  );
}
