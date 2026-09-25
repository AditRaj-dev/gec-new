'use client';

import { useSyncExternalStore } from 'react';

// Same breakpoint as full-viewport-act.css and StoriesAisle: at or below it the desk and the
// Stage Manager are swapped for their phone recompositions.
const QUERY = '(max-width: 768px)';

const subscribe = (onChange: () => void) => {
  const mq = matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

/** True on phone-width viewports. Server render (and hydration) assume desktop. */
export function useIsPhone() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}
