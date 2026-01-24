import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Quote | Instant Manufacturing Quotes',
  description: 'Request an instant quote for CNC machining, sheet metal fabrication, 3D printing, and more. Upload your CAD files and get pricing in minutes.',
  keywords: [
    'manufacturing quote',
    'CNC machining quote',
    'instant quote',
    'metal fabrication pricing',
    '3D printing quote',
    'custom parts quote',
    'rapid quote',
    'online manufacturing quote',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE', 'pl_PL'],
    url: 'https://bimotech.pl/en/quote',
    siteName: 'Bimo Tech',
    title: 'Get an Instant Manufacturing Quote',
    description: 'Upload CAD files and get instant pricing for precision manufacturing services.',
    images: [
      {
        url: 'https://bimotech.pl/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Get a Quote - Bimo Tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get an Instant Manufacturing Quote | Bimo Tech',
    description: 'Upload your designs and get instant pricing.',
    images: ['https://bimotech.pl/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://bimotech.pl/en/quote',
    languages: {
      'en': 'https://bimotech.pl/en/quote',
      'pl': 'https://bimotech.pl/pl/quote',
    },
  },
}

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
