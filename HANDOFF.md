# Galgotias Entrepreneurship Cell (GEC) — Master Project Handoff Document

> **Document Classification:** Master Architecture & Engineering Handoff  
> **Status:** Frozen Specifications & Active Prototypes  
> **Git Commit:** `0d1c7df` (Branch: `main`)  
> **Repository Location:** `E:\GEC`  
> **Date of Publication:** September 20, 2026  
> **Target Audience:** Frontend Engineers, Motion Designers, CMS Developers, UI/UX Leads, Product Managers, Autonomous AI Agents

---

## 1. Executive Summary & Vision

The **Galgotias Entrepreneurship Cell (GEC)** platform is the flagship digital ecosystem representing the premier student-led entrepreneurship incubator at Galgotias University. The platform bridges institutional heritage with hyper-modern venture acceleration, connecting student innovators, alumni founders, venture capitalists, and industry partners.

### Core Architectural Pillars
1. **Academic Prestige × Venture Dynamism:** Visual balance of classical typography (editorial serifs) paired with engineering precision (monospaced telemetry, 12-column blueprints, tactile borders).
2. **Zero Dead UI / Complete Interaction:** Every single button, chip, filter, tab, and CTA across all prototypes produces tangible feedback (interactive modals, real-time DOM filtering, dynamic sub-canvas re-rendering, client-side CSV downloads, or themed toasts).
3. **Unified Brand Motion:** A signature brand entrance sequence where the assembled multi-component logo converges at viewport center and **morphs dynamically into the sticky topbar navigation logo**, gracefully unveiling the underlying page without disturbing the hero section.
4. **Dual-Environment Architecture:**
   - **Public Website (`wireframes-v2/`):** 5-page responsive experience (Desktop 1440px + Mobile 390px) following Fitts' Law and zero-horizontal-overflow rules.
   - **CMS Command Center (`cms-wireframes/`):** 11-module operational back-office managing rosters, initiatives, editorial layouts, submissions triage, access control, and rollback operations.

---

## 2. Complete File & Directory Inventory

```
E:\GEC/
├── .git/                                   # Git repository root (branch: main)
├── .gitignore                              # Production ignore rules (node_modules, build, out, logs)
├── README.md                               # Project intro & Remotion video guide
├── HANDOFF.md                              # [THIS FILE] Master context & engineering handoff
├── package.json                            # Remotion CLI, React 18, TypeScript dependencies
├── package-lock.json                       # Locked dependency tree
├── tsconfig.json                           # TypeScript compiler configuration
├── remotion.config.ts                      # Remotion video rendering setup
│
├── docs/                                   # FROZEN SPECIFICATION DOCTRINE
│   ├── GEC_Brand_Colour_Schema_Frozen.md   # Official 5-token palette, contrast ratios, typography
│   ├── GEC_Website_Site_Map_Frozen.md      # Frozen 5-page public website hierarchical structure
│   ├── GEC_CMS_Site_Map_Frozen.md          # Frozen 11-module CMS back-office site map
│   └── GEC_Website_Complete_Content_Frozen.md # Exhaustive copy, headlines, FAQs, bios, and labels
│
├── wireframes-v2/                          # ACTIVE PUBLIC WEBSITE WIREFRAME ENGINE
│   ├── index.html                          # 5-Page interactive wireframe engine (Desktop + Mobile)
│   └── DESIGN.md                           # Taste-Design × Mobile-First UI design system
│
├── cms-wireframes/                         # ACTIVE CMS COMMAND CENTER WIREFRAME
│   ├── index.html                          # 11-Module interactive back-office console (91 controls)
│   └── CMS-ARCHITECTURE.md                 # CMS data schemas, workflows, and state machines
│
├── wireframes.html                         # UNTOUCHED BASELINE REFERENCE (Iteration 1 Archive)
├── demo.html                               # Standalone browser player with frame scrubber
├── fix.js                                  # Node script for SVG coordinate & aspect ratio repairs
├── update_animations.js                    # Animation timing tuner script
├── inspect_c_parts.html / .png             # Vector inspection diagnostics for logo letter 'C'
│
├── src/                                    # REMOTION & REACT MOTION SOURCE CODE
│   ├── index.ts                            # Remotion root registration
│   ├── Root.tsx                            # Root compositions (Light, Dark, Square, Transparent)
│   ├── LogoAnimation.tsx                   # Remotion motion choreography (useCurrentFrame, springs)
│   ├── WebsiteLoader.tsx                   # Standalone zero-dependency React entrance preloader
│   └── logoData.ts                         # SVG path geometry, anchor points, and color tokens
│
└── concepts/                               # MOTION EXPLORATION LAB
    ├── index.html                          # 3-concept visual comparison deck
    ├── shared.css                          # Concept styling tokens
    ├── direction-01-orbit.html             # Orbital convergence study
    ├── direction-02-ignition.html          # Filament spark study
    └── direction-03-blueprint.html         # Technical blueprint schematic study
```

