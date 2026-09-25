# GEC Web: Route Layouts (About, Teams, Initiatives, Stories, 404)

Extends spec §5 (`docs/superpowers/specs/2026-09-23-gec-web-design.md`). Covers plan Tasks 10–13.
Source of copy: `wireframes-v2/styled.html` `#page-*`. Home (spec §3) is the reference rhythm.

## 0. Shared rules for every route

- **Chrome:** `layout.tsx` already renders Navbar + SiteFooter. Routes render no footer of their own.
- **Grid:** 12 col, 24px gutter, 48px side margin, 1320 container. Section padding `clamp(60px, 8vw, 100px) 48px` (`.wf-section`).
- **Type:** `.editorial-kicker` → `.h1-display` / `.h2-section` → `.body-editorial`. No inline `fontSize: var(--text-*)` styles; no Tailwind `text-4xl` headings.
- **Surfaces:** alternate; never two identical surfaces touching unless the second carries `border-top: 1px solid var(--gec-border-subtle)`. Every section gets `data-surface`.
- **Route hero** (all four routes, one shared `RouteHero` component, 4 users justify it):
  cream, `min-height: 62dvh`, content bottom-aligned, cols 1–8 on desktop, left-aligned.
  Kicker · h1 (2 lines, line 2 crimson) · lede (max 60ch) · optional 1–2 anchor links to on-page sections.
  Shader: `contour`, masked to the empty right side (§8). Watercolor stays home-only.
- **Close:** every route ends on the crimson `FinalCta` band (reuse, prop for copy) → footer (charcoal). Gives each route the same landing as home.
- **Acts:** only Teams and Initiatives get a `FullViewportAct`, each preceded by a "Skip past …" link. About and Stories have no act.
- **Mobile < 769px:** spec §6 floor. Single column, heroes drop `min-height`, acts render static.

```
┌─ Navbar ────────────────────────────────────────┐
│ RouteHero        cream   kicker/h1/lede, 8 col  │
│ …route body…     alternating surfaces           │
│ FinalCta         crimson riso shader            │
│ SiteFooter       charcoal                       │
└─────────────────────────────────────────────────┘
```

## 1. `/about`  — story → purpose → people

| # | Section | Surface | Layout |
|---|---|---|---|
| 1 | Hero "We Don't Just Talk About Entrepreneurship." | cream | RouteHero. Anchors: *Our story*, *Leadership* |
| 2 | Origin "From Curiosity to Community." | sand | 7/5 split. Left: 4 paragraphs. Right: Incubation Pipeline card (3 stages as a vertical timeline, stage dots crimson/gold/blue, connecting 1px rule) |
| 3 | Mission / Vision | cream | 6/6 two cards, top rule crimson / gold. Equal height |
| 4 | Leadership + Mentors "Governance & Guidance" | sand | h2 + intro cols 1–7. Row A *Core Leadership* 3 × 4-col cards. Row B *Ecosystem Mentors (GICRISE)* 3 × 4-col cards, lighter (no photo, mono role line). 64px between rows |
| 5 | Teams banner | cream | Full-width card: left "7 teams, one vision" + line; right link → `/teams`. Acts as the bridge to Teams |
| 6 | FinalCta | crimson | Copy: join GEC |

Surface sequence: cream · sand · cream · sand · cream · crimson · charcoal.
Deviation from wireframe: wireframe has Origin on cream; sand is used so surfaces alternate.

## 2. `/teams` — hero → Stage act → join

| # | Section | Surface | Layout |
|---|---|---|---|
| 1 | Hero (wireframe line 3370) | cream | RouteHero. Right cols 9–12: stat stack "7 teams · N members · 1 vision" in mono |
| — | "Skip past the teams stage" link | — | visually hidden until focus |
| 2 | Stage Manager act | sand | `FullViewportAct surface="sand" runway={2.4}` wrapping `TeamStageManager showHero={false} initialMode="detail"`. Same as `StageAct` on home minus the curtain |
| 3 | FinalCta | crimson | Copy: "Find your team" → recruitment link |

