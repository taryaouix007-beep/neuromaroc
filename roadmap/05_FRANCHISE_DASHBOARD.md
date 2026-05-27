# Phase 5 — Franchise Dashboard

> **Priority**: 🟡 High  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 10–14 hours  
> **Prerequisites**: Phase 1 (database), XpRia backend running

---

## Goal

Build a fully functional, authenticated franchise dashboard at `/franchise-dashboard` where INFC centre managers can:
- Log in securely (Supabase Auth)
- View their centre's analytics (sessions, revenue, clients)
- Access downloadable resources (marketing kits, protocols)
- Manage their team and training hours

---

## Current State

**File**: `nextjs/src/app/[locale]/franchise-dashboard/page.tsx`

Currently a **static placeholder page** with no authentication, no real data, and no functionality. It needs a complete rewrite.

---

## Architecture Decision

The franchise dashboard uses a **different auth system** than the patient portal:
- **Patient Portal** → XpRia Portal JWT (phone/email/booking ref — no Supabase account)
- **Franchise Dashboard** → **Supabase Auth** (email/password login — requires a Supabase `auth.users` account)

This is because franchise managers need persistent accounts with roles, permissions, and audit trails.

---

## Tasks

### 5.1 — Database Schema for Franchise Data
- `[ ]` **Create new migration**: `nextjs/supabase/migrations/20260605000000_franchise_schema.sql`

  ```sql
  -- Franchise manager profiles (linked to Supabase Auth users)
  CREATE TABLE franchise_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    centre_name TEXT NOT NULL,       -- e.g., "INFC Casablanca"
    centre_slug TEXT NOT NULL,       -- e.g., "casablanca"
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('manager', 'admin', 'viewer')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- Franchise resources/documents
  CREATE TABLE franchise_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('marketing', 'protocol', 'formation', 'legal', 'template')),
    file_url TEXT NOT NULL,           -- Supabase Storage URL
    file_type TEXT DEFAULT 'pdf',     -- pdf, docx, xlsx, etc.
    centre_slug TEXT,                 -- null = available to all centres
    created_at TIMESTAMPTZ DEFAULT now()
  );

  -- RLS Policies
  ALTER TABLE franchise_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE franchise_resources ENABLE ROW LEVEL SECURITY;

  -- Profiles: Users can only read their own profile
  CREATE POLICY "Users can read own profile"
    ON franchise_profiles FOR SELECT
    USING (auth.uid() = id);

  -- Resources: Authenticated users can read resources for their centre or global resources
  CREATE POLICY "Users can read resources"
    ON franchise_resources FOR SELECT
    USING (
      centre_slug IS NULL
      OR centre_slug = (
        SELECT centre_slug FROM franchise_profiles WHERE id = auth.uid()
      )
    );
  ```

### 5.2 — Create Supabase Auth Helpers
- `[ ]` **Create** `nextjs/src/lib/supabase-server.ts`

  Server-side Supabase client with service role key for admin operations:
  ```typescript
  import { createClient } from "@supabase/supabase-js";

  export function createServiceClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  ```

- `[ ]` **Create** `nextjs/src/lib/supabase-browser.ts`

  Browser-side Supabase client for auth operations:
  ```typescript
  import { createClient } from "@supabase/supabase-js";

  let client: ReturnType<typeof createClient> | null = null;

  export function getSupabaseBrowser() {
    if (!client) {
      client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    return client;
  }
  ```

### 5.3 — Create Auth API Routes
- `[ ]` **Create** `nextjs/src/app/api/franchise/login/route.ts`
  ```typescript
  import { NextResponse } from "next/server";
  import { createClient } from "@supabase/supabase-js";

  export async function POST(request: Request) {
    const { email, password } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    // Fetch franchise profile
    const { data: profile } = await supabase
      .from("franchise_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Aucun profil franchise trouvé pour ce compte." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      profile,
    });
  }
  ```

- `[ ]` **Create** `nextjs/src/app/api/franchise/analytics/route.ts`

  This endpoint fetches analytics from the XpRia backend for the franchise manager's centre:
  ```typescript
  // GET /api/franchise/analytics
  // Headers: Authorization: Bearer <supabase-access-token>
  // Returns: Revenue, sessions, clients, NPS data
  ```

  > **Design Decision**: Analytics can come from either:
  > 1. **XpRia API** — If the xperMVP backend exposes franchise analytics endpoints
  > 2. **Direct Supabase queries** — If analytics data is stored in the local Supabase
  > 3. **Mock data** — Start with mock data to build the UI, then connect to real data later
  >
  > Recommendation: Start with mock data (option 3) and evolve.

