# GEC Styled Next — Redesign Spec

**Date:** 2026-09-23
**Status:** Approved design, pending implementation plan
**Scope:** `gec-styled-next/`

---

## 1. Problem

The site renders as a wireframe because two of its five pages literally are one. `/` and `/about` mount `StyledPageFrame`, an `<iframe>` pointing at `public/styled.html` — a 5,179-line static wireframe. No React, no data, no motion.

Three further problems compound it:

1. **No design language.** The wireframe's geometry survived the React port; nothing was layered on top. Flat cream surfaces, 1px crimson outlines, one sans at `font-black`, fixed pixel type. Boxes with borders.
2. **The Stage Manager is caged.** Its CSS is fluid, but `app/teams/page.tsx` wraps it in `max-w-7xl mx-auto px-4 py-8`, and detail mode caps sidebar cards at `max-width: 320px`. It reads as a widget in a content column, not a stage.
3. **The interactive components are siloed.** DeskFolio, the Newsletter Bookshelf and the Stage Manager each live on a separate route. Nobody scrolling the site encounters them in sequence.

Duplicate routes compound the mess: `/initiatives` and `/archives` both render `DeskFolioPage`; `/stories` and `/newsletter` both render the bookshelf.

## 2. Goal

Turn the wireframe into a designed, living site: a homepage that is a scroll journey handing over one "wow" per act, four deep routes that deliver each wow in full, and a design language strong enough that `/about` holds attention with no wow at all.

---

## 3. Route map

Five routes. `/archives` and `/newsletter` are removed and redirected.

| Route | Content |
|---|---|
| `/` | Six-act scroll journey. Teases every wow, owns none. |
| `/about` | Story, manifesto, pillars, stakeholders. Text-led; carries no wow. |
| `/initiatives` | Full DeskFolio. Every programme as a desk artifact. |
| `/stories` | Full bookshelf + reader + startup portfolio grid with sector filters. Absorbs the newsletter section. |
| `/teams` | Full Stage Manager, seven teams, detail mode, roster. |

Redirects in `next.config.ts`: `/archives` → `/initiatives`, `/newsletter` → `/stories#dispatch`.

---

## 4. Design language

Six layers, defined as tokens in `app/globals.css` (`@theme`) and `lib/motion.ts`.

### 4.1 Typography

Self-hosted `.woff2` in `public/fonts`, `font-display: swap`, metric-matched fallbacks, preload Satoshi 400 only.

| Role | Family | Use |
|---|---|---|
| Display | Clash Display 600/700 | Headlines, act titles, CTAs |
| Body | Satoshi 400/500/700 | Prose, UI |
| Mono | Fragment Mono 400 | Blueprint stamps, kickers, coordinates |

Fluid `clamp()` scale for headings, ≥1.25 ratio between steps, `clamp()` max ≤ 6rem. Body text fixed at 1rem+. Display letter-spacing floor −0.04em. Measure capped 65–75ch. `text-wrap: balance` on h1–h3, `pretty` on prose.

Clash Display is not on Google Fonts; self-hosting avoids a third-party runtime dependency on Fontshare's CDN.

### 4.2 Elevation

Four rungs — flush / raised / lifted / floating — as layered shadows tinted warm (brown-crimson). Gray shadows on a cream surface read as dirt. Borders are not depth.

### 4.3 Texture

Fine grain overlay on canvas surfaces; printed-ink edge on crimson. Ties the flat page to DeskFolio's tactile stationery world.

### 4.4 Surface rhythm

Acts alternate cream / sand. Crimson is punctuation and never appears in two consecutive acts. The curtain interstitials are crimson, which supplies the loud beat — so Act II stays sand rather than competing with them.

### 4.5 Motion tokens

```
instant  120ms   press feedback, hover
ui       180ms   pill swaps, filters, toggles
layout   320ms   shared-element, card → detail
act      480ms   act-level entrances
stagger   40ms   per item in a list
exit     ×0.65   exits always faster than entrances
```

Easing: `ease-out-quart` for entrances; spring for anything interruptible. No bounce, no elastic, no `linear`.

### 4.6 Blueprint detail layer

