# Galgotias Entrepreneurship Cell (GEC) — Website

## Problem Statement
Build the GEC website using the `styled.html` wireframe as the visual base, integrating
the interactive React components (DeskFolio, NewsletterBookshelf, TeamStageManager,
BrandEntranceCurtain) from the `/app/web` project into the `gec-styled-next` Next.js app.
Top navbar must have exactly 5 pages + the animated GEC logo docking from the entrance
animation. No "Deskfolio" pill. Teams page contains only the Stage Manager; other
components live on their own routes.

## Architecture
- **Framework:** Next.js 16 (App Router) at `/app/gec-styled-next` (symlinked as `/app/frontend`)
- **Styling:** Tailwind v4 + shadcn tokens + GEC brand palette
- **Home layout:** `styled.html` wireframe iframe with dev chrome hidden via `body.live-site` overrides
- **Entrance animation:** `BrandEntranceCurtain` (SVG FLIP dock into navbar-brand-logo)
- **Nav:** 5 routes — `/` (Home), `/teams`, `/archives`, `/newsletter`, `#apply`

## Routes
| Route         | Content                                                         |
| ------------- | --------------------------------------------------------------- |
| `/`           | Styled wireframe home canvas (Hero, Campaign Card, Initiatives) |
| `/teams`      | `TeamStageManager` (7 teams · Stage Manager transition)         |
| `/archives`   | `DeskFolioPage` — interactive desk scene flip-book              |
| `/newsletter` | `NewsletterSection` — 3D WebGL bookshelf dispatch archives      |

## What's implemented (Jan 2026)
- Cross-origin dev origins allowed in `next.config.ts`
- `body.live-site` CSS overrides added to `styled.html` to strip cockpit chrome
  (`#cockpit-header`, `.canvas-status-ribbon`, `.blueprint-grid-overlay`,
  `#inspector-drawer`, inner `.site-navbar`, `.site-footer`)
- `Navbar.tsx` reduced to 5 links + docking logo (h-12/14 sized to fit navbar row)
- Components ported: `deskfolio/*`, `teams/TeamStageManager`, `NewsletterSection`,
  `ui/newsletter-bookshelf`, `Navbar`, `BrandEntranceCurtain`
- Verified desktop 1920×800 + mobile 390×844, no overflow

## Backlog / Next
- P1: Build About + Initiatives + Stories routes from styled.html's other page sections
- P1: Wire team apply modal to a backend endpoint
- P2: Add real content (team members, event dates) to seed data
