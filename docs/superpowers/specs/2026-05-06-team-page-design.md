# Team page — design

_Date: 2026-05-06. Status: draft for review._

## Goal

Add a public `/{lang}/team` page that introduces the Premium Smile team in
three stacked sections: an eyebrow + page title (intro), a short paragraph
generically inflating the doctors' commitment without naming specialties,
the existing `DoctorShowcase` listing the doctors, and the new
`HelpingStaffGrid` listing the assistants/hygienists/office staff.

The page reuses every visual primitive that already exists. The only new
code is the page composition itself, the route file, the page tests +
story, and translation keys for both English and Romanian.

## Non-goals

- No CMS. Doctor and staff data is hand-curated in translation files.
- No dynamic API loads. The page renders synchronously from translations.
- No specialty names in the dedication paragraph — explicit per the user's
  instruction. Talk about commitment, attention, personalization. Avoid
  "veneers", "implants", "orthodontics", etc.
- No CTA on the team page. The site already has a global "Book now" in the
  top-bar; the team page itself doesn't need its own conversion section.
- No filtering, sorting, or search UI for staff or doctors.
- No image lightbox or photo zoom.
- No `beforeLoad` route guards — the page is public.

## File layout

```
apps/frontend/src/pages/team/
├── team-page.tsx            -- the page composition (TeamPage component)
├── team-page.stories.tsx    -- Storybook title "Pages/TeamPage"
└── team-page.a11y.test.tsx  -- vitest-axe regression via renderPageWithLayout

apps/frontend/src/routes/$lang/team.tsx   -- one-line createFileRoute re-export

apps/frontend/src/i18n/locales/en/common.json   -- edit: add team.* keys
apps/frontend/src/i18n/locales/ro/common.json   -- edit: add team.* keys
```

Top-bar nav also gets a "Team" link wired in the same PR so the page is
reachable without typing the URL.

## Page structure

Top-to-bottom, four sections inside the page component:

1. **Intro section** — `<section>` wrapping a `<Container width="lg">` that
   holds:
   - `<SectionHeading eyebrow={t("team.intro.eyebrow")} title={t("team.intro.title")} level={1} align="center" />` — `level={1}` because this is the page H1.
   - A `<Text variant="lead" className="mx-auto mt-8 max-w-3xl text-center text-fg-muted">` containing the dedication paragraph from `t("team.intro.dedication")`.
   - Section padding: `py-16 sm:py-20 lg:py-24` (matches the existing
     section rhythm used by `DoctorShowcase` and `HelpingStaffGrid`).

2. **`<DoctorShowcase>`** — existing composite. Props:
   - `doctors`: a `Doctor[]` built from translation keys (see "Data
     wiring" below).
   - `sectionTitle={t("team.doctors.title")}`.
   - No `ctaLabel` (no "Book Consultation" CTA on this page).

3. **`<HelpingStaffGrid>`** — existing composite. Props:
   - `staff`: a `StaffMember[]` built from translation keys.
   - `sectionTitle={t("team.helpingStaff.title")}`.

The page is wrapped by the existing layout shell (TopBar + main + Footer +
FloatingBookCta), provided by the route layout — the page itself just
returns the four sections in a fragment.

## Page component sketch

```tsx
import { useTranslation } from "react-i18next";
import { type Doctor, DoctorShowcase } from "@/shared/components/composite/doctor-showcase/doctor-showcase";
import { HelpingStaffGrid } from "@/shared/components/composite/helping-staff-grid/helping-staff-grid";
import type { StaffMember } from "@/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { Text } from "@/shared/components/ui/text/text";

const DOCTOR_PORTRAIT = (seed: string) => ({
  src: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=8377a3&textColor=ffffff`,
  alt: `Portrait placeholder ${seed}`,
});

const DOCTOR_IDS = ["elena", "andrei", "mihai"] as const;
const STAFF_IDS = ["ana", "raluca", "ioana"] as const;

