"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Idea {
  id: string;
  title: string;
  category: string;
  description: string;
}

const defaultIdeas: Idea[] = [
  {
    id: "default-1",
    title: '🎁 Stratégie de Giveaway : Étude de Cas "Brain Boost" parents',
    category: "cat-giveaway",
    description: "Offrir le pack Brain Boost à 2 parents tirés au sort. Conditions de participation : passer le test d'évaluation de la fatigue cognitive en laissant leur WhatsApp. Ensuite, documenter et partager publiquement l'évolution des 2 gagnants sur nos réseaux sociaux pour fidéliser et convertir le reste des participants."
  },
  {
    id: "default-2",
    title: '🔍 GEO : Implémenter le format "Answer-First" (40-60 mots) sur les FAQs',
    category: "cat-geo",
    description: "Adapter la section FAQ de la page d'accueil pour que chaque réponse commence par une phrase synthétique claire de 40-60 mots (idéal pour l'extraction de SearchGPT / Perplexity), suivie d'un bouton d'expansion s'ils veulent lire plus."
  },
  {
    id: "default-3",
    title: '📊 Meta Ads : Lancer le créatif "Option A" (Question simple textuelle)',
    category: "cat-ads",
    description: "Créer un visuel 100% textuel (fond Navy, typo Or) avec l'accroche : 'Votre enfant révise beaucoup mais retient peu ? Il y a une raison neurologique à cela. Téléchargez notre guide d'accompagnement.' Rediriger le trafic directement vers le formulaire WhatsApp."
  },
  {
    id: "default-4",
    title: '📊 UX : Intégrer Microsoft Clarity pour analyser les blocages des visiteurs',
    category: "cat-ads",
    description: "Intégrer le script de tracking gratuit de Microsoft Clarity sur la landing page. L'objectif est d'enregistrer les sessions utilisateurs et de générer des heatmaps pour repérer précisément où les visiteurs bloquent, cliquent, ou abandonnent dans le tunnel de conversion (notamment sur le questionnaire et la section d'évaluation)."
  },
  {
    id: "default-5",
    title: '🔗 SEO/GEO : Référencement IA par backlinks & présence LinkedIn B2B',
    category: "cat-geo",
    description: "Mettre en place la stratégie d'acquisition de backlinks d'autorité pour SearchGPT/Perplexity (Reddit, Quora, presse marocaine, liens universitaires .edu/.ma) combinée à une présence B2B active sur LinkedIn (ciblant les Peak Performers et les prescripteurs médicaux de Casablanca/Marrakech) pour dominer les recommandations IA."
  }
];

const geoGuides: Record<number, { title: string; body: React.ReactNode }> = {
  1: {
    title: "Be The Cited Source",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Pour être cité comme source par SearchGPT ou Perplexity, nous devons publier des articles de blog originaux étayés par des chiffres précis et des études cliniques (ex: citer l'institut Zengar ou des études médicales sur le TDAH). Les moteurs de recherche IA priorisent les sites qui fournissent des données brutes et fiables.
        </p>
      </>
    )
  },
  2: {
    title: "Citation Frequency",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Plus nous sommes mentionnés sur d'autres sites, plus nous sommes crédibles pour l'IA. Pour cela, nous devons activer la stratégie B2B (Partenariats avec les écoles privées à Casablanca, Marrakech) et s'assurer que notre marque est citée dans la presse marocaine ou sur des blogs éducatifs locaux avec des liens (backlinks).
        </p>
      </>
    )
  },
  3: {
    title: "More Zero-Click Searches",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          L'internaute n'a plus besoin de cliquer. Il demande 'Comment calmer le stress des examens d'un enfant à Casablanca ?' et l'IA répond directement. Nous devons nous assurer que la réponse de l'IA mentionne 'le centre INFC du Dr. Chakib'. Pour cela, nous optimisons nos fiches Google My Business et insérons des mots-clés de géolocalisation clairs dans nos balises meta.
        </p>
      </>
    )
  },
  4: {
    title: "Answer-First, 40-60 Words",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Les LLMs extraient des blocs d'informations courts. Chaque question de notre page FAQ sur le site doit commencer par un paragraphe concis de 40 à 60 mots résumant la réponse exacte, sans jargon. <br />
          <strong>Exemple :</strong> <em>Le neurofeedback chez INFC est un entraînement cérébral naturel et non invasif qui apprend au cerveau à s'auto-réguler grâce au retour d'information en temps réel. Il permet d'améliorer durablement la concentration et le sommeil des élèves.</em>
        </p>
      </>
    )
  },
  5: {
    title: "Third-Party Mentions",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Les moteurs de recherche génératifs lisent les avis externes. Encouragez activement chaque parent à laisser un avis détaillé sur Google Maps après leur séance découverte. L'IA va scanner ces avis ('très bonne écoute du Dr. Chakib', 'amélioration des notes') et les synthétiser pour recommander notre centre.
        </p>
      </>
    )
  },
  6: {
    title: "Shorter Buying Journeys",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Les prospects utilisent l'IA pour comparer les options en 30 secondes. En fournissant sur notre site un tableau comparatif transparent ou des étapes claires de notre parcours patient ('Parcours Équilibre'), nous aidons l'IA à résumer notre parcours pour le présenter directement à l'internaute comme le choix le plus structuré et le plus premium.
        </p>
      </>
    )
  },
  7: {
    title: "Higher Intent Traffic",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Le trafic issu des moteurs de recherche IA est déjà qualifié par l'algorithme. Pour accueillir ce trafic premium, notre Landing Page <code>/brain-boost</code> dispose d'un premier CTA focalisé sur la valeur (le Guide d'accompagnement) et d'un test d'orientation personnalisé pour capter immédiatement leurs coordonnées et déclencher l'appel découverte.
        </p>
      </>
    )
  },
  8: {
    title: "Extraction + Structure",
    body: (
      <>
        <h4>Comment faire :</h4>
        <p style={{ marginTop: "10px" }}>
          Intégrer du code JSON-LD (Schema.org) dans l'en-tête de toutes nos pages web. Ce code invisible permet aux robots des moteurs de recherche IA de comprendre instantanément que le Dr. Chadia Chakib est une clinicienne spécialisée en neurofeedback, et que l'INFC est un établissement physique d'orientation cognitive avec 4 adresses au Maroc.
        </p>
      </>
    )
  }
};