The project already invented this (`section-id-stamp`, `section-coord-stamp`, `PAGE 03: TEAMS`) and used it once. It becomes a deliberate, named system: coordinate stamps on acts that warrant them, registration marks at surface corners, tick marks on hairline rules.

Applied **sparingly and deliberately** — a stamp above every section is the AI-eyebrow anti-pattern, not a design system.

### 4.7 Banned

Carried from the brand register, and all three were present in early mockups:

- **Side-stripe borders** — no `border-left` > 1px as a colored accent.
- **Numbered section scaffolding** — no `01 · / 02 · / 03 ·` above sections that are not a genuine sequence.
- **Tiny uppercase tracked eyebrow above every heading.**
- Gradient text, decorative glassmorphism, the hero-metric template, identical card grids, text that overflows its container.

The editorial-typographic lane (display serif + mono labels + ruled separators + monochrome restraint) is explicitly rejected; it is the saturated default, not a choice.

---

## 5. Homepage: six acts

| # | Act | Surface | Content | Dominant motion | Exit |
|---|---|---|---|---|---|
| I | The Opening | cream | Full viewport. Campaign switcher from `HERO_CAMPAIGNS` — each pill swaps headline, deadline badge, featured card. Entrance curtain docks its logo into the navbar as this act settles. | Orchestrated page-load, one sequence. Pill swap = crossfade + slide, interruptible. | → `/initiatives` |
| II | The Count | sand | Running marquee of live figures: cohorts, ventures, teams, events. | Infinite marquee at constant velocity; numbers count up once on entry. | none — punctuation |
| III | The Desk | cream | DeskFolio teaser. Enters small, scales into the viewport; one artifact lifts off the mat. | Scroll-linked scale + parallax. | → `/initiatives` |
| IV | The Shelf | sand | Bookshelf teaser. Vertical page scroll drives horizontal shelf travel; one cover flips at the end of the run. | Scroll-driven horizontal travel. | → `/stories` |
| V | The Stage | cream, full-bleed | Stage Manager at 100dvh, edge to edge. Cards peel in from off-canvas and settle. | Staggered peel-in 40ms apart; shared-element card → detail. | → `/teams` |
| VI | The Close | sand | One primary action (apply); dispatch subscribe as quiet second; footer carries real detail. | None beyond form states. The page stops moving when it asks for something. | — |

**One dominant motion idea per act.** Layering a second effect onto any act is how this becomes noise.

---

## 6. Curtain system

### 6.1 Primitive

One `<Curtain effect="…">` component. The two-panel mechanic is extracted from `BrandEntranceCurtain` into `components/curtain/panels.tsx` and shared by all three consumers. Effects are CSS variants, not components.

Effects implemented: `doors` (vertical/horizontal), `wipe` (angled), `iris`, `blinds`, `staggerWipe`. Reimplemented from documented behavior in transform/clip-path math — no `motion-plus` dependency.

### 6.2 Three consumers

1. **Entrance curtain** — `doors-vertical`. Existing behavior preserved: G/E/C build, filament flash, shimmer beam, FLIP dock into navbar.
2. **Scroll interstitials** — three, before Acts III, IV and V.
3. **Route transitions** — `wipe`, via the native View Transitions API. Unsupported browsers get instant navigation.

### 6.3 Scroll interstitials

Driven entirely by scroll position, never by a timer. Panels close as the user scrolls in, the line lands at full closure, panels part as they continue. Scrolling back reverses it. **Input is never blocked and nothing is ever timed-hold.**

Progress mapping across the interstitial's scroll range:

```
0.00 → 0.42   panels close
0.42 → 0.58   held shut, line at full opacity
0.58 → 1.00   panels part
```

Copy: **headline static, kicker live.** The count is derived from the same array that renders the act, so it can never disagree with the page.

| Before | Effect | Headline | Kicker | Source |
|---|---|---|---|---|
| Act III | `wipe` (11°) | *Every programme, one living desk.* | `N PROGRAMMES` | `initiatives.length` |
| Act IV | `wipe` (11°) | *Every issue we ever sent.* | `N DISPATCHES` | `dispatches.length` |
| Act V | `doors-horizontal` | *The people behind all of it.* | `N TEAMS` | `teams.length` |

