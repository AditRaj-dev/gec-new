# GEC Styled Next Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the iframe-wireframe homepage and about page with a designed, scroll-driven five-route site built on the existing DeskFolio, Bookshelf and Stage Manager components.

**Architecture:** `/` becomes a six-act scroll journey composed from act components that receive data as props from a server component. Three scroll-driven curtain interstitials and all route transitions share one curtain primitive extracted from the existing `BrandEntranceCurtain`. A token layer (type, elevation, texture, surface rhythm, motion) replaces flat cream-and-borders styling.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, `motion` v13, native View Transitions API. **No new runtime dependencies.**

**Spec:** `docs/superpowers/specs/2026-09-23-gec-styled-next-redesign-design.md`

**Working directory:** All paths are relative to `gec-styled-next/` unless stated otherwise. The repo root is one level up.

## Global Constraints

- **No new runtime dependencies.** Motion is `motion` v13 (already installed). Scroll uses `useScroll`/`useTransform`. No GSAP, ScrollTrigger, Lenis, or `motion-plus`.
- **Palette, exact values:** canvas `#FCF8ED`, sand `#F4E2CA`, card `#FFFDF8`, crimson `#A3040F`, crimson-active `#C62F29`, gold `#FBCA05`, blue `#1F7EC0`, ink `#1A1A1A`, ink-muted `#5F5650`.
- **Fonts:** Clash Display (600, 700) display, Satoshi (400, 500, 700) body, Fragment Mono (400) mono.
- **Motion tokens, exact values:** instant 120ms, ui 180ms, layout 320ms, act 480ms, stagger 40ms, exit multiplier 0.65. Entrance easing `cubic-bezier(0.165, 0.84, 0.44, 1)`.
- **Transform and opacity only.** Never animate `width`, `height`, `top`, `left`.
- **Every animation has a `prefers-reduced-motion: reduce` branch** that preserves meaning, not a blanket disable.
- **Content is visible without JS.** Never gate visibility on a scroll trigger, an IntersectionObserver, or a mount effect. Motion is additive only.
- **Banned patterns:** `border-left`/`border-right` > 1px as a colored accent; gradient text (`background-clip: text`); decorative glassmorphism; `01 ·`/`02 ·` numbered section markers; a tiny uppercase tracked eyebrow above every section heading; identical repeated card grids.
- **Scope is desktop and tablet.** Verify at 768px and 1440px. Below 768px: single column, no scroll set-pieces, curtains render as static bands. Correct and readable, not redesigned.
- **No magic numbers.** Durations, easings and stagger values come from `lib/motion.ts`. Colors come from CSS custom properties.
- **Commit after every task.** Conventional commit messages.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/motion.ts` | Motion tokens, easing strings, reduced-motion helper, scroll-progress math |
| `src/lib/siteContent.ts` | Hero campaign content (copied from `gec-showcase`) |
| `src/lib/motion.check.mjs` | Runnable assert check for scroll math + count fallback |
| `src/app/globals.css` | Token layer: type scale, elevation, texture, surfaces |
| `src/components/curtain/panels.tsx` | Two-panel mechanic, shared by all curtain consumers |
| `src/components/curtain/curtain-effects.css` | `doors`, `wipe`, `iris`, `blinds`, `staggerWipe` as CSS variants |
| `src/components/CurtainInterstitial.tsx` | Scroll-driven curtain between acts |
| `src/components/acts/ActOpening.tsx` | Act I — hero + campaign switcher |
| `src/components/acts/ActCount.tsx` | Act II — marquee of live figures |
| `src/components/acts/ActDesk.tsx` | Act III — DeskFolio teaser |
| `src/components/acts/ActShelf.tsx` | Act IV — Bookshelf teaser |
| `src/components/acts/ActStage.tsx` | Act V — Stage Manager, full-bleed |
| `src/components/acts/ActClose.tsx` | Act VI — apply + subscribe + footer |
| `src/components/ViewTransitionLink.tsx` | Route transitions via View Transitions API |
| `src/app/error.tsx`, `src/app/not-found.tsx` | Error boundaries (currently absent) |

---

## Task 1: Foundation — tokens, fonts, motion constants, content

**Files:**
- Create: `src/lib/motion.ts`, `src/lib/motion.check.mjs`, `src/lib/siteContent.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Reference (read-only): `../gec-showcase/lib/siteContent.ts`

**Interfaces:**
- Produces: `DURATION`, `EASE`, `STAGGER`, `exitDuration(ms: number): number`, `curtainProgress(scrollY: number, start: number, length: number): { shut: number; hold: number }`, `liveKicker(count: number, noun: string): string` from `@/lib/motion`. `HERO_CAMPAIGNS` and its `HeroCampaign` type from `@/lib/siteContent`.

- [ ] **Step 1: Record the baseline build**

Run: `npx next build`
Record the result in your report. If it already fails, report the failure verbatim and continue — you are not responsible for pre-existing breakage, but later tasks need to know.

- [ ] **Step 2: Copy the hero content**

