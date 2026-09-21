import type { Metadata } from 'next';
import { NewsletterSection } from '@/components/NewsletterSection';

export const metadata: Metadata = {
  title: 'The GEC Dispatch — Newsletter Archives',
  description:
    '3D WebGL cloth-bound bookshelf archiving GEC student venture deep-dives, seed grant blueprints, cap table field notes, and operator playbooks.',
};

export default function NewsletterPage() {
  return (
    <main className="w-full flex-1 flex flex-col bg-[#FCF8ED] min-h-screen pt-20">
      <NewsletterSection />
      <footer className="border-t border-[rgba(163,4,15,0.15)] bg-[#FFFDF8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-mono text-[#5F5650] text-center">
          GEC ARCHIVES · QUARTERLY FOUNDER DISPATCH
        </div>
      </footer>
    </main>
  );
}
