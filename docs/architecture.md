# Architecture

## System Overview

Pure-frontend SPA. Users hit the site at `/`, get redirected to `/$lang/` where
`$lang` is the detected browser language (EN or RO, default EN). Everything runs
client-side.

```
  +-----------+       +----------------------+
  |  Browser  | ----> |  Static SPA (CDN)    |   React + Vite + TanStack Router
  +-----------+       +----------------------+
```

No backend, no database, no server.

## Folder Layout

```
src/
+-- routes/                              TanStack Router file-based routes
|   +-- __root.tsx                       Root layout (header + <Outlet>)
|   +-- index.tsx                        Redirect / -> /$lang/
|   +-- $lang/
|       +-- route.tsx                    Language guard (beforeLoad)
|       +-- index.tsx                    Home page
|       +-- <more pages...>              Services, Team, Contact, etc.
+-- shared/
|   +-- components/
|   |   +-- ui/                          ATOMS: Button, Input, Heading, ...
|   |   +-- composite/                   COMPOSITES: Hero, Card, NavBar, Footer
|   |   +-- language-switcher/
|   |   +-- date-time/
|   +-- hooks/                           useCurrentLanguage, usePagination
|   +-- lib/                             cn, format, logger
+-- i18n/                                i18next config + locales (en, ro)
+-- stores/                              Zustand (client-only state; empty for now)
+-- app/                                 Providers + error boundary
```

## Component Tiers

Three tiers, each with a corresponding section in Storybook. The Storybook title
prefix encodes the tier:

| Tier | Folder | Storybook title | Rule |
|---|---|---|---|
| **UI (atom)** | `src/shared/components/ui/` | `UI/<Component>` | Imports only `shared/lib/` and other atoms |
| **Composite** | `src/shared/components/composite/` | `Composite/<Component>` | Composes atoms; may compose other composites |
| **Page** | `src/routes/$lang/<name>.tsx` | `Pages/<Route>` | Composes composites and atoms |

Pages are route files. Composites and atoms are pure components. The one-way
import rule (pages → composites → atoms) is enforced by convention and
reinforced in code review; no architecture-check tool is wired yet.

## State Management

Three lanes, strictly separated:

- **Local UI state** (one component's concern): `useState`.
- **Shared client state** (multiple components, no server): Zustand store in `src/stores/`.
- **Server state** (if/when we fetch from a CMS or API): TanStack Query hooks in a
  feature folder. TanStack Query is already scaffolded in `src/app/providers.tsx`; no
  hooks exist yet because the site has no data source today.

Never mix: API data belongs in TanStack Query, never in Zustand. Form state belongs in
`useState`, never in Zustand unless multiple components need to read it.

## Routing & i18n

`/$lang/` prefix on every URL. The route's `beforeLoad` guard validates the language
against `SUPPORTED_LANGUAGES` and calls `i18n.changeLanguage(lang)` before rendering,
keeping URL and i18n state in sync without `useEffect`.

Detection order (see `src/i18n/config.ts`): `navigator` language → localStorage
(`app.language`) → fallback `en`. First visit uses the browser default; subsequent
visits remember the user's choice.
