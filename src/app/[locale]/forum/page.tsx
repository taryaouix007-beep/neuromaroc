"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

interface Answer {
  authorName: string;
  authorTitle: string;
  text: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  votes: number;
  answer: Answer | null;
}

const defaultQuestions: Question[] = [
  {
    id: "q-1",
    title: "Mon enfant a des maux de ventre réguliers avant de partir à l'école le matin. Comment l'aider ?",
    description: "Il a 12 ans, ses notes sont correctes mais l'approche du collège l'angoisse énormément, au point de pleurer ou d'avoir des nausées certains matins. Nous avons vu un pédiatre, il n'y a rien de physiologique.",
    category: "stress",
    author: "Khadija (Maman de Rayane)",
    date: "20 Mai 2026",
    votes: 54,
    answer: {
      authorName: "Dr. Chadia Chakib",
      authorTitle: "Fondatrice d'INFC Maroc",
      text: "Bonjour Khadija. Les maux de ventre matinaux sans cause physiologique sont des somatisations courantes d'un système nerveux en mode alerte (suractivation du système sympathique). La surcharge émotionnelle inhibe la digestion. Notre approche de régulation neuro-sensible aide le cerveau à stabiliser ses réponses face aux déclencheurs de stress, lui réapprenant à rester calme. En parallèle, je vous conseille de mettre en place une routine d'ancrage tactile de 2 minutes au réveil (toucher un objet froid, respiration calme) pour ramener l'attention dans le corps."
    }
  },
  {
    id: "q-2",
    title: "Difficulté de concentration : mon fils de 15 ans décroche après 10 minutes d'études.",
    description: "Pendant les devoirs, il s'agite, vérifie son téléphone ou regarde par la fenêtre. Il prétend vouloir travailler mais n'y arrive pas. Est-ce un TDAH ou simplement de la fatigue ?",
    category: "attention",
    author: "Youssef B. (Casablanca)",
    date: "18 Mai 2026",
    votes: 42,
    answer: {
      authorName: "Rachid A.",
      authorTitle: "Praticien Certifié INFC Casablanca",
      text: "Bonjour Youssef. Décrocher après 10 minutes traduit souvent une fatigue cognitive aiguë. Le cerveau sature et cherche des micro-pauses (le téléphone en est une) pour s'oxygéner. Avant de parler de trouble de l'attention (TDAH), il faut évaluer la qualité du sommeil profond et les cycles de révision. Nous recommandons des sessions courtes de 25 minutes suivies de 5 minutes de pause complète (sans écrans). L'entraînement NeurOptimal® l'aidera à consolider sa flexibilité cérébrale pour allonger naturellement ses temps de concentration."
    }
  },
  {
    id: "q-3",
    title: "Troubles du sommeil : des réveils nocturnes systématiques en période de contrôles.",
    description: "Ma fille de 17 ans prépare ses examens. Elle s'endort vers 23h mais se réveille à 3h du matin avec le cerveau qui tourne en boucle sur ses formules de mathématiques et ne se rendort plus.",
    category: "sommeil",
    author: "Anonyme",
    date: "15 Mai 2026",
    votes: 38,
    answer: {
      authorName: "Dr. Chadia Chakib",
      authorTitle: "Fondatrice d'INFC Maroc",
      text: "Bonjour. Les réveils nocturnes à heure fixe (vers 3h) correspondent souvent à un pic de cortisol dû à une anxiété résiduelle non évacuée avant le coucher. Le cerveau recycle les informations de la journée sous l'effet du stress. Je conseille de stopper toute révision à 20h00, de pratiquer la routine de 'Défragmentation Nocturne' (noter par écrit toutes ses craintes sur un carnet avant de se coucher pour décharger la mémoire de travail). Nos entraînements neuro-sensibles ciblent particulièrement cette régulation pour restaurer un sommeil réparateur indispensable à la mémoire."
    }
  },
  {
    id: "q-4",
    title: "Agitation permanente : ma fille de 8 ans ne tient pas en place en classe.",
    description: "Son institutrice me signale qu'elle se lève sans cesse, interrompt les autres et a du mal à respecter les consignes. À la maison, elle est également très active. Le neurofeedback peut-il l'aider sans médicaments ?",
    category: "hyperactivite",
    author: "Mina L. (Marrakech)",
    date: "10 Mai 2026",
    votes: 31,
    answer: null
  }
];

