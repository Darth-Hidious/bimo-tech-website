"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Command,
  ArrowRight,
  Package,
  Mail,
  FileText,
  Briefcase,
  Newspaper,
  Info,
  Home,
  X,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { searchMaterials, materials } from '@/data/materials';
import { searchProducts, products } from '@/data/products';
import styles from './CommandPalette.module.css';

interface CommandItem {
  id: string;
  type: 'action' | 'material' | 'product' | 'page';
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { language } = useLanguage();

  // Navigation items
  const navigationItems: CommandItem[] = [
    {
      id: 'home',
      type: 'page',
      title: 'Home',
      description: 'Go to homepage',
      icon: <Home size={18} />,
      action: () => router.push(`/${language}`),
      keywords: ['home', 'start', 'main'],
    },
    {
      id: 'products',
      type: 'page',
      title: 'Products',
      description: 'Browse all materials and products',
      icon: <Package size={18} />,
      action: () => router.push(`/${language}/products`),
      keywords: ['products', 'materials', 'catalog', 'browse'],
    },
    {
      id: 'services',
      type: 'page',
      title: 'Services',
      description: 'View our capabilities',
      icon: <Briefcase size={18} />,
      action: () => router.push(`/${language}/services`),
      keywords: ['services', 'capabilities', 'manufacturing'],
    },
    {
      id: 'news',
      type: 'page',
      title: 'News',
      description: 'Latest updates and announcements',
      icon: <Newspaper size={18} />,
      action: () => router.push(`/${language}/news`),
      keywords: ['news', 'updates', 'announcements', 'press'],
    },
    {
      id: 'careers',
      type: 'page',
      title: 'Careers',
      description: 'Join our team',
      icon: <Briefcase size={18} />,
      action: () => router.push(`/${language}/careers`),
      keywords: ['careers', 'jobs', 'hiring', 'work'],
    },
    {
      id: 'about',
      type: 'page',
      title: 'About Us',
      description: 'Learn about Bimo Tech',
      icon: <Info size={18} />,
      action: () => router.push(`/${language}/impressum`),
      keywords: ['about', 'company', 'impressum', 'who'],
    },
  ];

  // Quick actions
  const quickActions: CommandItem[] = [
    {
      id: 'quote',
      type: 'action',
      title: 'Get a Quote',
      description: 'Request pricing for materials',
      icon: <FileText size={18} />,
      action: () => router.push(`/${language}/quote`),
      keywords: ['quote', 'price', 'pricing', 'rfq', 'request', 'order', 'buy'],
    },
    {
      id: 'contact',
      type: 'action',
      title: 'Contact Us',
      description: 'Get in touch with our team',
      icon: <Mail size={18} />,
      action: () => router.push(`/${language}/contact`),
      keywords: ['contact', 'email', 'phone', 'reach', 'support', 'help'],
    },
  ];

  // Generate material items from data
  const materialItems: CommandItem[] = materials.map((material) => ({
    id: `material-${material.id}`,
    type: 'material' as const,
    title: material.name,
    description: `${material.symbol} - ${material.description.slice(0, 60)}...`,
    icon: <Sparkles size={18} />,
    action: () => router.push(`/${language}/products?material=${material.id}`),
    keywords: [material.name.toLowerCase(), material.symbol.toLowerCase(), ...material.alloys.map(a => a.toLowerCase())],
  }));

  // Generate product items
  const productItems: CommandItem[] = products.slice(0, 10).map((product) => ({
    id: `product-${product.id}`,
    type: 'product' as const,
    title: product.name,
    description: product.shortDescription,
    icon: <Package size={18} />,
    action: () => router.push(`/${language}/products?product=${product.slug}`),
    keywords: [product.name.toLowerCase(), product.category.toLowerCase()],
  }));

  // All items combined
  const allItems = [...quickActions, ...navigationItems, ...materialItems, ...productItems];

  // Filter items based on query
  const filteredItems = query.trim() === ''
    ? [...quickActions, ...navigationItems]
    : allItems.filter((item) => {
        const searchQuery = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchQuery) ||
          item.description?.toLowerCase().includes(searchQuery) ||
          item.keywords?.some((k) => k.includes(searchQuery))
        );
      }).slice(0, 10);

  // Open/close handlers
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }

      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openPalette, closePalette]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation in list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
      closePalette();
    }
  };

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) {
    return (
      <button
        className={styles.trigger}
        onClick={openPalette}
        aria-label="Open command palette"
      >
        <Command size={16} />
        <span className={styles.triggerText}>K</span>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={closePalette} />

      {/* Palette */}
      <div className={styles.palette}>
        {/* Search Input */}
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search materials, products, or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button className={styles.closeButton} onClick={closePalette}>
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No results found for "{query}"</p>
              <p className={styles.emptyHint}>Try searching for "tungsten", "quote", or "contact"</p>
            </div>
          ) : (
            <>
              {/* Group by type */}
              {query.trim() === '' && (
                <div className={styles.groupLabel}>Quick Actions</div>
              )}
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                  onClick={() => {
                    item.action();
                    closePalette();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.resultIcon}>{item.icon}</div>
                  <div className={styles.resultContent}>
                    <span className={styles.resultTitle}>{item.title}</span>
                    {item.description && (
                      <span className={styles.resultDescription}>{item.description}</span>
                    )}
                  </div>
                  <ArrowRight size={14} className={styles.resultArrow} />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <kbd>↑↓</kbd> Navigate
          </span>
          <span className={styles.footerHint}>
            <kbd>↵</kbd> Select
          </span>
          <span className={styles.footerHint}>
            <kbd>esc</kbd> Close
          </span>
        </div>
      </div>
    </>
  );
}
