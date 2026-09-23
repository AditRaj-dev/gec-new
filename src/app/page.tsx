import { getInitiatives, getStories, getTeams } from '@/lib/api';
import { HERO_CAMPAIGNS } from '@/lib/siteContent';
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

export default async function Home() {
  const [initiatives, stories, teams] = await Promise.all([getInitiatives(), getStories(), getTeams()]);

  return (
    <main aria-label="Galgotias Entrepreneurship Cell" className="relative">
      <Hero campaigns={HERO_CAMPAIGNS} />
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
