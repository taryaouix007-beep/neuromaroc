"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EEGVisualizer from "@/components/EEGVisualizer";
import { useTranslation } from "@/context/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Est-ce médical ou invasif ?",
    answer: "Non. Le neurofeedback dynamique est une approche naturelle et non invasive. Aucun courant électrique ni impulsion n'est envoyé au cerveau. Le système agit uniquement comme un miroir, permettant au cerveau de s'auto-réguler. C'est un entraînement, pas un traitement.",
  },
  {
    question: "Combien de temps avant de ressentir les effets ?",
    answer: "Les premiers bienfaits sont souvent ressentis dès la première séance : une sensation de clarté mentale, un sommeil plus profond, ou un apaisement général. Cependant, la régulation cérébrale est un processus progressif et organique — un accompagnement sur la durée permet d'anrer durablement ces changements.",
  },
  {
    question: "Est-ce adapté aux enfants ?",
    answer: "Oui, parfaitement. Notre approche est sans effort conscient. L'enfant s'installe, regarde un film ou écoute de la musique, et son cerveau s'entraîne de manière passive. C'est idéal pour la préparation aux examens, l'accompagnement neuro-atypique (TDA/H, autisme) et la gestion du stress scolaire.",
  },
  {
    question: "Quelle est la différence avec le neurofeedback classique ?",
    answer: "Le neurofeedback classique (linéaire) impose des protocoles fixes au cerveau en ciblant des fréquences spécifiques. NeurOptimal® est un neurofeedback dynamique : il ne dirige pas le cerveau, il lui donne un miroir en temps réel pour qu'il s'auto-organise. C'est plus respectueux, plus sûr, et aligné avec le fonctionnement naturel du système nerveux central.",
  },
  {
    question: "Combien de séances sont recommandées ?",
    answer: "Il n'y a pas de nombre standard — chaque cerveau est unique. En général, 10 à 20 séances permettent d'observer des changements significatifs. Certains clients choisissent de poursuivre l'entraînement sur le long terme comme un rituel de bien-être cérébral, à l'image de l'exercice physique régulier.",
  },
  {
    question: "Y a-t-il des effets secondaires ?",
    answer: "NeurOptimal® est considéré comme l'un des systèmes de neurofeedback les plus sûrs au monde. Aucun courant n'est envoyé au cerveau. Occasionnellement, certaines personnes peuvent ressentir une légère fatigue passagère après les premières séances — signe que le cerveau réorganise activement ses réseaux.",
  },
];

