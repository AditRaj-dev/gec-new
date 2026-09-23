'use client';

import { motion, type MotionValue } from 'motion/react';
import './curtain-effects.css';

export type CurtainEffect =
  | 'doors-v' | 'doors-h' | 'wipe' | 'iris' | 'blinds' | 'stagger-wipe';

const SLAT_EFFECTS: CurtainEffect[] = ['blinds', 'stagger-wipe'];

export function CurtainPanels({
  effect,
  shut,
  showSeam = false,
}: {
  effect: CurtainEffect;
  /**
   * 0 = fully open, 1 = fully closed. Accepts a MotionValue so scroll-driven
   * callers can write straight into the `--shut` custom property without a
   * React re-render on every frame — see CurtainInterstitial.
   */
  shut: MotionValue<number> | number;
  showSeam?: boolean;
}) {
  const count = SLAT_EFFECTS.includes(effect) ? 5 : 2;
  return (
    <motion.div
      aria-hidden
      className={`gc-panels gc-${effect}`}
      style={{ ['--shut' as string]: shut }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`gc-panel gc-panel-${i === 0 ? 'a' : 'b'}`} />
      ))}
      {/* Visibility is CSS-driven off --shut (see .gc-seam) so it works
          whether `shut` above is a plain number or a MotionValue. */}
      {showSeam && <div className="gc-seam" />}
    </motion.div>
  );
}
