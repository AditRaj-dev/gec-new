# GEC Web — SEO & performance guide

Last updated 2026-09-25. Read with `AGENTS.md`.

## What's in place

| Item | Where | Notes |
|---|---|---|
| Site URL | `src/lib/site.ts` | `NEXT_PUBLIC_SITE_URL`, default `https://ecellgu.in` (guessed from `contact@ecellgu.in`). **Set it in every deploy.** |
| Title template | `src/app/layout.tsx` | Pages set a short `title`; the layout appends ` \| Galgotias Entrepreneurship Cell`. Don't repeat the suffix in pages. |
| Canonicals | each `page.tsx` (`alternates.canonical`) | Never set a canonical in the root layout: every page would inherit it. |
| Open Graph / Twitter | layout (defaults) + `src/app/opengraph-image.tsx` | One branded 1200×630 card for all routes. Stories set `og:type=article`, published time, tags, cover. |
| Favicon / touch icon | `src/app/favicon.ico` (16/32/48), `src/app/icon.png` (512), `src/app/apple-icon.png` (180) | The swirled G from `public/gec-full-logo.svg` (the full logo is unreadable at tab size). |
| Structured data | home: `Organization` + `WebSite`; stories: `Article` | Built in `src/lib/site.ts`; escaped with `jsonLd()`. Logo: `public/gec-logo-512.png` (≥112px, white background, per Google). |
| `/sitemap.xml` | `src/app/sitemap.ts` | 5 routes + every story from `getStories()`. |
| `/robots.txt` | `src/app/robots.ts` | Allows all crawlers (including AI crawlers), blocks `/api/`, points to the sitemap. |
| `/llms.txt` | `src/app/llms.txt/route.ts` | Markdown site map for AI assistants (llmstxt.org). Google does not use it; it's cheap and some AI tools/agents read it. |
| Images | `public/` | PNG/WebP recompressed with sharp (−785 KB); SVGs run through svgo. |
| CMS images | `next.config.ts` | Allows the R2 media host from `NEXT_PUBLIC_MEDIA_BASE_URL`; optimized copies cached 30 days. |

## Launch checklist (needs an owner)

1. Set `NEXT_PUBLIC_SITE_URL` (and `NEXT_PUBLIC_MEDIA_BASE_URL` once R2 is live) in Vercel for production and staging. Previews/staging are already `noindex` and blocked in robots.txt (`INDEXABLE` in `site.ts`).
2. Verify the domain in **Google Search Console** and **Bing Webmaster Tools**; submit `/sitemap.xml`.
3. Test home and one story in Google's **Rich Results Test**; fix any warnings.
4. Ask Galgotias University to link to the site from its official pages (clubs / E-Cell / incubation). A link from the university domain is the single strongest ranking signal available to GEC.
5. Put the site URL in the Instagram and LinkedIn bios (these are the `sameAs` profiles).

## Content that ranks

- People search "Galgotias E-Cell", "Galgotias startup incubation", "Galgotias ideathon", "E-Summit Galgotias". Use those exact phrases in headings and first paragraphs where they're true.
- Each event (Ideathon, E-Summit, pitching sessions) deserves its own page with date, venue and registration. Add `Event` structured data there (name, startDate, location, organizer = the Organization `@id`). Today these live as sections on `/initiatives`.
- Stories: real names, startup names, numbers and a cover image. Keep `excerpt` 120–160 characters (it becomes the meta description).
- Replace the draft copy marked `ponytail:` in `initiatives/page.tsx` before launch; thin placeholder text hurts.
- Every image that carries meaning needs `alt` text (decorative stickers keep `alt=""`).

## Performance (Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1)

Done:
- Preconnect to both Fontshare hosts (`api.` for CSS, `cdn.` for font files).
- Raster images recompressed; heavy sticker SVGs only load when the sticker picker opens (`loading="lazy"`).

Next, in order of payoff:
1. **Self-host Cabinet Grotesk** with `next/font/local` (Fontshare's free licence allows it). It removes a render-blocking stylesheet from a third-party origin on every page, which is the biggest LCP win left.
2. **Delete unused public assets** (37 files, 2.3 MB, none referenced in `src/`), for example `backgrounds/*`, `stickers/sticker-travel.svg`, `stickers/journal.svg`, one of the two identical `gec-full-logo.svg` copies. Visitors don't download them, but they bloat deploys. Check names built at runtime first (e.g. keyboard colour variants).
3. Move story covers from `<img>` to `next/image` once CMS media is on R2 (sizes + WebP for free).
4. Measure: run Lighthouse / PageSpeed Insights on `/` and `/stories` on a phone profile after deploy; the 3D acts (`FullViewportAct`) and shaders are the likely INP/LCP costs. Their budgets are documented in `AGENTS.md` (Shaders).

## Sources

- Google: [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [llms.txt adoption and limits (2026)](https://codersera.com/blog/llms-txt-complete-guide-2026/), [robots.txt vs llms.txt](https://www.coronium.io/blog/robots-txt-llms-txt-ai-txt-2026)
- [Structured data in 2026](https://opace.agency/blog/structured-data-schema-for-seo/)
- Next.js 16 docs in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/`
