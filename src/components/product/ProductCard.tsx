import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatINR } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/icons";

/**
 * Spec card. Until real product photography exists, cards are typographic on purpose:
 * we never show a stock photo that might not match the exact model listed.
 * The colour glow comes from the product's real finish colours.
 */
export function ProductCard({ p, tone = "paper", index, className = "min-h-[23rem]" }: { p: Product; tone?: "paper" | "night"; index?: number; className?: string }) {
  const night = tone === "night";
  const glow = p.colors[0]?.hex ?? "#b9aef5";
  return (
    <Link
      href={`/products/${p.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 ${className} transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 md:p-7 ${night ? "bg-night-2 text-white ring-1 ring-white/8" : "bg-white text-ink ring-1 ring-black/5 hover:shadow-[0_30px_60px_-30px_rgba(15,18,32,.35)]"}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full opacity-35 blur-3xl transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-125 group-hover:opacity-70"
        style={{ background: glow }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`kicker ${night ? "text-white/55" : "text-mute"}`}>
          {index !== undefined && <span className="mr-2 text-om">{String(index + 1).padStart(2, "0")}</span>}
          {p.brand.name}
        </span>
        <span className="flex gap-1.5">
          {p.isNew && <span className="kicker rounded-full bg-om px-2 py-1 text-[0.6rem] text-white">New</span>}
          {p.discount > 0 && <span className={`kicker rounded-full px-2 py-1 text-[0.6rem] ${night ? "bg-white/10" : "bg-paper-2"}`}>−{p.discount}%</span>}
        </span>
      </div>

      <h3 className="display relative mt-8 text-[clamp(1.9rem,2.6vw,2.6rem)] leading-[0.95] transition-colors duration-500 group-hover:text-om">{p.name}</h3>
      <p className={`relative mt-3 line-clamp-2 text-sm ${night ? "text-white/60" : "text-ink-2"}`}>{p.short}</p>

      <div className="relative mt-auto pt-8">
        <div className="flex items-center gap-1.5" aria-label={`${p.colors.length} colours`}>
          {p.colors.slice(0, 5).map((c) => (
            <span key={c.name} title={c.name} className={`size-4 rounded-full ring-2 ${night ? "ring-night-2" : "ring-white"} shadow-[0_0_0_1px_rgba(0,0,0,.12)]`} style={{ background: c.hex }} />
          ))}
          {p.storages.length > 0 && <span className={`ml-2 text-xs ${night ? "text-white/50" : "text-mute"}`}>{p.storages.length > 1 ? `${p.storages.length} variants` : p.storages[0]}</span>}
        </div>
        <div className={`mt-4 flex items-end justify-between border-t pt-4 ${night ? "border-white/10" : "border-black/8"}`}>
          <p>
            <span className={`block text-xs ${night ? "text-white/50" : "text-mute"}`}>from</span>
            <span className="num text-xl font-medium">{formatINR(p.price)}</span>
            {p.mrp > p.price && <span className={`num ml-2 text-xs line-through ${night ? "text-white/40" : "text-mute"}`}>{formatINR(p.mrp)}</span>}
          </p>
          <span className={`flex size-11 items-center justify-center rounded-full transition-[background-color,color,transform] duration-500 group-hover:rotate-45 group-hover:bg-om group-hover:text-white ${night ? "bg-white/10" : "bg-paper"}`}>
            <ArrowUpRight />
          </span>
        </div>
      </div>
    </Link>
  );
}
