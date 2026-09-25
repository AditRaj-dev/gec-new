/** At or below this width shaders run in phone mode: lower resolution, 24fps, created lazily (ShaderLayer). */
export const PHONE_MAX = 768;
/** Average frame time above this over the guard window freezes the shader. */
export const FRAME_BUDGET_MS = 28;
export const GUARD_FRAMES = 45;
export const FPS_CAP = 30;
export const PHONE_FPS_CAP = 24;
const MAX_INTERNAL_WIDTH = 1280;
const PHONE_MAX_INTERNAL_WIDTH = 480;
/** Pixel budget for one phone print canvas (a 384×1670 footer at ~1.5×). */
const PHONE_CRISP_BUDGET = 1_600_000;

/**
 * Internal render scale. These shaders are soft, so half-res upscales invisibly; phones go softer still.
 * `crisp` (the line-based print families) on phones: 0.75×DPR up to 2 canvas px per CSS px, within a pixel
 * budget. Thin lines upscaled ~3× on high-DPR phones (Galaxy S25, 2.8×) look pixelated; 0.35×DPR turns them to haze.
 */
export function renderScale(cssWidth: number, dpr: number, phone = false, crisp = false, cssHeight = 0): number {
  if (phone && crisp) {
    const budget = cssHeight > 0 ? Math.sqrt(PHONE_CRISP_BUDGET / (Math.max(1, cssWidth) * cssHeight)) : 2;
    return Math.max(0.5, Math.min(0.75 * dpr, 2, budget));
  }
  const byDpr = Math.min(1, (phone ? 0.35 : 0.5) * dpr);
  // internal width = cssWidth × scale, capped at the max internal width
  return Math.min(byDpr, (phone ? PHONE_MAX_INTERNAL_WIDTH : MAX_INTERNAL_WIDTH) / Math.max(1, cssWidth));
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
