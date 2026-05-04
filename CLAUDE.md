# CLAUDE.md

Discipline contract for AI-assisted development on this repository.
Every rule is mandatory. "Forbidden" means "do not do this without stopping
and asking the user first." Violations are bugs.

## Project Overview

Presentation website for the Premium Smile dental clinic. Pure frontend SPA —
React + TypeScript + Vite + Tailwind + TanStack Router. No backend, no database,
no server-side anything. i18n is driven by the browser's default language
(English / Romanian). Design priorities: accessibility, responsive layout
across phone/tablet/laptop/desktop, and theming (color schemes).

## Stack (do not deviate)

- Node 22 LTS, pnpm 10
- Vite, React 19, TypeScript strict
- TanStack Router (file-based), TanStack Query (scaffolded for future
  headless-CMS / API use)
- Zustand (client state only, when multi-component sharing is needed)
- Tailwind 4, shadcn-style primitives in `shared/components/ui/`
- i18next + browser language detector (EN, RO)
- Storybook (component-first dev + visual documentation), with the a11y addon
- Vitest + React Testing Library + vitest-axe (a11y regression tests)
- lucide-react (icons)
- Biome (lint + format)
- Task runner: Taskfile

When unsure about a library API, use Context7 to fetch current documentation
rather than relying on training data.

## Sacred Rules

1. **TDD when it makes sense.** Component behavior with logic — write a test
   first. Pure visual / layout work — Storybook stories are the verification.
2. **One source of truth per concern.** Server state in TanStack Query, client-
   shared state in Zustand, local UI state in `useState`. Never overlap.
3. **Accessibility is a requirement, not a polish pass.** Every interactive
   component must be keyboard-navigable, screen-reader labeled, and contrast-
   compliant from day one. Every composite and every page must ship with a
   `*.a11y.test.tsx` file that asserts `await axe(container)` returns zero
   violations.
4. **Run `task check` before declaring any work done.** Never use `--no-verify`.

## Component Architecture

Three tiers, each with a corresponding section in Storybook and the same
ordering in the filesystem:

```
src/shared/components/ui/           -- atoms       (Button, Input, Heading, ...)
src/shared/components/composite/    -- composites  (Hero, Card, NavBar, Footer, ...)
src/pages/<name>/<name>-page.tsx    -- pages       (HomePage, PricingPage, ...)
src/routes/$lang/<name>.tsx         -- routes      (thin re-exports binding URL → page)
```

Storybook titles mirror the hierarchy: `UI/<Name>`, `Composite/<Name>`,
`Pages/<Name>`.

Import direction is one-way: **Pages → Composites → Atoms.** Never the other
way. Atoms import only from `shared/lib/` and other atoms.

Route files are thin: `createFileRoute(...)({ component: ImportedPage })` —
nothing else. All visual code lives in `src/pages/<name>/<name>-page.tsx`.

## Forbidden Patterns — Frontend

- Never use raw strings in JSX. Use `t()` from `useTranslation()`.
- Never use `fetch()` directly. If an HTTP call becomes necessary, create a
  thin wrapper in `src/shared/lib/` first.
- Never use `useState` for data that will come from an API. Use TanStack Query.
- Never cache API data in Zustand. Server state belongs in TanStack Query.
- Never use `console.log` in committed code. Use the `logger` wrapper in
  `src/shared/lib/logger.ts`.
- Never format dates or numbers manually. Use the `Intl.*` wrappers in
  `src/shared/lib/format.ts`.
- Never use `<a href>` for internal navigation. Use TanStack Router `<Link>`.
  The `<Link>` atom in `shared/components/ui/link/` is for external URLs only.
- Never put route guards in component bodies. Use `beforeLoad` in the route file.
- Never use React Context for state management. Context is for dependency
  injection only (providers).
- Never write a component without a story unless it's a route file itself.
- Never write a composite or page without an a11y test asserting zero
  axe violations. Atoms are exempt because the Storybook a11y addon covers
  them in isolation.
- Never use snapshot tests.
- Never concatenate strings for translations. Use i18next interpolation.
- Never skip keyboard / screen-reader access for an interactive component.
- Never hardcode color values in component classes. Use the theme tokens
  (`bg-bg`, `text-fg`, `bg-accent`, `border-border`, etc.) so the component
  works across all three themes (`light`, `dark`, `brand`).

## Forbidden Patterns — Cross-cutting

- Never add a top-level folder without updating this file.
- Never commit without running `task check`.
- Never use `--no-verify`.
- Never introduce a new dependency without a clear reason.
- Never write a test class. Use `describe` / `it`.

## Naming Conventions

- Files: `kebab-case.tsx` / `kebab-case.ts`
- Components: `PascalCase` export (`export function Button`)
- Hooks: `useCamelCase`
- Behavior tests: `<name>.test.tsx`, structure `describe("<Subject>") { it("<behavior>") }`
- A11y tests: `<name>.a11y.test.tsx`, structure `describe("<Subject> — a11y")`
- Storybook titles: `UI/<Name>`, `Composite/<Name>`, `Pages/<Name>`

## Testing Rules

Three levels:

