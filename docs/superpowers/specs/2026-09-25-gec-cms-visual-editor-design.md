# GEC CMS — Visual Editor, Books, Scenes, Dispatch Email · Design Spec

> **Date:** 2026-09-25 · **Status:** Approved in brainstorming, awaiting spec review
> **Visual companion (wireframes, live plate builder, email preview):** https://claude.ai/artifact/5WNt7WHSYMRdykPRmWLTcE (private)
> **Email subsystem detail:** [`docs/dispatch-email-service.md`](../../dispatch-email-service.md) · template [`docs/email-templates/dispatch-issue.html`](../../email-templates/dispatch-issue.html)
> **Frozen inputs still in force:** `docs/GEC_CMS_Site_Map_Frozen.md`, `docs/GEC_Brand_Colour_Schema_Frozen.md`, `docs/GEC_Dynamic_Hero_Spotlight_Frozen.md`, `cms-wireframes/CMS-ARCHITECTURE.md`

---

## 1. Goal

Let GEC student teams change every word, image, book, shelf, team and hero card on the public site (`gec-web/`) without a developer:

- **Desktop:** a live visual editor (the real site, click to edit), a Canva-style canvas for hero cards, book covers and book pages, and scene editors for DeskFolio, the newsletter bookshelf and the library.
- **Phone:** quick edits, create-from-template, approvals and phone preview.
- **Dispatch newsletter:** edited in the CMS, shown in the bin, and emailed to subscribers.
- **Gemini:** drafting help and image briefs (text only).

## 2. Decisions

| # | Decision |
|---|---|
| D1 | **Custom build** on the existing `cms/` (Next) + `api/` (NestJS, Postgres + Mongo). Not Sanity: Sanity Free has visual editing but no custom roles, and per-team permissions + approvals are must-haves. |
| D2 | Edit mode lives **inside gec-web**; the CMS hosts it in an iframe with layers + inspector around it. No duplicate scene code. |
| D3 | Book pages, covers and hero cards are **free canvases** (absolute x/y/w/h/rotation). |
| D4 | Scenes (desk, shelf, library) keep **automatic layout**; editors choose what appears and in what order, never pixel positions. |
| D5 | Every book has a **full face** (designed cover) and a **small face** (spine/thumbnail) **derived** from the cover, with overrides: spine colour, spine text, thickness, foil. |
| D6 | **GEC colour tokens are locked for everyone**, admins included. Canvases store token references, never hex. |
| D7 | Phone CMS = **quick-edit + preview**. Canvas layout editing is desktop-only. |
| D8 | **Teams / Stage Manager fully in the CMS**; Team Heads edit only their own team. |
| D9 | **Every version is kept**; any version can be previewed, compared and restored (restore = new draft). |
| D10 | CMS is a **separate app**, deployed under the **same parent domain** as the site (e.g. `cms.<domain>` and `www.<domain>`). |
| D11 | **Gemini writes text only**, including **image briefs**. Images are generated elsewhere and uploaded. |
| D12 | Dispatch issues are **emailed via Resend**, used only as a sending pipe. **Daily cap on the Free tier** (100/day). |
| D13 | Library **years are first-class**: editors add years and put books on each year's shelves. Visitors know the year from the **hanging banners only** (no extra year navigation on desktop). Phones get year tabs. |
| D14 | **Team Heads cannot create books.** Books are created by Content Editors, Core Admin and Super Admin. |
| D15 | **Media on Cloudflare R2 free tier** (10 GB, no egress fees), compressed in the browser before upload, content-hashed immutable keys. |

## 3. Non-goals

- Pixel placement of books in scenes; custom scene art (mats, aisle textures stay in code).
- Free colour or font choice.
- In-CMS image generation.
- Email segments, A/B tests, drip automations.
- Real-time multi-user co-editing (last-write-wins on drafts, with version snapshots and a "someone else edited this" warning).

## 4. Current state (what the code does today)

Only stories, initiatives and teams are fetched from the API (`gec-web/src/lib/api.ts`, with fallbacks), and the home page uses only their counts. Everything else is a constant:

