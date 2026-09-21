import type { Metadata } from 'next';
import StyledPageFrame from '@/components/StyledPageFrame';

export const metadata: Metadata = {
  title: 'About | Galgotias Entrepreneurship Cell',
  description: 'The story, mission and manifesto behind GEC.',
};

export default function AboutPage() {
  return (
    <main className="w-full">
      <StyledPageFrame page="about" />
    </main>
  );
}
