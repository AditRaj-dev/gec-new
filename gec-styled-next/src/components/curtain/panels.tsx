'use client';

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
  /** 0 = fully open, 1 = fully closed */
  shut: number;
  showSeam?: boolean;
}) {
  const count = SLAT_EFFECTS.includes(effect) ? 5 : 2;
  return (
    <div
      aria-hidden
      className={`gc-panels gc-${effect}`}
      style={{ ['--shut' as string]: String(shut) }}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`gc-panel gc-panel-${i === 0 ? 'a' : 'b'}`} />
      ))}
      {showSeam && shut > 0.02 && shut < 0.98 && <div className="gc-seam" />}
    </div>
  );
}