| Area | Source today |
|---|---|
| Hero | `HERO_CAMPAIGNS` in `lib/siteContent.ts` (api `hero` module exists, unused by the site) |
| Happening, Impact, Speakers, Partners, Milestones | `siteContent.ts` / consts inside `components/home/*.tsx` |
| DeskFolio books | `components/deskfolio/gecBooksData.tsx` — 916 lines, `pages: React.ReactNode[]` |
| Library (home `ShelfAct` → 3D `StoriesAisle`; phones `StoriesFrontPages`) | stories API; bays grouped by publish year in `components/stories/aislePlan.ts`; walk length capped at 6 viewports (`aisleRunway`) |
| Newsletter bookshelf (`NewsletterSection`, `deskfolio/InitiativeShelf`) | `lib/dispatchData.ts` + stories via `storyToBook` |
| Teams / Stage Manager | `GEC_TEAMS` in `lib/teamsData.ts` (sample Unsplash faces) |
| Dispatch bin | `lib/dispatchData.ts`; halftone scenes in `dispatch-bin/assets.js` |
| Nav, footer, curtain, route heroes, FinalCta, /about, /initiatives copy + form fields | hardcoded in components/pages |

∴ **Phase 0 must move all of this into the API** before any editor can work.

## 5. Architecture

```
cms/ (Next, cms.<domain>)          gec-web/ (Next, www.<domain>)          api/ (NestJS)
Live Editor ── iframe ───────────► /api/edit?token=… → draftMode ──GET──► draft | published docs
  layers · inspector · 🖥/📱        data-cms="coll/id/field" tags          RBAC · approvals · audit
  ◄──────── postMessage ──────────  edit overlay + <Canvas> handles        versions · copilot (Gemini)
  ─────── PATCH draft / submit / publish ─────────────────────────────►   on publish: revalidateTag
```

### 5.1 Edit mode handshake
1. CMS requests a **preview token** from the API: HMAC-signed, 15-minute TTL, bound to user id + role.
2. iframe loads `www.<domain>/api/edit?token=…&path=/`. The gec-web route handler verifies the token with the API, enables Next `draftMode()`, and sets a cookie (`Secure; SameSite=Lax`; valid because both apps are same-site under one parent domain), then redirects to `path`.
3. gec-web in draft mode fetches `draft` projections with the token; otherwise `published` (unchanged behaviour).
4. gec-web sends `Content-Security-Policy: frame-ancestors https://cms.<domain>` only on edit-mode responses.
5. Both sides check `event.origin` on every `postMessage`.

### 5.2 Bridge messages
| Direction | Message | Meaning |
|---|---|---|
| site → cms | `ready {path, tree}` | page loaded; layer tree of `data-cms` nodes |
| site → cms | `hover {path, rect}` / `select {path, kind, rect}` | pointer over / clicked an editable node |
| cms → site | `patch {path, value}` | apply a draft value locally (optimistic) |
| cms → site | `reorder {scene, ids}` | scene order changed |
| cms → site | `lock {paths}` | nodes the role can't edit (render 🔒, ignore clicks) |
| site → cms | `inline-commit {path, value}` | inline text edit finished |

### 5.3 Content binding
Every editable DOM node gets `data-cms="<collection>/<id>/<field>"` (e.g. `sitecopy/about.hero.title/value`, `team/startup-development/pillars.2.name`). Only rendered in draft mode; public HTML is unchanged.

## 6. Content model (API)

All documents: `{ id, draft, published, status, updatedBy, updatedAt, ownerTeam? }`. `status ∈ draft | in_review | approved | published | archived`.

```
SiteCopy      { key, value, limits: { chars, lines }, marks: none|basic }
HeroCampaign  { ...16 frozen fields, cards: Canvas[] }
Happening, Milestone, Stakeholder(speaker|partner|startup), People, Initiative  — existing/frozen shapes
Team          { slug, name, shortName, desc, pillars[6]{name,desc}, headId, coordinatorIds[≤4], memberIds[],
                heroImage, gallery[], recruitment{ open, closesAt, questions[] } }   // colour + window motion stay in code
Book          { kind: desk|newsletter|story, templateId, title, cover: Canvas, backCover?: Canvas, pages: Canvas[],
                spine{ color: Token, text, thickness: 'auto'|number, foil: Token }, refId? }
BookTemplate  { name, cover: Canvas, backCover?: Canvas, pages: Canvas[], spineRules, allowedScenes[] }
DispatchIssue { edition, kicker, headline, dek, byline, category, readTime, body, pullQuote, takeaways[3], tags[], plate: MediaRef, bookId? }
Scene:desk    { mat, bookIds[], stickerSet }
Scene:shelf   { variant: archive|bookcase, source, order: newest|manual, manualIds?, featuredId, hiddenIds[] }
Scene:aisle   { order: oldest|newest, perBay: 4, endWall{ title, line }, shelves: { [year]: bookIds[] } }
LibraryYear   { year, signTitle, signLine, intro?, visible, showEmpty }
Version       { docType, docId, n, kind: publish|snapshot|restore, snapshot, diffSummary, by, at, note? }
Media         (existing) + { plateParams?, brief?: ImageBrief, versions[] }
ImageBrief    { slot, ratio, px, prompt, avoid, cropSafe, altText }
Email: subscribers, email_sends, email_messages, email_events — see dispatch-email-service.md §9
```

