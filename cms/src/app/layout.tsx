import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CopilotProvider } from '../context/CopilotContext';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'GEC CMS · Digital Command Center',
  description: 'Internal content management, data collection, and stakeholder operations for Galgotias Entrepreneurship Cell.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="antialiased min-h-screen bg-[#FCF8ED] text-[#222222]">
        <AuthProvider>
          <CopilotProvider>
            {children}
          </CopilotProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
