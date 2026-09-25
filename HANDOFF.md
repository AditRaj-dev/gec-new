# GEC Digital Platform: Master Handoff

> **For:** anyone (human or AI agent) picking up this project cold.
> **Repo:** `github.com/AditRaj-dev/gec-new`, branch `main`. This repo is the monorepo.
> **Last updated:** 26 Sep 2026.
> **Read order:** this file → `gec-web/AGENTS.md` (site rules) → the spec in `docs/superpowers/specs/` → whichever plan you're executing.

---

## 1. What this is

The digital platform of the **Galgotias Entrepreneurship Cell (GEC)**, Galgotias University, Greater Noida. It has three apps that ship together:

| App | Folder | What it is | Stack | Hosting (planned) |
|---|---|---|---|---|
| **Public website** | `gec-web/` | The GEC site: editorial, animated, with 3D "acts" (DeskFolio desk, stories library aisle, Stage Manager) | Next 16.3.5 (App Router, Turbopack), React 19.2, Tailwind 4, `motion`, hand-written WebGL shaders | Vercel, Root Directory = `gec-web` |
| **CMS (admin app)** | `cms/` | Where student teams edit the site, triage submissions, run forms, use the Gemini copilot | Next 16.3.5, React, lucide-react, Tailwind | Vercel (second project), Root Directory = `cms` |
| **API** | `api/` | The backend both apps use: content drafts/publish, auth + RBAC, media (R2), submissions, Google Forms, copilot, outbox | NestJS, Postgres (Neon) via `pg`, MongoDB (Atlas) via `mongoose`, JWT + argon2, Swagger at `/docs` | Render |

Supporting docs live in `docs/` plus the root notes: `architecture.md`, `deployment.md`, `cms-copilot-integration.md`, `google-forms-agent-integration.md`, and `cms-wireframes/`.

```
                 ┌───────────────── Vercel ─────────────────┐
 visitors ──────►│  gec-web (www.<domain>)                  │── GET /v1/public/... ──┐
                 │                                          │                        ▼
 GEC team ──────►│  cms (cms.<domain>)                      │── /v1/cms/... (JWT) ─► api (Render, api.<domain>)
                 └──────────────────────────────────────────┘                        │
                         ▲  POST /api/revalidate (HMAC-signed, from API outbox)       ├─ Postgres (Neon): workflows, publications, users, audit, outbox, forms
                         └────────────────────────────────────────────────────────────┤─ MongoDB (Atlas): drafts, published snapshots
                                                                                       ├─ Cloudflare R2: public media (media.<domain>), private submissions
                                                                                       └─ Gemini (copilot), Google Forms, email (Resend, planned)
```

---

## 2. Repository map

```
gec-new/
├── HANDOFF.md                  ← you are here
├── gec-web/                    public site (read gec-web/AGENTS.md before any change)
│   ├── src/app/                routes: / about teams initiatives stories stories/[slug]; api/revalidate;
│   │                           sitemap.ts robots.ts llms.txt/ opengraph-image.tsx favicon.ico icon.png apple-icon.png global-error.tsx
│   ├── src/content/            CMS fallbacks, one pure-data file per content type (see §5)
│   ├── src/lib/                content.ts + contentPick.ts (CMS reader), api.ts (fetch + fallbacks), site.ts (SEO identity),
│   │                           revalidation.ts (HMAC verify), siteContent/teamsData/dispatchData (seed sources), shaders/
│   ├── src/components/         home acts, deskfolio, dispatch-bin (newsletter), stories (aisle), teams (Stage Manager), route/
│   ├── scripts/                parity.mjs (+ parity/*.txt baselines), smoke.mjs, export-content.mts, design-lint, run-checks
│   └── docs/seo.md             SEO + performance guide
├── cms/                        admin app: src/app/(dashboard)/{dashboard,people,teams,initiatives,stories,stakeholders,
│                               media,submissions,forms,analytics,users,settings}, login/forgot/reset; lib/api-client.ts (+ mock-data)
├── api/                        NestJS: src/modules/{auth,content,hero,people,teams,initiatives,stories,stakeholders,media,
│                               submissions,google-forms,copilot,outbox,audit,health}; database/migrations (001 core, 002 forms);
│                               src/database/seeds (site content seed)
├── docs/
│   ├── superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md   ← THE CMS design authority
│   ├── superpowers/plans/2026-09-25-gec-cms-phase-0-dehardcode.md     ← Phase 0 plan + roadmap for phases 1–7
│   ├── dispatch-email-service.md + email-templates/dispatch-issue.html ← newsletter email (Resend), provider-swappable
│   ├── HANDOFF-2026-09-25-cms.md                                      ← detailed session log of the 25–26 Sep work
│   └── GEC_*_Frozen.md                                                ← frozen brand colours, site map, CMS site map, hero spotlight, content
├── cms-wireframes/             CMS-ARCHITECTURE.md + wireframes (the original 11-module CMS brief)
├── deployment.md               environments, domains, env vars, release runbook (includes `npm run seed:content`)
└── architecture.md, cms-copilot-integration.md, google-forms-agent-integration.md
```

