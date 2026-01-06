import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refractory Metals & Advanced Materials | Bimo Tech',
  description: 'Leading supplier of tungsten, rhenium, titanium, molybdenum, tantalum, niobium, zirconium, nickel alloys, stellite, and sputtering targets. High-purity materials for aerospace, nuclear, medical, and industrial applications.',
  keywords: [
    'tungsten supplier',
    'rhenium metal',
    'titanium sheets',
    'molybdenum products',
    'tantalum manufacturer',
    'niobium alloys',
    'zirconium tubes',
    'nickel alloys',
    'Inconel',
    'Hastelloy',
    'stellite',
    'sputtering targets',
    'PVD targets',
    'refractory metals',
    'high-purity metals',
    'aerospace materials',
    'nuclear materials',
    'medical titanium',
    'tungsten carbide',
    'custom metal components',
  ],
  authors: [{ name: 'Bimo Tech Sp. z o.o.' }],
  creator: 'Bimo Tech',
  publisher: 'Bimo Tech Sp. z o.o.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE', 'pl_PL'],
    url: 'https://bimotech.pl/en/products',
    siteName: 'Bimo Tech',
    title: 'Refractory Metals & Advanced Materials | Bimo Tech',
    description: 'Leading supplier of tungsten, rhenium, titanium, molybdenum, tantalum, and more. High-purity materials for aerospace, nuclear, and industrial applications.',
    images: [
      {
        url: 'https://bimotech.pl/og-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Bimo Tech - Advanced Materials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refractory Metals & Advanced Materials | Bimo Tech',
    description: 'Leading supplier of tungsten, rhenium, titanium, molybdenum, and more.',
    images: ['https://bimotech.pl/og-products.jpg'],
  },
  alternates: {
    canonical: 'https://bimotech.pl/en/products',
    languages: {
      'en': 'https://bimotech.pl/en/products',
      'de': 'https://bimotech.pl/de/products',
      'pl': 'https://bimotech.pl/pl/products',
    },
  },
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://bimotech.pl/#organization',
      name: 'Bimo Tech Sp. z o.o.',
      url: 'https://bimotech.pl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bimotech.pl/logo.png',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Francuska 11',
        addressLocality: 'Wroclaw',
        postalCode: '54-405',
        addressCountry: 'PL',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+48-123-456-789',
        contactType: 'sales',
        email: 'info@bimotech.pl',
        availableLanguage: ['English', 'German', 'Polish'],
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://bimotech.pl/en/products/#webpage',
      url: 'https://bimotech.pl/en/products',
      name: 'Products & Materials - Bimo Tech',
      isPartOf: { '@id': 'https://bimotech.pl/#website' },
      about: { '@id': 'https://bimotech.pl/#organization' },
      description: 'Complete catalog of refractory metals, advanced alloys, and sputtering targets.',
    },
    {
      '@type': 'ItemList',
      '@id': 'https://bimotech.pl/en/products/#productlist',
      name: 'Bimo Tech Materials Catalog',
      numberOfItems: 13,
      itemListElement: [
        {
          '@type': 'Product',
          position: 1,
          name: 'Rhenium',
          description: 'Heavy refractory transition metal with melting point of 3180°C. Sheets, rods, wires, tubes available.',
          material: 'Rhenium',
          category: 'Refractory Metals',
          brand: { '@type': 'Brand', name: 'Bimo Tech' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': 'https://bimotech.pl/#organization' },
          },
        },
        {
          '@type': 'Product',
          position: 2,
          name: 'Tungsten',
          description: 'Highest melting point of all elements (3422°C). Available as sheets, rods, electrodes, crucibles, and powders.',
          material: 'Tungsten',
          category: 'Refractory Metals',
          brand: { '@type': 'Brand', name: 'Bimo Tech' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': 'https://bimotech.pl/#organization' },
          },
        },
        {
          '@type': 'Product',
          position: 3,
          name: 'Titanium',
          description: 'High strength, low density metal. Grades 1-23 available including medical titanium Ti6Al4V.',
          material: 'Titanium',
          category: 'Structural Metals',
          brand: { '@type': 'Brand', name: 'Bimo Tech' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': 'https://bimotech.pl/#organization' },
          },
        },
        {
          '@type': 'Product',
          position: 4,
          name: 'Molybdenum',
          description: 'One of the highest melting points. TZM alloy and Mo-Re alloys available.',
          material: 'Molybdenum',
          category: 'Refractory Metals',
          brand: { '@type': 'Brand', name: 'Bimo Tech' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': 'https://bimotech.pl/#organization' },
          },
        },
        {
          '@type': 'Product',
          position: 5,
          name: 'Nickel Alloys',
          description: 'Inconel, Hastelloy, Monel, Nimonic alloys for corrosion resistance and high-temperature applications.',
          material: 'Nickel',
          category: 'Superalloys',
          brand: { '@type': 'Brand', name: 'Bimo Tech' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': 'https://bimotech.pl/#organization' },
          },
        },
        {
          '@type': 'Product',
          position: 6,
          name: 'Sputtering Targets',
          description: 'PVD targets in 4N-7N purity. Metals, alloys, oxides, nitrides, carbides available.',
          material: 'Various',
          category: 'Thin Film Materials',
          brand: { '@type': 'Brand', name: 'Bimo Tech' },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': 'https://bimotech.pl/#organization' },
          },
        },
      ],
    },
  ],
}

export default function ProductsLayout({
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


