"use client";

import React, { useState } from "react";

type StepType = 1 | 2 | 3;

interface StepInfo {
  num: number;
  badge: string;
  title: string;
  desc: string;
  statusText: string;
  footerText: string;
}

const steps: Record<StepType, StepInfo> = {
  1: {
    num: 1,
    badge: "Étape 1 : Capture en cours",
    title: "La Capture (Écoute passive)",
    desc: "Des capteurs d'EEG passifs écoutent l'activité électrique naturelle de votre cerveau. Aucun courant n'est émis. Vous vous relaxez.",
    statusText: "Étape 1 : Capture en cours",
    footerText: "Lecture passive de l'activité corticale naturelle. Aucun courant envoyé.",
  },
  2: {
    num: 2,
    badge: "Étape 2 : Analyse active (256 Hz)",
    title: "L'Analyse en Temps Réel",
    desc: "Le logiciel analyse les signaux 256 fois par seconde. Il repère les sursauts de tension ou micro-instabilités qui précèdent le stress.",
    statusText: "Étape 2 : Analyse active (256 Hz)",
    footerText: "Recherche d'instabilités de signaux. Détection pré-symptomatique du stress.",
  },
  3: {
    num: 3,
    badge: "Étape 3 : Feedback harmonisé",
    title: "Le Feedback (Auto-correction)",
    desc: "Une micro-interruption dans le flux audio signale l'instabilité au cerveau, qui choisit instantanément de se réorganiser.",
    statusText: "Étape 3 : Feedback harmonisé",
    footerText: "Micro-coupures sonores initiant une auto-régulation naturelle immédiate.",
  },
};

const erraticPath = (() => {
  let points: [number, number][] = [];
  const period = 500;
  const numPoints = 40;
  let seed = 7;
  const random = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  points.push([0, 75]);
  for (let i = 1; i < numPoints; i++) {
    const x = (i / numPoints) * period;
    const noise = (random() - 0.5) * 80;
    const base = Math.sin((x / period) * Math.PI * 12) * 25;
    const y = 75 + base + noise;
    points.push([x, Math.max(15, Math.min(135, y))]);
  }
  points.push([period, 75]);
  let fullPoints = [...points];
  for (let i = 1; i < points.length; i++) {
    fullPoints.push([points[i][0] + period, points[i][1]]);
  }
  return "M" + fullPoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
})();

const analysisPath = (() => {
  let points: [number, number][] = [];
  const period = 500;
  for (let x = 0; x <= period; x += 5) {
    const w1 = Math.sin((x / period) * Math.PI * 6) * 18;
    const w2 = Math.sin((x / period) * Math.PI * 14) * 8;
    const w3 = Math.sin((x / period) * Math.PI * 24) * 4;
    let surge = 0;
    if (Math.abs(x - 75) < 35) {
      surge = (1 - Math.abs(x - 75) / 35) * -35;
    } else if (Math.abs(x - 225) < 35) {
      surge = (1 - Math.abs(x - 225) / 35) * -25;
    } else if (Math.abs(x - 375) < 35) {
      surge = (1 - Math.abs(x - 375) / 35) * -30;
    }
    const y = 75 + w1 + w2 + w3 + surge;
    points.push([x, Math.max(15, Math.min(135, y))]);
  }
  points[0][1] = 75;
  points[points.length - 1][1] = 75;
  let fullPoints = [...points];
  for (let i = 1; i < points.length; i++) {
    fullPoints.push([points[i][0] + period, points[i][1]]);
  }
  return "M" + fullPoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
})();

const stablePath = (() => {
  let points: [number, number][] = [];
  const totalWidth = 1000;
  const period = 125;
  const amplitude = 22;
  for (let x = 0; x <= totalWidth; x += 4) {
    const y = 75 + Math.sin((x / period) * 2 * Math.PI) * amplitude;
    points.push([x, y]);
  }
  return "M" + points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L");
})();

