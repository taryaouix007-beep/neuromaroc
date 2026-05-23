"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    message: "",
  });

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city) return;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
        setForm({ name: "", phone: "", city: "", message: "" });
        setToast({
          show: true,
          title: "📨 Demande envoyée",
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
        message: "Impossible de joindre le serveur.",
      });
    }
  };

  return (
    <>
      <Header />

      <main>
        {styleOverlay}

        <section className="hero fade-in" style={{ padding: "80px 0" }}>
          <div className="container">
            <h1>Échange d'orientation personnalisé</h1>
            <p>
              Prenez contact avec notre équipe pour discuter de votre situation et définir si notre approche est adaptée à vos besoins.
            </p>
          </div>
        </section>

        <section className="section bg-creme fade-in">
          <div className="container contact-container">
            <div className="contact-info-wrapper">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--color-navy)" }}>Nos Centres</h2>
              <p style={{ marginBottom: "2rem" }}>
                Vous pouvez nous contacter directement via WhatsApp pour toute question ou prise de rendez-vous dans le centre le plus
                proche de chez vous.
              </p>

              <div className="city-grid">
                <div className="city-card">
                  <h4>Casablanca</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                    📍 Nº12 2ème étage, Immeuble Living office 362 BD Ghandi Oasis
                    <br />
                    📞 Tél :{" "}
                    <a href="tel:0522991783" style={{ color: "inherit", textDecoration: "underline" }}>
                      0522991783
                    </a>
                    <br />
                    💬 WhatsApp :{" "}
                    <a
                      href="https://wa.me/212622606011"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      0622606011
                    </a>
                  </p>
                  <a
                    href="https://wa.me/212622606011?text=Bonjour%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Casablanca"
                    target="_blank"
                    className="btn btn-outline"
                    rel="noreferrer"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", width: "100%" }}
                  >
                    WhatsApp
                  </a>
                </div>
                <div className="city-card">
                  <h4>Marrakech</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                    📍 N°33 3ème étage, Résidence Le Noyer A, Rue Ibn Sina Gueliz
                    <br />
                    📞 Tél :{" "}
                    <a href="tel:0524207263" style={{ color: "inherit", textDecoration: "underline" }}>
                      0524207263
                    </a>
                    <br />
                    💬 WhatsApp :{" "}
                    <a
                      href="https://wa.me/212622606012"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      0622606012
                    </a>
                  </p>
                  <a
                    href="https://wa.me/212622606012?text=Bonjour%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Marrakech"
                    target="_blank"
                    className="btn btn-outline"
                    rel="noreferrer"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", width: "100%" }}
                  >
                    WhatsApp
                  </a>
                </div>
                <div className="city-card">
                  <h4>Tanger</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                    📍 N° 25 2ème étage, Résidence El Jaghaoui, Tower Route Des Abattoirs
                    <br />
                    📞 Tél :{" "}
                    <a href="tel:0539367519" style={{ color: "inherit", textDecoration: "underline" }}>
                      0539367519
                    </a>
                    <br />
                    💬 WhatsApp :{" "}
                    <a
                      href="https://wa.me/212622606017"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      0622606017
                    </a>
                  </p>
                  <a
                    href="https://wa.me/212622606017?text=Bonjour%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Tanger"
                    target="_blank"
                    className="btn btn-outline"
                    rel="noreferrer"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", width: "100%" }}
                  >
                    WhatsApp
                  </a>
                </div>
                <div className="city-card">
                  <h4>Kénitra</h4>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                    📍 Nº2 Résidence el waha rue imam ali et saad zaghlou
                    <br />
                    📞 Tél :{" "}
                    <a href="tel:0622606033" style={{ color: "inherit", textDecoration: "underline" }}>
                      0622606033
                    </a>
                    <br />
                    💬 WhatsApp :{" "}
                    <a
                      href="https://wa.me/212622606033"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      0622606033
                    </a>
                  </p>
                  <a
                    href="https://wa.me/212622606033?text=Bonjour%2C%20je%20souhaite%20contacter%20le%20centre%20de%20Kenitra"
                    target="_blank"
                    className="btn btn-outline"
                    rel="noreferrer"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", width: "100%" }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--color-navy)" }}>Demande de contact</h2>
              <p style={{ marginBottom: "2rem" }}>
                Remplissez ce formulaire et un praticien INFC vous recontactera dans les plus brefs délais.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Nom et Prénom
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      required
                      placeholder="Votre nom complet"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="form-control"
                      required
                      placeholder="+212 6 XX XX XX XX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      Ville de résidence
                    </label>
                    <select
                      id="city"
                      className="form-control"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    >
                      <option value="" disabled>
                        Sélectionnez votre ville
                      </option>
                      <option value="casablanca">Casablanca</option>
                      <option value="marrakech">Marrakech</option>
                      <option value="tanger">Tanger</option>
                      <option value="kenitra">Kénitra</option>
                      <option value="autre">Autre ville</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Quel est le motif de votre demande ? (Optionnel)
                    </label>
                    <textarea
                      id="message"
                      className="form-control"
                      placeholder="Décrivez brièvement votre situation ou vos attentes..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: "100%", border: "none" }}>
                    Envoyer ma demande
                  </button>
                </form>
              ) : (
                <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#10B981" }}>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>✓</span>
                  <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Demande enregistrée !</h3>
                  <p style={{ color: "var(--color-grey-text)" }}>
                    Merci pour votre intérêt. Un praticien INFC prendra contact avec vous par téléphone ou WhatsApp dans les plus brefs
                    délais.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    style={{
                      marginTop: "1.5rem",
                      background: "none",
                      border: "none",
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "var(--color-navy)",
                      fontWeight: 600,
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Toast show={toast.show} title={toast.title} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
}

const styleOverlay = (
  <style dangerouslySetInnerHTML={{ __html: `
    .contact-container {
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }
    @media(min-width: 768px) {
      .contact-container {
        flex-direction: row;
      }
    }
    .contact-form-wrapper {
      flex: 1;
      background: var(--color-white);
      padding: 3rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-soft);
    }
    .contact-info-wrapper {
      flex: 1;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--color-navy);
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 1rem;
      border: 1px solid rgba(10, 22, 40, 0.1);
      border-radius: var(--radius-sm);
      font-family: var(--font-body);
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--color-gold);
    }
    textarea.form-control {
      min-height: 150px;
      resize: vertical;
    }
    .city-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 2rem;
    }
    .city-card {
      background: var(--color-white);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-soft);
      text-align: center;
    }
    .city-card h4 {
      color: var(--color-navy);
      margin-bottom: 0.5rem;
    }
    .city-card p {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  `}} />
);
