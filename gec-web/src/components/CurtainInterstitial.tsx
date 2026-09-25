'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
} from 'motion/react';
import { CurtainPanels, type CurtainEffect } from './curtain/panels';
import { ShaderLayer } from './ShaderLayer';
import { useIsPhone } from '@/lib/useIsPhone';
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
  // useReducedMotion() is already true on the client's first render but not on the server;
  // adopt it after hydration (as FullViewportAct does) so the first render matches the server.
  const prefersReduced = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!prefersReduced), [prefersReduced]);
  const phone = useIsPhone();
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
  const shaderOpacity = useTransform(shut, [0, 0.82, 1], [0, 0, 1]);

  const kicker = liveKicker(count, noun);

  // Phones: no full-screen curtain. The act header fades up and its shelf/fan make their own entrance.
  if (phone) return null;

  // Reduced motion: a static crimson band carrying the same words. No travel.
  if (reduce) {
    return (
      <div ref={ref} data-surface="crimson" className="surface-crimson gec-shader-host gec-fallback-liquid">
        <ShaderLayer family="liquid" />
        <div className="relative flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
          <span className="font-[family-name:var(--font-mono)] text-[clamp(0.875rem,1.1vw,1.125rem)] font-semibold uppercase tracking-[0.14em] text-[var(--gec-gold)]">
            {kicker}
          </span>
          <p className="m-0 max-w-[24ch] text-[length:var(--text-2xl)] font-bold leading-[1.02] text-white">
            {headline}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} data-surface="crimson" className="relative h-[180vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <CurtainPanels effect={effect} shut={shut} />
        <motion.div
          aria-hidden="true"
          className="gc-shader-layer gec-shader-host"
          style={{ opacity: shaderOpacity }}
        >
          <ShaderLayer family="liquid" />
        </motion.div>
        <motion.div
          style={{ opacity: hold, y: lift }}
          className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-2 px-6 text-center"
        >
          <span className="font-[family-name:var(--font-mono)] text-[clamp(0.875rem,1.1vw,1.125rem)] font-semibold uppercase tracking-[0.14em] text-[var(--gec-gold)]">
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
