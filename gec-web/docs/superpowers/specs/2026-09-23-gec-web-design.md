# GEC Web: Design Spec

**Date:** 2026-09-23
**Status:** Approved flow. Implementation plan: `docs/superpowers/plans/2026-09-23-gec-web.md`
**Scope:** `gec-web/`, desktop and tablet (≥769px). Mobile is a separate, later flow round.
**Approved flow (source of truth for home order):** `docs/design/home-flow.html`, published at https://claude.ai/artifact/H37p31WpQWioEwSjbtj9LE (v7)

---

## 1. Authority

Everything here is derived from frozen material. Nothing is invented. Where two sources disagree, the higher row wins.

| Rank | Source | Governs |
|---|---|---|
| 1 | The user's decisions in §9 | Overrides everything below |
| 2 | `docs/design/home-flow.html` (v7) | Home section order, acts, curtains, runway lengths |
| 3 | `E:\GEC\wireframes-v2\styled.html` inside `#gec-canvas-root` | Markup, copy, classes, surfaces for all five pages |
| 4 | `E:\GEC\wireframes-v2\DESIGN.md` | Tokens, type scale, grid, anti-patterns |
| 5 | `E:\GEC\docs\GEC_Texture_Typography_Shader_Design_Spec.md` | Texture, shader families, strengths, fallbacks |
| 6 | `E:\GEC\docs\GEC_Website_Complete_Content_Frozen.md` | Copy, where the wireframe has none |

The wireframe harness is **not** design and is never ported: `#cockpit-header`, `#inspector-drawer`, `#wf-modal-*`, `#wf-toast-container`, `#canvas-stage`, `.canvas-frame` chrome, `.canvas-status-ribbon`, `.blueprint-grid-overlay`, `.viewport-*` simulator classes, the `hero-spotlight-cockpit` "LIVE CAMPAIGN STAGE" switcher bar and its "CMS Telemetry" button.

## 2. Design language

### 2.1 Tokens
Copied verbatim from `styled.html` `:root` (lines 14–97) into `src/app/globals.css`. Values listed in `docs/design/HANDOFF.md` §"Real token values". `--gec-ink` is `#222222` (the old build used `#1A1A1A`; that is wrong).

### 2.2 Type
- Display: **Cabinet Grotesk** 700/800/900, loaded from Fontshare's CSS API (`https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&display=swap`). Fontshare fonts are free for commercial use. Fallback: Archivo via `next/font/google`.
- Body: **Manrope** 400–800 via `next/font/google`.
- Mono: **JetBrains Mono** 400–700 via `next/font/google`.
- Clash Display, Satoshi, Fragment Mono and their `.woff2` files are deleted. Inter and generic serifs are banned.
- Classes `.h1-display`, `.h2-section`, `.h3-card`, `.body-editorial`, `.editorial-kicker` keep the wireframe's CSS, with the texture spec's §13–15 refinements (h1 `-0.045em / 0.98 / 900`, h2 `-0.035em / 1.05`, body `1.68 / -0.006em`).

### 2.3 Grid
12 columns, 24px gutters, 48px side margins, container 1320px, canvas 1440px. Section padding `clamp(60px, 8vw, 100px) 48px`. These come from the wireframe's own `.wf-section` and grid classes, which are ported as-is.

### 2.4 Surfaces
Four surfaces: `surface-cream`, `surface-sand`, `surface-crimson`, `surface-charcoal`, with their `::before` lighting from `styled.html` lines 356–430. Every section carries `data-surface="<name>"` so tests can read the rhythm.

### 2.5 Texture (static, CSS)
One global paper grain: a fixed `body::after` using the wireframe's SVG-turbulence data URI at `--texture-grain-global` (0.028), `mix-blend-mode: multiply`, `pointer-events: none`. Sand adds fibre at `--texture-grain-sand`. No per-component textures.

### 2.6 Shaders (hand-written WebGL)
Shaders.com is not used: its licence requires a paid Pro/Team plan for any public deployment, and it is WebGPU-only.

Our own WebGL1 renderer, one small fragment program per family, tuned for low-end desktops:

| Family | Surface | Strength token | Palette |
|---|---|---|---|
| `watercolor` | hero (cream) | `--shader-hero` .26 | `#FCF8ED #A3040F #C62F29 #FBCA05` |
| `liquid` | crimson sections | `--shader-feature` .34 | `#72030A #A3040F #C62F29` |
| `specular` | impact (charcoal) | `--shader-light` .18 | `#18191C #222222 #A3040F #FBCA05` |

