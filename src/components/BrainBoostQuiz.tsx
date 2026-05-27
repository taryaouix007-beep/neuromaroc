"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Question {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "1/5 — Votre enfant arrive‑t‑il à se concentrer plus de 15 minutes sur ses révisions ?",
    options: [
      { text: "Oui, sans difficulté", score: 0 },
      { text: "Parfois, ça dépend des jours", score: 1 },
      { text: "Rarement, il décroche très vite", score: 2 },
      { text: "Non, c'est très difficile pour lui", score: 3 },
    ],
  },
  {
    id: 2,
    question: "2/5 — Comment décririez‑vous son sommeil ?",
    options: [
      { text: "Il dort bien et se réveille en forme", score: 0 },
      { text: "Sommeil correct mais fatigue occasionnelle", score: 1 },
      { text: "Il a du mal à s'endormir ou se réveille fatigué", score: 2 },
      { text: "Sommeil très perturbé, fatigue chronique", score: 3 },
    ],
  },
  {
    id: 3,
    question: "3/5 — Observez‑vous des signes d'irritabilité ou d'anxiété liés aux études ?",
    options: [
      { text: "Non, il reste calme", score: 0 },
      { text: "Un peu de stress normal avant les contrôles", score: 1 },
      { text: "Oui, il est souvent nerveux ou en colère", score: 2 },
      { text: "Oui, crises fréquentes, pleurs ou blocages", score: 3 },
    ],
  },
  {
    id: 4,
    question: "4/5 — Votre enfant retient‑il ce qu'il a révisé la veille ?",
    options: [
      { text: "Oui, sa mémoire est bonne", score: 0 },
      { text: "En général oui, mais pas toujours", score: 1 },
      { text: "Il oublie souvent malgré les efforts", score: 2 },
      { text: "Il oublie presque tout le lendemain", score: 3 },
    ],
  },
  {
    id: 5,
    question: "5/5 — A‑t‑il tendance à procrastiner face aux révisions ?",
    options: [
      { text: "Non, il s'y met facilement", score: 0 },
      { text: "Un peu, comme tout le monde", score: 1 },
      { text: "Souvent, il repousse sans cesse", score: 2 },
      { text: "Systématiquement, même s'il sait que c'est urgent", score: 3 },
    ],
  },
];

