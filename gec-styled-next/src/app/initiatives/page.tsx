'use client';

import StyledPageFrame from '@/components/StyledPageFrame';
import dynamic from 'next/dynamic';

// DeskFolio uses browser APIs (drag, canvas) — load client only
const DeskFolioPage = dynamic(
  () => import('@/components/deskfolio').then((m) => m.DeskFolioPage),
  { ssr: false }
);

export default function InitiativesPage() {
  return (
    <main className="w-full flex flex-col">
      {/* 1. Styled Initiatives canvas (hero + SDP roadmap + cohort dates) */}
      <StyledPageFrame page="initiatives" />

      {/* 2. Interactive Deskfolio — the initiatives / programs desk */}
      <section id="programs-desk" className="w-full bg-[#FCF8ED] border-t border-[rgba(163,4,15,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4 text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#A3040F]">
            THE PROGRAMS DESK · TAP ANY STICKER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#222222]">
            Every Initiative Lives on One Desk.
          </h2>
          <p className="text-sm sm:text-base text-[#5F5650] max-w-2xl mx-auto">
            Incubation, E-Summit, Handbook, Founders programme &mdash; open the drawer or tap the lamp
            to explore each cohort as an interactive artifact.
          </p>
        </div>
        <div className="w-full h-[75vh] relative overflow-hidden">
          <DeskFolioPage />
        </div>
      </section>
    </main>
  );
}
