'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { holeOpacity, holeRadius, holeScale, isLive, RELEASE_AT } from '@/lib/act';
import './full-viewport-act.css';

// Shared across every mounted FullViewportAct instance: the navbar-hiding flag
// reflects whether ANY act is live, not just the last one to fire a change event.
const liveActs = new Set<string>();

function applyLiveActs() {
  if (liveActs.size > 0) document.documentElement.dataset.gecAct = 'live';
  else delete document.documentElement.dataset.gecAct;
}

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
  const instanceId = useId();
  const reduce = useReducedMotion();
  // useReducedMotion() resolves synchronously on the client's first render
  // (matchMedia is read eagerly), which would diverge from the server's
  // render. Mirror it into state via an effect so the first client render
  // still matches the server, then adopt the real value post-hydration.
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const scale = useTransform(scrollYProgress, holeScale);
  const radius = useTransform(scrollYProgress, (p) => `${holeRadius(p)}px`);
  const opacity = useTransform(scrollYProgress, holeOpacity);

  useEffect(() => { setReduced(!!reduce); }, [reduce]);

  // Mount the heavy component once the runway is within one viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMounted(true); io.disconnect(); } }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Single source of truth for "am I live", used both by the scroll listener
  // and by the mount effect below (for restored scroll positions / no motion).
  function updateLive(p: number) {
    if (reduced) {
      setLive(true);
      return;
    }
    const nowLive = isLive(p);
    setLive(nowLive);
    if (nowLive && p < RELEASE_AT) liveActs.add(instanceId);
    else liveActs.delete(instanceId);
    applyLiveActs();
  }

  useMotionValueEvent(scrollYProgress, 'change', updateLive);

  // Re-evaluate once `reduced` is known (and whenever it changes), in case
  // the page loaded with a scroll position already past EXPAND_END.
  useEffect(() => {
    updateLive(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => () => { liveActs.delete(instanceId); applyLiveActs(); }, [instanceId]);

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
        style={{ height: reduced ? '100dvh' : `${runway * 100}dvh` }}
      >
        <div className="fva-sticky">
          <div className="fva-content" data-live={live || undefined}>
            {mounted ? children(scrollYProgress) : null}
          </div>
          {!reduced && <motion.div className="fva-hole" aria-hidden="true" style={{ scale, borderRadius: radius, opacity }} />}
        </div>
      </section>
      {endId && <span id={endId} tabIndex={-1} />}
    </>
  );
}