---

## 3. Brand Entrance Motion Choreography: The Topbar Morph Handshake

### 3.1 Architectural Requirement
> **CRITICAL DIRECTIVE:** The animated logo intro / entrance sequence **MUST transform directly into the sticky topbar navigation logo (`#navbar-brand-logo`)**, and **NOT** into the Hero canvas section.

The Hero canvas remains dedicated to its display typography (`H1 DISPLAY`), asymmetric 7:5 media layout, orbital ambient canvas, and primary action cluster. The logo arrives from the heavens of the viewport and docks directly into its permanent home in the navigation bar.

```
+-----------------------------------------------------------------------------------------------------+
| STAGE 1: Fullscreen Curtain (t = 0.0s – 2.8s)                                                       |
|                                                                                                     |
|                                     [ G-E-C LOGO CONVERGENCE ]                                      |
|                                         (Viewport Center)                                           |
|                                       x: 50vw | y: 50vh | Scale: 1.0                                |
|                                                                                                     |
+-----------------------------------------------------------------------------------------------------+
                                                 │
                                                 │  FLIP Transform & Flight (t = 2.8s – 3.5s)
                                                 ▼
+-----------------------------------------------------------------------------------------------------+
| STAGE 2: Navbar Docking & Curtain Unveil (t = 3.5s – 4.0s)                                          |
|                                                                                                     |
|  [DOCKING TARGET: NAVBAR BRAND SLOT]                                                                |
|  top: 17px | left: ~32px | w: 140px | h: 42px                                                      |
|  (Scale: 0.28, Transform Origin: Top Left)                                                          |
|                                                                                                     |
|  ═════════════════════════════════════════════════════════════════════════════════════════════════  |
|  PAGE UNVEILED BELOW: [HERO TYPOGRAPHY] ── [ORBIT AMBIENT CANVAS] ── [CTA ACTION CLUSTER]         |
+-----------------------------------------------------------------------------------------------------+
```

### 3.2 Choreography Timeline & Physics Specification

| Frame Range (60fps) | Milliseconds | Animation Phase | Visual Action & Springs |
| :--- | :--- | :--- | :--- |
| **F00 – F48** | `0ms – 800ms` | **Hero 'G' Assembly** | • Red Arc (`#A3040F`) swoops from top-left spiral (`damping: 14, stiffness: 85`).<br>• Yellow Crescent (`#FBCA05`) sweeps from bottom-left.<br>• Blue Crescent (`#1E40AF`) locks into fold.<br>• Sacred Saraswati Emblem (`#FBCA05`, 224 vectors) scales up at center core with radial shockwave. |
| **F48 – F80** | `800ms – 1333ms`| **'E' & 'C' Arrival** | • Assembled 'G' glides left to `x = 105px`.<br>• Letter 'E' (`#A3040F`) drops into place.<br>• Letter 'C' (`#A3040F`) slides in from right margin. |
| **F80 – F110** | `1333ms – 1833ms`| **Bulb Ignition & Subtitle** | • Lightbulb cutout inside 'C' illuminates with warm glow filter (`#FBCA05`) and filament spark.<br>• Subtitle *"GALGOTIAS ENTREPRENEURSHIP CELL"* cascades into view with staggered opacity wave. |
| **F110 – F168**| `1833ms – 2800ms`| **Settled Brand Pause** | • Full brandmark rests in crisp equilibrium.<br>• Subtle diagonal light shimmer sweeps across vector paths. |
| **F168 – F210**| `2800ms – 3500ms`| **THE FLIP DOCKING FLIGHT** | • **Target coordinates calculated:** Bounds of `#navbar-brand-logo`.<br>• Logo initiates coordinate translation: `ΔX = Target.left - Center.left`, `ΔY = Target.top - Center.top`.<br>• Scale contracts smoothly from `1.0` to `Target.width / Logo.width` (~`0.28`).<br>• Motion Curve: `cubic-bezier(0.16, 1, 0.3, 1)` or Spring (`stiffness: 120, damping: 18, mass: 1`). |
| **F210 – F240**| `3500ms – 4000ms`| **Curtain Dissolve & Handoff**| • Background overlay opacity drops from `1.0` to `0.0`.<br>• Pointer events unlock on the main document.<br>• Motion logo hands off rendering to native sticky navbar logo.<br>• Preloader component cleanly unmounts from DOM. |

