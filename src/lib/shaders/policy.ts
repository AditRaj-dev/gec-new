/** Below this width no shader canvas is created (mobile floor). */
export const MIN_WIDTH = 769;
/** Average frame time above this over the guard window freezes the shader. */
export const FRAME_BUDGET_MS = 28;
export const GUARD_FRAMES = 45;
export const FPS_CAP = 30;
const MAX_INTERNAL_WIDTH = 1280;

/** Internal render scale. These shaders are soft, so half-res upscales invisibly. */
export function renderScale(cssWidth: number, dpr: number): number {
  const byDpr = Math.min(1, 0.5 * dpr);
  // internal width = cssWidth × scale, capped at MAX_INTERNAL_WIDTH
  return Math.min(byDpr, MAX_INTERNAL_WIDTH / Math.max(1, cssWidth));
}

/** Decide once the first GUARD_FRAMES frames are in. Median, so a few hitches don't count. */
export function frameGuard(samplesMs: number[]): 'pending' | 'ok' | 'freeze' {
  if (samplesMs.length < GUARD_FRAMES) return 'pending';
  const sorted = [...samplesMs.slice(0, GUARD_FRAMES)].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] > FRAME_BUDGET_MS ? 'freeze' : 'ok';
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}
