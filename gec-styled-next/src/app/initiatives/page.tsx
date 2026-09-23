'use client';

import dynamic from 'next/dynamic';

// Only the interactive Deskfolio desk scene — no styled canvas duplicate, no extra headers.
const DeskFolioPage = dynamic(
  () => import('@/components/deskfolio').then((m) => m.DeskFolioPage),
  { ssr: false }
);

// DeskFolioPage -> DeskFolioDesktop enforces its own real height: the stage
// scales to fit the viewport (STAGE_BASE_W 1400 / STAGE_BASE_H 720 in
// DeskFolioDesktop.tsx), and the wrapper that holds the scaled stage sets an
// explicit `height`/`minHeight` of `STAGE_BASE_H * stageScale`, capped so
// `stageScale` never exceeds 1:
//
//   pad = viewport.w < 768 ? 0 : 16
//   stageScale = min(1, max(0.24, round(((viewport.w - pad) / 1400) * 1000) / 1000))
//   height = round(720 * stageScale)
//
// A flat 720px reservation is safe at every width but wastes ~330px of
// cream at 768px, where the real height is only ~387px (see the arithmetic
// in the Task 7 fix report). Since `height` is linear in `viewport.w` for
// most of its range (720/1400 = 51.4286% per pixel of width, before the
// scale===1 cap or the scale===0.24 floor kick in), a CSS `vw`-based clamp
// tracks it far more tightly than one flat number, while staying above it:
//
//   reserved(w) = clamp(180px, 51.4286vw + 20px, 720px)
//
// The +20px constant is deliberately generous, not tight: `vw` in the
// browser is measured against the layout viewport (which usually includes
// the scrollbar), while `stageScale` above is computed from
// `window.innerWidth` — the two can disagree by the scrollbar's width, and
// the browser's own sub-pixel rounding adds a little more slack. +20px
// covers that uncertainty with margin at every width and still shrinks the
// 768px dead space from ~330px down to ~28px (720*0.5143 - 8.23px derived
// intercept means the two curves never cross below the reserved width; see
// fix report for the full width-by-width check). 180px is above the
// formula's floor case (stageScale's own floor of 0.24 -> 172.8px), and 720px
// re-asserts the same ceiling the flat value used, so this can never sit
// below what DeskFolioPage enforces for itself at any width — the bug the
// controller flagged elsewhere came from a reservation smaller than the
// wrapped widget's own floor.
const DESKFOLIO_RESERVED_HEIGHT = 'clamp(180px, calc(51.4286vw + 20px), 720px)';

export default function InitiativesPage() {
  return (
    <main className="surface-cream w-full min-h-screen pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full surface-card border border-[var(--gec-border)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gec-crimson)]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gec-crimson)]">
            The Programs Desk
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--gec-ink)] leading-[1.05]">
          Every Initiative,
          <br />
          <span className="text-[var(--gec-crimson)]">One Living Desk.</span>
        </h1>
        <p className="text-base sm:text-lg text-[var(--gec-ink-muted)] max-w-2xl mx-auto leading-relaxed">
          Incubation, E-Summit, Handbook, Founders — tap the lamp, open a drawer, pick up
          any artifact to explore that programme.
        </p>
      </div>

      <div
        className="w-full relative overflow-hidden"
        style={{ minHeight: DESKFOLIO_RESERVED_HEIGHT }}
      >
        <DeskFolioPage />
      </div>
    </main>
  );
}
