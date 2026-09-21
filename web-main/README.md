# GEC production web

Production frontend for the Galgotias Entrepreneurship Cell. This app is intentionally separate from the sibling `web` directory, which remains the component and interaction sandbox.

## Stack

- Next.js 16.3.5 App Router
- React 19 and TypeScript
- Tailwind CSS v4
- Exact vector GEC brand mark and entrance animation reused from the tested sandbox

## Routes

- `/` — public landing page
- `/about` — story, mission, vision, and ecosystem
- `/teams` — seven-team operating structure
- `/initiatives` — confirmed program types and builder journey
- `/stories` — editorial stories and category browser

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```

Content follows the frozen repository documents under `../docs`. Names, dates, impact metrics, initiative status, partner claims, social links, and contact details must be verified before they are published.
