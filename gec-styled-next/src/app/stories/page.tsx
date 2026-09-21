'use client';

import StyledPageFrame from '@/components/StyledPageFrame';
import dynamic from 'next/dynamic';

const NewsletterSection = dynamic(
  () => import('@/components/NewsletterSection').then((m) => m.NewsletterSection),
  { ssr: false }
);

export default function StoriesPage() {
  return (
    <main className="w-full flex flex-col">
      {/* 1. Styled Stories canvas (founder portfolio directory) */}
      <StyledPageFrame page="stories" />

      {/* 2. Interactive Dispatch Bookshelf — the founder chronicles archive */}
      <section id="dispatch-shelf" className="w-full bg-[#FCF8ED] border-t border-[rgba(163,4,15,0.15)]">
        <NewsletterSection />
      </section>
    </main>
  );
}
