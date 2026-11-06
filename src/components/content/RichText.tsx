import type { ReactNode } from "react";

/** Plain-text format: "## " headings, "- " bullets, blank-line paragraphs. Rendered as text, never HTML. */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (para.length) out.push(<p key={out.length}>{para.join(" ")}</p>);
    if (list.length)
      out.push(
        <ul key={out.length}>
          {list.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>,
      );
    para = [];
    list = [];
  };
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ")) {
      flush();
      out.push(<h2 key={out.length}>{line.slice(3)}</h2>);
    } else if (line.startsWith("- ")) {
      if (para.length) flush();
      list.push(line.slice(2));
    } else {
      if (list.length) flush();
      para.push(line);
    }
  }
  flush();
  return <div className="prose-om">{out}</div>;
}
