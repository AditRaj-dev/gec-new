import type { Metadata } from 'next';
import { Archivo, Manrope, JetBrains_Mono, UnifrakturMaguntia, Playfair_Display, Old_Standard_TT } from 'next/font/google';
import './globals.css';
import { BrandEntranceCurtain } from '@/components/BrandEntranceCurtain';
import { Navbar } from '@/components/Navbar';
import { SiteFooter } from '@/components/SiteFooter';
import { DispatchBin } from '@/components/dispatch-bin/DispatchBin';

const archivo = Archivo({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-archivo', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-jetbrains', display: 'swap' });
// Dispatch broadsheet faces. preload:false: only the reader and the bin art use them, so they load on demand.
const blackletter = UnifrakturMaguntia({ subsets: ['latin'], weight: '400', variable: '--font-blackletter', display: 'swap', preload: false });
const newsHead = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['normal', 'italic'], variable: '--font-news-head', display: 'swap', preload: false });
const newsSerif = Old_Standard_TT({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-news-serif', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: 'Galgotias Entrepreneurship Cell',
  description:
    'Official Entrepreneurship Cell of Galgotias University. Igniting student innovation, startup incubation, and high-impact venture creation.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${jetbrains.variable} ${blackletter.variable} ${newsHead.variable} ${newsSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&display=swap" />
      </head>
      <body>
        <BrandEntranceCurtain />
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter />
        <DispatchBin />
      </body>
    </html>
  );
}
