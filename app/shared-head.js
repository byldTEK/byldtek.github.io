// Shared between the two root layouts (app/(en)/layout.js for "/", app/(ar)/ar/layout.js
// for "/ar/"). Each route needs its own root layout so <html lang/dir> is correct in the
// server-rendered HTML — patching it client-side only (as the old single shared layout
// did) caused a real hydration mismatch on every /ar/ load, which corrupted the
// scroll-driven state tracking in dev mode.

export const sharedMetadata = {
  metadataBase: new URL('https://byldtek.com'),
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  icons: {
    icon: '/byldtek-logo.svg',
    apple: '/byldtek-logo.png',
  },
};

export const sharedViewport = {
  themeColor: '#0B1320',
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://byldtek.com/#organization',
      name: 'byldTEK',
      alternateName: 'byldtek.com',
      url: 'https://byldtek.com/',
      description:
        'byldTEK is a software engineering company that turns ideas, business problems, and opportunities into working digital products and systems. We design and build AI and automation solutions, web platforms, mobile applications, backend systems, APIs, integrations, and cloud infrastructure — from product definition and architecture through development, deployment, and iteration.',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://byldtek.com/#logo',
        url: 'https://byldtek.com/byldtek-logo.png',
        contentUrl: 'https://byldtek.com/byldtek-logo.png',
        width: 512,
        height: 512,
        caption: 'byldTEK',
      },
      email: 'hello@byldtek.com',
      telephone: '+201037022482',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Arabic'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales and general inquiries',
        email: 'hello@byldtek.com',
        telephone: '+201037022482',
        availableLanguage: ['English', 'Arabic'],
        areaServed: 'Worldwide',
      },
      sameAs: [
        'https://www.linkedin.com/company/byldtek/',
        'https://github.com/byldtek',
        'https://x.com/byldtek',
        'https://www.instagram.com/byldtek/',
        'https://www.facebook.com/byldtek',
        'https://www.threads.net/@byldtek',
        'https://www.youtube.com/@byldtek',
        'https://www.tiktok.com/@byldtek',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://byldtek.com/#website',
      url: 'https://byldtek.com/',
      name: 'byldTEK',
      alternateName: 'byldtek.com',
      description:
        'byldTEK is a software engineering company building AI and automation systems, web platforms, mobile applications, backend systems, APIs, and digital products.',
      publisher: { '@id': 'https://byldtek.com/#organization' },
      inLanguage: ['en', 'ar'],
    },
  ],
};

// Fonts are self-hosted via next/font (see app/fonts.js) instead of a Google
// Fonts <link> here — this component now only carries the JSON-LD.
export function HeadFonts() {
  return (
    // suppressHydrationWarning: some browser extensions (ad/popup blockers)
    // rewrite this tag's type/content before React hydrates — that's the
    // extension mutating the DOM, not a real server/client mismatch.
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
