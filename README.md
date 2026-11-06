# OM Telecom — marketing website

A fully static marketing site for OM Telecom LLP: smartphones, laptops, tablets, wearables, audio and TVs. There is no database, no admin panel and no checkout. Every page is generated at build time from typed files in `src/data/`, and every purchase or enquiry goes through **WhatsApp**.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Stack

- **Framework:** Next.js 16 (App Router, static generation), React 19, TypeScript, Tailwind CSS 4.
- **Motion:** GSAP 3 (ScrollTrigger and Flip) with Lenis smooth scrolling, sharing one motion runtime.
- **Type:** Bricolage Grotesque (display), Geist (text) and Geist Mono (labels and prices).

## Editing content: everything is in `src/data/`

| File | What it controls |
|---|---|
| `site.ts` | **WhatsApp number**, phone, email, address, GSTIN, socials, the homepage "how buying works" points, ways to save, franchise copy and policy text. Empty fields are hidden. |
| `catalog-source.ts` | Brands, categories and products (variants, finish colours, prices, highlights). |
| `stores-source.ts` | Store locations (city, area, pincode, map coordinates). |
| `posts.ts` | Buying guides. |
| `images.generated.ts` | Photo sizes and blur placeholders. **Don't edit by hand** — run `node scripts/build-image-manifest.mjs` after adding photos to `public/images/photos/`. |

### Before going live
1. **WhatsApp number:** set `SITE.whatsapp` in `src/data/site.ts`, digits with the country code, e.g. `919876543210`. Until it's set, the buy buttons and forms say WhatsApp isn't connected and point people to the stores. Nothing pretends to work.
2. **Contact details:** fill in phone, email, address, hours and social links.
3. **Catalogue:** replace the sample prices and highlights with your own, then set `demoCatalogue: false`. Product pages then become indexable and join the sitemap.
4. **Stores:** replace the sample locations with real branches (address, phone, hours), then set `demoStores: false`. This turns on LocalBusiness structured data.
5. **Policies:** have the draft privacy, terms, returns and shipping texts reviewed.
6. **Photography:** the current photos are Unsplash-licensed demo images (see `public/images/CREDITS.md`). Replace them with your own store and product shoots when you can.
7. Set `NEXT_PUBLIC_SITE_URL` to the real domain.

## Motion system

`src/components/motion/MotionRuntime.tsx` applies these site-wide:
- **`data-split`:** words rise out of a mask, with the text split on the server so there's no layout shift.
- **`data-reveal`:** content rises or fades in on scroll.
- **`data-clip`:** images unmask with a slow zoom-out.
- **`data-drift`:** scrubbed parallax.
- **`data-count`:** count-up numbers.
- **`data-magnetic`:** buttons that lean toward the cursor.
- Lenis smooth scrolling.
- An orange curtain over client-side page changes (`template.tsx`).

Signature pieces:
- **Logo intro** (`components/intro/LogoIntro.tsx`): the official logo flies into the header with GSAP Flip while a white curtain splits open. It plays once per session, only on `/`, and never with reduced motion.
- **Phone-window hero** (`components/home/ScreenHero.tsx`): a phone-shaped window opens into a full-bleed photo as you scroll, while the headline parts. It is pinned and scrubbed on desktop.
- **Brand ticker:** speed and direction follow your scroll, and hovering slows it down.
- **Statement:** a paragraph whose words light up as you scroll.
- **Room index:** numbered rows with a photo that follows the cursor.
- **Trending rail:** a pinned horizontal scroll with a progress bar.
- **Ways to save:** stacking cards.
- **Collections:** filtering reflows the grid with GSAP Flip.
- **Product page:** choosing a finish tweens the background glow, and the price counts to the new value.
- **Menu:** a curtain drops with numbered rows and a photo preview on hover.

Everything is readable without JavaScript. Visitors who prefer reduced motion get static layouts, and touch devices skip the pinned scroll scenes.

## Honesty notes
- Product cards are typographic on purpose. We never show a stock photo that might not match the exact model.
- Counters come from the data files, not from marketing claims. A note says when they're based on sample data.
- No reviews, ratings, delivery promises or business figures are invented.