export default function EEGVisualizer() {
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const current = steps[currentStep];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .regulation-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 50px;
          align-items: center;
        }
        @media (max-width: 992px) {
          .regulation-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        
        .visualizer-card {
          background: var(--color-navy);
          border-radius: var(--radius-lg);
          padding: 40px;
          height: 380px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-hover);
          border: 1px solid rgba(212, 175, 55, 0.15);
        }
        .visualizer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }
        .visualizer-status {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10B981;
        }
        .visualizer-body {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          overflow: hidden;
          width: 100%;
          height: 150px;
        }
        
        .wave-svg {
          position: absolute;
          left: 0;
          top: 0;
          width: 200%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wave-path {
          fill: none;
          stroke-width: 3.5;
        }
        
        .wave-path.erratic-line {
          stroke: #EF4444;
        }
        .wave-path.analysis-line {
          stroke: var(--color-gold);
        }
        .wave-path.stable-line {
          stroke: #10B981;
        }
        
        .state-1 .wave-svg.erratic {
          opacity: 1;
          pointer-events: auto;
          animation: flowErratic 2s linear infinite;
        }
        .state-2 .wave-svg.analysis {
          opacity: 1;
          pointer-events: auto;
          animation: flowAnalysis 3.5s linear infinite;
        }
        .state-3 .wave-svg.stable {
          opacity: 1;
          pointer-events: auto;
          animation: flowStable 5s linear infinite;
        }

        @keyframes flowErratic {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes flowAnalysis {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes flowStable {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .instability-circle {
          fill: var(--color-gold);
          transform-origin: center;
          transform-box: fill-box;
          filter: drop-shadow(0px 0px 6px var(--color-gold));
          animation: circlePulse 1.5s infinite alternate;
        }
        @keyframes circlePulse {
          0% { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 1; }
        }

        .visualizer-footer {
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 15px;
          margin-top: 15px;
        }
        .visualizer-footer-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }
        
        .stepper-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .step-card {
          background: var(--color-creme);
          border: 2px solid transparent;
          border-radius: var(--radius-md);
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .step-card:hover {
          transform: translateX(5px);
          border-color: rgba(10, 22, 40, 0.1);
        }
        .step-card.active {
          background: var(--color-navy);
          border-color: var(--color-gold);
        }
        .step-card.active .step-num-badge {
          background: var(--color-gold);
          color: var(--color-navy);
        }
        .step-card.active h3 {
          color: #fff;
        }
        .step-card.active p {
          color: rgba(255, 255, 255, 0.8);
        }
        .step-num-badge {
          background: var(--color-navy);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          font-family: var(--font-heading);
          transition: all 0.3s ease;
        }
        .step-text h3 {
          font-size: 1.15rem;
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }
        .step-text p {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--color-grey-text);
          margin: 0;
          transition: color 0.3s ease;
        }
      `}} />
      <div className="regulation-grid">
      {/* Left: Interactive Visualizer Card */}
      <div className={`visualizer-card state-${currentStep}`} id="visualizerCard">
        <div className="visualizer-header">
          <span className="visualizer-status">
            <span className="status-dot"></span>
            <span id="visualizerStatusText">{current.statusText}</span>
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontFamily: "var(--font-heading)", fontWeight: 700, letterSpacing: "1px" }}>
            INFC MONITOR v1.2
          </span>
        </div>

        <div className="visualizer-body">
          {/* Step 1: Erratic SVG */}
          <svg className="wave-svg erratic" viewBox="0 0 1000 150" preserveAspectRatio="none">
            <path className="wave-path erratic-line" d={erraticPath} />
          </svg>

          {/* Step 2: Analysis SVG */}
          <svg className="wave-svg analysis" viewBox="0 0 1000 150" preserveAspectRatio="none">
            <path className="wave-path analysis-line" d={analysisPath} />
            <circle cx="75" cy="30" r="6" className="instability-circle" />
            <circle cx="225" cy="50" r="6" className="instability-circle" />
            <circle cx="375" cy="40" r="6" className="instability-circle" />
            <circle cx="575" cy="30" r="6" className="instability-circle" />
            <circle cx="725" cy="50" r="6" className="instability-circle" />
            <circle cx="875" cy="40" r="6" className="instability-circle" />
          </svg>

          {/* Step 3: Stable SVG */}
          <svg className="wave-svg stable" viewBox="0 0 1000 150" preserveAspectRatio="none">
            <path className="wave-path stable-line" d={stablePath} />
          </svg>
        </div>

        <div className="visualizer-footer">
          <span className="visualizer-footer-text" id="visualizerFooterText">
            {current.footerText}
          </span>
          <span style={{ color: "var(--color-gold)", fontWeight: 700, fontSize: "0.8rem" }}>
            256 Hz Analysis
          </span>
        </div>
      </div>

      {/* Right: Stepper Card Column */}
      <div className="stepper-column">
        {(Object.keys(steps) as unknown as StepType[]).map((key) => {
          const stepNum = Number(key) as StepType;
          const stepItem = steps[stepNum];
          const isActive = currentStep === stepNum;
          return (
            <div
              key={stepNum}
              className={`step-card ${isActive ? "active" : ""}`}
              onClick={() => setCurrentStep(stepNum)}
            >
              <div className="step-num-badge">{stepItem.num}</div>
              <div className="step-text">
                <h3>{stepItem.title}</h3>
                <p>{stepItem.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
