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
  content: string;
  author_name: string;
  author_avatar?: string;
  published_at: string;
  relatedPosts?: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    author_name: string;
    published_at: string;
  }>;
}

export default function BlogDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug, locale]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}?locale=${locale}`, {
        cache: "no-cache",
      });

      if (!response.ok) throw new Error("Post not found");

      const result = await response.json();
      if (result.success) {
        setPost(result.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Article not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ padding: "2rem", textAlign: "center" }}>
          Chargement de l'article...
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Article non trouvé</h1>
          <Link href={`/${locale}/blog`}>
            <button className="btn btn-outline">Retour aux articles</button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <style dangerouslySetInnerHTML={{ __html: `
          .blog-detail-hero {
            background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
          }
          .blog-detail-hero h1 {
            color: white;
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          .blog-detail-meta {
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 1rem;
            opacity: 0.9;
            flex-wrap: wrap;
          }
          .blog-detail-content {
            max-width: 800px;
            margin: 3rem auto;
            padding: 0 1rem;
          }
          .blog-detail-content h2 {
            color: var(--color-navy);
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.8rem;
          }
          .blog-detail-content h3 {
            color: var(--color-navy);
            margin-top: 1.5rem;
            margin-bottom: 0.8rem;
            font-size: 1.3rem;
          }
          .blog-detail-content p {
            color: var(--color-grey-text);
            line-height: 1.8;
            margin-bottom: 1rem;
          }
          .blog-detail-content ul, .blog-detail-content ol {
            margin: 1rem 0 1rem 2rem;
            color: var(--color-grey-text);
            line-height: 1.8;
          }
          .blog-detail-content li {
            margin-bottom: 0.5rem;
          }
          .blog-detail-content blockquote {
            border-left: 4px solid var(--color-gold);
            padding-left: 1.5rem;
            margin: 2rem 0;
            color: var(--color-navy);
            font-style: italic;
          }
          .blog-back-button {
            text-align: center;
            margin: 3rem 0;
          }
          .blog-related {
            max-width: 1200px;
            margin: 4rem auto;
            padding: 0 1rem;
          }
          .blog-related h2 {
            text-align: center;
            color: var(--color-navy);
            margin-bottom: 2rem;
          }
          .related-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
          }
          .related-card {
            background: var(--color-white);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-soft);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
          }
          .related-card:hover {
            transform: translateY(-5px);
          }
          .related-card-img {
            height: 150px;
            background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-gold);
            font-size: 2.5rem;
          }
          .related-card-content {
            padding: 1.5rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }
          .related-card-content h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
            color: var(--color-navy);
          }
          .related-card-content p {
            font-size: 0.9rem;
            flex-grow: 1;
            margin-bottom: 1rem;
          }
          .related-card a {
            color: var(--color-gold);
            text-decoration: none;
            font-weight: bold;
          }
        `}} />

        {/* Hero Section */}
        <div className="blog-detail-hero">
          <div className="container">
            <h1>{post.icon} {post.title}</h1>
            <div className="blog-detail-meta">
              <span>{post.category}</span>
              <span>Par {post.author_name}</span>
              <span>{new Date(post.published_at).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="blog-detail-content">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ color: "var(--color-grey-text)", lineHeight: "1.8" }}
          />
        </div>

        {/* Back Button */}
        <div className="blog-back-button">
          <Link href={`/${locale}/blog`}>
            <button className="btn btn-outline">← Retour aux articles</button>
          </Link>
        </div>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="blog-related">
            <h2>Articles Similaires</h2>
            <div className="related-grid">
              {post.relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="related-card">
                    <div className="related-card-img">{relatedPost.icon}</div>
                    <div className="related-card-content">
                      <h3>{relatedPost.title}</h3>
                      <p>{relatedPost.description}</p>
                      <a href="#">Lire →</a>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