### 6.1 Canvas
```
Canvas  { w, h, bg: Token, elements: Element[] }
Element { id, type: text|image|shape|sticker|icon|plate, x, y, w, h, rot, z, locked?,
          style{ font: display|body|mono|news-head|blackletter, size, weight, align, color: Token, ... },
          content? (text), src? (media:<id>), fit? }
Token   'token:crimson'|'token:crimson-act'|'token:gold'|'token:blue'|'token:ink'|'token:canvas'|'token:sand'|'token:paper'|'token:newsprint'|'team:01'..'team:07'
```
- Book page size **760 × 1018**; phone reads one page scaled (as `DeskFolioMobile` does today at 380 × 509).
- Hero card size fixed per card slot.
- Validated server-side (schema: element types, token-only colours, bounds, max 200 elements, text length).

## 7. Roles and workflow

| Role | Can |
|---|---|
| Super Admin | everything, users, settings |
| Core Admin | edit all content, approve, publish, send Dispatch email |
| Team Head | edit own `Team` doc + own team's recruitment; submit for review; cannot create books |
| Content Editor | create/edit stories, issues, books, media, site copy; submit for review; send test emails |
| Viewer | read, preview |

Flow: edit → autosaved draft → **Submit for review** → Core Admin approves → **Publish** (copies draft → published, records Version, revalidates cache tags). Core Admin can publish directly.

## 8. Version history
- **Publish** → numbered Version, kept forever.
- **Draft snapshot** at most every 10 minutes per person per doc, and before every restore.
- History panel: timeline (filter by publishes / person / date), field diff, canvas before/after thumbnails.
- **Restore** copies the old snapshot into a new draft; it then goes through review.
- Every version event is also in the existing audit log.

## 9. Editors

### 9.1 Live Editor (desktop, `cms/live`)
Top bar (page picker, 🖥/📱 width, draft status, Preview, Submit, Publish) · left layers (from `ready.tree`) · centre iframe · right inspector.
- Click text → inline edit on the real element (plain or basic marks), limits enforced.
- Click image → Media picker with the slot's aspect ratio, or the Plate builder.
- Click scene item → select; drag to reorder in the scene.
- Double-click a canvas region → Canvas editor.

### 9.2 Canvas editor (desktop, full screen)
- Left: add text / shape / image / plate / sticker / brand kit; page templates.
- Centre: canvas at true size via the shared `<Canvas>` renderer + **`react-moveable`** (only new dependency): drag, resize, rotate, snapping, multi-select, align/distribute, z-order, lock.
- Right: font role, size, locked token swatches, x/y/w/h/rot, ✨ Fit text.
- Gold dashed **phone safe area**; saving with elements outside it shows a warning.
- Undo/redo (local history), autosave drafts.
- Text is always live DOM text in the public render.

### 9.3 Book editor
New book → choose template (Handbook, Dispatch issue, Founder story, Summit report, Blank) → side-by-side **full cover** and **small spine** preview → spine overrides. The four current books are converted to JSON once and become the first four templates.

### 9.4 Page editor
Thumbnail strip (reorder, duplicate, hide, delete; + page from template: chapter opener, text + image, pull quote, stats, checklist, full-bleed plate, back matter) → click opens Canvas editor. Preview uses the real `DeskFolio` flip. Story `body` sections convert to pages by default.

