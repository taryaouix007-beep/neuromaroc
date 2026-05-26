# Phase 2 — Dynamic Blog from Database

> **Priority**: 🔴 Critical  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 4–6 hours  
> **Prerequisites**: Phase 1 complete (Supabase running, `blog_posts` table seeded)

---

## Goal

Replace the hardcoded 3-article array in the blog page with a fully dynamic blog system powered by the local Supabase `blog_posts` table. Implement:
- Blog listing page with category filtering and pagination
- Individual blog post detail page (`/blog/[slug]`)
- Locale-aware content (fr, en, ar)
- SEO metadata per post

---

## Current State

**File**: `nextjs/src/app/[locale]/blog/page.tsx` (127 lines)

The blog page currently renders a hardcoded `articles[]` array of 3 items with:
- `id`, `icon`, `category`, `title`, `description`, `link: "#"`
- No dynamic routing — clicking "Lire l'article" goes nowhere
- No database connection
- No locale awareness (French only)

---

## Database Schema (Already Created)

Table `blog_posts` from migration `20260604000000_init_marketing_db.sql`:

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,            -- Rich HTML content
  locale TEXT NOT NULL DEFAULT 'fr' CHECK (locale IN ('fr', 'en', 'ar')),
  published_at TIMESTAMPTZ DEFAULT now(),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

RLS Policy (already applied):
```sql
CREATE POLICY "Allow public read blog posts" ON blog_posts 
  FOR SELECT USING (published_at <= now());
```

---

## Tasks

### 2.1 — Create Blog API Route
- `[ ]` **Create** `nextjs/src/app/api/blog/route.ts`
  
  This endpoint fetches published blog posts from Supabase, with optional filtering.

  ```typescript
  // GET /api/blog?locale=fr&category=Neuroscience&page=1&limit=10
  import { NextResponse } from "next/server";
  import { supabase } from "@/lib/supabase";

  export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const locale = searchParams.get("locale") || "fr";
      const category = searchParams.get("category");
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const offset = (page - 1) * limit;

      let query = supabase
        .from("blog_posts")
        .select("id, slug, icon, category, title, description, author_name, author_avatar, published_at", { count: "exact" })
        .eq("locale", locale)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error, count } = await query;

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        posts: data || [],
        meta: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  ```

### 2.2 — Create Blog Post Detail API Route
- `[ ]` **Create** `nextjs/src/app/api/blog/[slug]/route.ts`

  ```typescript
  // GET /api/blog/preparer-cerveau-examens?locale=fr
  import { NextResponse } from "next/server";
  import { supabase } from "@/lib/supabase";

  export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    try {
      const { slug } = await params;
      const { searchParams } = new URL(request.url);
      const locale = searchParams.get("locale") || "fr";

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("locale", locale)
        .lte("published_at", new Date().toISOString())
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: "Article non trouvé" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, post: data });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
  ```

### 2.3 — Rewrite Blog Listing Page
- `[ ]` **Rewrite** `nextjs/src/app/[locale]/blog/page.tsx`

  **Key changes**:
  1. Mark as `"use client"` (already a client component pattern in this project)
  2. Fetch posts from `/api/blog?locale=<current-locale>` on mount
  3. Add category filter tabs (all categories extracted from posts)
  4. Add pagination (if > 10 posts)
  5. Each card links to `/${locale}/blog/${slug}`
  6. Show loading skeleton while fetching
  7. Fallback to empty state if no posts found

  **Design Reference**: Keep the existing card design from the current static implementation (rounded cards, icons, categories). Enhance with:
  - Published date display
  - Author name
  - Read time estimate (based on content length)
  - Category filter chips at the top
  - Animate cards on load with a fade-in

