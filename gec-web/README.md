# GEC Web

Website of the **Galgotias Entrepreneurship Cell**. Next.js 16 (App Router) · React 19 · Tailwind 4 · `motion` · hand-written WebGL shaders.

```bash
npm install
npm run dev        # http://localhost:3211
npm run build && npm start   # http://localhost:3210
npm run check      # logic checks + design lint
```

Routes: `/` · `/about` · `/teams` · `/initiatives` · `/stories` · `/stories/[slug]`.

- **Contributing or using an AI agent?** Read [`AGENTS.md`](AGENTS.md) first: repo layout, design rules, shaders,
  the Dispatch bin, known issues, and how this repo relates to the `AditRaj-dev/gec` monorepo.
- Design spec: [`docs/superpowers/specs/2026-09-23-gec-web-design.md`](docs/superpowers/specs/2026-09-23-gec-web-design.md)
- Route layouts plan: [`docs/superpowers/plans/2026-09-24-route-layouts.md`](docs/superpowers/plans/2026-09-24-route-layouts.md)

Environment: set `API_BASE_URL` (server) / `NEXT_PUBLIC_API_BASE_URL` (client) for the CMS API, read in `src/lib/api.ts`; without it the site renders frozen fallback content and
form submissions fail closed with a retry message.
