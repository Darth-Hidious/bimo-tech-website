import { MetadataRoute } from 'next'
import { FALLBACK_NEWS } from '@/data/fallbackNews'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bimotech.pl'
  const languages = ['en', 'pl']

  const staticPages = [
    { path: '', changeFreq: 'weekly' as const, priority: 1 },
    { path: '/products', changeFreq: 'weekly' as const, priority: 0.9 },
    { path: '/services', changeFreq: 'monthly' as const, priority: 0.8 },
    { path: '/news', changeFreq: 'weekly' as const, priority: 0.8 },
    { path: '/quote', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/contact', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/careers', changeFreq: 'monthly' as const, priority: 0.6 },
    { path: '/privacy', changeFreq: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFreq: 'yearly' as const, priority: 0.3 },
    { path: '/impressum', changeFreq: 'yearly' as const, priority: 0.3 },
  ]

  // Service slugs
  const services = [
    'cnc-milling',
    'cnc-turning',
    'sheet-metal',
  ]

  // Get news articles for sitemap
  const newsArticles = FALLBACK_NEWS.map(article => ({
    slug: article.slug || article.id || article.title.toLowerCase().replace(/\s+/g, '-'),
    date: article.date,
  }))

  // Material categories for deep links
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
  ]

  const entries: MetadataRoute.Sitemap = []

  // Add static pages for each language
  for (const lang of languages) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${lang}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      })
    }

    // Add service pages
    for (const service of services) {
      entries.push({
        url: `${baseUrl}/${lang}/services/${service}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    // Add news article pages
    for (const article of newsArticles) {
      entries.push({
        url: `${baseUrl}/${lang}/news/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }

    // Add material category deep links
    for (const material of materials) {
      entries.push({
        url: `${baseUrl}/${lang}/products?material=${material}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
