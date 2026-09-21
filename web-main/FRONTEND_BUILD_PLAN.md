# GEC production frontend build plan

## Goal

Create the production-facing Galgotias Entrepreneurship Cell frontend as a new Next.js 16 App Router project in `web-main`, while keeping `web` as the component experimentation sandbox.

## Frozen product scope

- Five primary routes: `/`, `/about`, `/teams`, `/initiatives`, `/stories`.
- Persistent action: `Get involved` (implemented as a mail/contact CTA until a verified application URL exists).
- Content follows `docs/GEC_Website_Complete_Content_Frozen.md` and `docs/GEC_Website_Site_Map_Frozen.md`.
- Unverified metrics, dates, current office-bearers, partner claims, and initiative status must not be invented.
- Visual direction follows `wireframes-v2/DESIGN.md`: warm editorial canvas, asymmetric layouts, crisp borders, restrained motion, WCAG-minded contrast, and no generic card-grid repetition.

## Technical baseline

- Next.js 16.3.5, React 19, TypeScript, App Router, Tailwind CSS v4.
- Server Components by default; Client Components only for stateful navigation/filter behavior.
- Shared content in `src/lib/site-data.ts`.
- Shared shell and primitives in `src/components/`.
- Route-specific composition stays inside each route's `page.tsx`.

## Parallel ownership (disjoint files)

1. **Shell + Home agent**
   - `src/components/site-header.tsx`
   - `src/components/site-footer.tsx`
   - `src/app/page.tsx`
2. **About + Teams agent**
   - `src/app/about/page.tsx`
   - `src/app/teams/page.tsx`
3. **Initiatives + Stories agent**
   - `src/app/initiatives/page.tsx`
   - `src/app/stories/page.tsx`
4. **Root integrator**
   - Project config, dependencies, shared data/primitives, `layout.tsx`, `globals.css`
   - Integration fixes, lint/build, responsive smoke test, final review

## Shared contracts

- Use the existing CSS utilities and variables in `globals.css` rather than route-local global styles.
- Import shared content only from `@/lib/site-data`.
- Use `@/components/brand-mark`, `@/components/section-heading`, and `@/components/arrow-link` where appropriate.
- Do not edit files owned by another worker.
- Do not modify the sibling `web` sandbox.

## Acceptance criteria

- All five routes render and link through the shared responsive header/footer.
- Mobile layout has no horizontal overflow and all primary controls are at least 44px tall.
- Keyboard-visible focus states and reduced-motion behavior are present.
- No unverified quantitative claims are presented as fact.
- `npm run lint` and `npm run build` pass from `web-main`.
- The production build is visually checked at desktop and mobile widths.
