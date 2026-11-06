"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { SITE } from "@/data/site";
import { GROUPS } from "@/lib/data";
import { whatsappUrl } from "@/lib/whatsapp";
import { getLenis } from "@/lib/motion";
import { Logo } from "@/components/brand/Logo";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Night header: transparent over the hero, solid once scrolled, hides on the way down. */
export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const wa = whatsappUrl(SITE.whatsapp, "Hi OM Telecom, I have a question.");

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenu(false);
    setSearch(false);
  }

  useEffect(() => {
    const read = () => {
      const y = getLenis()?.scroll ?? window.scrollY;
      setSolid(y > 24);
      setHidden(y > 240 && y > last.current + 2);
      if (y < last.current - 2 || y < 240) setHidden(false);
      last.current = y;
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  // Let sticky elements (filter bars) follow the header as it hides and returns.
  useEffect(() => {
    document.documentElement.dataset.header = hidden && !menu ? "hidden" : "shown";
  }, [hidden, menu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea"))) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 text-[#f1efe9] transition-[transform,background-color,backdrop-filter,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${hidden && !menu ? "-translate-y-full" : "translate-y-0"} ${solid || menu ? "border-b border-white/10 bg-night/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="shell flex h-[72px] items-center gap-6 md:h-20">
          <Logo siteLogo eager className="h-10 md:h-12" />

          <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex" data-intro-hide>
            <ul className="flex items-center gap-6 whitespace-nowrap text-[0.9rem] font-medium xl:gap-8">
              {GROUPS.map((g) => (
                <li key={g.key}>
                  <Link href={g.href} aria-current={pathname === g.href ? "page" : undefined} className="link-grow text-white/80 transition-colors hover:text-white aria-[current=page]:text-white">
                    {g.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/offers" className="link-grow text-om">
                  Offers
                </Link>
              </li>
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2" data-intro-hide>
            <button type="button" onClick={() => setSearch(true)} aria-label="Search products" className="flex size-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <Search className="size-[19px]" strokeWidth={1.8} />
            </button>
            <Link href="/stores" className="hidden h-11 items-center rounded-full px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white md:flex">
              Stores
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="pill pill-wa hidden !h-11 !px-4 text-sm md:inline-flex" data-magnetic>
                <WhatsAppIcon className="size-4" /> Chat
              </a>
            )}
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="site-menu"
              className="group flex h-11 items-center gap-3 rounded-full border border-white/20 pl-4 pr-3 text-sm font-medium transition-colors hover:border-white/50"
            >
              <span>{menu ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${menu ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${menu ? "w-5 -translate-y-[5px] -rotate-45" : "w-3 group-hover:w-5"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
