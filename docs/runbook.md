# Runbook

Operational guide for running and maintaining the site.

## Local Development

```bash
# Install deps (first time, or when lockfile changes)
pnpm install

# Vite dev server with HMR
task dev                  # http://localhost:5173

# Storybook
task storybook            # http://localhost:6006
```

## Checks

```bash
task check                # lint + types + tests + storybook build
task lint                 # biome
task format               # biome --write
task typecheck            # tsc --noEmit
task test                 # vitest run
task test:watch           # vitest
task build                # production build (tsc + vite)
task storybook:build      # storybook build
```

## Troubleshooting

### Frontend won't start
- Run `pnpm install` at the repo root.
- Check Node version: `node --version` should be 22+.

### CI failing with `ERR_PNPM_OUTDATED_LOCKFILE` on a Dependabot PR
The `dependabot-lockfile-sync.yml` workflow should auto-fix. If it doesn't:
- Check `gh variable list` for `DEPENDABOT_LOCKFILE_SYNC_ENABLED=true`.
- Check `gh secret list` for `DEPENDABOT_LOCKFILE_SYNC_PAT`.
- If the PAT expired, rotate and re-set the secret.
- Manual fallback: close the PR, run `pnpm --filter @premium-smile-webpage/frontend update --latest <pkg>` locally, commit manifest + `pnpm-lock.yaml` atomically, open a replacement PR.
  (See `CLAUDE.md` Dependabot section.)

### Dependabot PR not auto-merging despite green CI
- `gh variable list` must show `DEPENDABOT_AUTOMERGE_ENABLED=true`.
- The `main-protection` ruleset must exist with `frontend-checks` as a required check.
- See `docs/automerge.md` for the full troubleshooting path.

## Deploy

Deployment target is not yet chosen. Candidates: Cloudflare Pages, Vercel, Netlify,
GitHub Pages. All of them deploy on `git push` to `main` with their respective GitHub
integrations. Production build artifact is `apps/frontend/dist/`.
