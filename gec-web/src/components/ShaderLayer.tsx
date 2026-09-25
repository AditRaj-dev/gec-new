'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createRenderer, lastError, type ShaderFamily, type ShaderRenderer } from '@/lib/shaders/renderer';
import { PHONE_MAX } from '@/lib/shaders/policy';

/**
 * Decorative WebGL layer. Must be the first child of a `.gec-shader-host`
 * section whose CSS fallback is already a finished surface. Canvas fades in
 * over it only once it has drawn; any failure removes the canvas.
 *
 * Phones (≤768px) run the same families at 0.35×DPR / 24fps, create their context only when the section
 * first comes near the screen, and show a still frame on Save-Data or low-memory devices.
 * ponytail: contexts are created lazily but never released, so a very long page can pass the browser's
 * WebGL context limit; the oldest context is then lost and its section falls back to the CSS surface.
 * Pool one offscreen context if that ever shows up in practice.
 */
// ?shaders=debug: an on-page panel with each layer's state and the device's WebGL facts, for phones where
// there's no console to look at. Off (and free) otherwise.
const debugRows = new Map<string, string>();
let debugEl: HTMLPreElement | null = null;
function debug(id: string, family: string, status: string | null) {
  if (typeof location === 'undefined' || !/[?&]shaders=debug/.test(location.search)) return;
  if (status === null) debugRows.delete(id); // unmounted
  else debugRows.set(id, `${family.padEnd(10)} ${status}`);
  if (!debugEl) {
    const gl = document.createElement('canvas').getContext('webgl');
    const hp = gl?.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ?? 0;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    debugEl = document.createElement('pre');
    debugEl.dataset.head = `webgl ${gl ? 'yes' : 'NO'} · highp ${hp ? hp + 'bit' : 'NO'} · dpr ${devicePixelRatio} · w ${innerWidth}\n` +
      `mem ${nav.deviceMemory ?? '?'}GB · saveData ${!!nav.connection?.saveData} · reduce ${matchMedia('(prefers-reduced-motion: reduce)').matches}`;
    debugEl.style.cssText = 'position:fixed;left:8px;right:8px;top:8px;z-index:99999;margin:0;padding:8px 10px;max-height:45vh;overflow:auto;' +
      'font:11px/1.45 ui-monospace,monospace;color:#FBCA05;background:rgba(20,21,24,.92);border-radius:8px;white-space:pre-wrap;pointer-events:none';
    document.body.append(debugEl);
  }
  debugEl.textContent = `${debugEl.dataset.head}\n${[...debugRows.values()].join('\n')}`;
}

export function ShaderLayer({ family }: { family: ShaderFamily }) {
  const id = useId();
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'off' | 'ready' | 'failed'>('off');

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const phone = window.matchMedia(`(max-width: ${PHONE_MAX}px)`).matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const still =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (phone && (!!nav.connection?.saveData || (nav.deviceMemory ?? 8) < 4));

    let r: ShaderRenderer | null = null;
    let failed = false;
    let visible = false;
    const start = () => {
      if (r || failed) return;
      r = createRenderer(canvas, family, phone);
      if (!r) { failed = true; setState('failed'); debug(id, family, `FAILED ${lastError}`); return; }
      setState('ready');
      debug(id, family, still ? 'still frame' : `running ${canvas.width}×${canvas.height}`);
      if (still) r.freeze();
    };
    const sync = () => {
      if (!r || still) return;
      if (visible && !document.hidden) r.play();
      else r.pause();
    };

    // Created on first intersection, never in the effect body: React dev StrictMode mounts twice, and the first
    // cleanup's loseContext() would leave the remount a dead context on the same canvas.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        sync();
      },
      { rootMargin: phone ? '50% 0px' : '300px' }
    );
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    const onLost = (e: Event) => { e.preventDefault(); r?.destroy(); r = null; failed = true; setState('failed'); debug(id, family, 'CONTEXT LOST'); };
    debug(id, family, 'waiting (off screen)');
    canvas.addEventListener('webglcontextlost', onLost);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('webglcontextlost', onLost);
      r?.destroy();
      debug(id, family, null);
    };
  }, [family, id]);

  if (state === 'failed') return null;
  return <canvas ref={ref} aria-hidden="true" data-ready={state === 'ready' || undefined} className={`gec-shader-layer gec-shader-${family}`} />;
}
