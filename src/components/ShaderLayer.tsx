'use client';

import { useEffect, useRef, useState } from 'react';
import { createRenderer, type ShaderFamily } from '@/lib/shaders/renderer';
import { MIN_WIDTH } from '@/lib/shaders/policy';

/**
 * Decorative WebGL layer. Must be the first child of a `.gec-shader-host`
 * section whose CSS fallback is already a finished surface. Canvas fades in
 * over it only once it has drawn; any failure removes the canvas.
 */
export function ShaderLayer({ family }: { family: ShaderFamily }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'off' | 'ready' | 'failed'>('off');
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !matches) return;
    const r = createRenderer(canvas, family);
    if (!r) { setState('failed'); return; }
    setState('ready');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { r.freeze(); return () => r.destroy(); }

    let visible = false;
    const sync = () => (visible && !document.hidden ? r.play() : r.pause());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: '300px' });
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    const onLost = (e: Event) => { e.preventDefault(); r.destroy(); setState('failed'); };
    canvas.addEventListener('webglcontextlost', onLost);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', onLost);
      r.destroy();
    };
  }, [family, matches]);

  if (state === 'failed') return null;
  return <canvas ref={ref} aria-hidden="true" data-ready={state === 'ready' || undefined} className={`gec-shader-layer gec-shader-${family}`} />;
}
