'use client';

import { useRef, useState } from 'react';
import {
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  motion,
  type MotionValue,
} from 'motion/react';
import { CurtainPanels, type CurtainEffect } from './curtain/panels';
import {
  liveKicker,
  CURTAIN_SHUT_KEYFRAMES,
  CURTAIN_HOLD_KEYFRAMES,
} from '@/lib/motion';

export function CurtainInterstitial({
  headline,
  count,
  noun,
  effect = 'wipe',
}: {
  headline: string;
  count: number;
  noun: string;
  effect?: CurtainEffect;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 0-.42 close, .42-.58 hold shut, .58-1 part (keyframes from lib/motion)
  const shut = useTransform(
    scrollYProgress,
    [...CURTAIN_SHUT_KEYFRAMES],
    [0, 1, 1, 0]
  );
  const hold = useTransform(
    scrollYProgress,
    [...CURTAIN_HOLD_KEYFRAMES],
    [0, 1, 1, 0]
  );
  const lift = useTransform(hold, [0, 1], [14, 0]);

  const kicker = liveKicker(count, noun);

  // Reduced motion: a static crimson band carrying the same words. No travel.
  if (reduce) {
    return (
      <div className="surface-crimson flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.09em] text-[var(--gec-gold)]">
          {kicker}
        </span>
        <p className="m-0 max-w-[24ch] text-[length:var(--text-2xl)] font-bold leading-[1.02] text-white">
          {headline}
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <CurtainShell shut={shut} effect={effect} />
        <motion.div
          style={{ opacity: hold, y: lift }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
        >
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.09em] text-[var(--gec-gold)]">
            {kicker}
          </span>
          <p className="m-0 max-w-[24ch] text-[length:var(--text-3xl)] font-bold leading-[1.02] text-white">
            {headline}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/** Bridges a MotionValue to the CSS custom property the effects read. */
function CurtainShell({
  shut,
  effect,
}: {
  shut: MotionValue<number>;
  effect: CurtainEffect;
}) {
  const [value, setValue] = useState(0);
  useMotionValueEvent(shut, 'change', setValue);
  return <CurtainPanels effect={effect} shut={value} showSeam />;
}
