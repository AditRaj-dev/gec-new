import { getInitiatives, getStories, getTeams } from '@/lib/api';
import { getSingleton } from '@/lib/content';
import { HERO_FALLBACK } from '@/content/hero';
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
  const [initiatives, stories, teams, hero] = await Promise.all([
    getInitiatives(),
    getStories(),
    getTeams(),
    getSingleton('hero', HERO_FALLBACK),
  ]);

  return (
    <main aria-label="Galgotias Entrepreneurship Cell" className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([organizationLd, websiteLd])} />
      <Hero campaigns={hero.campaigns} secondaryCards={hero.secondaryCards} />
      <Happening />
      <DeskAct programmeCount={initiatives.length} />
      <Impact />
      <Milestones />
      <ShelfAct stories={[...stories]} />
      <Speakers />
      <StageAct teamCount={teams.length} />
      <Partners />
      <FinalCta />
    </main>
  );
}
