"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RadarWidget from "@/components/RadarWidget";
import Toast from "@/components/Toast";
import { useTranslation } from "@/context/LanguageContext";
import "@/app/home.css";

export default function ProgrammesPage() {
  const { t, locale } = useTranslation();
  const [medicalForm, setMedicalForm] = useState({
    name: "",
    specialty: "pediatre",
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

  const storiesData = [
    {
      id: "sarah",
      avatar: "👩",
      name: "Sarah M.",
      meta: locale === "ar" ? "أم (الدار البيضاء)" : locale === "en" ? "Mother of a family (Casablanca)" : "Mère de famille (Casablanca)",
      quote: locale === "ar" 
        ? "«بعد 6 أشهر من الارتجاع العصبي، تحسنت أعراض تشتت الانتباه وفرط الحركة لدى ابني بشكل مذهل. تركيزه في الفصل وسلوكه في البيت لا يضاهيان!»"
        : locale === "en" 
          ? '"After 6 months of neurofeedback, my son\'s ADHD symptoms have dramatically improved. His focus in class and behavior at home are incomparable!"'
          : '"Après 6 mois de neurofeedback, les symptômes de TDAH de mon fils se sont spectaculairement améliorés. Son focus en classe et son comportement à la maison sont incomparables !"',
      processTitle: locale === "ar" ? "👣 العملية والخطوات:" : locale === "en" ? "👣 Process & Steps:" : "👣 Le Processus & Les Étapes :",
      steps: locale === "ar" 
        ? [
            "الخطوة 1: مكالمة توجيهية ورسم خريطة الانتباه.",
            "الخطوة 2: 6 حصص أولية من التنظيم العصبي الحسي (التهدئة).",
            "الخطوة 3: 12 حصة ترسيخ + خطة التغذية الدماغية."
          ]
        : locale === "en"
          ? [
              "Step 1: Orientation call & attention mapping.",
              "Step 2: 6 initial neuro-sensory regulation sessions (calming).",
              "Step 3: 12 consolidation sessions + brain nutrition plan.",
            ]
          : [
              "Étape 1 : Échange d'orientation & cartographie d'attention.",
              "Étape 2 : 6 séances initiales de régulation neuro-sensible (calmage).",
              "Étape 3 : 12 séances de consolidation + plan de nutrition cérébrale.",
            ],
      guideTitle: locale === "ar" ? "📚 الدليل التطبيقي:" : locale === "en" ? "📚 Applied Guide:" : "📚 Guide Appliqué :",
      guideText: locale === "ar"
        ? "دليل المرافقة العصبية الحسية لمركز INFC (العادات وإدارة الشاشات)."
        : locale === "en"
          ? "The INFC Neuro-Sensory Support Guide (routines and screen management)."
          : "Le Guide d'Accompagnement Neuro-Sensible INFC (routines et gestion de l'écran).",
      metricsText: locale === "ar"
        ? <>📊 الأرقام: انخفاض التشتت في الفصل بنسبة <span>65%-</span> والنوم خلال <span>12 دقيقة</span> (بدل 1ساعة و30 دقيقة).</>
        : locale === "en"
          ? <>📊 Figures: <span>-65%</span> distractibility in class and falling asleep in <span>12 min</span> (instead of 1h30).</>
          : <>📊 Chiffres : <span>-65%</span> de distractibilité en classe et endormissement en <span>12 min</span> (au lieu de 1h30).</>
    },
    {
      id: "james",
      avatar: "👨‍💼",
      name: "James T.",
      meta: locale === "ar" ? "مدير مالي (مراكش)" : locale === "en" ? "Financial Director (Marrakech)" : "Directeur Financier (Marrakech)",
      quote: locale === "ar"
        ? "«كنت متشككاً في البداية، لكن الارتجاع العصبي غير إدارتي للتوتر واتخاذي للقرارات. أشعر بمزيد من الوضوح والسيطرة على قدراتي.»"
        : locale === "en"
          ? '"I was skeptical at first, but neurofeedback transformed my stress management and decision making. I feel more lucid and in control of my capabilities."'
          : '"J\'étais sceptique au départ, mais le neurofeedback a transformé ma gestion du stress et mes prises de décision. Je me sens plus lucide et maître de mes capacités."',
      processTitle: locale === "ar" ? "👣 العملية والخطوات:" : locale === "en" ? "👣 Process & Steps:" : "👣 Le Processus & Les Étapes :",
      steps: locale === "ar"
        ? [
            "الخطوة 1: تقييم التوتر الحاد وقياس العبء العقلي الزائد.",
            "الخطوة 2: 8 حصص مكثفة للتحسين المعرفي (مرتين أسبوعياً).",
            "الخطوة 3: 4 حصص تثبيت متباعدة على مدى شهر."
          ]
        : locale === "en"
          ? [
              "Step 1: Acute stress assessment & mental overload measurement.",
              "Step 2: 8 intensive cognitive optimization sessions (bi-weekly).",
              "Step 3: 4 stabilization sessions spread over 1 month.",
            ]
          : [
              "Étape 1 : Bilan de stress aigu & mesure de surcharge mentale.",
              "Étape 2 : 8 séances intensives d'optimisation cognitive (bi-hebdomadaire).",
              "Étape 3 : 4 séances de stabilisation espacées sur 1 mois.",
            ],
      guideTitle: locale === "ar" ? "📚 الدليل التطبيقي:" : locale === "en" ? "📚 Applied Guide:" : "📚 Guide Appliqué :",
      guideText: locale === "ar"
        ? "بروتوكول التركيز للأداء العالي INFC (القيلولة التكتيكية)."
        : locale === "en"
          ? "INFC High Performance Focus Protocol (tactical power naps)."
          : "Protocole de Focus Haute Performance INFC (micro-siestes tactiques).",
      metricsText: locale === "ar"
        ? <>📊 الأرقام: انخفاض بنسبة <span>58%-</span> في مستوى التوتر المحسوس و <span>45+ دقيقة</span> من النوم العميق كل ليلة.</>
        : locale === "en"
          ? <>📊 Figures: <span>-58%</span> perceived stress level & <span>+45 min</span> of deep sleep per night.</>
          : <>📊 Chiffres : <span>-58%</span> de niveau de stress perçu & <span>+45 min</span> de sommeil profond par nuit.</>
    },
    {
      id: "michael",
      avatar: "👴",
      name: "Michael R.",
      meta: locale === "ar" ? "محارب قديم ومتقاعد (طنجة)" : locale === "en" ? "Veteran & Retired (Tangier)" : "Vétéran & Retraité (Tanger)",
      quote: locale === "ar"
        ? "«لأول مرة منذ سنوات، أنام طوال الليل. اختفت الكوابيس تماماً. لقد أعاد لي الارتجاع العصبي حياتي ببساطة.»"
        : locale === "en"
          ? '"For the first time in years, I sleep through the night. Nightmares have completely disappeared. Neurofeedback simply gave me my life back."'
          : '"Pour la première fois depuis des années, je dors toute la nuit. Les cauchemars ont complètement disparu. Le neurofeedback m\'a tout simplement rendu ma vie."',
      processTitle: locale === "ar" ? "👣 العملية والخطوات:" : locale === "en" ? "👣 Process & Steps:" : "👣 Le Processus & Les Étapes :",
      steps: locale === "ar"
        ? [
            "الخطوة 1: خلق مساحة مطمئنة (بإضاءة منخفضة).",
            "الخطوة 2: 10 حصص تركز على تهدئة الجهاز العصبي الودي.",
            "الخطوة 3: 10 حصص لترسيخ مرونة الأعصاب."
          ]
        : locale === "en"
          ? [
              "Step 1: Creation of a reassuring space (low light intensity).",
              "Step 2: 10 sessions focused on calming the sympathetic system.",
              "Step 3: 10 sessions of nerve resilience consolidation.",
            ]
          : [
              "Étape 1 : Création d'un espace rassurant (à faible intensité lumineuse).",
              "Étape 2 : 10 séances axées sur l'apaisement du système sympathique.",
              "Étape 3 : 10 séances de consolidation de la résilience nerveuse.",
            ],
      guideTitle: locale === "ar" ? "📚 الدليل التطبيقي:" : locale === "en" ? "📚 Applied Guide:" : "📚 Guide Appliqué :",
      guideText: locale === "ar"
        ? "خطة التهدئة الذاتية بعد الصدمات."
        : locale === "en"
          ? "Post-Traumatic Autonomic Calming Plan."
          : "Plan d'Apaisement Autonome Post-Traumatique.",
      metricsText: locale === "ar"
        ? <>📊 الأرقام: اختفاء كامل للكوابيس الليلية و <span>75%-</span> في اليقظة المفرطة.</>
        : locale === "en"
          ? <>📊 Figures: Total elimination of nightmares & <span>-75%</span> hypervigilance.</>
          : <>📊 Chiffres : Suppression totale des cauchemars nocturnes & <span>-75%</span> d'hypervigilance.</>
    }
  ];

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
          title: locale === "ar" ? "🧬 تم التحقق من الطلب" : locale === "en" ? "🧬 Request Verified" : "🧬 Demande validée",
          message: locale === "ar" ? "تم إعداد صلاحيات الدخول الخاصة بك بنجاح." : locale === "en" ? "Your access has been successfully prepared." : "Vos accès ont été préparés avec succès.",
        });
      } else {
        const data = await res.json();
        setToast({
          show: true,
          title: locale === "ar" ? "❌ خطأ" : locale === "en" ? "❌ Error" : "❌ Erreur",
          message: data.error || (locale === "ar" ? "حدث خطأ غير متوقع." : locale === "en" ? "An unexpected error occurred." : "Une erreur est survenue."),
        });
      }
    } catch {
      setToast({
        show: true,
        title: locale === "ar" ? "❌ خطأ" : locale === "en" ? "❌ Error" : "❌ Erreur",
        message: locale === "ar" ? "يتعذر إرسال الطلب." : locale === "en" ? "Unable to send the request." : "Impossible d'envoyer la demande.",
      });
    }
  };

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="hero-section">
          <div className="container">
            <h1>
              {locale === "ar" ? "حلول مستهدفة وعلمية" : locale === "en" ? "Targeted & Scientific Solutions" : "Des Solutions Ciblées & Scientifiques"}
            </h1>
            <p>
              {locale === "ar" ? "تنظيم للجهاز العصبي مخصص لكل مسار حياة." : locale === "en" ? "A nervous system regulation calibrated for each life path." : "Une régulation du système nerveux calibrée pour chaque parcours de vie."}
            </p>
          </div>
        </section>

        {/* PERSONA TARGETED PROGRAMS */}
        <section className="section bg-creme">
          <div className="container">
            <div className="section-header">
              <h2>{t("home.programsTitle")}</h2>
              <p>{t("home.programsDesc")}</p>
            </div>

            {/* Interactive Radar Dashboard */}
            <RadarWidget />

            <div className="persona-container">
              {/* 1. For Parents */}
              <div className="persona-row" id="persona-parents">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/optimized/bg-large.png"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    style={{ objectFit: "cover", zIndex: 0 }}
                    priority
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
              <div className="persona-row reverse" id="persona-trauma">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/optimized/bg-large.png"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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
              <div className="persona-row" id="persona-performers">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/optimized/bg-large.png"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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
              <div className="persona-row reverse" id="persona-adults">
                <div className="persona-visual has-bg">
                  <Image
                    src="/assets/images/optimized/bg-large.png"
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
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

        {/* SUCCESS STORIES WITH DETAILS */}
        <section className="stories-section">
          <div className="container">
            <div className="section-header">
              <h2>{locale === "ar" ? "قصص نجاح حقيقية" : locale === "en" ? "Real Success Stories" : "Histoires de Réussite Réelles"}</h2>
              <p>{locale === "ar" ? "اكتشف المسارات الدقيقة، والأرقام السريرية، والخطوات التي قطعها عملاؤنا." : locale === "en" ? "Discover the precise journeys, clinical numbers, and steps taken by our clients." : "Découvrez les parcours précis, les chiffres cliniques et les étapes franchies par nos clients."}</p>
            </div>

            <div className="stories-grid">
              {storiesData.map((story) => (
                <div key={story.id} className="story-card">
                  <div className="story-header">
                    <div className="story-avatar">{story.avatar}</div>
                    <div className="story-meta">
                      <h3>{story.name}</h3>
                      <span>{story.meta}</span>
                    </div>
                  </div>
                  <p className="story-quote">{story.quote}</p>

                  <div className="story-details">
                    <div className="detail-title">{story.processTitle}</div>
                    <ul className="story-steps">
                      {story.steps.map((step, sIdx) => {
                        const colonIdx = step.toString().indexOf(":");
                        if (colonIdx !== -1) {
                          const boldPart = step.toString().slice(0, colonIdx + 1);
                          const restPart = step.toString().slice(colonIdx + 1);
                          return (
                            <li key={sIdx}>
                              <strong>{boldPart}</strong>{restPart}
                            </li>
                          );
                        }
                        return <li key={sIdx}>{step}</li>;
                      })}
                    </ul>
                    <div className="detail-title">{story.guideTitle}</div>
                    <p style={{ fontSize: "0.88rem", color: "var(--color-grey-text)", marginBottom: "15px" }}>
                      <em>{story.guideText}</em>
                    </p>
                    <div className="story-metrics">
                      {story.metricsText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEDICAL PRO SECTION */}
        <section className="medical-section">
          <div className="container">
            <div className="section-header">
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
                          <label htmlFor="med_name" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelName")}
                          </label>
                          <input
                            id="med_name"
                            type="text"
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
                          <label htmlFor="med_specialty" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelSpecialty")}
                          </label>
                          <select
                            id="med_specialty"
                            required
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
                            {Object.entries((t("home.medicalSpecialties") || {}) as Record<string, string>).map(([key, val]) => (
                              <option key={key} value={key} style={{ color: "#000" }}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                        <div>
                          <label htmlFor="med_email" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelEmail")}
                          </label>
                          <input
                            id="med_email"
                            type="email"
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
                          <label htmlFor="med_phone" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            {t("home.medicalFormLabelPhone")}
                          </label>
                          <input
                            id="med_phone"
                            type="tel"
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
                        <span id="med_objective_label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                          {t("home.medicalFormLabelObjective")}
                        </span>
                        <div role="radiogroup" aria-labelledby="med_objective_label" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
                            htmlFor="objective_doc"
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
                              id="objective_doc"
                              type="radio"
                              name="med_objective"
                              value="doc"
                              checked={medicalForm.objective === "doc"}
                              onChange={() => setMedicalForm({ ...medicalForm, objective: "doc" })}
                              style={{ accentColor: "var(--color-gold)" }}
                            />
                            {t("home.medicalFormObjectiveDoc")}
                          </label>
                          <label
                            htmlFor="objective_meeting"
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
                              id="objective_meeting"
                              type="radio"
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
              {((t("home.medicalArticles") || []) as any[]).map((art, idx) => (
                <div key={idx} className="medical-card">
                  <h3>{art.title}</h3>
                  <p>{art.desc}</p>
                  <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7901853/" target="_blank" className="medical-link" rel="noreferrer">
                    {art.linkText}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Toast show={toast.show} title={toast.title} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}
