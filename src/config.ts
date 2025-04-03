export const SITE = {
  name: 'TourScout',
  site: 'https://tourscout.ai',
  base: '/',
  description: 'Your AI tour planning assistant',
  ogImage: '/images/tour-scout-mockup.png',
};

export const METADATA = {
  title: {
    default: SITE.name,
    template: '%s — TourScout',
  },
  description: SITE.description,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.site,
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
}; 