import { cms } from '@/lib/cms/firestoreAdapter';
import ProductsClient from './ProductsClient';
import type { Metadata } from 'next';
import type { Product } from '@/lib/cms/types';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Products | Bimo Tech',
  description: 'Explore our catalog of refractory metals (Tungsten, Molybdenum, Tantalum, Niobium, Rhenium) and advanced alloys for aerospace, fusion, and space applications.',
  keywords: ['refractory metals', 'tungsten', 'molybdenum', 'tantalum', 'niobium', 'rhenium', 'sputtering targets', 'aerospace materials'],
};

// Set revalidation if needed, or default to static
export const revalidate = 3600; // Revalidate every hour

function generateProductJsonLd(products: Product[]) {
  const baseUrl = 'https://bimotech.pl';

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Bimo Tech Sp. z o.o.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Advanced refractory metals and precision materials for aerospace, fusion, and space applications.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Francuska 11',
      addressLocality: 'Wrocław',
      postalCode: '54-405',
      addressCountry: 'PL'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+48-71-341-84-81',
      email: 'info@bimotech.pl',
      contactType: 'sales'
    },
    sameAs: [
      'https://www.linkedin.com/company/bimotech',
      'https://x.com/bimotech'
    ]
  };

  // ItemList schema for product catalog
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Refractory Metals Catalog',
    description: 'Complete catalog of refractory metals and advanced alloys',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${baseUrl}/en/products#${product.id}`,
        name: product.name,
        description: product.description?.substring(0, 200) || `High-purity ${product.name} for industrial applications`,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'Bimo Tech'
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Bimo Tech Sp. z o.o.'
        },
        category: 'Refractory Metals',
        material: product.name,
        ...(product.properties?.meltingPoint && {
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Melting Point',
              value: product.properties.meltingPoint
            },
            ...(product.properties?.density ? [{
              '@type': 'PropertyValue',
              name: 'Density',
              value: product.properties.density
            }] : [])
          ]
        }),
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'EUR',
            valueAddedTaxIncluded: false
          },
          seller: {
            '@type': 'Organization',
            name: 'Bimo Tech Sp. z o.o.'
          },
          itemCondition: 'https://schema.org/NewCondition'
        }
      }
    }))
  };

  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/en/products`,
    name: 'Refractory Metals & Advanced Alloys | Bimo Tech',
    description: 'Explore our catalog of refractory metals including Tungsten, Molybdenum, Tantalum, Niobium, and Rhenium for aerospace, fusion, and space applications.',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: 'Bimo Tech',
      url: baseUrl
    },
    about: {
      '@type': 'Thing',
      name: 'Refractory Metals'
    },
    mainEntity: {
      '@id': `${baseUrl}/en/products#itemlist`
    }
  };

  return [organizationSchema, itemListSchema, webPageSchema];
}

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    products = await cms.getProducts();
  } catch (e) {
    console.error("Failed to load products for build:", e);
  }

  const jsonLdData = generateProductJsonLd(products);

  return (
    <>
      <Script
        id="products-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdData)
        }}
        strategy="beforeInteractive"
      />
      <ProductsClient initialProducts={products} />
    </>
  );
}
