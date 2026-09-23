# GEC Web — Handoff

**Date:** 2026-09-23
**Status:** `gec-web` scaffolded from `gec-styled-next`. **No skinning done yet — deliberately.**
**Previous session:** built `gec-styled-next` (9 tasks, 22 commits, all reviewed). See "What went wrong" below.

---

## Read these first, in this order

Everything below is **frozen specification**. It is the authority. Nothing is to be invented — that is the mistake the previous session made.

| Path | Lines | Why |
|---|---|---|
| `E:\GEC\wireframes-v2\DESIGN.md` | 400 | The design system: colour roles + ratio, type hierarchy, grid, motion, anti-patterns, mobile doctrine |
| `E:\GEC\docs\GEC_Texture_Typography_Shader_Design_Spec.md` | 1995 | **The "make it beautiful" layer.** Approved shader families, tiers, section-by-section mapping, families to avoid |
| `E:\GEC\docs\GEC_Brand_Colour_Schema_Frozen.md` | 457 | Frozen colour schema |
| `E:\GEC\docs\GEC_Website_Complete_Content_Frozen.md` | 819 | Real copy — do not paraphrase or invent |
| `E:\GEC\docs\GEC_Dynamic_Hero_Spotlight_Frozen.md` | 482 | Hero campaign switcher behaviour |
| `E:\GEC\docs\stage-manager-card-animation-spec.md` | 991 | Stage Manager card motion |
| `E:\GEC\docs\GEC_Brand_Entrance_Integration_Guide.md` | 245 | Entrance curtain + FLIP logo dock |
| `E:\GEC\docs\GEC_Website_Site_Map_Frozen.md` | 463 | Route structure |
| `E:\GEC\docs\GEC_CMS_Site_Map_Frozen.md` | 346 | CMS projection shape |

Copies of the design system are already in `gec-web/docs/design/`:
`DESIGN.md`, `figma-tokens.json`, `wireframe-v2-full.html`, `pages/{home,about,teams,initiatives,stories}.html`.

---

## Source of truth for markup

`E:\GEC\wireframes-v2\styled.html` (5,135 lines) — **not** `gec-styled-next/docs/wireframe-original.html`, which is an older, different file the previous session built from by mistake.

### Strip this wireframe harness — it is not part of the design

| Element | What it is |
|---|---|
| `<header id="cockpit-header">` (line ~2203) | The black top bar: identity, page tabs, tools |
| `<aside id="inspector-drawer">` (~4324) | Box-model inspector |
| `#wf-modal-backdrop`, `#wf-modal-*` (~4345) | Wireframe modal |
| `#wf-toast-container` (~4364) | Toast host |
| `<main id="canvas-stage">` / `.canvas-frame.viewport-desktop` (~2265) | Canvas framing wrapper |

### Keep everything inside `#gec-canvas-root`

| Page section | Line |
|---|---|
| `#page-home` | 2299 |
| `#page-about` | 3103 |
| `#page-teams` | 3335 |
| `#page-initiatives` | 3774 |
| `#page-stories` | 4040 |

---

## Real token values (extracted from the wireframe's `:root`, not transcribed)

```
--gec-canvas: #FCF8ED          60% main canvas
--gec-surface-sand: #F4E2CA    secondary rhythm
--gec-surface-card: #FFFDF8    elevated cards
--gec-surface-elevated: #FFFFFF
--gec-crimson: #A3040F         25% primary brand
--gec-crimson-act: #C62F29
--gec-gold: #FBCA05            4% controlled accent
--gec-blue: #1F7EC0            2% tech accent
--gec-ink: #222222
--gec-ink-muted: #5F5650
--gec-ink-subtle: #8A817A
--gec-border-subtle: rgba(163,4,15,0.16)
--gec-border-strong: #A3040F
--gec-border-ink: rgba(34,34,34,0.18)

Team accents: --team-startup #FBCA05 · --team-pr #C62F29 · --team-mktg #E06D1B
              --team-event(s) #7B1113 · --team-media #1F7EC0 · --team-tech #222222
              --team-career #D97706

Blueprint: --guide-col rgba(31,126,192,0.07) · --guide-line rgba(31,126,192,0.22) · --guide-dim #1F7EC0

Radii: --radius-xs 4px · --radius-sm 8px · --radius-md 14px · --radius-lg 20px

Shadows (layered, inset highlight + ambient + crimson-tinted hover):
--shadow-ambient / --shadow-hover / --shadow-card / --shadow-card-refined / --shadow-card-hover-refined

Shader opacity (spec §25): --shader-ambient .14 · --shader-light .18 · --shader-hero .26 · --shader-feature .34
Texture (spec §26): --texture-grain-global .028 · --texture-grain-sand .04
                    --texture-highlight .05 · --texture-vignette .025

Fonts: --font-display 'Cabinet Grotesk' · --font-body 'Manrope' · --font-mono 'JetBrains Mono'
Motion: --ease-spring cubic-bezier(0.16, 1, 0.3, 1) · --duration-micro 180ms · --duration-macro 320ms
```

Google Fonts URL used by the wireframe:
`https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Cabinet+Grotesk:wght@700;800;900&display=swap`

> Note: Cabinet Grotesk is **not** on Google Fonts despite that URL. Source it from Fontshare
> (`https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900`) or self-host. Verify before relying on it.

---

## Home page surface rhythm (this is what "not plain blocks" means)

From `#page-home`, in order:

