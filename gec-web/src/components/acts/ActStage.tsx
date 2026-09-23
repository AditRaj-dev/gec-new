'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useInView, useReducedMotion } from 'motion/react';
import { TeamStageManager } from '@/components/teams/TeamStageManager';
import type { Team } from '@/lib/api';
import './act-stage.css';

/**
 * Act V — the Stage.
 *
 * TeamStageManager owns its own layout/behaviour and is shared with
 * /teams, so it is embedded here unmodified. This act's only job is to
 * stop caging it: no max-width wrapper, no side padding around the
 * manager itself, so it genuinely spans the viewport (see act-stage.css
 * and the stage-manager.css column-width fix for the rest of that fix).
 *
 * The entrance peel is driven from here via a `data-peel` attribute
 * (see act-stage.css) rather than touching TeamStageManager's markup.
 * act-stage.css selects cards via `[data-team-index]` (an attribute
 * TeamStageManager.tsx already renders on every card) scoped under the
 * `.act-stage__rail` wrapper below, which this component owns — so none
 * of TeamStageManager's own class names are load-bearing for the peel.
 */
export function ActStage({ teams }: { teams: Team[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [peel, setPeel] = useState(false);

  useEffect(() => {
    if (isInView && !prefersReducedMotion) setPeel(true);
  }, [isInView, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="The teams on stage"
      data-peel={peel ? 'run' : 'pending'}
      className="act-stage surface-cream flex min-h-[100dvh] w-full flex-col gap-10 py-16 md:py-20"
    >
      <div className="mx-auto flex max-w-[52ch] flex-col gap-3 px-6 text-center">
        <h2
          className="font-display font-bold text-[var(--gec-ink)]"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          The people behind all of it.
        </h2>
        <p
          className="text-[var(--gec-ink-muted)]"
          style={{ fontSize: 'var(--text-lg)' }}
        >
          {teams.length} teams, one shared vision — step onto the stage and
          explore who runs what.
        </p>
      </div>

      <div className="act-stage__rail w-full">
        <TeamStageManager
          initialTeamIndex={1}
          initialMode="detail"
          showHero={false}
        />
      </div>

      <div className="text-center">
        <Link
          href="/teams"
          className="inline-flex min-h-11 items-center rounded-full border border-[var(--gec-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--gec-ink)] transition-colors hover:bg-[var(--gec-surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gec-crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gec-canvas)]"
          style={{ transitionDuration: 'var(--dur-ui)' }}
        >
          Meet every team →
        </Link>
      </div>
    </section>
  );
}
