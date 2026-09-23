import type { Metadata } from 'next';
import { TeamStageManager } from '@/components/teams/TeamStageManager';

export const metadata: Metadata = {
  title: 'Teams & Organizational Roster | Galgotias Entrepreneurship Cell',
  description:
    'Explore the 7 specialized teams driving Galgotias Entrepreneurship Cell. Interactive Stage Manager transition system.',
};

export default function TeamsPage() {
  return (
    <main className="w-full flex-1 flex flex-col bg-[#FCF8ED] min-h-[100dvh] pt-20">
      <TeamStageManager
        initialTeamIndex={1}
        initialMode="detail"
        showHero={true}
      />

      <footer className="border-t border-[rgba(163,4,15,0.15)] bg-[#FFFDF8] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5F5650]">
          <span>PAGE 03: TEAMS · STAGE MANAGER</span>
          <span>7 TEAMS · ONE VISION</span>
        </div>
      </footer>
    </main>
  );
}
