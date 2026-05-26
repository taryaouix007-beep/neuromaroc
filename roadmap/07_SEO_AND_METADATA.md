# Phase 7 — SEO & Metadata Optimization

> **Priority**: 🟢 Medium  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 4–6 hours  
> **Prerequisites**: Phase 2 (blog pages), ideally all content pages finalized

---

## Goal

Implement comprehensive SEO across all pages: proper title tags, meta descriptions, Open Graph / Twitter cards, structured data (JSON-LD), XML sitemap, and robots.txt. This is critical for organic search visibility in Morocco (Google.ma) and AI search engines.

---

## Current State

**File**: `nextjs/src/app/[locale]/layout.tsx`

The layout currently has:
- Basic `<title>` and `<meta description>` set in the layout
- No per-page metadata
- No Open Graph tags
- No structured data (JSON-LD)
- No sitemap
- No robots.txt

---

## Tasks

### 7.1 — Root Layout Metadata
- `[ ]` **Modify** `nextjs/src/app/[locale]/layout.tsx`

  Add comprehensive default metadata that all pages inherit:
  ```typescript
  export const metadata = {
    metadataBase: new URL("https://neuromaroc.com"),
    title: {
      default: "INFC Maroc — Neurofeedback NeurOptimal® | Casablanca, Marrakech, Tanger, Kénitra",
      template: "%s | INFC Maroc",
    },
    description: "Premier réseau marocain de centres de Neurofeedback NeurOptimal®. Régulation cérébrale naturelle pour le stress, l'attention, le sommeil et la performance cognitive.",
    keywords: [
      "neurofeedback", "neuroptimal", "maroc", "casablanca", "marrakech", "tanger",
      "stress", "concentration", "sommeil", "TDAH", "anxiété", "performance cognitive",
      "régulation cérébrale", "INFC", "neurofeedback maroc"
    ],
    authors: [{ name: "INFC Maroc" }],
    openGraph: {
      type: "website",
      locale: "fr_MA",
      url: "https://neuromaroc.com",
      siteName: "INFC Maroc — Neurofeedback NeurOptimal®",
      title: "INFC Maroc — Neurofeedback NeurOptimal®",
      description: "Premier réseau marocain de centres de Neurofeedback NeurOptimal®.",
      images: [
        {
          url: "/assets/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "INFC Maroc Neurofeedback",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "INFC Maroc — Neurofeedback NeurOptimal®",
      description: "Régulation cérébrale naturelle pour le stress, la concentration et le sommeil.",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "https://neuromaroc.com",
      languages: {
        "fr": "https://neuromaroc.com/fr",
        "ar": "https://neuromaroc.com/ar",
        "en": "https://neuromaroc.com/en",
      },
    },
  };
  ```

  > **Note**: Since most pages are `"use client"`, metadata export won't work directly. The layout.tsx should be converted to a Server Component (remove `"use client"`) for metadata to work. The `LanguageProvider` can be a separate client wrapper.

### 7.2 — Per-Page Metadata
- `[ ]` Add `metadata` or `generateMetadata` to each page:

  | Page | Title | Description |
  |------|-------|-------------|
  | `/` (Home) | `INFC Maroc — Neurofeedback NeurOptimal®` | Premier réseau marocain de centres de Neurofeedback... |
  | `/neurofeedback` | `Qu'est-ce que le Neurofeedback ? — Explication scientifique` | Comprenez comment le Neurofeedback NeurOptimal® régule... |
  | `/programmes` | `Programmes de Neurofeedback — Enfants, Adultes, Performers` | Découvrez nos programmes adaptés à chaque profil... |
  | `/centres` | `Nos Centres — Casablanca, Marrakech, Tanger, Kénitra` | Trouvez le centre INFC le plus proche de chez vous... |
  | `/contact` | `Contactez-nous — Échange d'orientation personnalisé` | Prenez contact avec nos praticiens certifiés... |
  | `/blog` | `Blog & Ressources — Articles sur le Neurofeedback` | Articles et guides sur le neurofeedback... |
  | `/blog/[slug]` | `{post.title}` (dynamic) | `{post.description}` (dynamic) |
  | `/forum` | `Forum Parents — Questions & Réponses` | Posez vos questions et consultez les réponses... |
  | `/portal` | `Espace Patient — Portail Sécurisé INFC` | Accédez à vos rendez-vous... |
  | `/tarifs` | `Tarifs Neurofeedback — Forfaits et Prix` | Découvrez nos forfaits de séances... |
  | `/brain-boost` | `Brain Boost — Test Cognitif Gratuit` | Évaluez gratuitement les capacités cognitives... |
  | `/apropos` | `À Propos d'INFC Maroc — Notre Histoire` | Découvrez l'histoire d'INFC... |
  | `/success-stories` | `Témoignages — Histoires de Réussite INFC` | Lisez les témoignages de nos clients... |

