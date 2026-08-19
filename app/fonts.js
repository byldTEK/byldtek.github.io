import { Manrope, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';

// Self-hosted via next/font instead of a Google Fonts <link> — removes the
// render-blocking CDN round trip and avoids layout shift on font load.
export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});

export const fontVariables = `${manrope.variable} ${ibmPlexMono.variable} ${ibmPlexSansArabic.variable}`;