Copy `../gec-showcase/lib/siteContent.ts` to `src/lib/siteContent.ts` unchanged. It exports `HeroCampaign` and `HERO_CAMPAIGNS`. Do not edit its contents.

- [ ] **Step 3: Write the motion token module**

Create `src/lib/motion.ts`:

```ts
/** Motion tokens. Every duration, easing and stagger in the app comes from here. */
export const DURATION = {
  instant: 120,
  ui: 180,
  layout: 320,
  act: 480,
} as const;

export const EASE = {
  /** ease-out-quart — entrances */
  out: [0.165, 0.84, 0.44, 1] as const,
  /** css string form, for stylesheets and transition shorthand */
  outCss: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
} as const;

export const STAGGER = 0.04; // seconds between items in a list

const EXIT_MULTIPLIER = 0.65;

/** Exits are always faster than entrances. */
export function exitDuration(enterMs: number): number {
  return Math.round(enterMs * EXIT_MULTIPLIER);
}

/**
 * Maps raw scroll position to curtain state.
 * 0.00-0.42 panels close, 0.42-0.58 held shut, 0.58-1.00 panels part.
 * `shut` drives panel travel (0 open, 1 closed); `hold` drives line opacity.
 */
export function curtainProgress(
  scrollY: number,
  start: number,
  length: number
): { shut: number; hold: number } {
  if (length <= 0) return { shut: 0, hold: 0 };
  const p = clamp((scrollY - start) / length, 0, 1);
  const close = segment(p, 0, 0.42);
  const open = segment(p, 0.58, 1);
  const shut = clamp(close - open, 0, 1);
  const hold = Math.min(segment(p, 0.3, 0.46), 1 - segment(p, 0.56, 0.7));
  return { shut, hold };
}

/** Live count for a curtain kicker. Falls back to NEXT so a failed fetch never reads "0 TEAMS". */
export function liveKicker(count: number, noun: string): string {
  if (!Number.isFinite(count) || count <= 0) return 'NEXT';
  return `${count} ${noun.toUpperCase()}`;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function segment(p: number, a: number, b: number): number {
  return clamp((p - a) / (b - a), 0, 1);
}
```

- [ ] **Step 4: Write the runnable check**

Create `src/lib/motion.check.mjs`. It must import from the compiled-free source by duplicating nothing — use `tsx` if available, otherwise test the pure math by importing the `.ts` through Node's type stripping (Node 22.6+ `--experimental-strip-types`). If neither works, write the check as a `.mjs` that imports `./motion.ts` and run it with `npx tsx src/lib/motion.check.mjs`; record in your report which command worked.

```js
import assert from 'node:assert/strict';
import { curtainProgress, liveKicker, exitDuration } from './motion.ts';

// fully open before the interstitial starts
assert.equal(curtainProgress(0, 100, 1000).shut, 0);
// fully shut in the hold band
assert.equal(curtainProgress(600, 100, 1000).shut, 1);
// fully open again after it ends
assert.equal(curtainProgress(1200, 100, 1000).shut, 0);
// the line is visible only while shut
assert.ok(curtainProgress(600, 100, 1000).hold > 0.9);
assert.equal(curtainProgress(100, 100, 1000).hold, 0);
// degenerate range never divides by zero
assert.deepEqual(curtainProgress(50, 0, 0), { shut: 0, hold: 0 });

// kicker never reports an empty collection as a number
assert.equal(liveKicker(7, 'teams'), '7 TEAMS');
assert.equal(liveKicker(0, 'teams'), 'NEXT');
assert.equal(liveKicker(Number.NaN, 'teams'), 'NEXT');

// exits are faster than entrances
assert.ok(exitDuration(480) < 480);

console.log('motion.check: all assertions passed');
```

- [ ] **Step 5: Run the check, verify it passes**

Run the command you established in Step 4.
Expected: `motion.check: all assertions passed`

- [ ] **Step 6: Install the fonts**

Try self-hosting first. Fetch the Fontshare CSS and download the `.woff2` files it references into `public/fonts/`:

```bash
curl -s "https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&f[]=fragment-mono@400&display=swap"
```

Extract the `src: url(...)` entries and `curl -o public/fonts/<name>.woff2` each one. Then declare them in `globals.css` with `@font-face` and `font-display: swap`.

**If the download fails for any reason** (no network, blocked host, non-woff2 response): fall back to a `<link rel="stylesheet">` to that same Fontshare URL in `src/app/layout.tsx`, plus `<link rel="preconnect" href="https://api.fontshare.com">`. Record clearly in your report which path you took — self-hosted or CDN — so the follow-up is visible. Do not block the task on this.

- [ ] **Step 7: Write the token layer in globals.css**

Modify `src/app/globals.css`:

1. **Delete** the `@import "shadcn/tailwind.css";` and `@import "tw-animate-css";` lines and the shadcn semantic alias block (`--background` through `--sidebar-ring`). Nothing consumes them.
2. Keep the `--gec-*` tokens, updating `--gec-ink` to `#1A1A1A`.
3. Add the new token groups below.

