import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manufacturing Services | CNC Machining, Sheet Metal, 3D Printing',
  description: 'Precision manufacturing services including CNC milling, CNC turning, sheet metal fabrication, 3D printing, injection molding, and wire EDM. Fast quotes, short lead times.',
  keywords: [
    'CNC machining services',
    'CNC milling',
    'CNC turning',
    'sheet metal fabrication',
    '3D printing services',
    'injection molding',
    'wire EDM',
    'precision manufacturing',
    'custom parts manufacturing',
    'rapid prototyping',
    'metal fabrication',
    'Poland manufacturing',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE', 'pl_PL'],
    url: 'https://bimotech.pl/en/services',
    siteName: 'Bimo Tech',
    title: 'Manufacturing Services | Bimo Tech',
    description: 'CNC machining, sheet metal, 3D printing, and more. Fast quotes, precision manufacturing.',
    images: [
      {
        url: 'https://bimotech.pl/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Bimo Tech Manufacturing Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manufacturing Services | Bimo Tech',
    description: 'Precision CNC machining, sheet metal fabrication, 3D printing services.',
    images: ['https://bimotech.pl/og-services.jpg'],
  },
  alternates: {
    canonical: 'https://bimotech.pl/en/services',
    languages: {
      'en': 'https://bimotech.pl/en/services',
      'pl': 'https://bimotech.pl/pl/services',
    },
  },
}

// JSON-LD for Services
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://bimotech.pl/en/services/#service',
  name: 'Precision Manufacturing Services',
  provider: {
    '@type': 'Organization',
    '@id': 'https://bimotech.pl/#organization',
    name: 'Bimo Tech Sp. z o.o.',
  },
  serviceType: [
    'CNC Milling',
    'CNC Turning',
    'Sheet Metal Fabrication',
    '3D Printing',
    'Injection Molding',
    'Wire EDM',
  ],
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: '52.2118',
      longitude: '20.9823',
    },
    geoRadius: '5000 km',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Manufacturing Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'CNC Machining',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'CNC Milling',
              description: '3-, 4- & 5-axis CNC milling for complex geometries',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'CNC Turning',
              description: 'Precision turning and mill-turn capabilities',
            },
          },
        ],
      },
    ],
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
