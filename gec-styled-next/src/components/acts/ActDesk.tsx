'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { DeskFolioPage, GEC_BOOKS } from '@/components/deskfolio';

// DeskFolioDesktop (loaded inside DeskFolioPage via its own ssr:false dynamic
// import) sizes itself from STAGE_BASE_H (720) times a viewport-derived scale
// clamped to [0.24, 1]. An explicit height — not just min-height — on this
// wrapper means the box occupies the same space whether DeskFolioPage is
// showing its own loading placeholder or the real scene, so nothing below
// this section shifts when the scene finishes loading.
const DESK_SCENE_HEIGHT = 'clamp(420px, 62vw, 720px)';

export function ActDesk() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  const programmeCount = GEC_BOOKS.length;

  return (
    <section
      ref={sectionRef}
      aria-label="The programmes desk"
      className="surface-cream relative px-6 py-20 md:px-10 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <div className="mx-auto flex max-w-[52ch] flex-col gap-3 text-center">
          <h2
            className="font-display font-bold text-[var(--gec-ink)]"
            style={{ fontSize: 'var(--text-2xl)' }}
          >
            The programmes desk.
          </h2>
          <p
            className="text-[var(--gec-ink-muted)]"
            style={{ fontSize: 'var(--text-lg)' }}
          >
            Tap the lamp, open a drawer, pick up any artifact — every GEC
            programme lives on this one interactive desk.
          </p>
        </div>

        <motion.div
          style={{ scale: prefersReducedMotion ? 1 : scale }}
          className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[28px]"
        >
          <div
            className="surface-card relative w-full overflow-hidden rounded-[28px]"
            style={{ height: DESK_SCENE_HEIGHT, boxShadow: 'var(--elev-lifted)' }}
          >
            <DeskFolioPage />
          </div>
        </motion.div>

        <div className="text-center">
          <Link
            href="/initiatives"
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--gec-crimson)] px-6 py-3 text-sm font-medium text-white shadow-[var(--elev-raised)] transition-colors hover:bg-[var(--gec-crimson-act)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gec-crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gec-canvas)]"
            style={{ transitionDuration: 'var(--dur-ui)' }}
          >
            Explore all {programmeCount} programmes →
          </Link>
        </div>
      </div>
    </section>
  );
}
