# GEC CMS Phase 0 — De-hardcode the Site · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every piece of hardcoded site content that the CMS will edit is served by the API's existing publish pipeline, with today's values as seed data and fallbacks, and the public site renders identically.

**Architecture:** The API already has a generic content pipeline (`api/src/modules/content`): drafts in Mongo `cms_drafts`, `publish()` writes `cms_published_snapshots` + a Postgres `publications` row and emits a `cache_invalidation` outbox event tagged with the entity type; `GET /v1/public/content/:entityType` lists active published items as `{ id, entityType, slug, version, title, data, publishedAt }[]`. Phase 0 adds (1) a gec-web reader for that endpoint with fallbacks, (2) the gec-web revalidation route that receives the outbox's signed calls, (3) one entity type per content block, moving each constant into a pure-data module under `gec-web/src/content/` and passing it into components as props from server components, and (4) an API seed command that publishes those modules.

**Tech Stack:** Next 16.3.5 App Router (read `gec-web/node_modules/next/dist/docs/` before using any Next API), React 19.2, TypeScript strict, node `assert` checks run by `npm run check`; NestJS + Jest in `api/`.

**Spec:** `docs/superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md` (§4 current state, §6 content model, §13 error handling, §14 testing, §15 phase 0).

## Global Constraints

