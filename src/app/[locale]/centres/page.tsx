import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MoroccoMap from "@/components/MoroccoMap";

interface CentreInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  phoneRaw: string;
  hours: string;
  team: string;
  mapsLink: string;
  whatsappLink: string;
  images: string[];
}

const centresData: CentreInfo[] = [
  {
    id: "centre-casablanca",
    name: "INFC Casablanca",
    address: "Nº12 2ème étage, Immeuble Living office 362 BD Ghandi Oasis, Casablanca, Maroc",
    phone: "0522991783",
    phoneRaw: "tel:0522991783",
    hours: "Lundi‑Samedi : 09h00 – 19h00",
    team: "Dr. Chadia Chakib (Fondatrice), 3 praticiens certifiés",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Living+office+362+BD+Ghandi+Oasis+Casablanca",
    whatsappLink: "https://wa.me/212622606011",
    images: [
      "/assets/images/neurofeedback-casablanca-1-480.jpg",
      "/assets/images/neurofeedback-casablanca-2-480.jpg",
      "/assets/images/neurofeedback-casablanca-3-480.jpg",
    ],
  },
  {
    id: "centre-marrakech",
    name: "INFC Marrakech",
    address: "N°33 3ème étage, Résidence Le Noyer A, Rue Ibn Sina Gueliz, Marrakech, Maroc",
    phone: "0524207263",
    phoneRaw: "tel:0524207263",
    hours: "Lundi‑Samedi : 09h00 – 18h30",
    team: "2 praticiens certifiés, 1 coordinateur",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Residence+Le+Noyer+A+Rue+Ibn+Sina+Gueliz+Marrakech",
    whatsappLink: "https://wa.me/212622606012",
    images: [
      "/assets/images/neurofeedback-marrakech-2-480.jpg",
      "/assets/images/neurofeedback-marrakech-3-480.jpg",
      "/assets/images/neurofeedback-marrakech-5-480.jpg",
    ],
  },
  {
    id: "centre-tanger",
    name: "INFC Tanger",
    address: "N° 25 2ème étage, Résidence El Jaghaoui, Tower Route Des Abattoirs, Tanger, Maroc",
    phone: "0539367519",
    phoneRaw: "tel:0539367519",
    hours: "Lundi‑Samedi : 09h00 – 19h00",
    team: "2 praticiens certifiés",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Residence+El+Jaghaoui+Tower+Route+Des+Abattoirs+Tanger",
    whatsappLink: "https://wa.me/212622606017",
    images: [
      "/assets/images/neurofeedback-tanger-2.jpg",
      "/assets/images/neurofeedback-tanger-3.jpg",
      "/assets/images/neurofeedback-tanger-4-480.jpg",
    ],
  },
  {
    id: "centre-kenitra",
    name: "INFC Kénitra",
    address: "Nº2 Résidence el waha rue imam ali et saad zaghlou, Kénitra, Maroc",
    phone: "0622606033",
    phoneRaw: "tel:0622606033",
    hours: "Lundi‑Samedi : 09h00 – 19h00",
    team: "Praticiens certifiés INFC",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Residence+el+waha+rue+imam+ali+et+saad+zaghlou+Kenitra",
    whatsappLink: "https://wa.me/212622606033",
    images: [
      "/assets/images/neurofeedback-casablanca-1-480.jpg",
      "/assets/images/neurofeedback-casablanca-2-480.jpg",
      "/assets/images/neurofeedback-casablanca-3-480.jpg",
    ],
  },
];

export default function CentresPage() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section
          className="hero fade-in"
          style={{
            background:
              "linear-gradient(rgba(10, 22, 40, 0.75), rgba(10, 22, 40, 0.75)), url('/assets/images/centre-headline-bg.jpg') no-repeat center center / cover",
            color: "var(--color-white)",
            padding: "140px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <h1>Nos Centres au Maroc</h1>
            <p>Un espace premium et humain dédié à la régulation neuro‑sensible.</p>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="section bg-creme fade-in">
          <div className="container">
            <MoroccoMap />
          </div>
        </section>

        {/* Centre details */}
        <section className="section bg-white fade-in">
          <div className="container">
            {centresData.map((centre) => (
              <div key={centre.id} className="centre-card" id={centre.id}>
                <h2>{centre.name}</h2>
                <p>
                  <strong>Adresse :</strong> {centre.address}
                </p>
                <p>
                  <strong>Téléphone :</strong> <a href={centre.phoneRaw}>{centre.phone}</a>
                </p>
                <p>
                  <strong>Horaires :</strong> {centre.hours}
                </p>
                <p>
                  <strong>Équipe :</strong> {centre.team}
                </p>
                <div className="btn-group">
                  <a href={centre.mapsLink} target="_blank" className="btn btn-outline" rel="noreferrer">
                    📍 Itinéraire Google Maps
                  </a>
                  <a href={centre.whatsappLink} target="_blank" className="btn btn-gold" rel="noreferrer">
                    💬 WhatsApp
                  </a>
                  <a href={centre.phoneRaw} className="btn btn-navy">
                    📞 Appeler
                  </a>
                </div>
                <div className="centre-gallery">
                  {centre.images.map((imgSrc, idx) => (
                    <img key={idx} src={imgSrc} alt={`${centre.name} – galerie photo ${idx + 1}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