Cream and sand sections, the footer, curtains and all three full-viewport acts use **CSS texture only**.

Low-end rules, all mandatory:
- Render at a reduced internal resolution: `min(1, 0.5 × devicePixelRatio)` scale, capped at 1280px wide. These shaders are soft, so the upscale is invisible.
- Cap at 30fps.
- Run only while the section is within 300px of the viewport (`IntersectionObserver`), and never while `document.hidden`.
- **Frame-time guard:** average the first 45 frames. Above 28ms means the device can't keep up, so draw one frame and freeze.
- `prefers-reduced-motion`: draw one frame and freeze.
- Below 769px: no canvas at all.
- No WebGL, a compile failure, or a lost context: remove the canvas and let the CSS fallback show.
- Every shader host has a finished CSS fallback background (texture spec §41) that is visible before the canvas paints. The canvas only fades in over it.
- Canvases are `position:absolute; inset:0; z-index:-2; pointer-events:none` inside an `isolation:isolate` host (texture spec §18, §37).

### 2.7 Motion
`--ease-spring cubic-bezier(0.16,1,0.3,1)`, micro 180ms, macro 320ms, act 480ms. Transform and opacity only. Driver: `motion` (`useScroll`/`useTransform`). No GSAP, no Lenis.

## 3. Home (desktop + tablet)

Order is exactly the flow (v7). Rows 01–13:

| # | Section | Surface | Act | Runway | Shader |
|---|---|---|---|---|---|
| 00 | Brand entrance (timed overlay, once per session) | cream | Prelude | 0 | none |
| 01 | Hero + campaign switcher | cream | I Opening | 1.0 | watercolor |
| 02 | What's happening bento 6/3/3/12 | crimson | | 1.2 | liquid |
| c1 | Curtain `wipe`: "Every programme, one living desk." · N PROGRAMMES | crimson | | 1.2 | CSS |
| 03 | Initiatives: **DeskFolio full viewport** | cream | III Desk | 2.4 | CSS |
| 04 | Impact, 4 counters count up | charcoal | II Count | 0.9 | specular |
| 05 | Milestones | sand | | 0.9 | CSS |
| c2 | Curtain `wipe`: "Every story that started here." · N STORIES | crimson | | 1.2 | CSS |
| 06 | Stories: **Bookshelf full viewport** (holds stories) | cream | IV Shelf | 3.2 | CSS |
| 07 | Speakers | crimson | | 1.0 | liquid |
| c3 | Curtain `doors-h`: "The people behind all of it." · N TEAMS | crimson | | 1.2 | CSS |
| 08 | Teams: **Stage Manager full viewport** | sand | V Stage | 2.4 | CSS |
| 09 | Partners | cream | | 0.8 | CSS |
| 10 | Final CTA | crimson | VI Close | 0.8 | liquid |
| 11 | Footer | charcoal | | 0.6 | CSS |

Rows 03, 06 and 08 keep the wireframe section's own heading and intro copy above the act. The act follows, then the section's exit link.

## 4. Full-viewport acts

One wrapper, `FullViewportAct`, used by all three.

```
<section data-surface  style="height: runway × 100dvh">       scroll runway
  <div sticky top:0 height:100dvh overflow:hidden>
    <Component/>                  laid out at full viewport size from mount; never resized or scaled
    <div class="fva-hole"/>       rounded window; box-shadow 0 0 0 100vmax <surface colour>
  </div>
</section>
```

- **Phases** over the runway's scroll progress `p` (`useScroll`, offset `['start start','end end']`):
  - expand `0 → 0.22`: hole scales `0.82 → 1`, radius `20px → 0`
  - hole fades out `0.18 → 0.22`
  - live `0.22 → 1`
