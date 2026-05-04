# Hero + ImageScroller merge — design

_Date: 2026-05-04. Status: draft for review._

## Goal

Replace the existing `Hero` (text + CTA + static image slot) and `ImageScroller`
(carousel) with a single composite that crossfades a list of images, where each
slide carries its own description. The component lives where the page's
"hero" lives — at the top of `HomePage` — and uses the example folder's
full-bleed look, including the bottom fade-to-bg that lets the section seamlessly
merge into the page below.

## Non-goals

- No prev/next arrow buttons. No keyboard arrow-key navigation. (User chose
  "dots only" with the option to drop them later.)
- No per-slide eyebrow or per-slide title. The title is fixed across all slides;
  only the description and the image change.
- No swipe gestures. (The site is desktop-first and the existing image-scroller
  didn't ship gestures either.)
- No CMS / API integration for the slide list. Slides are hand-curated in the
  consumer page from translation keys + image URLs.

## Component contract

Path: `apps/frontend/src/shared/components/composite/hero/hero.tsx` (the existing
`hero/` folder is reused — its contents are replaced).

```ts
import type { ReactNode } from "react";

export type HeroSlide = {
  /** Image URL. Required. */
  src: string;
  /** Image alt text. Required (a11y). */
  alt: string;
  /** Justified description text shown beneath the title. Required —
   *  the description is what changes per slide. */
  description: string;
};

export type HeroProps = {
  /** Fixed across all slides. Rendered as <h1>. */
  title: string;
  /** Slides cycle in lockstep: image fades, description fades, both at once. */
  slides: ReadonlyArray<HeroSlide>;
  /** Primary CTA — a <Button> the consumer hands in. */
  ctaPrimary: ReactNode;
  /** Secondary CTA — a <Button variant="outline"> the consumer hands in. */
  ctaSecondary: ReactNode;
  /** Auto-advance interval in ms. Default 5500. */
  intervalMs?: number;
  /** Optional aria region label override (default "Hero gallery"). */
  ariaLabel?: string;
  /** Optional aria-label template for slides. */
  slideLabel?: (info: { index: number; total: number }) => string;
  className?: string;
};

export function Hero(props: HeroProps): JSX.Element;
```

### Why this shape

- `slides: ReadonlyArray<HeroSlide>` is the "dictionary of image + description"
  the user described, in TypeScript shape. A single-element array is valid and
  cleanly degenerates to a no-carousel hero (no auto-advance, no dots).
- `ctaPrimary` / `ctaSecondary` as separate `ReactNode` props (instead of one
  `cta: ReactNode` slot) lets the component own the equal-width wrapper. The
  wrapper uses `grid grid-cols-1 sm:grid-cols-2 gap-3 [&>*]:w-full` — the
  child-selector `[&>*]:w-full` forces every direct child (each Button) to fill
  its cell, so equal width is guaranteed by the component without asking the
  consumer to remember `className="w-full"`. The consumer just hands in two
  `<Button>` nodes; layout is the component's job.
- `title: string` makes it explicit the title is fixed; it's not a per-slide field.
- `intervalMs` defaults to 5500 (matches the example). 5000 was the existing
  ImageScroller default; 5500 reads slightly less rushed in lockstep with text.

## Visual & layout spec

Layout direction: **A — full-bleed**, matching `example/premium-smile (1)/components/composites.jsx`'s `Hero`.

```
┌─ <section> full-bleed, h = clamp(560px, 80vh, 780px) ───────────┐
│  ┌─ image layer (absolute inset-0) ───────────────────────────┐ │
│  │  <img> for each slide, absolutely stacked, opacity         │ │
│  │  transitions in lockstep. Dark gradient overlay over image  │ │
│  │  (top→bottom: rgba(20,15,30,.22) → .05 → .40) so white      │ │
│  │  text reads on any photo.                                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─ bottom fade-to-bg (absolute, h=35%, bottom:0) ────────────┐ │
│  │  background: linear-gradient(180deg, transparent 0%,        │ │
│  │  var(--bg) 65%); pointer-events:none; z-index:3;            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─ solid slab (absolute, bottom:-1px, h=2px, bg-bg) ─────────┐ │
│  │  Kills any sub-pixel seam against the section below.        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─ text overlay (absolute, bottom-positioned, max-w-[720px]) ┐ │
│  │   <Heading level={1}> {title} </Heading>   (white, fixed)   │ │
│  │   <p text-justify aria-live="polite">                       │ │
│  │     {slides[active].description}                            │ │
│  │   </p>  (white, lockstep crossfade with image)              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─ CTA row (absolute, below text) ───────────────────────────┐ │
│  │  grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md             │ │
│  │   ctaPrimary (w-full)   ctaSecondary (w-full)               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─ dots (absolute, bottom-3, centered, hidden if length≤1) ──┐ │
│  │   • • •                                                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Concrete Tailwind / class plan

- Section root: `relative w-full overflow-hidden bg-bg-subtle` plus a height that
  scales: `h-[clamp(560px,80vh,780px)]` (mobile floor, desktop cap; matches the
  example's `min(80vh, 640px)` / `min(88vh, 780px)` band).
- Image stack: each slide is `absolute inset-0 transition-opacity duration-1000
  ease-in-out motion-reduce:transition-none` with `opacity-100` on the active
  slide and `opacity-0 pointer-events-none` on the rest. `<img>` is
  `h-full w-full object-cover`, `loading={i === 0 ? "eager" : "lazy"}`,
  `decoding="async"`. Alt text is `""` on inactive slides, real `alt` on active.
- Per-image dark overlay: `absolute inset-0 bg-gradient-to-b
  from-[rgb(20_15_30_/_0.22)] via-[rgb(20_15_30_/_0.05)] to-[rgb(20_15_30_/_0.40)]
  pointer-events-none`. (These rgb-with-alpha values mirror the example exactly;
  not theme-tied because their job is image legibility, not page chrome.)
- Bottom fade-to-bg: `absolute inset-x-0 bottom-0 h-[35%] pointer-events-none
  z-[3]` with `bg-gradient-to-b from-transparent to-bg via-bg/0`. Tailwind 4
  arbitrary stop: `bg-[linear-gradient(180deg,transparent_0%,var(--bg)_65%)]`.
  The `var(--bg)` reference picks up whichever theme is active (`light`,
  `dark`, `brand`).
- Solid slab: `absolute inset-x-0 bottom-[-1px] h-[2px] bg-bg z-[3]
  pointer-events-none`. (Sub-pixel-seam guard.)
- Text overlay: `absolute left-[clamp(24px,5vw,46px)] right-[clamp(24px,5vw,46px)]
  bottom-[clamp(170px,18vh,230px)] z-[4] max-w-[720px] flex flex-col gap-4`.
  - Title: `<Heading level={1}>` styled white via the heading's existing API
    (or wrapped in a span with `text-white drop-shadow-[0_2px_24px_rgba(20,15,30,0.35)]
    [text-wrap:balance]`).
  - Description: `<p>` with `text-white/95 max-w-[540px] text-justify
    leading-snug drop-shadow-[0_1px_12px_rgba(20,15,30,0.4)]`. Each slide's
    description is rendered as its own absolutely-stacked block (same lockstep
    crossfade pattern as the images), so they share a single `aria-live`
    region but visually crossfade.
- CTA row: `absolute left-[clamp(24px,5vw,46px)] bottom-[clamp(80px,11vh,130px)]
  z-[4] grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md [&>*]:w-full`.
  The trailing `[&>*]:w-full` is what guarantees equal width for `ctaPrimary`
  and `ctaSecondary` — the consumer doesn't have to know about it.
- Dots: `absolute inset-x-0 bottom-3 z-[4] flex justify-center gap-2`. Active
  dot: `w-7 bg-white`; inactive: `w-2 bg-white/50 hover:bg-white/85
  hover:scale-125`. Mirrors the existing ImageScroller's dot styling.

### Justified description — why & how

Per the user's hard requirement: the description text is `text-justify` always.
At `max-w-[540px]` with `leading-snug`, justification reads cleanly without
ugly word gaps. (At narrower widths — the previous Hero's two-column right-half
risk — justification would have been a problem; in the full-bleed layout it's
fine.)

## Behavior

- **Auto-advance.** When `slides.length >= 2`, set up a `setInterval` that
  bumps `active` every `intervalMs` (default 5500). Cleared on unmount.
- **Lockstep crossfade.** The image and description for slide `i` share the
  same `active === i` opacity rule. Both transition `opacity` over 1000ms with
  `ease-in-out`. They are siblings at the DOM level (image inside the image
  layer, description inside the text overlay) — both keyed by index — so React
  doesn't unmount/remount on each tick; only opacity changes.
- **Reduced motion.** `motion-reduce:transition-none` on every fading element.
  The active slide is still visible (no broken state), it just snaps instead of
  fading.
- **Dot click.** Clicking dot `i` calls `setActive(i)` and resets the interval
  timer (so the user gets the full duration on the slide they picked, not a
  half-tick to the next one).
- **Single-slide degenerate case.** When `slides.length === 1`: no interval, no
  dots. `aria-roledescription="carousel"` is dropped (it's a single image, not
  a carousel anymore). The component still renders the title, description,
  CTAs, and fade-to-bg.
- **Empty case.** `slides.length === 0` is allowed (developer can story it) —
  renders the section with the fade-to-bg and the title/description/CTA, no
  image. This avoids a hard crash if a translation array is empty.

## Accessibility

- The `<section>` carries `aria-label={ariaLabel}` and, when length ≥ 2,
  `aria-roledescription="carousel"`.
- Each slide is a `<div role="group" aria-roledescription="slide"
  aria-label={slideLabel({index, total})} aria-current={isCurrent}>`. (Same
  ARIA pattern the existing ImageScroller uses.)
- The active slide's `<img alt={...}>` carries the real `alt`. Inactive slides
  have `alt=""` so screen readers don't announce them.
- The description block uses an `aria-live="polite"` wrapper so screen-reader
  users hear the description change when the slide rotates. (This is a behavior
  the existing components didn't have — the merge improves on both.)
- Dots are real `<button type="button">` elements with `aria-label` matching
  `slideLabel` and `aria-current` on the active one.
- Title is `<h1>` (the page-level top heading). Each subsequent section heading
  on the page is `<h2>`, preserving heading order.
- The component must pass `vitest-axe` with zero violations in: multi-slide,
  single-slide, and empty cases.

## i18n

The consumer (`HomePage`) builds the `slides` array; the component itself is
i18n-agnostic. New translation keys (added to both `en/common.json` and
`ro/common.json` in the same commit):

```jsonc
"home": {
  "hero": {
    "title": "...",        // already exists, kept
    "cta_primary": "...",  // already exists, kept
    "cta_secondary": "...", // already exists, kept
    "slides": {
      "calm": {
        "alt": "Calm treatment room with natural light",
        "description": "..."
      },
      "team": {
        "alt": "Confident patient smiling with a clinician",
        "description": "..."
      },
      "result": {
        "alt": "A natural-looking smile after veneers",
        "description": "..."
      }
    }
  }
}
```

The existing `home.hero.subtitle` and `home.hero.image_placeholder` keys are
**deleted** from both locale files (subtitle is replaced by the per-slide
`description`; the placeholder concept is gone — there's always an image).

## Files to create / modify / delete

### Modified

- `apps/frontend/src/shared/components/composite/hero/hero.tsx` — replace
  contents with the new merged component.
- `apps/frontend/src/shared/components/composite/hero/hero.stories.tsx` —
  rewrite stories: `Default` (3 slides), `SingleSlide`, `Empty`, `LongDescription`,
  `ReducedMotion` (with `parameters: { motion: "reduce" }` if available, else
  documented in story description).
- `apps/frontend/src/shared/components/composite/hero/hero.a11y.test.tsx` —
  rewrite to cover multi-slide, single-slide, and empty cases.
- `apps/frontend/src/pages/home/home-page.tsx` — update the `<Hero>` call site:
  drop the `subtitle` and `image` props; pass `title`, `slides` (built from
  the three new i18n keys), `ctaPrimary`, `ctaSecondary` (each Button gets
  `className="w-full"`).
- `apps/frontend/src/i18n/locales/en/common.json` and
  `apps/frontend/src/i18n/locales/ro/common.json` — add the `slides` block,
  remove the `subtitle` and `image_placeholder` keys.

### Created

- `apps/frontend/src/shared/components/composite/hero/hero.test.tsx` — a new
  behavior test covering auto-advance, dot click resets timer, lockstep
  text/image change, single-slide skips dots/interval, empty doesn't crash.
  (The existing Hero had no behavior test — this is new.)

### Deleted

- `apps/frontend/src/shared/components/composite/image-scroller/` — the entire
  folder, including `image-scroller.tsx`, `image-scroller.stories.tsx`,
  `image-scroller.test.tsx`, `image-scroller.a11y.test.tsx`. Confirmed no
  other consumers (only references are inside the folder itself).

## Tests

### Behavior (`hero.test.tsx`, Vitest + RTL, fake timers)

- Renders the title and the first slide's description on mount.
- Marks the first slide group as `aria-current="true"` and others as `false`.
- After `intervalMs`, the second slide's description is what's "current" —
  i.e. the corresponding `<div role="group">` for the second slide has
  `aria-current="true"`. (Opacity transitions are CSS, not asserted directly;
  we assert the ARIA state which drives them.)
- Clicking the dot at index 2 makes that slide current, and the interval is
  reset (advancing time by `intervalMs - 1` does NOT advance further; another
  full tick does).
- With `slides.length === 1`: no dots in the DOM, no auto-advance after
  several intervals.
- With `slides.length === 0`: the section still renders; no thrown error.
- Both CTA buttons are present and accessible by name. (Tests assert presence
  via `getByRole("button", { name: ... })` — they don't reach into Tailwind
  classes. Equal-width is enforced by the `[&>*]:w-full` wrapper class, which
  is a CSS concern verified visually in Storybook, not in unit tests.)

### A11y (`hero.a11y.test.tsx`, vitest-axe)

- Multi-slide: zero violations.
- Single-slide: zero violations.
- Empty: zero violations.
- (Optional) An explicit assertion that `<h1>` exists exactly once in the
  rendered output.

## Storybook

- `Default` — three slides, real-ish unsplash URLs (re-using the URLs from
  the deleted ImageScroller stories), interval default 5500, both CTAs.
- `SingleSlide` — one slide; verifies dots/interval are gone.
- `LongDescription` — one slide with a long description string to visually
  verify the `text-justify` behavior at the maxWidth.
- `Empty` — empty slides array; renders without an image.

## Theme behavior

The component relies on:
- `bg-bg-subtle` for the section background (visible only briefly during image
  load).
- `var(--bg)` (via Tailwind arbitrary value) for the bottom fade target — this
  is the critical one: it makes the seam between hero and the next section
  invisible across `light`, `dark`, and `brand` themes without recompiling.
- `text-white` and dark-image-overlay tints for the over-image text. The white
  is intentional and theme-independent (white text on photographs, regardless
  of theme).

## Build & verification

`task check` must pass. That includes:
- `tsc --noEmit` (strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess,
  noUnusedLocals — important: array indexing in the slides loop has to be
  type-safe; we'll use `.map((s, i) => …)` and not bare-index access).
- `vitest run` (behavior + a11y).
- `biome check src/`.
- Storybook builds.

## Risks & open questions

1. **Image source URLs in the consumer.** The plan as written re-uses the
   unsplash URLs the existing ImageScroller stories used. If the user wants
   real clinic photos checked into `public/` instead, that's a one-line
   change in `home-page.tsx` (URLs swap) — not a structural change.
2. **The text overlay on phone widths.** The example uses absolute positioning
   tied to viewport-height clamps, which can collide with the dots on very
   short / wide windows (e.g. landscape phone). The CSS plan above keeps the
   dots at `bottom-3` with the CTA row above them at `bottom-[clamp(80px,…)]`
   and the text above the CTA — we'll verify in Storybook at common breakpoints
   before declaring done. If a collision shows up, we adjust the clamps.
3. **The `aria-live` region on the description.** Polite live regions are
   correct for "ambient" content updates like a 5.5s carousel, but they DO
   announce. If that turns out noisy in practice, we can drop it; the slides'
   `aria-current` ARIA pattern still tells screen readers what's active.
