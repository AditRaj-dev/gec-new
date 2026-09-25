'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ViewTransitionLink } from '@/components/ViewTransitionLink';
import { storyToBook } from '@/lib/storyToBook';
import type { Story } from '@/lib/types';
import './stories-front-pages.css';

const DWELL_MS = 5000;

/**
 * Phone recomposition of the stories aisle: each story is a full-bleed front page you tap through
 * (right = next, left = back, or swipe), with progress ticks and a 5s autoplay. The last page is the
 * reserved "your story" invitation. Rendered by ShelfAct below 769px.
 * Autoplay pauses while held, off screen or in a background tab; reduced motion = no autoplay.
 */
export function StoriesFrontPages({ stories }: { stories: Story[] }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false); // a swipe ends in a click too; don't let it turn the page twice

  const pages = useMemo(
    () => [...stories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).map((s, n) => ({ story: s, color: storyToBook(s, n).color })),
    [stories]
  );
  const total = pages.length + 1; // + the invitation
  const nextYear = new Date().getFullYear() + 1;
  const go = useCallback((n: number) => setI(((n % total) + total) % total), [total]);
  const running = !reduce && !held && onScreen;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting && !document.hidden), { threshold: 0.4 });
    const vis = () => setOnScreen((v) => v && !document.hidden);
    io.observe(el);
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  // The tick's CSS animation is the timer: when it finishes, advance. Pausing the animation pauses the timer.
  const onTickEnd = () => go(i + 1);

  return (
    <div
      ref={rootRef}
      className="sfp"
      role="region"
      aria-roledescription="carousel"
      aria-label="GEC stories"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      }}
      onClick={(e) => {
        // tap: left 40% goes back, the rest forward; links and buttons do their own thing
        if (swiped.current) { swiped.current = false; return; }
        if ((e.target as HTMLElement).closest('a, button')) return;
        const b = e.currentTarget.getBoundingClientRect();
        go(i + (e.clientX - b.left < b.width * 0.4 ? -1 : 1));
      }}
      onPointerDown={(e) => { swipe.current = { x: e.clientX, y: e.clientY }; swiped.current = false; setHeld(true); }}
      onPointerUp={(e) => {
        setHeld(false);
        const s = swipe.current; swipe.current = null;
        if (s && Math.abs(e.clientX - s.x) > 48 && Math.abs(e.clientX - s.x) > Math.abs(e.clientY - s.y)) {
          swiped.current = true;
          go(i + (e.clientX < s.x ? 1 : -1));
        }
      }}
      onPointerCancel={() => { setHeld(false); swipe.current = null; }}
      onPointerLeave={() => setHeld(false)}
    >
      <div className="sfp__ticks" aria-hidden="true">
        {Array.from({ length: total }, (_, n) => (
          <i key={n} className={n < i ? 'is-done' : undefined}>
            {n === i && (
              <b
                key={i}
                className={reduce ? 'is-static' : undefined}
                style={{ animationDuration: `${DWELL_MS}ms`, animationPlayState: running ? 'running' : 'paused' }}
                onAnimationEnd={onTickEnd}
              />
            )}
          </i>
        ))}
      </div>
      <div className="sfp__mast" aria-hidden="true">
        <span>GEC Stories</span>
        <span>{i + 1} / {total}</span>
      </div>

      {pages.map(({ story, color }, n) => (
        <article
          key={story.id}
          className="sfp__page"
          data-on={n === i || undefined}
          aria-hidden={n !== i}
          inert={n !== i}
          style={{
            backgroundColor: color,
            backgroundImage: story.coverImage ? `url("${story.coverImage}")` : undefined,
          }}
        >
          <span className="sfp__cat">{[story.category, story.readTime].filter(Boolean).join(' · ')}</span>
          <h3 className="sfp__title">{story.title}</h3>
          <p className="sfp__excerpt">{story.excerpt}</p>
          {(story.authorOrFounder || story.startupName) && (
            <span className="sfp__by">{[story.authorOrFounder, story.startupName].filter(Boolean).join(' · ')}</span>
          )}
          <ViewTransitionLink href={`/stories/${story.slug}`} className="sfp__read">
            Read the story →
          </ViewTransitionLink>
        </article>
      ))}
      <article className="sfp__page sfp__page--invite" data-on={i === total - 1 || undefined} aria-hidden={i !== total - 1} inert={i !== total - 1}>
        <span className="sfp__cat">Page {nextYear}-001 · reserved</span>
        <h3 className="sfp__title">Your story belongs on the next page.</h3>
        <p className="sfp__excerpt">Build something at Galgotias and we&apos;ll print it here.</p>
        <ViewTransitionLink href="/initiatives" className="sfp__read">
          Start yours at GEC →
        </ViewTransitionLink>
      </article>

      <button type="button" className="sr-only" onClick={() => go(i - 1)}>Previous story</button>
      <button type="button" className="sr-only" onClick={() => go(i + 1)}>Next story</button>
      <p className="sr-only" aria-live="polite">
        {i < pages.length ? `Story ${i + 1} of ${total}: ${pages[i].story.title}` : `Page ${total} of ${total}: your story belongs on the next page`}
      </p>
    </div>
  );
}
