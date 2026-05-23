import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Article {
  id: number;
  icon: string;
  category: string;
  title: string;
  description: string;
  link: string;
}

const articles: Article[] = [
  {
    id: 1,
    icon: "📚",
    category: "Guide Pratique",
    title: "Préparer le cerveau pour les examens",
    description: "Ce que la neuroscience nous apprend vraiment sur la surcharge cognitive, l'attention et la mémoire des étudiants.",
    link: "#"
  },
  {
    id: 2,
    icon: "🧠",
    category: "Neuroscience",
    title: "Régulation vs Correction",
    description: "Pourquoi l'approche neuro-sensible privilégie l'auto-organisation du cerveau plutôt que la correction forcée.",
    link: "#"
  },
  {
    id: 3,
    icon: "💤",
    category: "Bien-être",
    title: "L'impact du bruit mental sur le sommeil",
    description: "Découvrez comment la réduction du chaos interne favorise un sommeil profond et réparateur.",
    link: "#"
  }
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <style dangerouslySetInnerHTML={{ __html: `
          .blog-card {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-soft);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .blog-card:hover {
            transform: translateY(-5px);
          }
          .blog-img {
            height: 200px;
            background-color: var(--color-navy-light);
            background-image: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-gold);
            font-size: 3rem;
          }
          .blog-content {
            padding: 2rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }
          .blog-category {
            color: var(--color-gold);
            font-size: 0.85rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 1rem;
          }
          .blog-content h3 {
            margin-bottom: 1rem;
            font-size: 1.3rem;
            color: var(--color-navy);
          }
          .blog-content p {
            margin-bottom: 1.5rem;
            flex-grow: 1;
            color: var(--color-grey-text);
          }
        `}} />

        <section className="hero fade-in" style={{ padding: "80px 0" }}>
          <div className="container">
            <h1>Ressources &amp; Articles</h1>
            <p>Comprendre le fonctionnement de son cerveau pour mieux l'accompagner.</p>
          </div>
        </section>

        <section className="section bg-creme fade-in">
          <div className="container">
            <div className="card-grid">
              {articles.map((article) => (
                <div key={article.id} className="blog-card">
                  <div className="blog-img">{article.icon}</div>
                  <div className="blog-content">
                    <div className="blog-category">{article.category}</div>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <a href={article.link} className="btn btn-outline" style={{ textAlign: "center" }}>
                      Lire l'article
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
