"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Atom,
  Sparkles,
  Zap,
  Shield,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Layers,
  Factory
} from 'lucide-react';
import Header from '@/components/Header';
import { products, categories, technologies } from '@/data/products';
import type { Product } from '@/data/products';
import styles from './products.module.css';

// Icon mapping
const iconMap: Record<string, any> = {
  Box,
  Atom,
  Sparkles,
  Zap,
  Shield,
  Rocket,
  Layers
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleProducts((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all product cards
    const cards = document.querySelectorAll('[data-product-card]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [selectedCategory]);

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const featuredProducts = products.filter((p) => p.featured);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Box;
    return Icon;
  };

  return (
    <main className="min-h-screen bg-[#050505]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Grid Background */}
        <div className={styles.gridBackground} />
        <div className={styles.gradientOverlay} />

        {/* Floating Particles */}
        <div className={styles.particlesContainer}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className={`${styles.fadeInUp} ${mounted ? styles.visible : ''}`}>
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-sm font-semibold backdrop-blur-sm">
                ESA Space Prime Contractor
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Advanced Materials
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              Pioneering refractory metals, high-entropy alloys, and advanced materials
              for space, fusion energy, and next-generation aerospace applications
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 size={20} className="text-green-500" />
                <span>ESA Qualified</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 size={20} className="text-green-500" />
                <span>ITER Partner</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 size={20} className="text-green-500" />
                <span>ISO 9001 Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollArrow} />
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-20 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
            <span className="text-gray-400 font-semibold whitespace-nowrap">Filter:</span>
            <div className="flex gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300
                    ${selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {selectedCategory === "All" && (
        <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-12">
              <Sparkles className="text-orange-500" size={32} />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Featured <span className="text-orange-500">Products</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => {
                const Icon = getIcon(product.icon);
                return (
                  <div
                    key={product.id}
                    className={`
                      ${styles.featuredCard}
                      ${styles.glassCard}
                      group relative overflow-hidden
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* ESA Winner Badge */}
                    {product.esaWinner && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                          ESA FIRST! Winner
                        </div>
                      </div>
                    )}

                    {/* Gradient Border Effect */}
                    <div className={styles.gradientBorder} />

                    {/* Content */}
                    <div className="relative z-10 p-8">
                      {/* Icon */}
                      <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl w-fit border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={40} className="text-blue-400" />
                      </div>

                      {/* Category Badge */}
                      <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold mb-4">
                        {product.category}
                      </span>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 mb-6">
                        {product.description}
                      </p>

                      {/* Key Specs */}
                      <div className="mb-6 space-y-2">
                        {product.keySpecs.map((spec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{spec}</span>
                          </div>
                        ))}
                      </div>

                      {/* Partners */}
                      {product.partners && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {product.partners.map((partner) => (
                              <span
                                key={partner}
                                className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400 border border-white/10"
                              >
                                {partner}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <button className="flex items-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                        View Details
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <p className="text-gray-400">
              {filteredProducts.length} products available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const Icon = getIcon(product.icon);
              const isVisible = visibleProducts.has(index);

              return (
                <div
                  key={product.id}
                  data-product-card
                  data-index={index}
                  className={`
                    ${styles.productCard}
                    ${styles.glassCard}
                    ${isVisible ? styles.visible : ''}
                    group
                  `}
                  style={{ animationDelay: `${(index % 8) * 0.05}s` }}
                >
                  {/* Gradient Border */}
                  <div className={styles.gradientBorder} />

                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Icon */}
                    <div className="mb-4 p-3 bg-blue-500/10 rounded-xl w-fit border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Icon size={28} className="text-blue-400" />
                    </div>

                    {/* Category Badge */}
                    <span className="inline-block px-2 py-1 bg-white/5 rounded text-xs text-gray-400 mb-3 border border-white/10">
                      {product.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-gray-400 mb-4">
                      {product.shortDescription}
                    </p>

                    {/* Key Specs Preview */}
                    <div className="mb-4 space-y-1">
                      {product.keySpecs.slice(0, 2).map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400">{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className="flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
                      View Details
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-16 bg-gradient-to-b from-[#050505] to-[#0a1628]">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-2xl font-bold text-gray-400 mb-12">
            Trusted by Leading Organizations
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-gray-500 font-bold text-xl">ESA</div>
            <div className="text-gray-500 font-bold text-xl">Ariane Group</div>
            <div className="text-gray-500 font-bold text-xl">ITER</div>
            <div className="text-gray-500 font-bold text-xl">F4E</div>
            <div className="text-gray-500 font-bold text-xl">NCBJ</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0a1628] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10" />
        <div className={styles.glowEffect} style={{ top: '50%', left: '50%' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Factory size={48} className="text-orange-500 mx-auto mb-6" />

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Need Custom <span className="text-orange-500">Materials?</span>
            </h2>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Our expert team can develop tailored solutions for your specific requirements.
              From prototype to production, we deliver excellence.
            </p>

            {/* Technologies Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="text-blue-400 font-bold mb-2">{tech.name}</div>
                  <div className="text-gray-400 text-sm">{tech.description}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-105">
                Request Quote
              </button>
              <button className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-bold rounded-lg border border-white/20 hover:bg-white/10 transition-all">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
