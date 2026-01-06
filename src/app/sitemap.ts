import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bimotech.pl'
  const languages = ['en', 'de', 'pl']
  
  const staticPages = [
    '',
    '/products',
    '/news',
    '/careers',
    '/contact',
  ]

  const materials = [
    'rhenium',
    'tungsten',
    'titanium',
    'molybdenum',
    'tantalum',
    'niobium',
    'zirconium',
    'nickel',
    'stellite',
    'copper',
    'aluminum-bronze',
    'tungsten-carbide',
    'sputtering-targets',
    'super-clean',
  ]

  const entries: MetadataRoute.Sitemap = []

  // Add static pages for each language
  languages.forEach(lang => {
    staticPages.forEach(page => {
      entries.push({
        url: `${baseUrl}/${lang}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.7,
      })
    })

    // Add material-specific pages (for future deep linking)
    materials.forEach(material => {
      entries.push({
        url: `${baseUrl}/${lang}/products#${material}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  })

  return entries
}


