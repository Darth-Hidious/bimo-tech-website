"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Check, Home, Box, Newspaper, Briefcase, Mail } from 'lucide-react';

const Header = () => {
  const [selected, setSelected] = useState("home");
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Refs for nav items to calculate indicator position
  const navRefs = useRef<(HTMLLabelElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const languages = [
    { code: 'pl', label: 'Polski' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'it', label: 'Italiano' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'sv', label: 'Svenska' },
    { code: 'fi', label: 'Suomi' },
    { code: 'da', label: 'Dansk' },
    { code: 'pt', label: 'Português' },
    { code: 'cz', label: 'Čeština' },
  ];

  const options = [
    { id: "1", value: "home", label: t("nav.home"), href: `/${language}`, icon: Home },
    { id: "2", value: "products", label: t("nav.products"), href: `/${language}/products`, icon: Box },
    { id: "3", value: "news", label: t("nav.news"), href: `/${language}/news`, icon: Newspaper },
    { id: "4", value: "careers", label: t("nav.careers"), href: `/${language}/careers`, icon: Briefcase },
    { id: "5", value: "contact", label: t("nav.contact"), href: `/${language}/contact`, icon: Mail },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected based on pathname
  useEffect(() => {
    // Simple matching logic
    const path = pathname.split('/').slice(2).join('/') || 'home'; // remove /lang
    // Map path to value
    let found = options.find(opt => {
      if (opt.value === 'home') return pathname === `/${language}`;
      return pathname.startsWith(opt.href);
    });

    if (found) {
      setSelected(found.value);
    }
  }, [pathname, language]);

  // Update indicator position
  useEffect(() => {
    const index = options.findIndex(opt => opt.value === selected);
    if (index !== -1 && navRefs.current[index]) {
      const el = navRefs.current[index];
      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1
        });
      }
    }
  }, [selected]);

  const handleChange = (value: string) => {
    setSelected(value);
    const option = options.find(opt => opt.value === value);
    if (option) {
      router.push(option.href);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    if (newLang === language) return;
    setIsDropdownOpen(false);

    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLang;
      const newPath = segments.join('/');
      router.push(newPath);
    } else {
      router.push(`/${newLang}`);
    }
  };

  // Scroll listener for blur effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.headerWrapper} ${scrolled ? styles.scrolled : ''}`}>
      <Link href={`/${language}`} className={styles.logo}>
        <Image
          src="/logo.png"
          alt="BIMOTECH"
          width={150}
          height={40}
          priority
        />
      </Link>

      <nav className={`${styles.switcher} ${scrolled ? styles.scrolled : ''}`}>
        {/* Animated Indicator */}
        <div
          className={styles.navIndicator}
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
        />

        {options.map((opt, index) => (
          <label
            key={opt.id}
            className={styles.switcherOption}
            ref={el => { navRefs.current[index] = el }}
            onClick={() => handleChange(opt.value)}
          >
            <input
              className={styles.switcherInput}
              type="radio"
              name="nav"
              value={opt.value}
              checked={selected === opt.value}
              readOnly
            />
            <span className={styles.navText}>{opt.label}</span>
            <opt.icon className={styles.navIcon} size={20} />
          </label>
        ))}
      </nav>

      <div className={styles.langContainer} ref={dropdownRef}>
        <button
          className={`${styles.langButton} ${scrolled ? styles.scrolled : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {language.toUpperCase()}
          <ChevronDown size={16} />
        </button>

        <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.open : ''}`}>
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`${styles.dropdownItem} ${language === lang.code ? styles.active : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span>{lang.label}</span>
              {language === lang.code && <Check size={14} />}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
