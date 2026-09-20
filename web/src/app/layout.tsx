import type { Metadata } from 'next';
import './globals.css';
import { BrandEntranceCurtain } from '@/components/BrandEntranceCurtain';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Galgotias Entrepreneurship Cell | GEC',
  description:
    'Official Entrepreneurship Cell of Galgotias University. Igniting student innovation, startup incubation, and high-impact venture creation.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FCF8ED] text-[#222222] antialiased">
        {/* Entrance curtain with 72-frame smooth bulb glow & FLIP docking into #navbar-brand-logo */}
        <BrandEntranceCurtain />
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
