import Link from "next/link";
import type { Post } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/icons";

export function PostRow({ post, index }: { post: Post; index: number }) {
  return (
    <li className="border-t border-line-light last:border-b" data-reveal data-delay={index * 80}>
      <Link href={`/blog/${post.slug}`} className="group grid items-baseline gap-3 py-8 md:grid-cols-[8rem_1fr_14rem_auto] md:gap-8">
        <span className="kicker text-mute">{post.kind}</span>
        <span>
          <span className="display-soft block text-[clamp(1.6rem,2.8vw,2.6rem)] transition-colors duration-500 group-hover:text-om">{post.title}</span>
          <span className="mt-2 block max-w-2xl text-ink-2">{post.excerpt}</span>
        </span>
        <span className="num text-sm text-mute">{formatDate(post.date)}</span>
        <span className="hidden size-12 items-center justify-center rounded-full bg-paper-2 transition-[background-color,color,transform] duration-500 group-hover:rotate-45 group-hover:bg-om group-hover:text-white md:flex">
          <ArrowUpRight />
        </span>
      </Link>
    </li>
  );
}
