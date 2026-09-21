import type { Metadata } from 'next';
import './globals.css';
import { BrandEntranceCurtain } from '@/components/BrandEntranceCurtain';

export const metadata: Metadata = {
  title: 'Galgotias Entrepreneurship Cell',
  description: 'Galgotias Entrepreneurship Cell',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <BrandEntranceCurtain />
        {children}
      </body>
    </html>
  );
}