### 9.5 Scene editors
- **DeskFolio** (`DeskAct`, `/initiatives` `DeskRunway`): mat theme (from code list), books on desk (ordered), sticker set.
- **Newsletter bookshelf** (`NewsletterSection`, `InitiativeShelf`): variant, source, order (newest or manual), featured volume, hidden volumes.
- **Library** (home `ShelfAct` → `StoriesAisle`):
  - Years list: add any year; rename sign; sign line template `COHORT · {count} STORIES`; optional intro card; hide; show-empty (sign reads "Shelf being stocked").
  - Map view: bays of 4 per year, drag books between slots, bays and years; Walk view: the real aisle.
  - Add book to a year: existing story / desk book / Dispatch issue, or new from template. A book's year defaults to its publish date; override allowed.
  - Walk order: oldest → newest (default) or newest first. End wall title/line editable.
  - Public: `planAisle()` walks saved years in order (falls back to publish-year grouping if no scene saved). `aisleRunway` grows per bay instead of capping at 6. Year is shown only by the hanging banners. Phones (`StoriesFrontPages`) get year tabs.

### 9.6 Teams & Stage Manager
Window list (7), live window preview, fields per §6 `Team`. Exactly 6 pillars; head required to publish; ≤4 coordinators; people picked from **People** (one photo used everywhere). Team colour, window motion, count and slugs stay in code; Super Admin may rename a team. Sample Unsplash faces removed in Phase 0.

### 9.7 Hero
Campaign list with frozen spotlight rules (P0–P2, lifecycle, start/end, evergreen fallback). Each campaign's **cards are canvases**. Headline, supporting text and CTAs stay live DOM text above the cards. Start/end is enforced by filtering at read time (no scheduler needed).

### 9.8 Everything else
Happening, Impact, Milestones (incl. `MilestoneRelive` media), Speakers, Partners (SVG only), Nav, Footer, Curtain, RouteHero, FinalCta, /about copy + people, /initiatives sections; `ProgramForm` fields move to the existing form builder.

### 9.9 Dispatch issues + plate builder
- Issue editor: kicker, headline, dek, byline, category, read time, body (drop cap + pull quotes), 3 takeaways, tags, plate; **Email** tab (§11).
- **Plate builder** (browser canvas, desktop + phone): source = upload or Media → crop to slot ratio → grayscale → contrast → dot screen (size, angle) → newsprint `#F0E8D2` ground + grain/fibre; ink = newsprint black or a GEC spot token. Export PNG → Media with `plateParams` and the brief. Same algorithm as the prototype in the visual companion.

## 10. Gemini (text only, via existing `api/modules/copilot`)
| Tool | Output |
|---|---|
| Image brief | Prompt fitted to slot (ratio, px, composition, light, avoid list, crop-safe zone) + alt text; copy button; stored on the uploaded Media |
| Draft issue / story | Fills fields from notes or a transcript |
| Fit text | Rewrite to the field's char/line limit |
| Lay out from text | Pages from a book template with text split to fit |
| Subject lines | 3 subject + preheader pairs (≤50 / ≤90 chars) |
| Alt text + SEO | Alt text, meta description, OG title |

All outputs are drafts; a person submits/publishes. Model names come from env (`GEMINI_DEFAULT_MODEL`); replace the stale `gemini-2.0-flash` default with a current text model when Phase 5 starts. Usage logged per user in audit.

## 11. Dispatch email
Fully specified in [`docs/dispatch-email-service.md`](../../dispatch-email-service.md). Summary: Resend batch API behind a one-file `EmailProvider` boundary; subscribers, template, unsubscribe, scheduling and history in GEC Postgres; double opt-in; outbox batches of ≤100; **`EMAIL_DAILY_CAP=100`** spreads a send across days (CMS shows the finish date); one-click `List-Unsubscribe`; sending is Core Admin only; editors send tests.

