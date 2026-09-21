'use client';

import dynamic from 'next/dynamic';
import { GEC_DISPATCH_ARCHIVE } from '@/components/NewsletterSection';

// Only the 3D WebGL bookshelf — no subscribe form, no dispatch inspector, no filter chrome.
const NewsletterBookshelf = dynamic(
  () => import('@/components/ui/newsletter-bookshelf').then((m) => m.NewsletterBookshelf),
  { ssr: false }
);

export default function StoriesPage() {
  return (
    <main className="w-full min-h-screen bg-[#FCF8ED] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[rgba(163,4,15,0.22)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A3040F]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A3040F]">
            GEC Archives · Founder Chronicles
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#222222] leading-[1.05]">
          People Build Companies.
          <br />
          <span className="text-[#A3040F]">Stories Build Culture.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#5F5650] max-w-2xl mx-auto leading-relaxed">
          Drag horizontally to slide the shelf. Click any volume to flip its cover in 3D.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterBookshelf items={GEC_DISPATCH_ARCHIVE} brand="GEC DISPATCH" />
      </div>
    </main>
  );
}