### 5.4 — Rewrite Franchise Dashboard Page
- `[ ]` **Rewrite** `nextjs/src/app/[locale]/franchise-dashboard/page.tsx`

  **Views**:
  1. **Login View** — Email/password form with Supabase Auth
  2. **Dashboard View** — KPI cards, charts, quick links
  3. **Resources View** — Downloadable documents by category

  **Dashboard Layout**:
  ```
  ┌─────────────────────────────────────────────────┐
  │  Header with centre name + logout button        │
  ├──────────────┬──────────────────────────────────┤
  │  Sidebar     │  Main Content                    │
  │  • Tableau   │  ┌──────┐ ┌──────┐ ┌──────┐    │
  │  • Ressources│  │ Rev  │ │ Cli  │ │ Sess │    │
  │  • Équipe    │  │ Card │ │ Card │ │ Card │    │
  │  • Formation │  └──────┘ └──────┘ └──────┘    │
  │              │                                  │
  │              │  ┌──────────────────────────────┐│
  │              │  │  Weekly Sessions Chart       ││
  │              │  └──────────────────────────────┘│
  │              │                                  │
  │              │  ┌──────────────────────────────┐│
  │              │  │  Recent Activity Feed        ││
  │              │  └──────────────────────────────┘│
  └──────────────┴──────────────────────────────────┘
  ```

  **KPI Cards** (with mock data initially):
  - 💰 Chiffre d'affaires du mois — `145,000 MAD` (+9.8%)
  - 👥 Clients actifs — `42`
  - 🧠 Séances effectuées — `184`
  - ⭐ Score NPS — `4.9/5`

  **Charts** (using Chart.js / react-chartjs-2, already installed):
  - Line chart: Weekly sessions trend
  - Bar chart: Revenue by month (last 6 months)

### 5.5 — Resources Section
- `[ ]` **Add downloadable resources UI**:
  - Categorized by: Marketing, Protocols, Formation, Legal, Templates
  - Each resource card shows: title, description, file type icon, download button
  - Fetch from `franchise_resources` table

- `[ ]` **Seed sample resources** in `seed.sql`:
  ```sql
  INSERT INTO franchise_resources (title, description, category, file_url, file_type) VALUES
  ('Kit Marketing 2026', 'Templates réseaux sociaux, flyers, et affiches', 'marketing', '/assets/docs/marketing-kit-2026.pdf', 'pdf'),
  ('Protocole NeurOptimal® V3', 'Guide complet du protocole de séance standard', 'protocol', '/assets/docs/protocol-v3.pdf', 'pdf'),
  ('Module Formation Praticien', 'Support de formation initiale pour les nouveaux praticiens', 'formation', '/assets/docs/formation-praticien.pdf', 'pdf');
  ```

### 5.6 — Seed Test Franchise User
- `[ ]` **Create a test franchise user** via Supabase Dashboard or SQL:

  ```sql
  -- First, create the auth user (via Supabase Dashboard → Authentication → Add User)
  -- Then create the franchise profile:
  INSERT INTO franchise_profiles (id, full_name, centre_name, centre_slug, role, phone)
  VALUES (
    '<auth-user-uuid>',           -- Replace with the UUID from auth.users
    'Rachid Admin',
    'INFC Casablanca',
    'casablanca',
    'admin',
    '+212622606011'
  );
  ```

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/supabase/migrations/20260605000000_franchise_schema.sql` | CREATE | DB schema for franchise profiles & resources |
| `nextjs/src/lib/supabase-server.ts` | CREATE | Server-side Supabase client |
| `nextjs/src/lib/supabase-browser.ts` | CREATE | Browser-side Supabase client for auth |
| `nextjs/src/app/api/franchise/login/route.ts` | CREATE | Franchise auth endpoint |
| `nextjs/src/app/api/franchise/analytics/route.ts` | CREATE | Analytics data endpoint |
| `nextjs/src/app/[locale]/franchise-dashboard/page.tsx` | REWRITE | Full dashboard with auth, KPIs, charts |
| `nextjs/supabase/seed.sql` | MODIFY | Add franchise resources seed data |

---

## Verification Checklist

- `[ ]` Migration applies without errors
- `[ ]` Test user can log in with email/password
- `[ ]` Dashboard shows KPI cards with data
- `[ ]` Charts render correctly (Chart.js)
- `[ ]` Resources list loads from database
- `[ ]` Logout works and redirects to login
- `[ ]` Unauthorized access redirects to login
- `[ ]` RLS prevents users from seeing other centres' data
- `[ ]` Mobile responsive layout
