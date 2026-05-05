# Clinic location section — design

_Date: 2026-05-05. Status: draft for review._

## Goal

A standalone home-page section, placed directly above the footer, that shows
the clinic's location on a Google Map alongside its address and phone number.
The map is rendered via the Google Maps Embed iframe (no JS SDK, no API key,
no billing). The address and phone each sit on their own row, with a round
icon button (`MapPin` / `Phone`) to the left of the text, matching the visual
language of the social-link round buttons in the footer. Each row is a single
clickable target: the address row opens Google Maps directions, the phone row
opens a `tel:` dial.

## Non-goals

- No interactive Google Maps JS SDK, no `@vis.gl/react-google-maps`, no
  `@react-google-maps/api`. Iframe embed only. (User picked option B in
  brainstorming — no key, no billing.)
- No custom map tile colours / Snazzy Maps style. The iframe inherits Google's
  default tile look. The on-brand feel comes from the chrome around the map
  (rounded corners, lavender section background, on-brand contact panel), not
  from restyling the tiles.
- No reverse-geocoding, no `address` → embed URL derivation. The consumer
  hands in a ready-made Embed URL (the one Google generates under
  "Share → Embed a map"). Same for the directions URL.
- No "open in Google Maps" overlay button on the map itself. The address row
  is the directions affordance.
- No address autocomplete, no place picker, no editable form. This is a
  presentation site — the location is fixed at consumer-site level.
- No backend, no analytics on click-through. (Out of scope for the project
  per CLAUDE.md.)

## Architecture

Two new files, in two existing folders that already follow the repo's tier
conventions (atom in `ui/`, composite in `composite/`).

```
apps/frontend/src/shared/components/
  ui/map-frame/
    map-frame.tsx                  -- atom: the iframe + chrome
    map-frame.stories.tsx          -- 3 stories (default, video, square)
  composite/clinic-location/
    clinic-location.tsx            -- composite: heading + map + contact panel
    clinic-location.stories.tsx    -- 2 stories (default, long-address)
    clinic-location.test.tsx       -- behavior: rows render as anchors with correct hrefs
    clinic-location.a11y.test.tsx  -- axe regression
```

Atoms get no `.a11y.test.tsx` per CLAUDE.md (atoms are covered by the
Storybook a11y addon in isolation). Composites get one — non-negotiable.

Import direction follows the repo's one-way rule: `ClinicLocation` (composite)
imports `MapFrame` (atom), `SectionHeading` (composite), `Container` (atom),
`cn` (lib), and the `MapPin` / `Phone` icons from `lucide-react`. Nothing
imports back into atoms.

## `MapFrame` (atom) contract

Path: `apps/frontend/src/shared/components/ui/map-frame/map-frame.tsx`

```ts
type MapFrameAspect = "wide" | "video" | "square";

export type MapFrameProps = {
  /** Google Maps "Embed a map" URL — i.e. `https://www.google.com/maps/embed?pb=...`.
   *  Anything else (a `maps.app.goo.gl` short link, a regular maps URL) will
   *  not render correctly because Google's embed endpoint is the only one
   *  that allows iframing. The component does not validate the URL — that's
   *  a consumer-site responsibility. */
  embedSrc: string;
  /** Required. Becomes `<iframe title>`, which is the only label assistive
   *  tech sees for the iframe. Should describe what the map is showing,
   *  e.g. "Map showing Premium Smile clinic location". */
  title: string;
  /** Visual aspect ratio. Default `"wide"` (16:10 — landscape with a touch
   *  of vertical breathing room). `"video"` is 16:9. `"square"` is 1:1. */
  aspect?: MapFrameAspect;
  className?: string;
};
```

Render shape:

```tsx
<div
  className={cn(
    "overflow-hidden rounded-2xl border border-border-subtle bg-bg-subtle shadow-sm",
    ASPECT_CLASS[aspect],
    className
  )}
>
  <iframe
    src={embedSrc}
    title={title}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="h-full w-full border-0"
    allow=""
  />
