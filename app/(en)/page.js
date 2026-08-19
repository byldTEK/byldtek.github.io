import HomeClient from '../HomeClient';

export const metadata = {
  title: 'byldTEK — Software Engineering, AI, Web & Mobile',
  description:
    'byldTEK is a software engineering company building AI and automation systems, web platforms, mobile applications, backend systems, APIs, and digital products.',
  alternates: {
    canonical: 'https://byldtek.com/',
    languages: {
      en: 'https://byldtek.com/',
      ar: 'https://byldtek.com/ar/',
      'x-default': 'https://byldtek.com/',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://byldtek.com/',
    siteName: 'byldTEK',
    title: 'byldTEK — Software Engineering, AI, Web & Mobile',
    description:
      'byldTEK is a software engineering company building AI and automation systems, web platforms, mobile applications, backend systems, APIs, and digital products.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    site: '@byldtek',
    title: 'byldTEK — Software Engineering, AI, Web & Mobile',
    description:
      'byldTEK is a software engineering company building AI and automation systems, web platforms, mobile applications, backend systems, APIs, and digital products.',
  },
};

export default function Page() {
  return <HomeClient initialLang="en" />;
}
