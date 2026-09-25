# GEC platform: start here

This repo is the GEC monorepo: `gec-web/` (public site), `cms/` (admin app), `api/` (NestJS backend), `docs/`.

Before doing anything:
1. Read `HANDOFF.md` (repo root): what exists, how it runs, what's done, what's next.
2. For any website change, read `gec-web/AGENTS.md`. Next 16 differs from older docs, Tailwind spacing utilities do nothing there, and the design rules are listed.
3. For CMS work, the design authority is `docs/superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md`. Plans live in `docs/superpowers/plans/`.

Rules:
- Work on `main` only via normal commits; never force-push.
- Stage only the files your change touches.
- Run the gates in `HANDOFF.md` §3 before committing site changes. `scripts/parity.mjs` baselines are never regenerated to hide a diff.
- Site content types must not reuse the API's reserved names (`hero`, `teams`, `people`, `stakeholders`, `initiatives`, `stories`).