### 3.3 Production Implementation Code Snippet (FLIP Transition)

```tsx
// src/components/BrandEntranceCurtain.tsx
import React, { useEffect, useRef, useState } from 'react';
import { WebsiteLoader } from './WebsiteLoader';

interface BrandEntranceProps {
  onDockComplete?: () => void;
}

export const BrandEntranceCurtain: React.FC<BrandEntranceProps> = ({ onDockComplete }) => {
  const [stage, setStage] = useState<'animating' | 'docking' | 'complete'>('animating');
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({});
  const logoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Wait for Remotion/SVG animation to settle (2800ms)
    const settleTimer = setTimeout(() => {
      setStage('docking');
      
      // 2. Measure target navbar logo slot (First, Last, Invert, Play)
      const targetSlot = document.getElementById('navbar-brand-logo');
      const logoEl = logoWrapperRef.current;
      
      if (targetSlot && logoEl) {
        const first = logoEl.getBoundingClientRect();
        const last = targetSlot.getBoundingClientRect();
        
        const deltaX = last.left - first.left;
        const deltaY = last.top - first.top;
        const scale = last.width / first.width;

        // 3. Apply hardware-accelerated FLIP translation
        setTransformStyle({
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
          transformOrigin: 'top left',
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease 400ms',
        });
      }

      // 4. Complete transition & reveal site
      const completeTimer = setTimeout(() => {
        setStage('complete');
        if (onDockComplete) onDockComplete();
      }, 750);

      return () => clearTimeout(completeTimer);
    }, 2800);

    return () => clearTimeout(settleTimer);
  }, [onDockComplete]);

  if (stage === 'complete') return null;

  return (
    <div className={`brand-entrance-curtain ${stage === 'docking' ? 'curtain-fade' : ''}`}>
      <div ref={logoWrapperRef} style={transformStyle} className="docking-logo-container">
        <WebsiteLoader autoDismiss={false} durationMs={2800} />
      </div>
    </div>
  );
};
```

---

## 4. Public Website Architecture (`wireframes-v2/`)

The public wireframe engine is fully responsive, supporting **Desktop 1440px**, **Tablet 768px**, and **Mobile 390px** viewports. Every page contains sticky navigation with a mobile hamburger drawer, tactile action slots, and interactive modals.

### Page 01: Home (`navigatePage('home')`)
- **1.1 Hero Section (7:5 Split):** Display headline with dual skeleton lines, brand motto pill (*"Ignite · Incubate · Accelerate"*), dual CTAs (`[EXPLORE INITIATIVES]` and `[DISCOVER GEC]`), and the ambient orbital Remotion visualization.
- **1.2 Live Telemetry Ribbon:** 4 key metrics cards (Active Startups, Funding Raised, Student Founders, Corporate Network) with mono counters and live delta badges.
- **1.3 Asymmetric 4-Slot Bento Grid:**
  - *Slot 01 (Major Event):* Interactive `[VIEW EVENT →]` opening the Event Registration Modal.
  - *Slot 02 (Incubation Intake):* Interactive `[APPLY NOW]` opening the SDP Cohort 04 Application Modal.
  - *Slot 03 (Editorial Spotlight):* Interactive `[READ STORY →]` opening the long-form Article Reader Modal.
  - *Slot 04 (Portfolio Spotlight):* Interactive `[EXPLORE STARTUP →]` triggering live portfolio profile navigation.
- **1.4 Flagship Initiatives Tier:** 3 featured program cards with route tags and clickable exploration triggers.
- **1.5 Milestone Timeline Horizon:** Chronological cards with `RELIVE THE MOMENT →` modals.
- **1.6 Editorial Showcase & Founder Voices:** Magazine cards with full reader modals.
- **1.7 Ecosystem Leaders & Mentors:** Speaker cards with live speaker profile toasts.
- **1.8 Strategic Partners Marquee:** Tier 1 and Tier 2 partner boxes with live affiliation toasts.
- **1.9 Conversion Footer:** Global sitemap, social icons, and application triggers.