### 7.3 — Structured Data (JSON-LD)
- `[ ]` **Create** `nextjs/src/components/JsonLd.tsx`

  ```typescript
  export function OrganizationJsonLd() {
    const data = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": "INFC Maroc",
      "url": "https://neuromaroc.com",
      "logo": "https://neuromaroc.com/assets/images/logo-infc.png",
      "description": "Premier réseau marocain de centres de Neurofeedback NeurOptimal®",
      "foundingDate": "2012",
      "founder": {
        "@type": "Person",
        "name": "Dr. Chadia Chakib"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Morocco"
      },
      "address": [
        {
          "@type": "PostalAddress",
          "addressLocality": "Casablanca",
          "streetAddress": "Nº12 2ème étage, Immeuble Living office 362 BD Ghandi Oasis",
          "addressCountry": "MA"
        }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+212-522-991-783",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.facebook.com/INFCMaroc",
        "https://www.instagram.com/infc_maroc"
      ]
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }

  export function LocalBusinessJsonLd({ centre }: { centre: CentreData }) {
    // Generate per-centre structured data
    const data = {
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      "name": `INFC ${centre.name}`,
      "address": { "@type": "PostalAddress", ... },
      "telephone": centre.phone,
      "openingHours": "Mo-Sa 09:00-19:00",
      "priceRange": "$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150"
      }
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
  }

  export function BlogPostJsonLd({ post }: { post: BlogPost }) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.description,
      "author": { "@type": "Person", "name": post.author_name },
      "datePublished": post.published_at,
      "publisher": {
        "@type": "Organization",
        "name": "INFC Maroc",
        "logo": { "@type": "ImageObject", "url": "https://neuromaroc.com/assets/images/logo-infc.png" }
      }
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
  }

  export function FAQJsonLd({ questions }: { questions: ForumQuestion[] }) {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions
        .filter(q => q.answer)
        .map(q => ({
          "@type": "Question",
          "name": q.title,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer!.text
          }
        }))
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
  }
  ```

- `[ ]` **Add structured data to pages**:
  - Homepage → `OrganizationJsonLd`
  - Centres page → `LocalBusinessJsonLd` for each centre
  - Blog post detail → `BlogPostJsonLd`
  - Forum → `FAQJsonLd` for answered questions

### 7.4 — XML Sitemap
- `[ ]` **Create** `nextjs/src/app/sitemap.ts`

  ```typescript
  import { supabase } from "@/lib/supabase";
  import type { MetadataRoute } from "next";

  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://neuromaroc.com";
    const locales = ["fr", "ar", "en"];
    const staticPages = [
      "", "/neurofeedback", "/programmes", "/centres", "/contact",
      "/blog", "/forum", "/tarifs", "/brain-boost", "/apropos",
      "/success-stories", "/portal"
    ];

    // Static pages for each locale
    const staticEntries = locales.flatMap(locale =>
      staticPages.map(page => ({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: page === "" ? 1.0 : 0.8,
      }))
    );

    // Dynamic blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, locale, published_at")
      .lte("published_at", new Date().toISOString());

    const blogEntries = (posts || []).map(post => ({
      url: `${baseUrl}/${post.locale}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticEntries, ...blogEntries];
  }
  ```

### 7.5 — Robots.txt
- `[ ]` **Create** `nextjs/src/app/robots.ts`

  ```typescript
  import type { MetadataRoute } from "next";

  export default function robots(): MetadataRoute.Robots {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/franchise-dashboard/"],
        },
      ],
      sitemap: "https://neuromaroc.com/sitemap.xml",
    };
  }
  ```

### 7.6 — Create OG Image
- `[ ]` **Create or generate** a default Open Graph image at `nextjs/public/assets/images/og-image.jpg`
  - Dimensions: 1200x630px
  - Content: INFC logo, tagline "Neurofeedback NeurOptimal® au Maroc", brand colors

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/src/app/[locale]/layout.tsx` | MODIFY | Add root metadata |
| `nextjs/src/components/JsonLd.tsx` | CREATE | Structured data components |
| `nextjs/src/app/sitemap.ts` | CREATE | Dynamic XML sitemap |
| `nextjs/src/app/robots.ts` | CREATE | Robots.txt configuration |
| `nextjs/public/assets/images/og-image.jpg` | CREATE | Default OG image |
| All page files | MODIFY | Add per-page metadata |

---

## Verification Checklist

- `[ ]` Each page has a unique `<title>` and `<meta description>`
- `[ ]` Open Graph tags present (test with https://opengraph.dev)
- `[ ]` JSON-LD structured data validates (test with https://validator.schema.org)
- `[ ]` `/sitemap.xml` returns valid XML with all pages + blog posts
- `[ ]` `/robots.txt` blocks `/api/` and `/franchise-dashboard/`
- `[ ]` `hreflang` alternate links present for all 3 locales
- `[ ]` Blog post pages have dynamic, post-specific metadata
- `[ ]` Google Search Console can crawl and index pages (post-deployment)
