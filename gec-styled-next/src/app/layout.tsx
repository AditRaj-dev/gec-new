import type { Metadata } from 'next';
import './globals.css';
import { BrandEntranceCurtain } from '@/components/BrandEntranceCurtain';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Galgotias Entrepreneurship Cell',
  description:
    'Official Entrepreneurship Cell of Galgotias University. Igniting student innovation, startup incubation, and high-impact venture creation.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <BrandEntranceCurtain />
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