`doors-horizontal` appears once, in front of the act literally called the Stage. Everywhere else the signature is `wipe`.

Kicker falls back to `NEXT` when the count is 0 or the fetch failed — never `0 PROGRAMMES`.

**Known ceiling:** each interstitial costs roughly 1.5 screens of scroll distance; three add ~4.5 screens to the homepage. This is the accepted trade for the ceremony and the reason there are three rather than five.

### 6.4 Red seam fix

`BrandEntranceCurtain.tsx` lines ~540 and ~550 give the top panel `border-b` and the bottom panel `border-t`, both `rgba(163,4,15,.14)`. They meet at the vertical midpoint, producing a 2px crimson line across the middle of the screen for the entire intro, bisecting the logo.

Fix: the seam exists only while the panels are travelling — invisible at rest, fades in during the part, gone once open. A seam that reveals the split is motion doing work; a static line across a hero moment is a defect.

---

## 7. Motion rules (correctness, not taste)

1. **Reveals enhance an already-visible default.** Content is never gated on a scroll trigger. Transitions pause on hidden tabs and never fire in headless renderers; gating visibility ships blank sections to crawlers.
2. **Transform and opacity only.** No animating width, height, top, left.
3. **Everything interruptible.** Scroll-driven acts reverse on scroll-up.
4. **`prefers-reduced-motion` is a branch, not a disable.** Curtains → static crimson bands with the same copy. Desk → no scroll-scale. Shelf → plain cover grid. Stage → cards appear without the peel. Every act still reads; only travel is lost.

**Driver:** `motion`'s `useScroll` / `useTransform` — already installed, already used in 6 files. No GSAP, no ScrollTrigger, no Lenis.

---

## 8. File plan

### New

| File | Purpose |
|---|---|
| `components/acts/ActOpening.tsx` … `ActClose.tsx` | Six act components, one file each, each owning its own motion. |
| `components/CurtainInterstitial.tsx` | Scroll-driven curtain. Props: `headline`, `count`, `label`, `effect`. |
| `components/curtain/panels.tsx` | Shared two-panel mechanic. |
| `lib/siteContent.ts` | Copied from `gec-showcase` — `HERO_CAMPAIGNS` et al. Missing here; it is the hero cockpit's content. |
| `lib/motion.ts` | Motion tokens + reduced-motion switch. |
| `app/error.tsx`, `app/not-found.tsx` | Currently absent. |
| `public/fonts/*.woff2` | Clash Display, Satoshi, Fragment Mono. |

### Changed

- `app/page.tsx` — 9-line iframe wrapper → act composition (server component, fetches and passes props down)
- `app/about/page.tsx` — real React, ported from `styled.html#page-about`
- `app/stories/page.tsx` — absorbs `NewsletterSection` and the portfolio grid with sector filters
- `app/teams/page.tsx` — drop the `max-w-7xl` cage, full-bleed
- `components/teams/stage-manager.css` — lift the `max-width: 320px` sidebar cap
- `components/BrandEntranceCurtain.tsx` — seam fix, adopt shared panels
- `app/globals.css` — new token system; delete the unused shadcn alias block
- `package.json` — `"start"` currently runs `next dev`; fix to `next start`
- `next.config.ts` — redirects

### Deleted

- `components/StyledPageFrame.tsx` — the iframe
- `components/StageManager.tsx`, `components/TeamStageManager.tsx` — dead re-export shims, zero importers
- `app/archives/page.tsx`, `app/newsletter/page.tsx` — duplicate routes
- Dependencies imported nowhere: `three`, `@react-three/fiber`, `@types/three`, `@base-ui/react`, `lucide-react`, `class-variance-authority`, `cn`, `shadcn`, `tw-animate-css`

  (The "3D WebGL bookshelf" is CSS 3D + `motion`, not three.js. `flubber`, `motion` and `web-haptics` are genuinely used and stay.)

### Moved

- `public/styled.html` → `docs/wireframe-original.html` — the original design record, out of the served bundle. Content is ported before it moves.

**Net: roughly −5,400 lines and 9 dependencies before a single feature lands.**

---

## 9. Build order

