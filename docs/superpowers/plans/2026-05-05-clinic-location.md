# Clinic Location Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone "Visit our clinic" section above the footer on the home page — a Google Maps Embed iframe alongside an address row + phone row, both styled as round-icon-button anchors that match the footer's social-link visual language.

**Architecture:** New `MapFrame` atom (iframe + chrome) and new `ClinicLocation` composite (heading + map + contact panel). Composite contains a private `ContactRow` helper (single anchor wrapping a decorative round-icon span + text) so each row is one click target with proper a11y. Iframe-only — no Google Maps JS SDK, no API key.

**Tech Stack:** React 19, TypeScript strict, Tailwind 4 (theme tokens only), `lucide-react` (`MapPin`, `Phone`), TanStack Router (already in use; not added), Storybook 10, Vitest + RTL + vitest-axe, Biome, i18next (EN + RO).

**Spec:** [docs/superpowers/specs/2026-05-05-clinic-location-design.md](../specs/2026-05-05-clinic-location-design.md)

**Working directory for all commands:** `/Users/cosminneamtiu/Work/premium-smile-webpage/.claude/worktrees/feature+clinic-location` (the worktree on branch `worktree-feature+clinic-location`).

---

### Task 1: `MapFrame` atom

**Files:**
- Create: `apps/frontend/src/shared/components/ui/map-frame/map-frame.tsx`
- Create: `apps/frontend/src/shared/components/ui/map-frame/map-frame.stories.tsx`

Atoms in this repo do not get a `.a11y.test.tsx` (the Storybook a11y addon covers them in isolation, per CLAUDE.md). They also don't get a `.test.tsx` unless they have non-trivial logic. `MapFrame`'s only logic is the aspect-class lookup table — verified end-to-end via the stories. So no Vitest file for this atom.

- [ ] **Step 1: Create the atom file**

Write `apps/frontend/src/shared/components/ui/map-frame/map-frame.tsx`:

```tsx
import { cn } from "@/shared/lib/cn";

type MapFrameAspect = "wide" | "video" | "square";

export type MapFrameProps = {
  /** Google Maps "Embed a map" URL — `https://www.google.com/maps/embed?pb=...`.
   *  Other formats (a `maps.app.goo.gl` short link, a regular maps URL) will not
   *  iframe correctly because Google's embed endpoint is the only one that allows
   *  it. The component does not validate — that's a consumer-site responsibility. */
  embedSrc: string;
  /** Required. Becomes `<iframe title>`, the only label assistive tech sees for
   *  the iframe. Should describe what the map is showing. */
  title: string;
  /** Visual aspect ratio. Default `"wide"` (16:10). */
  aspect?: MapFrameAspect;
  className?: string;
};

const ASPECT_CLASS: Record<MapFrameAspect, string> = {
  wide: "aspect-[16/10]",
  video: "aspect-video",
  square: "aspect-square",
};

/**
 * Iframe-based Google Maps Embed wrapper. Renders a rounded, lavender-tinted
 * frame around the iframe and lazy-loads it. The lavender background under the
 * iframe (`bg-bg-subtle`) keeps the load state on-brand instead of flashing
 * white while Google's tiles arrive.
 *
 * `allow=""` is deliberate — the embed needs none of the standard iframe
 * permissions (no fullscreen, no payment, no microphone), so we explicitly
 * grant nothing.
 */
export function MapFrame({ embedSrc, title, aspect = "wide", className }: MapFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border-subtle bg-bg-subtle shadow-sm",
        ASPECT_CLASS[aspect],
        className,
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
  );
}
```

- [ ] **Step 2: Create the stories file**

Write `apps/frontend/src/shared/components/ui/map-frame/map-frame.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapFrame } from "./map-frame";

// Public Bucharest landmark — Universitatea București — used as a stable
// embed URL for the stories. Swap with the actual clinic URL when known.
const SAMPLE_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.4488!2d26.1003!3d44.4356" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff465e6f76db%3A0x4d8b0a5e0a8a0f8e" +
  "!2sUniversitatea+din+Bucuresti!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2sro";

const meta: Meta<typeof MapFrame> = {
  title: "UI/MapFrame",
  component: MapFrame,
  parameters: { layout: "padded" },
  args: {
    embedSrc: SAMPLE_EMBED,
    title: "Map showing Universitatea București",
  },
};

export default meta;
type Story = StoryObj<typeof MapFrame>;

export const Default: Story = {};

export const VideoAspect: Story = {
  args: { aspect: "video" },
};

