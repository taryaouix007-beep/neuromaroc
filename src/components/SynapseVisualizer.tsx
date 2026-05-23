"use client";

import React, { useState } from "react";

type NodeType = "center" | "eeg" | "feedback" | "reg";

interface NodeDetail {
  title: string;
  text: string;
  badge: string;
}

const nodeDetails: Record<NodeType, NodeDetail> = {
  center: {
    title: "Un Miroir de l'Activité Cérébrale",
    text: "Le neurofeedback est une méthode scientifiquement validée qui permet au cerveau de s'auto-réguler. En observant sa propre activité en temps réel via des capteurs passifs, le cerveau apprend à corriger ses schémas de dysrégulation liés au stress, à l'anxiété ou à l'inattention.",
    badge: "Régulation Naturelle",
  },
  eeg: {
    title: "1. La Lecture Passive (EEG)",
    text: "Des capteurs d'EEG ultra-sensibles mesurent l'activité corticale 256 fois par seconde. Il s'agit d'une simple écoute : aucun courant électrique n'est envoyé dans le cerveau. C'est 100% sûr, indolore et adapté à tous les âges.",
    badge: "Technologie Non-Invasive",
  },
  feedback: {
    title: "2. Le Feedback Sensoriel",
    text: "Pendant que vous écoutez de la musique, des micro-coupures sonores presque imperceptibles interviennent dès qu'une instabilité cérébrale est détectée. Ce feedback informe instantanément le système nerveux de son écart.",
    badge: "Rétroaction Organique",
  },
  reg: {
    title: "3. La Consolidation Synaptique",
    text: "Par répétition de cette boucle, le cerveau utilise sa plasticité naturelle pour réorganiser ses circuits. Les zones hyperactives se calment, les zones sous-actives se renforcent, conduisant à des résultats durables.",
    badge: "Neuroplasticité Active",
  },
};

export default function SynapseVisualizer() {
  const [activeNode, setActiveNode] = useState<NodeType>("center");

  const current = nodeDetails[activeNode];

  return (
    <div className="whatis-grid">
      {/* Left Column: Interactive Synapse Visualizer */}
      <div className="synapse-visualizer-box">
        <svg className="synapse-svg" viewBox="0 0 200 200">
          {/* Dash lines linking to center */}
          <line className="synapse-link" x1="100" y1="100" x2="160" y2="50" />
          <line className="synapse-link" x1="100" y1="100" x2="160" y2="150" />
          <line className="synapse-link" x1="100" y1="100" x2="40" y2="100" />

          {/* Center Node (Brain Core) */}
          <g
            className={`synapse-node ${activeNode === "center" ? "active" : ""}`}
            onClick={() => setActiveNode("center")}
            style={{ cursor: "pointer" }}
          >
            <circle className="main-dot" cx="100" cy="100" r="14" />
            <circle cx="100" cy="100" r="8" fill="var(--color-gold)" />
            <text x="100" y="80" textAnchor="middle" fontSize="10" fontWeight="700">
              LE CERVEAU
            </text>
          </g>

          {/* Node 1: EEG (Top Right) */}
          <g
            className={`synapse-node ${activeNode === "eeg" ? "active" : ""}`}
            onClick={() => setActiveNode("eeg")}
            style={{ cursor: "pointer" }}
          >
            <circle className="main-dot" cx="160" cy="50" r="10" />
            <circle cx="160" cy="50" r="5" fill="#10B981" />
            <text x="160" y="32" textAnchor="middle" fontSize="9">
              1. Mesure EEG
            </text>
          </g>

          {/* Node 2: Feedback (Left) */}
          <g
            className={`synapse-node ${activeNode === "feedback" ? "active" : ""}`}
            onClick={() => setActiveNode("feedback")}
            style={{ cursor: "pointer" }}
          >
            <circle className="main-dot" cx="40" cy="100" r="10" />
            <circle cx="40" cy="100" r="5" fill="#3B82F6" />
            <text x="40" y="82" textAnchor="middle" fontSize="9">
              2. Feedback Sonore
            </text>
          </g>

          {/* Node 3: Auto-Regulation (Bottom Right) */}
          <g
            className={`synapse-node ${activeNode === "reg" ? "active" : ""}`}
            onClick={() => setActiveNode("reg")}
            style={{ cursor: "pointer" }}
          >
            <circle className="main-dot" cx="160" cy="150" r="10" />
            <circle cx="160" cy="150" r="5" fill="var(--color-gold)" />
            <text x="160" y="172" textAnchor="middle" fontSize="9">
              3. Auto‑Régulation
            </text>
          </g>
        </svg>
      </div>

      {/* Right Column: Interactive Content Display Card */}
      <div className="whatis-content-card">
        <span className="badge">{current.badge}</span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        <div style={{ marginTop: "10px" }}>
          <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
            💡 Cliquez sur les nœuds de la synapse pour explorer le fonctionnement.
          </span>
        </div>
      </div>
    </div>
  );
}
