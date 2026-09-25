# Handoff: GEC website and CMS (25 Sep 2026)

Read this first if you're picking the work up in a new session. It says what exists, where it lives, what's proven, and what to do next.

## Branches

| Branch | Contains | Use it for |
|---|---|---|
| `WEBISTE-GETTING-THERE` | The full monorepo: every experiment and old project, plus all the work below. | History and reference. Unrelated uncommitted edits by another session also live in this checkout (`FullViewportAct.tsx`, some `*.css`, `next-env.d.ts`); they aren't part of this work. |
| `gec-web-clean` | Only `gec-web/` (the public site) + `docs/` + `.gitignore`. | Website work. |
| `cms-clean` | Only `cms/` (admin app) + `api/` (NestJS) + `docs/`, the CMS design notes (`cms-wireframes/`, `deployment.md`, `architecture.md`, `cms-copilot-integration.md`, `google-forms-agent-integration.md`) + `.gitignore`. `api/dist/` is no longer tracked (it's build output). | CMS and API work. |

Both clean branches were cut from `WEBISTE-GETTING-THERE` at the commit that added this file, so they share history. Nothing has been pushed. The monorepo `main` is the original base.

Standalone deploy of the site: `gec-web/AGENTS.md` explains how `gec-web/` is published to the `gec-new` repo with `git subtree split`.

## What was done (this session)

### Website (`gec-web/`)
- **SEO:** `metadataBase` + title template, per-page canonicals and descriptions, Open Graph/Twitter, branded share image (`src/app/opengraph-image.tsx`), `sitemap.xml` (routes + stories), `robots.txt` (preview deploys are `noindex`), `llms.txt`, Organization/WebSite JSON-LD on home, Article JSON-LD on stories. Guide: `gec-web/docs/seo.md`.
- **Favicon:** `src/app/favicon.ico` (16/32/48), `icon.png`, `apple-icon.png`, made from the swirled "G" of the logo. `public/gec-logo-512.png` is the logo for structured data.
- **Images:** public PNG/WebP recompressed (−785 KB), SVGs minified. 37 unused public files (2.3 MB) were **not** deleted; see `docs/seo.md`.
- **R2:** `next.config.ts` allows the media host from `NEXT_PUBLIC_MEDIA_BASE_URL`.
- **CMS Phase 0 (content out of the code):** 10 content types now come through the API's existing publish pipeline, with today's values as fallbacks:
  `home-hero, happening, impact, milestones, speakers, partners, site-nav, team-stage, dispatch-issues, route-copy`
  - Fallback data: `src/content/*.ts` (pure data). Read via `src/lib/content.ts` (`getSingleton` / `getList`). The pure pickers in `src/lib/contentPick.ts` validate CMS data against the fallback's shape, so bad data can't crash a page. `src/app/global-error.tsx` is the last resort.
  - Cache tag = content type. `src/app/api/revalidate/route.ts` receives the API's signed "content changed" calls and expires the tag immediately (`{ expire: 0 }`).
  - Parity gate: `BASE=http://localhost:3211 node scripts/parity.mjs` checks each page's text, links, images and surfaces against `scripts/parity/*.txt`. Never regenerate the baselines (`--update`) to make a failure go away.

### API (`api/`)
- The outbox now sends what the site verifies: `x-gec-signature`, `x-gec-timestamp`, `x-gec-nonce`, `eventUuid`, and signs `${timestamp}.${nonce}.${body}`. Covered by jest.
- Seed: `gec-web/scripts/export-content.mts` → `api/src/database/seeds/site-content.json`. Run `npm run seed:content` in `api/`. It is resumable per item (deterministic slugs `<type>-<n>`) and skips what's already published.
- `content.service.ts` lists the reserved content types (the API modules' own types vs the site's) so names don't collide again (the site's hero was renamed `home-hero` because the API's Hero Spotlight already uses `hero`).

### Docs
- Design spec (the authority): `docs/superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md`. It covers the live visual editor, Canva-style canvases, book templates and page editor, DeskFolio/bookshelf/library (with years), Teams/Stage Manager, version history, R2, Gemini text-only image briefs, and the phone CMS.
- Phase 0 plan + roadmap for phases 1–7: `docs/superpowers/plans/2026-09-25-gec-cms-phase-0-dehardcode.md`.
- Newsletter email via Resend (free tier, `EMAIL_DAILY_CAP=100`), written to be provider-swappable: `docs/dispatch-email-service.md`; template `docs/email-templates/dispatch-issue.html`.
- Visual plan (private artifact, wireframes + live halftone and email preview): https://claude.ai/artifact/5WNt7WHSYMRdykPRmWLTcE

## Decisions locked with the owner

1. Custom CMS (not Sanity), because per-team permissions and approvals are required.
2. Free canvas for hero cards, covers and pages. GEC colours are locked for everyone.
3. Phone CMS = quick edits + preview. Canvas editing is desktop-only.
4. Every version is kept.
5. The CMS is a separate app under the same parent domain as the site.
6. Gemini writes text only, including image prompts; the photos are made elsewhere and uploaded.
7. Newsletter emailed via Resend, free tier with a daily cap.
8. Library years are editable; the hanging banners are the only year cue (no year rail).
9. Team Heads can't create books.
10. Media on Cloudflare R2 free tier.

## Verified vs not verified

**Verified (25 Sep):**
- gec-web: `tsc` clean, `npm run check` passes (only the 3 pre-existing design-lint problems), parity 5/5.
- api: `tsc` clean, jest 19/19.

**Not verified:**
- Live API → site rendering, and publish → site refresh. There was no local Postgres and Docker wasn't running. **Release gate on staging:** run migrations + `npm run seed:content`, start the site with `API_BASE_URL` set, confirm parity passes, publish a change and see it on the site within seconds.
- No browser check of the phone TeamFan (`/teams?team=3`) or of the newsletter bin after the prop changes (verified from the server-rendered payload only).

## Known pre-existing issues (not from this work)
- design-lint: `#000` in `stories/aisleTextures.ts`; 3px `border-left` on `.rt-pull`.
- Smoke test: `/` expects "WADHWANI" text (Partners now shows logos); `/initiatives` and `/stories` surface order is out of date in `smoke.expect.mjs`.

## Next steps, in order
1. **Phase 0b.** Move the remaining hardcoded copy into the CMS: section intros (Impact, Milestones, Speakers, Partners, StageAct), Hero dock kicker, home FinalCta defaults, footer blurb/CTA/portals, curtain copy, the /about body, /initiatives programmes/schedule/form fields, and /teams team buttons. Use the same pattern: `src/content/*` + `getSingleton`/`getList` + a parity check each time.
2. **Early Phase 1 cleanups:**
   - a check that `site-content.json` matches the fallbacks;
   - a `revalidation.check.ts` covering missing headers → 400 and bad signature/replayed nonce → 401;
   - tighten the verifier to the one signature form the API sends;
   - validate the route-copy `shader` value;
   - drop the unused `DockedBin` `issues` prop.
3. **Phase 1:** live editor, preview-token edit mode, `data-cms` tags, review/publish, version history. Write its detailed plan first (roadmap is at the end of the Phase 0 plan).
4. **Launch items:**
   - set `NEXT_PUBLIC_SITE_URL` (default guessed `https://ecellgu.in`) and `NEXT_PUBLIC_MEDIA_BASE_URL`;
   - Search Console + Bing sitemap submission;
   - self-host Cabinet Grotesk (biggest remaining speed win);
   - decide on the 37 unused public files.

## Commands
| Where | Command |
|---|---|
| gec-web | `npm run dev` (3211) · `npx tsc --noEmit -p .` · `npm run check` · `BASE=http://localhost:3211 node scripts/smoke.mjs` · `BASE=… node scripts/parity.mjs` · `npx --yes tsx scripts/export-content.mts` |
| api | `npx tsc --noEmit -p .` · `npx jest` · `npm run build` · `npm run seed:content` (after build, needs DBs) |

Read `gec-web/AGENTS.md` before touching the site: Next 16 differs from older docs, Tailwind spacing utilities do nothing there, and the design rules are listed.
