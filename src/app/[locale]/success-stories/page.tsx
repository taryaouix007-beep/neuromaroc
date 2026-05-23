"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Story {
  id: number;
  category: string;
  badge: string;
  avatar: string;
  name: string;
  role: string;
  quote: string;
  steps: string[];
  metrics: React.ReactNode;
  guide: React.ReactNode;
}

const storiesData: Story[] = [
  {
    id: 1,
    category: "parents",
    badge: "👶 Accompagnement Pédiatrique",
    avatar: "👩",
    name: "Sarah M.",
    role: "Mère de famille (Casablanca)",
    quote: "Après 6 mois de neurofeedback, les symptômes de TDAH de mon fils se sont spectaculairement améliorés. Son focus en classe et son comportement à la maison sont incomparables !",
    steps: [
      "Échange d'orientation & cartographie d'attention.",
      "6 séances initiales de régulation neuro-sensible (calmage).",
      "12 séances de consolidation + plan de nutrition cérébrale."
    ],
    metrics: (
      <>
        📊 Chiffres clés : <span style={{ color: "#10B981", fontWeight: 700 }}>-65%</span> de distractibilité en classe & endormissement en <span style={{ color: "#10B981", fontWeight: 700 }}>12 min</span> (au lieu de 1h30).
      </>
    ),
    guide: (
      <>
        📖 Guide Appliqué : <strong>Le Guide d'Accompagnement Neuro-Sensible INFC</strong> (gestion des écrans et routines).
      </>
    )
  },
  {
    id: 2,
    category: "performers",
    badge: "🚀 Optimisation Cognitive",
    avatar: "👨‍💼",
    name: "James T.",
    role: "Directeur Financier (Marrakech)",
    quote: "J'étais sceptique au départ, mais le neurofeedback a transformé ma gestion du stress et mes prises de décision. Je me sens plus lucide et maître de mes capacités.",
    steps: [
      "Bilan de stress aigu & mesure de surcharge mentale.",
      "8 séances intensives d'optimisation cognitive (bi-hebdomadaire).",
      "4 séances de stabilisation espacées sur 1 mois."
    ],
    metrics: (
      <>
        📊 Chiffres clés : <span style={{ color: "#10B981", fontWeight: 700 }}>-58%</span> de stress perçu & <span style={{ color: "#10B981", fontWeight: 700 }}>+45 min</span> de sommeil profond par nuit.
      </>
    ),
    guide: (
      <>
        📖 Protocole Appliqué : <strong>Focus Haute Performance INFC</strong> (micro-siestes tactiques).
      </>
    )
  },
  {
    id: 3,
    category: "veterans",
    badge: "🎖️ Régulation du Système Nerveux",
    avatar: "👴",
    name: "Michael R.",
    role: "Vétéran & Retraité (Tanger)",
    quote: "Pour la première fois depuis des années, je dors toute la nuit. Les cauchemars ont complètement disparu. Le neurofeedback m'a tout simplement rendu ma vie.",
    steps: [
      "Création d'un espace rassurant (à faible intensité lumineuse).",
      "10 séances axées sur l'apaisement du système sympathique.",
      "10 séances de consolidation de la résilience nerveuse."
    ],
    metrics: (
      <>
        📊 Chiffres clés : <span style={{ color: "#10B981", fontWeight: 700 }}>Suppression totale</span> des cauchemars nocturnes & <span style={{ color: "#10B981", fontWeight: 700 }}>-75%</span> d'hypervigilance.
      </>
    ),
    guide: (
      <>
        📖 Guide Appliqué : <strong>Plan d'Apaisement Autonome Post-Traumatique</strong>.
      </>
    )
  },
  {
    id: 4,
    category: "adults",
    badge: "🧠 Sérénité & Équilibre",
    avatar: "👩‍⚕️",
    name: "Leyla A.",
    role: "Architecte (Casablanca)",
    quote: "Le burn-out m'avait complètement vidée de mon énergie. Grâce aux séances de neurofeedback, j'ai retrouvé ma vitalité mentale et mon calme intérieur.",
    steps: [
      "Évaluation de la fatigue cognitive et du profil de surmenage.",
      "8 séances de régulation neuro-sensible axées sur les ondes Alpha.",
      "6 séances d'harmonisation de l'humeur."
    ],
    metrics: (
      <>
        📊 Chiffres clés : <span style={{ color: "#10B981", fontWeight: 700 }}>83%</span> de réduction de la charge mentale & disparition des crises de panique.
      </>
    ),
    guide: (
      <>
        📖 Protocole Appliqué : <strong>Protocole Reset Fatigue INFC</strong>.
      </>
    )
  },
  {
    id: 5,
    category: "parents",
    badge: "👶 Accompagnement Pédiatrique",
    avatar: "👦",
    name: "Youssef K. (10 ans)",
    role: "Élève (Kénitra)",
    quote: "Avant, l'école me faisait peur parce que je n'arrivais pas à rester assis. Maintenant, je lis des livres entiers et je me sens beaucoup plus tranquille.",
    steps: [
      "Bilan d'orientation et de concentration ludique.",
      "10 séances de neurofeedback dynamique NeurOptimal®.",
      "5 séances de stabilisation avant la rentrée scolaire."
    ],
    metrics: (
      <>
        📊 Chiffres clés : <span style={{ color: "#10B981", fontWeight: 700 }}>+50%</span> d'amélioration des notes & diminution de l'agitation motrice.
      </>
    ),
    guide: (
      <>
        📖 Guide Appliqué : <strong>Guide de l'Apprentissage Heureux INFC</strong>.
      </>
    )
  }
];

