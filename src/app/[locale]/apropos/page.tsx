import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        {/* CSS rules specific to founder section and timeline layout */}
        <style dangerouslySetInnerHTML={{ __html: `
          .founder-section {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 60px;
            align-items: start;
          }
          @media(max-width: 992px) {
            .founder-section {
              grid-template-columns: 1fr;
              gap: 40px;
            }
          }
          
          .founder-portrait-container {
            position: relative;
            background: linear-gradient(135deg, var(--color-navy), var(--color-navy-light));
            border-radius: var(--radius-lg);
            padding: 20px;
            box-shadow: var(--shadow-hover);
            border: 1px solid rgba(212, 175, 55, 0.2);
            overflow: visible;
          }
          .founder-portrait-graphic {
            width: 100%;
            height: 480px;
            border-radius: var(--radius-md);
            background: rgba(255,255,255,0.03);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          .floating-badge {
            position: absolute;
            background: var(--color-white);
            color: var(--color-navy);
            padding: 10px 18px;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.82rem;
            box-shadow: 0 10px 25px rgba(10, 22, 40, 0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid rgba(212, 175, 55, 0.25);
            font-family: var(--font-heading);
            transition: all 0.3s ease;
            z-index: 10;
          }
          .floating-badge:hover {
            transform: scale(1.05) translateY(-3px);
            box-shadow: 0 12px 30px rgba(212, 175, 55, 0.25);
            background: var(--color-creme);
          }
          .badge-1 { top: 12%; left: -25px; }
          .badge-2 { bottom: 25%; right: -20px; }
          .badge-3 { bottom: 8%; left: 10%; }
          
          @media(max-width: 576px) {
            .badge-1 { left: 10px; top: 5%; }
            .badge-2 { right: 10px; bottom: 15%; }
            .badge-3 { left: 10px; bottom: 5%; }
          }

          .badge-icon {
            font-size: 1.1rem;
          }

          .timeline {
            position: relative;
            margin-top: 30px;
            padding-left: 30px;
            border-left: 2px dashed rgba(212, 175, 55, 0.3);
          }
          .timeline-item {
            position: relative;
            margin-bottom: 30px;
          }
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -39px;
            top: 4px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--color-navy);
            border: 3px solid var(--color-gold);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
            transition: all 0.3s ease;
          }
          .timeline-item:hover::before {
            background: var(--color-gold);
            transform: scale(1.2);
          }
          .timeline-date {
            font-family: var(--font-heading);
            font-weight: 700;
            color: var(--color-gold);
            font-size: 0.95rem;
            margin-bottom: 4px;
          }
          .timeline-title {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1.15rem;
            color: var(--color-navy);
            margin-bottom: 8px;
          }
          .timeline-text {
            font-size: 0.95rem;
            color: var(--color-grey-text);
            line-height: 1.5;
            margin: 0;
          }
          
          .quote {
            font-size: 1.4rem;
            font-family: var(--font-heading);
            color: var(--color-navy);
            border-left: 4px solid var(--color-gold);
            padding-left: 20px;
            margin-bottom: 2.5rem;
            line-height: 1.45;
            font-style: italic;
          }
        `}} />

        <section className="hero fade-in" style={{ padding: "80px 0" }}>
          <div className="container">
            <h1>Notre Vision</h1>
            <p>Repenser l'accompagnement neuro-cognitif au Maroc.</p>
          </div>
        </section>

        <section className="section bg-white fade-in">
          <div className="container">
            <div className="founder-section">
              {/* Left Column: Premium Graphic Frame & Floating Badges */}
              <div className="founder-portrait-container">
                <div className="floating-badge badge-1">
                  <span className="badge-icon">🎓</span>
                  <span>Neurologue Praticienne</span>
                </div>
                <div className="floating-badge badge-2">
                  <span className="badge-icon">🎖️</span>
                  <span>Certifiée NeurOptimal®</span>
                </div>
                <div className="floating-badge badge-3">
                  <span className="badge-icon">🇲🇦</span>
                  <span>Pionnière au Maroc</span>
                </div>

                <div className="founder-portrait-graphic" style={{ overflow: "hidden" }}>
                  <img
                    src="/assets/images/founders-wall-corridor.jpg"
                    alt="Le mur des Pères Fondateurs du neurofeedback dans les centres INFC"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-md)" }}
                  />
                </div>
              </div>

              {/* Right Column: Timeline & Vision Statement */}
              <div className="founder-content">
                <div className="quote">
                  "Nous n'accompagnons pas seulement des cerveaux, nous accompagnons des êtres humains vers leur propre excellence organique."
                </div>
                <h2 style={{ marginBottom: "0.5rem", color: "var(--color-navy)" }}>Dr. Chadia Chakib</h2>
                <p
                  style={{
                    color: "var(--color-gold)",
                    fontWeight: 700,
                    marginBottom: "1.5rem",
                    fontFamily: "var(--font-heading)",
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    letterSpacing: "1px",
                  }}
                >
                  Fondatrice de l'International Neurofeedback Center
                </p>

                <p style={{ marginBottom: "2rem", lineHeight: 1.6 }}>
                  L'INFC n'est pas une clinique classique. C'est un espace de régulation neuro-sensible où le cerveau est considéré
                  comme une intelligence à accompagner — jamais comme un problème à corriger.
                </p>

                {/* Timeline of Achievements */}
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-date">2010 — Spécialisation Médicale</div>
                    <div className="timeline-title">Parcours en Neurologie</div>
                    <p className="timeline-text">
                      Recherches cliniques approfondies sur la neuroplasticité et les mécanismes d'autorégulation cérébrale.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">2016 — Certification Internationale</div>
                    <div className="timeline-title">NeurOptimal® au Canada</div>
                    <p className="timeline-text">
                      Formation et certification avancée auprès de Zengar Institute pour introduire cette technologie de pointe au
                      Maroc.
                    </p>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">2018 — Fondation</div>
                    <div className="timeline-title">Lancement d'INFC Maroc</div>
                    <p className="timeline-text">
                      Ouverture du premier centre pilote haut de gamme à Casablanca pour démocratiser l'accompagnement neuro-sensible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Espaces Section */}
        <section className="section bg-white fade-in" style={{ borderTop: "1px solid rgba(10, 22, 40, 0.05)" }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: "40px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1.5px" }}>
                Nos Espaces
              </span>
              <h2 style={{ marginTop: "10px" }}>Un environnement conçu pour votre bien-être</h2>
              <p>Chaque détail de nos centres a été pensé pour créer un cadre propice à la régulation neuro-sensible.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              <div
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-hover)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <img
                  src="/assets/images/session-room.jpg"
                  alt="Salle de séance de neurofeedback INFC"
                  style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "20px", background: "#fff" }}>
                  <h3 style={{ color: "var(--color-navy)", fontSize: "1.1rem", marginBottom: "5px" }}>Salle de Séance</h3>
                  <p style={{ color: "var(--color-grey-text)", fontSize: "0.92rem" }}>
                    Fauteuil ergonomique de relaxation dans un espace calme et tamisé pour un confort maximal.
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
                  src="/assets/images/neuroptimal-equipment.jpg"
                  alt="Équipement NeurOptimal® INFC"
                  style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "20px", background: "#fff" }}>
                  <h3 style={{ color: "var(--color-navy)", fontSize: "1.1rem", marginBottom: "5px" }}>Équipement NeurOptimal®</h3>
                  <p style={{ color: "var(--color-grey-text)", fontSize: "0.92rem" }}>
                    Technologie de pointe avec capteurs EEG et logiciel d'analyse à 256 Hz pour une régulation précise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section bg-creme fade-in">
          <div className="container text-center">
            <h2 style={{ marginBottom: "2rem" }}>Notre Équipe</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto 3rem" }}>
              Des praticiens certifiés, formés à l'approche INFC, qui placent l'humain au cœur de la technologie.
            </p>

            <div className="card-grid">
              <div className="card" style={{ padding: "2rem" }}>
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "var(--color-creme)",
                    border: "2px dashed rgba(212,175,55,0.3)",
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", color: "var(--color-grey-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Photo à venir
                  </span>
                </div>
                <h3 className="text-navy">Praticien INFC</h3>
                <p style={{ fontSize: "0.9rem" }}>Spécialiste en neuro-régulation</p>
              </div>
              <div className="card" style={{ padding: "2rem" }}>
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "var(--color-creme)",
                    border: "2px dashed rgba(212,175,55,0.3)",
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", color: "var(--color-grey-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Photo à venir
                  </span>
                </div>
                <h3 className="text-navy">Praticien INFC</h3>
                <p style={{ fontSize: "0.9rem" }}>Spécialiste en neuro-régulation</p>
              </div>
              <div className="card" style={{ padding: "2rem" }}>
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "var(--color-creme)",
                    border: "2px dashed rgba(212,175,55,0.3)",
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", color: "var(--color-grey-text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Photo à venir
                  </span>
                </div>
                <h3 className="text-navy">Praticien INFC</h3>
                <p style={{ fontSize: "0.9rem" }}>Spécialiste en neuro-régulation</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
