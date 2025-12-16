"use client";

import { ArrowRight, Box, Newspaper, Briefcase, Mail, ChevronRight, Flame, Target, Droplet, Settings, Atom, Award, Rocket, Handshake, Zap } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import BrandCarousel from '@/components/BrandCarousel';
import { useLanguage } from '@/context/LanguageContext';
import { getFeaturedProducts } from '@/data/products';

export default function Home() {
  const { t } = useLanguage();
  const featuredProducts = getFeaturedProducts().slice(0, 3);

  const brandLogos = [
    { name: 'Ariane Group', filename: 'arianegroup.svg' },
    { name: 'ESA', filename: 'ESA_logo_2020_White.svg' },
    { name: 'F4E', filename: 'F4E.svg' },
    { name: 'IPPT PAN', filename: 'IPPT_PAN.svg' },
    { name: 'NCBJ', filename: 'NCBJ.svg' },
  ];

  // Helper function to get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Refractory Metals':
        return Flame;
      case 'Sputtering Targets':
        return Target;
      case 'Powders & Nanomaterials':
        return Droplet;
      case 'Custom Components':
        return Settings;
      case 'High-Entropy Alloys':
        return Atom;
      default:
        return Box;
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-black">
      <Header />
      {/* New Hero Section */}
      <Hero />

      {/* Industry Partners Section - Solid background to block hero animation */}
      <section className="py-24 bg-[#0a1628] relative z-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-16 text-white tracking-wide">
            Trusted by Industry Leaders
          </h2>
          <BrandCarousel brandLogos={brandLogos} />
        </div>
      </section>

      {/* Products & Projects */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">{t("home.innovation.title")} <span className="text-blue-500">{t("home.innovation.subtitle")}</span></h2>
              <p className="text-gray-400 max-w-xl">{t("home.innovation.description")}</p>
            </div>
            <button className="text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors">{t("home.innovation.viewAll")} <ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const Icon = getCategoryIcon(product.category);
              return (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-colors group cursor-pointer rounded-xl h-full">
                    <div className="mb-6 p-4 bg-blue-500/10 rounded-full w-fit text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className="inline-block text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mb-3">
                      {product.category}
                    </span>
                    <h3 className="text-2xl font-bold mb-2 text-white">{product.name}</h3>
                    <p className="text-gray-400 mb-4">{product.shortDescription}</p>
                    <span className="text-sm text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t("home.projects.alpha.learnMore") || "Learn More"} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* News & Updates */}
      <section className="py-24 bg-[#111] relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <Newspaper size={32} className="text-gray-400" />
            <h2 className="text-4xl font-bold text-white">{t("home.news.title")} <span className="text-blue-500">{t("home.news.subtitle")}</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 flex flex-col justify-between h-[400px] relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 mt-auto">
                <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded mb-2 inline-block flex items-center gap-1">
                  <Award size={12} /> {t("home.news.pressRelease") || "AWARD"}
                </span>
                <h3 className="text-3xl font-bold mb-2 text-white">ESA FIRST! Award Winner</h3>
                <p className="text-gray-300">
                  Bimo Tech wins prestigious ESA FIRST! Award for breakthrough SPARK project on Refractory High-Entropy Alloys for next-generation space applications.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">ITER Components Delivered</h4>
                  <p className="text-sm text-gray-400">Successfully delivered precision rhodium targets for fusion reactor coatings</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                  <Rocket size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">ArianeGroup Partnership</h4>
                  <p className="text-sm text-gray-400">Expanded collaboration for advanced aerospace materials and components</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                  <Handshake size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">F4E Collaboration</h4>
                  <p className="text-sm text-gray-400">New contract for custom fusion energy components and materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers & Contact */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase size={24} className="text-blue-400" />
                <h2 className="text-3xl font-bold text-white">{t("home.careers.title")} <span className="text-blue-400">{t("home.careers.subtitle")}</span></h2>
              </div>
              <p className="text-gray-400 mb-8">
                {t("home.careers.description")}
              </p>
              <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                {t("home.careers.button")}
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-6">
                <Mail size={24} className="text-orange-400" />
                <h2 className="text-3xl font-bold text-white">{t("home.contact.title")} <span className="text-orange-400">{t("home.contact.subtitle")}</span></h2>
              </div>
              <p className="text-gray-400 mb-8">
                {t("home.contact.description")}
              </p>
              <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                {t("home.contact.button")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
