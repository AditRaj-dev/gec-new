<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GEC Web — agent guide

The website of the **Galgotias Entrepreneurship Cell (GEC)**. One Next.js app; this folder is the whole project.
Read this before changing anything. The Next.js block above still applies: Next 16 differs from your training data,
so check `node_modules/next/dist/docs/` before using a Next API (example: `error.tsx` receives `retry`, not `reset`).

## Where this code lives (don't get this wrong)

| | |
|---|---|
| Standalone repo | `github.com/AditRaj-dev/gec-new`, branch `main` (this app at the repo root) |
| Source of truth | the monorepo `github.com/AditRaj-dev/gec`, folder `gec-web/` |
| How gec-new is updated | from the monorepo: `git subtree split --prefix=gec-web -b gec-web-split` then `git push gec-new gec-web-split:main` |

- In the monorepo, work only inside `gec-web/`. The sibling folders (`gec-styled-next`, `gec-showcase`, `gec-portfolio*`,
  `wireframes-v2`, `backend`, `design-explorations`…) are other or older projects. **Never import from them.**
  `design-explorations/` holds throwaway HTML mockups and the newsletter-bin reference only.
- If you are working in a clone of `gec-new`, commit and push to `main` there; tell the owner so the monorepo can be synced.
- Never `git push --force` to `gec-new` `main`.

## Stack and commands

Next 16.3.5 (App Router, Turbopack) · React 19.2 · Tailwind 4 · `motion` for animation (no GSAP, no Lenis) · TypeScript strict, `allowJs`.

| Command | What |
|---|---|
| `npm run dev` | dev server on **3211** |
| `npm run build` / `npm start` | production build / serve on **3210** |
| `npm run check` | node assert checks (`src/lib/*.check.*`) + `scripts/design-lint.mjs` |
| `BASE=http://localhost:3211 node scripts/smoke.mjs` | every route → 200, required copy present, `data-surface` order matches `scripts/smoke.expect.mjs` |
| `npx tsc --noEmit -p .` | type-check (ESLint has no config file; `npm run lint` does not work) |
| `BASE=… node scripts/parity.mjs [--update]` | content parity gate (CMS Phase 0): visible text, links, images, surfaces per route. |

When you add, remove or reorder a section, **update `scripts/smoke.expect.mjs`** (copy and surface order) in the same change.

## Map

```
src/app/                 routes: / about teams initiatives stories stories/[slug] not-found error; layout.tsx mounts
                         BrandEntranceCurtain, Navbar, SiteFooter and DispatchBin once for every page;
                         api/revalidate (signed cache invalidation from the API outbox)
src/components/home/     home sections (Hero, Happening, Impact, Milestones, Speakers, Partners, FinalCta)
                         + the three acts: DeskAct (DeskFolio), ShelfAct (bookshelf), StageAct (teams Stage Manager)
src/components/route/    shared route-page pieces: RouteHero, ProgramForm, SubscribeForm, route.css (rt-* classes)
src/components/dispatch-bin/   floating newsletter bin + broadsheet reader (see below)
src/components/stories/  PortfolioGrid (+ portfolio.css), StoriesAisle
src/components/deskfolio/, ui/, teams/   ported showcase components (DeskFolio, bookshelf, Stage Manager)
src/components/          FullViewportAct, CurtainInterstitial, ShaderLayer, SiteFooter, Navbar, BrandMark
src/content/             CMS entity fallbacks (pure data, one file per entity type); read through lib/content.ts
                         getSingleton/getList
src/lib/                 api.ts (CMS fetch + frozen fallbacks in fallbackData.ts), content.ts + contentPick.ts
                         (getSingleton/getList over src/content/*), storyContent.ts, shaders/, motion.ts, act.ts.
                         siteContent.ts (hero campaigns) and teamsData.ts are now seed sources behind
                         src/content/hero.ts / src/content/teams.ts; dispatchData.ts likewise behind src/content/dispatch.ts
src/styles/gec.css       global design system (surfaces, type classes, buttons, cards, shader hosts)
src/app/globals.css      tokens (--gec-*), fonts, Tailwind import
docs/superpowers/        spec (specs/2026-09-23-gec-web-design.md) and plans (plans/*.md): read the relevant one first
public/                  logos (gec-full-logo.svg), partners/, stickers/, backgrounds/
```

Content pipeline: each CMS entity type doubles as its cache tag; the API's outbox signs a request to
`src/app/api/revalidate/route.ts`, which calls `revalidateTag(tag, { expire: 0 })`. `scripts/export-content.mts`
writes the fallbacks to `api/src/database/seeds/site-content.json`; `npm run seed:content` (in `api/`) loads them.

## Design rules (enforced by review, some by `design-lint`)

- Fonts: **Cabinet Grotesk** (display), **Manrope** (body), **JetBrains Mono** (mono). The Dispatch reader alone also uses
  UnifrakturMaguntia / Playfair Display / Old Standard TT (loaded in `layout.tsx` with `preload: false`). No Inter, Clash, Satoshi.