- Work only in `gec-web/` and `api/`. Never import from sibling folders (`gec-styled-next`, `gec-showcase`, …).
- The public site must look and read **identically** after every task. The parity check (Task 3) is the gate.
- The site must never crash when the API is down or unset: every read falls back to the seeded constant (`api.ts` behaviour).
- No new npm dependencies in this phase.
- Colours come from `--gec-*` tokens; no `#000`; animate only `transform`/`opacity` (existing design rules in `gec-web/AGENTS.md`).
- Tailwind spacing utilities do nothing in gec-web (see AGENTS.md); don't add any.
- Type-check with `cd gec-web && npx tsc --noEmit -p .` (ESLint is not configured).
- Checks are plain node scripts named `*.check.ts` that import siblings **with the `.ts` extension** and **no `@/` value imports** (node strips types; it doesn't resolve aliases).
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Pre-existing failures you must not "fix" in this phase (listed in `gec-web/AGENTS.md`): design-lint on `aisleTextures.ts` and `.rt-pull`; smoke `WADHWANI` text and `/initiatives`, `/stories` surface order.

### Scope changes vs spec §15 (recorded here, applied to the spec in Task 15)

- Converting the four DeskFolio books to canvas JSON moves to **Phase 3**: it needs the Canvas renderer from Phase 2.
- `data-cms` tagging moves to **Phase 1**: tags render only in draft mode, which Phase 1 introduces.
- Moving editable images to R2 happens when each image field becomes editable (Phase 1+). Phase 0 keeps `/public` paths in the seed data.

## Entity map (used by every task)

| Entity type (cache tag) | Kind | Fallback module (`gec-web/src/content/`) | Export | Read by |
|---|---|---|---|---|
| `hero` | singleton | `hero.ts` | `HERO_FALLBACK: HeroContent` | `app/page.tsx` → `Hero` |
| `happening` | singleton | `happening.ts` | `HAPPENING_FALLBACK: HappeningContent` | `app/page.tsx` → `Happening` |
| `impact` | singleton | `impact.ts` | `IMPACT_FALLBACK: ImpactContent` | `app/page.tsx` → `Impact` |
| `milestones` | list | `milestones.ts` | `MILESTONES_FALLBACK: Milestone[]` | `app/page.tsx` → `Milestones` |
| `speakers` | list | `speakers.ts` | `SPEAKERS_FALLBACK: Speaker[]` | `app/page.tsx` → `Speakers`; `app/stories/page.tsx` → `SpeakersTrail` |
| `partners` | list | `partners.ts` | `PARTNERS_FALLBACK: Partner[]` | `app/page.tsx` → `Partners` |
| `site-nav` | singleton | `siteNav.ts` | `SITE_NAV_FALLBACK: SiteNav` | `app/layout.tsx` → `Navbar`, `SiteFooter` |
| `team-stage` | list | `teams.ts` | `TEAMS_FALLBACK: TeamStageData[]` | home `StageAct`, `/teams` `StageRunway` |
| `dispatch-issues` | list | `dispatch.ts` | `DISPATCH_FALLBACK: GecDispatchItem[]` | `app/layout.tsx` → `DispatchBin`; `NewsletterSection`; `DockedBin` |
| `route-copy` | singleton | `routeCopy.ts` | `ROUTE_COPY_FALLBACK: RouteCopy` | `/about`, `/teams`, `/initiatives`, `/stories` → `RouteHero`, `FinalCta` |

List items carry an optional `order: number`; lists sort by it (missing → original position). Singletons are shallow-merged over the fallback so a partially-filled CMS doc never blanks a field.

---

### Task 1: Content reader with fallbacks

**Files:**
- Create: `gec-web/src/lib/contentPick.ts`
- Create: `gec-web/src/lib/contentPick.check.ts`
- Create: `gec-web/src/lib/content.ts`
- Modify: `gec-web/src/lib/api.ts` (export `fetchPublishedProjection`)

**Interfaces:**
- Produces: `pickSingleton<T extends object>(res: unknown, fallback: T): T`, `pickList<T>(res: unknown, fallback: T[]): T[]` (pure, in `contentPick.ts`); `getSingleton<T extends object>(entityType: string, fallback: T): Promise<T>`, `getList<T>(entityType: string, fallback: T[]): Promise<T[]>` (server, in `content.ts`).

- [ ] **Step 1: Write the failing check**

`gec-web/src/lib/contentPick.check.ts`:
```ts
import assert from 'node:assert/strict';
import { pickList, pickSingleton } from './contentPick.ts';

const fb = { title: 'Fallback', lede: 'Keep me' };
// API unset / failed → fetchPublishedProjection returned the null fallback
assert.deepEqual(pickSingleton(null, fb), fb);
// empty list → fallback
assert.deepEqual(pickSingleton([], fb), fb);
// published doc merges over fallback: missing keys survive
assert.deepEqual(pickSingleton([{ id: 'a', data: { title: 'CMS' } }], fb), { title: 'CMS', lede: 'Keep me' });
// malformed payload → fallback
assert.deepEqual(pickSingleton({ nope: true }, fb), fb);
assert.deepEqual(pickSingleton([{ id: 'a' }], fb), fb);

const list = [{ n: 'a' }, { n: 'b' }];
assert.deepEqual(pickList(null, list), list);
assert.deepEqual(pickList([], list), list);
// items unwrap to data, sorted by data.order; missing order keeps position
assert.deepEqual(
  pickList([{ id: '1', data: { n: 'x', order: 2 } }, { id: '2', data: { n: 'y', order: 1 } }, { id: '3', data: { n: 'z' } }], list),
  [{ n: 'y', order: 1 }, { n: 'x', order: 2 }, { n: 'z' }],
);
// items without data are dropped; all dropped → fallback
assert.deepEqual(pickList([{ id: '1' }], list), list);

console.log('contentPick.check: all assertions passed');
```

- [ ] **Step 2: Run it to see it fail**

Run: `cd gec-web && node src/lib/contentPick.check.ts`
Expected: FAIL, `Cannot find module ... contentPick.ts`.

- [ ] **Step 3: Implement the pure pickers**

`gec-web/src/lib/contentPick.ts`:
```ts
// Pure helpers that turn a /v1/public/content/:entityType response into site data.
// The response is ContentItem[]; anything else (null fallback, error envelope) means "use the fallback".
type Item = { data?: unknown };

const items = (res: unknown): Item[] => (Array.isArray(res) ? res.filter((i) => i && typeof i === 'object') : []);
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** First published doc, shallow-merged over the fallback so missing fields never blank the page. */
export function pickSingleton<T extends object>(res: unknown, fallback: T): T {
  const data = items(res)[0]?.data;
  return isObj(data) ? ({ ...fallback, ...data } as T) : fallback;
}

/** Every published doc's data, ordered by `order` (docs without one keep their position). */
export function pickList<T>(res: unknown, fallback: T[]): T[] {
  const rows = items(res)
    .map((it, i) => ({ d: it.data, i }))
    .filter((r): r is { d: Record<string, unknown>; i: number } => isObj(r.d));
  if (!rows.length) return fallback;
  const key = (r: { d: Record<string, unknown>; i: number }) => (typeof r.d.order === 'number' ? r.d.order : r.i);
  return rows.sort((a, b) => key(a) - key(b)).map((r) => r.d as T);
}
```

- [ ] **Step 4: Run the check**

Run: `cd gec-web && node src/lib/contentPick.check.ts`
Expected: `contentPick.check: all assertions passed`

- [ ] **Step 5: Export the existing fetcher and add the server readers**

In `gec-web/src/lib/api.ts` change `async function fetchPublishedProjection<T>(` to `export async function fetchPublishedProjection<T>(` (no other change).

`gec-web/src/lib/content.ts`:
```ts
import { fetchPublishedProjection } from './api';
import { pickList, pickSingleton } from './contentPick';

// Reads CMS-published content. The cache tag is the entity type, which is what the API's
// publish() emits, so /api/revalidate refreshes these reads.
const read = (entityType: string) =>
  fetchPublishedProjection<unknown>(`/v1/public/content/${entityType}`, entityType, null);

export async function getSingleton<T extends object>(entityType: string, fallback: T): Promise<T> {
  return pickSingleton(await read(entityType), fallback);
}

export async function getList<T>(entityType: string, fallback: T[]): Promise<T[]> {
  return pickList(await read(entityType), fallback);
}
```

- [ ] **Step 6: Type-check and run all checks**

Run: `cd gec-web && npx tsc --noEmit -p . && npm run check`
Expected: tsc prints nothing; `contentPick.check: all assertions passed`; design-lint shows only the 3 pre-existing problems.

- [ ] **Step 7: Commit**

```bash
git add gec-web/src/lib/contentPick.ts gec-web/src/lib/contentPick.check.ts gec-web/src/lib/content.ts gec-web/src/lib/api.ts
git commit -m "feat(gec-web): read CMS-published content with fallbacks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Revalidation route

The API's outbox posts signed cache-invalidation calls to `REVALIDATION_URL` (see `deployment.md`). `gec-web/src/lib/revalidation.ts` already implements verification (`processRevalidationHandshake`) but no route exposes it.

**Files:**
- Create: `gec-web/src/app/api/revalidate/route.ts`
- Modify: `gec-web/AGENTS.md` (Map section: one line for the route)

**Interfaces:**
- Consumes: `processRevalidationHandshake(headers: { signature: string | null; timestamp: string | null; nonce: string | null }, rawBody: string, secret: string | undefined, callbacks?: { onRevalidateTag?: (tag: string) => void; onRevalidatePath?: (path: string) => void })` from `@/lib/revalidation`.
- Produces: `POST /api/revalidate`.

- [ ] **Step 1: Read what the handshake returns and which headers it expects**

Run: `cd gec-web && sed -n 240,330p src/lib/revalidation.ts && grep -n "x-gec\|header" src/lib/revalidation.ts | head -20`
Note the exact header names and the return shape (status + body). Also read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md` for Next 16's `revalidateTag` signature (it may require a second profile argument).

- [ ] **Step 2: Write the route**

`gec-web/src/app/api/revalidate/route.ts` (adjust the three header names and the `revalidateTag` call to what Step 1 showed):
```ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { processRevalidationHandshake } from '@/lib/revalidation';

// Receives the API outbox's signed cache-invalidation calls (deployment.md: REVALIDATION_URL).
export async function POST(req: Request) {
  const raw = await req.text();
  const result = await processRevalidationHandshake(
    {
      signature: req.headers.get('x-gec-signature'),
      timestamp: req.headers.get('x-gec-timestamp'),
      nonce: req.headers.get('x-gec-nonce'),
    },
    raw,
    process.env.REVALIDATION_HMAC_SECRET,
    { onRevalidateTag: (tag) => revalidateTag(tag, 'max'), onRevalidatePath: (path) => revalidatePath(path) },
  );
  return Response.json(result.body, { status: result.status });
}
```

- [ ] **Step 3: Verify it rejects unsigned calls**

Run (dev server on 3211 or your own port): `curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3211/api/revalidate -d '{}'`
Expected: `401` or `400` (never `200`, never `500`).

- [ ] **Step 4: Verify a signed call succeeds**

Write a one-off script in your scratchpad (not the repo) that builds the canonical payload with `buildCanonicalPayload` + `computeHmacSha256` from `revalidation.ts` exactly as the API's `outbox.service.ts` does (read it: `grep -n "canonical\|hmac\|signature" api/src/modules/outbox/outbox.service.ts`), with `tags: ['hero']`, and POSTs it with `REVALIDATION_HMAC_SECRET=test` set on the dev server.
Expected: `200` and a body listing `hero` as revalidated.

- [ ] **Step 5: Type-check, document, commit**

Add to the `src/app/` line of the Map in `gec-web/AGENTS.md`: `api/revalidate (signed cache invalidation from the API outbox)`.
Run: `cd gec-web && npx tsc --noEmit -p .`
```bash
git add gec-web/src/app/api/revalidate/route.ts gec-web/AGENTS.md
git commit -m "feat(gec-web): /api/revalidate receives signed cache invalidation

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Parity baseline (the phase gate)

Captures the visible text and structure of every route **before** any content moves, then compares after each task.

**Files:**
- Create: `gec-web/scripts/parity.mjs`
- Create: `gec-web/scripts/parity/*.txt` (generated baseline, committed)
- Modify: `gec-web/AGENTS.md` (Stack and commands table)

**Interfaces:**
- Produces: `BASE=http://localhost:3211 node scripts/parity.mjs [--update]` — exits 1 and prints the first differing lines when a route's text changed.

- [ ] **Step 1: Write the script**

`gec-web/scripts/parity.mjs`:
```js
// Content parity gate for CMS Phase 0: the site must read identically after content moves to the API.
// Usage: BASE=http://localhost:3211 node scripts/parity.mjs [--update]
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://localhost:3211';
const ROUTES = ['/', '/about', '/teams', '/initiatives', '/stories'];
const dir = fileURLToPath(new URL('./parity/', import.meta.url));
const update = process.argv.includes('--update');
mkdirSync(dir, { recursive: true });

// Visible text + link targets + image srcs + section surfaces, one item per line.
function digest(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  for (const m of body.matchAll(/data-surface="([^"]+)"|href="([^"#?]+)|src="(\/[^"?]+)|>([^<>]+)</g)) {
    const [, surface, href, src, text] = m;
    if (surface) out.push(`[surface] ${surface}`);
    else if (href) out.push(`[href] ${href}`);
    else if (src) out.push(`[src] ${src}`);
    else {
      const t = text.replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
    }
  }
  return out.join('\n') + '\n';
}

let failed = 0;
for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  if (!res.ok) { console.error(`✗ ${route}: HTTP ${res.status}`); failed++; continue; }
  const now = digest(await res.text());
  const file = dir + (route === '/' ? 'home' : route.slice(1)) + '.txt';
  if (update || !existsSync(file)) { writeFileSync(file, now); console.log(`• ${route}: baseline written`); continue; }
  const was = readFileSync(file, 'utf8');
  if (was === now) { console.log(`✓ ${route}`); continue; }
  failed++;
  const a = was.split('\n'), b = now.split('\n');
  const i = a.findIndex((line, k) => line !== b[k]);
  console.error(`✗ ${route}: first difference at line ${i + 1}\n  was: ${a[i]}\n  now: ${b[i]}`);
}
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Make sure the API is NOT configured for the dev server**

Phase 0 compares fallback rendering. Run: `cd gec-web && grep -s "API_BASE_URL" .env.local .env || echo "unset: good"`
Expected: `unset: good` (if set, comment it out for this phase's parity runs).

- [ ] **Step 3: Write the baseline and run it twice**

Run: `cd gec-web && BASE=http://localhost:3211 node scripts/parity.mjs --update && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: five `baseline written`, then five `✓`. If the second run fails, the page has nondeterministic text (dates, random order); add a `.replace()` for it inside `digest()` and re-run until two runs match.

- [ ] **Step 4: Document and commit**

Add a row to the commands table in `gec-web/AGENTS.md`: `` `BASE=… node scripts/parity.mjs [--update]` `` | content parity gate (CMS Phase 0): visible text, links, images, surfaces per route.
```bash
git add gec-web/scripts/parity.mjs gec-web/scripts/parity gec-web/AGENTS.md
git commit -m "test(gec-web): content parity gate for CMS phase 0

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Hero (`hero`)

**Files:**
- Create: `gec-web/src/content/hero.ts`
- Modify: `gec-web/src/components/home/Hero.tsx` (remove `SECONDARY_CARDS`, add prop)
- Modify: `gec-web/src/app/page.tsx`
- Modify: `gec-web/src/lib/siteContent.ts` (keep `HeroCampaign` type + `HERO_CAMPAIGNS`; they become the fallback source)

**Interfaces:**
- Consumes: `getSingleton` (Task 1).
- Produces: `HeroContent = { campaigns: Record<string, HeroCampaign>; secondaryCards: HeroSecondaryCard[] }`, `HERO_FALLBACK`, `Hero({ campaigns, secondaryCards })`.

- [ ] **Step 1: Create the fallback module**

Open `gec-web/src/components/home/Hero.tsx`, cut the whole `const SECONDARY_CARDS = [ … ];` literal, and paste it into `gec-web/src/content/hero.ts` as below (the array body is the cut text, unchanged):
```ts
import { HERO_CAMPAIGNS, type HeroCampaign } from '../lib/siteContent';

export type HeroSecondaryCard = (typeof SECONDARY_CARDS)[number];
export type HeroContent = { campaigns: Record<string, HeroCampaign>; secondaryCards: HeroSecondaryCard[] };

// ⬇ pasted verbatim from Hero.tsx
const SECONDARY_CARDS = [
  /* …the cut array items… */
];

