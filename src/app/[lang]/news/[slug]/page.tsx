import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import NewsArticleClient from './NewsArticleClient';
import { FALLBACK_NEWS } from '@/data/fallbackNews';
import { cms } from '@/lib/cms/firestoreAdapter';
import type { NewsItem } from '@/lib/cms/types';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

// ISR: Revalidate every 5 minutes to pick up CMS changes
export const revalidate = 300;

// Allow articles not in generateStaticParams (new CMS articles)
export const dynamicParams = true;

// Cached news data fetcher - tries CMS, falls back to static data
let cachedNews: NewsItem[] | null = null;

async function getNewsData(): Promise<NewsItem[]> {
  // In production build, fetch from CMS with caching
  if (process.env.NODE_ENV === 'production' || !cachedNews) {
    try {
      const news = await cms.getNews();
      if (news.length > 0) {
        cachedNews = news;
        return news;
      }
    } catch (e) {
      console.error("CMS fetch failed, using fallback:", e);
    }
  }
  return cachedNews || FALLBACK_NEWS;
}

// Synchronous version for SSR reliability
function getNewsDataSync(): NewsItem[] {
  return cachedNews || FALLBACK_NEWS;
}

// Helper to find article by slug
function findArticleBySlug(news: NewsItem[], slug: string): NewsItem | undefined {
  return news.find(n =>
    (n.slug || n.id || n.title.toLowerCase().replace(/\s+/g, '-')) === slug
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const displayNews = getNewsDataSync();
  const article = findArticleBySlug(displayNews, slug);

  if (!article) {
    return {
      title: 'Article Not Found | Bimo Tech',
    };
  }

  return {
    title: `${article.title} | Bimo Tech News`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: article.author ? [article.author] : ['Bimo Tech'],
      images: article.imageUrl ? [article.imageUrl] : ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : ['/og-image.jpg'],
    },
  };
}

// Generate static params at build time
export async function generateStaticParams() {
  // Fetch and cache CMS data for build
  const displayNews = await getNewsData();
  const paths: { lang: string; slug: string }[] = [];
  const languages = ['en', 'pl'];

  for (const lang of languages) {
    for (const article of displayNews) {
      const slug = article.slug || article.id || article.title.toLowerCase().replace(/\s+/g, '-');
      paths.push({ lang, slug });
    }
  }

  return paths;
}

export default async function NewsArticlePage({ params }: Props) {
  const { lang, slug } = await params;

  // Use cached/fallback data for reliable rendering
  const displayNews = getNewsDataSync();
  const article = findArticleBySlug(displayNews, slug);

  if (!article) {
    notFound();
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = displayNews
    .filter(n => n.category === article.category && n.id !== article.id)
    .slice(0, 3);

  return <NewsArticleClient article={article} relatedArticles={relatedArticles} lang={lang} />;
}
