# Conventions

Rules that govern how code is written in this repository. `CLAUDE.md` is the
enforcement version; this document provides rationale.

## File Naming

| Context | Convention | Example |
|---|---|---|
| Frontend files (all) | `kebab-case.tsx` / `.ts` | `hero.tsx`, `use-current-language.ts` |
| Component exports | `PascalCase` | `export function Hero` |
| Hooks | `useCamelCase` | `useCurrentLanguage` |
| Component folders | `kebab-case` matching component name | `hero/hero.tsx` |

## Component File Structure

Every component lives in its own folder with its test and story co-located:

```
hero/
  hero.tsx           # The component
  hero.test.tsx      # Vitest test (when the component has behavior worth testing)
  hero.stories.tsx   # Storybook story (ALWAYS — every component has at least one)
```

Pages are route files under `src/routes/$lang/` and follow TanStack Router's
file-based convention — no nested folder.

## Component Tiers (atoms / composites / pages)

| Tier | Folder | Storybook title | Import rule |
|---|---|---|---|
| Atom (UI primitive) | `src/shared/components/ui/` | `UI/<Name>` | Only `shared/lib/` and other atoms |
| Composite | `src/shared/components/composite/` | `Composite/<Name>` | Composites + atoms |
| Page | `src/routes/$lang/<name>.tsx` | `Pages/<Name>` | Composites + atoms |

Import direction is strictly one-way: Page → Composite → Atom.

## Test Naming

`describe("<Subject>", () => it("<behavior>"))`

Example: `describe("Hero", () => it("shows the tagline in the current language"))`.

## Accessibility

Every interactive component must be keyboard-navigable and screen-reader labeled as
part of its definition of done. See `CLAUDE.md` forbidden patterns for the exact rules.

## i18n

Every JSX string goes through `t()` from `useTranslation()`. Never concatenate strings
for translations — use i18next interpolation (`t("home.welcome", { name })`).

## Dependencies

- Always use absolute latest versions.
- Close/delete Dependabot PRs that propose older versions (Dependabot auto-merge is
  configured — this is mostly moot in practice).
- Every new dependency requires justification. Prefer built-in `Intl.*` over libraries
  for formatting.
