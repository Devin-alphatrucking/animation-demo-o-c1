"use client";

import Link from "next/link";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl } from "@/lib/whatsapp";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  half?: boolean;
  autoComplete?: string;
};

/**
 * A form that writes a WhatsApp message instead of posting to a server: the visitor
 * reviews it in WhatsApp and presses send. No data is stored by the website.
 */
export function WhatsAppForm({ number, intro, fields, submitLabel }: { number: string; intro: string; fields: FormField[]; submitLabel: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const configured = !!whatsappUrl(number, "x");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      if (f.required && !v) errs[f.name] = `Please add your ${f.label.toLowerCase()}`;
      else if (f.type === "tel" && v && !/^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""))) errs[f.name] = "Enter a valid 10-digit mobile number";
      else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errs[f.name] = "Enter a valid email";
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      (e.currentTarget.querySelector(`[name="${Object.keys(errs)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    const lines = [intro, ""];
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      if (v) lines.push(`${f.label}: ${v}`);
    }
    const url = whatsappUrl(number, lines.join("\n"));
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const control = (err?: string) =>
    `w-full rounded-2xl bg-white px-4 text-[0.98rem] text-ink outline-none ring-1 transition-shadow placeholder:text-mute focus:ring-2 focus:ring-om ${err ? "ring-om" : "ring-black/10"}`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
          <label htmlFor={f.name} className="kicker mb-2 block text-mute">
            {f.label}
            {f.required && <span className="text-om"> *</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} rows={4} placeholder={f.placeholder} aria-invalid={!!errors[f.name]} className={`${control(errors[f.name])} py-3`} />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} defaultValue="" aria-invalid={!!errors[f.name]} className={`${control(errors[f.name])} h-13 py-3`}>
              <option value="">Choose…</option>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input id={f.name} name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} autoComplete={f.autoComplete} aria-invalid={!!errors[f.name]} className={`${control(errors[f.name])} h-13 py-3`} />
          )}
          {errors[f.name] && <p className="mt-1.5 text-sm font-medium text-om">{errors[f.name]}</p>}
        </div>
      ))}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        {configured ? (
          <button type="submit" className="pill pill-wa" data-magnetic>
            <WhatsAppIcon className="size-5" /> {submitLabel}
          </button>
        ) : (
          <p className="rounded-2xl border border-dashed border-line-light p-4 text-sm text-ink-2">
            WhatsApp isn&apos;t connected yet, so this form can&apos;t send. Please{" "}
            <Link href="/stores" className="link-grow font-semibold text-om">
              visit a store
            </Link>{" "}
            in the meantime.
          </p>
        )}
        <p className="text-xs text-mute">Opens WhatsApp with your details written out — you review and press send. This website doesn&apos;t store anything.</p>
      </div>
    </form>
  );
}