### 2.4 — Create Blog Detail Page
- `[ ]` **Create** `nextjs/src/app/[locale]/blog/[slug]/page.tsx`

  This is a new dynamic route that renders a single blog post.

  **Structure**:
  ```
  <Header />
  <main>
    <article>
      <div class="blog-hero">
        <span class="category-badge">{post.category}</span>
        <h1>{post.title}</h1>
        <div class="meta">
          <span>By {post.author_name}</span>
          <span>{formatted date}</span>
          <span>{read time} min read</span>
        </div>
      </div>
      <div class="blog-content" 
           dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      <div class="blog-footer">
        <Link href={`/${locale}/blog`}>← Retour au blog</Link>
        <!-- Share buttons (WhatsApp, copy link) -->
      </div>
    </article>
  </main>
  <Footer />
  ```

  **Styling**:
  - Use the site's design system (CSS variables: `--color-navy`, `--color-gold`, `--color-creme`, etc.)
  - Rich content styling: style `h2`, `h3`, `p`, `ul`, `li`, `blockquote` within `.blog-content`
  - Add a reading progress bar at the top
  - Responsive: single column on mobile, comfortable max-width on desktop (700-800px)

### 2.5 — Add i18n Support for Blog UI
- `[ ]` **Update dictionary files** to add blog UI translations:

  **File**: `nextjs/src/dictionaries/fr.json` — Add:
  ```json
  {
    "blog": {
      "title": "Blog & Ressources",
      "subtitle": "Articles et guides sur le neurofeedback, la régulation émotionnelle et la performance cognitive",
      "allCategories": "Tous",
      "readMore": "Lire l'article",
      "readTime": "min de lecture",
      "backToBlog": "← Retour au blog",
      "noArticles": "Aucun article pour le moment.",
      "publishedOn": "Publié le",
      "shareArticle": "Partager cet article",
      "by": "Par"
    }
  }
  ```

  **File**: `nextjs/src/dictionaries/ar.json` — Add equivalent Arabic translations  
  **File**: `nextjs/src/dictionaries/en.json` — Add equivalent English translations

### 2.6 — SEO Metadata for Blog Pages
- `[ ]` **Add metadata generation** for the blog listing and detail pages

  For the detail page, consider generating dynamic `<title>` and `<meta description>` from the post data. Since this project uses client components (`"use client"`), you may need to use `document.title` or a `<Head>` equivalent.

  Alternatively, if converting to Server Components is feasible:
  ```typescript
  // In a generateMetadata function (Server Component approach)
  export async function generateMetadata({ params }) {
    const post = await fetchPost(params.slug, params.locale);
    return {
      title: `${post.title} | INFC Blog`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.published_at,
      },
    };
  }
  ```

  > **Note**: The current project uses `"use client"` for most pages. If SEO is critical for blog posts (it is), consider making the blog detail page a Server Component and only wrapping interactive parts (share buttons, etc.) in client boundaries.

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/src/app/api/blog/route.ts` | CREATE | Blog listing API with filtering & pagination |
| `nextjs/src/app/api/blog/[slug]/route.ts` | CREATE | Blog detail API by slug |
| `nextjs/src/app/[locale]/blog/page.tsx` | REWRITE | Dynamic blog listing from Supabase |
| `nextjs/src/app/[locale]/blog/[slug]/page.tsx` | CREATE | Blog detail page with rich content rendering |
| `nextjs/src/dictionaries/fr.json` | MODIFY | Add blog UI translations |
| `nextjs/src/dictionaries/en.json` | MODIFY | Add blog UI translations |
| `nextjs/src/dictionaries/ar.json` | MODIFY | Add blog UI translations |

---

## Verification Checklist

- `[ ]` Blog listing page loads posts from database (not hardcoded)
- `[ ]` Category filter tabs work correctly
- `[ ]` Clicking a blog card navigates to `/blog/[slug]`
- `[ ]` Blog detail page renders HTML content correctly
- `[ ]` "Back to blog" link works
- `[ ]` Blog works in all 3 locales (fr, en, ar)
- `[ ]` Empty state is shown when no posts match a filter
- `[ ]` Page loads without errors in the browser console
- `[ ]` Blog post URL is shareable and SEO-friendly
