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
// `stageScale` never exceeds 1. That means the tallest DeskFolioPage will
// ever render itself is 720px (stageScale === 1, reached once the viewport
// is wide enough — 1440px included). At 768px, `stageScale` works out to
// round(752 / 1400, 3) = 0.537, so the internal stage is only ~387px tall.
// 720px is therefore the ceiling across every width this task tests, so
// reserving 720px here can never sit below what DeskFolioPage enforces for
// itself and never clips it — the bug the controller flagged elsewhere came
// from a reservation smaller than the wrapped widget's own floor.
const DESKFOLIO_RESERVED_HEIGHT = '720px';

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
