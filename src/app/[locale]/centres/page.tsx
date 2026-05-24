"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MoroccoMap from "@/components/MoroccoMap";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";
import "@/app/home.css";

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

export default function CentresPage() {
  const { t, locale } = useTranslation();

  const centresData: CentreInfo[] = [
    {
      id: "centre-casablanca",
      name: "INFC Casablanca",
      address: locale === "ar" 
        ? "رقم 12 الطابق الثاني، عمارة ليفينج أوفيس، 362 شارع غاندي، الواحة، الدار البيضاء، المغرب"
        : locale === "en"
          ? "No. 12 2nd floor, Living office Building, 362 BD Ghandi Oasis, Casablanca, Morocco"
          : "Nº12 2ème étage, Immeuble Living office 362 BD Ghandi Oasis, Casablanca, Maroc",
      phone: "0522991783",
      phoneRaw: "tel:0522991783",
      hours: locale === "ar"
        ? "الاثنين - السبت: 09:00 صباحًا - 07:00 مساءً"
        : locale === "en"
          ? "Monday‑Saturday: 09:00 AM – 07:00 PM"
          : "Lundi‑Samedi : 09h00 – 19h00",
      team: locale === "ar"
        ? "د. شادية شكيب (المؤسسة)، 3 ممارسين معتمدين"
        : locale === "en"
          ? "Dr. Chadia Chakib (Founder), 3 certified practitioners"
          : "Dr. Chadia Chakib (Fondatrice), 3 praticiens certifiés",
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
      address: locale === "ar"
        ? "رقم 33 الطابق الثالث، إقامة لو نوييه أ، شارع ابن سينا، جيليز، مراكش، المغرب"
        : locale === "en"
          ? "No. 33 3rd floor, Residence Le Noyer A, Rue Ibn Sina Gueliz, Marrakech, Morocco"
          : "N°33 3ème étage, Résidence Le Noyer A, Rue Ibn Sina Gueliz, Marrakech, Maroc",
      phone: "0524207263",
      phoneRaw: "tel:0524207263",
      hours: locale === "ar"
        ? "الاثنين - السبت: 09:00 صباحًا - 06:30 مساءً"
        : locale === "en"
          ? "Monday‑Saturday: 09:00 AM – 06:30 PM"
          : "Lundi‑Samedi : 09h00 – 18h30",
      team: locale === "ar"
        ? "ممارسان معتمدان، منسق واحد"
        : locale === "en"
          ? "2 certified practitioners, 1 coordinator"
          : "2 praticiens certifiés, 1 coordinateur",
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
      address: locale === "ar"
        ? "رقم 25 الطابق الثاني، إقامة الجعوادي، برج طريق المجازر، طنجة، المغرب"
        : locale === "en"
          ? "No. 25 2nd floor, Residence El Jaghaoui, Tower Route Des Abattoirs, Tangier, Morocco"
          : "N° 25 2ème étage, Résidence El Jaghaoui, Tower Route Des Abattoirs, Tanger, Maroc",
      phone: "0539367519",
      phoneRaw: "tel:0539367519",
      hours: locale === "ar"
        ? "الاثنين - السبت: 09:00 صباحًا - 07:00 مساءً"
        : locale === "en"
          ? "Monday‑Saturday: 09:00 AM – 07:00 PM"
          : "Lundi‑Samedi : 09h00 – 19h00",
      team: locale === "ar"
        ? "ممارسان معتمدان"
        : locale === "en"
          ? "2 certified practitioners"
          : "2 praticiens certifiés",
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
      address: locale === "ar"
        ? "رقم 2 إقامة الواحة، شارع إمام علي وسعد زغلول، القنيطرة، المغرب"
        : locale === "en"
          ? "No. 2 Residence el waha, Rue Imam Ali and Saad Zaghlou, Kenitra, Morocco"
          : "Nº2 Résidence el waha rue imam ali et saad zaghlou, Kénitra, Maroc",
      phone: "0622606033",
      phoneRaw: "tel:0622606033",
      hours: locale === "ar"
        ? "الاثنين - السبت: 09:00 صباحًا - 07:00 مساءً"
        : locale === "en"
          ? "Monday‑Saturday: 09:00 AM – 07:00 PM"
          : "Lundi‑Samedi : 09h00 – 19h00",
      team: locale === "ar"
        ? "ممارسو INFC المعتمدون"
        : locale === "en"
          ? "INFC certified practitioners"
          : "Praticiens certifiés INFC",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Residence+el+waha+rue+imam+ali+et+saad+zaghlou+Kenitra",
      whatsappLink: "https://wa.me/212622606033",
      images: [
        "/assets/images/neurofeedback-casablanca-1-480.jpg",
        "/assets/images/neurofeedback-casablanca-2-480.jpg",
        "/assets/images/neurofeedback-casablanca-3-480.jpg",
      ],
    },
  ];

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section
          className="hero fade-in"
          style={{
            position: "relative",
            overflow: "hidden",
            color: "var(--color-white)",
            padding: "140px 0",
            textAlign: "center",
          }}
        >
          <Image
            src="/assets/images/centre-headline-bg.jpg"
            alt=""
            fill
            priority
            unoptimized
            style={{ objectFit: "cover", zIndex: 0 }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(rgba(10, 22, 40, 0.75), rgba(10, 22, 40, 0.75))",
              zIndex: 1,
            }}
          />
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <h1>{locale === "ar" ? "مراكزنا في المغرب" : locale === "en" ? "Our Centres in Morocco" : "Nos Centres au Maroc"}</h1>
            <p>{locale === "ar" ? "فضاء متميز وإنساني مخصص للتنظيم الحسي العصبي." : locale === "en" ? "A premium and human space dedicated to neuro-sensory regulation." : "Un espace premium et humain dédié à la régulation neuro‑sensible."}</p>
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
                  <strong>{locale === "ar" ? "العنوان :" : locale === "en" ? "Address:" : "Adresse :"}</strong> {centre.address}
                </p>
                <p>
                  <strong>{locale === "ar" ? "الهاتف :" : locale === "en" ? "Phone:" : "Téléphone :"}</strong> <a href={centre.phoneRaw}>{centre.phone}</a>
                </p>
                <p>
                  <strong>{locale === "ar" ? "أوقات العمل :" : locale === "en" ? "Hours:" : "Horaires :"}</strong> {centre.hours}
                </p>
                <p>
                  <strong>{locale === "ar" ? "الفريق :" : locale === "en" ? "Team:" : "Équipe :"}</strong> {centre.team}
                </p>
                <div className="btn-group">
                  <a href={centre.mapsLink} target="_blank" className="btn btn-outline" rel="noreferrer">
                    📍 {locale === "ar" ? "اتجاهات خرائط جوجل" : locale === "en" ? "Google Maps Directions" : "Itinéraire Google Maps"}
                  </a>
                  <a href={centre.whatsappLink} target="_blank" className="btn btn-gold" rel="noreferrer">
                    💬 WhatsApp
                  </a>
                  <a href={centre.phoneRaw} className="btn btn-navy">
                    📞 {locale === "ar" ? "اتصل الآن" : locale === "en" ? "Call" : "Appeler"}
                  </a>
                </div>
                <div className="centre-gallery">
                  {centre.images.map((imgSrc, idx) => (
                    <div key={idx} style={{ position: "relative", width: "calc((100% - 2rem) / 3)", minWidth: "140px", aspectRatio: "4/3" }}>
                      <Image
                        src={imgSrc}
                        alt={`${centre.name} – galerie photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover", borderRadius: "var(--radius-md)" }}
                      />
                    </div>
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