1. Tokens + fonts + `lib/motion.ts` + `lib/siteContent.ts`; curtain seam fix.
2. Curtain primitive (`panels.tsx`, effects, `CurtainInterstitial`).
3. `/` built completely — all six acts, three interstitials, full craft pass. **This page is the reference implementation.**
4. Extract what proved out into shared primitives.
5. Roll the remaining four routes onto those primitives.
6. Route transitions via View Transitions API.
7. Cleanup: delete dead files and dependencies, move the wireframe, add redirects.

Step 3 is the front-loaded push. Steps 5 onward go quickly because the hard decisions are already made.

---

## 10. Data flow

`lib/api.ts` is already correct — tagged fetches with typed frozen fallbacks, never throws. Unchanged.

What changes is *where*: `page.tsx` remains a **server component** and fetches; act components are client components (they need scroll) and receive data as props. No `useEffect` fetching.

Curtain counts derive from the same arrays that render their acts.

---

## 11. Failure modes

| Failure | Degrades to |
|---|---|
| CMS unreachable / no `API_BASE_URL` | Fallback data; site renders complete |
| Empty collection | Kicker reads `NEXT`, never `0 DISPATCHES` |
| JS disabled / crawler / headless | All content visible; motion is purely additive |
| View Transitions unsupported | Instant navigation |
| `prefers-reduced-motion` | Static crimson bands; every act still reads |
| Slow web font | `swap` + metric-matched fallback; text visible immediately |

---

## 12. Verification

**Scope: desktop and tablet only.** Mobile content requires its own restructuring pass and is explicitly deferred to a separate effort.

Below 768px there is a documented holding pattern, not a hole: single column, no scroll set-pieces, curtains fall back to static bands, content correct and readable. The existing mobile branches (`DeskFolioMobile.tsx`, the `max-width: 900px` blocks in `stage-manager.css`) continue to work — they are simply not redesigned or verified in this effort.

**Gates:**

- `next build` passes — the real gate; catches the type and SSR errors that `dynamic(ssr: false)` code actually hits
- One runnable assert-based check for the two pieces of non-trivial pure logic: scroll-progress mapping and count-fallback. No test framework is added for a marketing site.
- Manual pass at **768** and **1440**
- `prefers-reduced-motion` enabled — every act still reads
- JS disabled — all content present
- CLS check on the two `dynamic(ssr: false)` wows; both need reserved height or they shove the page on load
- Contrast: body ≥4.5:1, large text ≥3:1, including muted text on cream and on crimson

---

## 13. Decisions taken

| Decision | Choice | Rationale |
|---|---|---|
| Wireframe | Blueprint, not trash | It is the user's own design; port its structure |
| Routes | Five | Matches the wireframe; kills two duplicate pairs |
| Scroll journey | Homepage owns it | Each wow exists at two fidelities: teaser on `/`, full on its route |
| Approach | Reference implementation (build `/` first, extract, roll out) | Validates the language against real content; avoids five dialects |
| Typography | Clash Display + Satoshi + Fragment Mono | User's choice. Differentiation is spent on layout, color and motion instead |
| Interstitials | Three, scroll-driven | Before reveals only; five is tedium |
| Curtain copy | Static headline, live kicker | Content is dynamic; counts must never go stale |
| Effects | `wipe` as signature, `doors` where it means something | Variety with a reason, not per-section novelty |
| Route transitions | Yes, native View Transitions API | Makes five routes feel like one site; clean fallback |
| Motion library | `motion` only | Already installed and used; nothing new enters the bundle |
| Mobile | Deferred, with a correctness floor | Needs its own content restructuring |
| `styled.html` | Moved to `docs/` | Design record, costs nothing outside `public/` |

---

## 14. Known risks

1. **Mobile is the largest audience segment for a campus E-Cell** and is deferred. Accepted deliberately; the floor keeps it correct, not designed.
2. **`/about` carries no wow.** It is the route most likely to regress to bland and must hold attention on typography and layout alone.
3. **Three interstitials add ~4.5 screens of scroll** to the homepage.
4. **Clash Display + Satoshi is a familiar pairing.** Differentiation must come from layout, color commitment and motion.
