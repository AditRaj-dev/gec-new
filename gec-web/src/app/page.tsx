import { getInitiatives, getTeams, getStories } from '@/lib/api';
import { HERO_CAMPAIGNS } from '@/lib/siteContent';
import { Hero } from '@/components/home/Hero';
import { Happening } from '@/components/home/Happening';
import { ActCount } from '@/components/acts/ActCount';
import { ActDesk } from '@/components/acts/ActDesk';
import { ActShelf } from '@/components/acts/ActShelf';
import { ActStage } from '@/components/acts/ActStage';
import { ActClose } from '@/components/acts/ActClose';
import { CurtainInterstitial } from '@/components/CurtainInterstitial';
import { GEC_DISPATCH_ARCHIVE } from '@/components/NewsletterSection';

export default async function Home() {
  const [initiatives, teams, stories] = await Promise.all([
    getInitiatives(),
    getTeams(),
    getStories(),
  ]);

  return (
    <main aria-label="Galgotias Entrepreneurship Cell">
      <Hero campaigns={HERO_CAMPAIGNS} />
      <Happening />
      <ActCount
        stats={[
          { label: 'Teams', value: String(teams.length) },
          { label: 'Programmes', value: String(initiatives.length) },
          { label: 'Ventures', value: String(stories.length) },
        ]}
      />
      <CurtainInterstitial
        headline="Every programme, one living desk."
        count={initiatives.length}
        noun="programmes"
        effect="wipe"
      />
      <ActDesk programmeCount={initiatives.length} />
      <CurtainInterstitial
        headline="Every issue we ever sent."
        count={GEC_DISPATCH_ARCHIVE.length}
        noun="dispatches"
        effect="wipe"
      />
      <ActShelf items={GEC_DISPATCH_ARCHIVE} />
      <CurtainInterstitial
        headline="The people behind all of it."
        count={teams.length}
        noun="teams"
        effect="doors-h"
      />
      <ActStage teams={teams} />
      <ActClose />
    </main>
  );
}
