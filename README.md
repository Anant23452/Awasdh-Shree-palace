# Hotel Awadh Shree Palace

Production-ready Vite + React website for Hotel Awadh Shree Palace in Ayodhya. The project preserves the premium ivory, maroon and gold design while adding multi-page SEO, structured data, responsive images, accessibility improvements and direct-enquiry conversion paths.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The build creates crawlable route-specific HTML for `/`, `/rooms`, `/amenities`, `/gallery`, `/location`, `/about`, `/contact`, `/faq`, `/ayodhya-travel-guide` and `/hotel-near-ram-mandir-ayodhya`. It also creates a branded `404.html`.

## SEO and production files

- `src/seo.js` — verified hotel details, page titles, descriptions and JSON-LD data
- `src/components/SEO.jsx` — browser metadata and structured-data synchronisation
- `scripts/prerender.mjs` — route-specific static HTML generation
- `public/robots.txt` — crawler rules and sitemap reference
- `public/sitemap.xml` — canonical pages and important hotel images
- `public/site.webmanifest` and favicon files — browser and device branding
- `vercel.json` — clean URLs, apex-to-www redirect and security/cache headers

The canonical production origin is `https://www.awadhshreepalace.com`. Do not enable the old Vercel-domain redirect until the custom domain is connected and serving correctly.

## Image workflow

High-quality original photographs are preserved in `source-assets`. Responsive WebP variants and the social sharing image live in `public/assets/optimized`.

Regenerate them after replacing a source photograph:

```bash
npm run optimize:images
```

The hero is preloaded and uses high fetch priority. Below-the-fold images use responsive sources, explicit dimensions and lazy loading.

## Analytics preparation

`src/analytics.js` sends prepared `availability_check`, `room_enquiry`, `whatsapp_click`, `phone_click` and `directions_click` events to `window.dataLayer`. No tracking script or ID is included until the hotel supplies its official analytics property.

## Owner Studio

Owner Studio is available automatically during local development. After signing in, the owner can directly:

- update every room's nightly price;
- upload or remove gallery images;
- add or remove hotel features and facilities.

Changes are published immediately and saved in the current browser using local storage. The local development passcode is `awadh-owner` unless it is changed in `.env`.

This local version is intentionally disabled in production. Do not set `VITE_ENABLE_OWNER_STUDIO=true` on a public site until the dashboard is connected to authenticated server storage such as Supabase or Firebase. A `VITE_` passcode is visible in frontend code and is not production security.

## Information still needed from the hotel

Before final launch, confirm the official email address, Google Business Profile URL, social profile URLs, cancellation/payment policies and whether both listed phone/WhatsApp numbers should remain public. Add only owner-verified information.

## Recommended launch checklist

1. Connect `www.awadhshreepalace.com` to Vercel and verify HTTPS.
2. Confirm the apex domain permanently redirects to `www`.
3. Only after the custom domain works, redirect the production Vercel alias to the canonical domain.
4. Verify the site in Google Search Console and submit `/sitemap.xml`.
5. Match the hotel name, address and phone exactly in Google Business Profile.
6. Add official GA4/Tag Manager IDs and mark enquiry actions as conversions.
7. Validate Hotel and FAQ JSON-LD in Google Rich Results Test.

The availability form creates a pre-filled WhatsApp enquiry. It does not confirm a reservation or process payment; the hotel team confirms availability and the final amount personally.
