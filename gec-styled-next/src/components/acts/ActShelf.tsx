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

// NewsletterBookshelf's own root ("persistent stage" + top rail,
// newsletter-bookshelf.tsx:608 declares `min-h-[580px] md:min-h-[620px]`
// on the stage itself, on top of a ~52px top rail plus borders above it)
// enforces a real minimum height of ~632px below the 768px breakpoint and
// ~672px at or above it, regardless of what this wrapper offers — measured
// live at 768px, the mounted widget is 675px tall. This wrapper's floor is
// set above that measured case with headroom, and must never sit below the
// widget's own min-height at any width, or the mounted widget's height
// wins over ours and the bottom gets clipped by this section's
// overflow-hidden sticky viewport. If NewsletterBookshelf's min-h values
// change, this floor must move with them.
const SHELF_WIDGET_HEIGHT = 'clamp(700px, 58vw, 740px)';

// The one place in NewsletterBookshelf's tree with this utility class is
// its own internal cover row (newsletter-bookshelf.tsx:629,
// `overflow-x-auto`) — the element that actually lays the covers out
// side by side. Selecting it structurally, rather than guessing a
// per-item pixel width, means we read the real DOM instead of duplicating
// a number that lives in a file we don't own and can't edit.
const COVER_ROW_SELECTOR = '[class*="overflow-x-auto"]';

// The exit flip fires in the last stretch of this pinned section
// regardless of travel, so the act still has a dominant motion beat at
// widths where the shelf already fits and there is nothing to pan.
const EXIT_FLIP_RANGE: [number, number] = [0.82, 1];

export function ActShelf({ items }: { items: NewsletterBookshelfItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  // Real measured width of NewsletterBookshelf's own cover row, or null
  // before it's known (nothing mounted yet / not found). Also drives the
  // track's own rendered width, so the pan visually reveals more covers
  // instead of just sliding a same-width box around.
  const [contentWidth, setContentWidth] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Nothing here is forced or guessed: the cover row is left to size
  // itself (NewsletterBookshelf renders exactly as it does on its other
  // routes), and we read its real scrollWidth — which reports full content
  // width even while the row's own overflow-x-auto would otherwise clip
  // it. Travel is therefore genuinely content-driven: it is legitimately
  // zero when the covers already fit the viewport (today's 12-item
  // archive at 1440px, for example), and grows on its own as the archive
  // grows, with no constant here to fall out of sync with
  // newsletter-bookshelf.tsx. Do not reintroduce a forced/guessed width to
  // manufacture travel — a sparse archive is supposed to sit still.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    let coverRow: HTMLElement | null = null;
    const ro = new ResizeObserver(measure);

    function measure() {
      const row =
        coverRow ?? container!.querySelector<HTMLElement>(COVER_ROW_SELECTOR);
      if (row && row !== coverRow) {
        coverRow = row;
        ro.observe(row);
      }
      // Before NewsletterBookshelf's ssr:false chunk has mounted, `row` is
      // null — width unknown, not zero content. Report that as "no travel
      // yet" without ever producing a NaN/negative jump: contentWidth
      // stays null (track keeps its safe full-width fallback) until a real
      // measurement exists.
      const width = row ? row.scrollWidth : null;
      setContentWidth(width);
      const overflow = (width ?? 0) - viewport!.clientWidth;
      setTravel(overflow > 0 ? overflow : 0);
    }

    measure();
    ro.observe(viewport);

    // The cover row doesn't exist in the DOM until the dynamic import
    // resolves; a MutationObserver on the container catches that mount
    // (and any later reshuffle) so we start observing the real row instead
    // of only ever seeing the pre-mount "not found" state.
    const mo = new MutationObserver(measure);
    mo.observe(container, { childList: true, subtree: true });

    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  // The act's second beat: one cover flips open as the section is
  // scrolled past, independent of travel — so at widths where the shelf
  // already fits (travel === 0) the act still has a dominant motion idea
  // instead of sitting motionless.
  const exitFlipRotate = useTransform(scrollYProgress, EXIT_FLIP_RANGE, [0, 180]);
  const flipItem = items[0];

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
        <motion.div
          style={{
            x,
            // Before a real measurement exists, the track keeps its
            // normal full-row width (matches the heading/CTA) as a safe
            // fallback. Once NewsletterBookshelf has mounted and its cover
            // row has been measured, the track is sized to that real
            // content width — whether or not it ends up overflowing the
            // viewport — so a fitting shelf is centered at its own size
            // rather than stretched, and an overflowing one is exactly as
            // wide as its covers, not a guess.
            width: contentWidth ?? undefined,
          }}
          // When the archive is short enough that the track already fits
          // the viewport (travel === 0, nothing to pan), center it like
          // the heading/CTA above and below instead of leaving it hugging
          // the left edge.
          className={travel === 0 ? 'mx-auto flex' : 'flex'}
        >
          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: SHELF_WIDGET_HEIGHT }}
          >
            <NewsletterBookshelf items={items} brand="GEC DISPATCH" />
          </div>
        </motion.div>
        {cta}

        {flipItem && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-6"
            style={{ width: 96, height: 128, perspective: 1200 }}
          >
            <motion.div
              style={{
                rotateY: exitFlipRotate,
                transformStyle: 'preserve-3d',
              }}
              className="relative h-full w-full"
            >
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-lg p-2 [backface-visibility:hidden]"
                style={{
                  background: flipItem.color ?? 'var(--gec-crimson)',
                  boxShadow: 'var(--elev-lifted)',
                }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-white/80">
                  {flipItem.editionNumber ?? flipItem.date}
                </span>
                <span className="font-display text-xs font-bold leading-tight text-white">
                  {flipItem.title}
                </span>
              </div>
              <div
                className="surface-card absolute inset-0 flex items-center justify-center rounded-lg p-2 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{ boxShadow: 'var(--elev-lifted)' }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--gec-ink-muted)]">
                  Open the shelf →
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