export default function IdeesPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  // Form Fields
  const [titleInput, setTitleInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("cat-giveaway");
  const [descriptionInput, setDescriptionInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("infc_ideas");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Check for auto-migration of newly added defaults in defaults list
          let updated = false;
          const currentList = [...parsed];
          ["default-4", "default-5"].forEach((defaultId) => {
            if (!currentList.some((idea) => idea.id === defaultId)) {
              const defaultObj = defaultIdeas.find((idea) => idea.id === defaultId);
              if (defaultObj) {
                currentList.push(defaultObj);
                updated = true;
              }
            }
          });
          if (updated) {
            setIdeas(currentList);
            localStorage.setItem("infc_ideas", JSON.stringify(currentList));
          } else {
            setIdeas(parsed);
          }
        } catch {
          setIdeas(defaultIdeas);
          localStorage.setItem("infc_ideas", JSON.stringify(defaultIdeas));
        }
      } else {
        setIdeas(defaultIdeas);
        localStorage.setItem("infc_ideas", JSON.stringify(defaultIdeas));
      }
    }
  }, []);

  const saveToLocalStorage = (updatedIdeas: Idea[]) => {
    setIdeas(updatedIdeas);
    if (typeof window !== "undefined") {
      localStorage.setItem("infc_ideas", JSON.stringify(updatedIdeas));
    }
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !descriptionInput.trim()) return;

    const newIdea: Idea = {
      id: "idea-" + Date.now(),
      title: titleInput.trim(),
      category: categoryInput,
      description: descriptionInput.trim(),
    };

    const updated = [newIdea, ...ideas];
    saveToLocalStorage(updated);

    // Reset Form
    setTitleInput("");
    setDescriptionInput("");
    setCategoryInput("cat-giveaway");
  };

  const handleDeleteIdea = (id: string) => {
    const updated = ideas.filter((idea) => idea.id !== id);
    saveToLocalStorage(updated);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      if (confirm("Voulez-vous réinitialiser le tableau aux idées d'origine ? Vos modifications personnelles seront perdues.")) {
        saveToLocalStorage(defaultIdeas);
      }
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === "cat-geo") return "🔍 GEO / Référencement IA";
    if (cat === "cat-giveaway") return "🎁 Giveaway & Collecte";
    if (cat === "cat-ads") return "📊 Campagne & Ads";
    return "🧠 Stratégie & Autre";
  };

  const getCategoryColor = (cat: string) => {
    if (cat === "cat-geo") return "var(--color-gold)";
    if (cat === "cat-giveaway") return "#25D366";
    if (cat === "cat-ads") return "var(--color-navy)";
    return "#FF9800";
  };

  const getCategoryBadgeClass = (cat: string) => {
    if (cat === "cat-geo") return "cat-geo";
    if (cat === "cat-giveaway") return "cat-giveaway";
    if (cat === "cat-ads") return "cat-ads";
    return "cat-other";
  };

  const activeModalData = activeModalId !== null ? geoGuides[activeModalId] : null;

  return (
    <>
      <Header />
      <main className="dashboard-container">
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            background-color: var(--color-creme);
          }
          .dashboard-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
          }
          .header-dashboard {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 2px solid rgba(10, 22, 40, 0.05);
            padding-bottom: 20px;
          }
          @media (max-width: 576px) {
            .header-dashboard {
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
            }
          }
          .header-dashboard h1 {
            font-size: 2.2rem;
            color: var(--color-navy);
          }
          .header-dashboard h1 span {
            color: var(--color-gold);
          }
          
          .grid-layout {
            display: grid;
            grid-template-columns: 1.2fr 1.8fr;
            gap: 30px;
          }
          @media (max-width: 992px) {
            .grid-layout {
              grid-template-columns: 1fr;
            }
          }
          
          .glass-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 30px;
            box-shadow: var(--shadow-soft);
            border-top: 4px solid var(--color-gold);
            height: fit-content;
          }
          .glass-card h2 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--color-navy);
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            font-family: var(--font-heading);
            font-weight: 600;
            color: var(--color-navy);
            margin-bottom: 8px;
            font-size: 0.95rem;
          }
          .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid rgba(10, 22, 40, 0.08);
            border-radius: var(--radius-sm);
            font-family: var(--font-body);
            font-size: 1rem;
            background-color: var(--color-creme);
            transition: all 0.3s;
            color: var(--color-navy);
          }
          .form-control:focus {
            outline: none;
            border-color: var(--color-gold);
            background-color: #fff;
          }
          
          .ideas-board {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .idea-item {
            background: #fff;
            border-radius: var(--radius-md);
            padding: 24px;
            box-shadow: var(--shadow-soft);
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            border-left: 5px solid var(--color-navy);
          }
          .idea-item:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-hover);
          }
          .idea-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
          .idea-category {
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: 50px;
            display: inline-block;
          }
          .cat-geo { background: rgba(212, 175, 55, 0.15); color: #8e7215; border-left: 3px solid var(--color-gold); }
          .cat-giveaway { background: rgba(37, 211, 102, 0.15); color: #1c9e4b; border-left: 3px solid #25D366; }
          .cat-ads { background: rgba(10, 22, 40, 0.08); color: var(--color-navy); border-left: 3px solid var(--color-navy); }
          .cat-other { background: rgba(255, 152, 0, 0.15); color: #c47500; border-left: 3px solid #FF9800; }
          
          .idea-title {
            font-size: 1.25rem;
            color: var(--color-navy);
            font-weight: 700;
            margin-top: 5px;
          }
          .idea-body {
            font-size: 0.95rem;
            color: var(--color-grey-text);
            line-height: 1.6;
          }
          .idea-actions {
            margin-top: 15px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }
          .btn-delete {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 0.9rem;
            cursor: pointer;
            font-weight: 600;
            padding: 5px 10px;
            border-radius: var(--radius-sm);
            transition: all 0.3s;
          }
          .btn-delete:hover {
            background: rgba(239, 68, 68, 0.08);
          }
          
          .geo-framework {
            background: var(--color-navy);
            border-radius: var(--radius-lg);
            padding: 40px;
            color: #fff;
            margin-top: 50px;
            box-shadow: var(--shadow-hover);
          }
          .geo-framework h2 {
            color: #fff;
            font-size: 1.8rem;
            margin-bottom: 10px;
          }
          .geo-framework h2 span {
            color: var(--color-gold);
          }
          .geo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
            margin-top: 30px;
          }
          .geo-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: var(--radius-md);
            padding: 20px;
            transition: all 0.3s;
            cursor: pointer;
          }
          .geo-card:hover {
            background: rgba(212, 175, 55, 0.08);
            border-color: var(--color-gold);
            transform: translateY(-3px);
          }
          .geo-num {
            background: var(--color-gold);
            color: var(--color-navy);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.9rem;
            margin-bottom: 15px;
          }
          .geo-card h3 {
            color: var(--color-gold);
            font-size: 1.15rem;
            margin-bottom: 8px;
          }
          .geo-card p {
            color: rgba(255,255,255,0.8);
            font-size: 0.9rem;
            margin: 0;
          }
          
          .geo-modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10, 22, 40, 0.6);
            backdrop-filter: blur(5px);
            z-index: 2000;
            align-items: center;
            justify-content: center;
          }
          .geo-modal.active {
            display: flex;
          }
          .modal-content {
            background: #fff;
            border-radius: var(--radius-lg);
            width: 90%;
            max-width: 600px;
            padding: 40px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.3);
            position: relative;
          }
          .modal-close {
            position: absolute;
            top: 20px; right: 20px;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-navy);
            background: none;
            border: none;
          }
        `}} />

        <div className="header-dashboard">
          <div>
            <h1>La Boîte à Idées <span>INFC</span></h1>
            <p>Capturez vos stratégies de croissance, de marketing et d'optimisation GEO avant de les oublier.</p>
          </div>
          <button onClick={handleReset} className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
            Réinitialiser les idées d'origine
          </button>
        </div>

        <div className="grid-layout">
          {/* Add Idea Form */}
          <div className="glass-card">
            <h2>💡 Noter une nouvelle idée</h2>
            <form onSubmit={handleAddIdea}>
              <div className="form-group">
                <label htmlFor="ideaTitle">Titre de l'idée</label>
                <input
                  type="text"
                  id="ideaTitle"
                  className="form-control"
                  placeholder="Ex: Lancer un challenge 7 jours WhatsApp"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ideaCategory">Catégorie stratégique</label>
                <select
                  id="ideaCategory"
                  className="form-control"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  required
                >
                  <option value="cat-giveaway">🎁 Giveaway &amp; Collecte de Données</option>
                  <option value="cat-geo">🔍 GEO (AI Search Optimization)</option>
                  <option value="cat-ads">📊 Acquisition &amp; Ads (Meta/Google)</option>
                  <option value="cat-other">🧠 Stratégie &amp; Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ideaDescription">Description / Plan d'Action</label>
                <textarea
                  id="ideaDescription"
                  rows={6}
                  className="form-control"
                  placeholder="Décrivez en détail la mécanique, le but et les étapes clés..."
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: "100%" }}>
                Enregistrer l'idée ➔
              </button>
            </form>
          </div>

          {/* Ideas Board */}
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "10px" }}>
              📋 Vos Idées Enregistrées (<span>{ideas.length}</span>)
            </h2>
            <div className="ideas-board">
              {ideas.length === 0 ? (
                <div className="idea-item" style={{ borderLeftColor: "var(--color-grey-text)", textAlign: "center", padding: "40px" }}>
                  <p style={{ fontSize: "1.2rem", color: "var(--color-grey-text)" }}>
                    Aucune idée enregistrée pour le moment. Rédigez votre première idée sur la gauche !
                  </p>
                </div>
              ) : (
                ideas.map((idea) => (
                  <div key={idea.id} className="idea-item" style={{ borderLeftColor: getCategoryColor(idea.category) }}>
                    <div className="idea-header">
                      <div className={`idea-category ${getCategoryBadgeClass(idea.category)}`}>
                        {getCategoryLabel(idea.category)}
                      </div>
                      <button onClick={() => handleDeleteIdea(idea.id)} className="btn-delete">
                        Supprimer ×
                      </button>
                    </div>
                    <div className="idea-title">{idea.title}</div>
                    <div className="idea-body" style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
                      {idea.description}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* GEO / New AI Search Wheel Implementation Guide */}
        <div className="geo-framework">
          <h2>Le Framework <span>GEO</span> (Generative Engine Optimization)</h2>
          <p>
            Comment positionner INFC en haut des réponses de Perplexity, SearchGPT, Gemini et ChatGPT Search. 
            Cliquez sur chaque pilier pour voir la méthode d'implémentation sur notre site web.
          </p>
          
          <div className="geo-grid">
            {Object.keys(geoGuides).map((pillarKey) => {
              const num = parseInt(pillarKey);
              const guide = geoGuides[num];
              return (
                <div key={num} className="geo-card" onClick={() => setActiveModalId(num)}>
                  <div className="geo-num">{num}</div>
                  <h3>{guide.title}</h3>
                  <p>
                    {num === 1 && "Les IA résument les réponses et affichent un petit set de sources. Être cité est la clé."}
                    {num === 2 && "Le nombre de citations de la marque sur le web devient le signal SEO numéro 1."}
                    {num === 3 && "Optimiser pour capter l'intérêt même si l'utilisateur ne visite pas le site web."}
                    {num === 4 && "Formater les réponses clés sous forme d'extraits courts et structurés de 40 à 60 mots."}
                    {num === 5 && "Les IA se basent sur les forums, avis Google et répertoires indépendants."}
                    {num === 6 && "L'IA raccourcit le parcours de décision en comparant tout instantanément."}
                    {num === 7 && "Les visiteurs venant d'une recommandation IA ont une intention d'achat 3x supérieure."}
                    {num === 8 && "Utiliser des schémas JSON-LD précis et des structures sémantiques claires pour les robots."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* GEO Modals */}
      <div className={`geo-modal ${activeModalId !== null ? "active" : ""}`} onClick={() => setActiveModalId(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setActiveModalId(null)}>
            ×
          </button>
          {activeModalId !== null && activeModalData && (
            <>
              <div className="geo-num">{activeModalId}</div>
              <h2 style={{ color: "var(--color-navy)", marginBottom: "15px" }}>{activeModalData.title}</h2>
              <div style={{ color: "var(--color-grey-text)", lineHeight: 1.6 }}>{activeModalData.body}</div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