```
wf-section surface-cream      → hero-asymmetric-split (7:5)
wf-section surface-crimson    → bento-matrix-4items: span-6 / span-3 / span-3 / span-12
wf-section surface-cream
wf-section surface-charcoal   ← a surface the previous build had no token for
wf-section surface-sand
wf-section surface-cream
wf-section surface-crimson
```

Two full crimson sections plus a charcoal one. That is where the 25% crimson ratio lives. The previous build put crimson only inside the curtain interstitials and left everything else cream/sand — which is why it reads washed out.

---

## What the user asked for

1. `wireframes-v2` is the **source of truth**. Confirmed by the user.
2. The **six-act scroll journey survives** — the user confirmed this explicitly.
3. Make it **visually beautiful** — the current build "looks like plain blocks separating."
4. Build in a **new separate folder** (`gec-web`, already created).
5. Port **only the wireframe**, not the black top bar or other harness.
6. Shader/texture layer treated as **in scope** — it is the sanctioned answer to (3). The user did not object but also did not explicitly confirm; re-confirm if it looks expensive.

---

## What carries over unchanged from `gec-styled-next`

Architecture is sound and independent of the visual layer. Already copied into `gec-web/src`:

- `components/deskfolio/*` — the desk scene (Act III / `/initiatives`)
- `components/ui/newsletter-bookshelf.tsx`, `newsletter-reader.tsx`, `NewsletterSection.tsx` — the shelf (Act IV / `/stories`). Carries `data-gec-shelf-row`, a contract Act IV's travel measurement depends on.
- `components/teams/TeamStageManager.tsx` + `stage-manager.css` — the Stage Manager (Act V / `/teams`), already freed from its `max-w-7xl` cage and running full-bleed
- `components/curtain/panels.tsx` + `curtain-effects.css` — six curtain effects driven by one `--shut` custom property
- `components/CurtainInterstitial.tsx` — scroll-driven, reversible, reduced-motion branch
- `components/BrandEntranceCurtain.tsx` — G/E/C build, filament flash, shimmer, FLIP dock into `#navbar-brand-logo`. Red seam bug fixed.
- `components/ViewTransitionLink.tsx` — native View Transitions route changes, guarded for modified clicks / object hrefs / cross-origin
- `components/acts/*` — the six acts (compositions **will need replacing** with v2's)
- `lib/api.ts`, `fallbackData.ts`, `types.ts` — CMS projections with typed frozen fallbacks, never throws
- `lib/motion.ts` — motion tokens (retune to `--ease-spring` / 180ms / 320ms)
- `lib/utils.ts` — dependency-free `cn` joiner. **Does not dedupe conflicting Tailwind utilities** — passthrough `className` props must only add non-overlapping classes.

Redirects, error boundaries, `not-found`, and the fixed `start` script all carry over.

---

## What went wrong last time — do not repeat

1. **Built from the wrong wireframe.** Used `gec-styled-next/public/styled.html` (found behind an iframe) instead of `wireframes-v2/styled.html`. Never asked whether a design system existed. It did.
2. **Invented a type system.** Ran a font-selection procedure and offered three invented directions; the user picked Clash Display + Satoshi. The spec already mandated **Cabinet Grotesk + Manrope + JetBrains Mono**, and explicitly bans Inter and generic serifs.
3. **Inverted the colour ratio.** Instructed implementers "crimson at most once, as punctuation" and had a reviewer strip crimson out of `/stories`. The spec calls for **25% crimson**. This is the single most visible error.
4. **No grid system.** Spec says 12-col, 24px gutters, 48px margins, container 1320 / canvas 1440. None was specified, so each page composed freely.
5. **No texture or shader layer at all.** Spec has 1,995 lines on it. Flat surfaces shipped instead.
6. **Missed `surface-charcoal`** entirely.

The recurring failure mode in review was not broken code — every task passed its build and its review. It was that each implementer satisfied every literal constraint and still produced something templated: a kicker above every heading, one accent colour doing six jobs, four sections sharing identical padding. Push back on that explicitly in every dispatch.

---

## Process notes

- Previous session used `superpowers:subagent-driven-development` with a per-task review gate. It worked — reviews caught a 140px height bug at tablet width, a zero-travel regression, a `"[object Object]"` navigation bug, and a silently-failing DOM selector. Recommend reusing it.
- Ledger with all 31 rulings: `E:\GEC\.superpowers\sdd\2026-09-23-gec-styled-next-redesign\progress.md`
- Spec + plan from the previous effort: `gec-styled-next/docs/superpowers/{specs,plans}/2026-09-23-*`
- **The final whole-branch review never ran.** The package was built at `.superpowers/sdd/2026-09-23-gec-styled-next-redesign/review-0eda162..07b7e1c.diff` (22 commits, 228KB) but was not dispatched.
- 12 deferred minor findings are listed in the ledger, unfixed.

## Environment gotchas

- Port 3000 is held by a **stale dev server for this same project** left by an earlier agent, plus one other node process. Next refuses to start a second dev server for the same directory. Use an explicit port.
- Dev server for `gec-styled-next` currently running on **3100** (`npx kill-port 3100` to stop).
- `gec-styled-next/src/components/teams/stage-manager.css` has **pre-existing uncommitted changes** predating all this work. Not to be staged, committed or reverted.
- Windows: `wmic` is gone; use PowerShell `Get-Process`. Git Bash mangles `/paths` in curl — prefix with `MSYS_NO_PATHCONV=1`.
- Branch: `WEBISTE-GETTING-THERE`. `gec-web` is untracked so far.
