# Features Catalog

Every feature implemented in this project, each with a short description. For the
architectural context, see [architecture.md](architecture.md); for the AI-assistant
overview, see [ai-guide.md](ai-guide.md).

---

## App Shell

### Entry Point & Providers ([src/main.tsx](../apps/frontend/src/main.tsx), [src/app/providers.tsx](../apps/frontend/src/app/providers.tsx))
`StrictMode → ErrorBoundary → Providers → RouterProvider` order ensures errors during
provider init still render something. QueryClient is configured with `staleTime: 60s`
and 3 retries (no API calls today, but scaffolded for the future).

### Error Boundary ([src/app/error-boundary.tsx](../apps/frontend/src/app/error-boundary.tsx))
React class-component boundary with an i18n-aware fallback (title, message, reload
button). Catches runtime rendering errors — unrelated to API-layer error codes, since
there is no API.

---

## Routing (TanStack Router, File-Based)

### Root Layout & Language Redirect ([src/routes/__root.tsx](../apps/frontend/src/routes/__root.tsx), [src/routes/index.tsx](../apps/frontend/src/routes/index.tsx))
Root layout renders the app header with the `LanguageSwitcher` and an `<Outlet>`. The
index route redirects `/` to `/$lang/` using the detected browser language, so every
URL the user sees carries an explicit language prefix.

### Language-Scoped Routes ([src/routes/$lang/route.tsx](../apps/frontend/src/routes/$lang/route.tsx))
`beforeLoad` validates the `$lang` param against `SUPPORTED_LANGUAGES`, redirects
invalid values to the default language, and calls `i18n.changeLanguage(lang)` before
rendering. URL and i18n state stay in sync without `useEffect` hacks.

### Home Page ([src/routes/$lang/index.tsx](../apps/frontend/src/routes/$lang/index.tsx))
Placeholder two-line welcome using translated strings. New pages are added by dropping
files into `src/routes/$lang/`.

---

## Shared Components

### UI Atoms — Button, Input ([src/shared/components/ui/](../apps/frontend/src/shared/components/ui/))
Shadcn-style Tailwind primitives using the `cn()` class-merge utility. Button supports
four variants (default/destructive/outline/ghost) and three sizes (sm/default/lg). Both
have Storybook stories under the `UI/` title prefix.

### LanguageSwitcher ([src/shared/components/language-switcher/](../apps/frontend/src/shared/components/language-switcher/))
Renders one button per supported language and calls `i18n.changeLanguage` on click. The
root layout places it in the header so it's always reachable.

### DateTime ([src/shared/components/date-time/](../apps/frontend/src/shared/components/date-time/))
Renders a `<time>` element with `Intl.DateTimeFormat` in the current i18n locale. Every
displayed timestamp in the app must go through this component (no manual formatting).

---

## Shared Utilities

### cn ([src/shared/lib/cn.ts](../apps/frontend/src/shared/lib/cn.ts))
`clsx` + `tailwind-merge` one-liner used by every component that composes class names.
Ensures conflicting Tailwind utilities resolve deterministically (last-one-wins).

### format ([src/shared/lib/format.ts](../apps/frontend/src/shared/lib/format.ts))
`formatDate`, `formatNumber`, `formatCurrency` — thin wrappers over `Intl.*`. Every
locale-sensitive display goes through this file.

### logger ([src/shared/lib/logger.ts](../apps/frontend/src/shared/lib/logger.ts))
`logger.info/warn/error` — a console wrapper that becomes a no-op in production builds.
Replaces `console.log`, which is forbidden in committed code.

---

## Hooks

### useCurrentLanguage ([src/shared/hooks/use-current-language.ts](../apps/frontend/src/shared/hooks/use-current-language.ts))
Returns a safe `SupportedLanguage`, handling sub-locales (e.g. `en-US` → `en`).

### usePagination ([src/shared/hooks/use-pagination.ts](../apps/frontend/src/shared/hooks/use-pagination.ts))
Generic pagination state (page, size, nextPage, prevPage, resetPage). Currently unused;
kept for list-style pages if any are added.

---

## i18n

### i18next Configuration ([src/i18n/config.ts](../apps/frontend/src/i18n/config.ts))
Detection order: `navigator` → `localStorage` (key `app.language`) → fallback `en`.
One namespace: `common`. Browser default wins on first visit; user's explicit switch
is remembered afterward.

### Locales — EN, RO ([src/i18n/locales/](../apps/frontend/src/i18n/locales/))
Both languages ship with `common.json` covering the app name, home strings, language
labels, error-boundary strings, and a loading label.

---

## Tests

### Component Tests ([src/**/*.test.tsx](../apps/frontend/src/))
Vitest + React Testing Library. Test-utils (`src/test-utils.tsx`) provides a
`renderWithProviders` wrapping a per-test QueryClient + i18n instance. Current coverage
is limited to the shared components kept after the presentation-site cleanup.

---

## CI/CD

### CI Workflow ([.github/workflows/ci.yml](../.github/workflows/ci.yml))
One job, `frontend-checks`: Biome lint, tsc type-check, Vitest + coverage, Storybook
build. Required by the `main-protection` ruleset.

### Copilot Review & Dependabot ([.github/](../.github/))
Copilot is auto-requested as a PR reviewer (best-effort, `continue-on-error`).
Dependabot has 2 ecosystems wired: npm (frontend) and github-actions, both weekly.
Auto-merge + lockfile-sync workflows make Dependabot PRs self-heal.

---

## Tooling

### Taskfile ([Taskfile.yml](../Taskfile.yml))
Single orchestration entry point with `dev`, `check`, `lint`, `typecheck`, `test`,
`build`, and `storybook` tasks. If you find yourself typing a long command twice, add
a task.

### Pre-commit Hooks ([.pre-commit-config.yaml](../.pre-commit-config.yaml))
Pre-commit: whitespace/EOF/yaml/json/large-file checks + Biome check.
Pre-push: vitest unit run.

### Editor & VCS Config ([.editorconfig](../.editorconfig), [.gitattributes](../.gitattributes), [.tool-versions](../.tool-versions))
LF line endings, 2-space indent, pinned Node/pnpm versions.
