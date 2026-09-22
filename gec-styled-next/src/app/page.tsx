import { getInitiatives, getTeams, getStories } from '@/lib/api';
import { HERO_CAMPAIGNS } from '@/lib/siteContent';
import { ActOpening } from '@/components/acts/ActOpening';
import { ActCount } from '@/components/acts/ActCount';
import { ActDesk } from '@/components/acts/ActDesk';
import { ActShelf } from '@/components/acts/ActShelf';
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
      <ActOpening campaigns={HERO_CAMPAIGNS} />
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
    </main>
  );
}
