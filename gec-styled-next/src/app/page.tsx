import { getInitiatives, getTeams, getStories } from '@/lib/api';
import { HERO_CAMPAIGNS } from '@/lib/siteContent';
import { ActOpening } from '@/components/acts/ActOpening';
import { ActCount } from '@/components/acts/ActCount';

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
    </main>
  );
}
