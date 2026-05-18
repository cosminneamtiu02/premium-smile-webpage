# HelpingStaffCard + HelpingStaffGrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `HelpingStaffCard` (vertical-stack tile: portrait + role + name) and a `HelpingStaffGrid` wrapper that arranges them three-per-row under a section heading, mirroring the existing `DoctorCard` / `DoctorShowcase` pair structurally.

**Architecture:** Two pure-presentation composites in `apps/frontend/src/shared/components/composite/helping-staff-grid/`. The grid renders a `<section>` + `<SectionHeading>` + `<ul role="list">` with one `<li>` per `HelpingStaffCard`. The card renders an `<article>` with a square portrait, then a `<SectionHeading>` (eyebrow = roles joined " · ", title = name) at semantic level 3. Zero local state, zero effects, zero refs.

**Tech Stack:** React 19, TypeScript strict, Tailwind 4, Storybook 10, Vitest + React Testing Library + vitest-axe. Existing repo primitives reused: `SectionHeading` composite, `Container` atom, `cn` helper, theme tokens (`bg-bg-subtle`, `border-border-subtle`, `shadow-soft-sm`, `shadow-soft-md`).

**Reference spec:** [docs/superpowers/specs/2026-05-05-helping-staff-card-design.md](../specs/2026-05-05-helping-staff-card-design.md)

**Reference implementation to mirror:** [apps/frontend/src/shared/components/composite/doctor-showcase/doctor-card/](../../apps/frontend/src/shared/components/composite/doctor-showcase/doctor-card/)

---

## File structure

All paths under `apps/frontend/src/shared/components/composite/helping-staff-grid/`:

| File | Responsibility |
|---|---|
| `helping-staff-card/helping-staff-card.tsx` | The `StaffMember` type + `HelpingStaffCard` component. Single export of each. |
| `helping-staff-card/helping-staff-card.stories.tsx` | Storybook stories: `Default`. |
| `helping-staff-card/helping-staff-card.a11y.test.tsx` | vitest-axe regression: card with photo asserts zero violations. |
| `helping-staff-grid.tsx` | The `HelpingStaffGrid` component. Imports `HelpingStaffCard` and `StaffMember` from the nested folder. |
| `helping-staff-grid.stories.tsx` | Storybook stories: `ThreeStaff`, `SixStaff`, `OneStaff`. |
| `helping-staff-grid.a11y.test.tsx` | vitest-axe regression: grid with 3 staff members asserts zero violations. |

**Branch strategy:** Per the user's "stay on current branch" preference and the choice to bundle the spec with the implementation PR (option C from brainstorming), Task 1 will create a feature branch `feat/helping-staff-card` from `main`. The spec doc lands in Task 1's first commit alongside the card; the grid lands in Task 2; final verification + PR in Task 3.

---

## Task 1: HelpingStaffCard (component + a11y test + story + bundled spec commit)

**Why bundled:** CLAUDE.md forbids landing a composite without (a) a story and (b) an a11y test. So the component, its story, and its a11y test must all land in one commit to keep `main` always-compliant. The spec doc rides along in this same commit per the user's choice to bundle the spec with the implementation.

**Files:**
- Create: `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.tsx`
- Create: `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.a11y.test.tsx`
- Create: `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.stories.tsx`
- (Already on disk, uncommitted) `docs/superpowers/specs/2026-05-05-helping-staff-card-design.md`

- [ ] **Step 1: Create the feature branch.**

```bash
git checkout -b feat/helping-staff-card
```

Expected: `Switched to a new branch 'feat/helping-staff-card'`.

- [ ] **Step 2: Write the card component.**

Create `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.tsx`:

```tsx
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { cn } from "@/shared/lib/cn";

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

type HelpingStaffCardProps = {
  staff: StaffMember;
  className?: string;
};

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

- [ ] **Step 3: Write the card a11y test.**

Create `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.a11y.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { HelpingStaffCard, type StaffMember } from "./helping-staff-card";

const STAFF: StaffMember = {
  id: "ana-georgescu",
  name: "Ana Georgescu",
  roles: ["Dental Assistant", "Patient Coordinator"],
  photo: {
    src: "https://example.com/ana.jpg",
    alt: "Portrait of Ana Georgescu",
  },
};

