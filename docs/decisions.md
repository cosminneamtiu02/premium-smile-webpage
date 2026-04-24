# Architectural Decision Record

Decisions that shape this project. Each entry is final unless explicitly superseded.

## ADR-001: Three-Tier Component Architecture

**Status:** Accepted
**Date:** 2026-04-24

Components are organized into three tiers:

- **Atoms** (`src/shared/components/ui/`) — Button, Input, Heading, ...
- **Composites** (`src/shared/components/composite/`) — Hero, Card, NavBar, Footer, ...
- **Pages** (`src/routes/$lang/<name>.tsx`) — full pages, route files

Import direction is one-way: Pages → Composites → Atoms. Storybook mirrors the hierarchy
with title prefixes `UI/`, `Composite/`, `Pages/`.

**Rationale:** Matches how designers think about presentation sites (atomic design). Pages
are the unit the product-owner reviews; composites are the reusable sections; atoms are
the building blocks. The Storybook split makes it immediately obvious whether a change is
a primitive tweak or a page-level redesign.

**Rejected:** Feature-sliced architecture (vertical slices per feature). That works for
app-style products with per-feature domain logic. This site has no domain logic — it's a
catalog of pages built from shared components.

## ADR-002: i18n from Day One, Driven by Browser Default

**Status:** Accepted
**Date:** 2026-04-24

i18next with `/$lang/` URL prefix. Detection order: browser `navigator` → localStorage
→ fallback `en`. First visit picks the browser language; subsequent visits remember the
user's switcher choice.

**Rationale:** Retrofitting i18n means auditing every component for raw strings. The
library is trivial; the discipline is months of work to add later. Browser-default
detection is the minimal UX expectation of anyone arriving at a Romanian dental clinic
site from a non-Romanian browser.

## ADR-003: No Backend for the Presentation Site

**Status:** Accepted
**Date:** 2026-04-24

The site is a static SPA with no backend, no database, no error-contract system, no
API client. TanStack Query is scaffolded for future use (headless CMS, contact-form
submission service, etc.) but no queries exist today.

**Rationale:** Presentation sites for small businesses do not need a backend. The
content is known at build time, updated rarely, and deployable to any static host
(Cloudflare Pages, Vercel, Netlify). Re-adding backend pieces when a real need appears
is cheap; carrying them unused is noise.

**Rejected:** Ship a FastAPI backend "in case" — wastes deployment complexity,
observability surface, security surface, and CI minutes on a shape that may never be
needed.

## ADR-004: Accessibility is a Requirement, Not a Polish Pass

**Status:** Accepted
**Date:** 2026-04-24

Every interactive component must be keyboard-navigable, screen-reader labeled, and
WCAG-AA contrast-compliant as part of its definition of done. Not a follow-up ticket.

**Rationale:** Retrofitting a11y at launch is an audit-and-rework cycle that costs weeks.
Building it in from each component's first commit costs minutes per component.

## ADR-005: One Source of Truth per State Concern

**Status:** Accepted
**Date:** 2026-04-24

- Server state (future): TanStack Query.
- Client state shared across components: Zustand.
- Local UI state: `useState`.

No overlap. API data never in Zustand. Form state never in Zustand unless multiple
components need it.

**Rationale:** Prevents the classic React-app pathology of the same datum living in three
places and silently drifting.

## ADR-006: Dependabot Auto-Merge Exception

**Status:** Accepted
**Date:** 2026-04-24

Dependabot-authored PRs that arrive green on `frontend-checks` are auto-squashed by
[.github/workflows/dependabot-automerge.yml](../.github/workflows/dependabot-automerge.yml).
Every human or source-code PR still merges exclusively via the manual Squash button.

The workflow's guard reads `github.event.pull_request.user.login`, not `github.actor`
— using `github.actor` would silently skip the workflow whenever a human interacted
with a Dependabot PR (e.g. clicked "Update branch").

**Safety precondition:** `gh pr merge --auto` waits only for the checks declared on
the `main-protection` ruleset. The ruleset must exist with `frontend-checks` as a
required check before `DEPENDABOT_AUTOMERGE_ENABLED` may be set to `"true"`.

**Rationale:** The invariant the project cares about is "main is always green", not
"a human physically clicked the button". Dependabot PRs are the highest-volume, lowest-
novelty PRs in the system. The ruleset's required checks are the safety net;
automating the click lets weekly dependency updates merge without accumulating a
backlog of green-but-unclicked PRs.

See [docs/automerge.md](automerge.md) for the full explainer, including the lockfile-
sync workflow that pairs with auto-merge.

## ADR-007: Storybook Build is a CI Gate

**Status:** Accepted
**Date:** 2026-04-24

`pnpm build-storybook` is part of `frontend-checks`. A broken story blocks a merge.

**Rationale:** Storybook is the visual documentation for this site. If it doesn't build,
the documentation is lying. Treat it with the same rigor as a type error.
