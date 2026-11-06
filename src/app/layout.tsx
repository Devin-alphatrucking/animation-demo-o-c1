import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-bricolage", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Smartphones, laptops & electronics`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    images: [{ url: "/images/photos/hero-night.jpg", width: 2400, height: 1600, alt: "A phone held up on a city street at night" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0b0d14", colorScheme: "dark light" };

/**
 * Runs before first paint:
 *  - adds `js` so scroll-reveal elements start hidden only when scripts can reveal them
 *  - enables the logo intro on a hard load of "/", once per session, never with reduced motion
 *  - unlocks the page after 6s if the intro never starts (once running, it finishes itself)
 */
const BOOT = `(function(){var d=document.documentElement;d.classList.add("js");try{if(location.pathname!=="/")return;if(sessionStorage.getItem("om-intro-played"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.setAttribute("data-intro","play");setTimeout(function(){if(d.getAttribute("data-intro")==="play"&&!document.querySelector(".om-intro.is-running"))d.setAttribute("data-intro","done")},6000)}catch(e){}})();`;

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/brand/og-default.png`,
  ...(SITE.email ? { email: SITE.email } : {}),
  ...(SITE.phone ? { telephone: SITE.phone } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <a href="#main" className="sr-only z-[200] rounded-full bg-om px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MotionRuntime />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }} />
      </body>
    </html>
  );
}