export default function BrainBoostQuiz() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);

  const handleSelectOption = (score: number) => {
    const updatedScores = [...scores];
    updatedScores[currentStep - 1] = score;
    setScores(updatedScores);

    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 300);
  };

  const isCompleted = currentStep > 5;
  const progressPercent = isCompleted ? 100 : ((currentStep - 1) / 5) * 100;

  // Calculate final vulnerabilities
  const attention = isCompleted ? ((scores[0] + scores[4]) / 6) * 100 : 0;
  const sommeil = isCompleted ? (scores[1] / 3) * 100 : 0;
  const stress = isCompleted ? (scores[2] / 3) * 100 : 0;
  const memoire = isCompleted ? (scores[3] / 3) * 100 : 0;

  const totalScore = scores.reduce((a, b) => a + b, 0);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: leadEmail,
          name: leadName,
          score: totalScore,
          results: {
            attention: attention,
            sommeil: sommeil,
            stress: stress,
            memoire: memoire,
          },
        }),
      });
      if (response.ok) {
        setIsCaptured(true);
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      alert("Erreur de connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = {
    labels: [
      "Fatigue Attentionnelle",
      "Dette de Sommeil",
      "Niveau de Stress",
      "Charge Mémorielle",
    ],
    datasets: [
      {
        label: "Vulnérabilité (%)",
        data: [attention, sommeil, stress, memoire],
        backgroundColor: "rgba(255, 75, 114, 0.4)",
        borderColor: "#FF4B72",
        pointBackgroundColor: "#FF4B72",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FF4B72",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(10, 22, 40, 0.1)" },
        grid: { color: "rgba(10, 22, 40, 0.1)" },
        pointLabels: {
          color: "#0A1628",
          font: { size: 12, family: "Inter, sans-serif", weight: "bold" as const },
        },
        ticks: { display: false, stepSize: 25 },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <section id="quiz-section" className="section bg-white">
      <div className="container">
        <div className="quiz-container">
          <h2>🧠 Test : Votre enfant souffre-t-il de fatigue cognitive ?</h2>
          <p style={{ textAlign: "center", color: "var(--color-grey-text)", marginBottom: "0.5rem" }}>
            5 questions simples · 1 minute · Résultat immédiat
          </p>
          <p
            style={{
              textAlign: "center",
              color: "var(--color-grey-text)",
              fontSize: "0.85rem",
              opacity: 0.8,
              marginBottom: "2rem",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <em>Ce test est fourni à titre indicatif et éducatif. Il ne remplace en aucun cas une évaluation médicale ou psychologique.</em>
          </p>

          <div className="quiz-progress">
            <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {!isCompleted ? (
            <div className="quiz-step active">
              <div className="quiz-question">{questions[currentStep - 1].question}</div>
              <div className="quiz-options">
                {questions[currentStep - 1].options.map((opt, i) => (
                  <button
                    key={i}
                    className="quiz-option"
                    onClick={() => handleSelectOption(opt.score)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-step active">
              <div className="quiz-result">
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      color: "var(--color-grey-text)",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      marginBottom: "1rem",
                    }}
                  >
                    Le Bilan de Prévention Brain Boost
                  </div>
                  <h2 style={{ color: "var(--color-navy)", fontSize: "2.5rem", marginBottom: "1rem" }}>
                    Bravo d'avoir complété l'évaluation.
                  </h2>
                  <p
                    style={{
                      color: "var(--color-grey-text)",
                      fontSize: "1.1rem",
                      maxWidth: "700px",
                      margin: "0 auto",
                      lineHeight: 1.6,
                    }}
                  >
                    {totalScore <= 4 ? (
                      <strong>Votre enfant a un bon équilibre, mais restez vigilant.</strong>
                    ) : (
                      <strong>Attention, votre enfant présente un risque de surcharge cognitive.</strong>
                    )}{" "}
                    Veuillez consulter les résultats détaillés dans le graphique ci-dessous. Ils soulignent nos observations ainsi que les moyens de protéger son équilibre mental avant les examens.
                  </p>
                </div>

                {!isCaptured ? (
                  <div style={{ 
                    maxWidth: "500px", 
                    margin: "0 auto 3rem", 
                    padding: "2rem", 
                    background: "rgba(10, 22, 40, 0.05)", 
                    borderRadius: "15px", 
                    border: "1px solid rgba(10, 22, 40, 0.1)" 
                  }}>
                    <p style={{ textAlign: "center", fontWeight: 700, color: "var(--color-navy)", marginBottom: "1.5rem" }}>
                      📩 Recevez votre analyse complète par email
                    </p>
                    <form onSubmit={handleSubmitLead} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <input 
                        type="text" 
                        placeholder="Nom complet" 
                        value={leadName} 
                        onChange={(e) => setLeadName(e.target.value)}
                        style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
                      />
                      <input 
                        type="email" 
                        required 
                        placeholder="Adresse email" 
                        value={leadEmail} 
                        onChange={(e) => setLeadEmail(e.target.value)}
                        style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
                      />
                      <button 
                        disabled={isSubmitting} 
                        style={{ 
                          padding: "1rem", 
                          borderRadius: "8px", 
                          background: "var(--color-navy)", 
                          color: "#fff", 
                          fontWeight: 700, 
                          cursor: "pointer",
                          opacity: isSubmitting ? 0.7 : 1
                        }}
                      >
                        {isSubmitting ? "Envoi en cours..." : "Recevoir mon analyse complète"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: "center", 
                    padding: "1rem", 
                    background: "#e6f4ea", 
                    color: "#1e7e34", 
                    borderRadius: "8px", 
                    marginBottom: "3rem", 
                    fontWeight: 600 
                  }}>
                    ✅ Analyse envoyée ! Vérifiez votre boîte de réception.
                  </div>
                )}

                <div style={{ maxWidth: "600px", margin: "0 auto 3rem", position: "relative", height: "350px" }}>
                  <Radar data={chartData} options={chartOptions} />
                </div>

                <p style={{ fontWeight: 700, color: "var(--color-navy)", marginBottom: "1.5rem", textAlign: "center" }}>
                  Découvrez comment l'accompagner sans pression :
                </p>
                <div className="cta-grid">
                  <a href="#lead-magnet-section" className="cta-card cta-schedule" style={{ background: "var(--color-navy)", color: "#fff" }}>
                    <span className="cta-icon">📖</span>
                    Recevoir le Guide d'Accompagnement
                    <small style={{ color: "rgba(255,255,255,0.7)", display: "block", marginTop: "4px" }}>Téléchargement libre</small>
                  </a>
                  <a
                    href="https://wa.me/212622606009?text=Bonjour%2C%20je%20viens%20de%20faire%20le%20test%20pour%20mon%20enfant%20et%20je%20souhaite%20recevoir%20le%20dossier%20complet%20Brain%20Boost."
                    target="_blank"
                    className="cta-card cta-whatsapp"
                    rel="noreferrer"
                  >
                    <span className="cta-icon">💬</span>
                    Demander le dossier complet
                    <small style={{ color: "rgba(255,255,255,0.8)", display: "block", marginTop: "4px" }}>Via WhatsApp</small>
                  </a>
                </div>

                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setScores([0, 0, 0, 0, 0]);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-navy)",
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    🔄 Recommencer le test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