export const SquareAspect: Story = {
  args: { aspect: "square" },
};
```

- [ ] **Step 3: Lint + typecheck**

Run from the worktree root:

```bash
task lint && task typecheck
```

Expected: both pass with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/src/shared/components/ui/map-frame/
git commit -m "$(cat <<'EOF'
feat(ui): add MapFrame atom for Google Maps Embed iframes

Wraps an iframe with rounded chrome, lavender load-state background, and
configurable aspect ratio (wide / video / square). Lazy-loaded; no
permissions granted via allow="".

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `ClinicLocation` composite — behavior test + implementation

**Files:**
- Create: `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.tsx`
- Create: `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.test.tsx`

This task is TDD-driven: behavior test first (RED), then minimal implementation that makes it green.

- [ ] **Step 1: Write the failing behavior test**

Write `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.test.tsx`:

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { ClinicLocation } from "./clinic-location";

const baseProps = {
  title: "Visit our clinic",
  embedSrc: "https://www.google.com/maps/embed?pb=fake",
  mapTitle: "Map showing the clinic",
  directionsHref: "https://maps.app.goo.gl/abc123",
  address: "Strada Exemplu nr. 1, București",
  directionsLabel: "Get directions to Strada Exemplu nr. 1, București",
  phone: "+40 700 000 000",
  callLabel: "Call +40 700 000 000",
} as const;

describe("ClinicLocation", () => {
  it("renders the directions row as an external anchor with the given href", () => {
    renderWithProviders(<ClinicLocation {...baseProps} />);

    const directionsLink = screen.getByRole("link", { name: baseProps.directionsLabel });
    expect(directionsLink).toHaveAttribute("href", baseProps.directionsHref);
    expect(directionsLink).toHaveAttribute("target", "_blank");
    expect(directionsLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("derives the phone tel: href from the visible phone string by default", () => {
    renderWithProviders(<ClinicLocation {...baseProps} />);

    const phoneLink = screen.getByRole("link", { name: baseProps.callLabel });
    expect(phoneLink).toHaveAttribute("href", "tel:+40700000000");
    expect(phoneLink).not.toHaveAttribute("target");
  });

  it("respects an explicit phoneHref override", () => {
    renderWithProviders(<ClinicLocation {...baseProps} phoneHref="tel:+40711111111" />);

    const phoneLink = screen.getByRole("link", { name: baseProps.callLabel });
    expect(phoneLink).toHaveAttribute("href", "tel:+40711111111");
  });

  it("renders the map iframe with the given embedSrc and title", () => {
    renderWithProviders(<ClinicLocation {...baseProps} />);

    const iframe = screen.getByTitle(baseProps.mapTitle);
    expect(iframe).toHaveAttribute("src", baseProps.embedSrc);
  });

  it("uses the provided headingId for aria-labelledby on the section", () => {
    const { container } = renderWithProviders(
      <ClinicLocation {...baseProps} headingId="custom-heading-id" />,
    );

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "custom-heading-id");
    expect(container.querySelector("#custom-heading-id")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test — expect it to fail**

```bash
cd apps/frontend && pnpm vitest run src/shared/components/composite/clinic-location/
```

Expected: tests fail with `Failed to resolve import "./clinic-location"` (or similar) because the component file does not exist yet.

- [ ] **Step 3: Implement the composite**

Write `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.tsx`:

```tsx
import { MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { MapFrame } from "@/shared/components/ui/map-frame/map-frame";
import { Container } from "@/shared/components/ui/container/container";
import { cn } from "@/shared/lib/cn";

export type ClinicLocationProps = {
  /** Optional eyebrow above the title (e.g. "Find us"). */
  eyebrow?: string;
  /** Section heading, e.g. "Visit our clinic". */
  title: string;
  /** Google Maps Embed URL — passed to `<MapFrame>`. */
  embedSrc: string;
  /** Map iframe title (a11y) — passed to `<MapFrame>`. */
  mapTitle: string;
  /** Where the address row links to. Opens in a new tab. */
  directionsHref: string;
  /** Visible address text. */
  address: string;
  /** Aria-label for the address row's link, e.g. "Get directions to {address}". */
  directionsLabel: string;
  /** Visible phone (with the formatting the user should see). */
  phone: string;
  /** Aria-label for the phone row's link, e.g. "Call {phone}". */
  callLabel: string;
  /** Optional override; defaults to `tel:` of the digits in `phone`. */
  phoneHref?: string;
  /** id for the section heading — used as `aria-labelledby` on the wrapping section. */
  headingId?: string;
  className?: string;
};

type ContactRowProps = {
  href: string;
  ariaLabel: string;
  icon: ReactNode;
  text: string;
  /** Adds target="_blank" + rel="noopener noreferrer". */
  external?: boolean;
};

/**
 * One row of the contact panel. The whole row is a single anchor — the round
 * icon span is decorative (`aria-hidden`) and animated via `group-hover:`
 * triggers on the parent. We do NOT nest `IconButton` inside this anchor;
 * nesting interactive content inside `<a>` is invalid HTML.
 */
function ContactRow({ href, ariaLabel, icon, text, external }: ContactRowProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group -m-3 flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

/**
 * Standalone home-page section showing the clinic on a Google Maps Embed
 * iframe alongside an address row and a phone row. Each row is a single
 * clickable target — the address row opens directions in a new tab, the
 * phone row dials via `tel:`.
 */
export function ClinicLocation({
  eyebrow,
  title,
  embedSrc,
  mapTitle,
  directionsHref,
  address,
  directionsLabel,
  phone,
  callLabel,
  phoneHref,
  headingId = "clinic-location-heading",
  className,
}: ClinicLocationProps) {
  const derivedPhoneHref = phoneHref ?? `tel:${phone.replace(/\s/g, "")}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-bg-subtle py-12 sm:py-16 lg:py-20", className)}
    >
      <Container width="lg">
        <SectionHeading
          {...(eyebrow ? { eyebrow } : {})}
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
              href={derivedPhoneHref}
              ariaLabel={callLabel}
              icon={<Phone aria-hidden />}
              text={phone}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

Note: `eyebrow` is spread conditionally (`{...(eyebrow ? { eyebrow } : {})}`) instead of `eyebrow={eyebrow}` because the project's `tsconfig.json` has `exactOptionalPropertyTypes: true` (per CLAUDE.md). Passing `undefined` to an optional prop is a type error under that flag.

- [ ] **Step 4: Run the test — expect it to pass**

```bash
cd apps/frontend && pnpm vitest run src/shared/components/composite/clinic-location/
```

Expected: all five tests in `clinic-location.test.tsx` pass.

- [ ] **Step 5: Commit**

```bash
git add apps/frontend/src/shared/components/composite/clinic-location/clinic-location.tsx \
        apps/frontend/src/shared/components/composite/clinic-location/clinic-location.test.tsx
git commit -m "$(cat <<'EOF'
feat(composite): add ClinicLocation composite for the location section

Heading + MapFrame + contact panel with two whole-row anchors (address →
directions, phone → tel:). Each row uses a private ContactRow helper that
wraps a decorative round-icon span (group-hover animated to mirror the
footer's IconButton hover feel) plus the visible text — single click target,
single screen-reader announcement per row.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `ClinicLocation` a11y regression test

**Files:**
- Create: `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.a11y.test.tsx`

CLAUDE.md mandates a `.a11y.test.tsx` for every composite. The composite was built a11y-clean in Task 2, so this test should pass on first run — its purpose is regression protection.

- [ ] **Step 1: Write the a11y test**

Write `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.a11y.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { ClinicLocation } from "./clinic-location";

const baseProps = {
  eyebrow: "Find us",
  title: "Visit our clinic",
  embedSrc: "https://www.google.com/maps/embed?pb=fake",
  mapTitle: "Map showing the clinic",
  directionsHref: "https://maps.app.goo.gl/abc123",
  address: "Strada Exemplu nr. 1, București",
  directionsLabel: "Get directions to Strada Exemplu nr. 1, București",
  phone: "+40 700 000 000",
  callLabel: "Call +40 700 000 000",
} as const;

describe("ClinicLocation — a11y", () => {
  it("has no axe violations with all props provided", async () => {
    const { container } = renderWithProviders(<ClinicLocation {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations without an eyebrow", async () => {
    const { eyebrow: _eyebrow, ...withoutEyebrow } = baseProps;
    const { container } = renderWithProviders(<ClinicLocation {...withoutEyebrow} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the a11y test — expect it to pass**

```bash
cd apps/frontend && pnpm vitest run src/shared/components/composite/clinic-location/clinic-location.a11y.test.tsx
```

Expected: both tests pass.

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/shared/components/composite/clinic-location/clinic-location.a11y.test.tsx
git commit -m "$(cat <<'EOF'
test(composite): add a11y regression test for ClinicLocation

Asserts axe(container) returns zero violations both with and without the
optional eyebrow.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `ClinicLocation` Storybook stories

**Files:**
- Create: `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.stories.tsx`

- [ ] **Step 1: Write the stories file**

Write `apps/frontend/src/shared/components/composite/clinic-location/clinic-location.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClinicLocation } from "./clinic-location";

// Public Bucharest landmark — Universitatea București — used as a stable
// embed URL for the stories. Swap with the actual clinic URL when known.
const SAMPLE_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.4488!2d26.1003!3d44.4356" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff465e6f76db%3A0x4d8b0a5e0a8a0f8e" +
  "!2sUniversitatea+din+Bucuresti!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2sro";

const SAMPLE_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Universitatea+Bucuresti";

const meta: Meta<typeof ClinicLocation> = {
  title: "Composite/ClinicLocation",
  component: ClinicLocation,
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "Find us",
    title: "Visit our clinic",
    embedSrc: SAMPLE_EMBED,
    mapTitle: "Map showing Premium Smile clinic location",
    directionsHref: SAMPLE_DIRECTIONS,
    address: "Strada Ana Ipătescu nr. 11, București",
    directionsLabel: "Get directions to Strada Ana Ipătescu nr. 11, București",
    phone: "+40 700 000 000",
    callLabel: "Call +40 700 000 000",
  },
};

export default meta;
type Story = StoryObj<typeof ClinicLocation>;

export const Default: Story = {};

export const LongAddress: Story = {
  args: {
    address:
      "Bulevardul Iuliu Maniu nr. 546-560, Sector 6, etaj 3, lângă stația de metrou Lujerului, București 061129",
    directionsLabel:
      "Get directions to Bulevardul Iuliu Maniu nr. 546-560, Sector 6, etaj 3, lângă stația de metrou Lujerului, București 061129",
  },
};
```

- [ ] **Step 2: Build Storybook to confirm the stories compile**

```bash
task storybook:build
```

Expected: build completes without errors. (This is the same gate CI runs.)

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/shared/components/composite/clinic-location/clinic-location.stories.tsx
git commit -m "$(cat <<'EOF'
docs(composite): add Storybook stories for ClinicLocation

Default and LongAddress stories under Composite/ClinicLocation, using a
Bucharest landmark embed URL as the placeholder map.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: i18n keys + `HomePage` wiring

**Files:**
- Modify: `apps/frontend/src/i18n/locales/en/common.json` — add `home.location` namespace
- Modify: `apps/frontend/src/i18n/locales/ro/common.json` — same keys, RO values
- Modify: `apps/frontend/src/pages/home/home-page.tsx` — import + render the section

CLAUDE.md requires both locale files to be edited in the same commit, so these three edits are bundled into one task.

- [ ] **Step 1: Add the `home.location` namespace to `en/common.json`**

Locate the `"home"` block in `apps/frontend/src/i18n/locales/en/common.json`. Add a new sibling key `location` (alongside whatever is already there — `hero`, `services`, `reviews`):

```jsonc
"location": {
  "eyebrow": "Find us",
  "title": "Visit our clinic",
  "address": "Strada Ana Ipătescu nr. 11, București",
  "directions_label": "Get directions to {{address}}",
  "call_label": "Call {{phone}}",
  "map_title": "Map showing Premium Smile clinic location"
}
```

- [ ] **Step 2: Add the same keys to `ro/common.json` with RO values**

In `apps/frontend/src/i18n/locales/ro/common.json`, add to the `"home"` block:

```jsonc
"location": {
  "eyebrow": "Ne găsești",
  "title": "Vizitează clinica noastră",
  "address": "Strada Ana Ipătescu nr. 11, București",
  "directions_label": "Vezi direcțiile către {{address}}",
  "call_label": "Sună la {{phone}}",
  "map_title": "Hartă cu locația clinicii Premium Smile"
}
```

- [ ] **Step 3: Wire `ClinicLocation` into `HomePage`**

Edit `apps/frontend/src/pages/home/home-page.tsx`. Add the import next to the other composite imports:

```tsx
import { ClinicLocation } from "@/shared/components/composite/clinic-location/clinic-location";
```

Add the URL constants near the top of the file (alongside `SLIDE_IMAGES` / `REVIEW_KEYS`):

```tsx
// Bucharest landmark placeholder — replace both URLs when the real clinic
// location is confirmed. Update CLINIC_EMBED_SRC by visiting Google Maps,
// pressing Share → Embed a map, and copying the iframe `src`. Update
// CLINIC_DIRECTIONS_HREF to a maps.app.goo.gl share link or a manual
// `https://www.google.com/maps/dir/?api=1&destination=...` URL.
const CLINIC_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.4488!2d26.1003!3d44.4356" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff465e6f76db%3A0x4d8b0a5e0a8a0f8e" +
  "!2sUniversitatea+din+Bucuresti!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2sro";
const CLINIC_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=Universitatea+Bucuresti";
```

Append the section as the last child of `HomePage`'s returned fragment (after the existing `</section>` that wraps `<ReviewsCarousel>`, before the closing `</>`):

```tsx
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

The `Footer` is rendered by `__root.tsx`, not by `HomePage`, so this section automatically lands directly above the footer.

- [ ] **Step 4: Run the home-page a11y regression test**

The home-page test renders the entire `<HomePage />` through axe — it will catch any a11y issue introduced by the new section.

```bash
cd apps/frontend && pnpm vitest run src/pages/home/home-page.a11y.test.tsx
```

Expected: passes (the new section is a11y-clean by construction).

- [ ] **Step 5: Commit**

```bash
git add apps/frontend/src/i18n/locales/en/common.json \
        apps/frontend/src/i18n/locales/ro/common.json \
        apps/frontend/src/pages/home/home-page.tsx
git commit -m "$(cat <<'EOF'
feat(home): mount ClinicLocation as the section above the footer

Adds the home.location.* i18n keys (EN + RO) and renders ClinicLocation
at the end of HomePage with a Bucharest landmark embed URL as a
swap-in-later placeholder. Phone reuses footer.phone (single source of
truth for the clinic number).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Final `task check`

**Files:** none (verification task).

- [ ] **Step 1: Run the full check pipeline**

```bash
task check
```

Expected: lint + typecheck + Vitest (full suite — behavior + a11y) + Storybook build all pass with no errors. The Vitest run should include the three new files (`clinic-location.test.tsx`, `clinic-location.a11y.test.tsx`, and re-runs of `home-page.a11y.test.tsx`).

- [ ] **Step 2: If anything fails, fix the root cause and re-run**

Common failure modes and fixes:

- **Biome lint error on `<iframe>` `allow=""`**: if Biome's `noUselessAttribute` rule flags the empty string, change to `allow=" "` (single space) or remove the attribute entirely. Re-run lint.
- **`exactOptionalPropertyTypes` error around `eyebrow`**: ensure the spread pattern `{...(eyebrow ? { eyebrow } : {})}` is preserved instead of `eyebrow={eyebrow}`.
- **i18n test failure** (`missing key 'home.location.X'`): confirm both `en/common.json` and `ro/common.json` have the new `location` block under `home` and the JSON parses (no trailing commas).
- **a11y violation** (`landmark-unique` or `region`): confirm `aria-labelledby` on the `<section>` matches the `id` on the heading — both default to `"clinic-location-heading"`.
- **Storybook build failure on the embed URL string**: the URL is split across two string literals with `+`; ensure no stray comma between them.

Re-run `task check` after each fix until clean.

- [ ] **Step 3: Verify the work with the dev server (manual)**

CLAUDE.md requires that UI changes be tested in a browser. Run the dev server and confirm the new section renders directly above the footer with the map, address row, and phone row — and that hovering each row animates the round button + accent-tints the text.

```bash
task dev
```

Open http://localhost:5173/en. Scroll to the bottom of the home page. Confirm:
- The "Visit our clinic" section is visible directly above the footer.
- The map iframe renders Universitatea București (the placeholder).
- The address row's MapPin button + the phone row's Phone button animate on hover (scale up, fill with lavender accent).
- Tab through the page with the keyboard — both rows should receive a visible focus ring.
- Click the address row → Google Maps directions opens in a new tab.
- Click the phone row → the OS's `tel:` handler fires.
- Switch language to RO (`/ro`) and confirm the eyebrow, title, directions label, and call label all read in Romanian.

Stop the dev server with Ctrl-C.

- [ ] **Step 4: Push the branch (do NOT merge)**

```bash
git push -u origin worktree-feature+clinic-location
```

Per CLAUDE.md "Merge Authorization" — pushing the branch and opening a PR are fine, but clicking merge needs explicit user authorization for that specific PR. Stop here and let the user inspect the PR before merging.

---

## Out-of-scope (do NOT include in this implementation)

These are explicitly listed in the spec's "Non-goals" and "Out-of-scope follow-ups" sections. Do not add them under any pretext:

- Google Maps JS SDK / `@vis.gl/react-google-maps` / API key setup.
- Snazzy Maps tile-tinting.
- Reverse geocoding or address → URL derivation.
- Real clinic embed URL or address (placeholder is intentional).
- A `/contact` route or page composite.
- Analytics on click-through.