- Colours come from tokens in `globals.css` (`--gec-crimson #A3040F`, `--gec-gold`, `--gec-blue`, `--gec-ink #222222`, `--gec-canvas`, `--gec-surface-sand`).
  No pure black (`#000`), no gradient text, no thick `border-left` accent stripes.
- Every page section carries `data-surface="cream|sand|crimson|charcoal"` and uses a `surface-*` class; alternate surfaces.
- Type classes: `.editorial-kicker`, `.h1-display`, `.h2-section`, `.h3-card`, `.body-editorial`; buttons `.gec-btn .btn-crimson|.btn-outline-ink`; cards `.brand-card`.
- Animate `transform` and `opacity` only. Every animation needs a `prefers-reduced-motion` path.
- Mobile floor < 769px: one column, no pinned runways. Shaders run in phone mode (see Shaders). The desk, the Stage Manager and the
  stories aisle are swapped for phone recompositions (`InitiativeShelf`, `TeamFan`, `StoriesFrontPages`); curtains are skipped.

### ⚠ Tailwind spacing utilities do nothing

`src/styles/gec.css` starts with an **unlayered** `* { margin: 0; padding: 0 }`, which beats Tailwind's layered utilities.
So `p-*`, `px-*`, `m-*`, `mt-*`… compute to 0. Write spacing in plain CSS classes (see `route.css`, `portfolio.css`).
Moving that reset into `@layer base` is the real fix, but it shifts older components (Stage Manager, DeskFolio) that were
tuned around the bug — do it only as its own change with before/after screenshots of every route.

## Shaders

`<ShaderLayer family="…" />` as the first child of a section with class `gec-shader-host`. Hand-written WebGL1 in
`src/lib/shaders/programs.ts`; `renderer.ts` + `policy.ts` enforce half-res, 30fps, viewport-only, frame-time guard,
reduced-motion freeze, CSS fallback on any failure. Phones (≤768px) run at 0.35×DPR capped at 480px wide and 24fps,
create their context only when the section nears the screen, and freeze to a still frame on Save-Data or <4GB devices.
The print masks switch to a phone form there (hero ink in the top-right corner, a narrow edge ellipse elsewhere, no gutters).

| Family | Where |
|---|---|
| `watercolor` | home hero only |
| `liquid` / `specular` | home crimson / charcoal sections |
| `wash` | Stage Manager |
| `contour` | every `RouteHero` (masked to the empty right side + gutters), 404 |
| `halftone` | sand sections on route pages |
| `hatch` | cream mid-page sections on route pages |
| `riso` | `FinalCta` on route pages (`shader="riso"`) |
| `night` | site footer |

The print families (`contour halftone hatch riso night`) paint the surface colour themselves (palette `uC0`) and run at
full canvas opacity; masks keep ink off the copy (`RIGHT`, `EDGES`, and a `gutter` term for the space outside the 1320px column).

## Components with sharp edges

- **DispatchBin** (`src/components/dispatch-bin/`): the newsletter. Locked design ported from
  `design-explorations/newsletter-dispatch.html`. `assets.js` (SVG generators) and `controller.js` (drag, snap,
  dialog, page turns, read state in `localStorage['gec-nl-read']`) are plain-JS ports of the reference — keep them faithful.
  CSS is scoped under `.bin` / `.nl`. Every generated SVG goes through `scopeIds()` (no duplicate ids).
  `DockedBin` renders a still, inline twin (used on `/stories#dispatch`); the floating bin hides while a docked twin is
  on screen and while any full-viewport act is live (`html[data-gec-act="live"]`). Data: `src/lib/dispatchData.ts`.
- **FullViewportAct**: pinned scroll runway; children are a render function receiving scroll progress. Use
  `DeskRunway` / `StageRunway` (exported from `DeskAct.tsx` / `StageAct.tsx`) on route pages.
- **Hero** (`home/Hero.tsx`): campaign billboard driven by the `home-hero` entity (renamed from `hero` to avoid
  colliding with the API's Hero Spotlight module, which already owns the `hero` entity type) (fallback `src/content/hero.ts`,
  formerly `HERO_CAMPAIGNS` in `siteContent.ts`), including the featured "ticket" card (`card` field). All campaigns
  are stacked invisibly as sizers so the card never changes height.
- **FinalCta**: defaults are the home copy; route pages pass `kicker/heading/lede/primary/secondary/shader`.
- Forms submit through `submitForm()` in `lib/api.ts`. The API base URL comes from env; without it submissions fail
  closed with a friendly message.

## Known open issues (as of 24 Sep 2026)

- `design-lint`: `stories/aisleTextures.ts` uses `#000`; `route.css` `.rt-pull` uses a 3px `border-left`.
- Smoke: `/` expects the text `WADHWANI` (Partners now shows logo images); `/initiatives` and `/stories` gained sections
  that `smoke.expect.mjs` does not list yet.
- `#apply` links (home hero, programmes) have no target unless the page renders an `id="apply"` form.
- Backend has not confirmed `formType: 'newsletter'` with an empty `fullName` for Dispatch sign-ups.
- Draft copy marked `ponytail:` in `initiatives/page.tsx` (problem statements, E-Summit schedule) must be replaced with official content.
