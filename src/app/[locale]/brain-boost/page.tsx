"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrainBoostQuiz from "@/components/BrainBoostQuiz";
import Toast from "@/components/Toast";

// Reusable animated Counter component
function Counter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start: number | null = null;
    let animationId: number;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const current = Math.min(Math.floor((progress / duration) * target), target);
          setCount(current);

          if (current < target) {
            animationId = requestAnimationFrame(step);
          }
        };
        animationId = requestAnimationFrame(step);
        observer.disconnect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function BrainBoostPage() {
  const [leadEmail, setLeadEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  const handleLeadMagnet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeadEmail("");
        setToast({
          show: true,
          title: "📖 Guide envoyé !",
          message: "Le lien de téléchargement a été transmis à votre adresse email.",
        });
      } else {
        setToast({ show: true, title: "❌ Erreur", message: data.error });
      }
    } catch {
      setToast({ show: true, title: "❌ Erreur", message: "Impossible de joindre le serveur." });
    }
  };

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
        setToast({ show: true, title: "📬 Inscription réussie !", message: data.message });
      } else {
        setToast({ show: true, title: "❌ Erreur", message: data.error });
      }
    } catch {
      setToast({ show: true, title: "❌ Erreur", message: "Impossible de joindre le serveur." });
    }
  };

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="bb-hero fade-in">
          <div className="container">
            <h1>
              <span className="title-pack">Pack</span>
              <span className="title-brain">Brain</span>
              <span className="title-boost">Boost</span>
            </h1>
            <p className="subtitle">Préparation Mentale & Performance Cognitive pour les examens</p>

            <div className="bb-icons-grid">
              <div className="bb-icon-item">
                <div className="bb-icon-box">🎯</div>
                <div className="bb-icon-label">Concentration</div>
              </div>
              <div className="bb-icon-item">
                <div className="bb-icon-box">🧘</div>
                <div className="bb-icon-label">Gestion du stress</div>
              </div>
              <div className="bb-icon-item">
                <div className="bb-icon-box">🧠</div>
                <div className="bb-icon-label">Mémoire</div>
              </div>
              <div className="bb-icon-item">
                <div className="bb-icon-box">🛡️</div>
                <div className="bb-icon-label">Confiance mentale</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
              <a href="#lead-magnet-section" className="btn btn-gold" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
                Télécharger le Guide d'Accompagnement →
              </a>
              <a
                href="#quiz-section"
                className="btn"
                style={{
                  fontSize: "1.1rem",
                  padding: "1rem 2.5rem",
                  background: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                }}
              >
                Faire le test d'évaluation
              </a>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="stats-bar fade-in">
          <div className="stat-item">
            <div className="stat-num">
              <Counter target={3000} />+
            </div>
            <div className="stat-label">Familles accompagnées</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5/5</div>
            <div className="stat-label">
              <a
                href="https://maps.google.com/?q=International+Neurofeedback+Center+Casablanca"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-navy)", textDecoration: "underline" }}
              >
                Note Google avis
              </a>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-num">
              <Counter target={91} />%
            </div>
            <div className="stat-label">Amélioration du stress</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">
              <Counter target={83} />%
            </div>
            <div className="stat-label">Meilleure concentration</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">
              <Counter target={4} />
            </div>
            <div className="stat-label">Centres au Maroc</div>
          </div>
        </div>

        {/* LEAD MAGNET SECTION */}
        <section id="lead-magnet-section" className="section bg-white fade-in">
          <div className="container">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "3rem",
                background: "var(--color-creme)",
                borderRadius: "var(--radius-lg)",
                padding: "3rem",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
                <img
                  src="/assets/images/guide_neuro.png"
                  alt="Le Guide d'Accompagnement Neuro-Sensible"
                  style={{
                    maxWidth: "300px",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "0 15px 35px rgba(10,22,40,.2)",
                    margin: "0 auto",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ flex: 1.5, minWidth: "300px" }}>
                <div style={{ fontSize: "0.9rem", textTransform: "uppercase", color: "var(--color-gold)", fontWeight: 700, letterSpacing: "1px", marginBottom: "0.5rem" }}>
                  Téléchargement Libre
                </div>
                <h2 style={{ marginBottom: "1rem", fontSize: "2.2rem", color: "var(--color-navy)" }}>
                  Le Guide d'Accompagnement Neuro-Sensible des Examens
                </h2>
                <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem", color: "var(--color-grey-text)" }}>
                  Ne laissez pas le stress saboter des mois de révisions. Découvrez la méthode INFC pour réduire le bruit mental et aider
                  votre enfant à retrouver clarté et sérénité avant l'épreuve.
                </p>
                <ul className="pack-list" style={{ marginBottom: "2rem", fontSize: "1rem", color: "var(--color-navy)" }}>
                  <li>Comprendre la différence entre fatigue et surcharge cognitive</li>
                  <li>3 routines simples pour défragmenter le cerveau avant de dormir</li>
                  <li>Le protocole d'urgence en cas d'angoisse face à la feuille blanche</li>
                </ul>
                <form onSubmit={handleLeadMagnet} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    required
                    style={{
                      flex: 1,
                      minWidth: "250px",
                      padding: "1rem 1.5rem",
                      border: "1px solid rgba(10,22,40,.2)",
                      borderRadius: "var(--radius-xl)",
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                    }}
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-navy" style={{ fontSize: "1rem" }}>
                    Recevoir le guide PDF →
                  </button>
                </form>
                <p style={{ fontSize: "0.8rem", color: "var(--color-grey-text)", marginTop: "0.8rem" }}>
                  Vos données sont protégées. Aucun spam.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 SIGNALS SECTION */}
        <section className="section bg-white fade-in" style={{ borderTop: "1px solid rgba(10,22,40,.05)" }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2>Reconnaissez‑vous l'un de ces 5 signaux ?</h2>
              <p>
                Si votre enfant présente 2 signaux ou plus, son cerveau a probablement besoin d'un soutien pour retrouver son rythme
                naturel.
              </p>
            </div>
            <div className="signal-grid">
              <div className="signal-card">
                <h4>📖 Il relit la même page sans retenir</h4>
                <p>Le cerveau « lit » mécaniquement mais n'encode plus. C'est un problème d'attention saturée, pas de lecture.</p>
              </div>
              <div className="signal-card">
                <h4>😴 Il s'endort en révisant malgré 8 h de sommeil</h4>
                <p>C'est une fatigue neurologique : le cerveau, submergé, se met en « mode veille » pour se protéger.</p>
              </div>
              <div className="signal-card">
                <h4>😤 Il devient irritable sans raison apparente</h4>
                <p>
                  Crises de nerfs, pleurs soudains… Un système nerveux en alerte permanente, en mode « survie » et non « apprentissage ».
                </p>
              </div>
              <div className="signal-card">
                <h4>⏳ Il procrastine malgré l'urgence</h4>
                <p>Il SAIT qu'il doit réviser, il VEUT réviser, mais n'y arrive pas. Un mécanisme de protection d'un cerveau en fatigue cognitive.</p>
              </div>
              <div className="signal-card">
                <h4>🧩 Il oublie ce qu'il savait la veille</h4>
                <p>Le stress chronique libère du cortisol, qui interfère directement avec la consolidation des souvenirs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PACK DETAILS */}
        <section className="section bg-creme fade-in">
          <div className="container">
            <div className="pack-box">
              <h2>Le Pack Brain Boost™ INFC</h2>
              <p>
                Un entraînement cérébral structuré qui aide le cerveau de votre enfant à fonctionner dans son état optimal pendant la
                période la plus exigeante de l'année.
              </p>
              <ul className="pack-list">
                <li>Entretien d'orientation avec un praticien certifié NeurOptimal®</li>
                <li>
                  <strong>8 séances</strong> de neurofeedback calibrées sur la période pré‑examens
                </li>
                <li>Plan d'hygiène cérébrale personnalisé (sommeil, alimentation, routines)</li>
                <li>Suivi de progression avec points réguliers</li>
                <li>Séances de 33 minutes dans un environnement calme et premium</li>
                <li>Disponible à Casablanca, Marrakech, Tanger &amp; Kénitra</li>
              </ul>
              <div className="pack-price">À partir de 475 MAD / séance</div>
              <div className="pack-note" style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>
                Tarif indicatif · Un devis personnalisé est établi lors de l'échange d'orientation.
                <br />
                <br />
                <em>
                  Le programme Brain Boost™ est un entraînement neurocognitif. Il ne remplace pas un suivi médical ou psychologique lorsque
                  celui-ci est nécessaire.
                </em>
              </div>
              <a href="#quiz-section" className="btn btn-gold" style={{ width: "100%", padding: "1rem" }}>
                Faites le test de concentration →
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 1: 8 COMPÉTENCES */}
        <section className="section bg-white fade-in teasing-section">
          <div className="container">
            <div className="teasing-header">
              <h2>8 séances. 8 compétences. 0 hasard.</h2>
              <p>Le cerveau ne se régule pas par magie. Voici la structure de votre parcours :</p>
            </div>
            <div className="grid-8">
              <div className="comp-card">Focus 25®</div>
              <div className="comp-card">Visualisation Réussite®</div>
              <div className="comp-card">Ancrage Calme</div>
              <div className="comp-card">Défragmentation Nocturne</div>
              <div className="comp-card comp-locked">
                <span className="locked-text">Réservé aux participants</span>
              </div>
              <div className="comp-card comp-locked">
                <span className="locked-text">Réservé aux participants</span>
              </div>
              <div className="comp-card comp-locked">
                <span className="locked-text">Réservé aux participants</span>
              </div>
              <div className="comp-card comp-locked">
                <span className="locked-text">Réservé aux participants</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: RESET EXAMEN */}
        <section className="section bg-creme fade-in teasing-section">
          <div className="container">
            <div className="teasing-header">
              <h2>Aperçu du Reset Examen®</h2>
              <p>La méthode exacte enseignée à votre enfant face à la feuille blanche.</p>
            </div>
            <div className="reset-grid">
              <div className="reset-step">
                <div className="step-num">1</div>
                <div>
                  <strong>Calibration de l'état de base</strong>
                  <br />
                  <span style={{ color: "var(--color-grey-text)", fontSize: "0.9rem" }}>Diminuer le rythme cardiaque en 60 secondes.</span>
                </div>
              </div>
              <div className="reset-step">
                <div className="step-num">2</div>
                <div>
                  <strong>Protocole d'immersion</strong>
                  <br />
                  <span style={{ color: "var(--color-grey-text)", fontSize: "0.9rem" }}>
                    Isoler l'attention auditive et visuelle des distractions.
                  </span>
                </div>
              </div>
              <div className="reset-step reset-blurred">
                <div className="blur-badge">Réservé aux participants</div>
                <div className="blur-content" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className="step-num">3</div>
                  <div>
                    <strong>Activation de la mémoire de travail</strong>
                    <br />
                    <span style={{ color: "var(--color-grey-text)", fontSize: "0.9rem" }}>
                      Récupération rapide des informations stockées.
                    </span>
                  </div>
                </div>
              </div>
              <div className="reset-step reset-blurred">
                <div className="blur-badge">Réservé aux participants</div>
                <div className="blur-content" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className="step-num">4</div>
                  <div>
                    <strong>Séquençage de la réponse</strong>
                    <br />
                    <span style={{ color: "var(--color-grey-text)", fontSize: "0.9rem" }}>
                      Structuration de la pensée sous haute pression temporelle.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: DARK NAVY CARDS */}
        <section className="section bg-white fade-in teasing-section">
          <div className="container">
            <div className="teasing-header">
              <h2>À la fin des 8 séances, votre enfant saura…</h2>
              <p>Au-delà de la technologie, il repart avec une boîte à outils pour toute sa vie.</p>
            </div>
            <div className="grid-6">
              <div className="navy-card">
                <h4>Maîtriser le Focus 25®</h4>
                <p>Pour entrer en concentration profonde, sur commande, pendant les révisions intensives.</p>
              </div>
              <div className="navy-card">
                <h4>Déclencher le Protocole S.T.O.P.</h4>
                <p>Pour casser net une crise de panique ou d'angoisse la veille de l'épreuve.</p>
              </div>
              <div className="navy-card">
                <h4>Appliquer la Stratégie des 3 Temps</h4>
                <p>Pour gérer son temps et son énergie face à une épreuve complexe.</p>
              </div>
              <div className="navy-card">
                <h4>Utiliser la Visualisation Réussite®</h4>
                <p>Pour conditionner son cerveau au calme face au jury (oral ou écrit).</p>
              </div>
              <div className="navy-card">
                <h4>Activer l'Ancrage Calme</h4>
                <p>Pour retrouver instantanément son centre en plein milieu d'un examen stressant.</p>
              </div>
              <div className="navy-card">
                <h4>Créer sa Défragmentation Nocturne</h4>
                <p>Pour s'assurer un sommeil profond et réparateur, même les veilles de résultats.</p>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <a href="#quiz-section" className="btn btn-gold" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
                Faites le test pour démarrer →
              </a>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="section bg-white fade-in" style={{ borderTop: "1px solid rgba(10,22,40,.05)" }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2>Une approche qui change la vie</h2>
              <p>Noté 5/5 par plus de 120 clients vérifiés sur Google.</p>
            </div>
            <div className="card-grid">
              <div className="testimonial-card" style={{ borderTop: "4px solid var(--color-gold)" }}>
                <div style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--color-gold)", fontWeight: "bold", marginBottom: "1rem", letterSpacing: "1px" }}>
                  Témoignage Parent
                </div>
                <p>
                  « Vous avez aidé ma fille à s'améliorer dans un temps record. Tout le monde a senti ce changement — l'école, notre
                  entourage. Vous avez réussi à rendre ma fille plus confiante et plus heureuse face à ses études. »
                </p>
                <div className="author">— Khadija C. ⭐⭐⭐⭐⭐</div>
              </div>
              <div className="testimonial-card" style={{ borderTop: "4px solid var(--color-gold)" }}>
                <div style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--color-gold)", fontWeight: "bold", marginBottom: "1rem", letterSpacing: "1px" }}>
                  Ressenti Étudiant
                </div>
                <p>
                  « Pendant les révisions, je faisais des nuits blanches et j'oubliais tout le lendemain à cause du stress. Grâce au Pack
                  Brain Boost, j'ai retrouvé le sommeil et je suis arrivé serein le jour de l'examen. J'ai eu ma mention. »
                </p>
                <div className="author">— Youssef M., 18 ans ⭐⭐⭐⭐⭐</div>
              </div>
              <div className="testimonial-card" style={{ borderTop: "4px solid var(--color-gold)" }}>
                <div style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "var(--color-gold)", fontWeight: "bold", marginBottom: "1rem", letterSpacing: "1px" }}>
                  L'Avant / Après
                </div>
                <p>
                  <strong>Avant :</strong> Crises d'angoisse la veille des contrôles, procrastination, fatigue extrême.
                  <br />
                  <br />
                  <strong>Après 8 séances :</strong> Une capacité de concentration impressionnante, un comportement apaisé et une confiance
                  retrouvée. Elle aborde la feuille blanche sans peur.
                </p>
                <div className="author">— Suivi Clinique INFC</div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="section bg-creme fade-in">
          <div className="container" style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: "2rem" }}>Utilisé par les meilleurs au monde</h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
              <div className="stat-item">
                <img
                  src="https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=150&q=80"
                  alt="NASA"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem", border: "3px solid var(--color-gold)" }}
                />
                <div className="stat-label">NASA — astronautes</div>
              </div>
              <div className="stat-item">
                <img
                  src="https://images.unsplash.com/photo-1461896836934-ffe607fa8211?auto=format&fit=crop&w=150&q=80"
                  alt="Athlètes"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem", border: "3px solid var(--color-gold)" }}
                />
                <div className="stat-label">Athlètes olympiques</div>
              </div>
              <div className="stat-item">
                <img
                  src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=150&q=80"
                  alt="Musiciens"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem", border: "3px solid var(--color-gold)" }}
                />
                <div className="stat-label">Musiciens professionnels</div>
              </div>
              <div className="stat-item">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e18690c5e53b?auto=format&fit=crop&w=150&q=80"
                  alt="Chirurgiens"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 1rem", border: "3px solid var(--color-gold)" }}
                />
                <div className="stat-label">Chirurgiens — précision</div>
              </div>
            </div>
          </div>
        </section>

        {/* QUIZ COMPONENT */}
        <BrainBoostQuiz />

        {/* FINAL CTA */}
        <section className="section" style={{ background: "var(--color-navy)", color: "#fff", textAlign: "center", padding: "4rem 0" }}>
          <div className="container">
            {/* OFFRE DÉCOUVERTE */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "var(--radius-lg)",
                padding: "2.5rem",
                maxWidth: "600px",
                margin: "0 auto 4rem",
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(212,175,55,0.15)",
                  color: "var(--color-gold)",
                  padding: "0.4rem 1rem",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "1.5rem",
                }}
              >
                Séance Découverte
              </div>
              <h3 style={{ color: "#fff", fontSize: "1.8rem", marginBottom: "1rem" }}>Prêt à voir la différence par vous-même ?</h3>
              <p style={{ opacity: 0.9, marginBottom: "2rem" }}>
                Faites un premier pas concret vers la régulation neuro-sensible de votre enfant avec cette offre exclusive.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                  background: "rgba(10,22,40,0.5)",
                  padding: "1.5rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--color-gold)", lineHeight: 1 }}>-50%</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>1ère Consultation : 300 DH</div>
                  <div style={{ fontSize: "0.9rem", textDecoration: "line-through", opacity: 0.6 }}>au lieu de 600 DH</div>
                </div>
              </div>
              <a
                href="https://wa.me/212622606009?text=Bonjour%2C%20je%20souhaite%20r%C3%A9server%20une%20s%C3%A9ance%20d%C3%A9couverte%20%C3%A0%20-50%25."
                target="_blank"
                className="btn btn-gold"
                rel="noreferrer"
                style={{ width: "100%", fontSize: "1.1rem", padding: "1.2rem" }}
              >
                Réserver ma séance découverte via WhatsApp →
              </a>
            </div>

            <h2 style={{ color: "var(--color-gold)", marginBottom: "1rem" }}>Vous préférez vous informer avant d'agir ?</h2>
            <p style={{ maxWidth: "500px", margin: "0 auto 2rem", opacity: 0.85 }}>
              Parce que chaque cerveau est unique, l'intelligence s'accompagne à son rythme. Recevez nos ressources exclusives et décidez
              quand le moment est venu.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: "400px", margin: "0 auto" }}>
              <a href="#lead-magnet-section" className="btn btn-gold" style={{ width: "100%", textAlign: "center" }}>
                📖 Obtenir le Guide d'Accompagnement
              </a>
              <a
                href="https://wa.me/212622606009?text=Bonjour%2C%20j%27aimerais%20recevoir%20plus%20d%27informations%20sur%20votre%20approche%20pour%20les%20examens."
                target="_blank"
                className="btn"
                rel="noreferrer"
                style={{ width: "100%", textAlign: "center", background: "transparent", border: "2px solid #fff", color: "#fff" }}
              >
                💬 Discuter discrètement sur WhatsApp
              </a>
              <a
                href="tel:0522991783"
                className="btn"
                style={{ width: "100%", textAlign: "center", background: "transparent", color: "rgba(255,255,255,0.7)", textDecoration: "underline", fontSize: "0.9rem", padding: 0 }}
              >
                Ou appelez directement un praticien : 05 22 99 17 83
              </a>
            </div>
            <p style={{ marginTop: "2rem", fontSize: ".85rem", opacity: 0.6 }}>
              INFC — International Neurofeedback Center · Dr. Chadia Chakib, Fondatrice
              <br />
              Casablanca · Marrakech · Tanger · Kénitra ·{" "}
              <a href="https://neuromaroc.com" style={{ color: "var(--color-gold)" }}>
                neuromaroc.com
              </a>
            </p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          className="section bg-white"
          style={{
            padding: "60px 0",
            borderTop: "1px solid rgba(10, 22, 40, 0.05)",
            borderBottom: "1px solid rgba(10, 22, 40, 0.05)",
            backgroundColor: "var(--color-creme) !important",
          }}
        >
          <div className="container" style={{ maxWidth: "800px", textAlign: "center" }}>
            <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1.5px", display: "block", marginBottom: "10px" }}>
              Email Marketing & Conseils
            </span>
            <h2 style={{ color: "var(--color-navy)", fontSize: "2rem", marginBottom: "15px" }}>
              Abonnez-vous à la Lettre Neuro-Sensible
            </h2>
            <p style={{ color: "var(--color-grey-text)", fontSize: "1rem", marginBottom: "25px", maxWidth: "600px", margin: "0 auto" }}>
              Recevez chaque semaine des routines exclusives pour la concentration de votre enfant, des études de cas cliniques et les
              réponses de nos experts à la communauté.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: "flex", gap: "10px", maxWidth: "550px", margin: "0 auto", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="Votre adresse email principale"
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
                  background: "#fff",
                }}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-navy" style={{ fontSize: "0.95rem", borderRadius: "50px", padding: "12px 30px" }}>
                Rejoindre la liste ➔
              </button>
            </form>
            <p style={{ fontSize: "0.8rem", color: "var(--color-grey-text)", marginTop: "12px" }}>
              🔒 Vos données restent confidentielles. Désinscription en 1 clic.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <Toast show={toast.show} title={toast.title} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}
