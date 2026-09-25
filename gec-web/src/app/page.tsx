import { getInitiatives, getStories } from '@/lib/api';
import { getList, getSingleton } from '@/lib/content';
import { HERO_FALLBACK } from '@/content/hero';
import { HAPPENING_FALLBACK } from '@/content/happening';
import { IMPACT_FALLBACK } from '@/content/impact';
import { MILESTONES_FALLBACK } from '@/content/milestones';
import { SPEAKERS_FALLBACK } from '@/content/speakers';
import { PARTNERS_FALLBACK } from '@/content/partners';
import { TEAMS_FALLBACK } from '@/content/teams';
import { Hero } from '@/components/home/Hero';
import { Happening } from '@/components/home/Happening';
import { DeskAct } from '@/components/home/DeskAct';
import { Impact } from '@/components/home/Impact';
import { Milestones } from '@/components/home/Milestones';
import { ShelfAct } from '@/components/home/ShelfAct';
import { Speakers } from '@/components/home/Speakers';
import { StageAct } from '@/components/home/StageAct';
import { Partners } from '@/components/home/Partners';
import { FinalCta } from '@/components/home/FinalCta';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, jsonLd, organizationLd } from '@/lib/site';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const websiteLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, publisher: { '@id': organizationLd['@id'] } };

export default async function Home() {
  const [initiatives, stories, stageTeams, hero, happening, impact, milestones, speakers, partners] = await Promise.all([
    getInitiatives(),
    getStories(),
    getList('team-stage', TEAMS_FALLBACK),
    getSingleton('hero', HERO_FALLBACK),
    getSingleton('happening', HAPPENING_FALLBACK),
    getSingleton('impact', IMPACT_FALLBACK),
    getList('milestones', MILESTONES_FALLBACK),
    getList('speakers', SPEAKERS_FALLBACK),
    getList('partners', PARTNERS_FALLBACK),
  ]);

  return (
    <main aria-label="Galgotias Entrepreneurship Cell" className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([organizationLd, websiteLd])} />
      <Hero campaigns={hero.campaigns} secondaryCards={hero.secondaryCards} />
      <Happening content={happening} />
      <DeskAct programmeCount={initiatives.length} />
      <Impact content={impact} />
      <Milestones items={milestones} />
      <ShelfAct stories={[...stories]} />
      <Speakers speakers={speakers} />
      <StageAct teams={stageTeams} />
      <Partners items={partners} />
      <FinalCta />
    </main>
  );
}
