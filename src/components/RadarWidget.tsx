"use client";

import React, { useState } from "react";

type ProfileId = 1 | 2 | 3 | 4;

interface ProfileData {
  before: string;
  after: string;
  label: string;
  sectionId: string;
}

const radarData: Record<ProfileId, ProfileData> = {
  1: {
    before: "M100,76 L130,85 L119,126 L81,126 L54,85 Z",
    after: "M100,25 L168,78 L140,155 L61,155 L77,85 Z",
    label: "Profil : Enfant (TDAH / Scolaire)",
    sectionId: "persona-parents",
  },
  2: {
    before: "M100,84 L108,97 L105,106 L72,126 L39,85 Z",
    after: "M100,36 L161,81 L140,155 L67,151 L77,88 Z",
    label: "Profil : Vétérans & Rescapés de Trauma",
    sectionId: "persona-trauma",
  },
  3: {
    before: "M100,44 L146,85 L123,132 L67,132 L54,85 Z",
    after: "M100,22 L174,76 L144,161 L55,161 L31,76 Z",
    label: "Profil : Peak Performers",
    sectionId: "persona-performers",
  },
  4: {
    before: "M100,60 L123,89 L114,116 L86,116 L31,76 Z",
    after: "M100,30 L168,78 L140,155 L61,155 L69,80 Z",
    label: "Profil : Adultes (Stress & Burn‑out)",
    sectionId: "persona-adults",
  },
};

export default function RadarWidget() {
  const [activeProfile, setActiveProfile] = useState<ProfileId>(1);
  const current = radarData[activeProfile];

  const handleProfileChange = (profileId: ProfileId) => {
    setActiveProfile(profileId);
    
    // Smooth scroll to the corresponding persona section on the page
    const targetSection = document.getElementById(radarData[profileId].sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="radar-widget-container">
      <div className="section-header text-center" style={{ marginBottom: "30px" }}>
        <span
          style={{
            color: "var(--color-gold)",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "0.8rem",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "5px",
          }}
        >
          Scans Comparatifs Cliniques
        </span>
        <h3 style={{ fontSize: "1.6rem", color: "var(--color-navy)", marginBottom: "5px" }}>
          Visualiser le Profil Neuro-Sensible
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--color-grey-text)" }}>
          Sélectionnez un profil pour observer la signature d'ondes dysrégulée (Rouge) vs après accompagnement INFC (Or).
        </p>
      </div>

      <div className="radar-grid-layout">
        {/* Left Column: Radar graphic */}
        <div className="radar-box">
          <div
            style={{
              color: "#fff",
              fontSize: "0.8rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "5px",
              width: "100%",
              textAlign: "center",
            }}
            id="radarProfileLabel"
          >
            {current.label}
          </div>

          <div className="radar-svg-container">
            <svg
              viewBox="0 0 200 200"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              {/* Grid Circles */}
              <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
              <circle cx="100" cy="100" r="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
              <circle cx="100" cy="100" r="30" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />

              {/* Axes lines */}
              <line x1="100" y1="100" x2="100" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="100" x2="176" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="100" x2="147" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="100" x2="53" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="100" y1="100" x2="24" y2="75" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Labels */}
              <text x="100" y="12" className="radar-label-text">
                FOCUS
              </text>
              <text x="188" y="78" className="radar-label-text">
                SOMMEIL
              </text>
              <text x="156" y="178" className="radar-label-text">
                ÉNERGIE
              </text>
              <text x="44" y="178" className="radar-label-text">
                MÉMOIRE
              </text>
              <text x="12" y="78" className="radar-label-text">
                RÉSILIENCE STRESS
              </text>

              {/* Dysregulated Area (Before) */}
              <path id="radarBeforePath" className="radar-poly before" d={current.before} />

              {/* Regulated Area (After) */}
              <path id="radarAfterPath" className="radar-poly" d={current.after} />
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "10px",
              fontSize: "0.75rem",
            }}
          >
            <span style={{ color: "#EF4444", fontWeight: 700 }}>● Dysrégulation</span>
            <span style={{ color: "var(--color-gold)", fontWeight: 700 }}>● Post‑Régulation INFC</span>
          </div>
        </div>

        {/* Right Column: Interactive Selectors */}
        <div className="radar-selectors">
          <div
            className={`radar-selector-btn ${activeProfile === 1 ? "active" : ""}`}
            onClick={() => handleProfileChange(1)}
          >
            <span>👨‍👩‍👧 Pour les Parents (TDA/H & Attention)</span>
            <span className="arrow">→</span>
          </div>
          <div
            className={`radar-selector-btn ${activeProfile === 2 ? "active" : ""}`}
            onClick={() => handleProfileChange(2)}
          >
            <span>🎖️ Vétérans & Rescapés de Trauma (Sommeil / Stress)</span>
            <span className="arrow">→</span>
          </div>
          <div
            className={`radar-selector-btn ${activeProfile === 3 ? "active" : ""}`}
            onClick={() => handleProfileChange(3)}
          >
            <span>🚀 Peak Performers (Focus & Productivité)</span>
            <span className="arrow">→</span>
          </div>
          <div
            className={`radar-selector-btn ${activeProfile === 4 ? "active" : ""}`}
            onClick={() => handleProfileChange(4)}
          >
            <span>🧠 Pour les Adultes (Anxiété & Équilibre)</span>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
