"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SynapseVisualizer from "@/components/SynapseVisualizer";
import Toast from "@/components/Toast";
import { useTranslation } from "@/context/LanguageContext";
import "@/app/home.css";

export default function HomeClient() {
  const { t, locale } = useTranslation();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [medicalForm, setMedicalForm] = useState({
    name: "",
    specialty: "pédiatre",
    email: "",
    phone: "",
    objective: "doc",
  });
  const [isMedicalSubmitted, setIsMedicalSubmitted] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
  });

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterEmail("");
        setToast({
          show: true,
          title: "📬 Inscription réussie !",
          message: data.message,
        });
      } else {
        setToast({
          show: true,
          title: "❌ Erreur",
          message: data.error || "Une erreur est survenue.",
        });
      }
    } catch {
      setToast({
        show: true,
        title: "❌ Erreur",
        message: "Impossible de se connecter au serveur.",
      });
    }
  };

  const handleMedicalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/medical-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicalForm),
      });
      if (res.ok) {
        setIsMedicalSubmitted(true);
        setToast({
          show: true,
          title: "🧬 Demande validée",
          message: "Vos accès ont été préparés avec succès.",
        });
      } else {
        const data = await res.json();
        setToast({
          show: true,
          title: "❌ Erreur",
          message: data.error || "Une erreur est survenue.",
        });
      }
    } catch {
      setToast({
        show: true,
        title: "❌ Erreur",
        message: "Impossible d'envoyer la demande.",
      });
    }
  };

  return (
    <>
      <Header />

      <main>
        {/* 1. Hero Section (Liberez votre cerveau du stress) */}
        <section className="section bg-white" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="hero-split">
              <div className="hero-info">
                <div className="stars-badge-container">
                  <span className="stars-gold">★ ★ ★ ★ ★</span>
                  <span className="stars-badge-text">{t("home.starsText")}</span>
                </div>
                <h1>
                  {locale === "ar" ? (
                    <>حرر <span>دماغك</span> من التوتر</>
                  ) : locale === "en" ? (
                    <>Free your <span>brain</span> from stress</>
                  ) : (
                    <>Libérez votre <span>cerveau</span> du stress</>
                  )}
                </h1>
                <p>{t("home.heroDesc")}</p>

                <ul className="hero-bullets-list">
                  {((t("home.heroBullets") || []) as string[]).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>

                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  <Link href={`/${locale}/brain-boost#quiz-section`} prefetch={false} className="btn btn-gold">
                    {t("home.btnQuiz")}
                  </Link>
                  <Link
                    href={`/${locale}/neurofeedback`}
                    prefetch={false}
                    className="btn btn-outline"
                    style={{ borderColor: "var(--color-navy)", color: "var(--color-navy) !important" }}
                  >
                    {t("home.btnApproach")}
                  </Link>
                </div>
              </div>
              <div className="hero-media-grid">
                <div className="hero-grid-item" style={{ gridRow: "span 2", height: "380px", position: "relative" }}>
                  <Image
                    src="/assets/images/neurofeedback-casablanca-1-480.jpg"
                    alt="Cabinet INFC Casablanca"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="hero-grid-item" style={{ height: "180px", position: "relative" }}>
                  <Image
                    src="/assets/images/neurofeedback-marrakech-5-480.jpg"
                    alt="Cabinet INFC Marrakech"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="hero-grid-item" style={{ height: "180px", position: "relative" }}>
                  <Image
                    src="/assets/images/neurofeedback-tanger-6-480.jpg"
                    alt="Cabinet INFC Tanger"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Google Reviews Animated Marquee */}
        <div className="google-reviews-bar">
          <div className="reviews-marquee-container">
            {/* Set 1 */}
            {((t("home.reviewsList") || []) as any[]).map((rev, idx) => (
              <div key={`set1-${idx}`} className="review-marquee-item">
                <span style={{ color: idx % 4 === 0 ? "#4285F4" : idx % 4 === 1 ? "#EA4335" : idx % 4 === 2 ? "#FBBC05" : "#34A853", fontWeight: 800 }}>G</span>{" "}
                <span>
                  <strong>{rev.name}</strong> "{rev.text}" ⭐⭐⭐⭐⭐
                </span>
              </div>
            ))}
            {/* Set 2 (for seamless loop) */}
            {((t("home.reviewsList") || []) as any[]).map((rev, idx) => (
              <div key={`set2-${idx}`} className="review-marquee-item">
                <span style={{ color: idx % 4 === 0 ? "#4285F4" : idx % 4 === 1 ? "#EA4335" : idx % 4 === 2 ? "#FBBC05" : "#34A853", fontWeight: 800 }}>G</span>{" "}
                <span>
                  <strong>{rev.name}</strong> "{rev.text}" ⭐⭐⭐⭐⭐
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section : Qu'est-ce que le Neurofeedback ? */}
        <section className="whatis-section">
          <div className="container">
            <div className="section-header text-center" style={{ maxWidth: "700px", margin: "0 auto 50px" }}>
              <span
                style={{
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                {t("home.whatisSubtitle")}
              </span>
              <h2 style={{ color: "#fff" }}>{t("home.whatisTitle")}</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", marginTop: "10px" }}>
                {t("home.whatisDesc")}
              </p>
            </div>

            <SynapseVisualizer />
          </div>
        </section>

        {/* 3. Comment ça marche (Simple et naturel) */}
        <section className="section bg-creme" style={{ paddingBottom: "40px" }}>
          <div className="container">
            <div className="section-header">
              <span
                style={{
                  color: "#8c6200",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                }}
              >
                {t("home.processSubtitle")}
              </span>
              <h2 style={{ marginTop: "10px" }}>{t("home.processTitle")}</h2>
              <p>{t("home.processDesc")}</p>
            </div>

            <div className="process-grid">
              {/* Step 1 */}
              <div className="process-step">
                <div className="process-icon-wrapper">
                  <span className="process-number">01</span>
                  <span>🎧</span>
                </div>
                <h3>{t("home.step1Title")}</h3>
                <p>{t("home.step1Desc")}</p>
              </div>

              {/* Step 2 */}
              <div className="process-step">
                <div className="process-icon-wrapper">
                  <span className="process-number">02</span>
                  <span>📈</span>
                </div>
                <h3>{t("home.step2Title")}</h3>
                <p>{t("home.step2Desc")}</p>
              </div>

              {/* Step 3 */}
              <div className="process-step">
                <div className="process-icon-wrapper">
                  <span className="process-number">03</span>
                  <span>✨</span>
                </div>
                <h3>{t("home.step3Title")}</h3>
                <p>{t("home.step3Desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PERSONA TARGETED PROGRAMS */}
        <section className="section bg-creme" style={{ paddingTop: "40px" }}>
          <div className="container">
            <div className="section-header">
              <span
                style={{
                  color: "#8c6200",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                }}
              >
                {t("home.programsSubtitle")}
              </span>
              <h2 style={{ marginTop: "10px" }}>{t("home.programsTitle")}</h2>
              <p>{t("home.programsDesc")}</p>
            </div>

            <div className="persona-container">
              {/* 1. For Parents */}
              <div className="persona-row">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/program-parents.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover", zIndex: 0 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65))",
                      zIndex: 1,
                    }}
                  />
                  <div className="visual-box" style={{ position: "relative", zIndex: 2 }}>
                    <div className="visual-title">{t("home.progParentsSub")}</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">{t("home.progParentsBadge")}</div>
                  <h2>{t("home.progParentsTitle")}</h2>
                  <p>{t("home.progParentsText")}</p>

                  <div className="persona-stat">
                    📈 {t("home.progParentsStatText")}
                  </div>

                  <ul className="persona-bullets">
                    {((t("home.progParentsBullets") || []) as string[]).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  <div className="multi-cta">
                    <a href="/assets/pdfs/guide_neuro_sensible.pdf" target="_blank" className="btn btn-gold">
                      {t("home.progParentsBtn1")}
                    </a>
                    <Link href={`/${locale}/contact`} prefetch={false} className="btn btn-report">
                      {t("home.progParentsBtn2")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. Veterans & Trauma Survivors */}
              <div className="persona-row reverse">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/program-trauma.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover", zIndex: 0 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65))",
                      zIndex: 1,
                    }}
                  />
                  <div className="visual-box" style={{ position: "relative", zIndex: 2 }}>
                    <div className="visual-title">{t("home.progTraumaSub")}</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">{t("home.progTraumaBadge")}</div>
                  <h2>{t("home.progTraumaTitle")}</h2>
                  <p>{t("home.progTraumaText")}</p>

                  <div className="persona-stat">
                    📈 {t("home.progTraumaStatText")}
                  </div>

                  <ul className="persona-bullets">
                    {((t("home.progTraumaBullets") || []) as string[]).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  <div className="multi-cta">
                    <a href="/assets/pdfs/rapport_creatives_ads.pdf" target="_blank" className="btn btn-gold">
                      {t("home.progTraumaBtn1")}
                    </a>
                    <Link href={`/${locale}/contact`} prefetch={false} className="btn btn-report">
                      {t("home.progTraumaBtn2")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Peak Performers */}
              <div className="persona-row">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/program-performers.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover", zIndex: 0 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65))",
                      zIndex: 1,
                    }}
                  />
                  <div className="visual-box" style={{ position: "relative", zIndex: 2 }}>
                    <div className="visual-title">{t("home.progPerformersSub")}</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">{t("home.progPerformersBadge")}</div>
                  <h2>{t("home.progPerformersTitle")}</h2>
                  <p>{t("home.progPerformersText")}</p>

                  <div className="persona-stat">
                    📈 {t("home.progPerformersStatText")}
                  </div>

                  <ul className="persona-bullets">
                    {((t("home.progPerformersBullets") || []) as string[]).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  <div className="multi-cta">
                    <Link href={`/${locale}/contact`} prefetch={false} className="btn btn-gold">
                      {t("home.progPerformersBtn1")}
                    </Link>
                    <Link href={`/${locale}/neurofeedback`} prefetch={false} className="btn btn-report">
                      {t("home.progPerformersBtn2")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. For Adults */}
              <div className="persona-row reverse">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/program-adults.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover", zIndex: 0 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65))",
                      zIndex: 1,
                    }}
                  />
                  <div className="visual-box" style={{ position: "relative", zIndex: 2 }}>
                    <div className="visual-title">{t("home.progAdultsSub")}</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">{t("home.progAdultsBadge")}</div>
                  <h2>{t("home.progAdultsTitle")}</h2>
                  <p>{t("home.progAdultsText")}</p>

                  <div className="persona-stat">
                    📈 {t("home.progAdultsStatText")}
                  </div>

                  <ul className="persona-bullets">
                    {((t("home.progAdultsBullets") || []) as string[]).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  <div className="multi-cta">
                    <Link href={`/${locale}/brain-boost#quiz-section`} prefetch={false} className="btn btn-gold">
                      {t("home.progAdultsBtn1")}
                    </Link>
                    <Link href={`/${locale}/contact`} prefetch={false} className="btn btn-report">
                      {t("home.progAdultsBtn2")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
             DR. CHADIA — HISTOIRE & VISION
        ═══════════════════════════════════════ */}
        <section className="vision-section">
          <div className="container">
            <div className="vision-split">
              {/* Video left */}
              <div className="vision-video-box">
                {!isPlayingVideo ? (
                  <div className="vision-video-placeholder" onClick={() => setIsPlayingVideo(true)}>
                    <div className="vision-play-btn">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-navy)">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", margin: 0 }}>
                      {locale === "ar" ? "شاهد فيديو الدكتورة شادية" : locale === "en" ? "Watch Dr. Chadia's video" : "Regarder la vidéo de Dr. Chadia"}
                    </p>
                  </div>
                ) : (
                  <iframe
                    src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
                    title="Dr. Chadia Chakib — Vision INFC"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none" }}
                  ></iframe>
                )}
              </div>

              {/* Text right */}
              <div className="vision-text-box">
                <span className="eyebrow">{t("home.visionSubtitle")}</span>
                <h2>{t("home.visionTitle")}</h2>
                <p>{t("home.visionText")}</p>
                <div className="vision-timeline">
                  {((t("home.visionTimeline") || []) as any[]).map((item, idx) => (
                    <div key={idx} className="vision-timeline-item">
                      <span className="vision-year">{item.year}</span>
                      <span className="vision-milestone">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/${locale}/apropos`} prefetch={false} className="btn btn-navy">
                  {t("home.visionBtn")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
             PROBLÈMES QUE NOUS AIDONS
        ═══════════════════════════════════════ */}
        <section className="problems-section">
          <div className="container">
            <div className="section-header">
              <span
                style={{
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                }}
              >
                {t("home.problemsSubtitle")}
              </span>
              <h2 style={{ marginTop: "10px", color: "#fff" }}>{t("home.problemsTitle")}</h2>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>{t("home.problemsDesc")}</p>
            </div>

            <div className="problems-grid">
              {((t("home.problemsList") || []) as any[]).map((item, idx) => (
                <div key={idx} className="problem-card">
                  <span className="problem-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* What also works with */}
            <div className="problems-also">
              <h3>{t("home.problemsAlsoTitle")}</h3>
              <div className="also-tags">
                {((t("home.problemsAlsoTags") || []) as string[]).map((tag, idx) => (
                  <span key={idx} className="also-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
             HISTOIRES DE RÉUSSITE (TEASER COMPACT)
        ═══════════════════════════════════════ */}
        <section className="stories-teaser">
          <div className="container">
            <div className="section-header">
              <span
                style={{
                  color: "#8c6200",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                }}
              >
                {t("home.storiesSubtitle")}
              </span>
              <h2 style={{ marginTop: "10px" }}>{t("home.storiesTitle")}</h2>
              <p>{t("home.storiesDesc")}</p>
            </div>

            <div className="stories-mini-grid">
              {((t("home.storiesList") || []) as any[]).map((item, idx) => (
                <div key={idx} className="story-mini-card">
                  <div className="avatar-row">
                    <div className="avatar">{item.avatar}</div>
                    <div>
                      <div className="name">{item.name}</div>
                      <div className="type">{item.type}</div>
                    </div>
                  </div>
                  <blockquote>{item.quote}</blockquote>
                  <span className="stat-badge">{item.stat}</span>
                </div>
              ))}
            </div>

            <div className="stories-teaser-cta">
              <Link href={`/${locale}/success-stories`} prefetch={false} className="btn btn-gold" style={{ fontSize: "1.05rem", padding: "13px 32px" }}>
                {t("home.storiesBtn")}
              </Link>
              <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "var(--color-grey-text)" }}>
                {t("home.storiesRating")}
              </p>
            </div>
          </div>
        </section>

        {/* 6. MEDICAL PRO SECTION WITH LEAD CAPTURE */}
        <section className="medical-section">
          <div className="container">
            <div className="section-header">
              <span
                style={{
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                {t("home.medicalSubtitle")}
              </span>
              <h2 style={{ color: "#fff" }}>{t("home.medicalTitle")}</h2>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>
                {t("home.medicalDesc")}
              </p>
            </div>

            {/* MEDICAL LEAD CAPTURE FORM */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-lg)",
                padding: "40px",
                marginBottom: "50px",
                boxShadow: "var(--shadow-hover)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center" }}>
                <div style={{ flex: 1.2, minWidth: "300px" }}>
                  <h3 style={{ color: "var(--color-gold)", fontSize: "1.5rem", marginBottom: "15px", fontFamily: "var(--font-heading)" }}>
                    {t("home.medicalFormTitle")}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6", marginBottom: "20px", fontSize: "1rem" }}>
                    {t("home.medicalFormDesc")}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    {((t("home.medicalFormBullets") || []) as string[]).map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>✔</span> {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  style={{
                    flex: 1.8,
                    minWidth: "300px",
                    background: "rgba(10, 22, 40, 0.8)",
                    padding: "30px",
                    borderRadius: "var(--radius-md)",
                    borderTop: "4px solid var(--color-gold)",
                  }}
                >
                  {!isMedicalSubmitted ? (
                    <form onSubmit={handleMedicalSubmit}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                        <div>
                          <label htmlFor="medical-name" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelName")}
                          </label>
                          <input
                            type="text"
                            id="medical-name"
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid rgba(255,255,255,0.15)",
                              background: "rgba(255,255,255,0.05)",
                              color: "#fff",
                            }}
                            placeholder="Dr. Chakib Chadia"
                            value={medicalForm.name}
                            onChange={(e) => setMedicalForm({ ...medicalForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="medical-specialty" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelSpecialty")}
                          </label>
                          <select
                            required
                            id="medical-specialty"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid rgba(255,255,255,0.15)",
                              background: "rgba(255,255,255,0.05)",
                              color: "#fff",
                            }}
                            value={medicalForm.specialty}
                            onChange={(e) => setMedicalForm({ ...medicalForm, specialty: e.target.value })}
                          >
                            <option value="pédiatre" style={{ color: "#000" }}>
                              {t("home.medicalSpecialties.pediatre")}
                            </option>
                            <option value="psychiatre" style={{ color: "#000" }}>
                              {t("home.medicalSpecialties.psychiatre")}
                            </option>
                            <option value="neurologue" style={{ color: "#000" }}>
                              {t("home.medicalSpecialties.neurologue")}
                            </option>
                            <option value="généraliste" style={{ color: "#000" }}>
                              {t("home.medicalSpecialties.generaliste")}
                            </option>
                            <option value="psychologue" style={{ color: "#000" }}>
                              {t("home.medicalSpecialties.psychologue")}
                            </option>
                            <option value="autre" style={{ color: "#000" }}>
                              {t("home.medicalSpecialties.autre")}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                        <div>
                          <label htmlFor="medical-email" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelEmail")}
                          </label>
                          <input
                            type="email"
                            id="medical-email"
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid rgba(255,255,255,0.15)",
                              background: "rgba(255,255,255,0.05)",
                              color: "#fff",
                            }}
                            placeholder="contact@infc.ma"
                            value={medicalForm.email}
                            onChange={(e) => setMedicalForm({ ...medicalForm, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="medical-phone" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelPhone")}
                          </label>
                          <input
                            type="tel"
                            id="medical-phone"
                            required
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid rgba(255,255,255,0.15)",
                              background: "rgba(255,255,255,0.05)",
                              color: "#fff",
                            }}
                            placeholder="+212 600 000 000"
                            value={medicalForm.phone}
                            onChange={(e) => setMedicalForm({ ...medicalForm, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                          {t("home.medicalFormLabelObjective")}
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
                            htmlFor="medical-obj-doc"
                            style={{
                              fontSize: "0.9rem",
                              color: "rgba(255,255,255,0.9)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              id="medical-obj-doc"
                              name="med_objective"
                              value="doc"
                              checked={medicalForm.objective === "doc"}
                              onChange={() => setMedicalForm({ ...medicalForm, objective: "doc" })}
                              style={{ accentColor: "var(--color-gold)" }}
                            />
                            {t("home.medicalFormObjectiveDoc")}
                          </label>
                          <label
                            htmlFor="medical-obj-meeting"
                            style={{
                              fontSize: "0.9rem",
                              color: "rgba(255,255,255,0.9)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              id="medical-obj-meeting"
                              name="med_objective"
                              value="meeting"
                              checked={medicalForm.objective === "meeting"}
                              onChange={() => setMedicalForm({ ...medicalForm, objective: "meeting" })}
                              style={{ accentColor: "var(--color-gold)" }}
                            />
                            {t("home.medicalFormObjectiveMeeting")}
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-gold" style={{ width: "100%", fontWeight: 700 }}>
                        {t("home.medicalFormBtn")}
                      </button>
                    </form>
                  ) : (
                    <div style={{ color: "#10B981", fontWeight: 700, textAlign: "center", fontSize: "1.1rem" }}>
                      {t("home.medicalSuccess")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="medical-grid">
              {((t("home.medicalArticles") || []) as any[]).map((item, idx) => (
                <div key={idx} className="medical-card">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7901853/" target="_blank" className="medical-link" rel="noreferrer">
                    {item.linkText}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Notre Équipe */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <span style={{ color: "#8c6200", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1.5px" }}>
                {t("home.teamSubtitle")}
              </span>
              <h2 style={{ marginTop: "10px" }}>{t("home.teamTitle")}</h2>
              <p>{t("home.teamDesc")}</p>
            </div>

            <div className="team-grid">
              {((t("home.teamList") || []) as any[]).map((member, idx) => (
                <div key={idx} className="team-card">
                  <div
                    className="team-img-container"
                    style={{ background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <span style={{ fontSize: "0.85rem", color: "var(--color-grey-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                      {t("home.teamPhotoSoon")}
                    </span>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <div className="team-role">{member.role}</div>
                    <p>{member.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Nos Centres (Un centre près de chez vous) */}
        <section className="centers-section">
          <div className="container">
            <div className="section-header">
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1.5px" }}>
                {t("home.centersSubtitle")}
              </span>
              <h2 style={{ marginTop: "10px" }}>{t("home.centersTitle")}</h2>
              <p>{t("home.centersDesc")}</p>
            </div>

            <div className="centers-grid">
              {/* Casablanca */}
              <div className="center-card">
                <div className="center-img-box">
                  <img src="/assets/images/neurofeedback-casablanca-1-480.jpg" alt="Cabinet Casablanca" />
                </div>
                <div className="center-body">
                  <h3>Casablanca</h3>
                  <ul className="center-details-list">
                    <li>
                      <span>📍</span> Nº12 2ème étage, Immeuble Living office 362 BD Ghandi Oasis
                    </li>
                    <li>
                      <span>📞</span> <a href="tel:+212522991783">+212 522 99 17 83</a>
                    </li>
                    <li>
                      <span>🕒</span> {locale === "ar" ? "الإثنين-السبت: 9 صباحًا - 7 مساءً" : locale === "en" ? "Mon-Sat: 9am-7pm" : "Lun-Sam: 9h-19h"}
                    </li>
                  </ul>
                  <Link href={`/${locale}/centres`} prefetch={false} className="center-card-link">
                    {t("home.centersBtn")}
                  </Link>
                </div>
              </div>

              {/* Marrakech */}
              <div className="center-card">
                <div className="center-img-box">
                  <img src="/assets/images/neurofeedback-marrakech-5-480.jpg" alt="Cabinet Marrakech" />
                </div>
                <div className="center-body">
                  <h3>Marrakech</h3>
                  <ul className="center-details-list">
                    <li>
                      <span>📍</span> N°33 3ème étage, Résidence Le Noyer A, Rue Ibn Sina Gueliz
                    </li>
                    <li>
                      <span>📞</span> <a href="tel:+212524207263">+212 524 20 72 63</a>
                    </li>
                    <li>
                      <span>🕒</span> {locale === "ar" ? "الإثنين-السبت: 9 صباحًا - 7 مساءً" : locale === "en" ? "Mon-Sat: 9am-7pm" : "Lun-Sam: 9h-19h"}
                    </li>
                  </ul>
                  <Link href={`/${locale}/centres`} prefetch={false} className="center-card-link">
                    {t("home.centersBtn")}
                  </Link>
                </div>
              </div>

              {/* Kenitra */}
              <div className="center-card">
                <div className="center-img-box">
                  <img src="/assets/images/neurofeedback-casablanca-1-480.jpg" alt="Cabinet Kenitra" />
                </div>
                <div className="center-body">
                  <h3>Kenitra</h3>
                  <ul className="center-details-list">
                    <li>
                      <span>📍</span> Nº2 Résidence el waha rue imam ali et saad zaghlou
                    </li>
                    <li>
                      <span>📞</span> <a href="tel:+212622606033">+212 622 60 60 33</a>
                    </li>
                    <li>
                      <span>🕒</span> {locale === "ar" ? "الإثنين-السبت: 9 صباحًا - 7 مساءً" : locale === "en" ? "Mon-Sat: 9am-7pm" : "Lun-Sam: 9h-19h"}
                    </li>
                  </ul>
                  <Link href={`/${locale}/centres`} prefetch={false} className="center-card-link">
                    {t("home.centersBtn")}
                  </Link>
                </div>
              </div>

              {/* Tanger */}
              <div className="center-card">
                <div className="center-img-box">
                  <img src="/assets/images/neurofeedback-tanger-6-480.jpg" alt="Cabinet Tanger" />
                </div>
                <div className="center-body">
                  <h3>Tanger</h3>
                  <ul className="center-details-list">
                    <li>
                      <span>📍</span> N° 25 2ème étage, Résidence El Jaghaoui, Tower Route Des Abattoirs
                    </li>
                    <li>
                      <span>📞</span> <a href="tel:+212539367519">+212 539 36 75 19</a>
                    </li>
                    <li>
                      <span>🕒</span> {locale === "ar" ? "الإثنين-السبت: 9 صباحًا - 7 مساءً" : locale === "en" ? "Mon-Sat: 9am-7pm" : "Lun-Sam: 9h-19h"}
                    </li>
                  </ul>
                  <Link href={`/${locale}/centres`} prefetch={false} className="center-card-link">
                    {t("home.centersBtn")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Final Action (Transformer votre vie) */}
        <section className="cta-action-section">
          <div className="container">
            <span
              style={{
                color: "var(--color-gold)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.85rem",
                letterSpacing: "1.5px",
                display: "block",
                marginBottom: "10px",
              }}
            >
              {t("home.finalSubtitle")}
            </span>
            <h2>{t("home.finalTitle")}</h2>
            <p>{t("home.finalDesc")}</p>

            <Link href={`/${locale}/brain-boost#quiz-section`} prefetch={false} className="btn btn-gold" style={{ fontSize: "1.1rem", padding: "15px 35px", fontWeight: 700 }}>
              {t("home.finalBtn")}
            </Link>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: "10px" }}>{t("home.finalSubBtn")}</p>

            <div className="cta-bullets-row">
              {((t("home.finalBullets") || []) as string[]).map((bullet, idx) => (
                <div key={idx} className="cta-bullet">{bullet}</div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Newsletter Section */}
      <section
        className="section bg-white"
        style={{ padding: "60px 0", borderTop: "1px solid rgba(10, 22, 40, 0.05)", borderBottom: "1px solid rgba(10, 22, 40, 0.05)" }}
      >
        <div className="container" style={{ maxWidth: "800px", textAlign: "center" }}>
          <span
            style={{
              color: "#8c6200",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              letterSpacing: "1.5px",
              display: "block",
              marginBottom: "10px",
            }}
          >
            {t("home.newsletterSubtitle")}
          </span>
          <h2 style={{ color: "var(--color-navy)", fontSize: "2rem", marginBottom: "15px" }}>{t("home.newsletterTitle")}</h2>
          <p style={{ color: "var(--color-grey-text)", fontSize: "1rem", marginBottom: "25px", maxWidth: "600px", margin: "0 auto" }}>
            {t("home.newsletterDesc")}
          </p>
          <form onSubmit={handleNewsletter} style={{ display: "flex", gap: "10px", maxWidth: "550px", margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              id="newsletter-email"
              aria-label={t("home.newsletterPlaceholder") || "Email"}
              placeholder={t("home.newsletterPlaceholder")}
              required
              style={{
                flex: 1,
                minWidth: "250px",
                padding: "12px 20px",
                border: "1px solid rgba(10,22,40,0.15)",
                borderRadius: "50px",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                outline: "none",
                color: "var(--color-navy)",
              }}
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-navy" style={{ fontSize: "0.95rem", borderRadius: "50px", padding: "12px 30px" }}>
              {t("home.newsletterBtn")}
            </button>
          </form>
          <p style={{ fontSize: "0.8rem", color: "var(--color-grey-text)", marginTop: "12px" }}>
            {t("home.newsletterSecure")}
          </p>
        </div>
      </section>

      <Footer />

      <Toast show={toast.show} title={toast.title} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}