export default function SciencePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { t, locale } = useTranslation();

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <Header />

      <main>
        <style dangerouslySetInnerHTML={{ __html: `
          .faq-item {
            background: var(--color-white);
            border-radius: var(--radius-md);
            margin-bottom: 1rem;
            padding: 1.5rem;
            box-shadow: var(--shadow-soft);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .faq-question {
            font-family: var(--font-heading);
            font-weight: 600;
            color: var(--color-navy);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease;
            color: var(--color-grey-text);
            margin-top: 0;
          }
          .faq-item.active .faq-answer {
            max-height: 500px;
            margin-top: 1rem;
          }
          .faq-item.active .faq-question::after {
            content: "−";
          }
          .faq-question::after {
            content: "+";
            font-size: 1.5rem;
            color: var(--color-gold);
          }

          .regulation-section {
            padding: 80px 0;
            background: var(--color-white);
          }
          @media (max-width: 768px) {
            .regulation-section {
              padding: 50px 0;
            }
          }
        `}} />

        {/* Hero Section */}
        <section
          className="hero fade-in"
          style={{
            background:
              "linear-gradient(rgba(10, 22, 40, 0.72), rgba(10, 22, 40, 0.85)), url('/assets/images/neuroptimal-equipment.jpg') center/cover no-repeat",
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="container">
            <h1>{t("science.heroTitle")}</h1>
            <p style={{ maxWidth: "680px", margin: "0 auto" }}>
              {t("science.heroDesc")}
            </p>
          </div>
        </section>

        {/* Regulation section */}
        <section className="regulation-section bg-white fade-in">
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
                {t("science.loopSubtitle")}
              </span>
              <h2>{t("science.loopTitle")}</h2>
              <p style={{ fontSize: "1.1rem", color: "var(--color-grey-text)", marginTop: "10px" }}>
                {t("science.loopDesc")}
              </p>
            </div>

            <EEGVisualizer />
          </div>
        </section>

        {/* Comment se déroule une séance */}
        <section className="section fade-in" style={{ background: "var(--color-navy)", color: "#fff", overflow: "hidden" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
              <div>
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
                  L'Expérience INFC
                </span>
                <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>Comment se déroule une séance ?</h2>
                <p style={{ opacity: 0.9, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Vous vous installez confortablement dans un fauteuil ergonomique. Deux capteurs EEG sont délicatement placés sur le cuir
                  chevelu — aucune douleur, aucune sensation. Vous lancez un film ou une playlist musicale de votre choix.
                </p>
                <p style={{ opacity: 0.9, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Pendant 33 minutes, le logiciel NeurOptimal® analyse votre activité cérébrale 256 fois par seconde. À chaque
                  micro-instabilité détectée, une interruption sonore imperceptible invite votre cerveau à se réorganiser de lui-même.
                </p>
                <p style={{ opacity: 0.9, lineHeight: 1.7, marginBottom: "2rem" }}>
                  Vous n'avez rien à faire. Pas d'effort conscient, pas de visualisation guidée. Votre cerveau travaille pour vous, à son
                  rythme, de manière organique.
                </p>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-gold)", fontFamily: "var(--font-heading)" }}>
                      33 min
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Durée d'une séance</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-gold)", fontFamily: "var(--font-heading)" }}>
                      0
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Effort conscient requis</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-gold)", fontFamily: "var(--font-heading)" }}>
                      256 Hz
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>Fréquence d'analyse</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <img
                  src="/assets/images/session-room.jpg"
                  alt="Salle de séance neurofeedback INFC"
                  style={{ width: "100%", height: "500px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section bg-creme fade-in">
          <div className="container">
            <div className="section-header">
              <h2>Des données, pas des promesses</h2>
              <p>Observations issues de millions d'heures d'entraînement à travers le monde.</p>
            </div>

            <div className="card-grid">
              <div className="card text-center">
                <h2 className="text-gold" style={{ fontSize: "3rem" }}>
                  91%
                </h2>
                <p>Rapportent une amélioration de la gestion du stress.</p>
              </div>
              <div className="card text-center">
                <h2 className="text-gold" style={{ fontSize: "3rem" }}>
                  85%
                </h2>
                <p>Observent une réduction significative de l'anxiété.</p>
              </div>
              <div className="card text-center">
                <h2 className="text-gold" style={{ fontSize: "3rem" }}>
                  83%
                </h2>
                <p>Constatent une meilleure capacité de concentration.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Pères Fondateurs */}
        <section className="section bg-white fade-in">
          <div className="container">
            <div className="section-header" style={{ marginBottom: "50px" }}>
              <span
                style={{
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                }}
              >
                Héritage Scientifique
              </span>
              <h2 style={{ marginTop: "10px" }}>Nos Pères Fondateurs</h2>
              <p>
                Le neurofeedback s'appuie sur plus de 50 ans de recherche en neurosciences. Voici les pionniers dont les travaux ont
                rendu cette technologie possible.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center", marginBottom: "50px" }}>
              <div
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-hover)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <img
                  src="/assets/images/founders-wall-closeup.jpg"
                  alt="Nos Pères Fondateurs — Valdeane Brown, Barry Sterman, Susan Brown, Lisa Feldman Barrett"
                  style={{ width: "100%", height: "420px", objectFit: "cover", display: "block" }}
                />
              </div>
              <div>
                <blockquote
                  style={{ borderLeft: "4px solid var(--color-gold)", paddingLeft: "20px", marginBottom: "2rem", borderRight: "none" }}
                >
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontStyle: "italic",
                      color: "var(--color-navy)",
                      lineHeight: 1.5,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    « Le cerveau sait ce qu'il fait. Nous n'avons pas besoin de le diriger, nous devons juste lui permettre de mieux se
                    percevoir. »
                  </p>
                  <footer style={{ color: "var(--color-gold)", fontWeight: 700, marginTop: "10px", background: "none", padding: 0 }}>
                    — Valdeane W. Brown, Inventeur du Neurofeedback Dynamique NeurOptimal®
                  </footer>
                </blockquote>
                <p style={{ lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  De <strong>Barry Sterman</strong>, pionnier de la recherche sur les rythmes SMR dans les années 1960, à{" "}
                  <strong>Valdeane et Susan Brown</strong>, créateurs du système NeurOptimal® qui a révolutionné l'approche du neurofeedback,
                  en passant par <strong>Lisa Feldman Barrett</strong> et ses travaux novateurs sur la construction des émotions — chaque
                  avancée scientifique a posé les fondations de notre méthode.
                </p>
                <p style={{ lineHeight: 1.7 }}>
                  Chez INFC, nous honorons cet héritage en restant fidèles à un principe fondamental :{" "}
                  <strong>le cerveau n'est jamais un problème à corriger, c'est une intelligence à accompagner.</strong>
                </p>
              </div>
            </div>

            <div
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-hover)",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <img
                src="/assets/images/founders-wall-full.jpg"
                alt="Mur complet des Pères Fondateurs du Neurofeedback à l'INFC"
                style={{ width: "100%", height: "400px", objectFit: "cover", display: "block" }}
              />
            </div>
            <p style={{ textAlign: "center", marginTop: "15px", fontSize: "0.9rem", color: "var(--color-grey-text)", fontStyle: "italic" }}>
              Le mur des Pères Fondateurs du neurofeedback, installé dans nos centres INFC au Maroc.
            </p>
          </div>
        </section>

        {/* Neuroplasticity Section */}
        <section className="section" style={{ background: "linear-gradient(135deg, #0A1628, #152238)", color: "#fff" }}>
          <div className="container">
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <span
                style={{
                  color: "var(--color-gold)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "1.5px",
                  display: "block",
                  marginBottom: "15px",
                }}
              >
                Le Principe Scientifique
              </span>
              <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>La Neuroplasticité : votre cerveau sait se transformer</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "2.5rem" }}>
                La neuroplasticité est la capacité du cerveau à se réorganiser en formant de nouvelles connexions neuronales tout au long de
                la vie. Ce n'est pas une promesse — c'est un fait biologique documenté par des milliers d'études.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "30px",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>🧬</div>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "10px" }}>Régénération Synaptique</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.92rem", lineHeight: "1.5" }}>
                  Votre cerveau crée de nouvelles voies neuronales à chaque séance, renforçant sa résilience naturelle.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>🔄</div>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "10px" }}>Auto-Organisation</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.92rem", lineHeight: "1.5" }}>
                  Aucune direction imposée. Le cerveau choisit lui-même la meilleure voie de régulation. C'est la philosophie
                  NeurOptimal®.
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>📈</div>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "10px" }}>Effet Cumulatif</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.92rem", lineHeight: "1.5" }}>
                  Les bienfaits se renforcent séance après séance. La régulation devient progressivement naturelle et durable.
                </p>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", maxWidth: "600px", margin: "0 auto", fontStyle: "italic" }}>
                Le neurofeedback NeurOptimal® ne traite aucune pathologie. Il entraîne le cerveau à mieux se percevoir, favorisant une
                régulation organique progressive.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-white fade-in">
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className="section-header">
              <h2>Questions Fréquentes</h2>
            </div>

            <div className="faq-container">
              {faqData.map((item, idx) => {
                const isActive = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`faq-item ${isActive ? "active" : ""}`}
                    onClick={() => toggleFaq(idx)}
                  >
                    <div className="faq-question">{item.question}</div>
                    <div className="faq-answer">{item.answer}</div>
                  </div>
                );
              })}
            </div>

            <div className="text-center" style={{ marginTop: "3rem" }}>
              <Link href={`/${locale}/contact`} className="btn btn-navy">
                {t("common.orient")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
