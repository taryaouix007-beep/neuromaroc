# Phase 8 — Admin Panel

> **Priority**: 🟢 Medium  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 8–12 hours  
> **Prerequisites**: Phase 1, Phase 2 (blog), Phase 5 (franchise auth system)

---

## Goal

Build an admin interface for INFC staff to manage content without touching code:
- Write, edit, and publish blog posts (with rich text editor)
- Moderate forum questions (approve, reject, answer)
- View and manage contact submissions and leads
- Manage newsletter subscribers

---

## Architecture Decision

**Two options**:

1. **Built-in Admin Pages** (Recommended for MVP) — Admin routes within the same Next.js app at `/{locale}/admin/*`, protected by Supabase Auth with an `admin` role check.

2. **Supabase Studio** — Use the built-in Supabase Studio (`localhost:54323`) for direct database management. Zero development effort but not user-friendly for non-technical staff.

**Recommendation**: Start with Option 1 (built-in) for blog and forum moderation. Use Supabase Studio for advanced queries and data inspection.

---

## Tasks

### 8.1 — Admin Auth & Layout
- `[ ]` **Create admin layout**: `nextjs/src/app/[locale]/admin/layout.tsx`

  This layout wraps all admin pages with:
  - Auth check (redirect to login if not authenticated)
  - Role check (must be `admin` role in `franchise_profiles`)
  - Admin sidebar navigation
  - Admin header with user info and logout

  ```typescript
  "use client";
  import { useEffect, useState } from "react";
  import { getSupabaseBrowser } from "@/lib/supabase-browser";
  import { useRouter } from "next/navigation";

  export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthed, setIsAuthed] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = getSupabaseBrowser();

    useEffect(() => {
      const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/fr/franchise-dashboard"); // Redirect to login
          return;
        }
        // Check admin role
        const { data: profile } = await supabase
          .from("franchise_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role !== "admin") {
          router.push("/fr/franchise-dashboard");
          return;
        }
        setIsAuthed(true);
        setLoading(false);
      };
      checkAuth();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (!isAuthed) return null;

    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav>
            <a href="/fr/admin">📊 Dashboard</a>
            <a href="/fr/admin/blog">📝 Blog</a>
            <a href="/fr/admin/forum">💬 Forum</a>
            <a href="/fr/admin/contacts">📞 Contacts</a>
            <a href="/fr/admin/newsletter">📬 Newsletter</a>
            <a href="/fr/admin/leads">🧬 Medical Leads</a>
          </nav>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    );
  }
  ```

### 8.2 — Blog Management
- `[ ]` **Create** `nextjs/src/app/[locale]/admin/blog/page.tsx` — Blog posts list

  Features:
  - Table view of all blog posts (title, category, locale, published date, status)
  - "New Post" button
  - Edit and Delete actions
  - Filter by locale and category
  - Publish/Unpublish toggle (set `published_at` to now or null)

- `[ ]` **Create** `nextjs/src/app/[locale]/admin/blog/new/page.tsx` — Create new post

  Features:
  - Title input
  - Slug auto-generation from title (editable)
  - Category dropdown
  - Locale selector (fr, en, ar)
  - Icon picker (emoji)
  - Description textarea (short summary)
  - **Rich text editor** for content body

  **Rich Text Editor Options** (choose one):
  - **`@tiptap/react`** — Modern, extensible, great React integration
  - **`react-quill`** — Simple, well-known, but heavier
  - **`textarea` with Markdown** — Simplest, convert Markdown → HTML on save
  
  > Recommendation: Use a `<textarea>` with Markdown for the MVP. It's the simplest to implement and requires no additional dependencies. Convert Markdown to HTML when saving to the database using a library like `marked` or `markdown-it`.

  ```typescript
  // Simple Markdown editor with preview
  const [markdown, setMarkdown] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  // On save, convert to HTML:
  const html = marked.parse(markdown);
  await supabase.from("blog_posts").insert({ content: html, ... });
  ```

- `[ ]` **Create** `nextjs/src/app/[locale]/admin/blog/[id]/edit/page.tsx` — Edit existing post

