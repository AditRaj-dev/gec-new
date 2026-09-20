import type { Metadata } from 'next';
import './globals.css';
import { BrandEntranceCurtain } from '@/components/BrandEntranceCurtain';
import { Navbar } from '@/components/Navbar';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("h-full scroll-smooth", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-[#FCF8ED] text-[#222222] antialiased">
        {/* Bubble Flat entrance curtain with raw-logo FLIP docking into #navbar-brand-logo */}
        <BrandEntranceCurtain />
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
