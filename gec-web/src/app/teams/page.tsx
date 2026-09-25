import type { Metadata } from 'next';
import { RouteHero } from '@/components/route/RouteHero';
import { StageRunway } from '@/components/home/StageAct';
import { FinalCta } from '@/components/home/FinalCta';
import { getList, getSingleton } from '@/lib/content';
import { TEAMS_FALLBACK } from '@/content/teams';
import { ROUTE_COPY_FALLBACK } from '@/content/routeCopy';

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
  const [teams, { hero, cta }] = await Promise.all([
    getList('team-stage', TEAMS_FALLBACK),
    getSingleton('route-copy', ROUTE_COPY_FALLBACK).then((r) => r.teams),
  ]);
  const initialTeamIndex = teams.some((t) => t.index === n) ? n : undefined;

  return (
    <main aria-label="GEC Teams">
      <RouteHero
        kicker={hero.kicker}
        title={<span className="rt-accent">{hero.title}</span>}
        accent={<span style={{ color: 'var(--gec-ink)' }}>{hero.accent}</span>}
        lede={hero.lede}
        aside={
          <>
            <div className="rt-stat">0{teams.length}</div>
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

      <StageRunway key={initialTeamIndex ?? 1} initialTeamIndex={initialTeamIndex} teams={teams} />

      <FinalCta {...cta} />
    </main>
  );
}