```css
:root {
  /* type */
  --font-display: 'Clash Display', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Satoshi', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Fragment Mono', ui-monospace, monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;
  --text-xl:   clamp(1.5rem,  1.1rem + 1.6vw, 2rem);
  --text-2xl:  clamp(2rem,    1.4rem + 2.6vw, 3rem);
  --text-3xl:  clamp(2.6rem,  1.6rem + 4.2vw, 4.5rem);
  --text-hero: clamp(3rem,    1.8rem + 5.4vw, 6rem); /* ceiling is 6rem, never higher */

  /* elevation — warm-tinted, never gray */
  --elev-flush:    0 0 0 1px rgba(163, 4, 15, 0.12);
  --elev-raised:   0 1px 2px rgba(90, 40, 20, 0.07), 0 2px 5px -2px rgba(90, 40, 20, 0.10);
  --elev-lifted:   0 1px 1px rgba(90, 40, 20, 0.05), 0 4px 9px -3px rgba(90, 40, 20, 0.13),
                   0 12px 24px -12px rgba(90, 40, 20, 0.20);
  --elev-floating: 0 2px 3px rgba(90, 40, 20, 0.07), 0 10px 20px -6px rgba(90, 40, 20, 0.18),
                   0 26px 48px -18px rgba(90, 40, 20, 0.30);

  /* motion — mirrors lib/motion.ts; keep the two in sync */
  --dur-instant: 120ms;
  --dur-ui:      180ms;
  --dur-layout:  320ms;
  --dur-act:     480ms;
  --ease-out:    cubic-bezier(0.165, 0.84, 0.44, 1);

  /* z-index scale — semantic, never arbitrary */
  --z-base: 0; --z-sticky: 20; --z-nav: 40; --z-curtain: 60;
  --z-modal: 80; --z-entrance: 99999;
}

body {
  background: var(--gec-canvas);
  color: var(--gec-ink);
  font-family: var(--font-body);
  font-kerning: normal;
  font-optical-sizing: auto;
}

h1, h2, h3 { font-family: var(--font-display); text-wrap: balance; letter-spacing: -0.03em; }
p { text-wrap: pretty; }

/* paper grain — decorative only, never over interactive content */
.gec-grain { position: relative; }
.gec-grain::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.34'/%3E%3C/svg%3E");
}

/* surface rhythm */
.surface-cream { background: var(--gec-canvas); }
.surface-sand  { background: var(--gec-surface-sand); }
.surface-crimson { background: var(--gec-crimson); color: #FFFFFF; }

/* blueprint detail layer — the project's own language (section-id-stamp,
   coordinate stamps). Use DELIBERATELY and SPARINGLY: a stamp above every
   section is the banned eyebrow pattern, not a design system. At most one
   stamped act per page. */
.gec-stamp {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--gec-crimson);
}
.gec-regmark { position: absolute; width: 13px; height: 13px; opacity: 0.5; }
.gec-regmark::before,
.gec-regmark::after { content: ''; position: absolute; background: var(--gec-crimson); }
.gec-regmark::before { width: 100%; height: 1px; top: 0; }
.gec-regmark::after  { height: 100%; width: 1px; left: 0; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 8: Verify the build and the type scale**

Run: `npx next build`
Expected: PASS (or the same pre-existing failure you recorded in Step 1 — no new errors).

- [ ] **Step 9: Commit**

```bash
git add src/lib/motion.ts src/lib/motion.check.mjs src/lib/siteContent.ts src/app/globals.css src/app/layout.tsx public/fonts
git commit -m "feat: add design token layer, motion constants and hero content"
```

---

## Task 2: Curtain primitive and the red-seam fix

**Files:**
- Create: `src/components/curtain/panels.tsx`, `src/components/curtain/curtain-effects.css`, `src/components/CurtainInterstitial.tsx`
- Modify: `src/components/BrandEntranceCurtain.tsx` (lines ~538-552)

**Interfaces:**
- Consumes: `curtainProgress`, `liveKicker`, `DURATION`, `EASE` from `@/lib/motion`.
- Produces: `<CurtainPanels effect shut />` from `@/components/curtain/panels`; `<CurtainInterstitial headline count noun effect />` from `@/components/CurtainInterstitial`. `CurtainEffect = 'doors-v' | 'doors-h' | 'wipe' | 'iris' | 'blinds' | 'stagger-wipe'`.

- [ ] **Step 1: Fix the red seam**

In `src/components/BrandEntranceCurtain.tsx`, the top panel carries `border-b border-[rgba(163,4,15,0.14)]` and the bottom panel carries `border-t border-[rgba(163,4,15,0.14)]`. They meet at the vertical midpoint and render a 2px crimson line across the screen for the entire intro.

Remove both border utility classes from the two panel `className` strings. Add a single seam element that is only visible while the panels are travelling:

```tsx
{/* Seam — visible only while the curtain parts. A static line across the
    hero bisects the logo; a moving one reads as the split opening. */}
<div
  aria-hidden
  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[rgba(163,4,15,0.28)] transition-opacity duration-300"
  style={{ opacity: curtainOpen ? 1 : 0 }}
