# Repository Setup Reference

This document describes how the repo is configured on GitHub. All phases are already
applied; this is the reference, not an instruction sheet. If the repo ever needs to be
rebuilt from scratch, do the phases in order.

---

## Phase 1: Repo creation

- Owner: `cosminneamtiu02`
- Collab: `ioanaecaterinastan-collab` (role: write, for day-to-day work)
- Visibility: public (change to private in Settings → General if desired)

## Phase 2: CodeQL default setup

**Location:** Settings → Code security → Code scanning → CodeQL analysis

- Configured for `actions` + `javascript-typescript`
- Default query suite, weekly schedule

API: `gh api -X PATCH repos/OWNER/REPO/code-scanning/default-setup -f state=configured -f query_suite=default -F 'languages[]=actions' -F 'languages[]=javascript-typescript'`

## Phase 3: Merge methods

**Location:** Settings → General → Pull Requests

- [x] Allow squash merging (Pull request title / Pull request body)
- [ ] Allow merge commits
- [ ] Allow rebase merging
- [x] Always suggest updating pull request branches
- [x] Allow auto-merge
- [x] Automatically delete head branches

## Phase 4: Branch ruleset `main-protection`

**Location:** Settings → Rules → Rulesets → `main-protection`

- Enforcement: Active
- Bypass list: empty (contract applies to everyone)
- Target: default branch
- Rules:
  - Restrict deletions
  - Require linear history
  - Block force pushes (`non_fast_forward`)
  - Require pull request before merging (0 approvals, dismiss stale, conversation resolution, squash-only)
  - Require status checks to pass (strict, `frontend-checks` bound to `integration_id: 15368`)
  - Require code scanning results (CodeQL, errors / high_or_higher)

## Phase 5: Actions permissions

**Location:** Settings → Actions → General

- Actions permissions: Allow all actions and reusable workflows
- Workflow permissions: Read and write
- Allow GitHub Actions to create and approve pull requests: enabled

Also Settings → Code security:
- Dependency graph: enabled
- Dependabot alerts: enabled
- Dependabot security updates: enabled

## Phase 5a: Dependabot auto-merge

**Prerequisite:** Phase 4 ruleset must be active with `frontend-checks` bound.

Repo variable `DEPENDABOT_AUTOMERGE_ENABLED = "true"` arms
[.github/workflows/dependabot-automerge.yml](../.github/workflows/dependabot-automerge.yml).
The workflow calls `gh pr merge --auto --squash` on every Dependabot PR; GitHub's merge
queue then merges each one once `frontend-checks` is green.

Emergency disable: `gh variable set DEPENDABOT_AUTOMERGE_ENABLED --body "false"`.

## Phase 5b: Dependabot lockfile sync

**Prerequisite:** Phase 5a must be done.

Dependabot's pnpm support doesn't regenerate root `pnpm-lock.yaml` when it bumps a
workspace `package.json`. The
[.github/workflows/dependabot-lockfile-sync.yml](../.github/workflows/dependabot-lockfile-sync.yml)
workflow auto-fixes by regenerating and pushing the lockfile back.

Requires:
1. Fine-grained PAT scoped to this repo with `Contents: Read and write` + `Pull requests: Read and write`
2. Repo secret `DEPENDABOT_LOCKFILE_SYNC_PAT` set to the PAT value
3. Repo variable `DEPENDABOT_LOCKFILE_SYNC_ENABLED = "true"`

A PAT is required (not `GITHUB_TOKEN`) because `GITHUB_TOKEN`-authored pushes do not
re-trigger workflows — CI would never fire on the fixed commit.

Emergency disable: `gh variable set DEPENDABOT_LOCKFILE_SYNC_ENABLED --body "false"`.

## Phase 12: Repo hygiene

**Location:** Settings → General

- [x] Issues
- [ ] Wikis (disabled — docs live in the repo)
- [ ] Projects (disabled by default)
- [ ] Discussions (disabled by default)

---

## What's NOT done (intentional)

- **No backend** — presentation site, no server.
- **No database** — no persistent state.
- **No Docker / docker-compose / Terraform** — will deploy to a static host.
- **No E2E tests** — Vitest + Storybook cover the bases for a marketing site.
- **No deploy workflow** — deployment target (Cloudflare Pages / Vercel / Netlify) not
  yet chosen. Re-add `.github/workflows/deploy.yml` when ready.

---

## Troubleshooting Dependabot

See [automerge.md](automerge.md) for the full architecture and incident history.

### "My Dependabot PR is green but not auto-merging"

1. Is the PR author literally `dependabot[bot]`? No other bot qualifies.
2. Is `DEPENDABOT_AUTOMERGE_ENABLED` the literal string `"true"` in `gh variable list`?
3. Is the `main-protection` ruleset active with `frontend-checks` bound to
   `integration_id: 15368`? Check with:
   ```bash
   gh api repos/OWNER/REPO/rulesets/15522605 \
     --jq '.rules[] | select(.type=="required_status_checks") | .parameters.required_status_checks'
   ```
4. Is the PR `BEHIND` main? Strict mode requires branches be up-to-date. Use
   `gh api -X PUT repos/OWNER/REPO/pulls/NUMBER/update-branch` (NOT the UI button).

### "My Dependabot PR has red CI — `ERR_PNPM_OUTDATED_LOCKFILE`"

The lockfile-sync workflow should auto-fix. If not, check `DEPENDABOT_LOCKFILE_SYNC_PAT`
(secret) and `DEPENDABOT_LOCKFILE_SYNC_ENABLED` (variable, literal `"true"`). Fine-grained
PATs have expirations — if expired, rotate and re-set the secret.

Manual fallback: close the PR, run
`pnpm --filter @premium-smile-webpage/frontend update --latest <package>` locally,
commit manifest + `pnpm-lock.yaml` atomically, open a replacement PR.
