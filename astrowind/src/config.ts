export const SITE = {
  name: 'Tour Scout',
  site: 'https://tourscout.ai',
  base: '/',
  description: 'AI-Powered Tour Planning Assistant',
  ogImage: {
    src: '/images/tourscout-social-preview.png',
    width: 1200,
    height: 630,
    alt: 'Tour Scout - AI Tour Planning Assistant'
  },
};

export const METADATA = {
  title: {
    default: 'Tour Scout – AI-Powered Tour Planning Assistant',
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
    title: 'Tour Scout – AI-Powered Tour Planning Assistant',
    description: 'Smarter routing, crew-ready logistics, and peace of mind for every show.',
    siteName: SITE.name,
    images: [
      {
        url: SITE.ogImage.src,
        width: SITE.ogImage.width,
        height: SITE.ogImage.height,
        alt: SITE.ogImage.alt,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@tourscoutai',
    site: '@tourscoutai',
    cardType: 'summary_large_image',
    title: 'Tour Scout – AI-Powered Tour Planning Assistant',
    description: 'Smarter routing, crew-ready logistics, and peace of mind for every show.',
    images: [SITE.ogImage.src],
  },
}; 