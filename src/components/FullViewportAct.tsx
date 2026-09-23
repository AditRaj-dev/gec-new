'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { holeOpacity, holeRadius, holeScale, isLive } from '@/lib/act';
import './full-viewport-act.css';

export function FullViewportAct({
  surface,
  runway,
  label,
  id,
  children,
}: {
  surface: 'cream' | 'sand';
  runway: number;
  label: string;
  id?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(!!reduce);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const scale = useTransform(scrollYProgress, holeScale);
  const radius = useTransform(scrollYProgress, (p) => `${holeRadius(p)}px`);
  const opacity = useTransform(scrollYProgress, holeOpacity);

  // Mount the heavy component once the runway is within one viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMounted(true); io.disconnect(); } }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduce) return;
    const nowLive = isLive(p);
    setLive(nowLive);
    if (nowLive && p < 0.999) document.documentElement.dataset.gecAct = 'live';
    else delete document.documentElement.dataset.gecAct;
  });
  useEffect(() => () => { delete document.documentElement.dataset.gecAct; }, []);

  const endId = id ? `${id}-end` : undefined;
  return (
    <>
      {endId && <a className="fva-skip" href={`#${endId}`}>Skip past {label}</a>}
      <section
        ref={ref}
        id={id}
        aria-label={label}
        data-surface={surface}
        className={`fva surface-${surface}`}
        style={{ height: reduce ? '100dvh' : `${runway * 100}dvh` }}
      >
        <div className="fva-sticky">
          <div className="fva-content" data-live={live || undefined}>
            {mounted ? children(scrollYProgress) : null}
          </div>
          {!reduce && <motion.div className="fva-hole" aria-hidden="true" style={{ scale, borderRadius: radius, opacity }} />}
        </div>
      </section>
      {endId && <span id={endId} tabIndex={-1} />}
    </>
  );
}
