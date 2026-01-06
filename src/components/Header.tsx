"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Check, Home, Box, Newspaper, Briefcase, Mail, Info, FileText } from 'lucide-react';

const Header = () => {
  const [selected, setSelected] = useState("");
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  // Language Dropdown
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Company Dropdown
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

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
    { code: 'ja', label: '日本語' },
  ];

  // Main Navigation Items
  const options = [
    { id: "services", value: "services", label: "Services", href: `/${language}/services`, icon: Box },
    { id: "products", value: "products", label: t("nav.products"), href: `/${language}/products`, icon: Box },
  ];

  // Company Dropdown Items
  const companyOptions = [
    { id: "about", value: "about", label: t("nav.about"), href: `/${language}/impressum`, icon: Info },
    { id: "careers", value: "careers", label: t("nav.careers"), href: `/${language}/careers`, icon: Briefcase },
    { id: "news", value: "news", label: t("nav.news"), href: `/${language}/news`, icon: Newspaper },
    { id: "contact", value: "contact", label: t("nav.contact"), href: `/${language}/contact`, icon: Mail },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Language Dropdown
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      // Company Dropdown
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selected based on pathname
  useEffect(() => {
    // Check main options
    const foundMain = options.find(opt => pathname.startsWith(opt.href));
    if (foundMain) {
      setSelected(foundMain.value);
      return;
    }

    // Check company options
    const foundCompany = companyOptions.find(opt => pathname.startsWith(opt.href));
    if (foundCompany) {
      setSelected("company");
      return;
    }

    setSelected(""); // No valid selection (e.g. on Home)
  }, [pathname, language]);

  // Update indicator position
  useEffect(() => {
    // We treat "company" as an index after the main options
    let index = options.findIndex(opt => opt.value === selected);

    // If selected is "company", point to the company trigger (which we'll need to ref)
    if (selected === "company") {
      index = options.length; // The Company trigger is right after the main options
    }

    if (index !== -1 && navRefs.current[index]) {
      const el = navRefs.current[index];
      if (el) {
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1
        });
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [selected]);

  const handleNavClick = (value: string, href: string) => {
    setSelected(value);
    router.push(href);
  };

  const handleCompanyItemClick = (href: string) => {
    setIsCompanyDropdownOpen(false);
    setSelected("company");
    router.push(href);
  };

  const handleLanguageChange = (newLang: string) => {
    if (newLang === language) return;
    setIsLangDropdownOpen(false);

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

        {/* Main Options */}
        {options.map((opt, index) => (
          <label
            key={opt.id}
            className={styles.switcherOption}
            ref={el => { navRefs.current[index] = el }}
            onClick={() => handleNavClick(opt.value, opt.href)}
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

        {/* Company Dropdown Trigger */}
        <div
          className={styles.switcherOption}
          ref={el => { navRefs.current[options.length] = el as unknown as HTMLLabelElement }} // Casting for the ref array
          onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
        >
          <div ref={companyDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className={styles.navText}>Company</span>
            <ChevronDown size={14} className={`${styles.chevron} ${isCompanyDropdownOpen ? styles.rotate : ''}`} />

            <div className={`${styles.dropdownMenu} ${isCompanyDropdownOpen ? styles.open : ''} ${styles.companyDropdownPosition}`}>
              {companyOptions.map((item) => (
                <div
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompanyItemClick(item.href);
                  }}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </nav>

      <div className={styles.rightSection}>
        {/* CTA Button */}
        <Link href={`/${language}/quote`} className={styles.ctaButton}>
          <span>Get Quote</span>
          <Mail size={16} />
        </Link>

        {/* Language Switcher */}
        <div className={styles.langContainer} ref={langDropdownRef}>
          <button
            className={`${styles.langButton} ${scrolled ? styles.scrolled : ''}`}
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          >
            {language.toUpperCase()}
            <ChevronDown size={16} />
          </button>

          <div className={`${styles.dropdownMenu} ${isLangDropdownOpen ? styles.open : ''}`}>
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
      </div>
    </header>
  );
};

export default Header;
