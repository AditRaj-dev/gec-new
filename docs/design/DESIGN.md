# Semantic Design System: GEC Website Architecture (Iteration 2)

> **Standard:** Taste-Design × Impeccable × UI-UX Pro Max  
> **Target:** Galgotias Entrepreneurship Cell (GEC) Digital Platform  
> **Format:** Strict Semantic Guidelines, Architectural Principles & Anti-Slop Directive

---

## 1. Visual Theme & Atmosphere

- **Atmosphere:** Modern Indian startup editorial meets student energy and GEC heritage. A crisp, publication-grade architectural canvas that balances institutional gravitas with high-agency entrepreneurial momentum.
- **Density Index:** `5.5 / 10` (Daily App Balanced to Gallery Airy). Generous spatial margins, no suffocated containers, strict breathing room between cognitive zones.
- **Variance Index:** `7.5 / 10` (Offset Asymmetric). Strictly rejects sterile, repetitive 3-column card layouts in favor of dynamic 7:5 asymmetric hero splits, 2-column magazine spreads, horizontal milestone timelines, and structured bento matrices.
- **Motion Index:** `6.0 / 10` (Fluid Spring Physics & Micro-Restraint). Weighted physics (`stiffness: 100, damping: 20`), hardware-accelerated transforms (`transform`, `opacity`), and mandatory `prefers-reduced-motion` compliance.

---

## 2. Color Calibration & Roles

Calibrated to the frozen GEC brand identity with high-contrast accessibility verification (WCAG AAA for text, AA for UI boundaries). Pure black (`#000000`) is strictly forbidden.

| Semantic Token | Hex Code | OKLCH Equivalent | Functional Role & Contrast Constraint |
|:---|:---|:---|:---|
| `--gec-canvas` | `#FCF8ED` | `oklch(97.6% 0.015 88.5)` | Primary canvas surface (Warm Cream). Soft natural paper tone. |
| `--gec-surface-sand`| `#F4E2CA` | `oklch(90.8% 0.035 72.3)` | Secondary surface (Soft Sand) for alternate rhythm sections. |
| `--gec-surface-card`| `#FFFDF8` | `oklch(99.2% 0.006 88.0)` | Elevated card surfaces. High-contrast base for readability. |
| `--gec-crimson` | `#A3040F` | `oklch(43.5% 0.185 27.5)` | Primary brand accent. Headings, borders, primary CTAs. (7.2:1 against Canvas). |
| `--gec-crimson-act`| `#C62F29` | `oklch(51.2% 0.210 28.0)` | Active button hover, live event tags, focused badges. |
| `--gec-gold` | `#FBCA05` | `oklch(82.4% 0.170 85.0)` | Controlled micro-accent. Metrics, category pills, highlight lines. |
| `--gec-blue` | `#1F7EC0` | `oklch(54.6% 0.145 238.0)`| Technical Team accent, ecosystem link highlights. |
| `--gec-ink` | `#222222` | `oklch(22.0% 0.000 0.0)` | Deep Charcoal body text. Replaces pure black. (12.8:1 against Canvas). |
| `--gec-ink-muted` | `#5F5650` | `oklch(45.0% 0.018 65.0)` | Secondary metadata, captions, structural labels. Verified ≥ 4.5:1. |
| `--gec-border` | `rgba(163,4,15,0.22)`| — | Structural 1px boundary lines. Never side-stripes. |

### Color Balance Ratio
`60%` Neutral Canvas (`#FCF8ED` / `#FFFDF8`) · `25%` Deep Crimson (`#A3040F`) · `10%` Charcoal Ink (`#222222`) · `3%` Gold (`#FBCA05`) · `2%` Blue (`#1F7EC0`).

---

## 3. Typographic Architecture

Typography is weight-driven and personality-rich. Generic AI font reflexes are eliminated.

| Hierarchy Level | Font Family | Size Range (`clamp`) | Weight | Tracking | Leading | Wrap Rule |
|:---|:---|:---|:---:|:---:|:---:|:---|
| **Display / H1** | `Cabinet Grotesk`, `Archivo`, sans-serif | `clamp(2.5rem, 5vw, 4.5rem)` | `800 / 900` | `-0.035em` | `1.05` | `text-wrap: balance` |
| **Section Title / H2** | `Cabinet Grotesk`, sans-serif | `clamp(1.75rem, 3.5vw, 2.75rem)` | `800` | `-0.025em` | `1.15` | `text-wrap: balance` |
| **Subsection / H3** | `Manrope`, sans-serif | `clamp(1.25rem, 2vw, 1.65rem)` | `700` | `-0.015em` | `1.25` | `text-wrap: balance` |
| **Body Text** | `Manrope`, sans-serif | `1.0rem (16px)` | `400 / 500`| `0` | `1.6` | `max-w: 68ch; text-wrap: pretty` |
| **Metadata / UI** | `Manrope`, sans-serif | `0.8125rem (13px)` | `600` | `+0.02em` | `1.4` | — |
| **Code / Coordinates**| `JetBrains Mono`, monospace | `0.75rem (12px)` | `500` | `0` | `1.3` | — |

