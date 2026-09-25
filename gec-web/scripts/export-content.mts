// Writes the site's fallback content to the API seed file.
// Run from gec-web/: npx --yes tsx scripts/export-content.mts   (tsx resolves the @/ alias via tsconfig paths)
import { writeFileSync } from 'node:fs';
import { HERO_FALLBACK } from '@/content/hero';
import { HAPPENING_FALLBACK } from '@/content/happening';
import { IMPACT_FALLBACK } from '@/content/impact';
import { MILESTONES_FALLBACK } from '@/content/milestones';
import { SPEAKERS_FALLBACK } from '@/content/speakers';
import { PARTNERS_FALLBACK } from '@/content/partners';
import { SITE_NAV_FALLBACK } from '@/content/siteNav';
import { TEAMS_FALLBACK } from '@/content/teams';
import { DISPATCH_FALLBACK } from '@/content/dispatch';
import { ROUTE_COPY_FALLBACK } from '@/content/routeCopy';

const withOrder = <T extends object>(xs: T[]) => xs.map((x, i) => ({ ...x, order: i + 1 }));

const seed = {
  singletons: {
    hero: HERO_FALLBACK,
    happening: HAPPENING_FALLBACK,
    impact: IMPACT_FALLBACK,
    'site-nav': SITE_NAV_FALLBACK,
    'route-copy': ROUTE_COPY_FALLBACK,
  },
  lists: {
    milestones: withOrder(MILESTONES_FALLBACK),
    speakers: withOrder(SPEAKERS_FALLBACK),
    partners: withOrder(PARTNERS_FALLBACK),
    'team-stage': withOrder(TEAMS_FALLBACK),
    'dispatch-issues': withOrder(DISPATCH_FALLBACK),
  },
};

const out = new URL('../../api/src/database/seeds/site-content.json', import.meta.url);
writeFileSync(out, JSON.stringify(seed, null, 2) + '\n');
console.log('wrote', out.pathname);
