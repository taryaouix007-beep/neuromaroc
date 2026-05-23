"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RadarWidget from "@/components/RadarWidget";
import Toast from "@/components/Toast";

export default function ProgrammesPage() {
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
        {/* HERO */}
        <section className="hero-section">
          <div className="container">
            <h1>Des Solutions Ciblées & Scientifiques</h1>
            <p>Une régulation du système nerveux calibrée pour chaque parcours de vie.</p>
          </div>
        </section>

        {/* PERSONA TARGETED PROGRAMS */}
        <section className="section bg-creme">
          <div className="container">
            <div className="section-header">
              <h2>Programmes Neuro-Sensibles Personnalisés</h2>
              <p>Découvrez comment l'entraînement cérébral répond aux besoins neurologiques précis de chaque profil.</p>
            </div>

            {/* Interactive Radar Dashboard */}
            <RadarWidget />

            <div className="persona-container">
              {/* 1. For Parents */}
              <div className="persona-row" id="persona-parents">
                <div
                  className="persona-visual has-bg"
                  style={{
                    backgroundImage: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65)), url('/assets/images/program-parents.png')",
                  }}
                >
                  <div className="visual-box">
                    <div className="visual-title">Brain Training for Kids</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">👨‍👩‍👧 Accompagnement Pédiatrique</div>
                  <h2>Pour les Parents</h2>
                  <p>
                    Votre enfant fait face à des défis d'attention (TDA/H), d'anxiété scolaire ou d'autisme ? Vous avez essayé les
                    solutions traditionnelles et cherchez une alternative naturelle. Le neurofeedback NeurOptimal® entraîne doucement le
                    cerveau à s'auto-réguler, s'attaquant à la cause profonde de la dysrégulation cérébrale.
                  </p>

                  <div className="persona-stat">
                    📈 Impact clinique constaté : <span>85%</span> d'amélioration significative des comportements et de l'attention chez
                    l'enfant en milieu scolaire.
                  </div>

                  <ul className="persona-bullets">
                    <li>Sans aucun effet secondaire — entraînement 100% naturel.</li>
                    <li>Amélioration prouvée de la concentration, de la mémorisation et de la régulation émotionnelle.</li>
                    <li>Résultats durables et autonomie renforcée au quotidien.</li>
                  </ul>

                  <div className="multi-cta">
                    <a href="/assets/pdfs/guide_neuro_sensible.pdf" target="_blank" className="btn btn-gold">
                      📖 Télécharger le Guide Parents
                    </a>
                    <Link href="/contact" className="btn btn-report">
                      📞 Échange d'Orientation Personnalisé
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. Veterans & Trauma Survivors */}
              <div className="persona-row reverse" id="persona-trauma">
                <div
                  className="persona-visual has-bg"
                  style={{
                    backgroundImage: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65)), url('/assets/images/program-trauma.png')",
                  }}
                >
                  <div className="visual-box">
                    <div className="visual-title">Trauma Recovery</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">🎖️ Régulation du Système Nerveux</div>
                  <h2>Vétérans & Rescapés de Trauma</h2>
                  <p>
                    Les chocs émotionnels répétés, le stress post-traumatique (ESPT / PTSD) et les traumatismes crâniens (TBI) maintiennent
                    votre système nerveux en état d'alerte permanent, provoquant insomnies et hypervigilance. Le neurofeedback ré-entraîne
                    votre cerveau à sortir du mode "survie" pour retrouver calme, contrôle et résilience.
                  </p>

                  <div className="persona-stat">
                    📈 Impact clinique constaté : <span>91%</span> des personnes accompagnées rapportent une baisse majeure des symptômes
                    d'hypervigilance et de stress.
                  </div>

                  <ul className="persona-bullets">
                    <li>Diminution significative des cauchemars et apaisement de l'hypervigilance.</li>
                    <li>Restauration naturelle d'un sommeil profond et récupérateur.</li>
                    <li>Réappropriation du contrôle émotionnel et paix intérieure retrouvée.</li>
                  </ul>

                  <div className="multi-cta">
                    <a href="/assets/pdfs/rapport_creatives_ads.pdf" target="_blank" className="btn btn-gold">
                      📊 Rapport Clinique Trauma
                    </a>
                    <Link href="/contact" className="btn btn-report">
                      📞 Consultation d'orientation
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Peak Performers */}
              <div className="persona-row" id="persona-performers">
                <div
                  className="persona-visual has-bg"
                  style={{
                    backgroundImage: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65)), url('/assets/images/program-performers.png')",
                  }}
                >
                  <div className="visual-box">
                    <div className="visual-title">Peak Performance</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">🚀 Optimisation Cognitive</div>
                  <h2>Peak Performers</h2>
                  <p>
                    Que vous soyez CEO, entrepreneur de haut niveau ou athlète, votre quotidien requiert une clarté mentale chirurgicale. Le
                    neurofeedback est l'outil d'optimisation cérébrale ultime — le même que celui utilisé par les forces spéciales et les
                    sportifs olympiques pour acquérir un avantage compétitif décisif.
                  </p>

                  <div className="persona-stat">
                    📈 Impact clinique constaté : <span>+45%</span> de durée de focus sans signe de fatigue ou de baisse de performance
                    cognitive.
                  </div>

                  <ul className="persona-bullets">
                    <li>Focus ultra-précis et clarté mentale absolue sous forte pression.</li>
                    <li>Amélioration de la résilience nerveuse et gestion optimale du stress.</li>
                    <li>Prise de décision stratégique plus rapide et efficace.</li>
                  </ul>

                  <div className="multi-cta">
                    <Link href="/contact" className="btn btn-gold">
                      📊 Planifier un Bilan Performance
                    </Link>
                    <Link href="/neurofeedback" className="btn btn-report">
                      🔬 Comprendre la science
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. For Adults */}
              <div className="persona-row reverse" id="persona-adults">
                <div
                  className="persona-visual has-bg"
                  style={{
                    backgroundImage: "linear-gradient(rgba(10, 22, 40, 0.25), rgba(10, 22, 40, 0.65)), url('/assets/images/program-adults.png')",
                  }}
                >
                  <div className="visual-box">
                    <div className="visual-title">Emotional Wellness</div>
                  </div>
                </div>
                <div className="persona-content">
                  <div className="persona-badge">🧠 Sérénité & Équilibre</div>
                  <h2>Pour les Adultes</h2>
                  <p>
                    Vous vous sentez coincé dans un cycle infini d'anxiété chronique, de déprime, ou de fatigue nerveuse liée au burn-out ?
                    Le neurofeedback offre une méthode douce pour rompre ce cercle vicieux en aidant votre système nerveux à retrouver son
                    équilibre et sa paix interne naturelle.
                  </p>

                  <div className="persona-stat">
                    📈 Impact clinique constaté : <span>83%</span> de réduction des crises d'angoisse et de la charge mentale après 8
                    séances.
                  </div>

                  <ul className="persona-bullets">
                    <li>Libération progressive de l'anxiété latente et des attaques de panique.</li>
                    <li>Réduction sécurisée et naturelle de la dépendance à la fatigue mentale.</li>
                    <li>Qualité de sommeil restaurée et meilleure vitalité nerveuse.</li>
                  </ul>

                  <div className="multi-cta">
                    <Link href="/brain-boost#quiz-section" className="btn btn-gold">
                      📝 Faire le Test de Fatigue Cognitive
                    </Link>
                    <Link href="/contact" className="btn btn-report">
                      📞 Parler à un praticien
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
              <h2>Histoires de Réussite Réelles</h2>
              <p>Découvrez les parcours précis, les chiffres cliniques et les étapes franchies par nos clients.</p>
            </div>

            <div className="stories-grid">
              {/* Story 1: Sarah M. */}
              <div className="story-card">
                <div className="story-header">
                  <div className="story-avatar">👩</div>
                  <div className="story-meta">
                    <h3>Sarah M.</h3>
                    <span>Mère de famille (Casablanca)</span>
                  </div>
                </div>
                <p className="story-quote">
                  "Après 6 mois de neurofeedback, les symptômes de TDAH de mon fils se sont spectaculairement améliorés. Son focus en classe
                  et son comportement à la maison sont incomparables !"
                </p>

                <div className="story-details">
                  <div className="detail-title">👣 Le Processus & Les Étapes :</div>
                  <ul className="story-steps">
                    <li>
                      <strong>Étape 1 :</strong> Échange d'orientation & cartographie d'attention.
                    </li>
                    <li>
                      <strong>Étape 2 :</strong> 6 séances initiales de régulation neuro-sensible (calmage).
                    </li>
                    <li>
                      <strong>Étape 3 :</strong> 12 séances de consolidation + plan de nutrition cérébrale.
                    </li>
                  </ul>
                  <div className="detail-title">📚 Guide Appliqué :</div>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-grey-text)", marginBottom: "15px" }}>
                    <em>Le Guide d'Accompagnement Neuro-Sensible INFC</em> (routines et gestion de l'écran).
                  </p>
                  <div className="story-metrics">
                    📊 Chiffres : <span>-65%</span> de distractibilité en classe et endormissement en <span>12 min</span> (au lieu de 1h30).
                  </div>
                </div>
              </div>

              {/* Story 2: James T. */}
              <div className="story-card">
                <div className="story-header">
                  <div className="story-avatar">👨‍💼</div>
                  <div className="story-meta">
                    <h3>James T.</h3>
                    <span>Directeur Financier (Marrakech)</span>
                  </div>
                </div>
                <p className="story-quote">
                  "J'étais sceptique au départ, mais le neurofeedback a transformé ma gestion du stress et mes prises de décision. Je me
                  sens plus lucide et maître de mes capacités."
                </p>

                <div className="story-details">
                  <div className="detail-title">👣 Le Processus & Les Étapes :</div>
                  <ul className="story-steps">
                    <li>
                      <strong>Étape 1 :</strong> Bilan de stress aigu & mesure de surcharge mentale.
                    </li>
                    <li>
                      <strong>Étape 2 :</strong> 8 séances intensives d'optimisation cognitive (bi-hebdomadaire).
                    </li>
                    <li>
                      <strong>Étape 3 :</strong> 4 séances de stabilisation espacées sur 1 mois.
                    </li>
                  </ul>
                  <div className="detail-title">📚 Guide Appliqué :</div>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-grey-text)", marginBottom: "15px" }}>
                    <em>Protocole de Focus Haute Performance INFC</em> (micro-siestes tactiques).
                  </p>
                  <div className="story-metrics">
                    📊 Chiffres : <span>-58%</span> de niveau de stress perçu & <span>+45 min</span> de sommeil profond par nuit.
                  </div>
                </div>
              </div>

              {/* Story 3: Michael R. */}
              <div className="story-card">
                <div className="story-header">
                  <div className="story-avatar">👴</div>
                  <div className="story-meta">
                    <h3>Michael R.</h3>
                    <span>Vétéran & Retraité (Tanger)</span>
                  </div>
                </div>
                <p className="story-quote">
                  "Pour la première fois depuis des années, je dors toute la nuit. Les cauchemars ont complètement disparu. Le
                  neurofeedback m'a tout simplement rendu ma vie."
                </p>

                <div className="story-details">
                  <div className="detail-title">👣 Le Processus & Les Étapes :</div>
                  <ul className="story-steps">
                    <li>
                      <strong>Étape 1 :</strong> Création d'un espace rassurant (à faible intensité lumineuse).
                    </li>
                    <li>
                      <strong>Étape 2 :</strong> 10 séances axées sur l'apaisement du système sympathique.
                    </li>
                    <li>
                      <strong>Étape 3 :</strong> 10 séances de consolidation de la résilience nerveuse.
                    </li>
                  </ul>
                  <div className="detail-title">📚 Guide Appliqué :</div>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-grey-text)", marginBottom: "15px" }}>
                    <em>Plan d'Apaisement Autonome Post-Traumatique</em>.
                  </p>
                  <div className="story-metrics">
                    📊 Chiffres : Suppression totale des cauchemars nocturnes & <span>-75%</span> d'hypervigilance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEDICAL PRO SECTION */}
        <section className="medical-section">
          <div className="container">
            <div className="section-header">
              <h2 style={{ color: "#fff" }}>Espace Professionnels de Santé & Corps Médical</h2>
              <p style={{ color: "rgba(255,255,255,0.8)" }}>
                Les preuves cliniques, publications scientifiques et méta-analyses validant l'approche de régulation neuro-sensible.
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
                    🧬 Accès Privé - Documentation Clinique & Échanges
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6", marginBottom: "20px", fontSize: "1rem" }}>
                    Vous êtes clinicien, médecin ou professionnel de la santé ? Accédez à notre base de données scientifique complète,
                    recevez les dossiers cliniques de nos patients suivis au Maroc et planifiez une rencontre d'information scientifique
                    avec nos praticiens certifiés.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                    <li style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>✔</span> Bibliographie médicale complète (plus de
                      150 études référencées).
                    </li>
                    <li style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>✔</span> Invitation exclusive à nos tables rondes et
                      présentations cliniques régulières.
                    </li>
                    <li style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>✔</span> Protocoles d'adressage direct pour vos
                      patients complexes.
                    </li>
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
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            Nom & Prénom
                          </label>
                          <input
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
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            Spécialité
                          </label>
                          <select
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
                            <option value="pédiatre" style={{ color: "#000" }}>
                              Pédiatre
                            </option>
                            <option value="psychiatre" style={{ color: "#000" }}>
                              Psychiatre
                            </option>
                            <option value="neurologue" style={{ color: "#000" }}>
                              Neurologue
                            </option>
                            <option value="généraliste" style={{ color: "#000" }}>
                              Généraliste
                            </option>
                            <option value="psychologue" style={{ color: "#000" }}>
                              Psychologue
                            </option>
                            <option value="autre" style={{ color: "#000" }}>
                              Autre Spécialité
                            </option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            Email Professionnel
                          </label>
                          <input
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
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "5px" }}>
                            Téléphone / WhatsApp
                          </label>
                          <input
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
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>
                          Votre Objectif principal
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <label
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
                              name="med_objective"
                              value="doc"
                              checked={medicalForm.objective === "doc"}
                              onChange={() => setMedicalForm({ ...medicalForm, objective: "doc" })}
                              style={{ accentColor: "var(--color-gold)" }}
                            />
                            Recevoir la bibliographie scientifique & rapports cliniques (PDF)
                          </label>
                          <label
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
                              name="med_objective"
                              value="meeting"
                              checked={medicalForm.objective === "meeting"}
                              onChange={() => setMedicalForm({ ...medicalForm, objective: "meeting" })}
                              style={{ accentColor: "var(--color-gold)" }}
                            />
                            Planifier une présentation clinique de 15 min (Présentiel ou Visioconférence)
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-gold" style={{ width: "100%", fontWeight: 700 }}>
                        Accéder aux documents & Planifier ➔
                      </button>
                    </form>
                  ) : (
                    <div style={{ color: "#10B981", fontWeight: 700, textAlign: "center", fontSize: "1.1rem" }}>
                      ✓ Votre demande a été enregistrée avec succès. Nos équipes vous contacteront sous 24h avec la documentation complète.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="medical-grid">
              {/* Report 1 */}
              <div className="medical-card">
                <h3>Pédiatrie & TDA/H</h3>
                <p>
                  Méta-analyse clinique démontrant la réduction durable de l'inattention et de l'hyperactivité motrice chez l'enfant par
                  l'entraînement en neurofeedback par rapport aux approches pharmacologiques conventionnelles.
                </p>
                <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7901853/" target="_blank" className="medical-link" rel="noreferrer">
                  📄 Lire l'étude clinique ➔
                </a>
              </div>

              {/* Report 2 */}
              <div className="medical-card">
                <h3>Traumatismes Cérébraux (TBI) & ESPT</h3>
                <p>
                  Étude clinique publiée démontrant une amélioration majeure de l'endormissement, de la gestion de la douleur et de
                  l'atténuation des cauchemars chez les vétérans souffrant d'ESPT et de lésions crâniennes légères.
                </p>
                <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7901853/" target="_blank" className="medical-link" rel="noreferrer">
                  📄 Consulter l'article de recherche ➔
                </a>
              </div>

              {/* Report 3 */}
              <div className="medical-card">
                <h3>Neuroplasticité & Sommeil Profond</h3>
                <p>
                  Dossier scientifique explicatif sur la façon dont les micro-interruptions du signal NeurOptimal® stimulent la
                  neuroplasticité intrinsèque du cerveau en favorisant les ondes delta et thêta indispensables au repos régulateur.
                </p>
                <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7901853/" target="_blank" className="medical-link" rel="noreferrer">
                  📄 Télécharger le rapport scientifique ➔
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Toast show={toast.show} title={toast.title} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}