1. **Behavior** (`<name>.test.tsx`) — Vitest + RTL. Logic, rendering,
   interaction. Target: entire suite under 10 seconds.
2. **A11y regression** (`<name>.a11y.test.tsx`) — `vitest-axe`. Renders the
   component (or the page in its real layout shell via `renderPageWithLayout`)
   and asserts `await axe(container)` returns zero violations.
3. **Visual / documentation** (Storybook stories) — every component ships at
   least one story. Storybook addon-a11y shows live violations per story.

End-to-end (Playwright) is deliberately out of scope.

`tsc --noEmit` with `strict: true`, `noUncheckedIndexedAccess: true`,
`exactOptionalPropertyTypes: true`, `noUnusedLocals: true` is a build failure,
not a warning.

## Theme System

Three themes: `light`, `dark`, `brand`. Selected by `data-theme` on `<html>`,
applied by `ThemeProvider` based on the Zustand store
(`src/stores/theme-store.ts`). CSS variables in `src/index.css` define the
semantic tokens (`--bg`, `--fg`, `--accent`, `--border`, etc.) per theme.

Adding a theme: add a `[data-theme="<name>"]` block in `src/index.css`,
extend the `THEMES` array in `theme-store.ts`, add the i18n key
`theme.<name>` to both `en/common.json` and `ro/common.json`, and pick an
icon for the `ICONS` map in `theme-toggle.tsx`.

## i18n

- Detection order: `localStorage` → `navigator` → fallback `en`. Browser
  default drives first visit; user's switcher choice persists afterward.
- Languages: `en`, `ro`. Single namespace: `common`.
- Add a translation key: edit both `apps/frontend/src/i18n/locales/en/common.json`
  and `apps/frontend/src/i18n/locales/ro/common.json` in the same commit.
- Never concatenate translated strings. Use i18next interpolation:
  `t("home.welcome", { name })`.

## Dependabot

Close and delete any Dependabot PR that proposes a version older than latest.
Always use absolute latest versions for all dependencies.

**Auto-merge architecture** (see [docs/automerge.md](docs/automerge.md) for
the full explainer):

- Dependabot-authored PRs that pass all required status checks are
  automatically squash-merged by
  [.github/workflows/dependabot-automerge.yml](.github/workflows/dependabot-automerge.yml).
- Never click merge on a green Dependabot PR. Let auto-merge handle it. If
  it's not auto-merging, fix the root cause rather than merging manually.
- Never auto-merge a non-Dependabot PR.
- Never use `github.actor` in any auto-merge guard. Always read
  `github.event.pull_request.user.login`.
- Never set `DEPENDABOT_AUTOMERGE_ENABLED=true` without an active
  `main-protection` ruleset that has `frontend-checks` as a required status
  check bound to `integration_id: 15368`.
- Never bypass the ruleset. Never add anyone to the bypass list.

**Handling broken Dependabot PRs:**

The lockfile-sync workflow is split into a wrapper +
reusable-impl pair so that the PAT reference can be declared as a
required `workflow_call` secret in the impl. That declaration is what
keeps VS Code's GitHub Actions extension from raising a "Context access
might be invalid" warning on the secret reference.

- [.github/workflows/dependabot-lockfile-sync.yml](.github/workflows/dependabot-lockfile-sync.yml)
  — wrapper. `pull_request` trigger, gating
  (`dependabot[bot]` author + actor + `DEPENDABOT_LOCKFILE_SYNC_ENABLED`
  variable), delegates to the impl with `secrets: inherit`. No secret
  references, so no extension warnings.
- [.github/workflows/dependabot-lockfile-sync-impl.yml](.github/workflows/dependabot-lockfile-sync-impl.yml)
  — reusable. `workflow_call` trigger, declares
  `DEPENDABOT_LOCKFILE_SYNC_PAT` as a required secret, contains the
  actual checkout / regenerate / push steps. Because the secret name is
  declared in this file's `secrets:` block, the extension validates
  references against it and does not warn.

The PAT itself still lives in the **Dependabot** secrets namespace (not
Actions) and only Dependabot-actor runs can read it; do not move it.

Both files must move together: never edit the wrapper's gating or the
impl's steps without considering the other half. Never add a direct
event trigger (`pull_request`, `push`, etc.) to the impl — it must stay
`workflow_call`-only or the extension's secret-validation guarantee
breaks and the warning returns.

If the auto-sync falls over and a Dependabot PR is red with
`ERR_PNPM_OUTDATED_LOCKFILE`, close it, run
`pnpm --filter @premium-smile-webpage/frontend update --latest <package>`
locally, commit manifest + lockfile atomically, open a replacement PR.

## Merge Authorization

- **Never merge a PR without explicit user authorization for that specific
  PR.** Pushing the branch and opening the PR is fine; clicking merge (or
  calling `gh pr merge`) is not. Each merge is its own decision. An earlier
  "fix and merge" instruction does not carry forward.
- The one exception is the Dependabot auto-merge workflow, which is governed
  by the ruleset and the `DEPENDABOT_AUTOMERGE_ENABLED` variable — that
  exception is documented in [docs/decisions.md](docs/decisions.md) ADR-006.
