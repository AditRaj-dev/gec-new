'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import type { NewsletterBookshelfItem } from '@/components/ui/newsletter-bookshelf';

const NewsletterBookshelf = dynamic(
  () =>
    import('@/components/ui/newsletter-bookshelf').then(
      (m) => m.NewsletterBookshelf
    ),
  { ssr: false }
);

// NewsletterBookshelf reserves min-h-[580px]/md:min-h-[620px] for its own
// "persistent stage" plus a ~52px top rail. An explicit height on this
// wrapper — the same value whether the dynamic import is still loading or
// the widget has mounted — keeps that space constant so nothing around the
// section shifts when it finishes loading.
const SHELF_WIDGET_HEIGHT = 'clamp(480px, 58vw, 620px)';

// The track is rendered deliberately wider than the viewport so vertical
// scroll has real horizontal shelf to pan across, at both 1440px and 768px.
const SHELF_TRACK_WIDTH = 'min(1700px, 220vw)';

export function ActShelf({ items }: { items: NewsletterBookshelfItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Size the negative x range from the track's real rendered width, not a
  // guessed pixel constant — it changes with viewport width and with
  // SHELF_TRACK_WIDTH's own clamp.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const measure = () => {
      const overflow = track.scrollWidth - viewport.clientWidth;
      setTravel(overflow > 0 ? overflow : 0);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(viewport);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  const heading = (
    <div className="mx-auto flex max-w-[52ch] flex-col gap-3 px-6 text-center">
      <h2
        className="font-display font-bold text-[var(--gec-ink)]"
        style={{ fontSize: 'var(--text-2xl)' }}
      >
        The dispatch shelf.
      </h2>
      <p
        className="text-[var(--gec-ink-muted)]"
        style={{ fontSize: 'var(--text-lg)' }}
      >
        Every issue of GEC Dispatch, bound and shelved — pull a volume to
        read it cover to cover.
      </p>
    </div>
  );

  const cta = (
    <div className="text-center">
      <Link
        href="/stories"
        className="inline-flex min-h-11 items-center rounded-full border border-[var(--gec-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--gec-ink)] transition-colors hover:bg-[var(--gec-surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gec-crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gec-surface-sand)]"
        style={{ transitionDuration: 'var(--dur-ui)' }}
      >
        Read every dispatch →
      </Link>
    </div>
  );

  // Reduced motion: no travel, no sticky pin — a plain wrapped grid of
  // covers built from the same data, so the meaning (browse every issue)
  // survives without any scroll-linked motion.
  if (prefersReducedMotion) {
    return (
      <section
        aria-label="GEC dispatch archive"
        className="surface-sand px-6 py-20 md:px-10 lg:px-16"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
          {heading}
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="surface-card flex flex-col gap-2 rounded-2xl p-4"
                style={{ boxShadow: 'var(--elev-raised)' }}
              >
                <span
                  aria-hidden="true"
                  className="block h-24 w-full rounded-lg"
                  style={{ background: item.color ?? 'var(--gec-crimson)' }}
                />
                <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--gec-ink-muted)]">
                  {item.editionNumber ?? item.date}
                </span>
                <span className="font-display text-sm font-bold leading-snug text-[var(--gec-ink)]">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
          {cta}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="GEC dispatch archive"
      className="surface-sand relative"
      style={{ height: '220vh' }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 flex h-screen flex-col justify-center gap-6 overflow-hidden py-10"
      >
        {heading}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max">
          <div
            className="relative"
            style={{ width: SHELF_TRACK_WIDTH, height: SHELF_WIDGET_HEIGHT }}
          >
            <NewsletterBookshelf items={items} brand="GEC DISPATCH" />
          </div>
        </motion.div>
        {cta}
      </div>
    </section>
  );
}