- Only `transform` and `opacity` animate. There is no `clip-path`, because a scroll-driven clip repaints every frame.
- The component has `pointer-events:none` until `p ≥ 0.22`.
- While any act is live, `<html data-gec-act="live">` is set, and the navbar translates up out of view. It returns when the act releases.
- A "Skip past …" link before each act targets the element after it.
- Components load through `next/dynamic` with `ssr:false`. The placeholder reserves the full sticky frame, so there is no layout shift. They mount when the runway is within one viewport.
- Reduced motion: no hole and no phases. The component renders full size immediately, and the runway collapses to `100dvh`.
- **Shelf only:** during `p ∈ [0.3, 0.92]`, `[data-gec-shelf-row]` translates on X by `-(scrollWidth − clientWidth) × segment(p)`. Under reduced motion the row becomes `overflow-x:auto` instead.
- **Stage only:** its own `position:sticky; height:100vh` is removed from `stage-manager.css`, because the wrapper pins it.

Component sources, all copied from `E:\GEC\gec-showcase` (not the gec-styled-next copies):

| Act | Files |
|---|---|
| Desk | `components/deskfolio/*` |
| Shelf | `components/ui/newsletter-bookshelf.tsx`, `newsletter-reader.tsx`, plus `NewsletterSection.tsx` for /stories |
| Stage | `components/teams/TeamStageManager.tsx`, `stage-manager.css` |

Two hooks carry over from gec-styled-next onto the showcase shelf: the `data-gec-shelf-row` attribute, and the docked-shadow class fix (the two shadow classes are made mutually exclusive). `lib/` is identical in both projects. gec-web keeps its dependency-free `cn` in `lib/utils.ts`.

Stories on the shelf: `storyToBook(story: Story): NewsletterBookshelfItem` maps `FALLBACK_STORIES` / `getStories()` onto shelf items.

## 5. Other routes

Each route is the wireframe page with the wow inserted as a `FullViewportAct` where it belongs:

| Route | Composition |
|---|---|
| `/about` | Wireframe `#page-about` as is. No act. |
| `/teams` | Wireframe hero, then **Stage Manager act** replacing the wireframe's `#teams-stage-manager` section. |
| `/initiatives` | Wireframe hero, then **DeskFolio act**, then the wireframe's cards and detail canvas. |
| `/stories` | Wireframe hero, featured story, magazine spread, portfolio with sector filters, then `NewsletterSection` at `id="dispatch"` (redirect target). |

Wireframe interactions that only open wireframe modals (`openPublicApplyModal`, `openPublicStoryReaderModal`, toasts) become plain links to the matching route. The one exception is the bookshelf reader, which is the real reader.

## 6. Mobile floor (below 769px)

No design work. One column, no pinned runways, no hole, no shaders, curtains as static bands, and the wireframe's own responsive rules (`styled.html` lines 1778–1801) apply. The showcase components render their existing mobile branches, unverified. Content is correct and readable. Nothing more is claimed.

## 7. Failure modes

| Failure | Degrades to |
|---|---|
| No WebGL / shader error / context lost | CSS fallback surface, already visible |
| Slow GPU | Frame-time guard freezes to one frame |
| CMS down | `lib/api.ts` frozen fallbacks |
| JS off / crawler | All section copy present in server HTML; acts show their placeholder frame |
| Fontshare unreachable | Archivo fallback, text visible immediately |
| Reduced motion | Static bands, full-size acts, frozen shaders |

## 8. Verification

- `npm run build` passes.
- `npm run check`: node assert scripts for pure logic (`actPhase`, `shelfTravel`, `renderScale`, `frameGuard`, `storyToBook`, curtain maths) plus `scripts/design-lint.mjs` (banned fonts, `#000000`, `border-left` accents, `background-clip:text` outside `.hero-title-rich`).
- `npm run smoke` against `next start -p 3210`: every route returns 200, required copy is present, and the `data-surface` sequence matches the table in §3 or §5.
- Manual at 768, 1024 and 1440 with reduced motion on and off, and with WebGL disabled (`--disable-webgl`).

## 9. Decisions (user, 23 Sep)

1. Wireframe order; acts woven in per the flow.
2. Brand entrance plays first.
3. Desk, Shelf and Stage expand to the full viewport.
4. All three curtains stay (about 35% crimson, knowingly above target).
5. The shelf holds founder and startup stories; dispatches live only on /stories.
6. Teams on sand.
7. Wireframe figures ship as written (12,000+, ₹50L, FarmVision AI…). Flag for verification before launch.
8. Shaders are hand-written WebGL, optimised for low-end devices without compromising the visuals.
9. Wow components come from `gec-showcase`.
10. Desktop and tablet only. Mobile gets its own flow round.
11. The curtain c2 headline "Every story that started here." is new copy, pending confirmation.