</div>
```

`ASPECT_CLASS` maps to Tailwind utilities: `wide → aspect-[16/10]`,
`video → aspect-video`, `square → aspect-square`.

Why the `bg-bg-subtle` background under the iframe: the iframe shows white
while Google's tiles load — putting the section's lavender behind it keeps
the load state on-brand instead of flashing white.

`allow=""` is deliberate: the embed needs none of the standard iframe
permissions (no fullscreen, no payment, no microphone), so we explicitly
hand none. `loading="lazy"` defers the iframe until it scrolls near the
viewport, important because Google Maps embeds are non-trivial in size.

## `ClinicLocation` (composite) contract

Path: `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.tsx`

```ts
export type ClinicLocationProps = {
  /** Optional eyebrow above the title (e.g. "Find us"). */
  eyebrow?: string;
  /** Section heading, e.g. "Visit our clinic". */
  title: string;
  /** Passed to `<MapFrame>`. */
  embedSrc: string;
  /** Map iframe title (a11y). Passed to `<MapFrame>`. */
  mapTitle: string;
  /** Where the address row links to. Typically a Google Maps directions URL
   *  (`https://www.google.com/maps/dir/?api=1&destination=...`) or a
   *  shareable maps.app.goo.gl link. Opens in a new tab. */
  directionsHref: string;
  /** Visible address text, e.g. "Strada Ana Ipătescu nr. 11, București". */
  address: string;
  /** Aria-label for the address row's link, e.g. "Get directions to {address}". */
  directionsLabel: string;
  /** Visible phone, e.g. "+40 700 000 000". */
  phone: string;
  /** Aria-label for the phone row's link, e.g. "Call {phone}". */
  callLabel: string;
  /** Optional override; defaults to `tel:` of the digits in `phone`. */
  phoneHref?: string;
  /** id for the section heading — used as `aria-labelledby` on the wrapping
   *  section. Default `"clinic-location-heading"`. */
  headingId?: string;
  className?: string;
};
```

Render shape:

```tsx
<section
  aria-labelledby={headingId}
  className={cn("bg-bg-subtle py-12 sm:py-16 lg:py-20", className)}
>
  <Container width="lg">
    <SectionHeading
      eyebrow={eyebrow}
      title={title}
      id={headingId}
      align="start"
    />

    <div className="mt-8 grid gap-6 sm:mt-10 lg:mt-12 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10">
      <MapFrame embedSrc={embedSrc} title={mapTitle} aspect="wide" />

      <div className="flex flex-col gap-4 sm:gap-5">
        <ContactRow
          href={directionsHref}
          ariaLabel={directionsLabel}
          icon={<MapPin aria-hidden />}
          text={address}
          external
        />
        <ContactRow
          href={phoneHref ?? `tel:${phone.replace(/\s/g, "")}`}
          ariaLabel={callLabel}
          icon={<Phone aria-hidden />}
          text={phone}
        />
      </div>
    </div>
  </Container>
</section>
```

`ContactRow` is a private helper inside `clinic-location.tsx` — not its own
file, since it's only used here and exposing it as a public composite would
multiply the surface area for no gain.

```tsx
type ContactRowProps = {
  href: string;
  ariaLabel: string;
  icon: ReactNode;
  text: string;
  /** Adds target="_blank" + rel="noopener noreferrer". */
  external?: boolean;
};

function ContactRow({ href, ariaLabel, icon, text, external }: ContactRowProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 rounded-2xl p-3 -m-3 transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span
        aria-hidden
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-bg-elevated text-accent transition-all duration-200 ease-out group-hover:scale-105 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg [&_svg]:h-5 [&_svg]:w-5"
      >
        {icon}
      </span>
      <span className="text-base font-medium text-fg transition-colors duration-200 group-hover:text-accent sm:text-lg">
        {text}
      </span>
    </a>
  );
}
```

The round-circle styling is intentionally a near-clone of `IconButton`'s
`BASE_CLASS`, but with `group-hover:` triggers on the parent `<a>` so the
whole row drives the animation. We do not nest `IconButton` inside the
anchor — nesting interactive elements inside `<a>` is invalid HTML and
hostile to screen readers (an `IconButton` renders either `<a>` or
`<button>`, both of which are interactive content per the HTML spec).

## Responsive layout

| Breakpoint | Layout |
|---|---|
| `< lg` (≤ 1023px) | Stack: heading → map → contact panel. Map `aspect-[16/10]`, full row width. Each contact row spans full width. |
| `≥ lg` | Two-column grid below the heading. Map (3fr) on the left, contact panel (2fr) on the right. `items-center` so the contact rows sit vertically centred against the map. |

The `-m-3 p-3` trick on each `ContactRow` enlarges the click/tap target
without changing visual placement — every row gets a hit area at least
44 × 44 px (the icon circle alone is already 44 px), with extra padding
on the rest of the row.

## A11y

- `<section>` carries `aria-labelledby={headingId}`.
- `<iframe>` carries the required `title` (passed in via `mapTitle`).
- The round icon `<span>` is `aria-hidden` (purely decorative — the link's
  `aria-label` carries meaning).
- Each row's `<a>` has an `aria-label` that names the action ("Get
  directions to {address}", "Call {phone}").
- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
  matching the rest of the design system.
- Reduced motion: the global `prefers-reduced-motion` rule in `index.css`
  already kills the hover transitions. Nothing extra needed.
- A11y regression test (`clinic-location.a11y.test.tsx`) renders the
  composite via `renderPageWithLayout` and asserts `await axe(container)`
  returns zero violations.

## i18n keys

Added to both `apps/frontend/src/i18n/locales/en/common.json` and
`apps/frontend/src/i18n/locales/ro/common.json` in the same commit (per
CLAUDE.md's "edit both in the same commit" rule).

| Key | EN | RO |
|---|---|---|
| `home.location.eyebrow` | `Find us` | `Ne găsești` |
| `home.location.title` | `Visit our clinic` | `Vizitează clinica noastră` |
| `home.location.address` | `Strada Ana Ipătescu nr. 11, București` | _(same — proper noun)_ |
| `home.location.directions_label` | `Get directions to {{address}}` | `Vezi direcțiile către {{address}}` |
| `home.location.call_label` | `Call {{phone}}` | `Sună la {{phone}}` |
| `home.location.map_title` | `Map showing Premium Smile clinic location` | `Hartă cu locația clinicii Premium Smile` |

`footer.phone` is reused for the visible phone string and the `tel:` href —
no duplicate phone-number keys.

The two URL constants (`embedSrc`, `directionsHref`) live as module-level
`const`s at the top of `home-page.tsx`. They are not translatable — both
are pure URLs. Documented inline so the future "swap in real values" edit
is obvious.

## Wiring into `HomePage`

```tsx
const CLINIC_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=..." +
  "..."; // Universitatea București placeholder — replace with actual clinic URL.
