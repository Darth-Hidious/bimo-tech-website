import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://bimotech.pl'),
  title: {
    default: 'Bimo Tech | Advanced Materials for Aerospace, Nuclear & Industry',
    template: '%s | Bimo Tech',
  },
  description: 'Leading European supplier of refractory metals, advanced alloys, and sputtering targets. Tungsten, rhenium, titanium, molybdenum for aerospace, nuclear, and medical applications. ESA qualified supplier.',
  keywords: [
    'refractory metals',
    'tungsten supplier Europe',
    'rhenium manufacturer',
    'titanium aerospace',
    'molybdenum products',
    'tantalum capacitors',
    'niobium superconductor',
    'nickel superalloys',
    'Inconel supplier',
    'Hastelloy distributor',
    'sputtering targets',
    'PVD materials',
    'ESA qualified',
    'aerospace materials',
    'nuclear materials',
    'medical titanium',
    'high-purity metals',
    'custom metal parts',
    'Poland metal supplier',
  ],
  authors: [{ name: 'Bimo Tech Sp. z o.o.', url: 'https://bimotech.pl' }],
  creator: 'Bimo Tech',
  publisher: 'Bimo Tech Sp. z o.o.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE', 'pl_PL'],
    url: 'https://bimotech.pl',
    siteName: 'Bimo Tech',
    title: 'Bimo Tech | Advanced Materials for Aerospace, Nuclear & Industry',
    description: 'Leading European supplier of refractory metals and advanced alloys. ESA qualified.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bimo Tech - Advanced Materials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bimo Tech | Advanced Materials',
    description: 'Refractory metals and advanced alloys for aerospace, nuclear, and industry.',
    images: ['/og-image.jpg'],
  },
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
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'technology',
};

// Organization JSON-LD
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://bimotech.pl/#organization',
  name: 'Bimo Tech Sp. z o.o.',
  alternateName: 'Bimo Tech',
  url: 'https://bimotech.pl',
  logo: 'https://bimotech.pl/logo.png',
  description: 'Leading European supplier of refractory metals, advanced alloys, and sputtering targets for aerospace, nuclear, and industrial applications.',
  foundingDate: '1992',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ul. Pawińskiego 5B',
    addressLocality: 'Warsaw',
    postalCode: '02-106',
    addressCountry: 'PL',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '52.2118',
    longitude: '20.9823',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+48-123-456-789',
      contactType: 'sales',
      email: 'info@bimotech.pl',
      availableLanguage: ['English', 'German', 'Polish'],
    },
  ],
  sameAs: [
    'https://www.linkedin.com/company/bimotech',
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
  knowsAbout: [
    'Refractory metals',
    'Tungsten',
    'Rhenium',
    'Titanium',
    'Molybdenum',
    'Tantalum',
    'Niobium',
    'Sputtering targets',
    'PVD coatings',
    'Aerospace materials',
    'Nuclear materials',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
