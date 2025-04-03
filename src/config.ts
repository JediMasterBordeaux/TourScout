export const SITE = {
  name: 'Tour Scout',
  site: 'https://concertindustry.com',
  base: '/',
  description: 'AI-Powered Tour Planning Assistant',
  ogImage: {
    src: '/images/tour-scout-mockup.png',
    width: 375,
    height: 812
  },
};

export const METADATA = {
  title: {
    default: SITE.name,
    template: '%s — Tour Scout',
  },
  description: 'Smarter routing, crew-ready logistics, and peace of mind for every show.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.site,
    title: SITE.name,
    description: 'Smarter routing, crew-ready logistics, and peace of mind for every show.',
    siteName: SITE.name,
    images: [
      {
        url: SITE.ogImage.src,
        width: SITE.ogImage.width,
        height: SITE.ogImage.height,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: 'Smarter routing, crew-ready logistics, and peace of mind for every show.',
    images: [SITE.ogImage.src],
  },
}; 