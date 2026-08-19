import HomeClient from '../../HomeClient';

export const metadata = {
  title: 'byldTEK — هندسة البرمجيات والذكاء الاصطناعي',
  description:
    'byldTEK شركة هندسة برمجيات تبني حلول الذكاء الاصطناعي والأتمتة، ومنصات الويب، وتطبيقات الهاتف، والأنظمة الخلفية والمنتجات الرقمية.',
  alternates: {
    canonical: 'https://byldtek.com/ar/',
    languages: {
      en: 'https://byldtek.com/',
      ar: 'https://byldtek.com/ar/',
      'x-default': 'https://byldtek.com/',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://byldtek.com/ar/',
    siteName: 'byldTEK',
    title: 'byldTEK — نبني أفكارًا تعمل.',
    description:
      'byldTEK شركة هندسة برمجيات تبني حلول الذكاء الاصطناعي والأتمتة، ومنصات الويب، وتطبيقات الهاتف، والأنظمة الخلفية والمنتجات الرقمية.',
    locale: 'ar_EG',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@byldtek',
    title: 'byldTEK — نبني أفكارًا تعمل.',
    description:
      'byldTEK شركة هندسة برمجيات تبني حلول الذكاء الاصطناعي والأتمتة، ومنصات الويب، وتطبيقات الهاتف، والأنظمة الخلفية والمنتجات الرقمية.',
  },
};

export default function ArPage() {
  return <HomeClient initialLang="ar" />;
}
