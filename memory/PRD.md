# Galgotias Entrepreneurship Cell (GEC) — Website

## Problem Statement
Build the GEC website using the `styled.html` wireframe canvas as the visual base, integrating
the interactive React components (DeskFolio, NewsletterBookshelf, TeamStageManager,
BrandEntranceCurtain) from the `/app/web` project into the `gec-styled-next` Next.js app.
Top navbar must have exactly 5 pages (Home · About · Teams · Initiatives · Stories) + the
animated GEC logo docking from the entrance animation.

## Architecture
- **Framework:** Next.js 16 (App Router) at `/app/gec-styled-next` (symlinked `/app/frontend`)
- **Styling:** Tailwind v4 + shadcn tokens + GEC brand palette
- **Entrance animation:** `BrandEntranceCurtain` — SVG FLIP dock into `#navbar-brand-logo`
- **Nav routes (5):** `/` `/about` `/teams` `/initiatives` `/stories`
- **Iframe deep-link:** `styled.html#{page}` auto-runs `navigatePage(page)` via added
  `initHashRouting` block; `body.live-site` hides all cockpit dev chrome.

## Route → Content Map
| Route          | Content                                                                              |
| -------------- | ------------------------------------------------------------------------------------ |
| `/`            | `styled.html#home` — hero, campaign card, initiatives billboard                      |
| `/about`       | `styled.html#about` — "We create space to experience it" + origin/evolution          |
| `/teams`       | `TeamStageManager` — 7 teams with Stage-Manager 3-D rail + detail canvas             |
| `/initiatives` | `styled.html#initiatives` + `DeskFolioPage` — programs desk with interactive artifacts |
| `/stories`     | `styled.html#stories` + `NewsletterSection` — founder chronicles + 3D bookshelf      |

## What's implemented (Jan 2026)
- 5-item Navbar (desktop + mobile drawer) with animated GEC logo (h-12/h-14 sized)
- `styled.html` chrome stripped via `body.live-site` overrides (cockpit, ribbon,
  blueprint grid, inspector, inner navbar/footer)
- Hash router injected into `styled.html` — reacts to `#home|about|teams|initiatives|stories`
- 5 React routes created: home, about, teams, initiatives, stories
- Components ported from `/app/web`: `deskfolio/*`, `teams/TeamStageManager`,
  `NewsletterSection`, `ui/newsletter-bookshelf`, `Navbar`, `BrandEntranceCurtain`
- Mobile teams overflow patched (`overflow-x: clip` on section)
- Verified desktop 1920×800 + mobile 390×844 — no horizontal scrollbar

## Backlog
- P1: Wire "Apply to Team" modal to a backend endpoint (email coordinator)
- P1: Real coordinator profiles / avatars / social links (replace placeholders)
- P2: Live cohort dates for SDP/E-Summit driven by a small CMS or JSON feed