## 11a. Media storage — Cloudflare R2 (free tier)
- **Buckets** (already named in `deployment.md` §4.5): public `gec-public-media-<env>` behind a Cloudflare media domain (`media.<domain>`, exposed to the site as `NEXT_PUBLIC_MEDIA_BASE_URL`); private `gec-private-submissions-<env>` with no public domain. `r2.dev` URLs disabled in production.
- **Free tier (verified 2026-09-25):** 10 GB-month storage, 1M Class A (writes) and 10M Class B (reads) operations per month, no egress fees. Enough for GEC if uploads are compressed.
- **Upload path:** existing `api/modules/media` presigned PUT → browser uploads directly to R2 → API verifies and records the asset. Nothing streams through the API.
- **Keep it inside 10 GB:** the CMS compresses in the browser before upload (long edge ≤ 2400 px, WebP q≈82; plates are PNG). Keys are content-hashed (`<sha256>.webp`), so identical uploads dedupe and objects are immutable (`Cache-Control: public, max-age=31536000, immutable`).
- **Serving:** the site renders R2 images through `next/image` (host allowed in `gec-web/next.config.ts` from `NEXT_PUBLIC_MEDIA_BASE_URL`, optimized copies cached 30 days). The email uses the R2 URL directly.
- **Versions:** a replaced image is a new object; old objects stay while any Version references them. A monthly job deletes objects that no Version or live doc references and that are older than 90 days.
- **Usage meter:** Settings shows R2 storage used vs 10 GB; warns at 80%.

## 12. Phone CMS (≤768 px)
Bottom tabs: **Inbox · Content · ＋ New · Approve · Me**.
- Content: per-collection lists → form edits (text, image, toggles, drag-handle reorder).
- ＋ New: Dispatch issue, story, desk book (from template; not for Team Heads), plate, hero campaign, announcement ticker.
- Preview: site in edit mode at phone width; tap text → bottom-sheet editor.
- Approve: diff + preview + approve & publish.
- Canvas documents open read-only with "Open on desktop".

## 13. Error handling
- Public site never breaks: API down → current fallbacks (`fallbackData.ts`, seeded from Phase 0 constants).
- Invalid draft (schema fail) → save rejected with field-level errors; last good draft kept.
- Preview token expired → iframe shows "Session expired — reload preview"; CMS refreshes the token silently every 10 min.
- Concurrent edit → save compares `updatedAt`; on mismatch show "Changed by X at T — reload or overwrite" (overwrite creates a snapshot first).
- Publish failure after revalidation error → publish is kept, revalidation retried via outbox.
- Media delete blocked while referenced (existing usage tracker).
- Email failures → per-message status, retries via outbox; see email doc.

## 14. Testing
- **Phase 0 golden test:** screenshot every route (desktop + phone widths) before and after de-hardcoding; must match (Playwright visual diff).
- Existing `*.check.ts` pattern extended: `canvas.check.ts` (schema + token rules), `aislePlan.check.ts` (saved years, empty years, overrides, fallback), `spine.check.ts` (derived spine).
- API: unit tests for RBAC matrix (Team Head only own team, no book creation), publish → Version, restore → draft, preview-token verify/expiry.
- Bridge: Playwright test driving the CMS live editor against a local gec-web (select, inline edit, reorder, lock).
- Email: provider contract test with a fake provider; webhook signature test with Resend sample payload; planner test for daily-cap spreading.
- Plate builder: deterministic output for a fixed input (hash compare, grain seeded).

## 15. Build order (each phase ships on its own)
0. **De-hardcode** all §4 content except DeskFolio books into the API via the existing content pipeline (seeded from the site's constants, fallbacks kept), add `/api/revalidate` and the parity gate. Site must read identically. (Books → canvas JSON moves to Phase 3; `data-cms` tags to Phase 1; R2 moves happen per image field from Phase 1.)
1. **Live editor**: preview token + draft mode, bridge, layers, inspector, inline text, RBAC locks, review/publish, **version history**.
2. **Canvas** renderer + editor; first user: hero cards.
3. **Books**: templates, two-face preview, spine overrides, page editor.
4. **Scenes + Teams**: desk, newsletter shelf, library (years), Teams/Stage Manager, Speakers, Milestones, Dispatch issue editor.
5. **Plates + Gemini** tools.
6. **Dispatch email** (per email doc).
7. **Phone CMS**.

## 16. Risks
| Risk | Mitigation |
|---|---|
| Phase 0 is large and touches every section | Do it section by section behind the golden screenshot test; fallbacks keep the site safe |
| JSX books → canvas JSON loses design detail | Convert one book first, compare flip screenshots, then the rest |
| Free canvas lets people make ugly pages | Token lock, font roles, safe area, templates first, review before publish |
| Iframe + draft mode across subdomains | Same parent domain chosen (D10); token handshake; CSP frame-ancestors |
| 100/day email cap slows big sends | Finish date shown before scheduling; Pro is a config change later |
| `react-moveable` maintenance | Isolated in the Canvas editor only; public renderer has no dependency on it |