/>
```

Place it as a sibling of the two panels, before the Skip button. Do not change any other part of the entrance animation — the G/E/C build, filament flash, shimmer beam and FLIP dock all stay exactly as they are.

- [ ] **Step 2: Verify the fix visually**

Run `npx next dev`, load `http://localhost:3000`, and confirm: no crimson line across the middle of the screen while the logo builds; a faint seam appears as the panels part; the logo still docks into the navbar. Record what you observed.

- [ ] **Step 3: Write the effects stylesheet**

Create `src/components/curtain/curtain-effects.css`. Every effect is driven by one CSS custom property `--shut` (0 open, 1 closed) set inline by the panels component, so no effect needs JS beyond setting that number.

```css
.gc-panels { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.gc-panel  { position: absolute; background: var(--gec-crimson); will-change: transform, clip-path; }

/* doors — vertical: two panels meet in the middle */
.gc-doors-v .gc-panel-a { inset: 0 0 auto 0; height: 50.5%; transform: translateY(calc((var(--shut) - 1) * 100%)); }
.gc-doors-v .gc-panel-b { inset: auto 0 0 0; height: 50.5%; transform: translateY(calc((1 - var(--shut)) * 100%)); }

/* doors — horizontal */
.gc-doors-h .gc-panel-a { inset: 0 auto 0 0; width: 50.5%; transform: translateX(calc((var(--shut) - 1) * 100%)); }
.gc-doors-h .gc-panel-b { inset: 0 0 0 auto; width: 50.5%; transform: translateX(calc((1 - var(--shut)) * 100%)); }

/* wipe — one angled panel sweeps across */
.gc-wipe .gc-panel-a { inset: -14% -22%; transform: translateX(calc((var(--shut) - 1) * 118%)) skewX(-11deg); }
.gc-wipe .gc-panel-b { display: none; }

/* iris — circle grows from centre */
.gc-iris .gc-panel-a { inset: 0; clip-path: circle(calc(var(--shut) * 78%) at 50% 50%); }
.gc-iris .gc-panel-b { display: none; }

/* blinds — slats scale shut */
.gc-blinds .gc-panel { left: 0; right: 0; height: 20%; transform: scaleY(var(--shut)); transform-origin: top; }
.gc-blinds .gc-panel:nth-child(1) { top: 0; }
.gc-blinds .gc-panel:nth-child(2) { top: 20%; }
.gc-blinds .gc-panel:nth-child(3) { top: 40%; }
.gc-blinds .gc-panel:nth-child(4) { top: 60%; }
.gc-blinds .gc-panel:nth-child(5) { top: 80%; }

/* stagger-wipe — columns cascade down */
.gc-stagger-wipe .gc-panel { top: 0; bottom: 0; width: 20.4%; transform: translateY(calc((var(--shut) - 1) * 101%)); }
.gc-stagger-wipe .gc-panel:nth-child(1) { left: 0; }
.gc-stagger-wipe .gc-panel:nth-child(2) { left: 20%; }
.gc-stagger-wipe .gc-panel:nth-child(3) { left: 40%; }
.gc-stagger-wipe .gc-panel:nth-child(4) { left: 60%; }
.gc-stagger-wipe .gc-panel:nth-child(5) { left: 80%; }

.gc-seam {
  position: absolute; left: 0; right: 0; top: 50%; height: 2px;
  background: var(--gec-gold); transform: translateY(-1px); pointer-events: none;
}
```

- [ ] **Step 4: Write the panels component**

Create `src/components/curtain/panels.tsx`:

```tsx
'use client';

import './curtain-effects.css';

export type CurtainEffect =
  | 'doors-v' | 'doors-h' | 'wipe' | 'iris' | 'blinds' | 'stagger-wipe';

const SLAT_EFFECTS: CurtainEffect[] = ['blinds', 'stagger-wipe'];

export function CurtainPanels({
  effect,
  shut,
  showSeam = false,
}: {
  effect: CurtainEffect;
  /** 0 = fully open, 1 = fully closed */
  shut: number;
  showSeam?: boolean;
}) {
  const count = SLAT_EFFECTS.includes(effect) ? 5 : 2;
  return (
    <div
      aria-hidden
      className={`gc-panels gc-${effect}`}
      style={{ ['--shut' as string]: String(shut) }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`gc-panel gc-panel-${i === 0 ? 'a' : 'b'}`} />
      ))}
      {showSeam && shut > 0.02 && shut < 0.98 && <div className="gc-seam" />}
    </div>
  );
}
```

- [ ] **Step 5: Write the scroll interstitial**

Create `src/components/CurtainInterstitial.tsx`:

```tsx
'use client';

import { useRef, useState } from 'react';
import {
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  motion,
  type MotionValue,
} from 'motion/react';
import { CurtainPanels, type CurtainEffect } from './curtain/panels';
import { liveKicker } from '@/lib/motion';

export function CurtainInterstitial({
  headline,
  count,
  noun,
  effect = 'wipe',
}: {
  headline: string;
  count: number;
  noun: string;
  effect?: CurtainEffect;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 0-.42 close, .42-.58 hold shut, .58-1 part
  const shut = useTransform(scrollYProgress, [0, 0.42, 0.58, 1], [0, 1, 1, 0]);
  const hold = useTransform(scrollYProgress, [0.3, 0.46, 0.56, 0.7], [0, 1, 1, 0]);
  const lift = useTransform(hold, [0, 1], [14, 0]);

  const kicker = liveKicker(count, noun);

  // Reduced motion: a static crimson band carrying the same words. No travel.
  if (reduce) {
    return (
      <div className="surface-crimson flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.09em] text-[var(--gec-gold)]">
          {kicker}
        </span>
        <p className="m-0 max-w-[24ch] text-[length:var(--text-2xl)] font-bold leading-[1.02] text-white">
          {headline}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <CurtainShell shut={shut} effect={effect} />
        <motion.div
          style={{ opacity: hold, y: lift }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
        >
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.09em] text-[var(--gec-gold)]">
            {kicker}
          </span>
          <p className="m-0 max-w-[24ch] text-[length:var(--text-3xl)] font-bold leading-[1.02] text-white">
            {headline}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/** Bridges a MotionValue to the CSS custom property the effects read. */
function CurtainShell({
  shut,
  effect,
}: {
  shut: MotionValue<number>;
  effect: CurtainEffect;
}) {
  const [value, setValue] = useState(0);
  useMotionValueEvent(shut, 'change', setValue);
  return <CurtainPanels effect={effect} shut={value} showSeam />;
}
```

- [ ] **Step 6: Verify the build**

Run: `npx next build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/curtain src/components/CurtainInterstitial.tsx src/components/BrandEntranceCurtain.tsx
git commit -m "feat: add shared curtain primitive; fix entrance seam bisecting the logo"
```

---

## Task 3: Acts I and II, and the home composition

**Files:**
- Create: `src/components/acts/ActOpening.tsx`, `src/components/acts/ActCount.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `HERO_CAMPAIGNS` from `@/lib/siteContent`; `DURATION`, `EASE` from `@/lib/motion`; `getInitiatives`, `getTeams`, `getStories` from `@/lib/api`.
- Produces: `<ActOpening campaigns />`, `<ActCount stats />`. `Stat = { label: string; value: string }`.

- [ ] **Step 1: Build Act I**

Create `src/components/acts/ActOpening.tsx` as a client component. Requirements:

- Full viewport (`min-h-[100dvh]`), `surface-cream gec-grain`.
- A row of campaign pills, one per key in `HERO_CAMPAIGNS`. Clicking one swaps headline, subline, deadline badge, featured card and both CTAs.
- Headline uses `var(--text-hero)`, display font, `text-wrap: balance`.
- The active pill swap is a crossfade plus a short slide, `DURATION.ui`, using `motion`'s `AnimatePresence` with `mode="wait"`. It must be interruptible — rapid clicking never queues.
- **The first campaign's content renders in the initial HTML.** Do not gate the hero on a mount effect.
- Pills are real `<button>` elements with `aria-pressed`, visible focus rings, and ≥44px tap targets.
- CTAs come from `primaryCtaText`/`primaryCtaHref` and `secondaryCtaText`/`secondaryCtaHref`.

- [ ] **Step 2: Build Act II**

Create `src/components/acts/ActCount.tsx`. Requirements:

- `surface-sand`, short — roughly 40vh, not a full screen.
- A horizontally scrolling marquee of `Stat` entries at constant velocity, implemented as a CSS `@keyframes` translation on a duplicated track (duplicate the list once so the loop is seamless). Transform only.
- Numbers count up once when the section first enters the viewport. The final value is what renders in the initial HTML; the count-up animates *from* a lower number *to* the already-rendered value, so no-JS and reduced-motion both show the true figure.
- `prefers-reduced-motion`: marquee does not translate, list renders as a static wrapped row; no count-up.
- `aria-hidden` on the duplicated track so screen readers hear each stat once.

- [ ] **Step 3: Rewrite the homepage**

Replace `src/app/page.tsx`. It stays a **server component**:

```tsx
import { getInitiatives, getTeams, getStories } from '@/lib/api';
import { HERO_CAMPAIGNS } from '@/lib/siteContent';
import { ActOpening } from '@/components/acts/ActOpening';
import { ActCount } from '@/components/acts/ActCount';