### Page 02: About (`navigatePage('about')`)
- **2.1 Heritage Hero:** Historical trajectory, establishment context, and university charter alignment.
- **2.2 Core Philosophy & Dual Creed:** Innovation mindset vs. Execution discipline comparison matrix.
- **2.3 Three-Pillar Mission Canvas:** Discovery, Incubation, and Scaling operational pillars.
- **2.4 Governance & Mentorship Council:** Senior advisory board profiles and industry mentors.
- **2.5 Tier 3 Bridge:** Direct navigational pathway to the 7 functional teams.

### Page 03: Teams (`navigatePage('teams')`)
- **7-Team Quick Filter Pills:** Real-time jump pills for:
  1. Corporate Relations
  2. Operations & Logistics
  3. Public Relations & Marketing
  4. Technical & Design
  5. Research & Incubation
  6. Finance & Sponsorship
  7. Events & Hospitality
- **Dynamic Sub-Canvas Blueprint Canvas (`#team-detail-blueprint`):**
  - Clicking any team card instantly populates this dedicated canvas with that team's exact title, badge, route code, mission statement, 6 responsibility matrix cards, team head profile, and direct `[APPLY TO TEAM]` CTA.
  - Zero page reload; instantaneous DOM re-rendering via `PUBLIC_TEAMS_DATA`.

### Page 04: Initiatives (`navigatePage('initiatives')`)
- **Sub-Nav Status Filter Chips:** Filter by `All Initiatives`, `Applications Open`, `Ongoing`, or `Upcoming`.
- **Dynamic Initiative Blueprint Canvas (`#initiative-detail-blueprint`):** Populates program eligibility, cohort size, equity terms, and dates via `PUBLIC_INITIATIVES_DATA`.
- **Interactive 4-Stage Stepper:** Clickable pipeline stages (`Stage 01: Application` → `Stage 02: Pitch Review` → `Stage 03: Incubation` → `Stage 04: Demo Day`) with toast previews.
- **Interactive Collapsible FAQ Accordion:** Clickable questions that toggle smooth answers with animated `+` / `×` symbols.
- **Live Application Form:** Validates applicant name, email, track selection, and pitch deck upload with simulated ticket generation (`#SUB-2026-XXXX`).

### Page 05: Stories & Portfolio (`navigatePage('stories')`)
- **Editorial Sub-Nav Chips:** Category switching (`All`, `News`, `Founder Stories`, `Startup Stories`, `Events`).
- **Hero Editorial Feature & Magazine Grid:** Full modal reading view.
- **Startup Portfolio Directory:**
  - Interactive sector filter chips: `All Sectors`, `Tech`, `Consumer`, `Health`, `Sustainability`.
  - Hides/shows startup cards with matching tags; includes `[VISIT SITE ↗]` simulated external links.

---

## 5. CMS Command Center Architecture (`cms-wireframes/`)

