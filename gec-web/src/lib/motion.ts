/** Motion tokens. Every duration, easing and stagger in the app comes from here. */
export const DURATION = {
  instant: 120,
  micro: 180,
  macro: 320,
  act: 480,
} as const;

export const EASE = {
  /** --ease-spring: the wireframe's single interactive curve */
  spring: [0.16, 1, 0.3, 1] as const,
  springCss: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const STAGGER = 0.04; // seconds between items in a list

const EXIT_MULTIPLIER = 0.65;

/** Exits are always faster than entrances. */
export function exitDuration(enterMs: number): number {
  return Math.round(enterMs * EXIT_MULTIPLIER);
}

/**
 * Keyframes for the curtain-shut phase: panels closed 0 -> 0.42, held shut
 * 0.42 -> 0.58, panels part 0.58 -> 1. Shared with the `curtainProgress`
 * calculation below and with Task 2's `useTransform` call, so the four
 * breakpoints live in exactly one place.
 */
export const CURTAIN_SHUT_KEYFRAMES = [0, 0.42, 0.58, 1] as const;

/**
 * Keyframes for the curtain-hold line: fades in 0.3 -> 0.46, fully visible
 * until 0.56, fades out by 0.7. Shared with Task 2's `useTransform` call.
 */
export const CURTAIN_HOLD_KEYFRAMES = [0.3, 0.46, 0.56, 0.7] as const;

/**
 * Maps raw scroll position to curtain state.
 * 0.00-0.42 panels close, 0.42-0.58 held shut, 0.58-1.00 panels part.
 * `shut` drives panel travel (0 open, 1 closed); `hold` drives line opacity.
 */
export function curtainProgress(
  scrollY: number,
  start: number,
  length: number
): { shut: number; hold: number } {
  if (length <= 0) return { shut: 0, hold: 0 };
  const p = clamp((scrollY - start) / length, 0, 1);
  const [closeStart, closeEnd, openStart, openEnd] = CURTAIN_SHUT_KEYFRAMES;
  const close = segment(p, closeStart, closeEnd);
  const open = segment(p, openStart, openEnd);
  const shut = clamp(close - open, 0, 1);
  const [holdInStart, holdInEnd, holdOutStart, holdOutEnd] = CURTAIN_HOLD_KEYFRAMES;
  const hold = Math.min(segment(p, holdInStart, holdInEnd), 1 - segment(p, holdOutStart, holdOutEnd));
  return { shut, hold };
}

/** Live count for a curtain kicker. Falls back to NEXT so a failed fetch never reads "0 TEAMS". */
export function liveKicker(count: number, noun: string): string {
  if (!Number.isFinite(count) || count <= 0) return 'NEXT';
  return `${count} ${noun.toUpperCase()}`;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function segment(p: number, a: number, b: number): number {
  return clamp((p - a) / (b - a), 0, 1);
}