const CLINIC_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=Universitatea+Bucuresti";

// ... inside HomePage's JSX, after <ReviewsCarousel> and as the last section:
<ClinicLocation
  eyebrow={t("home.location.eyebrow")}
  title={t("home.location.title")}
  embedSrc={CLINIC_EMBED_SRC}
  mapTitle={t("home.location.map_title")}
  directionsHref={CLINIC_DIRECTIONS_HREF}
  address={t("home.location.address")}
  directionsLabel={t("home.location.directions_label", {
    address: t("home.location.address"),
  })}
  phone={t("footer.phone")}
  callLabel={t("home.location.call_label", { phone: t("footer.phone") })}
/>
```

The placeholder embed URL points at a recognisable Bucharest landmark so
the map renders something during development. The two `_HREF` constants
get swapped to the real clinic URLs when those are known. Search-and-replace
of `Universitatea+Bucuresti` is the only change needed.

The `Footer` component is rendered by the root layout (`__root.tsx`), not
by `HomePage`, so appending this section at the end of `HomePage` puts it
directly above the footer — no other layout changes required.

## Stories & tests

**`map-frame.stories.tsx`** — three stories under `UI/MapFrame`:

- `Default` — uses a public Bucharest embed URL, default aspect.
- `VideoAspect` — same URL, `aspect="video"`.
- `SquareAspect` — same URL, `aspect="square"`.

**`clinic-location.stories.tsx`** — two stories under `Composite/ClinicLocation`:

- `Default` — placeholder Bucharest embed + address + phone, matching the
  values used in `HomePage`.
- `LongAddress` — a deliberately long address (street + landmark + sector +
  postal code) to verify text wrapping doesn't break the row layout or
  push the round icon off-centre.

**`clinic-location.test.tsx`** (Vitest + RTL):

- Renders the composite. Asserts:
  - Two `role="link"` elements exist with the expected `href` values
    (one for `directionsHref`, one for the `tel:` derived from `phone`).
  - The directions link has `target="_blank"` and `rel="noopener noreferrer"`.
  - The phone link does NOT have `target="_blank"` (it's a `tel:` link, not
    an external page).
  - Custom `phoneHref` overrides the derived `tel:` value.

**`clinic-location.a11y.test.tsx`** (vitest-axe):

- Renders via `renderPageWithLayout` (the same shared util the doctor-showcase
  a11y test uses).
- Asserts `await axe(container)` returns zero violations.

The `MapFrame` atom is exempt from a behavior test — its only logic is the
aspect-ratio class lookup, which the stories cover end-to-end.

## Out-of-scope follow-ups

Tracked here so they don't sneak into the implementation:

- Real clinic address + Google Maps embed URL (placeholder for now; user
  swaps in when known).
- Optional second composite for a future `/contact` page if/when one exists.
- Snazzy Maps tinting (would require switching to option A — JS SDK + API
  key — and was explicitly rejected this round).

## Verification

`task check` must pass before declaring done. That covers Biome lint,
`tsc --noEmit` strict, Vitest (behavior + a11y suites), and the Storybook
build. No `--no-verify`. No skipping the a11y test.