**Font Bans:**
- `Inter` is BANNED (prevents generic template feel).
- Generic serif fonts (`Times New Roman`, `Georgia`) are BANNED.
- Heading scales above `6rem` (96px) are BANNED (page must design, not shout).

---

## 4. Component Stylings & Interaction Rules

- **Buttons:**
  - Height: `48px` default (minimum `44px` touch target for mobile).
  - Tactile push feedback: `transform: translateY(-1px)` on hover, `translateY(1px)` on active.
  - No neon button glows or diffuse gradient halos.
  - Border radius: `8px` (`--radius-sm`).
- **Cards & Surfaces:**
  - Used ONLY when elevation communicates semantic containment.
  - 1px crisp borders (`rgba(163, 4, 15, 0.2)`).
  - No side-stripe borders (`border-left: 4px solid ...` is strictly banned).
  - Shadow: Soft, warm ambient occlusion (`box-shadow: 0 4px 20px rgba(34, 34, 34, 0.04)`).
- **Icons & Affordances:**
  - **Zero Emojis:** Emojis are strictly banned from UI elements. All icons are inline SVGs with standard `viewBox="0 0 24 24"`.
  - `cursor: pointer` is mandatory on all interactive cards, filters, and buttons.
- **Form Controls:**
  - Height: `44px`. Structural border `1px solid rgba(34,34,34,0.25)`.
  - Focus state: `outline: 2px solid var(--gec-crimson); outline-offset: 2px`.

---

## 5. Layout & Spatial Grid Principles

- **Canvas Boundary:** Max-width `1440px` with responsive container max-width `1320px`.
- **12-Column Layout Grid:** Desktop `12 columns` with `24px gutters` and `48px side margins`.
- **Section Vertical Rhythm:**
  - Main section padding: `clamp(60px, 8vw, 100px) 48px`.
  - Section gaps: `32px` between primary cards, `16px` between micro-components.
- **Asymmetry over Repetition:**
  - Hero: Asymmetric `7:5 split` (Typography & Actions Left / Visual Canvas Right).
  - What's Happening: 4-item dynamic bento grid (`6-col`, `3-col`, `3-col`, `12-col`).
  - Stories: 7:5 featured lead split + 2-column editorial magazine spread.

---

## 6. Motion Philosophy

- **Physics Default:** `cubic-bezier(0.16, 1, 0.3, 1)` (Quartic ease-out) for all interactive states.
- **Timing:** Micro-interactions `150ms–250ms`. Layout reveals `350ms`.
- **Properties:** Transitions applied exclusively to `transform` and `opacity` to preserve 60/120fps hardware acceleration.
- **Accessibility:** Mandatory `@media (prefers-reduced-motion: reduce)` disabling all translation and easing in favor of instant opacity state changes.

---

## 7. Strict Anti-Patterns (The Banned AI Tells)

1. **NO Emojis as UI Icons** (No 🎯, 🚀, 💡 — use crisp inline SVGs).
2. **NO Side-Stripe Accent Borders** (`border-left > 1px` on cards is forbidden).
3. **NO Gradient Text** (`background-clip: text` is banned).
4. **NO Default Glassmorphism** (No blurry saturated glass cards).
5. **NO 3-Column Equal Card Repetition** on every section.
6. **NO Generic Eyebrows on Every Block** (No repetitive `ABOUT / 01` kickers).
7. **NO Pure Black (`#000000`)** (Always use Deep Charcoal `#222222`).
8. **NO Content Overlap** (Every element has its dedicated, calibrated spatial zone).
9. **NO Fabricated Numbers** (In wireframe mode, all metrics use structural `[XX]+` counter boxes).
10. **NO Horizontal Scroll on Mobile** (Strict single-column stack below `768px`).

---

## 8. Mobile-First Responsive Architecture & Touch-Zone Doctrine

Synthesizing `/responsive-design` and `/mobile-design` standards to guarantee flawless usability on handheld touchscreens while preserving 100% desktop fidelity.

