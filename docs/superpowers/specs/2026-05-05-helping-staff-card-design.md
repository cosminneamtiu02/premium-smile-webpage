# HelpingStaffCard + HelpingStaffGrid — design

_Date: 2026-05-05. Status: draft for review._

## Goal

Add a stripped-down "team tile" card for the clinic's non-doctor staff
(assistants, hygienists, receptionists, office manager, etc.) and a thin
grid wrapper that arranges them three-per-row under a section heading.

The card is derived from the existing
[`DoctorCard`](../../apps/frontend/src/shared/components/composite/doctor-showcase/doctor-card/doctor-card.tsx)
but keeps only what the user asked for: **portrait photo, role line, name**.
The bio paragraph and the "Book Consultation" CTA are dropped.

## Non-goals

- No CTA per card. The user explicitly removed "Book Consultation."
- No bio / description text. Removed per the user's spec.
- No alternating `imageSide` (left/right). The card is a vertical stack at
  every breakpoint; horizontal split has nothing to fill without a bio.
- No connecting decorative line between cards (no `ShowcaseLine` analogue).
  The grid reads as a calm roster, not a scroll-driven narrative.
- No measurement plumbing (no refs, `useLayoutEffect`, or `ResizeObserver`).
- No `mode="grid"` prop on `DoctorShowcase` reusing the doctor card. The
  type and prop polarities differ enough that two narrower components are
  cleaner than one component with conditional sections.
- No page wiring in this PR. The composites ship; a follow-up wires them
  into a real page with translated copy.
- No new theme tokens or CSS.

## File layout

Mirrors the existing `composite/doctor-showcase/doctor-card/` shape so the two
families sit as siblings in the composite tier:

```
apps/frontend/src/shared/components/composite/helping-staff-grid/
├── helping-staff-grid.tsx
├── helping-staff-grid.stories.tsx
├── helping-staff-grid.a11y.test.tsx
└── helping-staff-card/
    ├── helping-staff-card.tsx
    ├── helping-staff-card.stories.tsx
    └── helping-staff-card.a11y.test.tsx
```

Storybook titles:

- `Composite/HelpingStaffGrid`
- `Composite/HelpingStaffGrid/HelpingStaffCard`

Co-locating the card inside the grid's folder mirrors the existing
`doctor-showcase/doctor-card/` convention and signals that the card is the
grid's primitive, not meant for solo use elsewhere.

## Public API

### `StaffMember` type

Narrower than `Doctor`: both `roles` and `photo` are required, and there is
no `bio` field at all.

```ts
export type StaffMember = {
  /** Stable identifier — used for keys and aria associations. */
  id: string;
  /** Full display name, e.g. "Dr. Elena Marin". */
  name: string;
  /** Role fragments joined visually with " · ", e.g. ["Founder", "Cosmetic Dentistry"]. */
  roles: ReadonlyArray<string>;
  /** Portrait. Required — the card design hinges on it. */
  photo: { src: string; alt: string };
};
```

### `HelpingStaffCard` props

```ts
type HelpingStaffCardProps = {
  staff: StaffMember;
  className?: string;
};
```

No `imageSide`, no `ctaLabel`, no `onCta`, no `ref` — none of the doctor
card's variability has a reason to exist here.

### `HelpingStaffGrid` props

```ts
type HelpingStaffGridProps = {
  staff: ReadonlyArray<StaffMember>;
  /** Section eyebrow above the heading. */
  sectionEyebrow?: string;
  /** Section heading (rendered as h2). */
  sectionTitle: string;
  /** id for the section heading — used for `aria-labelledby` on the section. */
  headingId?: string;
  className?: string;
};
```

Same prop shape as `DoctorShowcaseProps` minus the per-card CTA bits, so
page-level call sites stay symmetrical with the doctor section.

## Card layout & styling

Vertical stack: photo on top, role + name below, all centered. Theme tokens
match those used by `DoctorCard` so all three themes (`light`, `dark`,
`brand`) work without extra wiring.

```tsx
const ROLE_SEPARATOR = " · ";

export function HelpingStaffCard({ staff, className }: HelpingStaffCardProps) {
  const headingId = `helping-staff-${staff.id}-name`;
  const eyebrowText = staff.roles.join(ROLE_SEPARATOR);

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl bg-bg-subtle p-6 text-center shadow-soft-sm",
        className,
      )}
    >
      <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-xl border border-border-subtle bg-bg-subtle shadow-soft-md">
        <img
          src={staff.photo.src}
          alt={staff.photo.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <SectionHeading
        eyebrow={eyebrowText}
        title={staff.name}
        level={3}
        align="center"
        id={headingId}
      />
    </article>
  );
}
```

