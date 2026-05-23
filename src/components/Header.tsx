"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useTranslation();

  useEffect(() => {
    // 1. Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll(".fade-in");

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Run once
        }
      });
    }, observerOptions);

    fadeElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const coreNavItems = [
    { label: t("nav.science"), href: `/${locale}/neurofeedback` },
    { label: t("nav.programmes"), href: `/${locale}/programmes` },
    { label: t("nav.centres"), href: `/${locale}/centres` },
    { label: t("nav.about"), href: `/${locale}/apropos` },
  ];

  const communityItems = [
    { label: t("nav.idees"), href: `/${locale}/idees` },
    { label: t("nav.forum"), href: `/${locale}/forum` },
    { label: t("nav.blog"), href: `/${locale}/blog` },
  ];

  const handleLanguageChange = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000`;
    
    // Replace the locale prefix in the current URL path
    const segments = pathname.split("/");
    if (segments.length > 1 && ["fr", "en", "ar"].includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      // If path has no locale prefix (e.g. at root page)
      segments.unshift(nextLocale);
    }
    const newPath = segments.filter(Boolean).join("/");
    window.location.href = `/${newPath}${window.location.search}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header {
          position: sticky !important;
          top: 20px !important;
          z-index: 1000 !important;
          margin: 0 auto !important;
          padding: 0 20px !important;
          max-width: var(--container-max) !important;
          width: 100% !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        
        .nav-container {
          background: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(12px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 10px 30px rgba(10, 22, 40, 0.05),
                      0 1px 3px rgba(10, 22, 40, 0.02) !important;
          border-radius: 50px !important;
          padding: 0 32px !important;
          height: 72px !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo {
          flex-shrink: 0;
        }
        .logo img {
          height: 40px;
          width: auto;
          display: block;
        }

        .nav-links.desktop-only {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          list-style: none;
        }

        .nav-links a {
          position: relative;
          padding-bottom: 4px;
          transition: color 0.3s ease;
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-navy);
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--color-gold);
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .nav-links a:hover::after, .nav-links a.active::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        /* Dropdown menus */
        .dropdown-container {
          position: relative;
        }
        .dropdown-trigger {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-navy);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding-bottom: 4px;
          transition: color 0.3s ease;
        }
        .dropdown-trigger:hover {
          color: var(--color-gold);
        }
        .dropdown-arrow {
          font-size: 0.65rem;
          transition: transform 0.3s ease;
        }
        .dropdown-container:hover .dropdown-arrow {
          transform: rotate(180deg);
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #ffffff;
          border: 1px solid rgba(10, 22, 40, 0.08);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 30px rgba(10, 22, 40, 0.08);
          padding: 0.8rem 0;
          list-style: none;
          min-width: 180px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1000;
        }
        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-left: 1px solid rgba(10, 22, 40, 0.08);
          border-top: 1px solid rgba(10, 22, 40, 0.08);
        }
        .dropdown-container:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-menu li {
          width: 100%;
        }
        .dropdown-menu a {
          display: block;
          padding: 0.6rem 1.2rem;
          font-size: 0.82rem !important;
          color: var(--color-navy) !important;
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: left;
        }
        body.rtl .dropdown-menu a {
          text-align: right;
        }
        .dropdown-menu a::after {
          display: none !important;
        }
        .dropdown-menu a:hover {
          background: rgba(10, 22, 40, 0.03);
          color: var(--color-gold) !important;
          padding-left: 1.4rem;
        }
        body.rtl .dropdown-menu a:hover {
          padding-left: 1.2rem;
          padding-right: 1.4rem;
        }

        /* Hamburger animations */
        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 1001;
          flex-direction: column;
          gap: 6px;
          width: 36px;
          height: 36px;
          justify-content: center;
          align-items: center;
        }
        .hamburger-btn .bar {
          display: block;
          width: 22px;
          height: 2px;
          background-color: var(--color-navy);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hamburger-btn.open .bar:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger-btn.open .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger-btn.open .bar:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Language Custom Selector */
        .custom-lang-selector {
          position: relative;
          display: inline-block;
        }
        .lang-selected {
          background: rgba(10, 22, 40, 0.05);
          border: 1px solid rgba(10, 22, 40, 0.15);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-navy);
          cursor: pointer;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 6px;
          outline: none;
          transition: all 0.3s ease;
        }
        .lang-selected:hover {
          background: rgba(10, 22, 40, 0.1);
        }
        .lang-arrow {
          font-size: 0.65rem;
          transition: transform 0.3s ease;
        }
        .custom-lang-selector:hover .lang-arrow {
          transform: rotate(180deg);
        }
        .lang-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          transform: translateY(10px);
          background: #ffffff;
          border: 1px solid rgba(10, 22, 40, 0.08);
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 30px rgba(10, 22, 40, 0.08);
          list-style: none;
          min-width: 80px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1000;
          padding: 4px 0;
        }
        body.rtl .lang-dropdown {
          right: auto;
          left: 0;
        }
        .custom-lang-selector:hover .lang-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .lang-dropdown li button {
          display: block;
          width: 100%;
          background: none;
          border: none;
          padding: 8px 12px;
          font-size: 0.82rem;
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-navy);
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
        }
        .lang-dropdown li button:hover {
          background: rgba(10, 22, 40, 0.05);
          color: var(--color-gold);
        }

        .lang-btn {
          background: none;
          border: 1px solid rgba(10, 22, 40, 0.15);
          border-radius: 4px;
          padding: 6px 12px;
          font-weight: 600;
          color: var(--color-navy);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        .lang-btn.active {
          background: var(--color-navy);
          color: #fff;
          border-color: var(--color-navy);
        }

        /* Mobile specific layouts */
        .mobile-divider {
          width: 100%;
          height: 1px;
          background: rgba(10, 22, 40, 0.05);
          margin: 0.2rem 0;
        }
        .mobile-section-header {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-grey-text);
          font-weight: 600;
          align-self: flex-start;
          padding-left: 10px;
          margin-bottom: -0.2rem;
        }
        body.rtl .mobile-section-header {
          padding-left: 0;
          padding-right: 10px;
          align-self: flex-end;
        }
        .mobile-sublink {
          align-self: flex-start;
          padding-left: 20px;
        }
        body.rtl .mobile-sublink {
          padding-left: 0;
          padding-right: 20px;
          align-self: flex-end;
        }
        .mobile-sublink a {
          font-size: 0.9rem !important;
          color: var(--color-grey-text) !important;
        }
        .mobile-sublink a.active {
          color: var(--color-gold) !important;
        }

        @media (max-width: 992px) {
          header {
            top: 10px !important;
            padding: 0 10px !important;
          }
          .nav-container {
            border-radius: 30px !important;
            padding: 0 20px !important;
            height: 64px !important;
          }
          .desktop-only {
            display: none !important;
          }
          .hamburger-btn {
            display: flex;
          }
          .nav-cta {
            display: none !important;
          }
          .nav-links.mobile-only {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 74px;
            left: 10px;
            width: calc(100% - 20px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 2rem 1.5rem;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(10, 22, 40, 0.08);
            border: 1px solid rgba(10, 22, 40, 0.05);
            gap: 1.2rem;
            align-items: center;
            z-index: 999;
            list-style: none;
          }
          .nav-links.mobile-only.open {
            display: flex;
          }
          .nav-links.mobile-only a {
            font-size: 1rem;
          }
          .mobile-lang-row {
            display: flex;
            gap: 10px;
            width: 100%;
            justify-content: center;
            margin-top: 0.5rem;
          }
        }

        @media (min-width: 993px) {
          .desktop-only {
            display: flex !important;
          }
          .mobile-only {
            display: none !important;
          }
        }

        @media (min-width: 993px) and (max-width: 1200px) {
          .nav-links.desktop-only {
            gap: 1.2rem;
          }
          .nav-links.desktop-only a, .dropdown-trigger {
            font-size: 0.82rem;
          }
        }

        /* RTL Overrides for Header Layout */
        body.rtl .nav-container,
        html[dir="rtl"] .nav-container {
          flex-direction: row !important;
          direction: ltr !important;
          justify-content: space-between !important;
        }
        body.rtl .logo,
        html[dir="rtl"] .logo {
          order: 3 !important;
          margin: 0 !important;
        }
        body.rtl nav,
        html[dir="rtl"] nav {
          order: 2 !important;
          margin: 0 !important;
        }
        body.rtl .nav-cta,
        html[dir="rtl"] .nav-cta {
          order: 1 !important;
          margin: 0 !important;
          display: flex !important;
          flex-direction: row-reverse !important;
          align-items: center !important;
          gap: 16px !important;
        }
        body.rtl .hamburger-btn,
        html[dir="rtl"] .hamburger-btn {
          order: 1 !important;
          margin: 0 !important;
        }
        body.rtl .nav-links.desktop-only,
        html[dir="rtl"] .nav-links.desktop-only {
          flex-direction: row-reverse !important;
          direction: rtl !important;
        }
        body.rtl .lang-dropdown,
        html[dir="rtl"] .lang-dropdown {
          right: auto !important;
          left: 0 !important;
        }
        body.rtl .dropdown-menu a,
        html[dir="rtl"] .dropdown-menu a {
          text-align: right !important;
        }
        body.rtl .dropdown-menu a:hover,
        html[dir="rtl"] .dropdown-menu a:hover {
          padding-left: 1.2rem !important;
          padding-right: 1.4rem !important;
        }
        body.rtl .mobile-section-header,
        html[dir="rtl"] .mobile-section-header {
          padding-left: 0 !important;
          padding-right: 10px !important;
          align-self: flex-end !important;
        }
        body.rtl .mobile-sublink,
        html[dir="rtl"] .mobile-sublink {
          padding-left: 0 !important;
          padding-right: 20px !important;
          align-self: flex-end !important;
        }
      `}} />

      <header>
        <div className="container nav-container">
          <div className="logo">
            <Link href={`/${locale}`}>
              <Image
                src="/assets/logos/logo.png"
                alt="INFC Logo"
                width={156}
                height={40}
                priority
                unoptimized
                style={{ height: "40px", width: "auto" }}
              />
            </Link>
          </div>

          <nav>
            {/* Desktop Navigation */}
            <ul className="nav-links desktop-only">
              {coreNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href} prefetch={false} className={isActive ? "active" : ""}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              
              {/* Community Dropdown */}
              <li className="dropdown-container">
                <span className="dropdown-trigger">
                  {t("nav.community")} <span className="dropdown-arrow">▾</span>
                </span>
                <ul className="dropdown-menu">
                  {communityItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link href={item.href} prefetch={false} className={isActive ? "active" : ""}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              <li>
                <Link
                  href={`/${locale}/franchise-dashboard`}
                  prefetch={false}
                  style={{ color: "var(--color-gold)", fontWeight: 700 }}
                  className={pathname === `/${locale}/franchise-dashboard` ? "active" : ""}
                >
                  {t("nav.franchise")}
                </Link>
              </li>
            </ul>

            {/* Mobile Navigation */}
            <ul className={`nav-links mobile-only ${isMobileOpen ? "open" : ""}`}>
              <li onClick={() => setIsMobileOpen(false)}>
                <Link href={`/${locale}`} prefetch={false} className={pathname === `/${locale}` ? "active" : ""}>
                  {t("nav.home")}
                </Link>
              </li>
              {coreNavItems.map((item) => (
                <li key={item.href} onClick={() => setIsMobileOpen(false)}>
                  <Link href={item.href} prefetch={false} className={pathname === item.href ? "active" : ""}>
                    {item.label}
                  </Link>
                </li>
              ))}
              
              <li className="mobile-divider"></li>
              
              <li className="mobile-section-header">{t("nav.community")}</li>
              {communityItems.map((item) => (
                <li key={item.href} className="mobile-sublink" onClick={() => setIsMobileOpen(false)}>
                  <Link href={item.href} prefetch={false} className={pathname === item.href ? "active" : ""}>
                    {item.label}
                  </Link>
                </li>
              ))}
              
              <li className="mobile-divider"></li>
              
              <li onClick={() => setIsMobileOpen(false)}>
                <Link
                  href={`/${locale}/franchise-dashboard`}
                  prefetch={false}
                  style={{ color: "var(--color-gold)", fontWeight: 700 }}
                  className={pathname === `/${locale}/franchise-dashboard` ? "active" : ""}
                >
                  {t("nav.franchise")}
                </Link>
              </li>

              <li className="mobile-lang-row">
                <button onClick={() => { setIsMobileOpen(false); handleLanguageChange("fr"); }} className={`lang-btn ${locale === "fr" ? "active" : ""}`}>FR</button>
                <button onClick={() => { setIsMobileOpen(false); handleLanguageChange("en"); }} className={`lang-btn ${locale === "en" ? "active" : ""}`}>EN</button>
                <button onClick={() => { setIsMobileOpen(false); handleLanguageChange("ar"); }} className={`lang-btn ${locale === "ar" ? "active" : ""}`}>AR</button>
              </li>
              
              <li onClick={() => setIsMobileOpen(false)} style={{ width: "100%", marginTop: "0.5rem" }}>
                <Link href={`/${locale}/contact`} prefetch={false} className="btn btn-navy" style={{ display: "block", width: "100%", textAlign: "center" }}>
                  {t("nav.cta")}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="nav-cta" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="custom-lang-selector">
              <button className="lang-selected">
                {locale.toUpperCase()} <span className="lang-arrow">▾</span>
              </button>
              <ul className="lang-dropdown">
                {["fr", "en", "ar"].map((loc) => {
                  if (loc === locale) return null;
                  return (
                    <li key={loc}>
                      <button onClick={() => handleLanguageChange(loc)}>
                        {loc.toUpperCase()}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <Link href={`/${locale}/contact`} prefetch={false} className="btn btn-navy">
              {t("nav.cta")}
            </Link>
          </div>

          <button
            className={`hamburger-btn ${isMobileOpen ? "open" : ""}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>
    </>
  );
}