- `[ ]` **Create admin API routes**:
  - `nextjs/src/app/api/admin/blog/route.ts` — CRUD operations with auth check
    - GET: List all posts (including drafts)
    - POST: Create new post
    - PATCH: Update post
    - DELETE: Delete post

  All admin API routes must verify the Supabase session and admin role.

### 8.3 — Forum Moderation
- `[ ]` **Create** `nextjs/src/app/[locale]/admin/forum/page.tsx`

  Features:
  - List of pending questions (approved = false)
  - Approve / Reject buttons
  - Answer form (for practitioners to respond directly)
  - View approved questions and their answers
  - Delete inappropriate content

- `[ ]` **Create API routes**:
  - `nextjs/src/app/api/admin/forum/route.ts`
    - GET: List all questions (including unapproved)
    - PATCH: Approve/reject question, update votes
    - DELETE: Delete question
    - POST: Add practitioner answer

  **RLS policy update needed** — Add a service-role bypass for admin operations:
  ```sql
  -- Admin can read all forum questions (including unapproved)
  CREATE POLICY "Admin can read all questions"
    ON forum_questions FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin' OR approved = true);
  ```

  > Alternatively, use the `service_role` key in admin API routes to bypass RLS entirely.

### 8.4 — Contact Submissions Viewer
- `[ ]` **Create** `nextjs/src/app/[locale]/admin/contacts/page.tsx`

  Features:
  - Table of all contact form submissions
  - Sort by date, city
  - Filter by city
  - Mark as "contacted" / "pending" (add a `status` column to `contact_submissions`)
  - Export to CSV

  **Migration needed**:
  ```sql
  ALTER TABLE contact_submissions 
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'contacted', 'converted', 'spam'));
  ```

### 8.5 — Newsletter Management
- `[ ]` **Create** `nextjs/src/app/[locale]/admin/newsletter/page.tsx`

  Features:
  - List all subscribers with date
  - Total count
  - Export to CSV (for importing into Mailchimp, SendGrid, etc.)
  - Delete/unsubscribe individual entries

### 8.6 — Medical Leads Viewer
- `[ ]` **Create** `nextjs/src/app/[locale]/admin/leads/page.tsx`

  Features:
  - Table of medical professional access requests
  - Filter by specialty
  - Mark as "responded" / "pending"
  - Same pattern as contacts viewer

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/src/app/[locale]/admin/layout.tsx` | CREATE | Admin layout with auth + sidebar |
| `nextjs/src/app/[locale]/admin/page.tsx` | CREATE | Admin dashboard overview |
| `nextjs/src/app/[locale]/admin/blog/page.tsx` | CREATE | Blog posts list |
| `nextjs/src/app/[locale]/admin/blog/new/page.tsx` | CREATE | Create new blog post |
| `nextjs/src/app/[locale]/admin/blog/[id]/edit/page.tsx` | CREATE | Edit blog post |
| `nextjs/src/app/[locale]/admin/forum/page.tsx` | CREATE | Forum moderation |
| `nextjs/src/app/[locale]/admin/contacts/page.tsx` | CREATE | Contact submissions viewer |
| `nextjs/src/app/[locale]/admin/newsletter/page.tsx` | CREATE | Newsletter subscribers |
| `nextjs/src/app/[locale]/admin/leads/page.tsx` | CREATE | Medical leads viewer |
| `nextjs/src/app/api/admin/blog/route.ts` | CREATE | Blog CRUD API |
| `nextjs/src/app/api/admin/forum/route.ts` | CREATE | Forum admin API |
| `nextjs/supabase/migrations/20260607000000_admin_enhancements.sql` | CREATE | Status columns, admin RLS policies |

---

## Verification Checklist

- `[ ]` Admin pages are only accessible to authenticated admin users
- `[ ]` Non-admin franchise users cannot access admin pages
- `[ ]` Blog CRUD works (create, edit, publish, delete)
- `[ ]` Forum moderation works (approve, reject, answer, delete)
- `[ ]` Contact submissions display correctly with status management
- `[ ]` Newsletter subscriber list and export works
- `[ ]` Medical leads display correctly
- `[ ]` Admin sidebar navigation works across all admin pages