**History.** The original monorepo is `github.com/AditRaj-dev/gec` (public). It also holds retired projects (`gec-styled-next`, `gec-portfolio*`, `gec-showcase`, `web`, `web-main`, `wireframes-v2`, `design-explorations`…). Until 26 Sep 2026 this repo (`gec-new`) held only the site at its root. It became the monorepo via the merge commit `86c652f` (the old history is kept as its first parent). Retired projects are **not** here; never import from them.

---

## 3. Running it locally

| App | Setup | Run | Port |
|---|---|---|---|
| gec-web | `cd gec-web && npm ci` | `npm run dev` | 3211 (`npm start` → 3210) |
| cms | `cd cms && npm ci`, copy `.env.example` → `.env.local` | `npm run dev` (add `-- -p 3300` if 3000 is taken) | 3000 |
| api | `cd api && npm ci`, copy `.env.example` → `.env`, fill DB URLs/secrets | `npm run start:dev` · Swagger at `http://localhost:4000/docs` | 4000 |

- **The site runs without the API.** With `API_BASE_URL` unset, every read uses the committed fallbacks, so the site looks exactly as designed. The CMS likewise has `lib/mock-data.ts`.
- **API needs:** Postgres + MongoDB. Run `npm run build && npm run migration:deploy`, then `npm run seed:content` to publish the site's current content.

### Quality gates (run before every commit that touches the site)
```
cd gec-web
npx tsc --noEmit -p .                               # type-check (ESLint isn't configured)
npm run check                                       # node assert checks + design-lint
BASE=http://localhost:3211 node scripts/smoke.mjs   # every route 200, required copy, surface order
BASE=http://localhost:3211 node scripts/parity.mjs  # content parity vs committed baselines (never --update to hide a diff)
cd ../api && npx tsc --noEmit -p . && npx jest
```
Known pre-existing failures (not regressions):
- design-lint ×3 (`#000` in `stories/aisleTextures.ts`; 3px `border-left` in `.rt-pull`);
- smoke: `WADHWANI` text on `/`, and outdated surface order for `/initiatives` and `/stories` in `scripts/smoke.expect.mjs`.

---

## 4. Deployment

Full runbook: `deployment.md`. Summary:

| Environment | Site | CMS | API | Media |
|---|---|---|---|---|
| Production | `www.<domain>` | `cms.<domain>` | `api.<domain>` (Render) | `media.<domain>` (R2 public bucket via Cloudflare) |
| Staging | `www-staging.<domain>` | `cms-staging.<domain>` | `api-staging.<domain>` | `media-staging.<domain>` |

