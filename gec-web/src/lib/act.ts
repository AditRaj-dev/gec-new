/** Scroll phases of a FullViewportAct runway, as fractions of its progress (0–1). */
export const EXPAND_END = 0.22;
export const HOLE_FADE_START = 0.18;
export const SHELF_START = 0.3;
export const SHELF_END = 0.92;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
// Rounded to 1e-6 to avoid binary floating-point drift (e.g. 0.92 - 0.3 !== 0.62)
// producing 499.9999999999999 instead of 500 for shelfOffset(0.61, 1000).
const round = (v: number) => Math.round(v * 1e6) / 1e6;
const seg = (p: number, a: number, b: number) => clamp(round((p - a) / (b - a)));

export const holeScale = (p: number) => 0.82 + 0.18 * seg(p, 0, EXPAND_END);
export const holeRadius = (p: number) => 20 * (1 - seg(p, 0, EXPAND_END));
export const holeOpacity = (p: number) => 1 - seg(p, HOLE_FADE_START, EXPAND_END);
export const isLive = (p: number) => p >= EXPAND_END;
export const shelfOffset = (p: number, travel: number) => Math.max(0, travel) * seg(p, SHELF_START, SHELF_END);