Removes: page-local `<footer>` strip, `pt-20`, hard-coded `bg-[#FCF8ED]`, the component's built-in hero (the page hero replaces it).
Surface sequence: cream · sand · crimson · charcoal.

## 3. `/initiatives` — hero → Desk act → programme cards

| # | Section | Surface | Layout |
|---|---|---|---|
| 1 | Hero "Ideas Need More Than Inspiration." | cream | RouteHero. Anchors: *Open the desk*, *All programmes* |
| — | "Skip past the programmes desk" link | — | |
| 2 | DeskFolio act | cream (hole) | `FullViewportAct surface="cream" runway={2.4}` — same component and wiring as home `DeskAct` |
| 3 | Programme cards (wireframe line 3830) | sand | `.initiatives-offset-grid`: 2 cols, right column offset down 64px. Card: status badge + cohort (mono) / h3 / body / detail box / CTA link. Min-height 380 |
| 4 | Flagship detail: SDP Cohort 04 | cream | 12-col intro, 4-up phase row (crimson top rule), then 7/5: overview + FAQ `<details>` / eligibility card + apply button |
| 5 | FinalCta | crimson | Copy: apply to SDP |

Mockups: `design-explorations/route-layouts/*.html`.

Removes: pill badge hero, `DESKFOLIO_RESERVED_HEIGHT` clamp and its comment block (the act's sticky frame reserves the height), `'use client'` on the page (move dynamic import into the act child).
Surface sequence: cream · cream-act · sand · crimson · charcoal. The act's hole shadow separates the two creams.

## 4. `/stories` — lead story → spread → portfolio → dispatch

| # | Section | Surface | Layout |
|---|---|---|---|
| 1 | Hero "People Build Companies. Stories Build Culture." | cream | RouteHero. Anchors: *Portfolio*, *The Dispatch* |
| 2 | Featured story (wireframe 4099) | sand | 7/5: cover image left (4:3, radius-md), right: kicker, h2 26px, excerpt, byline mono, "Read" link |
| 3 | Magazine spread (wireframe 4138) | cream | h2 + 3 col asymmetric: 1 tall card (cols 1–6, 2 rows) + 2 stacked (cols 7–12) |
| 4 | Portfolio "Built at Galgotias." | sand | h2/intro left, sector filter chips right (same row, wraps on tablet). `PortfolioGrid` 3 col |
| 5 | The GEC Dispatch `id="dispatch"` | cream | 5/7: copy + "Read the latest issue" + subscribe / the **floating bin docked inline**, large (§7). Both open the DispatchBin reader. Replaces the bookshelf `NewsletterSection` here; the `/newsletter` redirect still lands on `#dispatch` |
| 6 | FinalCta | crimson | Copy: submit your story |

Deviation from current code: dispatch moves from 2nd to last (spec §5 order); hero moves sand → cream.
Surface sequence: cream · sand · cream · sand · cream · crimson · charcoal.

## 5. `not-found` / `error`

Cream, `min-height: 70dvh`, centered: mono code ("404" / "Something broke"), h2 one line, two links (Home, Stories). No CTA band.

## 7. Newsletter: DispatchBin (from `design-explorations/NEWSLETTER_BIN_HANDOFF.md`)

- The floating bin + broadsheet reader is the newsletter on **every route**, mounted once in `layout.tsx`. The design is locked, so port it exactly as the handoff says.
- **Route decision (answers handoff §2):** the bin stays visible on `/stories` too. The `#dispatch` section is an inline way into the same reader, not a second newsletter UI, so hiding the bin there isn't needed.
- `/stories` no longer renders the bookshelf `NewsletterSection`. The bookshelf remains the home **Shelf act** (stories), so it isn't lost.
- **Docked bin on /stories:** `#dispatch` renders the same `BinArt` large (clamp 180–280px), with hover lift, paper launch and a badge mirrored from the floating one. It sits still: no bob and no drag. Clicking it opens the reader, which grows from the docked bin.
- While the docked bin is ≥35% in view, the floating bin fades out (`is-docked`), so only one bin shows at a time.
- The docked bin's SVG ids get a suffix (`-d0`), so there are no duplicate ids.
- React shape: `DispatchBin` exposes `openDispatch(fromEl)` through context. `<DockedBin />` and the "Read the latest issue" button call it.
- z-order: curtain > dialog > navbar > bin (30) > page.

## 8. Background shaders (replaces "CSS only" for cream/sand in spec §2.6)

Watercolor stays on the home hero only. The route pages use four new families that come from print, not paint.
Prototype: `design-explorations/route-layouts/shaders.js` (press **S** in any mockup to toggle them on and off).

| Family | Look | Where (rule) | Ink / strength | Mask |
|---|---|---|---|---|
| `contour` | Slow drifting topographic lines, every 5th line gold ("index contour"). Reads as "mapping the ecosystem" | Every `RouteHero`, 404 | crimson + gold, .16 | `right`: empty right side only; the heading side stays clean |
| `halftone` | Newspaper dot screen at 15°, dot size from slow noise. Ties the site to the Dispatch plates | Sand sections | crimson, .13 | `edges`: corners/edges only |
| `hatch` | Copper-plate engraving: 45° hatch whose weight follows noise, cross-hatch in the darks | Cream mid-page sections | ink #222, .12 | `edges` |
| `riso` | Two-drum risograph: gold + oxblood screens, slightly misregistered, with grain | Crimson FinalCta (replaces `liquid` on route pages) | gold + oxblood, .34 | `edges` for gold, full for oxblood |

Never shaded: charcoal footer, the full-viewport acts, and the broadsheet (it has its own CSS halftone).

Implementation (gec-web):
- Add the four programs to `src/lib/shaders/programs.ts` next to `watercolor/liquid/specular`, sharing one `HEAD` (hash, value noise, 4-octave fbm, `rot`, `mask`).
- New uniforms: `s` (render scale, so the pattern is sized in CSS px and doesn't change with DPR) and `side` (mask mode).
- Hosts use the existing `ShaderLayer` with `family` + `mask` props. The spec §2.6 low-end rules all still apply: 0.5×DPR capped at 1280px, 30fps, runs only near the viewport, frame guard, reduced motion = one frame, none below 769px, and any failure falls back to CSS.
- **Frame guard:** measure the raw rAF interval *before* the 30fps cap. Measuring the capped interval (~33ms) always trips the 28ms guard. The prototype hit this bug.
- Budget: at most 2 shader hosts in view at once on any route (true for every layout above).
- The CSS fallback for each host is its plain surface; the canvas fades in over 600ms.

Open to tune while iterating: line density (contour ×11), halftone cell (9px), hatch pitch (7px), strengths.

## 9. Build order

1. `RouteHero` + `FinalCta` copy props (one commit).
2. `/teams` — smallest, reuses `StageAct` wiring.
3. `/initiatives` — reuses `DeskAct` wiring, ports programme cards.
4. `/about` — re-skin to shared type classes, add pipeline timeline + CTA.
5. `/stories` — port featured + spread from wireframe, reorder.
6. 404 / error.
6a. DispatchBin port (own task, per handoff) + the /stories teaser.
6b. Four shader programs + `mask`/`s` uniforms in the renderer.
7. Extend `npm run smoke`: assert each route's `data-surface` sequence above.

## Defaults (decided 24 Sep, answers pending — each is a one-line swap later)

- Teams hero stat: drop "N members"; show "7 teams · 1 vision" only.
- Featured story / magazine spread: auto from `getStories()` — item 0 = featured, items 1–3 = spread. Swap to a CMS `featured` flag when it exists.
- About leadership: text-only cards (name, mono role, bio). Add a photo slot when photos arrive.