- **Vercel (site):** Root Directory `gec-web`, leave "include files outside root" off, turn "skip deployments when no changes" on. Env: `NEXT_PUBLIC_SITE_URL` (the default in code is a guess, `https://ecellgu.in`, from `contact@ecellgu.in`), `API_BASE_URL`, `NEXT_PUBLIC_MEDIA_BASE_URL`, `REVALIDATION_HMAC_SECRET`. Preview deploys are automatically `noindex`.
- **Vercel (cms):** a second project with Root Directory `cms`. Env from `cms/.env.example`.
- **Render (api):** `api/Dockerfile`. Env from `api/.env.example` (DB URLs, JWT secrets, R2 keys, `REVALIDATION_URL` = site's `/api/revalidate`, `REVALIDATION_HMAC_SECRET`, `GEMINI_*`, Google Workspace, SMTP). Release order: build → `migration:deploy` → `seed:content` (idempotent, resumable).
- **Domain.** The real domain isn't recorded anywhere in the repo yet; `<domain>` placeholders throughout `deployment.md` need it.

**Release gate still owed (never run end-to-end):** on staging, seed the content, set `API_BASE_URL` on the site, confirm `parity.mjs` passes, then publish a change in the CMS/API and see it live within seconds. Unit tests cover each piece, but the full chain hasn't run because there was no local Postgres or Docker.

---

## 5. How content flows (the CMS pipeline)

1. **Editing:** CMS → `api` `/v1/cms/content` creates a **draft** (Mongo `cms_drafts`) with a workflow row (Postgres `content_workflows`: draft → in_review → approved → published).
2. **Publishing:** `publish()` writes an immutable snapshot (Mongo `cms_published_snapshots`) and a Postgres `publications` row, and queues an **outbox** event tagged with the content type.
3. **Revalidation:** the outbox POSTs to the site's `/api/revalidate` with `x-gec-signature` / `x-gec-timestamp` / `x-gec-nonce` and `eventUuid`, HMAC over `${timestamp}.${nonce}.${body}`. The site verifies it (`lib/revalidation.ts`) and calls `revalidateTag(type, { expire: 0 })`.
4. **Reading:** the site calls `getSingleton(type, FALLBACK)` / `getList(type, FALLBACK)` (`lib/content.ts`) → `GET /v1/public/content/:type`. The result is validated against the fallback's shape (`lib/contentPick.ts`): wrong or missing fields fall back, unknown keys are dropped, and list items missing fields are dropped. **The site never crashes on bad CMS data**, and `global-error.tsx` is the last resort.

**Content types the site reads today (Phase 0):**

| Type | Kind | Fallback file | Where it renders |
|---|---|---|---|
| `home-hero` | singleton | `src/content/hero.ts` | home hero campaigns + secondary cards |
| `happening` | singleton | `happening.ts` | home "What's happening" bento |
| `impact` | singleton | `impact.ts` | home impact numbers |
| `milestones` | list | `milestones.ts` | home milestones |
| `speakers` | list | `speakers.ts` | home speakers + /stories trail |
| `partners` | list | `partners.ts` | home partners |
| `site-nav` | singleton | `siteNav.ts` | navbar + footer (every page) |
| `team-stage` | list | `teams.ts` | Stage Manager + phone TeamFan (home, /teams) |
| `dispatch-issues` | list | `dispatch.ts` | newsletter bin (every page) + docked bin |
| `route-copy` | singleton | `routeCopy.ts` | RouteHero + FinalCta on /about /teams /initiatives /stories |

- **Reserved names:** the API's own modules use `hero`, `teams`, `people`, `stakeholders`, `initiatives`, `stories`. The site must never reuse them; see the constant in `api/src/modules/content/content.service.ts`. The site's hero is `home-hero` for this reason.
- **Seeding:** `cd gec-web && npx --yes tsx scripts/export-content.mts` regenerates `api/src/database/seeds/site-content.json` from the fallbacks, and `npm run seed:content` in `api/` publishes it.
- **Parity:** `scripts/parity.mjs` proves the site reads identically after any content move.

Already API-backed before Phase 0: stories (`getStories`), initiatives, teams (legacy `Team` shape), hero spotlight (API module, not used by the site).

---

## 6. Product decisions (locked with the owner)

| # | Decision |
|---|---|
| 1 | Custom CMS on the existing `cms` + `api`, **not Sanity** (Sanity Free has visual editing but no custom roles; per-team permissions + approvals are required) |
| 2 | **Live visual editor:** the real site in an iframe inside the CMS; click any text to edit; layers + inspector; the CMS runs on its own subdomain of the same parent domain |
| 3 | **Free canvas** (Canva-style) for hero cards, book covers, book pages. **GEC colour tokens locked for everyone** |
| 4 | Books have a full cover and a spine auto-derived from it (overridable); book templates; a page editor with flip preview |
| 5 | Scenes (DeskFolio desk, newsletter shelf, library aisle) keep automatic layout; editors choose what and in what order |
| 6 | **Library years are first-class** (add any year, fill its shelves); the hanging banners are the only year cue on desktop; phones get year tabs |
| 7 | **Teams / Stage Manager fully editable**; Team Heads edit only their own team and **can't create books** |
| 8 | **Every version kept**, with diff and restore (restore = new draft) |
| 9 | **Phone CMS** = quick edit + preview + approvals; canvas editing is desktop-only |
| 10 | **Gemini writes text only**, including precise **image briefs**; images are made elsewhere and uploaded, then screened into Dispatch-style halftone "plates" |
| 11 | Dispatch newsletter **emailed via Resend**, free tier with `EMAIL_DAILY_CAP=100`; subscribers, template and history live in our DB (switching provider = one file) |
| 12 | Media on **Cloudflare R2 free tier** (10 GB, free egress), compressed in the browser, content-hashed immutable keys |

Roles (API `roles.enum.ts`): Super Admin · Core Team Admin · Team Head · Content Editor · Viewer, with fine-grained permissions (content, people, teams, initiatives, stories, stakeholders, hero, media, submissions, forms, copilot, users, audit).

---

## 7. Status

### Done
- **Site:** all routes built and styled (see `gec-web/AGENTS.md` for design rules, shaders, sharp-edged components).
- **SEO:** metadata, canonicals, OG image, sitemap, robots, llms.txt, JSON-LD, favicon set. Details and the launch checklist are in `gec-web/docs/seo.md`.
- **Performance:** image compression (−785 KB), font preconnects, image cache TTL, R2 host allowed.
- **CMS Phase 0:** the 10 content types above are served via the API with fallbacks; revalidation route; parity gate; resumable seed; hardened pickers; global error page.
- **API:** outbox signing aligned with the site's verifier (it was broken before: no nonce, wrong field name).
- **Docs:** CMS design spec, Phase 0 plan + roadmap, email service + template.

### Not done / next, in priority order
1. **Deploy:** set Vercel Root Directory `gec-web`, add `NEXT_PUBLIC_SITE_URL`, redeploy; decide the real domain; stand up the staging API + DBs and run the release gate (§4).
2. **Phase 0b:** move the remaining hardcoded copy into the CMS: section intros (Impact, Milestones, Speakers, Partners, StageAct), Hero dock kicker, home FinalCta defaults, footer blurb/CTA/portals, curtain copy, /about body (`PIPELINE_STAGES`, leadership), /initiatives `PROGRAMMES`/`SCHEDULE`/form fields, /teams `TEAM_PILLS`. Same pattern and parity gate.
3. **Early Phase 1 cleanups:**
   - a check that `site-content.json` matches the fallbacks;
   - `revalidation.check.ts` (400 / 401 / replayed nonce);
   - tighten the verifier to the single signature form the API sends;
   - validate the route-copy `shader` value;
   - remove the inert `DockedBin` `issues` prop.
4. **Phases 1–7** (roadmap at the end of the Phase 0 plan; each gets its own detailed plan first):

| Phase | Deliverable |
|---|---|
| 1 | Live editor: preview token + draft mode, iframe bridge, `data-cms` tags, inline edit, RBAC locks, review/publish, version history |
| 2 | Canvas renderer + editor (`react-moveable`); first used on hero cards |
| 3 | Books: templates, convert the 4 JSX books to canvas JSON, spine derivation, page editor |
| 4 | Scenes (desk, shelf, library years) + Teams workspace + Speakers/Milestones + Dispatch issue editor |
| 5 | Plate builder + Gemini tools (image brief, draft, fit text, layout, subject lines, alt text) |
| 6 | Dispatch email per `docs/dispatch-email-service.md` |
| 7 | Phone CMS |

5. **Launch polish:**
   - self-host Cabinet Grotesk (biggest remaining speed win);
   - Search Console + Bing sitemap submission;
   - ask the university to link to the site;
   - decide on the 37 unused `public/` files (2.3 MB);
   - replace draft copy marked `ponytail:` in `initiatives/page.tsx`;
   - replace the sample Unsplash team faces with real people.

### Known issues
- The pre-existing gate failures listed in §3.
- Backend hasn't confirmed newsletter sign-ups (`formType: 'newsletter'`, empty `fullName`).
- `#apply` links have no target unless the page renders `id="apply"`.
- No browser has verified the phone TeamFan (`/teams?team=3`) or the newsletter bin since the Phase 0 prop changes (only the server payload was checked).

---

## 8. Conventions and gotchas

- **Next 16 differs from older docs.** Read `gec-web/node_modules/next/dist/docs/` before using a Next API (e.g. `error.tsx` gets `retry`, not `reset`; `revalidateTag` takes a profile).
- **Tailwind spacing utilities do nothing in gec-web** (an unlayered CSS reset beats them). Write spacing in plain CSS classes.
- **Design rules:**
  - fonts: Cabinet Grotesk / Manrope / JetBrains Mono (+ the Dispatch faces);
  - colours only from `--gec-*` tokens, no `#000`;
  - animate transform/opacity only, with a reduced-motion path;
  - every section has a `data-surface`;
  - phones <769 px get recompositions (InitiativeShelf, TeamFan, StoriesFrontPages).
- **Content modules** in `gec-web/src/content/` are pure data: relative value imports only, no `@/`, CSS or React. The export script depends on this.
- **Checks** are plain node scripts (`*.check.ts`) that import siblings with the `.ts` extension.
- **Windows + `core.autocrlf=true`:** files often show as "modified" with line-ending-only changes. Compare with `tr -d '\r'` before assuming real edits. `next dev` rewrites `gec-web/next-env.d.ts`; don't commit that.
- **Git:** never force-push `main`. Commit only the files your change touches (no `git add -A` in a dirty tree).
- **Secrets:** only `*.env.example` files (placeholders) are tracked; real values live in Vercel/Render and ignored local files.

---

## 9. Where to find more

| Need | Read |
|---|---|
| Site rules, commands, shaders, fragile components | `gec-web/AGENTS.md` |
| CMS design (editors, canvas, books, scenes, versions, Gemini, R2, phone) | `docs/superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md` |
| Phase 0 implementation + roadmap | `docs/superpowers/plans/2026-09-25-gec-cms-phase-0-dehardcode.md` |
| Newsletter email | `docs/dispatch-email-service.md`, `docs/email-templates/dispatch-issue.html` |
| SEO / performance | `gec-web/docs/seo.md` |
| Environments, domains, env vars, release runbook | `deployment.md` |
| Original CMS brief (11 modules, RBAC, Hero Spotlight rules) | `cms-wireframes/CMS-ARCHITECTURE.md`, `docs/GEC_CMS_Site_Map_Frozen.md`, `docs/GEC_Dynamic_Hero_Spotlight_Frozen.md` |
| Brand | `docs/GEC_Brand_Colour_Schema_Frozen.md`, `docs/GEC_Texture_Typography_Shader_Design_Spec.md` |
| Detailed log of the 25–26 Sep session | `docs/HANDOFF-2026-09-25-cms.md` |
| Visual plan (wireframes, live halftone + email preview; private) | https://claude.ai/artifact/5WNt7WHSYMRdykPRmWLTcE |
