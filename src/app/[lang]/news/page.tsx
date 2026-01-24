import { cms } from '@/lib/cms/firestoreAdapter';
import NewsClient from './NewsClient';
import type { Metadata } from 'next';
import type { NewsItem } from '@/lib/cms/types';
import { FALLBACK_NEWS } from '@/data/fallbackNews';

export const metadata: Metadata = {
  title: 'News | Bimo Tech',
  description: 'Latest updates from Bimo Tech - advanced materials research, partnerships, and industry news.',
};

// Re-export for use in article pages
export { FALLBACK_NEWS };

// Fetch at build time, revalidate on rebuild (triggered by GitHub webhook)
export const revalidate = false; // Only rebuild when triggered

export default async function NewsPage() {
  let news: NewsItem[] = [];
  try {
    news = await cms.getNews();
  } catch (e) {
    console.error("Failed to load news for build:", e);
  }

  // Use fallback data if no news from Firestore
  const displayNews = news.length > 0 ? news : FALLBACK_NEWS;

  return <NewsClient initialNews={displayNews} />;
}
