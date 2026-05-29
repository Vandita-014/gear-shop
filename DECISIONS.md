# DECISIONS.md

## Architectural call I could have gone either way on

**Variant + cart state: Context API vs. URL-as-source-of-truth.**

The spec asks for global state via Context and also asks for the selected
variant (colour + size) to be reflected in the URL so the page is
deep-linkable. Those two goals pull in different directions. I had two
realistic shapes:

1. **Context owns variant selection**, URL is mirrored after the fact.
   Component reads/writes to Context; an effect syncs Context → URL.
2. **URL owns variant selection** (via TanStack Router's typed `search`
   params); local component state is the working copy; Context is reserved
   strictly for cart (the thing that truly is cross-route).

I picked option 2. Reasoning:

- **Scope-match.** Variant selection is page-local — it only matters on the
  PDP. Lifting it into a global Context would put truly page-local state
  inside an app-wide store, which is exactly the anti-pattern Context gets
  blamed for. Cart, by contrast, is genuinely cross-route (header badge,
  future cart page) and belongs in Context.
- **Deep-linking comes for free.** With the URL as the source of truth,
  share-a-link and refresh-restores-selection are the same code path. No
  separate "rehydrate from URL" effect, no Context↔URL reconciliation bug
  surface.
- **Type-safety.** TanStack Router's `validateSearch` + Zod gives me a
  validated `{ color, size }` shape at the route boundary, with
  `fallback()` handling garbage input. I'd have to rebuild that inside
  Context manually.
- **Trade-off I accepted.** The component has a small `useEffect` that
  writes selection back to the URL with `replace: true`. It's a known
  effect-chain — I kept it tiny and one-directional (state → URL, never
  URL → state after init) to avoid loops. If I were doing this again I'd
  consider a small custom hook (`useUrlState`) to encapsulate that pattern
  so it doesn't leak into the page component.

## What I'd clean up with more time

- **Image gallery is faking it.** Fake Store API returns one image per
  product, so the thumbnails are duplicates of the hero. I'd swap to a real
  multi-image source or generate per-product mocks rather than reusing the
  same URL four times.
- **Cart toast / drawer.** "Added to cart" currently flashes inline on the
  CTA. A proper mini-cart drawer with item list, remove, and subtotal is
  the obvious next move and the Context already exposes everything it
  needs.
- **Tests.** I added a focused `SizeSelector` unit test covering sold-out
  behavior, low-stock hint rendering, and selectable size clicks. This
  validates the variant selector states directly and is a good basis for
  broader coverage.
- **Accordion vs. tabs.** I picked accordion: on mobile it avoids a
  horizontal tab strip that competes with the thumbnail scroller, and on
  desktop the "expand one section at a time" model reads more like
  long-form product copy than app chrome. Tabs would win if the three
  sections were equally important and frequently compared — they aren't.
- **Image zoom on mobile.** Hover-zoom is desktop-only by design (see
  README open questions). On touch I'd add pinch-to-zoom in a lightbox
  rather than approximate hover with a long-press.