export function TeamPage() {
  const { t } = useTranslation();

  const doctors: Doctor[] = DOCTOR_IDS.map((id) => ({
    id,
    name: t(`team.doctors.${id}.name`),
    roles: t(`team.doctors.${id}.roles`, { returnObjects: true }) as string[],
    photo: DOCTOR_PORTRAIT(t(`team.doctors.${id}.initials`)),
    bio: t(`team.doctors.${id}.bio`),
  }));

  const staff: StaffMember[] = STAFF_IDS.map((id) => ({
    id,
    name: t(`team.helpingStaff.${id}.name`),
    roles: t(`team.helpingStaff.${id}.roles`, { returnObjects: true }) as string[],
    photo: DOCTOR_PORTRAIT(t(`team.helpingStaff.${id}.initials`)),
  }));

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <Container width="lg">
          <SectionHeading
            eyebrow={t("team.intro.eyebrow")}
            title={t("team.intro.title")}
            level={1}
            align="center"
          />
          <Text
            variant="lead"
            className="mx-auto mt-8 max-w-3xl text-center text-fg-muted"
          >
            {t("team.intro.dedication")}
          </Text>
        </Container>
      </section>

      <DoctorShowcase
        doctors={doctors}
        sectionTitle={t("team.doctors.title")}
      />

      <HelpingStaffGrid
        staff={staff}
        sectionTitle={t("team.helpingStaff.title")}
      />
    </>
  );
}
```

Notes:
- The `roles` field is an array, so the translations store it as a JSON
  array and the page reads it via `t(key, { returnObjects: true })`. The
  existing `i18next` config supports this.
- The `id`s used in the translations match the array element keys, keeping
  the page → translations mapping mechanical.
- `DOCTOR_PORTRAIT` is shared between doctors and staff because the
  DiceBear initials API is the same for both. When real photos arrive,
  the page changes one helper.

## Route file

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/pages/team/team-page";

export const Route = createFileRoute("/$lang/team")({
  component: TeamPage,
});
```

Path: `apps/frontend/src/routes/$lang/team.tsx`. URL: `/en/team`, `/ro/team`.

## Top-bar nav linking

The nav is wired in `apps/frontend/src/routes/__root.tsx`, not inside the
`TopBar` composite. Two minimal edits there:

1. Add `"team"` to the `NAV_KEYS` tuple.
2. Add a `case "team":` to `pathFor(...)` returning `/${lang}/team`.

The visible label uses `t("nav.team")` — matching the existing
`nav.home` / `nav.pricing` / `nav.blog` pattern in `common.json`. The
existing `activeKey` derivation (`NAV_KEYS.find((key) => pathname === pathFor(key, lang))`)
automatically lights up the team link when the user is on `/en/team`.

## Translation keys

All new keys land in BOTH `en/common.json` and `ro/common.json` in the
SAME commit (per CLAUDE.md i18n rule).

```jsonc
{
  "team": {
    "intro": {
      "eyebrow": "...",
      "title": "...",
      "dedication": "..."
    },
    "doctors": {
      "title": "...",
      "elena":  { "name": "...", "initials": "EM", "roles": ["...", "..."], "bio": "..." },
      "andrei": { "name": "...", "initials": "AP", "roles": ["..."],         "bio": "..." },
      "mihai":  { "name": "...", "initials": "MI", "roles": ["..."],         "bio": "..." }
    },
    "helpingStaff": {
      "title": "...",
      "ana":    { "name": "...", "initials": "AG", "roles": ["...", "..."] },
      "raluca": { "name": "...", "initials": "RP", "roles": ["..."]      },
      "ioana":  { "name": "...", "initials": "IS", "roles": ["..."]      }
    }
  },
  "nav": {
    "team": "..."
  }
}
```

### Default copy (drafts the user can rewrite)