export default function ForumPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  
  // Toast State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });

  // Form Fields
  const [qTitle, setQTitle] = useState("");
  const [qCategory, setQCategory] = useState("sommeil");
  const [qAnonymous, setQAnonymous] = useState(false);
  const [qDetails, setQDetails] = useState("");

  // Fetch all questions from backend
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/forum");
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      } else {
        setQuestions(defaultQuestions);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setQuestions(defaultQuestions);
    }
  };

  useEffect(() => {
    fetchQuestions();

    // Load voted ids from localStorage to track client-side votes
    if (typeof window !== "undefined") {
      const storedVotes = localStorage.getItem("infc_voted_questions");
      if (storedVotes) {
        try {
          setVotedIds(JSON.parse(storedVotes));
        } catch {
          setVotedIds([]);
        }
      }
    }
  }, []);

  const showToastMsg = (title: string, message: string) => {
    setToast({ show: true, title, message });
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      sommeil: "💤 Sommeil",
      attention: "🎯 Concentration",
      stress: "🧘 Stress & Anxiété",
      hyperactivite: "🧠 Hyperactivité"
    };
    return labels[cat] || cat;
  };

  const handleVote = async (id: string) => {
    const isVoted = votedIds.includes(id);
    let updatedVotes = [...votedIds];

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vote",
          questionId: id,
          isVoted
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state votes
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, votes: data.votes } : q));

        if (isVoted) {
          updatedVotes = updatedVotes.filter((v) => v !== id);
          showToastMsg("👍 Intérêt", "Votre intérêt a été retiré.");
        } else {
          updatedVotes.push(id);
          showToastMsg("🔥 Intérêt", "Votre intérêt a été enregistré. Cette question remonte dans la file !");
        }
        setVotedIds(updatedVotes);
        if (typeof window !== "undefined") {
          localStorage.setItem("infc_voted_questions", JSON.stringify(updatedVotes));
        }
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim()) return;

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: qTitle.trim(),
          description: qDetails.trim(),
          category: qCategory,
          anonymous: qAnonymous
        })
      });
      const data = await res.json();
      if (data.success && data.question) {
        // Add the new question to state
        setQuestions(prev => [data.question, ...prev]);

        // Mark as voted (the author is interested)
        const updatedVotes = [...votedIds, data.question.id];
        setVotedIds(updatedVotes);
        if (typeof window !== "undefined") {
          localStorage.setItem("infc_voted_questions", JSON.stringify(updatedVotes));
        }

        // Reset Form
        setQTitle("");
        setQDetails("");
        setQAnonymous(false);
        setQCategory("sommeil");

        const isDev = process.env.NODE_ENV === "development";
        if (isDev) {
          showToastMsg("💡 Publication", "Votre question a été publiée avec succès.");
        } else {
          showToastMsg("💡 Publication", "Votre question a été soumise pour modération par nos praticiens.");
        }
      }
    } catch (err) {
      console.error("Error creating question:", err);
    }
  };

  // Compute Stats
  const qCount = questions.length;
  const aCount = questions.filter((q) => q.answer !== null).length;
  const vCount = questions.reduce((acc, q) => acc + q.votes, 0);

  // Filter and Sort Questions (Sort by votes descending)
  const sortedAndFilteredQuestions = [...questions]
    .sort((a, b) => b.votes - a.votes)
    .filter((q) => currentCategory === "all" || q.category === currentCategory);

  return (
    <>
      <Header />
      <main>
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            background-color: var(--color-creme);
            color: var(--color-navy);
            font-family: 'Inter', sans-serif;
          }

          .forum-hero {
            background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
            color: #fff;
            padding: 80px 0 60px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-bottom: 3px solid var(--color-gold);
          }

          .forum-hero h1 {
            font-family: var(--font-heading);
            font-size: clamp(2.2rem, 5vw, 3rem);
            font-weight: 800;
            margin-bottom: 1rem;
          }

          .forum-hero h1 span {
            color: var(--color-gold);
          }

          .forum-hero p {
            font-size: 1.15rem;
            max-width: 700px;
            margin: 0 auto;
            opacity: 0.9;
            line-height: 1.6;
          }

          .forum-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1.8fr 1.2fr;
            gap: 30px;
          }

          @media (max-width: 992px) {
            .forum-container {
              grid-template-columns: 1fr;
            }
          }

          .forum-card {
            background: #fff;
            border-radius: var(--radius-md);
            padding: 25px;
            box-shadow: var(--shadow-soft);
            border: 1px solid rgba(10, 22, 40, 0.03);
            margin-bottom: 25px;
          }

          .forum-card.accent-gold {
            border-top: 4px solid var(--color-gold);
          }

          .forum-card h2 {
            font-family: var(--font-heading);
            font-size: 1.35rem;
            font-weight: 700;
            color: var(--color-navy);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .forum-card h2 span {
            color: var(--color-gold);
          }

          .filter-bar {
            display: flex;
            gap: 8px;
            margin-bottom: 25px;
            flex-wrap: wrap;
          }

          .filter-btn {
            background: #fff;
            border: 1px solid rgba(10, 22, 40, 0.08);
            padding: 8px 16px;
            border-radius: 50px;
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-navy);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .filter-btn:hover {
            border-color: var(--color-gold);
            background: rgba(212, 175, 55, 0.02);
          }

          .filter-btn.active {
            background: var(--color-navy);
            color: #fff;
            border-color: var(--color-navy);
            box-shadow: 0 4px 12px rgba(10, 22, 40, 0.15);
          }

          .form-group {
            margin-bottom: 18px;
          }

          .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
            font-size: 0.9rem;
            color: var(--color-navy);
          }

          .form-control {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid rgba(10, 22, 40, 0.12);
            border-radius: var(--radius-xs);
            font-family: inherit;
            font-size: 0.92rem;
            outline: none;
            transition: all 0.3s ease;
          }

          .form-control:focus {
            border-color: var(--color-gold);
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
          }

          .question-card {
            background: #fff;
            border-radius: var(--radius-sm);
            padding: 24px;
            border: 1px solid rgba(10, 22, 40, 0.05);
            box-shadow: var(--shadow-soft);
            margin-bottom: 20px;
            transition: all 0.3s ease;
          }

          .question-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(10, 22, 40, 0.06);
          }

          .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          @media (max-width: 576px) {
            .question-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }
          }

          .q-meta {
            font-size: 0.8rem;
            color: var(--color-grey-text);
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .q-category-tag {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .tag-sommeil { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
          .tag-stress { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
          .tag-attention { background: rgba(16, 185, 129, 0.1); color: #10B981; }
          .tag-hyperactivite { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

          .question-title {
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--color-navy);
            margin-bottom: 10px;
            line-height: 1.4;
          }

          .question-desc {
            font-size: 0.9rem;
            color: var(--color-grey-text);
            line-height: 1.5;
            margin-bottom: 20px;
            white-space: pre-wrap;
          }

          .vote-btn {
            background: var(--color-creme);
            border: 1px solid rgba(10, 22, 40, 0.08);
            border-radius: 50px;
            padding: 8px 18px;
            font-family: inherit;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--color-navy);
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .vote-btn:hover {
            border-color: var(--color-gold);
            background: rgba(212, 175, 55, 0.05);
            transform: scale(1.02);
          }

          .vote-btn.voted {
            background: var(--color-gold);
            color: var(--color-navy);
            border-color: var(--color-gold);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
          }

          .answer-block {
            background: var(--color-creme);
            border-left: 4px solid var(--color-gold);
            border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
            padding: 20px;
            margin-top: 20px;
          }

          .answer-author {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .author-photo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--color-navy);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-gold);
            font-weight: bold;
            font-size: 0.9rem;
            border: 2px solid var(--color-gold);
          }

          .author-info h4 {
            font-size: 0.88rem;
            font-weight: 700;
            margin: 0;
            color: var(--color-navy);
          }

          .author-info span {
            font-size: 0.72rem;
            color: var(--color-grey-text);
            font-weight: 600;
            text-transform: uppercase;
          }

          .answer-text {
            font-size: 0.9rem;
            color: var(--color-navy);
            line-height: 1.55;
            margin: 0;
          }

          .sidebar-widget {
            background: #fff;
            border-radius: var(--radius-md);
            padding: 25px;
            box-shadow: var(--shadow-soft);
            border: 1px solid rgba(10, 22, 40, 0.03);
            margin-bottom: 25px;
          }

          .sidebar-widget.navy-theme {
            background: var(--color-navy);
            color: #fff;
            border-top: 4px solid var(--color-gold);
          }

          .sidebar-widget h3 {
            font-family: var(--font-heading);
            font-size: 1.15rem;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .sidebar-widget.navy-theme h3 {
            color: var(--color-gold);
          }

          .sidebar-widget p {
            font-size: 0.88rem;
            line-height: 1.5;
            margin-bottom: 20px;
            color: var(--color-grey-text);
          }

          .sidebar-widget.navy-theme p {
            color: rgba(255, 255, 255, 0.8);
          }

          .widget-stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 15px;
            border-top: 1px solid rgba(10, 22, 40, 0.05);
            padding-top: 15px;
          }

          .widget-stat-item {
            text-align: center;
          }

          .widget-stat-num {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--color-gold);
          }

          .widget-stat-label {
            font-size: 0.72rem;
            color: var(--color-grey-text);
            text-transform: uppercase;
          }
        `}} />

        {/* HERO SECTION */}
        <section className="forum-hero">
          <div className="container">
            <h1>Le Forum des <span>Parents</span></h1>
            <p>
              Posez vos questions à Dr. Chadia Chakib et à nos praticiens certifiés. 
              Soutenez les questions les plus urgentes : celles qui reçoivent le plus d'intérêt sont résolues en priorité.
            </p>
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className="forum-container">
          {/* Left / Main feed */}
          <div>
            {/* Question Submission Box */}
            <div className="forum-card accent-gold">
              <h2>💡 Poser une question <span>aux professionnels</span></h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="qTitle">Votre question en une phrase simple</label>
                  <input
                    type="text"
                    id="qTitle"
                    className="form-control"
                    placeholder="Ex: Mon enfant n'arrive pas à s'endormir la veille des examens, que faire ?"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div className="form-group">
                    <label htmlFor="qCategory">Thématique</label>
                    <select
                      id="qCategory"
                      className="form-control"
                      value={qCategory}
                      onChange={(e) => setQCategory(e.target.value)}
                      required
                    >
                      <option value="sommeil">💤 Sommeil & Fatigue</option>
                      <option value="attention">🎯 Concentration & Focus</option>
                      <option value="stress">🧘 Stress & Anxiété Scolaire</option>
                      <option value="hyperactivite">🧠 Agitation & Hyperactivité</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingTop: "25px" }}>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        id="qAnonymous"
                        style={{ transform: "scale(1.2)" }}
                        checked={qAnonymous}
                        onChange={(e) => setQAnonymous(e.target.checked)}
                      />
                      <span>Publier anonymement</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="qDetails">Détails (Optionnel) — Décrivez les symptômes ou le contexte</label>
                  <textarea
                    id="qDetails"
                    rows={4}
                    className="form-control"
                    placeholder="Ex: Il a 16 ans, il révise tard mais au moment de dormir son cerveau tourne en boucle..."
                    value={qDetails}
                    onChange={(e) => setQDetails(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-navy" style={{ width: "100%", padding: "12px" }}>
                  Soumettre la question aux experts ➔
                </button>
              </form>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <button
                className={`filter-btn ${currentCategory === "all" ? "active" : ""}`}
                onClick={() => setCurrentCategory("all")}
              >
                Toutes les questions
              </button>
              <button
                className={`filter-btn ${currentCategory === "stress" ? "active" : ""}`}
                onClick={() => setCurrentCategory("stress")}
              >
                🧘 Stress & Anxiété
              </button>
              <button
                className={`filter-btn ${currentCategory === "sommeil" ? "active" : ""}`}
                onClick={() => setCurrentCategory("sommeil")}
              >
                💤 Sommeil
              </button>
              <button
                className={`filter-btn ${currentCategory === "attention" ? "active" : ""}`}
                onClick={() => setCurrentCategory("attention")}
              >
                🎯 Concentration
              </button>
              <button
                className={`filter-btn ${currentCategory === "hyperactivite" ? "active" : ""}`}
                onClick={() => setCurrentCategory("hyperactivite")}
              >
                🧠 Hyperactivité
              </button>
            </div>

            {/* Questions Area */}
            <div id="questionsContainerArea">
              {sortedAndFilteredQuestions.length === 0 ? (
                <div className="forum-card" style={{ textAlign: "center", color: "var(--color-grey-text)", padding: "40px 20px" }}>
                  Aucune question dans cette catégorie pour le moment. Soyez le premier à poser une question !
                </div>
              ) : (
                sortedAndFilteredQuestions.map((q) => {
                  const hasVoted = votedIds.includes(q.id);
                  const authorInitials = q.answer
                    ? q.answer.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                    : "";

                  return (
                    <div key={q.id} className="question-card">
                      <div className="question-header">
                        <div className="q-meta">
                          <span className={`q-category-tag tag-${q.category}`}>{getCategoryLabel(q.category)}</span>
                          <span>Par {q.author}</span>
                          <span>• Le {q.date}</span>
                        </div>
                        <button
                          className={`vote-btn ${hasVoted ? "voted" : ""}`}
                          onClick={() => handleVote(q.id)}
                        >
                          🔥 <span>{q.votes}</span> parents intéressés {hasVoted ? "✓" : ""}
                        </button>
                      </div>
                      <div className="question-title">{q.title}</div>
                      <div className="question-desc">{q.description}</div>

                      {q.answer ? (
                        <div className="answer-block">
                          <div className="answer-author">
                            <div className="author-photo">{authorInitials}</div>
                            <div className="author-info">
                              <h4>{q.answer.authorName}</h4>
                              <span>🏆 {q.answer.authorTitle}</span>
                            </div>
                          </div>
                          <p className="answer-text">{q.answer.text}</p>
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "rgba(245, 158, 11, 0.05)",
                            padding: "12px 18px",
                            borderRadius: "var(--radius-xs)",
                            border: "1px dashed rgba(245, 158, 11, 0.3)",
                            fontSize: "0.85rem",
                            color: "#b45309",
                            marginTop: "15px"
                          }}
                        >
                          ⏳ Cette question a suscité de l'intérêt. Notre équipe de praticiens y apportera une réponse certifiée d'ici peu.
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right / Sidebar */}
          <aside>
            {/* Conversion Card: Bilan cognitive fatigue */}
            <div className="sidebar-widget navy-theme">
              <h3>🧠 Évaluez la fatigue de votre enfant</h3>
              <p>
                Si votre enfant présente des signes d'anxiété ou des blocages dans ses études, son système nerveux est peut-être surchargé. 
                Faites notre test d'évaluation en 1 minute.
              </p>
              <a href="/brain-boost#quiz-section" className="btn btn-gold" style={{ width: "100%", textAlign: "center", display: "block" }}>
                Faire le test d'évaluation →
              </a>
            </div>

            {/* Conversion Card: WhatsApp consultation */}
            <div className="sidebar-widget">
              <h3>💬 Échange d'orientation gratuit</h3>
              <p>
                Parlez en toute discrétion à un praticien qualifié INFC pour faire un premier point sur les difficultés d'apprentissage de votre enfant.
              </p>
              <a
                href="https://wa.me/212622606009?text=Bonjour%2C%20je%20souhaite%20planifier%20un%20%C3%A9change%20d%27orientation%20suite%20aux%20questions%20du%20forum."
                target="_blank"
                rel="noreferrer"
                className="btn btn-navy"
                style={{ width: "100%", textAlign: "center", display: "block", background: "#25D366", borderColor: "#25D366" }}
              >
                Discuter sur WhatsApp ➔
              </a>
            </div>

            {/* Forum Stats */}
            <div className="sidebar-widget">
              <h3>📊 Activité de la Communauté</h3>
              <div className="widget-stat-grid">
                <div className="widget-stat-item">
                  <div className="widget-stat-num">{qCount}</div>
                  <div className="widget-stat-label">Sujets</div>
                </div>
                <div className="widget-stat-item">
                  <div className="widget-stat-num">{aCount}</div>
                  <div className="widget-stat-label">Réponses</div>
                </div>
              </div>
              <div className="widget-stat-grid" style={{ border: "none", paddingTop: "10px", marginTop: "5px" }}>
                <div className="widget-stat-item" style={{ gridColumn: "span 2" }}>
                  <div className="widget-stat-num" style={{ color: "var(--color-navy)" }}>{vCount}</div>
                  <div className="widget-stat-label">Parents engagés (votes)</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Reusable Toast Notification */}
        <Toast
          show={toast.show}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </main>
      <Footer />
    </>
  );
}