Notes:

- Photo container caps at `200px` (vs. `240px` on the doctor card) — sized
  for a 3-col grid on a `Container width="lg"`.
- `level={3}` (no `visualLevel` override) so these tiles are subordinate to
  the grid's `<h2>` and visually quieter than the doctor cards.
- The card has **zero literal strings** in JSX — every visible word comes
  from `staff` props, satisfying the "no raw strings in JSX" rule trivially.
- `loading="lazy"` and `decoding="async"` on the image, matching the doctor
  card's image-loading attributes.

## Grid layout

```tsx
export function HelpingStaffGrid({
  staff,
  sectionEyebrow,
  sectionTitle,
  headingId = "helping-staff-grid-heading",
  className,
}: HelpingStaffGridProps) {
  return (
    <section
      data-helping-staff-grid
      aria-labelledby={headingId}
      className={cn("py-16 sm:py-20 lg:py-24", className)}
    >
      <Container width="lg">
        <SectionHeading
          {...(sectionEyebrow ? { eyebrow: sectionEyebrow } : {})}
          title={sectionTitle}
          id={headingId}
          className="mb-12 sm:mb-16"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {staff.map((person) => (
            <li key={person.id}>
              <HelpingStaffCard staff={person} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

Notes:

- Three breakpoints: 1 col mobile, 2 cols `sm` (≥640px), 3 cols `lg` (≥1024px).
- `<ul>` / `<li>` semantics so screen readers announce "list, N items" — a
  real benefit over `<div>`s for a roster of people. No explicit `role="list"`
  — Biome's `noRedundantRoles` rule treats it as noise on a `<ul>`, and modern
  Safari (17+) preserves list semantics under `list-style: none`.
- Section padding (`py-16 sm:py-20 lg:py-24`) and container width (`width="lg"`)
  copy `DoctorShowcase` so the two sections rhythmically align on the same
  page.
- No measurement plumbing — there is no decorative line to position.

## Theming

Tokens used (all already exist and are theme-aware):

- `bg-bg-subtle` — card and photo wrapper background.
- `border-border-subtle` — photo wrapper border.
- `shadow-soft-sm` — card shell lift.
- `shadow-soft-md` — photo wrapper lift.

No new tokens, no `index.css` changes.

## Testing

Two `*.a11y.test.tsx` files (one per composite), following the existing
`doctor-card.a11y.test.tsx` pattern verbatim — `renderWithProviders` from
`@/test-utils` plus `axe(container)` plus `toHaveNoViolations`.

- `helping-staff-card.a11y.test.tsx` — single rendered card asserts zero
  violations.
- `helping-staff-grid.a11y.test.tsx` — grid with 3 staff members asserts
  zero violations.

No behavior tests (`*.test.tsx`) — both components are pure presentation
with no logic. CLAUDE.md: "Pure visual / layout work — Storybook stories
are the verification."

## Storybook stories

Sample data uses the same DiceBear initials avatars the doctor stories use,
so neither story file needs a real image asset.

- **Card** (`Composite/HelpingStaffGrid/HelpingStaffCard`):
  - `Default` — single card with sample data.
- **Grid** (`Composite/HelpingStaffGrid`):
  - `ThreeStaff` — one full row.
  - `SixStaff` — two full rows showing wrap behavior.
  - `OneStaff` — sparse-row case showing the left-aligned solo card (the
    `<ul>` grid leaves the slot empty rather than centering, which is the
    correct behavior for a list).

## i18n

Zero new translation keys in this PR. Both components take their copy as
props; the page that wires them up will add keys like
`helpingStaff.sectionTitle` to both `en/common.json` and `ro/common.json`
in the same commit.

## Out of scope (recap)

See the Non-goals section above. The bullet that most often gets re-litigated:
helping-staff cards do **not** sit inside `DoctorShowcase` and do **not**
share its decorative connecting line.

## Verification

`task check` must pass: Biome lint + format, `tsc --noEmit` with strict +
`noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`, the full Vitest
suite (existing tests plus the two new `*.a11y.test.tsx` files), and the
Storybook build. No `--no-verify` under any circumstance.
