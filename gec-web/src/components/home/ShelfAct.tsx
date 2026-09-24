'use client';

import dynamic from 'next/dynamic';
import { CurtainInterstitial } from '@/components/CurtainInterstitial';
import { FullViewportAct } from '@/components/FullViewportAct';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import { aisleRunway, planAisle } from '@/components/stories/aislePlan';
import type { Story } from '@/lib/types';
import './act-intro.css';

const StoriesAisle = dynamic(
  () => import('@/components/stories/StoriesAisle').then((module) => module.StoriesAisle),
  { ssr: false }
);

export function ShelfAct({ stories }: { stories: Story[] }) {
  return (
    <div className="home-act">
      <CurtainInterstitial
        headline="Every story that started here."
        count={stories.length}
        noun="stories"
        effect="wipe"
      />
      <div className="act-intro wf-section surface-cream">
        <div className="act-intro__copy">
          <span className="editorial-kicker">EDITORIAL VOICES</span>
          <h2 className="h2-section act-intro__heading">Every Venture Starts With a Story.</h2>
          <p className="body-editorial act-intro__body">
            Behind every startup is a decision to begin. Meet the founders, student builders, and teams turning ideas
            into experiments, products, and companies.
          </p>
        </div>
      </div>
      <FullViewportAct surface="cream" runway={aisleRunway(planAisle(stories).length)} label="the stories aisle" id="shelf">
        {(progress) => <StoriesAisle progress={progress} stories={stories} />}
      </FullViewportAct>
      <div className="act-exit surface-cream">
        <ViewTransitionLink href="/stories" className="gec-btn btn-outline-ink">
          Explore Stories →
        </ViewTransitionLink>
      </div>
    </div>
  );
}
