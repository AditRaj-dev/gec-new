/** Scroll phases of a FullViewportAct runway, as fractions of its progress (0–1). */
export const EXPAND_END = 0.22;
export const HOLE_FADE_START = 0.18;
export const SHELF_START = 0.3;
export const SHELF_END = 0.92;
// The live flag releases just shy of 1 so the navbar reappears before the
// runway's very last frame, instead of snapping back exactly at the boundary.
export const RELEASE_AT = 0.999;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export const holeScale = (p: number) => 0.82 + 0.18 * seg(p, 0, EXPAND_END);
export const holeRadius = (p: number) => 20 * (1 - seg(p, 0, EXPAND_END));
export const holeOpacity = (p: number) => 1 - seg(p, HOLE_FADE_START, EXPAND_END);
export const isLive = (p: number) => p >= EXPAND_END;
export const shelfOffset = (p: number, travel: number) => Math.max(0, travel) * seg(p, SHELF_START, SHELF_END);