export default async function Home() {
  const [initiatives, teams, stories] = await Promise.all([
    getInitiatives(),
    getTeams(),
    getStories(),
  ]);

  return (
    <main aria-label="Galgotias Entrepreneurship Cell">
      <ActOpening campaigns={HERO_CAMPAIGNS} />
      <ActCount
        stats={[
          { label: 'Teams', value: String(teams.length) },
          { label: 'Programmes', value: String(initiatives.length) },
          { label: 'Ventures', value: String(stories.length) },
        ]}
      />
    </main>
  );
}
```

Check the actual exported function names in `src/lib/api.ts` before writing this — use whatever it really exports, and report the names you used.

- [ ] **Step 4: Verify**

Run: `npx next build`, then `npx next dev`. At 1440px and 768px confirm: hero fills the viewport, pills swap content, marquee scrolls, no horizontal page scroll. With JS disabled, confirm the hero headline and all stats are present in the HTML.

- [ ] **Step 5: Commit**

```bash
git add src/components/acts src/app/page.tsx
git commit -m "feat: replace iframe homepage with hero and count acts"
```

---

## Task 4: Acts III and IV with their interstitials

**Files:**
- Create: `src/components/acts/ActDesk.tsx`, `src/components/acts/ActShelf.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `CurtainInterstitial`; `DeskFolioPage` from `@/components/deskfolio`; `NewsletterBookshelf` from `@/components/ui/newsletter-bookshelf`; `GEC_DISPATCH_ARCHIVE` from `@/components/NewsletterSection`.
- Produces: `<ActDesk />`, `<ActShelf items />`.

- [ ] **Step 1: Build Act III**

Create `src/components/acts/ActDesk.tsx`. Requirements:

- `surface-cream`. Heading, one-line description, and the DeskFolio scene.
- `DeskFolioPage` is loaded with `dynamic(..., { ssr: false })`. **Its loading placeholder must reserve the same height as the loaded scene** or the page will shift on load. Use a fixed `min-h` on the wrapper, identical for placeholder and content.
- Scroll-linked scale: `useScroll` on the section with `offset: ['start end', 'center center']`, `useTransform` to scale from `0.92` to `1`. Transform only.
- `prefers-reduced-motion`: no scale, scene renders at 1.
- A link to `/initiatives` labelled with the programme count.

- [ ] **Step 2: Build Act IV**

Create `src/components/acts/ActShelf.tsx`. Requirements:

- `surface-sand`. Heading, one-line description, and the bookshelf.
- Vertical scroll drives horizontal shelf travel: `useScroll` over a tall section with a sticky inner container; `useTransform` maps progress to `x` in a negative range sized to the track width. Transform only, never `scrollLeft`.
- `prefers-reduced-motion`: the shelf renders as a plain wrapped grid of covers with no travel and no sticky section.
- A link to `/stories`.

- [ ] **Step 3: Wire both acts and their curtains into the homepage**

In `src/app/page.tsx`, after `<ActCount />`:

```tsx
<CurtainInterstitial
  headline="Every programme, one living desk."
  count={initiatives.length}
  noun="programmes"
  effect="wipe"
/>
<ActDesk />
<CurtainInterstitial
  headline="Every issue we ever sent."
  count={GEC_DISPATCH_ARCHIVE.length}
  noun="dispatches"
  effect="wipe"
/>
<ActShelf items={GEC_DISPATCH_ARCHIVE} />
```

- [ ] **Step 4: Verify**

Run `npx next build`, then `npx next dev`. Confirm: scrolling into each curtain closes it, the line appears, it parts into the act; scrolling back up reverses it; no layout shift when the two `ssr: false` components load (watch the page while it loads — nothing should jump). Check at 1440px and 768px.

- [ ] **Step 5: Commit**

```bash
git add src/components/acts src/app/page.tsx
git commit -m "feat: add desk and shelf acts with scroll-driven curtains"
```

---

## Task 5: Act V (full-bleed Stage), Act VI, and the Stage Manager cage

**Files:**
- Create: `src/components/acts/ActStage.tsx`, `src/components/acts/ActClose.tsx`
- Modify: `src/app/page.tsx`, `src/app/teams/page.tsx`, `src/components/teams/stage-manager.css`

**Interfaces:**
- Consumes: `TeamStageManager` from `@/components/teams/TeamStageManager`; `CurtainInterstitial`.
- Produces: `<ActStage teams />`, `<ActClose />`.

- [ ] **Step 1: Free the Stage Manager from its cage**

In `src/app/teams/page.tsx`, remove the `max-w-7xl mx-auto ... py-8 sm:py-12` wrapper around `<TeamStageManager />`. The component becomes full-bleed: edge to edge, `min-h-[100dvh]`. Keep the existing footer.

In `src/components/teams/stage-manager.css`, the detail-mode sidebar card cap at `max-width: 320px` (around line 293) constrains cards inside the stack. Raise it so cards scale with the available column: replace the fixed cap with `max-width: 100%` and let the grid column (`minmax(300px, 340px)` at line 260) own the width. Widen that column to `minmax(320px, 420px)` now that the section is full-bleed.

Do not change the existing `max-width: 900px` and `max-width: 1100px` mobile/tablet blocks — they are the below-768 holding pattern.

- [ ] **Step 2: Build Act V**

Create `src/components/acts/ActStage.tsx`. Requirements:

- Full-bleed, `min-h-[100dvh]`, `surface-cream`. It must break out of any parent padding — the page's `<main>` must not constrain it.
- Renders `<TeamStageManager initialTeamIndex={1} initialMode="detail" showHero={false} />`.
- Cards peel in from off-canvas on first entry: staggered `STAGGER` (0.04s) apart, translate + opacity only, `DURATION.act`, `EASE.out`.
- **Cards render visible by default**; the peel animates from an offset *to* their resting position. Never `opacity: 0` as the un-animated state.
- `prefers-reduced-motion`: cards appear with no peel and no stagger.
- A link to `/teams`.