describe("HelpingStaffCard — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<HelpingStaffCard staff={STAFF} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 4: Write the card Storybook story.**

Create `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelpingStaffCard, type StaffMember } from "./helping-staff-card";

const ANA: StaffMember = {
  id: "ana-georgescu",
  name: "Ana Georgescu",
  roles: ["Dental Assistant", "Patient Coordinator"],
  photo: {
    src: "https://api.dicebear.com/7.x/initials/svg?seed=AG&backgroundColor=8377a3&textColor=ffffff",
    alt: "Portrait of Ana Georgescu",
  },
};

const meta: Meta<typeof HelpingStaffCard> = {
  title: "Composite/HelpingStaffGrid/HelpingStaffCard",
  component: HelpingStaffCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof HelpingStaffCard>;

export const Default: Story = {
  args: { staff: ANA },
};
```

- [ ] **Step 5: Run the new a11y test in isolation to verify it passes.**

```bash
cd apps/frontend && pnpm vitest run src/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card.a11y.test.tsx
```

Expected: `1 passed`. If axe reports any violation, fix the markup (most likely cause: missing `alt`, missing `aria-labelledby`, or a bad heading-id collision) before continuing.

- [ ] **Step 6: Run typecheck to catch any TS strict-mode errors.**

```bash
cd apps/frontend && pnpm tsc --noEmit
```

Expected: no output (success). Common failures: `exactOptionalPropertyTypes` complaining about `className` being passed as `undefined` — guard with the `{...(className ? { className } : {})}` pattern if needed (it shouldn't be, since the prop is optional and we just spread it through `cn`).

- [ ] **Step 7: Run Biome lint+format on the new files.**

```bash
cd apps/frontend && pnpm biome check --write src/shared/components/composite/helping-staff-grid/
```

Expected: `Checked N files. No fixes applied.` (or auto-applied formatting fixes — those are fine).

- [ ] **Step 8: Commit the card + spec doc.**

```bash
git add apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-card/ \
        docs/superpowers/specs/2026-05-05-helping-staff-card-design.md
git commit -m "$(cat <<'EOF'
feat(helping-staff): add HelpingStaffCard composite + design spec

Stripped-down team-tile card derived from DoctorCard, keeping only the
portrait, role line, and name. Vertical stack at every breakpoint, sized
for a 3-per-row grid. Photo and roles are required (narrower type than
Doctor); no bio, no CTA, no alternating image side.

Includes the design spec under docs/superpowers/specs/.
EOF
)"
```

Expected: commit succeeds. If a pre-commit hook fails, fix the underlying issue and re-commit (do NOT use `--no-verify`).

---

## Task 2: HelpingStaffGrid (component + a11y test + stories)

**Files:**
- Create: `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.tsx`
- Create: `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.a11y.test.tsx`
- Create: `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.stories.tsx`

- [ ] **Step 1: Write the grid component.**

Create `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.tsx`:

```tsx
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { cn } from "@/shared/lib/cn";
import { HelpingStaffCard, type StaffMember } from "./helping-staff-card/helping-staff-card";

type HelpingStaffGridProps = {
  /** The data for every card. */
  staff: ReadonlyArray<StaffMember>;
  /** Section eyebrow above the heading. */
  sectionEyebrow?: string;
  /** Section heading (rendered as h2). */
  sectionTitle: string;
  /** id for the section heading — used for `aria-labelledby` on the section. */
  headingId?: string;
  className?: string;
};

/**
 * Section that displays the clinic's helping staff (assistants, hygienists,
 * receptionists, office manager) in a responsive grid: 1 col on mobile, 2 on
 * sm, 3 on lg. Each cell is a `<HelpingStaffCard>`. Padding and container
 * width match `DoctorShowcase` so the two sections rhythmically align on a
 * shared page.
 *
 * `<ul role="list">` semantics make the roster announce as "list, N items"
 * to screen readers; the explicit `role="list"` defends against Safari's
 * reset of list semantics when `list-style: none` is in effect.
 */
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
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
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

- [ ] **Step 2: Write the grid a11y test.**

Create `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.a11y.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import type { StaffMember } from "./helping-staff-card/helping-staff-card";
import { HelpingStaffGrid } from "./helping-staff-grid";

const STAFF: ReadonlyArray<StaffMember> = [
  {
    id: "ana-georgescu",
    name: "Ana Georgescu",
    roles: ["Dental Assistant"],
    photo: { src: "https://example.com/ana.jpg", alt: "Portrait of Ana Georgescu" },
  },
  {
    id: "mihai-ionescu",
    name: "Mihai Ionescu",
    roles: ["Dental Hygienist"],
    photo: { src: "https://example.com/mihai.jpg", alt: "Portrait of Mihai Ionescu" },
  },
  {
    id: "raluca-pop",
    name: "Raluca Pop",
    roles: ["Office Manager"],
    photo: { src: "https://example.com/raluca.jpg", alt: "Portrait of Raluca Pop" },
  },
];

describe("HelpingStaffGrid — a11y", () => {
  it("has no axe violations with three staff members", async () => {
    const { container } = renderWithProviders(
      <HelpingStaffGrid staff={STAFF} sectionTitle="Our helping staff" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with an eyebrow", async () => {
    const { container } = renderWithProviders(
      <HelpingStaffGrid
        staff={STAFF}
        sectionEyebrow="Behind every appointment"
        sectionTitle="Our helping staff"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 3: Write the grid Storybook stories.**

Create `apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { StaffMember } from "./helping-staff-card/helping-staff-card";
import { HelpingStaffGrid } from "./helping-staff-grid";

const portrait = (seed: string): { src: string; alt: string } => ({
  src: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=8377a3&textColor=ffffff`,
  alt: `Portrait placeholder ${seed}`,
});

const ANA: StaffMember = {
  id: "ana-georgescu",
  name: "Ana Georgescu",
  roles: ["Dental Assistant", "Patient Coordinator"],
  photo: portrait("AG"),
};
const MIHAI: StaffMember = {
  id: "mihai-ionescu",
  name: "Mihai Ionescu",
  roles: ["Dental Hygienist"],
  photo: portrait("MI"),
};
const RALUCA: StaffMember = {
  id: "raluca-pop",
  name: "Raluca Pop",
  roles: ["Office Manager"],
  photo: portrait("RP"),
};
const IOANA: StaffMember = {
  id: "ioana-stan",
  name: "Ioana Stan",
  roles: ["Receptionist"],
  photo: portrait("IS"),
};
const VLAD: StaffMember = {
  id: "vlad-marinescu",
  name: "Vlad Marinescu",
  roles: ["Sterilization Tech"],
  photo: portrait("VM"),
};
const SOFIA: StaffMember = {
  id: "sofia-radu",
  name: "Sofia Radu",
  roles: ["Patient Coordinator"],
  photo: portrait("SR"),
};

const meta: Meta<typeof HelpingStaffGrid> = {
  title: "Composite/HelpingStaffGrid",
  component: HelpingStaffGrid,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HelpingStaffGrid>;

export const ThreeStaff: Story = {
  args: {
    staff: [ANA, MIHAI, RALUCA],
    sectionEyebrow: "Behind every appointment",
    sectionTitle: "Our helping staff",
  },
};

export const SixStaff: Story = {
  args: {
    staff: [ANA, MIHAI, RALUCA, IOANA, VLAD, SOFIA],
    sectionTitle: "Our helping staff",
  },
};

export const OneStaff: Story = {
  args: {
    staff: [ANA],
    sectionTitle: "Our helping staff",
  },
};
```

- [ ] **Step 4: Run the new grid a11y test in isolation.**

```bash
cd apps/frontend && pnpm vitest run src/shared/components/composite/helping-staff-grid/helping-staff-grid.a11y.test.tsx
```

Expected: `2 passed`. Same triage rule as Task 1: any violation usually means a missing label or a heading-level jump.

- [ ] **Step 5: Run typecheck.**

```bash
cd apps/frontend && pnpm tsc --noEmit
```

Expected: no output. If `exactOptionalPropertyTypes` complains about the `sectionEyebrow` spread, double-check that the conditional spread pattern `{...(sectionEyebrow ? { eyebrow: sectionEyebrow } : {})}` is in place — that's the same pattern `DoctorShowcase` uses for the same prop.

- [ ] **Step 6: Run Biome lint+format on the new files.**

```bash
cd apps/frontend && pnpm biome check --write src/shared/components/composite/helping-staff-grid/
```

Expected: clean (or auto-applied formatting fixes).

- [ ] **Step 7: Commit the grid.**

```bash
git add apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.tsx \
        apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.a11y.test.tsx \
        apps/frontend/src/shared/components/composite/helping-staff-grid/helping-staff-grid.stories.tsx
git commit -m "$(cat <<'EOF'
feat(helping-staff): add HelpingStaffGrid wrapper composite

Renders a responsive 1/2/3-col grid of HelpingStaffCard tiles under a
section heading, matching DoctorShowcase's section padding and container
width so the two sections align rhythmically on a shared page. Uses
<ul role="list"> semantics so the roster announces as a list to screen
readers.

No measurement plumbing — there is no decorative connecting line.
EOF
)"
```

Expected: commit succeeds.

---

## Task 3: Final verification + open PR

**Files:** none modified — verification + branch publish only.

- [ ] **Step 1: Run the full check suite.**

```bash
task check
```

Expected: all four sub-tasks pass — `lint`, `typecheck`, `test` (entire Vitest suite, not just the two new files), `storybook:build`. If anything fails, do NOT use `--no-verify`; fix the root cause and re-run.

The Storybook build is the load-bearing check here — it's the only thing that catches a malformed story file (e.g., wrong `Meta` typing) ahead of merge.

- [ ] **Step 2: Push the branch.**

```bash
git push -u origin feat/helping-staff-card
```

Expected: branch pushed, GitHub returns the compare URL.

- [ ] **Step 3: Open the PR using `gh`.**

```bash
gh pr create --title "feat(helping-staff): HelpingStaffCard + HelpingStaffGrid composites" --body "$(cat <<'EOF'
## Summary
- Adds `HelpingStaffCard`: vertical-stack tile (portrait + role + name), derived from `DoctorCard` but stripped of bio + CTA. Photo and roles are required (narrower type than `Doctor`).
- Adds `HelpingStaffGrid`: responsive 1/2/3-col `<ul>` of cards under a section heading. Padding + container width match `DoctorShowcase` so the two sections rhythmically align on a shared page. No measurement plumbing — no decorative connecting line.
- Includes the design spec under `docs/superpowers/specs/2026-05-05-helping-staff-card-design.md`.

## Test plan
- [ ] `task check` passes locally (Biome lint, `tsc --noEmit`, Vitest, Storybook build).
- [ ] `pnpm storybook` — visually verify `Composite/HelpingStaffGrid/HelpingStaffCard › Default` and `Composite/HelpingStaffGrid › ThreeStaff / SixStaff / OneStaff` across `light`, `dark`, `brand` themes via the Storybook theme toggle.
- [ ] Storybook addon-a11y panel reports zero violations on every new story.
- [ ] Resize the Storybook viewport to confirm the grid breakpoints (1 col mobile, 2 cols sm, 3 cols lg).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed. **Do NOT merge** — per CLAUDE.md, the user authorizes each merge individually. Hand the PR URL back and await their decision.

- [ ] **Step 4: Report the PR URL to the user and wait.**

Output the PR URL and stop. Do not click merge, do not call `gh pr merge`, do not enable auto-merge.

---

## Self-review checklist

- **Spec coverage:** Every section in the spec maps to a task. Card → Task 1. Grid → Task 2. Theme tokens → both tasks (via existing utility classes). Testing → both tasks ship `*.a11y.test.tsx`. Storybook stories → both tasks ship `.stories.tsx`. i18n → no work in this PR (zero new keys, per spec). Final verification → Task 3 runs `task check`.
- **Placeholder scan:** No `TBD` / `TODO` / `add appropriate handling`. Every code block is the actual file content the engineer writes.
- **Type consistency:** `StaffMember` is defined in Task 1 and imported by name (`import { ... type StaffMember }`) in Task 2's grid component, a11y test, and stories. `HelpingStaffCardProps` lives only in the card module (not exported). `HelpingStaffGridProps` lives only in the grid module (not exported). Heading id pattern `helping-staff-${id}-name` is used consistently by the card. Default `headingId` for the grid is `helping-staff-grid-heading` (does not collide with the card's id pattern because the card pattern always includes a staff id).
- **Branch + commit hygiene:** Feature branch created in Task 1 step 1. Two implementation commits (one per composite) plus the spec rides with commit 1. Final verification + PR in Task 3. No commits land on `main` directly. The user's "stay on current branch" preference is honored for unrelated future work — the branch only exists for the duration of this feature.
