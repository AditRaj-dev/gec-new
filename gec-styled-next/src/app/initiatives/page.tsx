'use client';

import dynamic from 'next/dynamic';

// Only the interactive Deskfolio desk scene — no styled canvas duplicate, no extra headers.
const DeskFolioPage = dynamic(
  () => import('@/components/deskfolio').then((m) => m.DeskFolioPage),
  { ssr: false }
);

export default function InitiativesPage() {
  return (
    <main className="w-full min-h-screen bg-[#FCF8ED] pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[rgba(163,4,15,0.22)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3040F]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A3040F]">
            The Programs Desk
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#222222] leading-[1.05]">
          Every Initiative,
          <br />
          <span className="text-[#A3040F]">One Living Desk.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#5F5650] max-w-2xl mx-auto leading-relaxed">
          Incubation, E-Summit, Handbook, Founders — tap the lamp, open a drawer, pick up
          any artifact to explore that programme.
        </p>
      </div>

      <div className="w-full h-[calc(100vh-260px)] min-h-[520px] relative overflow-hidden">
        <DeskFolioPage />
      </div>
    </main>
  );
}