- [ ] **Step 3: Build Act VI**

Create `src/components/acts/ActClose.tsx`. Requirements:

- `surface-sand`. **One primary CTA** (apply), with the dispatch subscribe visually subordinate — not two equal buttons.
- The subscribe input has a visible `<label>`, not a placeholder-only label; `type="email"`; `autocomplete="email"`; inline validation on blur, not on keystroke; the error message states the cause and the fix, and sits below the field.
- Footer below: the five routes, contact, university line. Real `<a>` elements.
- No motion beyond form state transitions.

- [ ] **Step 4: Wire both into the homepage**

```tsx
<CurtainInterstitial
  headline="The people behind all of it."
  count={teams.length}
  noun="teams"
  effect="doors-h"
/>
<ActStage teams={teams} />
<ActClose />
```

- [ ] **Step 5: Verify**

Run `npx next build`, then `npx next dev`. At 1440px confirm the Stage act spans the full viewport width with no gutter and the cards no longer look cramped. At 768px confirm it degrades cleanly. Confirm `/teams` is also full-bleed now.

- [ ] **Step 6: Commit**

```bash
git add src/components/acts src/app/page.tsx src/app/teams/page.tsx src/components/teams/stage-manager.css
git commit -m "feat: add full-bleed stage and close acts; free stage manager from its column"
```

---

## Task 6: Port `/about` from the wireframe

**Files:**
- Modify: `src/app/about/page.tsx`
- Reference (read-only): `public/styled.html`, section `id="page-about"`

- [ ] **Step 1: Read the wireframe's about section**

Open `public/styled.html` and locate `<div id="page-about">`. It contains, in order: a display headline, a mission section, two side-by-side cards (vision / mission), and a pillars grid. Extract the real copy verbatim — it is the client's actual text.

- [ ] **Step 2: Rebuild it in React**

Rewrite `src/app/about/page.tsx` as a server component using the token layer. Requirements:

- Keep the `metadata` export that is already there.
- Alternate `surface-cream` and `surface-sand` between sections. Crimson is used at most once, as punctuation.
- **This route carries no interactive component, so typography and layout do the work.** Vary section spacing for rhythm rather than stacking identical blocks. Prose measure capped at 65-75ch.
- Do not use a repeated uppercase eyebrow above each section, numbered section markers, or an identical card grid — all three are banned in Global Constraints.
- Stakeholders come from `getStakeholders()` in `@/lib/api` if that section exists in the wireframe; otherwise omit.

- [ ] **Step 3: Verify**

Run `npx next build`, then check `/about` at 1440px and 768px. Confirm no horizontal scroll, prose measure is comfortable, and every heading level is sequential (h1 → h2 → h3, no skips).

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: rebuild about page in React from the wireframe"
```

---

## Task 7: Consolidate `/stories` and tidy `/initiatives`

**Files:**
- Modify: `src/app/stories/page.tsx`, `src/app/initiatives/page.tsx`
- Reference (read-only): `public/styled.html`, section `id="page-stories"`; `src/app/newsletter/page.tsx`

- [ ] **Step 1: Absorb the newsletter into `/stories`**

`/stories` currently renders only `NewsletterBookshelf`. `/newsletter` renders the fuller `NewsletterSection`. Rewrite `src/app/stories/page.tsx` to carry both concerns:

1. The hero heading that is already there.
2. `<NewsletterSection />` — the full bookshelf, reader and subscribe — inside a section with `id="dispatch"` (the `/newsletter` redirect targets that anchor).
3. The startup portfolio grid from `public/styled.html` `id="page-stories"`: cards carrying `data-sector` values, with working sector filter buttons.

Filter requirements: real `<button>` elements with `aria-pressed`; filtering changes which cards render; the transition is a crossfade at `DURATION.ui`, never an animation of `width` or `height`; an empty filter result shows a helpful empty state, not a blank grid.

- [ ] **Step 2: Tidy `/initiatives`**

`src/app/initiatives/page.tsx` already renders `DeskFolioPage` with a hero. Two changes only: move its hardcoded colors onto the token classes (`surface-cream`, `var(--gec-*)`), and give the `dynamic(ssr: false)` wrapper a reserved height so it does not shift on load. Do not restructure it.

- [ ] **Step 3: Verify**

Run `npx next build`, then check `/stories` and `/initiatives` at 1440px and 768px. Confirm the sector filters work, the empty state appears when a sector has no ventures, and neither page shifts as its dynamic component loads.

- [ ] **Step 4: Commit**

```bash
git add src/app/stories/page.tsx src/app/initiatives/page.tsx
git commit -m "feat: consolidate dispatch and portfolio into stories; tokenize initiatives"
```

---

## Task 8: Route transitions

**Files:**
- Create: `src/components/ViewTransitionLink.tsx`
- Modify: `src/components/Navbar.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `<ViewTransitionLink href>` — a drop-in replacement for `next/link` in the navbar.

- [ ] **Step 1: Write the transition link**

