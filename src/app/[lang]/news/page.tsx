"use client";

import { useState } from 'react';
import {
  Calendar,
  Tag,
  ArrowRight,
  Mail,
  Trophy,
  Rocket,
  Building,
  Users,
  Award,
  CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { newsArticles, categories, type Category } from '@/data/news';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [email, setEmail] = useState('');

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  const filteredArticles = selectedCategory === 'All'
    ? regularArticles
    : regularArticles.filter(article => article.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Awards':
        return <Trophy size={16} />;
      case 'Projects':
        return <Rocket size={16} />;
      case 'Company News':
        return <Building size={16} />;
      case 'Partnerships':
        return <Users size={16} />;
      case 'Certifications':
        return <Award size={16} />;
      case 'Events':
        return <CalendarDays size={16} />;
      default:
        return <Tag size={16} />;
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#f97316]">Intel</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Stay updated with the latest news, achievements, and innovations from Bimo Tech
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#3b82f6]/50 transition-all duration-500 h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/20 to-[#f97316]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12">
                <div className="mb-4 flex items-center gap-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white text-sm font-bold rounded-full">
                    {getCategoryIcon(featuredArticle.category)}
                    FEATURED
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20">
                    <Calendar size={14} />
                    {featuredArticle.date}
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 group-hover:text-[#3b82f6] transition-colors">
                  {featuredArticle.title}
                </h2>

                <p className="text-xl text-gray-300 mb-6 max-w-3xl">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center gap-2 text-[#3b82f6] font-semibold group-hover:translate-x-2 transition-transform">
                  Read Full Story <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/50'
                    : 'bg-white/5 backdrop-blur-sm text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#3b82f6]/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="p-6">
                  {/* Date Badge */}
                  <div className="mb-4 flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      article.category === 'Awards'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : article.category === 'Projects'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : article.category === 'Company News'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : article.category === 'Partnerships'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : article.category === 'Certifications'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    }`}>
                      {getCategoryIcon(article.category)}
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#3b82f6] transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-[#3b82f6] font-medium group-hover:translate-x-2 transition-transform">
                    Read More <ArrowRight size={16} />
                  </div>
                </div>

                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3b82f6]/20 to-[#f97316]/20" />
                </div>
              </article>
            ))}
          </div>

          {/* No Results Message */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
                <Tag size={32} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-gray-400">
                Try selecting a different category to see more content.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#3b82f6]/10 via-transparent to-[#f97316]/10 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 mb-6">
                <Mail size={32} className="text-[#3b82f6]" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Stay in the Loop
              </h2>

              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest updates on our innovations, achievements, and industry insights delivered straight to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-[#f97316]/50 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              <p className="text-sm text-gray-500 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
