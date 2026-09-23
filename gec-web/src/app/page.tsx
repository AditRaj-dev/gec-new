import { getInitiatives, getTeams } from '@/lib/api';
import { HERO_CAMPAIGNS } from '@/lib/siteContent';
import { Hero } from '@/components/home/Hero';
import { Happening } from '@/components/home/Happening';
import { Impact } from '@/components/home/Impact';
import { Milestones } from '@/components/home/Milestones';
import { Speakers } from '@/components/home/Speakers';
import { Partners } from '@/components/home/Partners';
import { FinalCta } from '@/components/home/FinalCta';
import { ActDesk } from '@/components/acts/ActDesk';
import { ActShelf } from '@/components/acts/ActShelf';
import { ActStage } from '@/components/acts/ActStage';
import { CurtainInterstitial } from '@/components/CurtainInterstitial';
import { GEC_DISPATCH_ARCHIVE } from '@/components/NewsletterSection';

export default async function Home() {
  const [initiatives, teams] = await Promise.all([getInitiatives(), getTeams()]);

  return (
    <main aria-label="Galgotias Entrepreneurship Cell">
      <Hero campaigns={HERO_CAMPAIGNS} />
      <Happening />
      <CurtainInterstitial
        headline="Every programme, one living desk."
        count={initiatives.length}
        noun="programmes"
        effect="wipe"
      />
      <ActDesk programmeCount={initiatives.length} />
      <Impact />
      <Milestones />
      <CurtainInterstitial
        headline="Every issue we ever sent."
        count={GEC_DISPATCH_ARCHIVE.length}
        noun="dispatches"
        effect="wipe"
      />
      <ActShelf items={GEC_DISPATCH_ARCHIVE} />
      <Speakers />
      <CurtainInterstitial
        headline="The people behind all of it."
        count={teams.length}
        noun="teams"
        effect="doors-h"
      />
      <ActStage teams={teams} />
      <Partners />
      <FinalCta />
    </main>
  );
}
