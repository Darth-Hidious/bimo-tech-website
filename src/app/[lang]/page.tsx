"use client";

import { ArrowRight, Box, Newspaper, Briefcase, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import BrandCarousel from '@/components/BrandCarousel';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const brandLogos = [
    { name: 'Ariane Group', filename: 'arianegroup.svg' },
    { name: 'ESA', filename: 'ESA_logo_2020_White.svg' },
    { name: 'F4E', filename: 'F4E.svg' },
    { name: 'IPPT PAN', filename: 'IPPT_PAN.svg' },
    { name: 'NCBJ', filename: 'NCBJ.svg' },
  ];

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
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-colors group cursor-pointer rounded-xl">
                <div className="mb-6 p-4 bg-blue-500/10 rounded-full w-fit text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Box size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">{t("home.projects.alpha.title").replace("{i}", i.toString())}</h3>
                <p className="text-gray-400 mb-4">{t("home.projects.alpha.description")}</p>
                <span className="text-sm text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">{t("home.projects.alpha.learnMore")} <ArrowRight size={14} /></span>
              </div>
            ))}
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
                <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded mb-2 inline-block">{t("home.news.pressRelease")}</span>
                <h3 className="text-3xl font-bold mb-2 text-white">{t("home.news.fundingTitle")}</h3>
                <p className="text-gray-300">{t("home.news.fundingDesc")}</p>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-gray-500 text-sm font-mono">Oct {10 + i}</div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{t("home.news.agentSuccess").replace("{i}", i.toString())}</h4>
                    <p className="text-sm text-gray-400">{t("home.news.efficiency")}</p>
                  </div>
                </div>
              ))}
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
