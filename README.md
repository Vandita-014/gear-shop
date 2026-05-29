# Northridge — Product Detail Page

Premium outdoor gear product detail page built with React, TypeScript, and Vite.

## Stack

- **React 18 + TypeScript**
- **TanStack Router** (file-based routing, typed URL search params)
- **Sass / SCSS modules** — no Tailwind, no CSS-in-JS
- **Vite** build tool
- **Fake Store API** (`https://fakestoreapi.com`) for product data
- **Context API** for the cart; **URL search params** for selected variant
- **localStorage** for cart persistence

> Note: the project uses a standard Vite + React setup (see `vite.config.ts`).

## Run

```bash
npm install
npm run dev      # http://localhost:5173  → redirects to /product/1
npm run build
npm run test
```

Node 22.12+ required.

## Routes

- `/` → redirects to `/product/1`
- `/product/$id?color=<id>&size=<label>` — the PDP. Variant selection is in
  the URL, so links are deep-linkable and refresh restores state.

## Folder structure

```
src/
  components/pdp/      ImageGallery, ProductInfo, ColorSwatches,
                       SizeSelector, QuantityPicker, ProductDetails, Header
                       (each component has a co-located .module.scss)
  hooks/               useProduct (fetch + loading/error)
  stores/              CartContext (Context API + localStorage)
  data/                variants.ts — synthesized colour/size/stock/sale
  routes/              index.tsx, product.$id.tsx
  styles/              _variables.scss, _mixins.scss, global.scss
DECISIONS.md
```

## Implementation notes

1. **Hover-zoom on desktop only?** Yes — touch devices have no hover, and
   the same approach keeps mobile interactions simpler. On mobile the
   gallery is a horizontal thumbnail scroller with a dot indicator; a
   pinch-to-zoom lightbox would be a natural enhancement.
2. **Tabs or accordion for the details section?** Accordion. On mobile it
   avoids a horizontal tab strip competing with the thumbnail scroller;
   on desktop it reads more like long-form product copy. One section open
   at a time, Description open by default.
3. **The Fake Store API has no variants, brand, stock, or sale data.**
   Those are synthesized deterministically from `product.id` in
   `src/data/variants.ts` so the UI is rich and stable across reloads.

## State model

`localStorage` under `nua_cart_v1`. Rehydrated on mount, SSR-safe.
Zod. The component holds a working copy in
`useState` and syncs to the URL with `replace: true`. Refresh keeps your
selection; sharing a link reproduces it. See `DECISIONS.md` for why.

- **Quantity** → local component state, clamped to the selected size's
  stock.

## States covered

- Loading (skeleton), fetch error (message), sold-out size (greyed out,
  unselectable, CTA disabled), low-stock size ("Only 2 left in size M"),
  on-sale price (original crossed out + badge), variant deep-linking,
  cart persistence, conditional delivery estimate (hidden when sold out),
  mock async Add-to-Cart with ~15% simulated failure (bonus).

## Known trade-offs

- Gallery thumbnails are duplicates of the hero image — Fake Store API
  returns one image per product.
- No mini-cart drawer yet; "Added ✓" feedback flashes on the CTA.
- Variant data is synthesized client-side (see open question #3).
- Test suite not shipped; the bonus tests would target the variant
  selector states (sold-out disables CTA, low-stock hint, quantity cap).

See **DECISIONS.md** for the architectural call I'd flag and what I'd
clean up with more time.
