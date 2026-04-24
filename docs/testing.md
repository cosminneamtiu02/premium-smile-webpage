# Testing

## Philosophy

Two levels of verification, both mandatory for most work:

1. **Unit / component** — Vitest + React Testing Library. Covers logic, rendering, and
   user interaction. Target: entire suite under 10 seconds.
2. **Visual / documentation** — Storybook stories. Every component has at least one
   story covering its common states. Storybook build is a CI gate.

End-to-end (Playwright) is deliberately out of scope. If automated accessibility
regression becomes a priority, re-add Playwright with `axe-core` integration — until
then, manual a11y testing (axe browser extension, keyboard-only navigation, screen
reader spot-check) is the floor.

Snapshot tests are forbidden — they rot and teach nothing.

## Type-Driven Discipline

`tsc --noEmit` with `strict: true`, `noUncheckedIndexedAccess: true`,
`exactOptionalPropertyTypes: true`, `noUnusedLocals: true`. Enforced in CI. Type error
= build failure.

## Test Naming

`describe("<Subject>", () => it("<behavior>"))`.

Example: `describe("LanguageSwitcher", () => it("switches to Romanian when the RO button is clicked"))`.

## Test File Location

Co-located with the component: `hero/hero.test.tsx` lives next to `hero/hero.tsx`.

## Pre-commit / Pre-push / CI

| Layer | What runs | Speed |
|---|---|---|
| Pre-commit | Biome check, whitespace / yaml / json checks | ~5–10s |
| Pre-push | Vitest unit run | ~10–15s |
| CI | Biome + tsc + Vitest + coverage + Storybook build | ~60–90s |

## Explicitly Excluded

- Playwright E2E (out of scope for now)
- Property-based testing (Hypothesis, fast-check)
- Performance / load testing
- Mutation testing
- Snapshot testing (forbidden)
