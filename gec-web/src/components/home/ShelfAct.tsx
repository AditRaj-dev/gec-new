'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';
import { CurtainInterstitial } from '@/components/CurtainInterstitial';
import { FullViewportAct } from '@/components/FullViewportAct';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import type { NewsletterBookshelfItem } from '@/components/ui/newsletter-bookshelf';
import { shelfOffset } from '@/lib/act';
import { storyToBook } from '@/lib/storyToBook';
import type { Story } from '@/lib/types';
import './act-intro.css';

const NewsletterBookshelf = dynamic(
  () => import('@/components/ui/newsletter-bookshelf').then((module) => module.NewsletterBookshelf),
  { ssr: false }
);

function ShelfTravel({ progress, items }: { progress: MotionValue<number>; items: NewsletterBookshelfItem[] }) {
  const box = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useMotionValueEvent(progress, 'change', (p) => {
    if (reduce) return;
    const row = box.current?.querySelector<HTMLElement>('[data-gec-shelf-row]');
    if (!row) return;
    row.scrollLeft = shelfOffset(p, row.scrollWidth - row.clientWidth);
  });
  return (
    <div ref={box} className="shelf-travel">
      <NewsletterBookshelf items={items} brand="GEC Stories" height="100%" />
    </div>
  );
}

export function ShelfAct({ stories }: { stories: Story[] }) {
  const items = stories.map(storyToBook);

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
      <FullViewportAct surface="cream" runway={3.2} label="the story shelf" id="shelf">
        {(progress) => <ShelfTravel progress={progress} items={items} />}
      </FullViewportAct>
      <div className="act-exit surface-cream">
        <ViewTransitionLink href="/stories" className="gec-btn btn-outline-ink">
          Explore Stories →
        </ViewTransitionLink>
      </div>
    </div>
  );
}
