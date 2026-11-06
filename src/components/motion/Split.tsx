import type { ElementType, ReactNode } from "react";

/**
 * Headline whose words rise out of a mask. Split on the server (no layout shift, no
 * runtime measuring). Lines are authored explicitly; wrap a line in *asterisks* to set
 * it in the accent colour. `now` plays on load (above the fold) instead of on scroll.
 */
export function Split({
  as: Tag = "h2",
  lines,
  className = "",
  now = false,
  delay = 0,
  accentClass = "text-om",
  id,
  children,
}: {
  id?: string;
  as?: ElementType;
  lines: string[];
  className?: string;
  now?: boolean;
  delay?: number;
  accentClass?: string;
  children?: ReactNode;
}) {
  const label = lines.map((l) => l.replace(/^\*|\*$/g, "")).join(" ");
  return (
    <Tag id={id} data-split={now ? "now" : ""} data-delay={delay} aria-label={label} className={className}>
      {lines.map((raw, li) => {
        const accent = raw.startsWith("*") && raw.endsWith("*");
        const text = accent ? raw.slice(1, -1) : raw;
        return (
          <span key={li} aria-hidden="true" className={`block ${accent ? accentClass : ""}`}>
            {text.split(" ").map((word, wi, arr) => (
              <span key={wi} className="w">
                <span className="w-in">
                  {word}
                  {wi < arr.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </span>
        );
      })}
      {children}
    </Tag>
  );
}
