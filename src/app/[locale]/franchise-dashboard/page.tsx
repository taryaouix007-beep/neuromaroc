import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FranchiseDashboard() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-creme)",
          padding: "4rem 2rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "600px",
            background: "#fff",
            padding: "3rem",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-soft)",
            borderTop: "4px solid var(--color-gold)",
          }}
        >
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🔑</span>
          <h1 style={{ color: "var(--color-navy)", fontSize: "2rem", marginBottom: "1rem" }}>Espace Franchise INFC</h1>
          <p
            style={{
              color: "var(--color-grey-text)",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            Notre portail de gestion de franchise est en cours de développement. Bientôt, vous pourrez accéder à votre tableau de bord, vos rapports d'activité, et vos ressources de support.
          </p>
          <div
            style={{
              display: "inline-block",
              background: "rgba(212,175,55,0.1)",
              color: "var(--color-gold)",
              padding: "0.6rem 1.5rem",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            🚧 Bientôt Disponible
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
