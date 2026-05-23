import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TarifsPage() {
  return (
    <>
      <Header />
      <main>
        <section
          className="hero fade-in"
          style={{
            background: "linear-gradient(135deg, var(--color-navy), var(--color-navy-light))",
            color: "var(--color-white)",
            padding: "120px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <h1>Packs &amp; Tarifs</h1>
            <p>Accompagnement personnalisé – premium, sans offres gratuites.</p>
          </div>
        </section>
        <section className="section bg-creme fade-in" style={{ padding: "3rem 0" }}>
          <div className="container">
            <h2>Nos offres</h2>
            <p style={{ marginBottom: "2rem" }}>
              Nous privilégions un échange d'orientation afin de déterminer le parcours le plus adapté à votre situation.
            </p>
            <div className="card-grid" style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {/* Example pack 1 */}
              <div
                className="card"
                style={{
                  flex: 1,
                  minWidth: "280px",
                  background: "var(--color-white)",
                  padding: "2rem",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <h3>Accompagnement Sérénité</h3>
                <p style={{ margin: "1rem 0" }}>
                  <strong>À partir de&nbsp;:</strong> 2 500 MAD / session
                </p>
                <p style={{ color: "var(--color-grey-text)", marginBottom: "1.5rem" }}>
                  Programme dédié aux enfants et adolescents pour renforcer la régulation émotionnelle.
                </p>
                <a href="/contact" className="btn btn-navy">
                  Échange d'orientation
                </a>
              </div>
              {/* Example pack 2 */}
              <div
                className="card"
                style={{
                  flex: 1,
                  minWidth: "280px",
                  background: "var(--color-white)",
                  padding: "2rem",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <h3>Accompagnement Performance</h3>
                <p style={{ margin: "1rem 0" }}>
                  <strong>À partir de&nbsp;:</strong> 3 200 MAD / session
                </p>
                <p style={{ color: "var(--color-grey-text)", marginBottom: "1.5rem" }}>
                  Optimisez votre concentration et vos performances cognitives.
                </p>
                <a href="/contact" className="btn btn-navy">
                  Échange d'orientation
                </a>
              </div>
            </div>
            <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "var(--color-grey-text)" }}>
              Tous les prix sont indicatifs. Nous vous invitons à nous contacter pour un devis personnalisé.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