The CMS console operates as a single-page management dashboard with 11 specialized operational modules and **91 active interactive controls**.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| CMS TOPBAR: Status [STAGING ENGINE ACTIVE] | [Live Site Preview ↗] | [System Check] | [Admin Profile] |
+───────────────────────────────────┬───────────────────────────────────────────────────────────────+
| MODULE NAVIGATION RAIL            | WORKSPACE CANVAS                                              |
| 01. Global Overview & Staging     | ───────────────────────────────────────────────────────────── |
| 02. Team Roster Management        | Module View Container (#cms-module-root)                       |
| 03. Team Identity & Verticals     | • Dynamic Diff View & Publish Approvals                       |
| 04. Initiatives & Steppers        | • 7-Team Tab Filtering & Client-side CSV Download             |
| 05. Editorial & Bento Manager     | • Bento Grid vs. Magazine Grid View Switcher                  |
| 06. Stakeholder Directory         | • Startups vs. Partners Directory Table Toggle                |
| 07. Media Assets & CDN            | • Media Audit Inspection & CDN URL Copier                     |
| 08. Submissions Queue & Triage    | • Live Triage Actions (Approve, Revision, Reject)             |
| 09. Access Control & RBAC         | • User Role Matrix & Session Revocation Modals                |
| 10. Reports & Analytics Engine    | • Instant CSV Performance Report Generator                    |
| 11. Deployments & Rollbacks       | • Release History & Instant Safety Rollback Triggers          |
+───────────────────────────────────┴───────────────────────────────────────────────────────────────+
```

### Module Breakdown & Interactive Action Matrix

| Module ID | Primary Purpose | Key Controls & Interactions |
| :--- | :--- | :--- |
| **01. Global Overview** | Staging status, pipeline metrics, and pending changes review | • `[REVIEW CHANGES]`: Opens side-by-side visual diff comparison modal.<br>• `[PUBLISH ALL PENDING]`: Publishes staged edits to production.<br>• `[DISCARD STAGED DRAFTS]`: Resets local staging environment. |
| **02. Team Roster** | Member records, leadership positions, recruitment status | • 7-team tab filter bar switching between all teams.<br>• `[ADD MEMBER]`: Opens registration modal.<br>• `[EXPORT CSV]`: Triggers immediate client-side browser download of roster data (`gec_team_roster_2026.csv`). |
| **03. Team Identity** | Vertical descriptions, meeting cadences, and budget limits | • 7 team identity cards with live editing triggers.<br>• Modal for adjusting team lead, meeting day, and budget. |
| **04. Initiatives Manager**| Program timelines, intake toggles, application forms | • Tab switching between SDP, E-Summit, and SeedFund.<br>• Live toggle for opening/closing application intakes.<br>• Stepper milestone editor modal. |
| **05. Editorial Engine** | Bento Grid priority assignment and story publishing | • **Bento vs. Magazine View Toggle** (`toggleEditorialView`): Switches layout preview.<br>• `[NEW STORY DRAFT]`: Opens rich editorial editor modal.<br>• `[SAVE DRAFT]` / `[SCHEDULE PUBLICATION]`. |
| **06. Stakeholder Directory**| Portfolio startups, angel networks, corporate partners | • **Startups vs. Corporate Partners Tab Switcher** (`setStakeholderTab`): Toggles data tables.<br>• `[ADD STARTUP]` / `[ADD PARTNER]`: Opens onboarding modals.<br>• Filter by sector and funding stage. |
| **07. Media Asset Library**| Image/video CDN assets, storage quotas, aspect ratios | • Storage quota progress gauge.<br>• `[UPLOAD NEW ASSET]`: Simulated file intake.<br>• `[INSPECT]`: Opens asset modal with dimensions and copy-URL action.<br>• `[COPY CDN URL]`: Copies URL to clipboard with confirmation toast. |
| **08. Submissions Queue** | Intake triage for cohort applications and venture decks | • Interactive triage buttons: `[APPROVE & PASS TO STAGE 2]`, `[REQUEST REVISION]`, `[REJECT]`.<br>• `[VIEW PITCH DECK]`: Opens slide deck inspection modal.<br>• Real-time counter of unread submissions. |
| **09. System Audit & RBAC**| Role permissions matrix and active admin sessions | • `[EDIT ROLE PERMISSIONS]`: Opens capability checkboxes modal (Lead, Editor, Viewer).<br>• `[REVOKE ACCESS]`: Instantly revokes session tokens with warning confirmation. |
| **10. Reports Engine** | Performance analytics, conversion tracking, data export | • `[EXPORT PERFORMANCE REPORT (CSV)]`: Downloads `gec_performance_analytics_2026.csv` with live event attendance, application funnels, and page views. |
| **11. Deployments** | Production release pipeline and emergency fallback | • Version release timeline with commit hashes.<br>• `[INSTANT ROLLBACK]`: Opens critical safety modal with 5-second countdown to revert to previous stable snapshot (`v2.4.1`). |

---

## 6. Frozen Brand Design System & Tokens

### 6.1 Color Palette Tokens
| Token Name | Hex Code | Role & Strategic Usage |
| :--- | :--- | :--- |
| **Warm Cream** | `#FCF8ED` | **Primary Canvas Background.** Replaces sterile `#FFFFFF` with warm academic prestige. |
| **Soft Sand** | `#F4E2CA` | **Secondary Structural Tint.** Used for cards, tables, blueprint fills, and sidebars. |
| **Deep Crimson** | `#A3040F` | **Dominant Brand Voice & Accent.** Borders, primary CTA buttons, active links, logos. |
| **Charcoal** | `#222222` | **Primary High-Contrast Ink.** Display typography, body copy, structural dark fills. |
| **Academic Gold** | `#FBCA05` | **Illumination & Highlighting.** Innovation bulb filaments, milestone stars, badges. |

### 6.2 Typography Hierarchy
- **Display Headlines:** Serif / Neo-Classic Display font (`Playfair Display` / `Cinzel` / `Newsreader`), 48px–72px, bold, tracking `-0.02em`.
- **Interface & Body:** Clean Neo-Grotesque Sans (`Inter` / `Plus Jakarta Sans`), 14px–18px, weights `400`, `500`, `600`.
- **Engineering Stamps & Metas:** High-legibility Monospace (`JetBrains Mono` / `Space Mono`), 10px–13px, uppercase, tracking `+0.08em`.

### 6.3 Tactile Surface Standards
- **Borders:** Consistent `1.5px solid #A3040F` or `1px solid rgba(163, 4, 15, 0.2)`. Never blurry drop shadows.
- **Corners:** Deliberate sharp geometry (`border-radius: 4px` for pills/chips, `6px` for cards, `0px` for technical blueprints).
- **Elevations:** Tactile hard offset shadows: `box-shadow: 4px 4px 0px #A3040F` on active interactive cards.

---

## 7. Recommended Production Stack & Next Phase Roadmap

```
+─────────────────────────────────────────────────────────────────────────────+
| FRONTEND APPLICATION                                                        |
| Next.js 15 (App Router) + React 19 + TypeScript                             |
| Styling: Tailwind CSS v4 (theme configured with frozen tokens)              |
| Motion: Framer Motion (layout animations) + Remotion (logo choreography)    |
+──────────────────────────────────────┬──────────────────────────────────────+
                                       │ REST / tRPC / Server Actions
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
| BACKEND & CMS STORAGE                                                       |
| Database: PostgreSQL (via Supabase or Neon)                                 |
| ORM: Prisma or Drizzle ORM                                                  |
| Auth: NextAuth.js / Supabase Auth (RBAC: Superadmin, Team Lead, Editor)      |
| Storage: Cloudflare R2 / AWS S3 (Pitch decks, speaker headshots, videos)     |
+─────────────────────────────────────────────────────────────────────────────+
```

### Phase 1: Logo Preloader & Entrance Integration (Next Immediate Step)
1. Mount `<BrandEntranceCurtain />` at root layout (`app/layout.tsx`).
2. Implement FLIP coordinate handshake between fullscreen preloader and sticky `<header id="navbar-brand-logo">`.
3. Support `prefers-reduced-motion` media query to immediately dock without camera shake.

### Phase 2: Public Website Next.js Component Migration
1. Migrate `wireframes-v2/index.html` structure into modular React Server Components (`app/(public)/page.tsx`, `teams/page.tsx`, etc.).
2. Connect `PUBLIC_TEAMS_DATA` and `PUBLIC_INITIATIVES_DATA` to Postgres tables or static JSON endpoints.
3. Integrate Formspree / Resend / Supabase for live submission intake into the triage queue.

### Phase 3: CMS Console Authentication & API Hookup
1. Wrap `cms-wireframes/` in protected session middleware (`app/admin/`).
2. Connect the 11 modules to database tables with optimistic UI updates.
3. Hook up CSV export endpoints and file upload endpoints for media assets.

---

## 8. Verification & Quick-Start Guide

### Testing the Interactive Public Wireframes
Open [`wireframes-v2/index.html`](file:///E:/GEC/wireframes-v2/index.html) in any modern browser:
- Switch viewports using top toolbar buttons (**1440px**, **768px**, **390px**).
- Open the mobile menu via the hamburger icon.
- Click any CTA, team card, or FAQ to test interactive responses.
- Click **"CMS Console ↗"** to jump into the back-office console.

### Testing the CMS Command Center
Open [`cms-wireframes/index.html`](file:///E:/GEC/cms-wireframes/index.html) in any modern browser:
- Navigate through all 11 modules in the left rail.
- Click `[REVIEW CHANGES]` in Module 01 to view the staging diff modal.
- Click `[EXPORT CSV]` in Module 02 or Module 10 to test client-side CSV downloads.
- Toggle Bento vs. Magazine view in Module 05.
- Click **"Live Site Preview ↗"** to navigate back to the public website.

### Running Remotion Animation Studio
```powershell
# From the project root (E:\GEC)
npm start
# Opens Remotion Studio at http://localhost:3000
```

### Rendering Video Exports
```powershell
# Render default 1080p MP4
npm run render

# Render transparent alpha WebM
npm run render:webm
```

---

## 9. Contacts & Custodians

- **Repository Architect & Lead Developer:** AditRaj-dev (`louis05022006@gmail.com`)
- **Design Authority:** Galgotias Entrepreneurship Cell Visual Identity Council
- **Specification Source Documentation:** [`docs/`](file:///E:/GEC/docs/)
- **Master Wireframe Engine:** [`wireframes-v2/index.html`](file:///E:/GEC/wireframes-v2/index.html)
- **Master CMS Engine:** [`cms-wireframes/index.html`](file:///E:/GEC/cms-wireframes/index.html)