export default function SuccessStoriesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const getCount = (category: string) => {
    if (category === "all") return storiesData.length;
    return storiesData.filter((s) => s.category === category).length;
  };

  const filteredStories = activeFilter === "all"
    ? storiesData
    : storiesData.filter((s) => s.category === activeFilter);

  return (
    <>
      <Header />

      <main>
        <style dangerouslySetInnerHTML={{ __html: `
          .stories-layout {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 40px;
            padding: 60px 0;
            align-items: start;
          }

          @media (max-width: 992px) {
            .stories-layout {
              grid-template-columns: 1fr;
              gap: 30px;
            }
          }

          .filter-sidebar {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            padding: 30px;
            box-shadow: var(--shadow-soft);
            border: 1px solid rgba(10, 22, 40, 0.05);
            position: sticky;
            top: 100px;
            z-index: 10;
          }

          .sidebar-title {
            font-size: 1.2rem;
            color: var(--color-navy);
            font-weight: 700;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--color-creme);
          }

          .filter-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .filter-btn {
            background: none;
            border: none;
            text-align: left;
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--color-grey-text);
            cursor: pointer;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .filter-btn:hover {
            background: var(--color-creme);
            color: var(--color-navy);
          }

          .filter-btn.active {
            background: var(--color-navy);
            color: var(--color-white);
          }

          .filter-count {
            background: rgba(212, 175, 55, 0.15);
            color: var(--color-gold);
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            transition: all 0.25s ease;
          }

          .filter-btn.active .filter-count {
            background: var(--color-gold);
            color: var(--color-navy);
          }

          .stories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 30px;
          }

          .story-full-card {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            border: 1px solid rgba(10, 22, 40, 0.05);
            box-shadow: var(--shadow-soft);
            padding: 30px;
            transition: all 0.35s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .story-full-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--shadow-hover);
            border-color: var(--color-gold);
          }

          .card-category-badge {
            display: inline-block;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--color-gold);
            margin-bottom: 12px;
          }

          .card-title-row {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
          }

          .card-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-creme);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            border: 1px solid rgba(212, 175, 55, 0.15);
          }

          .card-meta h3 {
            font-size: 1.15rem;
            color: var(--color-navy);
            margin: 0;
            font-weight: 700;
          }

          .card-meta span {
            font-size: 0.85rem;
            color: var(--color-grey-text);
          }

          .card-quote {
            font-style: italic;
            color: var(--color-navy);
            font-size: 0.98rem;
            line-height: 1.6;
            margin-bottom: 20px;
            border-left: 3px solid var(--color-gold);
            padding-left: 15px;
          }

          .card-divider {
            border-top: 1px dashed rgba(10, 22, 40, 0.1);
            margin: 20px 0;
          }

          .card-section-title {
            font-family: var(--font-heading);
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--color-navy);
            margin-bottom: 10px;
            letter-spacing: 0.5px;
          }

          .card-steps {
            list-style: none;
            padding: 0;
            margin-bottom: 15px;
          }

          .card-steps li {
            font-size: 0.9rem;
            color: var(--color-grey-text);
            margin-bottom: 6px;
            padding-left: 20px;
            position: relative;
          }

          .card-steps li::before {
            content: '➔';
            position: absolute;
            left: 0;
            color: var(--color-gold);
            font-weight: 700;
          }

          .card-metrics {
            background: rgba(16, 185, 129, 0.06);
            border-left: 4px solid #10B981;
            padding: 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            color: var(--color-navy);
            font-weight: 600;
            margin-bottom: 15px;
          }

          .card-guide {
            font-size: 0.85rem;
            color: var(--color-grey-text);
            background: var(--color-creme);
            padding: 10px;
            border-radius: 4px;
            border: 1px solid rgba(10, 22, 40, 0.05);
          }

          .card-guide strong {
            color: var(--color-navy);
          }

          .fade-in {
            animation: fadeIn 0.4s ease forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />

        {/* Hero Section */}
        <section className="section bg-white" style={{ padding: "60px 0 40px", textAlign: "center" }}>
          <div className="container">
            <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1.5px", display: "block", marginBottom: "10px" }}>
              Histoires de Réussite Réelles
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-navy)" }}>
              Parcours de Transformation
            </h1>
            <p style={{ maxWidth: "700px", margin: "15px auto 0", fontSize: "1.1rem", color: "var(--color-grey-text)" }}>
              Découvrez en détail les étapes cliniques, les chiffres clés et les protocoles appliqués pour nos patients à Casablanca, Marrakech, Tanger et Kénitra.
            </p>
          </div>
        </section>

        {/* Stories Filter and List Layout */}
        <section className="section bg-creme" style={{ paddingTop: "20px" }}>
          <div className="container">
            <div className="stories-layout">
              {/* Left Sidebar Filters */}
              <aside className="filter-sidebar">
                <h2 className="sidebar-title">Profils Cliniques</h2>
                <div className="filter-options">
                  <button
                    className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveFilter("all")}
                  >
                    <span>Tous les récits</span>
                    <span className="filter-count">{getCount("all")}</span>
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "parents" ? "active" : ""}`}
                    onClick={() => setActiveFilter("parents")}
                  >
                    <span>Parents & TDA/H</span>
                    <span className="filter-count">{getCount("parents")}</span>
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "veterans" ? "active" : ""}`}
                    onClick={() => setActiveFilter("veterans")}
                  >
                    <span>Vétérans & Trauma</span>
                    <span className="filter-count">{getCount("veterans")}</span>
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "performers" ? "active" : ""}`}
                    onClick={() => setActiveFilter("performers")}
                  >
                    <span>Peak Performers</span>
                    <span className="filter-count">{getCount("performers")}</span>
                  </button>
                  <button
                    className={`filter-btn ${activeFilter === "adults" ? "active" : ""}`}
                    onClick={() => setActiveFilter("adults")}
                  >
                    <span>Adultes & Sérénité</span>
                    <span className="filter-count">{getCount("adults")}</span>
                  </button>
                </div>
              </aside>

              {/* Right Stories Grid */}
              <div className="stories-grid">
                {filteredStories.map((story) => (
                  <div key={story.id} className="story-full-card fade-in">
                    <div>
                      <span className="card-category-badge">{story.badge}</span>
                      <div className="card-title-row">
                        <div className="card-avatar">{story.avatar}</div>
                        <div className="card-meta">
                          <h3>{story.name}</h3>
                          <span>{story.role}</span>
                        </div>
                      </div>
                      <p className="card-quote">"{story.quote}"</p>

                      <div className="card-divider"></div>

                      <h4 className="card-section-title">👣 Le Processus & Les Étapes :</h4>
                      <ul className="card-steps">
                        {story.steps.map((stepText, idx) => (
                          <li key={idx}>
                            <strong>Étape {idx + 1} :</strong> {stepText}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="card-metrics">{story.metrics}</div>
                      <div className="card-guide">{story.guide}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