Create `src/components/ViewTransitionLink.tsx`. It wraps `next/link`, intercepts the click, and routes through `document.startViewTransition` when available:

```tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type Props = ComponentProps<typeof Link>;

export function ViewTransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle modified clicks and external targets.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof doc.startViewTransition !== 'function') return; // instant nav fallback
    e.preventDefault();
    doc.startViewTransition(() => {
      router.push(String(href));
    });
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
```

- [ ] **Step 2: Define the wipe in CSS**

Add to `src/app/globals.css`:

```css
@view-transition { navigation: auto; }

::view-transition-old(root) {
  animation: gc-wipe-out var(--dur-layout) var(--ease-out) both;
}
::view-transition-new(root) {
  animation: gc-wipe-in var(--dur-layout) var(--ease-out) both;
}
@keyframes gc-wipe-out { to { transform: translateX(-6%); opacity: 0; } }
@keyframes gc-wipe-in  { from { transform: translateX(6%); opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) { animation: none; }
}
```

- [ ] **Step 3: Use it in the navbar**

In `src/components/Navbar.tsx`, replace the `next/link` imports for the five primary routes with `ViewTransitionLink`. Do not change the navbar's layout, the logo dock target, or any styling.

- [ ] **Step 4: Verify**

Run `npx next build`, then `npx next dev`. Click every navbar link and confirm each lands on the right route with a wipe. Confirm cmd/ctrl-click still opens a new tab. With reduced motion on, confirm navigation is instant and correct.

- [ ] **Step 5: Commit**

```bash
git add src/components/ViewTransitionLink.tsx src/components/Navbar.tsx src/app/globals.css
git commit -m "feat: add view-transition route changes with instant-nav fallback"
```

---

## Task 9: Cleanup — dead code, dead deps, redirects, error boundaries

**Files:**
- Create: `src/app/error.tsx`, `src/app/not-found.tsx`
- Delete: `src/components/StyledPageFrame.tsx`, `src/components/StageManager.tsx`, `src/components/TeamStageManager.tsx`, `src/app/archives/page.tsx`, `src/app/newsletter/page.tsx`
- Move: `public/styled.html` → `docs/wireframe-original.html`
- Modify: `package.json`, `next.config.ts`

- [ ] **Step 1: Confirm nothing imports what you are about to delete**

Run: `grep -rn "StyledPageFrame\|components/StageManager\|components/TeamStageManager" src/`
Expected: no results other than the files themselves. If anything else references them, stop and report — do not delete.

- [ ] **Step 2: Delete the dead files and move the wireframe**

```bash
git rm src/components/StyledPageFrame.tsx src/components/StageManager.tsx src/components/TeamStageManager.tsx
git rm src/app/archives/page.tsx src/app/newsletter/page.tsx
git mv public/styled.html docs/wireframe-original.html
```

Also remove the now-unused `.styled-site-frame` rule from `src/app/globals.css` if one exists.

- [ ] **Step 3: Remove the dead dependencies**

Each of these is imported nowhere in `src/`. Verify with `grep -rn "<name>" src/` before removing each one, then:

```bash
npm uninstall three @react-three/fiber @types/three @base-ui/react lucide-react class-variance-authority cn shadcn tw-animate-css
```

Keep `flubber` (used in `BrandEntranceCurtain`), `motion`, and `web-haptics`.

- [ ] **Step 4: Fix the start script**

In `package.json`, `"start"` currently runs `next dev -H 0.0.0.0 -p 3000`. That is a production-start bug. Change it to `"start": "next start -H 0.0.0.0 -p 3000"`.

- [ ] **Step 5: Add the redirects**

In `next.config.ts`:

```ts
async redirects() {
  return [
    { source: '/archives', destination: '/initiatives', permanent: true },
    { source: '/newsletter', destination: '/stories#dispatch', permanent: true },
  ];
}
```

- [ ] **Step 6: Add the error boundaries**

Create `src/app/error.tsx` (client component, takes `error` and `reset`, offers a retry button) and `src/app/not-found.tsx` (links back to the five routes). Both use the token layer and match the site's voice.

- [ ] **Step 7: Verify**

Run: `npx next build`
Expected: PASS with no unresolved imports.

Then `npx next dev` and confirm: `/archives` redirects to `/initiatives`, `/newsletter` redirects to `/stories#dispatch` and lands on the dispatch section, a nonexistent route renders the 404 page, and the entrance curtain still works (it uses `flubber`, which you kept).

Run the motion check one final time: it must still pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: remove iframe wireframe, dead shims and unused deps; add redirects and error boundaries"
```

---

## Final verification (controller runs this after Task 9)

- `npx next build` passes
- Motion check passes
- 1440px: all five routes render correctly, no horizontal scroll
- 768px: all five routes render correctly, no horizontal scroll
- `prefers-reduced-motion: reduce`: every act still reads; curtains are static bands
- JS disabled: all content present on every route
- No layout shift as the two `ssr: false` components load
- Contrast: body text ≥4.5:1, large text ≥3:1, including muted-on-cream and gold-on-crimson
