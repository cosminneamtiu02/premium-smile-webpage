# AI Guide — Project Scaffold Overview

What is already implemented, what is not, and how the pieces connect. Read
`CLAUDE.md` for rules and forbidden patterns.

## What's Built

**Routing.** TanStack Router file-based routing. Every URL is prefixed with `/$lang/`.
`src/routes/__root.tsx` renders a header with the language switcher and an `<Outlet>`.
`src/routes/index.tsx` redirects `/` to `/$lang/` using the detected browser language.
`src/routes/$lang/route.tsx` validates the language param in `beforeLoad` and calls
`i18n.changeLanguage`. `src/routes/$lang/index.tsx` is the home page placeholder.

**Providers.** `src/app/providers.tsx` wires `QueryClientProvider` + `I18nextProvider`.
TanStack Query is scaffolded (60s staleTime, 3 retries) but no hooks exist today. i18n
is pre-initialized before providers mount, so language is already correct on first render.

**Error boundary.** `src/app/error-boundary.tsx` catches React runtime errors and renders
an i18n-aware fallback (title, message, reload button). Unrelated to any API-layer error
codes — there are none.

**i18n.** i18next + LanguageDetector. Two locales, English and Romanian. One namespace,
`common`. Detection order: `navigator` → localStorage (`app.language`). Every JSX string
goes through `t()`.

**UI primitives (atoms).** `src/shared/components/ui/` currently has `Button` (four
variants, three sizes) and `Input`. Both are Tailwind-styled, shadcn-compatible, and have
Storybook stories.

**Composites.** `src/shared/components/composite/` is the target directory for composed
components (Hero, Card, NavBar, Footer). Empty today — the first PR will fill it.

**LanguageSwitcher + DateTime.** `src/shared/components/language-switcher/` renders a
button group that toggles `i18n.changeLanguage`. `src/shared/components/date-time/` wraps
`Intl.DateTimeFormat` for locale-aware timestamp rendering.

**Utilities.** `src/shared/lib/cn.ts` is `clsx` + `tailwind-merge`. `src/shared/lib/format.ts`
wraps `Intl.*` for dates, numbers, currencies. `src/shared/lib/logger.ts` is a no-op in
production builds.

**Hooks.** `useCurrentLanguage` returns a safe `SupportedLanguage` (resolves `en-US` →
`en`). `usePagination` is a generic state hook (unused currently; keep for list-style
pages).

**Storybook.** `apps/frontend/.storybook/` is configured to pick up `src/**/*.stories.tsx`.
Existing stories: Button, Input, LanguageSwitcher, DateTime. Title prefixes encode tier
(`UI/…`, `Composite/…`, `Pages/…`).

**State.** `src/stores/` is empty. Zustand is installed; create a store only when two or
more components need to share client-only state.

**CI.** `.github/workflows/ci.yml` runs one job, `frontend-checks`: Biome, tsc, Vitest +
coverage, Storybook build. `main-protection` ruleset requires this job to pass before
merge. CodeQL analyses JS/TS + workflow files on every PR.

**Dependabot auto-merge.** Dependabot PRs squash-merge automatically when green. The
lockfile-sync workflow regenerates `pnpm-lock.yaml` when Dependabot misses it (known
pnpm-workspace bug). Both require repo variables + a fine-grained PAT (see
`docs/new-project-setup.md`).

## What Is NOT Built — TODOs

### No page content beyond the home placeholder
The home route shows a two-line welcome. Services, Team, Contact, Pricing, Blog — none
exist yet. Add route files under `src/routes/$lang/`.

### No color scheme / dark mode
Tailwind defaults only. A theme system (CSS variables for color tokens, a theme toggle
in the header, a Zustand store for the chosen theme) is the next infrastructure work.

### No responsive design tokens
Tailwind's default breakpoints work but no components have been layout-tested across the
four target sizes (phone, tablet, notebook, desktop) yet. Per-component responsive work
is part of each component's definition of done.

### No a11y scaffolding beyond the primitives
Button and Input use native focus rings and proper `type` attributes. Broader a11y
tooling (axe-core, focus-trap for modals, Radix primitives for dropdowns) is not
installed. Add on first component that needs it.

### No deployment target
The site has a domain but no host. Cloudflare Pages / Vercel / Netlify are all viable;
pick one when ready to ship.

### No contact form backend
There is no backend. If the site needs a contact form, options: Formspree / Basin
(third-party), Cloudflare Workers, a small Netlify/Vercel function. All of these plug
into TanStack Query cleanly when the time comes.

### No E2E tests / automated a11y regression
Vitest covers component behavior. Playwright + axe-core would add real-browser a11y
regression testing; deliberately out of scope for now.
