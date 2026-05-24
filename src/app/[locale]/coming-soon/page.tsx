"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import Toast from "@/components/Toast";

export default function ComingSoonPage() {
  const { t, locale, dir } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ show: false, title: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && ["fr", "en", "ar"].includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push("/" + segments.join("/"));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setEmail("");
        setToast({
          show: true,
          title: locale === "ar" ? "📬 تم الاشتراك" : locale === "en" ? "📬 Subscribed" : "📬 Inscription réussie",
          message: t("comingSoon.successMsg"),
        });
      } else {
        setToast({
          show: true,
          title: locale === "ar" ? "❌ خطأ" : locale === "en" ? "❌ Error" : "❌ Erreur",
          message: data.error || t("comingSoon.errorMsg"),
        });
      }
    } catch {
      setToast({
        show: true,
        title: locale === "ar" ? "❌ خطأ" : locale === "en" ? "❌ Error" : "❌ Erreur",
        message: t("comingSoon.errorMsg"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAr = locale === "ar";

  // Split title to highlight the last part in gold
  const getFormattedTitle = () => {
    const rawTitle = t("comingSoon.title");
    if (locale === "ar") {
      return (
        <>
          افتتاح <span style={{ color: "var(--color-gold)" }}>فضاؤنا الرقمي</span> قريبًا
        </>
      );
    } else if (locale === "en") {
      return (
        <>
          Our <span style={{ color: "var(--color-gold)" }}>Digital Space</span> is Opening Soon
        </>
      );
    } else {
      return (
        <>
          Ouverture Prochaine de Notre <span style={{ color: "var(--color-gold)" }}>Espace Digital</span>
        </>
      );
    }
  };

  return (
    <>
      <div className={`coming-soon-wrapper ${isAr ? "rtl" : ""}`}>
        {/* CSS styles to override default layout and matching the main page theme */}
        <style dangerouslySetInnerHTML={{ __html: `
          .coming-soon-wrapper {
            min-height: 100vh;
            background-color: var(--color-creme, #F8F5F0);
            font-family: var(--font-body), sans-serif;
            color: var(--color-grey-text, #4b5563);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px;
            box-sizing: border-box;
          }

          /* Floating navbar container styled EXACTLY like the main Header */
          .cs-navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: var(--container-max, 1200px);
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(12px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 10px 30px rgba(10, 22, 40, 0.05),
                        0 1px 3px rgba(10, 22, 40, 0.02) !important;
            border-radius: 50px !important;
            padding: 0 32px !important;
            height: 72px !important;
            margin: 20px auto 0 !important;
            z-index: 100;
            box-sizing: border-box;
          }

          .cs-logo {
            flex-shrink: 0;
            display: flex;
            align-items: center;
          }

          /* Language Custom Selector (matching Header.tsx) */
          .custom-lang-selector {
            position: relative;
            display: inline-block;
          }
          .lang-selected {
            background: rgba(10, 22, 40, 0.05);
            border: 1px solid rgba(10, 22, 40, 0.15);
            border-radius: var(--radius-sm, 8px);
            padding: 8px 12px;
            font-family: var(--font-heading);
            font-weight: 600;
            color: var(--color-navy, #0A1628);
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
            border-radius: var(--radius-sm, 8px);
            box-shadow: 0 10px 30px rgba(10, 22, 40, 0.08);
            list-style: none;
            min-width: 80px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 1000;
            padding: 4px 0;
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
            color: var(--color-navy, #0A1628);
            cursor: pointer;
            text-align: center;
            transition: all 0.2s ease;
          }
          .lang-dropdown li button:hover {
            background: rgba(10, 22, 40, 0.05);
            color: var(--color-gold, #D4AF37);
          }

          /* Main content card container */
          .main-content {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 1000px;
            margin: 40px auto;
            z-index: 10;
          }

          /* Pure White Card matching home page grids */
          .content-card {
            background: var(--color-white, #FFFFFF);
            border: 1px solid rgba(10, 22, 40, 0.05);
            border-radius: var(--radius-lg, 24px);
            padding: 4rem 3.5rem;
            text-align: center;
            box-shadow: var(--shadow-soft, 0 10px 40px rgba(10, 22, 40, 0.05));
            width: 100%;
            box-sizing: border-box;
          }

          /* Stars/status Badge matching Hero Badge */
          .badge-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(212, 175, 55, 0.08);
            border: 1px solid rgba(212, 175, 55, 0.25);
            color: var(--color-gold, #D4AF37);
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 700;
            margin-bottom: 2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .badge-pulse {
            width: 8px;
            height: 8px;
            background: var(--color-gold, #D4AF37);
            border-radius: 50%;
            animation: pulse-dot 1.5s infinite;
          }

          @keyframes pulse-dot {
            0% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
            70% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 0 8px rgba(212, 175, 55, 0); }
            100% { transform: scale(0.9); opacity: 0.5; box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
          }

          .coming-soon-title {
            font-family: var(--font-heading), sans-serif;
            font-size: clamp(2.2rem, 5vw, 3.2rem);
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: var(--color-navy, #0A1628);
          }

          .coming-soon-subtitle {
            font-size: 1.15rem;
            color: var(--color-grey-text, #4b5563);
            font-weight: 600;
            margin-bottom: 2rem;
            opacity: 0.95;
          }

          .coming-soon-desc {
            color: var(--color-grey-text, #4b5563);
            font-size: 1.05rem;
            line-height: 1.6;
            max-width: 750px;
            margin: 0 auto 3rem;
          }

          /* Email Drip Magnet Form */
          .form-container {
            max-width: 550px;
            margin: 0 auto 3.5rem;
            background: var(--color-creme, #F8F5F0);
            padding: 2.5rem;
            border-radius: var(--radius-md, 16px);
            border: 1px solid rgba(10, 22, 40, 0.03);
            box-sizing: border-box;
          }

          .form-title {
            font-family: var(--font-heading);
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--color-navy, #0A1628);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .form-desc {
            font-size: 0.9rem;
            color: var(--color-grey-text, #4b5563);
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }

          .input-group {
            display: flex;
            background: #FFFFFF;
            border: 1px solid rgba(10, 22, 40, 0.12);
            border-radius: 50px;
            padding: 6px;
            transition: all 0.3s ease;
          }
          .input-group:focus-within {
            border-color: var(--color-gold, #D4AF37);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.12);
          }

          .input-field {
            background: none;
            border: none;
            outline: none;
            color: var(--color-navy, #0A1628);
            padding: 10px 20px;
            font-size: 0.95rem;
            flex-grow: 1;
            font-family: inherit;
          }
          .input-field::placeholder {
            color: rgba(10, 22, 40, 0.4);
          }

          .submit-btn {
            background: var(--color-navy, #0A1628);
            color: #FFFFFF;
            border: none;
            font-weight: 700;
            padding: 10px 28px;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
          }
          .submit-btn:hover {
            background: var(--color-navy-light, #1A2B45);
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(10, 22, 40, 0.15);
          }
          .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* WhatsApp Quick Contacts grid */
          .whatsapp-section {
            border-top: 1px dashed rgba(10, 22, 40, 0.12);
            padding-top: 3rem;
          }

          .whatsapp-title {
            font-family: var(--font-heading), sans-serif;
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--color-navy, #0A1628);
            margin-bottom: 0.5rem;
          }

          .whatsapp-desc {
            font-size: 0.95rem;
            color: var(--color-grey-text, #4b5563);
            margin-bottom: 2rem;
          }

          .whatsapp-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
            gap: 1.2rem;
          }

          .wa-card {
            background: var(--color-creme, #F8F5F0);
            border: 1px solid rgba(10, 22, 40, 0.05);
            border-radius: var(--radius-md, 16px);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(10, 22, 40, 0.01);
            box-sizing: border-box;
          }
          .wa-card:hover {
            background: #FFFFFF;
            border-color: var(--color-gold, #D4AF37);
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover, 0 20px 50px rgba(10, 22, 40, 0.1));
          }

          .wa-city {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1.05rem;
            color: var(--color-navy, #0A1628);
          }

          .wa-btn {
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--color-gold, #D4AF37);
            display: inline-flex;
            align-items: center;
            gap: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: color 0.3s ease;
          }
          .wa-card:hover .wa-btn {
            color: #c49f2b;
          }

          .footer-bar {
            text-align: center;
            font-size: 0.85rem;
            color: var(--color-grey-text, #4b5563);
            margin-top: 1.5rem;
            border-top: 1px solid rgba(10, 22, 40, 0.05);
            padding-top: 1.5rem;
          }

          /* RTL Override for languages layout */
          .coming-soon-wrapper.rtl {
            direction: rtl;
            text-align: right;
          }
          .coming-soon-wrapper.rtl .cs-navbar {
            flex-direction: row-reverse !important;
          }
          .coming-soon-wrapper.rtl .lang-dropdown {
            left: 0;
            right: auto;
          }
          .coming-soon-wrapper.rtl .input-group {
            flex-direction: row;
          }
          .coming-soon-wrapper.rtl .wa-btn {
            flex-direction: row-reverse;
          }

          @media (max-width: 768px) {
            .coming-soon-wrapper {
              padding: 15px;
            }
            .cs-navbar {
              padding: 0 20px !important;
            }
            .content-card {
              padding: 3rem 1.5rem;
            }
            .form-container {
              padding: 1.5rem 1.2rem;
            }
            .input-group {
              flex-direction: column;
              background: none;
              border: none;
              padding: 0;
              gap: 10px;
            }
            .input-field {
              background: #FFFFFF;
              border: 1px solid rgba(10, 22, 40, 0.12);
              border-radius: 50px;
              width: 100%;
              text-align: center;
            }
            .submit-btn {
              width: 100%;
              padding: 12px;
            }
            .whatsapp-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 480px) {
            .whatsapp-grid {
              grid-template-columns: 1fr;
            }
          }
        `}} />

        {/* NAVBAR CONTAINER (uses div to avoid global header styles conflict) */}
        <div className="cs-navbar">
          <div className="cs-logo">
            <Image
              src="/assets/logos/logo.png"
              alt="INFC Logo"
              width={130}
              height={33}
              style={{ height: "33px", width: "auto" }}
              priority
              unoptimized
            />
          </div>

          <div className="custom-lang-selector">
            <button className="lang-selected">
              {locale.toUpperCase()} <span className="lang-arrow">▾</span>
            </button>
            <ul className="lang-dropdown">
              {["fr", "en", "ar"].map((loc) => {
                if (loc === locale) return null;
                return (
                  <li key={loc}>
                    <button onClick={() => handleLocaleChange(loc)}>
                      {loc.toUpperCase()}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* MAIN CARD CONTAINER */}
        <section className="main-content">
          <div className="content-card">
            <div className="badge-status">
              <span className="badge-pulse"></span>
              <span>{locale === "ar" ? "قريباً جداً" : locale === "en" ? "Coming Soon" : "Ouverture Prochaine"}</span>
            </div>

            <h1 className="coming-soon-title">{getFormattedTitle()}</h1>
            <p className="coming-soon-subtitle">{t("comingSoon.subtitle")}</p>
            <p className="coming-soon-desc">{t("comingSoon.desc")}</p>

            {/* Newsletter Subscription Drip */}
            <div className="form-container">
              <h3 className="form-title">{t("comingSoon.notifyTitle")}</h3>
              <p className="form-desc">{t("comingSoon.notifyDesc")}</p>
              <form onSubmit={handleSubscribe} className="input-group">
                <input
                  type="email"
                  className="input-field"
                  placeholder={t("comingSoon.placeholder")}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "..." : t("comingSoon.btnNotify")}
                </button>
              </form>
            </div>

            {/* Direct WhatsApp Quick-Actions */}
            <div className="whatsapp-section">
              <h2 className="whatsapp-title">{t("comingSoon.centersTitle")}</h2>
              <p className="whatsapp-desc">{t("comingSoon.centersDesc")}</p>

              <div className="whatsapp-grid">
                <a
                  href="https://wa.me/212622606011?text=Bonjour%20INFC%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Casablanca"
                  target="_blank"
                  rel="noreferrer"
                  className="wa-card"
                >
                  <span style={{ fontSize: "1.5rem" }}>🏢</span>
                  <span className="wa-city">{t("footer.centresList.casablanca")}</span>
                  <span className="wa-btn">WhatsApp ➔</span>
                </a>
                <a
                  href="https://wa.me/212622606012?text=Bonjour%20INFC%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Marrakech"
                  target="_blank"
                  rel="noreferrer"
                  className="wa-card"
                >
                  <span style={{ fontSize: "1.5rem" }}>🌴</span>
                  <span className="wa-city">{t("footer.centresList.marrakech")}</span>
                  <span className="wa-btn">WhatsApp ➔</span>
                </a>
                <a
                  href="https://wa.me/212622606017?text=Bonjour%20INFC%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Tanger"
                  target="_blank"
                  rel="noreferrer"
                  className="wa-card"
                >
                  <span style={{ fontSize: "1.5rem" }}>🌊</span>
                  <span className="wa-city">{t("footer.centresList.tanger")}</span>
                  <span className="wa-btn">WhatsApp ➔</span>
                </a>
                <a
                  href="https://wa.me/212622606033?text=Bonjour%20INFC%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Kenitra"
                  target="_blank"
                  rel="noreferrer"
                  className="wa-card"
                >
                  <span style={{ fontSize: "1.5rem" }}>🌳</span>
                  <span className="wa-city">{t("footer.centresList.kenitra")}</span>
                  <span className="wa-btn">WhatsApp ➔</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="footer-bar">
          <p>© {new Date().getFullYear()} INFC. {t("footer.rights")}</p>
        </footer>
      </div>

      {/* Toast Alert Feedback */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
}
