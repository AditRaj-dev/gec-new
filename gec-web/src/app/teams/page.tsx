import type { Metadata } from 'next';
import { RouteHero } from '@/components/route/RouteHero';
import { StageRunway } from '@/components/home/StageAct';
import { FinalCta } from '@/components/home/FinalCta';
import { GEC_TEAMS } from '@/lib/teamsData';

export const metadata: Metadata = {
  title: 'The 7 Teams',
  description:
    'Meet the seven student teams behind GEC, from Startup Development and PR to the Technical & Product Lab and Career Connect, and apply to join one.',
  alternates: { canonical: '/teams' },
};

// Wireframe pill labels + accents (styled.html 3380–3388), in team index order.
const TEAM_PILLS = [
  { label: 'Startup Development', color: 'var(--team-startup)' },
  { label: 'PR & Networking', color: 'var(--team-pr)' },
  { label: 'Marketing & CA', color: 'var(--team-mktg)' },
  { label: 'Event Management', color: 'var(--team-event)' },
  { label: 'Digital Media', color: 'var(--team-media)' },
  { label: 'Technical Team', color: 'var(--team-tech)' },
  { label: 'Internship & Career Connect', color: 'var(--team-career)' },
];

export default async function TeamsPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const { team } = await searchParams;
  const n = Number(team);
  const initialTeamIndex = GEC_TEAMS.some((t) => t.index === n) ? n : undefined;

  return (
    <main aria-label="GEC Teams">
      <RouteHero
        kicker="THE ENGINE BEHIND GEC"
        title={<span className="rt-accent">7 Teams.</span>}
        accent={<span style={{ color: 'var(--gec-ink)' }}>One Vision.</span>}
        lede="Different skills. Different responsibilities. One entrepreneurial ecosystem. Behind every event, startup initiative, campaign, partnership, and opportunity is a team of students making it happen."
        aside={
          <>
            <div className="rt-stat">0{GEC_TEAMS.length}</div>
            <div className="rt-mono rt-muted">Teams · 1 vision</div>
          </>
        }
      >
        <nav className="rt-chips" aria-label="Jump to a team">
          {TEAM_PILLS.map((p, i) => (
            <a key={p.label} className="rt-chip" href={`/teams?team=${i + 1}#stage`} style={{ borderColor: p.color }}>
              {p.label}
            </a>
          ))}
        </nav>
      </RouteHero>

      <StageRunway key={initialTeamIndex ?? 1} initialTeamIndex={initialTeamIndex} />

      <FinalCta
        shader="riso"
        kicker="RECRUITMENT"
        heading="Find Your Team."
        lede="Every team takes new members each semester. Pick the one that matches how you like to build."
        primary={{ href: '/about', label: 'About GEC' }}
        secondary={{ href: '/initiatives', label: 'See What Teams Run' }}
      />
    </main>
  );
}
