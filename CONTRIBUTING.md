# Contributing

## Getting Started

1. Clone the repository
2. Install prerequisites: Node 22, pnpm 10
3. `pnpm install`
4. `task dev` to start the Vite dev server

## Code Style

- **TypeScript**: Biome (lint + format), tsc strict
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)

## Pull Request Process

1. Create a feature branch from `main`
2. Run `task check` before pushing (lint, types, tests, storybook build)
3. Open a PR against `main`
4. Wait for `frontend-checks` CI + CodeQL to pass
5. Squash merge via the GitHub UI

## Architecture

Read [CLAUDE.md](CLAUDE.md) for the complete list of rules and forbidden patterns,
and [docs/architecture.md](docs/architecture.md) for the layer diagram.