| Key | English | Romanian |
|---|---|---|
| `team.intro.eyebrow` | The people behind your smile | Oamenii din spatele zâmbetului tău |
| `team.intro.title` | Meet the Premium Smile team | Echipa Premium Smile |
| `team.intro.dedication` | Our doctors are deeply committed to every patient who walks through our doors. They lead with patience, attention, and a steady hand — choosing every plan with the person in front of them in mind, not a checklist. The result is care that feels personal because it is. | Medicii noștri sunt profund dedicați fiecărui pacient care intră pe ușa noastră. Conduc cu răbdare, atenție și o mână sigură — alegând fiecare plan cu gândul la persoana din fața lor, nu la o listă. Rezultatul este o îngrijire care se simte personală pentru că este. |
| `team.doctors.title` | Our doctors | Medicii noștri |
| `team.helpingStaff.title` | Our helping staff | Echipa de sprijin |
| `team.doctors.elena.name` | Dr. Elena Marin | Dr. Elena Marin |
| `team.doctors.elena.roles` | `["Founder", "Cosmetic Dentistry"]` | `["Fondator", "Stomatologie Estetică"]` |
| `team.doctors.elena.bio` | Dr. Marin leads the clinic with a commitment to patient-first care. Every plan she designs starts from listening, not from a procedure list — and the work is shaped by the person in front of her. | Dr. Marin conduce clinica cu un angajament față de îngrijirea axată pe pacient. Fiecare plan începe de la ascultare, nu de la o listă de proceduri — iar tratamentul este modelat după persoana din fața ei. |
| `team.doctors.andrei.name` | Dr. Andrei Popescu | Dr. Andrei Popescu |
| `team.doctors.andrei.roles` | `["Restorative Dentistry"]` | `["Stomatologie Restaurativă"]` |
| `team.doctors.andrei.bio` | Dr. Popescu builds long-term relationships with his patients. He explains every step before it happens, so consent is informed and trust grows over years, not appointments. | Dr. Popescu construiește relații pe termen lung cu pacienții săi. Explică fiecare etapă înainte să se întâmple, astfel încât consimțământul să fie informat și încrederea să crească de-a lungul anilor, nu al programărilor. |
| `team.doctors.mihai.name` | Dr. Mihai Stoica | Dr. Mihai Stoica |
| `team.doctors.mihai.roles` | `["General Dentistry"]` | `["Stomatologie Generală"]` |
| `team.doctors.mihai.bio` | Dr. Stoica is known for his calm, methodical approach. Patients who arrived nervous tend to leave relaxed — and come back. | Dr. Stoica este cunoscut pentru abordarea sa calmă și metodică. Pacienții care au sosit emoționați pleacă de obicei relaxați — și revin. |
| `team.helpingStaff.ana.name` | Ana Georgescu | Ana Georgescu |
| `team.helpingStaff.ana.initials` | AG | AG |
| `team.helpingStaff.ana.roles` | `["Dental Assistant", "Patient Coordinator"]` | `["Asistentă Stomatologică", "Coordonator Pacienți"]` |
| `team.helpingStaff.raluca.name` | Raluca Pop | Raluca Pop |
| `team.helpingStaff.raluca.initials` | RP | RP |
| `team.helpingStaff.raluca.roles` | `["Office Manager"]` | `["Manager Cabinet"]` |
| `team.helpingStaff.ioana.name` | Ioana Stan | Ioana Stan |
| `team.helpingStaff.ioana.initials` | IS | IS |
| `team.helpingStaff.ioana.roles` | `["Receptionist"]` | `["Recepționer"]` |
| `nav.team` | Team | Echipă |

The dedication paragraph deliberately:
- Names no procedure ("veneers", "implants", "orthodontics", "whitening").
- Names no specialty ("cosmetic", "restorative", "general", "pediatric").
- Talks only about commitment, attention, listening, personalization.
- Three sentences, one paragraph, ~50 words.

The doctors' bios follow the same constraint at the bio level: each is
about HOW the doctor cares for patients, not WHAT procedures they perform.

## Theming

No new tokens. Uses `bg-bg`, `text-fg-muted` and the existing semantic
tokens already covered by the three themes (`light`, `dark`, `brand`).
The reused composites (`SectionHeading`, `DoctorShowcase`,
`HelpingStaffGrid`) are already theme-aware.

## Testing

`apps/frontend/src/pages/team/team-page.a11y.test.tsx` — renders the page
through `renderPageWithLayout` (which wraps the page in TopBar + main +
Footer + FloatingBookCta inside a memory router) so axe sees the full
landmark structure. Asserts `await axe(container)` returns zero
violations. This matches the pattern already used by
`pricing-page.a11y.test.tsx` and `blog-page.a11y.test.tsx`.

No behavior test (`team-page.test.tsx`) — the page is pure composition,
no logic to assert.

## Storybook

`apps/frontend/src/pages/team/team-page.stories.tsx` — Storybook title
`Pages/TeamPage`, one `Default` story rendering the full page. Wraps the
page in a memory router via the existing `_story-utils.tsx` helper so the
TanStack Router context is available (the page itself doesn't use Router
hooks, but its descendants might).

## Branch and PR strategy

The work lands on the existing `feat/helping-staff-card` branch, expanding
PR #29 from "two composites" to "two composites + the page that uses
them." Reasons:
- The team page is what motivated the helping-staff cards in the first
  place — bundling them is more truthful to the work as a unit.
- The user's "stay on current branch" preference is satisfied (no new
  branch spawned per task).
- The diff stays reviewable: the page diff is additive and the only
  cross-cutting change is the top-bar nav update.

Final verification: `task check` passes (Biome lint, `tsc --noEmit`,
Vitest, Storybook build) before pushing the new commits to the existing
branch. PR #29's title and description get updated to reflect the
expanded scope.

## Out of scope (recap)

See the Non-goals section above. The bullet that most often gets
re-litigated: helping-staff cards do **not** appear inside the
`DoctorShowcase` and the team page renders them as two distinct sections
with a clear visual gap (each section's `py-*` provides the breathing
room — no manual divider).

## Verification

`task check` must pass: Biome lint + format, `tsc --noEmit` strict,
the full Vitest suite (existing tests plus the new
`team-page.a11y.test.tsx`), and the Storybook build (which catches
malformed stories). No `--no-verify`.
