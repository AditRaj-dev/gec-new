'use client';

import { CurtainInterstitial } from '@/components/CurtainInterstitial';
import { DeskFolioPage } from '@/components/deskfolio/DeskFolioPage';
import { FullViewportAct } from '@/components/FullViewportAct';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import './act-intro.css';

/** The pinned DeskFolio runway on its own; /initiatives uses this without the home curtain and intro. */
export function DeskRunway() {
  return (
    <FullViewportAct surface="cream" runway={2.4} label="the initiatives desk" id="desk">
      {() => <DeskFolioPage fillViewport />}
    </FullViewportAct>
  );
}

export function DeskAct({ programmeCount }: { programmeCount: number }) {
  return (
    <div className="home-act">
      <CurtainInterstitial
        headline="Every programme, one living desk."
        count={programmeCount}
        noun="programmes"
        effect="wipe"
      />
      <div className="act-intro wf-section surface-cream">
        <div className="act-intro__copy act-intro__copy--desk">
          <span className="editorial-kicker">PATHWAYS TO EXECUTION</span>
          <h2 className="h2-section act-intro__heading">Built for People Who Want to Build.</h2>
          <p className="body-editorial act-intro__body">
            GEC creates opportunities for students to move beyond ideas and experience entrepreneurship through startup
            development, pitching, workshops, collaboration, and ecosystem exposure.
          </p>
        </div>
      </div>
      <DeskRunway />
      <div className="act-exit surface-cream">
        <ViewTransitionLink href="/initiatives" className="gec-btn btn-outline-ink">
          Explore All Initiatives →
        </ViewTransitionLink>
      </div>
    </div>
  );
}
