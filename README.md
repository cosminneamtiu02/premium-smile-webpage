# Premium Smile

Presentation website for the Premium Smile dental clinic. Pure-frontend SPA, i18n
(English / Romanian, browser-default), responsive across phone / tablet / laptop / desktop,
accessibility-first, multi-theme.

## Tech Stack

- **Framework**: React 19, Vite, TypeScript strict
- **Routing**: TanStack Router (file-based)
- **Data**: TanStack Query (scaffolded; no backend yet)
- **State**: Zustand (client-only)
- **Styling**: Tailwind 4, shadcn/ui primitives as needed
- **i18n**: i18next + browser language detector (EN, RO)
- **Component dev**: Storybook
- **Testing**: Vitest + React Testing Library
- **Lint/format**: Biome
- **Task runner**: Taskfile

## Quick Start

```bash
# Prerequisites: Node 22, pnpm 10

pnpm install
task dev               # Vite HMR at http://localhost:5173
task storybook         # Storybook at http://localhost:6006
```

## Commands

| Command | Description |
|---|---|
| `task dev` | Vite dev server with HMR |
| `task check` | Run all checks (lint, types, tests, storybook build) |
| `task lint` | Biome check |
| `task format` | Biome write |
| `task typecheck` | `tsc --noEmit` |
| `task test` | Vitest run |
| `task test:watch` | Vitest watch mode |
| `task build` | Production build (type-check + vite build) |
| `task storybook` | Storybook dev server |
| `task storybook:build` | Storybook build (CI check) |

## Documentation

- [Architecture](docs/architecture.md)
- [Conventions](docs/conventions.md)
- [Decisions](docs/decisions.md)
- [Testing](docs/testing.md)
- [Runbook](docs/runbook.md)

## AI-Assisted Development

See [CLAUDE.md](CLAUDE.md) for the discipline contract governing AI-assisted work.

## License

See [LICENSE](LICENSE).
