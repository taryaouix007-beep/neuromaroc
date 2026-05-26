"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  slug: string;
  icon: string;
  category: string;
  title: string;
  description: string;
  author_name: string;
  published_at: string;
}

interface ApiResponse {
  success: boolean;
  data: BlogPost[];
  pagination: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function BlogPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [locale, selectedCategory, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        locale: locale || "fr",
        page: currentPage.toString(),
        limit: "10",
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(`/api/blog?${params}`, {
        cache: "no-cache",
      });

      if (!response.ok) throw new Error("Failed to fetch posts");
      
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setPosts(result.data);
        setTotalPages(result.pagination.totalPages);
        
        if (currentPage === 1) {
          const uniqueCategories = Array.from(
            new Set(result.data.map(p => p.category))
          );
          setCategories(uniqueCategories);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

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
            margin-bottom: 0.5rem;
            flex-grow: 1;
            color: var(--color-grey-text);
            font-size: 0.95rem;
          }
          .blog-meta {
            font-size: 0.85rem;
            color: var(--color-grey-text);
            margin-bottom: 1rem;
          }
          .category-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
            justify-content: center;
          }
          .category-btn {
            padding: 0.5rem 1.2rem;
            border: 2px solid var(--color-gold);
            background: transparent;
            color: var(--color-gold);
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }
          .category-btn:hover,
          .category-btn.active {
            background: var(--color-gold);
            color: var(--color-navy);
          }
          .pagination {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
          }
          .pagination button {
            padding: 0.5rem 1rem;
            border: 1px solid var(--color-gold);
            background: transparent;
            color: var(--color-gold);
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          .pagination button:hover:not(:disabled) {
            background: var(--color-gold);
            color: var(--color-navy);
          }
          .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .loading {
            text-align: center;
            padding: 2rem;
            color: var(--color-navy);
          }
          .error {
            text-align: center;
            padding: 2rem;
            color: #d32f2f;
          }
          .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--color-navy);
          }
          .blog-card a {
            text-decoration: none !important;
            color: inherit;
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
            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="category-filters">
                <button
                  className={`category-btn ${!selectedCategory ? "active" : ""}`}
                  onClick={() => handleCategoryChange("")}
                >
                  Tous les articles
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {loading && <div className="loading">Chargement des articles...</div>}

            {/* Error State */}
            {error && <div className="error">{error}</div>}

            {/* Posts Grid */}
            {!loading && !error && posts.length > 0 && (
              <>
                <div className="card-grid">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${locale}/blog/${post.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="blog-card">
                        <div className="blog-img">{post.icon}</div>
                        <div className="blog-content">
                          <div className="blog-category">{post.category}</div>
                          <h3>{post.title}</h3>
                          <p>{post.description}</p>
                          <div className="blog-meta">
                            Par {post.author_name} • {new Date(post.published_at).toLocaleDateString("fr-FR")}
                          </div>
                          <button className="btn btn-outline" style={{ textAlign: "center", marginTop: "auto" }}>
                            Lire l'article
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Précédent
                    </button>
                    <span style={{ alignSelf: "center", color: "var(--color-navy)" }}>
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && !error && posts.length === 0 && (
              <div className="empty-state">
                <p>Aucun article trouvé.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