### 8.1 Breakpoint Strategy & Viewport Scopes
- **Desktop Primary Canvas (`> 1024px` / `.viewport-desktop`):** Full 12-column grid, asymmetric splits (7:5, 6:6), persistent expanded navbar, generous multi-tier spatial margins.
- **Tablet Intermediate (`769px – 1024px` / `.viewport-tablet`):** 2-column reduction, balanced typography scale, stacked asymmetric hero blocks.
- **Mobile Phone Core (`≤ 768px` / `.viewport-mobile`):** Strict single-column vertical linear stack, 4-column mobile blueprint grid, touch-calibrated targets.
- **Dual-Scope Enforcement:** All mobile rules are declared for both `@media (max-width: 768px)` (physical device viewports) and `#gec-canvas-root.viewport-mobile` (in-canvas simulator), preventing any leakage into desktop displays.

### 8.2 The 4-Column Mobile Grid Framework
- **Desktop 12-Col to Mobile 4-Col Conversion:**
  - Phone canvas uses 4 active columns (`M01`–`M04`) with `12px` gutters and `16px` edge margins.
  - Columns 5–12 are systematically hidden (`display: none !important`).
  - Total container width is bounded strictly within the screen boundary (`100%` / `390px`).

### 8.3 Fitts' Law & Touch-Target Calibration
- **Strict Minimum Touch Target:** All interactive slots (buttons, navigation items, filter chips, accordion toggles) have a minimum dimension of `44px × 44px` (recommended `48px` for primary CTAs).
- **Mobile Action Stacking:** Side-by-side button pairs (e.g. `210px` + `180px` = `390px+`) cause catastrophic horizontal overflow on phones. On mobile, all action button containers switch to `flex-direction: column !important; width: 100% !important;`.
- **Thumb Zone Ergonomics:** Primary navigation triggers (hamburger menu, active drawers, filter chips) are placed within standard single-thumb reach zones.

### 8.4 Zero Horizontal Overflow Doctrine
- **Root Overflow Lock:** `#gec-canvas-root` and viewport containers enforce `overflow-x: hidden !important;`.
- **Skeleton Clamping:** All skeleton placeholders (`.skel-title-h1`, `.skel-title-h2`, `.skel-line`) and cards enforce `max-width: 100% !important;` to prevent fixed-width bleed.
- **Stamp Clamping:** Section coordinate badges (`.section-id-stamp` and `.section-coord-stamp`) clamp to `max-width: 58%` and `38%` respectively with `text-overflow: ellipsis`, preventing cross-element overlap on narrow viewports.

### 8.5 Fluid Mobile Navigation & Drawer Mechanics
- **Collapsed Header:** Header height downscales from `76px` to `64px`. Desktop link list and secondary CTAs hide (`display: none !important;`).
- **Tactile Hamburger Affordance:** Dedicated `44px × 44px` high-contrast crimson toggle button (`.mobile-nav-toggle-slot`).
- **Slide-Down Menu Drawer:** `.wf-mobile-nav-drawer` exposes clean `44px` vertical links for all 5 frozen pages, complete with page active-state indicators and a full-width crimson CTA button.
- **Auto-Dismiss:** Navigating to any page automatically closes the drawer and scrolls the canvas to top.

### 8.6 Mobile Section Transformations
- **Page 01 (Home):**
  - Hero: 7:5 split collapses to 1-column stack. CTA buttons stack vertically at 100% width.
  - Bento Grid: 4-card matrix transforms from asymmetric spans (`span 6`, `span 3`, `span 12`) to a single linear stack (`span 1`).
  - Impact Metrics: 4-column counter row converts into a neat 2×2 grid (`repeat(2, 1fr)`).
- **Page 02 (About):**
  - 6:6 Narrative split collapses to vertical order (text above diagram).
  - 50/50 Mission & Vision cards stack vertically.
  - Alternating center-line timeline converts to a single left-aligned vertical spine (`padding-left: 32px;`).
- **Page 03 (Teams):**
  - Horizontal team roster cards (Index + Title + Chips + CTA) collapse to single-column vertical cards.
  - 7 quick jump chips switch to a smooth horizontal overflow strip with hidden scrollbars.
- **Page 04 (Initiatives):**
  - 3-column initiative grid collapses to 1-column stack.
  - 4-stage horizontal process stepper re-flows into a single-column vertical step progression.
- **Page 05 (Stories):**
  - 2-column founder profiles and 4-column startup directory cards collapse into responsive 1-column cards.
  - Category filters transform into a fluid touch-swipeable horizontal chip carousel.

