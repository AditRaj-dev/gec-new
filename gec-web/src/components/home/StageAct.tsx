'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';
import { CurtainInterstitial } from '@/components/CurtainInterstitial';
import { FullViewportAct } from '@/components/FullViewportAct';
import { TeamStageManager } from '@/components/teams/TeamStageManager';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import { isLive } from '@/lib/act';
import './act-intro.css';

function StageManager({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);

  useMotionValueEvent(progress, 'change', (p) => {
    if (!entered && isLive(p)) setEntered(true);
  });

  useEffect(() => {
    if (reduce || isLive(progress.get())) setEntered(true);
  }, [progress, reduce]);

  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('.team-item-card').forEach((card, index) => {
      card.style.setProperty('--i', String(index));
    });
  }, []);

  return (
    <div ref={root} className="stage-act__manager" data-entered={entered || undefined}>
      <TeamStageManager showHero={false} />
    </div>
  );
}

export function StageAct({ teamCount }: { teamCount: number }) {
  return (
    <div className="home-act">
      <CurtainInterstitial
        headline="The people behind all of it."
        count={teamCount}
        noun="teams"
        effect="doors-h"
      />
      <div className="act-intro act-intro--stage wf-section surface-sand">
        <div className="act-intro__stage-copy">
          <span className="editorial-kicker">THE ENGINE BEHIND GEC</span>
          <h2 className="h1-display act-intro__stage-heading">
            <span>7 Teams.</span> One Vision.
          </h2>
          <p className="body-editorial act-intro__stage-body">
            Different skills. Different responsibilities. One entrepreneurial ecosystem. Behind every event, startup
            initiative, campaign, partnership, and opportunity is a team of students making it happen.
          </p>
        </div>
      </div>
      <FullViewportAct surface="sand" runway={2.4} label="the teams stage" id="stage">
        {(progress) => <StageManager progress={progress} />}
      </FullViewportAct>
      <div className="act-exit surface-sand">
        <ViewTransitionLink href="/teams" className="gec-btn btn-outline-ink">
          Meet the Teams →
        </ViewTransitionLink>
      </div>
    </div>
  );
}
