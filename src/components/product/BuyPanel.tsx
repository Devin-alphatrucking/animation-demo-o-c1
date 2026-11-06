"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Variant } from "@/lib/data";
import { discountPercent, formatINR } from "@/lib/format";
import { loadGsap, reducedMotion } from "@/lib/motion";
import { productEnquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

type Props = { name: string; kindLabel: string; variants: Variant[]; whatsapp: string; pageUrl: string; glowId: string };

/**
 * Variant picker + WhatsApp purchase. Choosing a colour tweens the hero glow to that finish;
 * changing variant counts the price to its new value.
 */
export function BuyPanel({ name, kindLabel, variants, whatsapp, pageUrl, glowId }: Props) {
  const [id, setId] = useState(variants[0].sku);
  const v = variants.find((x) => x.sku === id) ?? variants[0];
  const priceRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(v.price);

  const storages = useMemo(() => [...new Set(variants.map((x) => x.storage).filter((s): s is string => !!s))], [variants]);
  const colors = useMemo(() => [...new Map(variants.map((x) => [x.color, x.hex])).entries()].map(([n, hex]) => ({ name: n, hex })), [variants]);

  const pick = (storage: string | null, color: string) => {
    const next = variants.find((x) => x.storage === storage && x.color === color) ?? variants.find((x) => x.storage === storage) ?? variants.find((x) => x.color === color) ?? variants[0];
    setId(next.sku);
  };

  useEffect(() => {
    const el = priceRef.current;
    const glow = document.getElementById(glowId);
    if (reducedMotion()) {
      if (el) el.textContent = formatINR(v.price);
      if (glow) glow.style.background = v.hex;
      shown.current = v.price;
      return;
    }
    loadGsap().then(({ gsap }) => {
      if (glow) gsap.to(glow, { backgroundColor: v.hex, duration: 1.2, ease: "power2.out" });
      const o = { n: shown.current };
      gsap.to(o, { n: v.price, duration: 0.9, ease: "power3.out", onUpdate: () => el && (el.textContent = formatINR(Math.round(o.n))) });
      shown.current = v.price;
    });
  }, [v, glowId]);

  const label = [v.storage, v.color].filter(Boolean).join(" · ");
  const buy = whatsappUrl(whatsapp, productEnquiryMessage({ productName: name, variant: label, price: formatINR(v.price), url: pageUrl }));
  const exchange = whatsappUrl(whatsapp, `Hi OM Telecom, I'd like an exchange quote towards the ${name} (${label}).\nMy current phone: \nCondition: `);
  const emi = whatsappUrl(whatsapp, `Hi OM Telecom, which EMI options are available for the ${name} (${label}) at ${formatINR(v.price)}?`);
  const off = discountPercent(v.price, v.mrp);

  return (
    <div className="rounded-[32px] bg-white/[0.04] p-6 ring-1 ring-white/10 backdrop-blur-md md:p-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span ref={priceRef} className="num text-[clamp(2rem,3.4vw,2.8rem)] font-medium">
          {formatINR(v.price)}
        </span>
        {v.mrp > v.price && (
          <>
            <span className="num text-sm text-white/45 line-through">{formatINR(v.mrp)}</span>
            <span className="kicker rounded-full bg-om px-2.5 py-1 text-[0.65rem] text-white">−{off}%</span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-white/45">Indicative price incl. taxes · confirmed by our team in chat</p>

      {storages.length > 0 && (
        <fieldset className="mt-7">
          <legend className="kicker mb-3 text-white/55">{kindLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {storages.map((s) => (
              <button key={s} type="button" aria-pressed={v.storage === s} onClick={() => pick(s, v.color)} className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${v.storage === s ? "bg-white text-night" : "ring-1 ring-white/20 hover:ring-white/60"}`}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-6">
        <legend className="kicker mb-3 text-white/55">
          Finish · <span className="normal-case tracking-normal text-white">{v.color}</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => {
            const exists = variants.some((x) => x.color === c.name && x.storage === v.storage);
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={v.color === c.name}
                onClick={() => pick(exists ? v.storage : null, c.name)}
                className={`relative size-11 rounded-full transition-transform duration-300 hover:scale-110 ${v.color === c.name ? "ring-2 ring-om ring-offset-4 ring-offset-night" : "ring-1 ring-white/25"}`}
                style={{ background: c.hex }}
              />
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 space-y-3">
        {buy ? (
          <a href={buy} target="_blank" rel="noopener noreferrer" className="pill pill-wa !h-14 w-full text-base" data-magnetic>
            <WhatsAppIcon className="size-5" /> Buy on WhatsApp
          </a>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 p-4 text-sm text-white/70">
            <p className="font-semibold text-white">WhatsApp ordering is being set up.</p>
            <p className="mt-1">
              Meanwhile, visit a store to buy this.{" "}
              <Link href="/stores" className="link-grow text-om">
                Find a store
              </Link>
            </p>
          </div>
        )}
        {(exchange || emi) && (
          <div className="grid grid-cols-2 gap-2">
            {exchange && (
              <a href={exchange} target="_blank" rel="noopener noreferrer" className="rounded-full py-3 text-center text-sm font-medium ring-1 ring-white/20 transition-colors hover:bg-white hover:text-night">
                Exchange quote
              </a>
            )}
            {emi && (
              <a href={emi} target="_blank" rel="noopener noreferrer" className="rounded-full py-3 text-center text-sm font-medium ring-1 ring-white/20 transition-colors hover:bg-white hover:text-night">
                Ask about EMI
              </a>
            )}
          </div>
        )}
        <p className="pt-1 text-center text-xs text-white/45">Opens WhatsApp with this exact variant filled in. Nothing is charged online.</p>
      </div>
    </div>
  );
}
