# Phtevens — Claude Instructions

## Process

All work must follow PROCESS.md exactly. This is mandatory, not advisory.

Key rules:
- Never create a branch without a GitHub Issue in **Ready to Implement**.
- Never open a PR without all related test cases passing.
- Never mark implementation complete while any test case has **Not yet implemented** in its expected result.
- Always add test cases to TESTSPEC.md before implementing a requirement.
- All requirements must satisfy the SMART criteria in PROCESS.md before an issue leaves Refinement Needed.

## GitHub Project

The Kanban board is at https://github.com/users/krswow/projects/1

When starting work on an issue, move it to **In Progress**.
When opening a PR, move it to **In Review**.
When a PR is merged, the issue closes and moves to **Done** automatically.

## Repository

- Owner: krswow
- Repo: phtevens
- Branch naming: `feature/issue-<number>-short-description`
- Main branch: `main`

## Stack

- Backend: Node.js + Express + better-sqlite3
- Frontend: Vanilla JS + HTML/CSS (no framework)
- Tests: Playwright (end-to-end, `npm test`)
- Auth: JWT, bcrypt
- Seed: `npm run seed` (skips if users already exist)

## Test conventions

- One spec file per requirement: `tests/fr01-coupon-submission.spec.js`
- Use `POST /api/test/reset` in `beforeEach` for any test that creates or mutates data
- Use `request` fixture for API-level setup; `page` fixture for UI behaviour only
- Server runs on port 3000; `NODE_ENV=test` is set automatically by Playwright
