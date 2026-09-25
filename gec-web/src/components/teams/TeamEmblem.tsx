import React from 'react';

/**
 * Per-team line emblems for the Stage Manager rail (64×64, stroke = currentColor).
 * Drawing rule: no stroke crosses another — connectors stop exactly on shape edges.
 * `.s` = soft translucent fill under an outline, `.f` = solid fill.
 */
const EMBLEMS: Record<number, React.ReactNode> = {
  // 01 Startup Dev — rocket
  1: (
    <>
      <path className="s" d="M32 6c8 6 12 15 12 26v8H20v-8c0-11 4-20 12-26z" />
      <path d="M32 6c8 6 12 15 12 26v8H20v-8c0-11 4-20 12-26z" />
      <circle cx="32" cy="23" r="5" />
      <path d="M20 31l-7 7v7l7-5M44 31l7 7v7l-7-5" />
      <path d="M27 45c0 5 2 9 5 13 3-4 5-8 5-13" />
    </>
  ),
  // 02 PR & Networking — hub + nodes
  2: (
    <>
      <path d="M26 26.7L17.7 19.3M38.9 27.9L47.7 22.6M26.7 38L19.3 46.3M38 37.3L46.3 44.7M19 16.5L47 19.5M21 49.7L45 48.3" />
      <circle className="s" cx="32" cy="32" r="8" />
      <circle cx="32" cy="32" r="8" />
      <circle className="f" cx="14" cy="16" r="5" />
      <circle className="f" cx="52" cy="20" r="5" />
      <circle className="f" cx="16" cy="50" r="5" />
      <circle className="f" cx="50" cy="48" r="5" />
    </>
  ),
  // 03 Marketing & CA — megaphone
  3: (
    <>
      <path className="s" d="M10 26h10l22-12v36L20 38H10z" />
      <path d="M10 26h10l22-12v36L20 38H10z" />
      <path d="M20 26v12" />
      <path d="M13 38l3 13h6l-2-13" />
      <path d="M50 25c2.5 2 3.5 4.5 3.5 7s-1 5-3.5 7M55 18c4.5 4 6.5 8.5 6.5 14s-2 10-6.5 14" />
    </>
  ),
  // 04 Events — spotlight on a star
  4: (
    <>
      <path className="s" d="M22 8h20l-6 16h-8z" />
      <path d="M22 8h20l-6 16h-8z" />
      <path d="M27 28L14 52M37 28l13 24" strokeDasharray="4 4" />
      <path className="f" d="M32 34l3 6 6.5 1-4.7 4.5 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5L22.5 41l6.5-1z" />
      <path d="M8 58h48" />
    </>
  ),
  // 05 Digital Media — camera
  5: (
    <>
      <path className="s" d="M15 18h7l4-6h12l4 6h7a7 7 0 0 1 7 7v20a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V25a7 7 0 0 1 7-7z" />
      <path d="M15 18h7l4-6h12l4 6h7a7 7 0 0 1 7 7v20a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V25a7 7 0 0 1 7-7z" />
      <circle cx="32" cy="35" r="10" />
      <circle className="f" cx="32" cy="35" r="4" />
      <circle className="f" cx="48" cy="26" r="2" />
    </>
  ),
  // 06 Technical — chip with code brackets
  6: (
    <>
      <rect className="s" x="12" y="12" width="40" height="40" rx="8" />
      <rect x="12" y="12" width="40" height="40" rx="8" />
      <path d="M22 5v7M32 5v7M42 5v7M22 52v7M32 52v7M42 52v7M5 22h7M5 32h7M5 42h7M52 22h7M52 32h7M52 42h7" />
      <path d="M26 26l-6 6 6 6M38 26l6 6-6 6M34.5 23l-5 18" />
    </>
  ),
  // 07 Career Connect — briefcase + growth line
  7: (
    <>
      <rect className="s" x="8" y="22" width="48" height="32" rx="6" />
      <rect x="8" y="22" width="48" height="32" rx="6" />
      <path d="M24 22v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6" />
      <path d="M17 46l8-7 6 4 12-11M36 32h7v7" />
    </>
  ),
};

export function TeamEmblem({ index, className }: { index: number; className?: string }) {
  const art = EMBLEMS[index];
  if (!art) return null;
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
