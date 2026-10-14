# Ballet costume shop (demo)

A demo online shop for ballet costumes: browse costumes by photo, pick a size,
and pay with a Stripe **test** card. No real charges are ever made.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in Stripe test keys once checkout exists
npm run dev                  # http://localhost:3000
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/costumes.json` | The costume catalog. Edit this file to add or change costumes. Prices are in cents. |
| `src/lib/costumes.ts` | Costume types (`Costume`, `Size`, `Category`) and lookup helpers. |
| `src/lib/site.ts` | Shop name, tagline, contact email, currency and flat shipping. |
| `src/lib/format.ts` | Price formatting. |
| `src/lib/cart.ts` | The cart, saved in the browser: `useCart()`, `addToCart()`, `setCart()`. |
| `src/components/` | Shared UI: demo banner, header, footer, costume card and image, photo gallery, size picker with Add to cart. |
| `src/app/` | Pages: `/`, `/shop`, `/costume/[slug]`, `/cart`, `/success`. |
| `public/costumes/<slug>/` | Costume photos (4:5 portrait). |

### Photos

The current photos are generated placeholders. To use real photos, put them in
`public/costumes/<slug>/` (JPG or WebP, 4:5 portrait, about 1600×2000) and
update the `photos` paths and alt text in `src/data/costumes.json`.
`npm run placeholders` regenerates placeholders for any listed photo that is
missing.

## Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub (the free Hobby plan is enough).
2. Choose **Add New… > Project**, import `anniewly/ballet-costume-shop`, and
   allow Vercel access to the repository if asked.
3. Keep the detected defaults (Framework: Next.js, no build settings to change)
   and click **Deploy**.
4. Once checkout is built, add the variables from `.env.example` under
   **Project Settings > Environment Variables** (Stripe *test* keys, and
   `NEXT_PUBLIC_SITE_URL` set to the Vercel address), then redeploy.

After that, every push to `main` deploys the live site, and every pull request
gets its own preview link.
