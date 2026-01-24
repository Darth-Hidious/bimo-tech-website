import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Bimo Tech - Get in Touch',
  description: 'Contact Bimo Tech for quotes, technical inquiries, or partnership opportunities. Based in Wrocław, Poland. Fast response times for all inquiries.',
  keywords: [
    'contact Bimo Tech',
    'metal supplier contact',
    'refractory metals inquiry',
    'tungsten supplier Poland',
    'manufacturing quote request',
    'Wrocław metal supplier',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE', 'pl_PL'],
    url: 'https://bimotech.pl/en/contact',
    siteName: 'Bimo Tech',
    title: 'Contact Bimo Tech',
    description: 'Get in touch for quotes, technical support, or partnership inquiries.',
    images: [
      {
        url: 'https://bimotech.pl/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Bimo Tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Bimo Tech',
    description: 'Get in touch for quotes and technical inquiries.',
    images: ['https://bimotech.pl/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://bimotech.pl/en/contact',
    languages: {
      'en': 'https://bimotech.pl/en/contact',
      'pl': 'https://bimotech.pl/pl/contact',
    },
  },
}

// JSON-LD ContactPage schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://bimotech.pl/en/contact/#contactpage',
  name: 'Contact Bimo Tech',
  description: 'Contact page for Bimo Tech - advanced materials supplier',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://bimotech.pl/#organization',
    name: 'Bimo Tech Sp. z o.o.',
    url: 'https://bimotech.pl',
    email: 'info@bimotech.pl',
    telephone: '+48-71-341-84-81',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Francuska 11',
      addressLocality: 'Wrocław',
      postalCode: '54-405',
      addressCountry: 'PL',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  },
}

export default function ContactLayout({
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