export const HERO_FALLBACK: HeroContent = { campaigns: HERO_CAMPAIGNS, secondaryCards: [...SECONDARY_CARDS] };
```
If `SECONDARY_CARDS` ended with `as const`, keep it and keep `[...SECONDARY_CARDS]` so the type stays a mutable array.

- [ ] **Step 2: Make Hero take the cards as a prop**

In `Hero.tsx`: add `import type { HeroSecondaryCard } from '@/content/hero';`, change the signature to
```ts
export function Hero({ campaigns, secondaryCards }: { campaigns: Record<string, HeroCampaign>; secondaryCards: HeroSecondaryCard[] }) {
```
and replace `SECONDARY_CARDS.map(` with `secondaryCards.map(`.

- [ ] **Step 3: Read it in the page**

In `gec-web/src/app/page.tsx`: replace `import { HERO_CAMPAIGNS } from '@/lib/siteContent';` with
```ts
import { getSingleton } from '@/lib/content';
import { HERO_FALLBACK } from '@/content/hero';
```
add `getSingleton('hero', HERO_FALLBACK)` to the `Promise.all` (destructure as `hero`), and render `<Hero campaigns={hero.campaigns} secondaryCards={hero.secondaryCards} />`.

- [ ] **Step 4: Verify**

Run: `cd gec-web && npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: no type errors; five `✓`.

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/hero.ts gec-web/src/components/home/Hero.tsx gec-web/src/app/page.tsx
git commit -m "refactor(gec-web): hero content via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: What's happening (`happening`)

`Happening.tsx` has its four bento cards written inline as JSX. Extract the copy into data; keep every class name and element exactly as it is.

**Files:**
- Create: `gec-web/src/content/happening.ts`
- Modify: `gec-web/src/components/home/Happening.tsx`
- Modify: `gec-web/src/app/page.tsx`

**Interfaces:**
- Produces: `HappeningContent`, `HAPPENING_FALLBACK`, `Happening({ content }: { content: HappeningContent })`.

- [ ] **Step 1: Create the data module (copy matches today's JSX character for character)**

`gec-web/src/content/happening.ts`:
```ts
export type HappeningContent = {
  kicker: string;
  heading: string;
  lede: string;
  event: { badge: string; date: string; title: string; desc: string; chips: string[]; note: string; cta: { label: string; href: string } };
  apply: { badge: string; title: string; desc: string; metaLabel: string; metaValue: string; cta: { label: string; href: string } };
  story: { badge: string; title: string; desc: string; byline: string; cta: { label: string; href: string } };
  spotlight: { mark: string; badge: string; status: string; title: string; meta: string; cta: { label: string; href: string } };
  allStories: { label: string; href: string };
};

export const HAPPENING_FALLBACK: HappeningContent = {
  kicker: 'REALTIME ECOSYSTEM DISPATCH',
  heading: 'Always Something in Motion.',
  lede: 'Ideas are being pitched. Teams are building. Founders are sharing. Opportunities are opening. Discover what is currently happening across the Galgotias entrepreneurial ecosystem.',
  event: {
    badge: 'UPCOMING EVENT',
    date: 'APRIL 14, 2026',
    title: 'Galgotias E-Summit 2026: The Builder Arena',
    desc: 'Greater Noida’s premier student entrepreneurship summit featuring 50+ founders, live demo rounds, and venture angel mixers across Campus Hub.',
    chips: ['Main Auditorium 01', '10:00 AM – 6:00 PM', '480 Seats'],
    note: 'Admissions Free for Students',
    cta: { label: 'View Event Details →', href: '/initiatives#esummit' },
  },
  apply: {
    badge: 'APPLICATIONS OPEN',
    title: 'SDP Cohort 04',
    desc: 'Find programs and opportunities currently accepting applications across the campus accelerator.',
    metaLabel: 'PRE-SEED COHORT',
    metaValue: '12 Teams Selected per Batch',
    cta: { label: 'Apply Now', href: '/initiatives#apply' },
  },
  story: {
    badge: 'LATEST STORY',
    title: 'From Garage to Seed Round',
    desc: 'Meet the student builders turning ideas into funded agritech ventures inside Galgotias.',
    byline: 'By Aman Sharma · FarmVision AI',
    cta: { label: 'Read Story →', href: '/stories#farmvision-ai' },
  },
  spotlight: {
    mark: 'FV',
    badge: 'STARTUP SPOTLIGHT',
    status: '● ACTIVE VENTURE',
    title: 'FarmVision AI — Autonomous Multispectral Drone Analytics for Precision Agriculture',
    meta: 'Founded by Galgotias B.Tech builders · Raised ₹75L Seed Round · Mentored through GEC Cohort 02 & GICRISE',
    cta: { label: 'Explore Startup →', href: '/stories#farmvision-ai' },
  },
  allStories: { label: 'Read All Stories →', href: '/stories' },
};
```

- [ ] **Step 2: Render from the data**

In `Happening.tsx`: add `import type { HappeningContent } from '@/content/happening';`, change the signature to `export function Happening({ content: c }: { content: HappeningContent }) {`, then replace each literal with its field, keeping elements and classes unchanged. The four places that need care:
```tsx
<div className="happening__event-badges">
  {c.event.chips.map((chip) => (
    <span key={chip} className="status-badge badge-outline">{chip}</span>
  ))}
</div>
```
```tsx
<ViewTransitionLink href={c.event.cta.href} className="gec-btn btn-crimson happening__event-cta">
  {c.event.cta.label}
</ViewTransitionLink>
```
```tsx
<div className="happening__spotlight-meta">{c.spotlight.meta}</div>
```
(the JSX had `&amp;`; the data has `&`, which React escapes to the same HTML)
```tsx
<ViewTransitionLink href={c.allStories.href} className="gec-btn btn-white">
  {c.allStories.label}
</ViewTransitionLink>
```
Every other literal maps one-to-one: `c.kicker`, `c.heading`, `c.lede`, `c.event.badge|date|title|desc|note`, `c.apply.badge|title|desc|metaLabel|metaValue|cta`, `c.story.badge|title|desc|byline|cta`, `c.spotlight.mark|badge|status|title|cta`.

- [ ] **Step 3: Read it in the page**

In `app/page.tsx` add `import { HAPPENING_FALLBACK } from '@/content/happening';`, add `getSingleton('happening', HAPPENING_FALLBACK)` to the `Promise.all` as `happening`, render `<Happening content={happening} />`.

- [ ] **Step 4: Verify**

Run: `cd gec-web && npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: five `✓`. A difference in `/` means a string doesn't match the old JSX (typically curly quotes or `–`); fix the data, not the baseline.

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/happening.ts gec-web/src/components/home/Happening.tsx gec-web/src/app/page.tsx
git commit -m "refactor(gec-web): happening content via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Impact (`impact`)

**Files:**
- Create: `gec-web/src/content/impact.ts`
- Modify: `gec-web/src/components/home/Impact.tsx`, `gec-web/src/app/page.tsx`

**Interfaces:**
- Produces: `ImpactMetric = { value: string; title: string; subtitle: string }`, `ImpactContent = { pillars: string[]; metrics: ImpactMetric[] }`, `IMPACT_FALLBACK`, `Impact({ content })`.

- [ ] **Step 1: Data module**

`gec-web/src/content/impact.ts`:
```ts
export type ImpactMetric = { value: string; title: string; subtitle: string };
export type ImpactContent = { pillars: string[]; metrics: ImpactMetric[] };

export const IMPACT_FALLBACK: ImpactContent = {
  pillars: ['Leadership', 'Communication', 'Teamwork', 'Ideation', 'Problem Solving', 'Execution'],
  metrics: [
    { value: '35+', title: 'Events & Experiences', subtitle: 'Summits, Hackathons & Mixers' },
    { value: '12,000+', title: 'Students Engaged', subtitle: 'Campus-Wide Ecosystem Reach' },
    { value: '45+', title: 'Startups Supported', subtitle: 'Incubated & Mentored Ventures' },
    { value: '28+', title: 'Speakers & Mentors', subtitle: 'Unicorn Founders & Industry VCs' },
  ],
};
```

- [ ] **Step 2: Component takes a prop**

In `Impact.tsx`: delete `const PILLARS = …` and `const METRICS = … as const;`, add `import type { ImpactContent, ImpactMetric } from '@/content/impact';`, change to `export function Impact({ content }: { content: ImpactContent }) {`, replace `PILLARS.map(` → `content.pillars.map(` and `METRICS.map(` → `content.metrics.map(`. If a child component was typed with `(typeof METRICS)[number]`, change that type to `ImpactMetric`.

- [ ] **Step 3: Page**

`app/page.tsx`: import `IMPACT_FALLBACK`, add `getSingleton('impact', IMPACT_FALLBACK)` as `impact`, render `<Impact content={impact} />`.

- [ ] **Step 4: Verify**

Run: `cd gec-web && npx tsc --noEmit -p . && npm run check && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: no type errors; `metric.check` passes; five `✓`.

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/impact.ts gec-web/src/components/home/Impact.tsx gec-web/src/app/page.tsx
git commit -m "refactor(gec-web): impact content via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Milestones (`milestones`)

**Files:**
- Create: `gec-web/src/content/milestones.ts`
- Modify: `gec-web/src/components/home/Milestones.tsx`, `gec-web/src/app/page.tsx`

**Interfaces:**
- Produces: `Milestone` (the element type of today's array), `MILESTONES_FALLBACK: Milestone[]`, `Milestones({ items }: { items: Milestone[] })`.

- [ ] **Step 1: Move the array**

Cut `const MILESTONES = [ … ];` from `Milestones.tsx` into `gec-web/src/content/milestones.ts`:
```ts
// ⬇ pasted verbatim from Milestones.tsx
const MILESTONES = [
  /* …the cut items… */
];

export type Milestone = (typeof MILESTONES)[number];
export const MILESTONES_FALLBACK: Milestone[] = [...MILESTONES];
```
If any item field is an imported value (e.g. an image import), move that import too; if it is JSX, stop and convert that field to a string plus a render rule in the component, keeping output identical.

- [ ] **Step 2: Component prop**

In `Milestones.tsx`: `import type { Milestone } from '@/content/milestones';`, signature `export function Milestones({ items }: { items: Milestone[] }) {`, `MILESTONES.map(` → `items.map(`.

- [ ] **Step 3: Page**

`app/page.tsx`: `import { getList, getSingleton } from '@/lib/content';` (extend the import), `import { MILESTONES_FALLBACK } from '@/content/milestones';`, add `getList('milestones', MILESTONES_FALLBACK)` as `milestones`, render `<Milestones items={milestones} />`.

- [ ] **Step 4: Verify**

Run: `cd gec-web && npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: five `✓`.

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/milestones.ts gec-web/src/components/home/Milestones.tsx gec-web/src/app/page.tsx
git commit -m "refactor(gec-web): milestones via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Speakers (`speakers`)

`SPEAKERS` is exported and used by both `Speakers` (home) and `SpeakersTrail` (home and `/stories`).

**Files:**
- Create: `gec-web/src/content/speakers.ts`
- Modify: `gec-web/src/components/home/Speakers.tsx`, `gec-web/src/app/page.tsx`, `gec-web/src/app/stories/page.tsx`

**Interfaces:**
- Produces: `Speaker` (moved type), `SPEAKERS_FALLBACK: Speaker[]`, `SpeakersTrail({ speakers })`, `Speakers({ speakers })`.

- [ ] **Step 1: Move type + data**

Cut the `Speaker` type/interface and `export const SPEAKERS: readonly Speaker[] = [ … ];` from `Speakers.tsx` into `gec-web/src/content/speakers.ts`, renaming the constant:
```ts
// ⬇ the Speaker type, pasted verbatim, with `export` added
export type Speaker = { /* …cut fields… */ };

// ⬇ pasted verbatim
export const SPEAKERS_FALLBACK: Speaker[] = [
  /* …the cut items… */
];
```

- [ ] **Step 2: Thread the prop**

In `Speakers.tsx`: `import type { Speaker } from '@/content/speakers';`; `export function SpeakersTrail({ speakers }: { speakers: Speaker[] }) {` and replace every `SPEAKERS` inside it with `speakers`; `export function Speakers({ speakers }: { speakers: Speaker[] }) {` and pass `<SpeakersTrail speakers={speakers} />` wherever `Speakers` renders the trail.

- [ ] **Step 3: Pages**

`app/page.tsx`: import `SPEAKERS_FALLBACK`, add `getList('speakers', SPEAKERS_FALLBACK)` as `speakers`, render `<Speakers speakers={speakers} />`.
`app/stories/page.tsx`: `import { getList } from '@/lib/content'; import { SPEAKERS_FALLBACK } from '@/content/speakers';`, fetch `const speakers = await getList('speakers', SPEAKERS_FALLBACK);` next to `getStories()` (use `Promise.all`), render `<SpeakersTrail speakers={speakers} />`.

- [ ] **Step 4: Verify**

Run: `cd gec-web && grep -rn "SPEAKERS\b" src | grep -v content/speakers.ts; npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: grep prints nothing; five `✓`.

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/speakers.ts gec-web/src/components/home/Speakers.tsx gec-web/src/app/page.tsx gec-web/src/app/stories/page.tsx
git commit -m "refactor(gec-web): speakers via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Partners (`partners`)

**Files:**
- Create: `gec-web/src/content/partners.ts`
- Modify: `gec-web/src/components/home/Partners.tsx`, `gec-web/src/app/page.tsx`

**Interfaces:**
- Produces: `Partner` (moved type), `PARTNERS_FALLBACK: Partner[]`, `Partners({ items })`.

- [ ] **Step 1: Move type + data**

Cut the `Partner` type and `const PARTNERS: readonly Partner[] = [ … ];` from `Partners.tsx` into `gec-web/src/content/partners.ts` as `export type Partner = …` and `export const PARTNERS_FALLBACK: Partner[] = [ …verbatim… ];`.

- [ ] **Step 2: Component prop**

`Partners.tsx`: `import type { Partner } from '@/content/partners';`, `export function Partners({ items }: { items: Partner[] }) {`, `PARTNERS.map(` → `items.map(`.

- [ ] **Step 3: Page**

`app/page.tsx`: import `PARTNERS_FALLBACK`, add `getList('partners', PARTNERS_FALLBACK)` as `partners`, render `<Partners items={partners} />`.

- [ ] **Step 4: Verify**

Run: `cd gec-web && npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: five `✓`.

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/partners.ts gec-web/src/components/home/Partners.tsx gec-web/src/app/page.tsx
git commit -m "refactor(gec-web): partners via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Navigation and footer (`site-nav`)

**Files:**
- Create: `gec-web/src/content/siteNav.ts`
- Modify: `gec-web/src/components/Navbar.tsx`, `gec-web/src/components/SiteFooter.tsx`, `gec-web/src/app/layout.tsx`

**Interfaces:**
- Produces: `NavLink = { href: string; label: string }`, `FooterSocial` (moved shape of `SOCIALS` items), `FooterPartner = { name: string; logo: string }`, `SiteNav = { routes: NavLink[]; mobileRoutes: NavLink[]; footerRoutes: NavLink[]; socials: FooterSocial[]; footerPartners: FooterPartner[] }`, `SITE_NAV_FALLBACK`, `Navbar({ nav })`, `SiteFooter({ nav })`.

- [ ] **Step 1: Data module**

Create `gec-web/src/content/siteNav.ts`. Paste `NAV_ROUTES` and `MOBILE_NAV_ROUTES` (from `Navbar.tsx`) and `FOOTER_NAV_ROUTES`, `SOCIALS`, `PARTNERS` (from `SiteFooter.tsx`) verbatim as private constants, then:
```ts
export type NavLink = { href: string; label: string };
export type FooterSocial = (typeof SOCIALS)[number];
export type FooterPartner = { name: string; logo: string };
export type SiteNav = {
  routes: NavLink[];
  mobileRoutes: NavLink[];
  footerRoutes: NavLink[];
  socials: FooterSocial[];
  footerPartners: FooterPartner[];
};

export const SITE_NAV_FALLBACK: SiteNav = {
  routes: NAV_ROUTES,
  mobileRoutes: MOBILE_NAV_ROUTES,
  footerRoutes: FOOTER_NAV_ROUTES,
  socials: [...SOCIALS],
  footerPartners: PARTNERS,
};
```
Delete those five constants from the two components.

- [ ] **Step 2: Components take `nav`**

`Navbar.tsx` (client): `import type { SiteNav } from '@/content/siteNav';`; add `{ nav }: { nav: SiteNav }` to the exported component's props; `NAV_ROUTES.map(` → `nav.routes.map(`, `MOBILE_NAV_ROUTES.map(` → `nav.mobileRoutes.map(`.
`SiteFooter.tsx` (server): same import; `export function SiteFooter({ nav }: { nav: SiteNav }) {`; `FOOTER_NAV_ROUTES` → `nav.footerRoutes`, `SOCIALS` → `nav.socials`, `PARTNERS` → `nav.footerPartners`.

- [ ] **Step 3: Layout reads it**

`app/layout.tsx`: make `RootLayout` `async`, add
```ts
import { getSingleton } from '@/lib/content';
import { SITE_NAV_FALLBACK } from '@/content/siteNav';
```
at the top of the function `const nav = await getSingleton('site-nav', SITE_NAV_FALLBACK);`, and render `<Navbar nav={nav} />` and `<SiteFooter nav={nav} />`.

- [ ] **Step 4: Verify on every route**

Run: `cd gec-web && npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: five `✓` (nav and footer render on every route).

- [ ] **Step 5: Commit**

```bash
git add gec-web/src/content/siteNav.ts gec-web/src/components/Navbar.tsx gec-web/src/components/SiteFooter.tsx gec-web/src/app/layout.tsx
git commit -m "refactor(gec-web): navigation and footer via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Teams and Stage Manager (`team-stage`)

`TeamStageManager` already accepts `teams` (defaulting to `GEC_TEAMS`). `TeamFan` reads `GEC_TEAMS` at module level. Thread one `teams` prop from the pages.

**Files:**
- Create: `gec-web/src/content/teams.ts`
- Modify: `gec-web/src/components/teams/TeamFan.tsx`, `gec-web/src/components/teams/TeamStageManager.tsx`, `gec-web/src/components/home/StageAct.tsx`, `gec-web/src/app/page.tsx`, `gec-web/src/app/teams/page.tsx`

**Interfaces:**
- Consumes: `TeamStageData` from `@/lib/teamsData`.
- Produces: `TEAMS_FALLBACK: TeamStageData[]`; `TeamFan({ teams, initialTeamIndex })`; `StageRunway({ teams, initialTeamIndex })`; `StageAct({ teams })` (replaces `teamCount`; count = `teams.length`).

- [ ] **Step 1: Fallback module**

`gec-web/src/content/teams.ts`:
```ts
import { GEC_TEAMS, type TeamStageData } from '../lib/teamsData';

// Seed + fallback for the `team-stage` entity. teamsData.ts stays the source of the seed values.
export const TEAMS_FALLBACK: TeamStageData[] = GEC_TEAMS;
```

- [ ] **Step 2: TeamFan takes teams**

In `TeamFan.tsx`: remove `import { GEC_TEAMS } …` and the module-level `const ITEMS = GEC_TEAMS.map(…)`; add `import type { TeamStageData } from '@/lib/teamsData';` and `useMemo` to the React import; change to
```tsx
export function TeamFan({ teams, initialTeamIndex }: { teams: TeamStageData[]; initialTeamIndex?: number }) {
  const items = useMemo<BlindsItem[]>(() => teams.map((t) => ({ title: t.shortName, subtitle: t.roleTag, image: t.heroImage })), [teams]);
```
and replace remaining `GEC_TEAMS` with `teams` and `ITEMS` with `items`.

- [ ] **Step 3: TeamStageManager requires teams**

In `TeamStageManager.tsx`: make `teams` required in `TeamStageManagerProps` (`teams: TeamStageData[]`), remove the `= GEC_TEAMS` default, and change the import to `import type { TeamStageData } from '@/lib/teamsData';`. If any other code in the file uses `GEC_TEAMS`, replace it with `teams`.

- [ ] **Step 4: StageAct threads it**

In `StageAct.tsx`: add `import type { TeamStageData } from '@/lib/teamsData';` and
- `function StageManager({ progress, initialTeamIndex, teams }: { progress: MotionValue<number>; initialTeamIndex?: number; teams: TeamStageData[] })` → `<TeamStageManager showHero={false} initialTeamIndex={initialTeamIndex} teams={teams} />`
- `export function StageRunway({ initialTeamIndex, teams }: { initialTeamIndex?: number; teams: TeamStageData[] })` → pass `teams` to `<TeamFan …>` and `<StageManager …>`
- `export function StageAct({ teams }: { teams: TeamStageData[] })` → `count={teams.length}` and pass `teams` to its runway.

- [ ] **Step 5: Pages**

`app/page.tsx`: import `TEAMS_FALLBACK`; add `getList('team-stage', TEAMS_FALLBACK)` as `stageTeams`; render `<StageAct teams={stageTeams} />`. Remove `getTeams()` from the `Promise.all` only if nothing else uses `teams`.
`app/teams/page.tsx`: `import { getList } from '@/lib/content'; import { TEAMS_FALLBACK } from '@/content/teams';`; make the page `async` if it isn't; `const teams = await getList('team-stage', TEAMS_FALLBACK);` and `<StageRunway key={initialTeamIndex ?? 1} initialTeamIndex={initialTeamIndex} teams={teams} />`. If the page uses `GEC_TEAMS` to validate `?team=`, use `teams` instead.

- [ ] **Step 6: Verify**

Run: `cd gec-web && grep -rn "GEC_TEAMS" src | grep -v "lib/teamsData.ts\|content/teams.ts"; npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: grep prints nothing; five `✓`. Also open `/teams?team=3` at desktop and 390 px width and confirm the Stage Manager and TeamFan open on team 3.

- [ ] **Step 7: Commit**

```bash
git add gec-web/src/content/teams.ts gec-web/src/components/teams gec-web/src/components/home/StageAct.tsx gec-web/src/app/page.tsx gec-web/src/app/teams/page.tsx
git commit -m "refactor(gec-web): teams stage data via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Dispatch issues (`dispatch-issues`)

Used by `DispatchBin` (layout, every page), `DockedBin` (`/stories`), `NewsletterSection`, and `InitiativeShelf` (check which it reads).

**Files:**
- Create: `gec-web/src/content/dispatch.ts`
- Modify: `gec-web/src/components/dispatch-bin/DispatchBin.tsx`, `gec-web/src/components/NewsletterSection.tsx`, `gec-web/src/app/layout.tsx`, `gec-web/src/app/stories/page.tsx`, and any other file `grep -rn GEC_DISPATCH_ARCHIVE gec-web/src` lists

**Interfaces:**
- Consumes: `GecDispatchItem`, `GEC_DISPATCH_ARCHIVE` from `@/lib/dispatchData`.
- Produces: `DISPATCH_FALLBACK: GecDispatchItem[]`; `toBinIssues(items: GecDispatchItem[])` (the mapping currently inlined as `const ISSUES = GEC_DISPATCH_ARCHIVE.map(…)`); `DispatchBin({ issues })`, `DockedBin({ issues })`, `NewsletterSection({ items })`.

- [ ] **Step 1: Fallback module**

`gec-web/src/content/dispatch.ts`:
```ts
import { GEC_DISPATCH_ARCHIVE, type GecDispatchItem } from '../lib/dispatchData';

export const DISPATCH_FALLBACK: GecDispatchItem[] = GEC_DISPATCH_ARCHIVE;
```
Note: `dispatchData.ts` has a type-only `@/` import; that's fine for Next, and this module is never loaded by node checks.

- [ ] **Step 2: Turn the module-level ISSUES into a function**

In `DispatchBin.tsx`: replace `const ISSUES = GEC_DISPATCH_ARCHIVE.map((it) => { … });` with
```ts
export const toBinIssues = (items: GecDispatchItem[]) => items.map((it) => { /* …same body as before… */ });
```
change `import { GEC_DISPATCH_ARCHIVE, type GecDispatchItem }` to `import type { GecDispatchItem }`, and in each component that used `ISSUES` add a prop and memo:
```tsx
export function DispatchBin({ issues: items }: { issues: GecDispatchItem[] }) {
  const issues = useMemo(() => toBinIssues(items), [items]);
```
(add `useMemo` to the file's `react` import; then `issues` replaces `ISSUES` in the effect and its dependency list). Do the same for `DockedBin`. `OpenDispatchButton` doesn't read issues; leave it.

- [ ] **Step 3: NewsletterSection**

Change to `export function NewsletterSection({ items }: { items: GecDispatchItem[] }) {` and `items={items}`. Keep the `export { GEC_DISPATCH_ARCHIVE, type GecDispatchItem }` re-export line only if `grep -rn "from '@/components/NewsletterSection'" gec-web/src` shows someone importing it; otherwise remove it.

- [ ] **Step 4: Wire the readers**

`app/layout.tsx`: import `getList` (extend), `DISPATCH_FALLBACK`; in `RootLayout` fetch both with `const [nav, issues] = await Promise.all([getSingleton('site-nav', SITE_NAV_FALLBACK), getList('dispatch-issues', DISPATCH_FALLBACK)]);` and render `<DispatchBin issues={issues} />`.
`app/stories/page.tsx`: add `getList('dispatch-issues', DISPATCH_FALLBACK)` to its `Promise.all` as `issues`; render `<DockedBin issues={issues} />`. Pass `items={issues}` to `NewsletterSection` wherever it renders (grep for it).

- [ ] **Step 5: Verify**

Run: `cd gec-web && grep -rn "GEC_DISPATCH_ARCHIVE" src | grep -v "lib/dispatchData.ts\|content/dispatch.ts"; npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: grep prints nothing; five `✓`. In a browser, open the floating bin on `/` and the docked bin on `/stories#dispatch`: both list 6 issues, page turns work, unread badge count unchanged.

- [ ] **Step 6: Commit**

```bash
git add gec-web/src/content/dispatch.ts gec-web/src/components/dispatch-bin/DispatchBin.tsx gec-web/src/components/NewsletterSection.tsx gec-web/src/app/layout.tsx gec-web/src/app/stories/page.tsx
git commit -m "refactor(gec-web): dispatch issues via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Route heroes and final CTAs (`route-copy`)

The four route pages pass literal props to `RouteHero` and `FinalCta`. Move those props into one keyed document.

**Files:**
- Create: `gec-web/src/content/routeCopy.ts`
- Modify: `gec-web/src/app/about/page.tsx`, `gec-web/src/app/teams/page.tsx`, `gec-web/src/app/initiatives/page.tsx`, `gec-web/src/app/stories/page.tsx`

**Interfaces:**
- Consumes: the prop types of `RouteHero` and `FinalCta` (read `src/components/route/RouteHero.tsx` and `src/components/home/FinalCta.tsx`; import them as `ComponentProps<typeof RouteHero>` if they aren't exported).
- Produces: `RouteKey = 'about' | 'teams' | 'initiatives' | 'stories'`, `RouteCopy = Record<RouteKey, { hero: RouteHeroCopy; cta: FinalCtaCopy }>`, `ROUTE_COPY_FALLBACK`.

- [ ] **Step 1: Data module from today's props**

For each of the four pages, copy the literal props currently passed to `<RouteHero … />` and `<FinalCta … />` into `gec-web/src/content/routeCopy.ts`:
```ts
import type { ComponentProps } from 'react';
import type { RouteHero } from '../components/route/RouteHero';
import type { FinalCta } from '../components/home/FinalCta';

// Only serialisable props (strings, links, arrays of those). Anything else stays in the page.
export type RouteHeroCopy = Omit<ComponentProps<typeof RouteHero>, 'children'>;
export type FinalCtaCopy = ComponentProps<typeof FinalCta>;
export type RouteKey = 'about' | 'teams' | 'initiatives' | 'stories';
export type RouteCopy = Record<RouteKey, { hero: RouteHeroCopy; cta: FinalCtaCopy }>;

export const ROUTE_COPY_FALLBACK: RouteCopy = {
  about: { hero: { /* props from about/page.tsx RouteHero */ }, cta: { /* props from about/page.tsx FinalCta */ } },
  teams: { hero: { /* … */ }, cta: { /* … */ } },
  initiatives: { hero: { /* … */ }, cta: { /* … */ } },
  stories: { hero: { /* … */ }, cta: { /* … */ } },
};
```
Each `/* … */` is replaced by the exact literal props from that page (copy them; this is the data). If a prop is JSX or a function, leave it in the page and exclude it from the type with `Omit<…, 'thatProp'>`.

- [ ] **Step 2: Pages read it**

In each page:
```ts
import { getSingleton } from '@/lib/content';
import { ROUTE_COPY_FALLBACK } from '@/content/routeCopy';
// inside the (async) page component:
const { hero, cta } = (await getSingleton('route-copy', ROUTE_COPY_FALLBACK)).about; // .teams / .initiatives / .stories
```
and render `<RouteHero {...hero} />` (plus any non-serialisable props you left in the page) and `<FinalCta {...cta} />`.

Note: `pickSingleton` merges at the top level only, so a CMS doc missing a whole route key falls back for that route; a doc with a partial route object replaces it. The seed publishes the complete fallback, so this is safe.

- [ ] **Step 3: Verify**

Run: `cd gec-web && npx tsc --noEmit -p . && BASE=http://localhost:3211 node scripts/parity.mjs && BASE=http://localhost:3211 node scripts/smoke.mjs`
Expected: five `✓`; smoke shows only the pre-existing failures.

- [ ] **Step 4: Commit**

```bash
git add gec-web/src/content/routeCopy.ts gec-web/src/app/about/page.tsx gec-web/src/app/teams/page.tsx gec-web/src/app/initiatives/page.tsx gec-web/src/app/stories/page.tsx
git commit -m "refactor(gec-web): route hero and CTA copy via CMS reader with fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Export the fallbacks and seed the API

**Files:**
- Create: `gec-web/scripts/export-content.mts`
- Create: `api/database/seeds/site-content.json` (generated, committed)
- Create: `api/database/seed-site-content.ts`
- Create: `api/database/seed-site-content.spec.ts`
- Modify: `api/package.json` (script `seed:content`)
- Modify: `deployment.md` (one step in the release runbook)

**Interfaces:**
- Consumes: every `*_FALLBACK` from Tasks 4–13; `ContentService.listPublicContent(entityType)`, `createDraft(dto, actorId)`, `publish(id, idempotencyKey, actorId)` in `api/src/modules/content/content.service.ts`.
- Produces: `site-content.json` shaped `{ singletons: Record<string, object>; lists: Record<string, object[]> }`; `seedSiteContent(content: ContentService, seed: SeedFile, log?: (m: string) => void): Promise<{ created: string[]; skipped: string[] }>`; `npm run seed:content`.

- [ ] **Step 1: Export script**

`gec-web/scripts/export-content.mts`:
```ts
// Writes the site's fallback content to the API seed file.
// Run from gec-web/: npx tsx scripts/export-content.mts   (tsx resolves the @/ alias via tsconfig paths)
import { writeFileSync } from 'node:fs';
import { HERO_FALLBACK } from '@/content/hero';
import { HAPPENING_FALLBACK } from '@/content/happening';
import { IMPACT_FALLBACK } from '@/content/impact';
import { MILESTONES_FALLBACK } from '@/content/milestones';
import { SPEAKERS_FALLBACK } from '@/content/speakers';
import { PARTNERS_FALLBACK } from '@/content/partners';
import { SITE_NAV_FALLBACK } from '@/content/siteNav';
import { TEAMS_FALLBACK } from '@/content/teams';
import { DISPATCH_FALLBACK } from '@/content/dispatch';
import { ROUTE_COPY_FALLBACK } from '@/content/routeCopy';

const withOrder = <T extends object>(xs: T[]) => xs.map((x, i) => ({ ...x, order: i + 1 }));

const seed = {
  singletons: {
    hero: HERO_FALLBACK,
    happening: HAPPENING_FALLBACK,
    impact: IMPACT_FALLBACK,
    'site-nav': SITE_NAV_FALLBACK,
    'route-copy': ROUTE_COPY_FALLBACK,
  },
  lists: {
    milestones: withOrder(MILESTONES_FALLBACK),
    speakers: withOrder(SPEAKERS_FALLBACK),
    partners: withOrder(PARTNERS_FALLBACK),
    'team-stage': withOrder(TEAMS_FALLBACK),
    'dispatch-issues': withOrder(DISPATCH_FALLBACK),
  },
};

const out = new URL('../../api/database/seeds/site-content.json', import.meta.url);
writeFileSync(out, JSON.stringify(seed, null, 2) + '\n');
console.log('wrote', out.pathname);
```
Run: `cd gec-web && npx --yes tsx scripts/export-content.mts`
Expected: `wrote …/api/database/seeds/site-content.json`. If a fallback module imports a `.css` or client-only module, tsx fails; fix by keeping content modules pure data (move the offending import out).

Check: `node -e "const s=require('../api/database/seeds/site-content.json'); console.log(Object.keys(s.singletons), Object.fromEntries(Object.entries(s.lists).map(([k,v])=>[k,v.length])))"`
Expected: 5 singleton keys; list counts equal to today's arrays (teams 7, dispatch 6).

- [ ] **Step 2: Failing seed test**

`api/database/seed-site-content.spec.ts`:
```ts
import { seedSiteContent, SeedFile } from './seed-site-content';

const seed: SeedFile = {
  singletons: { hero: { campaigns: {} } },
  lists: { speakers: [{ name: 'A', order: 1 }, { name: 'B', order: 2 }] },
};

function fakeContent(published: Record<string, unknown[]> = {}) {
  let n = 0;
  return {
    listPublicContent: jest.fn(async (type: string) => published[type] ?? []),
    createDraft: jest.fn(async (dto: any) => ({ id: `d${++n}`, ...dto })),
    publish: jest.fn(async () => ({ success: true })),
  };
}

describe('seedSiteContent', () => {
  it('creates and publishes one doc per singleton and one per list item', async () => {
    const c = fakeContent();
    const r = await seedSiteContent(c as any, seed);
    expect(r.created).toEqual(['hero', 'speakers']);
    expect(c.createDraft).toHaveBeenCalledTimes(3);
    expect(c.createDraft).toHaveBeenCalledWith(
      { entityType: 'speakers', title: 'speakers 2', slug: 'speakers-2', data: { name: 'B', order: 2 } },
      'system-seed',
    );
    expect(c.publish).toHaveBeenCalledWith('d1', 'seed:hero:1', 'system-seed');
  });

  it('skips entity types that already have published content', async () => {
    const c = fakeContent({ hero: [{ id: 'x' }] });
    const r = await seedSiteContent(c as any, seed);
    expect(r.skipped).toEqual(['hero']);
    expect(r.created).toEqual(['speakers']);
  });
});
```
Run: `cd api && npx jest database/seed-site-content.spec.ts`
Expected: FAIL, cannot find module `./seed-site-content`. (If jest's `rootDir` excludes `database/`, run with `--rootDir .`; if it still won't pick it up, move both files to `api/src/database/seeds/` and adjust paths.)

- [ ] **Step 3: Implement the seed**

`api/database/seed-site-content.ts`:
```ts
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';

export type SeedFile = { singletons: Record<string, object>; lists: Record<string, object[]> };
type ContentLike = {
  listPublicContent(entityType: string): Promise<unknown[]>;
  createDraft(dto: { entityType: string; title: string; slug?: string; data: Record<string, any> }, actorId: string): Promise<{ id: string }>;
  publish(id: string, idempotencyKey: string | undefined, actorId: string): Promise<unknown>;
};

const ACTOR = 'system-seed';

/** Publishes the site's fallback content once. Entity types that already have published content are left alone. */
export async function seedSiteContent(content: ContentLike, seed: SeedFile, log: (m: string) => void = () => {}) {
  const created: string[] = [];
  const skipped: string[] = [];
  const docs: [string, object[]][] = [
    ...Object.entries(seed.singletons).map(([t, d]) => [t, [d]] as [string, object[]]),
    ...Object.entries(seed.lists),
  ];
  for (const [type, items] of docs) {
    if ((await content.listPublicContent(type)).length) {
      skipped.push(type);
      log(`skip ${type} (already published)`);
      continue;
    }
    for (const [i, data] of items.entries()) {
      const n = i + 1;
      const title = items.length === 1 && type in seed.singletons ? type : `${type} ${n}`;
      const slug = items.length === 1 && type in seed.singletons ? undefined : `${type}-${n}`;
      const draft = await content.createDraft({ entityType: type, title, ...(slug && { slug }), data: data as Record<string, any> }, ACTOR);
      await content.publish(draft.id, `seed:${type}:${n}`, ACTOR);
    }
    created.push(type);
    log(`seeded ${type} (${items.length})`);
  }
  return { created, skipped };
}

// CLI: node dist/database/seed-site-content.js
if (require.main === module) {
  (async () => {
    const { AppModule } = await import('../src/app.module');
    const { ContentService } = await import('../src/modules/content/content.service');
    const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
    const seed: SeedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../database/seeds/site-content.json'), 'utf8'));
    const r = await seedSiteContent(app.get(ContentService), seed, console.log);
    console.log(`done: ${r.created.length} created, ${r.skipped.length} skipped`);
    await app.close();
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
```
The test's `speakers 2` / `speakers-2` expectation matches this code: list items get `"<type> <n>"` titles and slugs; singletons get the type as title and no slug.

- [ ] **Step 4: Run the tests**

Run: `cd api && npx jest database/seed-site-content.spec.ts`
Expected: 2 passing.

- [ ] **Step 5: Script + runbook**

In `api/package.json` scripts add `"seed:content": "node dist/database/seed-site-content.js"`. Build and confirm the file lands where the script expects: `cd api && npm run build && ls dist/database/seed-site-content.js`. If the JSON path in the CLI block doesn't resolve from `dist/database/`, fix the `path.resolve` so it points at `api/database/seeds/site-content.json`.
In `deployment.md`, in the release runbook right after the migration step, add: "Run `npm run seed:content` in `api/` (safe to repeat: already-published content types are skipped)."

- [ ] **Step 6: Commit**

```bash
git add gec-web/scripts/export-content.mts api/database/seeds/site-content.json api/database/seed-site-content.ts api/database/seed-site-content.spec.ts api/package.json deployment.md
git commit -m "feat(api): seed site content from the site's fallbacks

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: End-to-end proof, docs, spec update

**Files:**
- Modify: `gec-web/AGENTS.md`, `gec-web/docs/seo.md` (nothing to change unless the content modules affect it; skip if not), `docs/superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md`

- [ ] **Step 1: Prove the API path with a local stack**

With a local API (Postgres + Mongo per `deployment.md`), run migrations, `npm run seed:content`, then start gec-web with `API_BASE_URL=http://localhost:<api-port>` and `REVALIDATION_HMAC_SECRET` matching the API.
Run: `cd gec-web && BASE=http://localhost:3211 node scripts/parity.mjs`
Expected: five `✓`: the site reads the same from the API as from fallbacks.

- [ ] **Step 2: Prove publish → revalidate**

Through the CMS API (`PUT /v1/cms/content/:id` then `POST …/publish`, see `cms-content.controller.ts`), change the `impact` doc's first metric `value` to `36+` and publish. Within a few seconds `/` shows `36+` without restarting gec-web (the outbox → `/api/revalidate` → tag `impact`). Publish it back to `35+`. Parity passes again.

- [ ] **Step 3: Document**

In `gec-web/AGENTS.md`:
- Map: add `src/content/   CMS entity fallbacks (pure data, one file per entity type); read through lib/content.ts getSingleton/getList`.
- Replace references to "`siteContent.ts` (hero campaigns)" and "`teamsData.ts`" with a note that they are now seed sources behind `src/content/hero.ts` / `src/content/teams.ts`.
- Components with sharp edges → Hero: "driven by the `hero` entity (fallback `src/content/hero.ts`)".

In the spec §15 Phase 0 line, replace the text with: "**De-hardcode** all §4 content except DeskFolio books into the API via the existing content pipeline (seeded from the site's constants, fallbacks kept), add `/api/revalidate` and the parity gate. Site must read identically. (Books → canvas JSON moves to Phase 3; `data-cms` tags to Phase 1; R2 moves happen per image field from Phase 1.)"

- [ ] **Step 4: Final gate**

Run: `cd gec-web && npx tsc --noEmit -p . && npm run check; BASE=http://localhost:3211 node scripts/smoke.mjs; BASE=http://localhost:3211 node scripts/parity.mjs; cd ../api && npx jest`
Expected: tsc clean; checks: only the 3 pre-existing design-lint problems; smoke: only pre-existing failures; parity: five `✓`; jest: all pass.

- [ ] **Step 5: Commit**

```bash
git add gec-web/AGENTS.md docs/superpowers/specs/2026-09-25-gec-cms-visual-editor-design.md
git commit -m "docs: CMS phase 0 complete; content map and phase scope

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Roadmap: later phases (each gets its own detailed plan before it starts)

| Phase | Deliverable | Key files / notes | Done when |
|---|---|---|---|
| **1. Live editor + versions** | Preview-token edit mode, iframe bridge, layers, inspector, inline text edit, RBAC locks, submit/approve/publish, version history (publish = version, draft snapshots ≤10 min, diff, restore → draft) | gec-web: `app/api/edit/route.ts` (draftMode + cookie), `lib/cms-edit/` overlay client, `data-cms` attributes via one `cmsAttr(path)` helper that renders only in draft mode; api: preview-token endpoint, `versions` collection, restore endpoint; cms: `app/(dashboard)/live/` | A Content Editor edits the hero headline on the live page, submits; Core Admin approves and publishes; site updates; the old headline restores from History |
| **2. Canvas** | Shared `<Canvas>` renderer (gec-web), canvas JSON validation (api), Canvas editor with `react-moveable` (cms), token-locked styles, undo/redo, phone safe area | first user: hero cards (`HeroContent.secondaryCards` → canvases) | Hero cards edited on a canvas render identically on desktop and phone |
| **3. Books** | Book + BookTemplate entities, 4 current books converted from JSX to canvas JSON, two-face preview, spine derivation + overrides, page editor with flip preview | `components/deskfolio/gecBooksData.tsx` becomes seed; `spine.check.ts` | DeskFolio renders all four books from the API identically; a new book from a template appears on the desk |
| **4. Scenes + Teams** | Desk, newsletter shelf, library (LibraryYear, saved years, walk order, `aisleRunway` grows per bay, phone year tabs), Teams workspace with roster + recruitment, Speakers/Milestones panels, Dispatch issue editor | `aislePlan.ts` + `aislePlan.check.ts` (saved years, empty years, overrides, fallback) | Adding year 2019 with two books shows a new bay with its hanging banner |
| **5. Plates + Gemini** | Plate builder (browser canvas, seeded grain for deterministic tests), copilot tools: image brief, draft issue/story, fit text, layout from text, subject lines, alt text | api `modules/copilot` tools; model from env | Image brief → upload → plate saved to Media with brief + params |
| **6. Dispatch email** | Everything in `docs/dispatch-email-service.md` with `EMAIL_DAILY_CAP=100` | `api/src/modules/email/` | A 250-subscriber test list finishes over 3 days with correct stats |
| **7. Phone CMS** | Bottom tabs, quick-edit forms, bottom-sheet editing in phone preview, approvals with diffs | cms responsive shell | An approval and a text edit done end-to-end on a 390 px phone |
