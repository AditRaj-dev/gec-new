import type { Metadata, Viewport } from 'next';
import { INDEXABLE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { Archivo, Manrope, JetBrains_Mono, UnifrakturMaguntia, Playfair_Display, Old_Standard_TT } from 'next/font/google';
import './globals.css';
import { BrandEntranceCurtain } from '@/components/BrandEntranceCurtain';
import { Navbar } from '@/components/Navbar';
import { SiteFooter } from '@/components/SiteFooter';
import { DispatchBin } from '@/components/dispatch-bin/DispatchBin';
import { getList, getSingleton } from '@/lib/content';
import { SITE_NAV_FALLBACK } from '@/content/siteNav';
import { DISPATCH_FALLBACK } from '@/content/dispatch';

const archivo = Archivo({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-archivo', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-jetbrains', display: 'swap' });
// Dispatch broadsheet faces. preload:false: only the reader and the bin art use them, so they load on demand.
const blackletter = UnifrakturMaguntia({ subsets: ['latin'], weight: '400', variable: '--font-blackletter', display: 'swap', preload: false });
const newsHead = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['normal', 'italic'], variable: '--font-news-head', display: 'swap', preload: false });
const newsSerif = Old_Standard_TT({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-news-serif', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  robots: { index: INDEXABLE, follow: INDEXABLE, googleBot: { 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: '#A3040F' };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [nav, issues] = await Promise.all([
    getSingleton('site-nav', SITE_NAV_FALLBACK),
    getList('dispatch-issues', DISPATCH_FALLBACK),
  ]);
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${jetbrains.variable} ${blackletter.variable} ${newsHead.variable} ${newsSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        {/* The woff2 files come from a second host; warm it too. ponytail: self-host Cabinet Grotesk via next/font/local to drop both. */}
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&display=swap" />
      </head>
      <body>
        <BrandEntranceCurtain />
        <Navbar nav={nav} />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter nav={nav} />
        <DispatchBin issues={issues} />
      </body>
    </html>
  );
}
