# 🧠 INFC neuromaroc.com — Full Implementation Roadmap

> **Master Document** — Start here. This file links to each phase of the project with status tracking.

---

## Project Summary

**Goal**: Transform `neuromaroc.com` from a static marketing website into a fully functional, production-ready web application with:
- ✅ Real database-backed forms (contact, newsletter, medical leads)
- ✅ Dynamic community forum with moderation
- 🔲 Dynamic blog from database (currently hardcoded)
- 🔲 Secured patient portal integrated with XpRia cabinet APIs
- 🔲 Online booking flow integrated with XpRia
- 🔲 Franchise dashboard with authentication
- 🔲 SEO optimization and production deployment
- 🔲 Admin panel for content management

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                  CLIENT BROWSER                      │
│         Next.js 16 App (neuromaroc.com)              │
│  Pages: Home, Blog, Forum, Portal, Contact, Centres  │
└──────────────┬──────────────────────┬────────────────┘
               │                      │
    ┌──────────▼──────────┐  ┌───────▼────────────────┐
    │  LOCAL SUPABASE DB  │  │  XPRIA CABINET API     │
    │  (Marketing Data)   │  │  (localhost:3000)       │
    │                     │  │                         │
    │  • contact_subs     │  │  • Portal Auth (JWT)    │
    │  • newsletter_subs  │  │  • Appointments CRUD    │
    │  • medical_leads    │  │  • Availability         │
    │  • forum_questions  │  │  • Booking              │
    │  • forum_answers    │  │  • Intake Forms         │
    │  • blog_posts       │  │  • Practice Info        │
    └─────────────────────┘  └─────────────────────────┘
```

---

## Current Tech Stack

| Layer         | Technology                     | Version  |
|---------------|-------------------------------|----------|
| Framework     | Next.js (App Router)           | 16.2.6   |
| React         | React                          | 19.2.4   |
| Database      | Supabase (local)               | Latest   |
| Styling       | CSS + Tailwind (minimal use)   | v4       |
| Charts        | Chart.js + react-chartjs-2     | v4/v5    |
| i18n          | Custom LanguageContext          | Custom   |
| Cabinet API   | XpRia MVP (xperMVP repo)       | In dev   |

---

## Current Status Audit

| Page/Feature                | Status        | Data Source              | Notes                                           |
|-----------------------------|---------------|--------------------------|--------------------------------------------------|
| **Homepage** (`/`)          | ✅ Done       | i18n JSON + static       | Newsletter + Medical lead → Supabase             |
| **Neurofeedback** (`/nf`)   | ✅ Done       | Static                   | Informational page, no backend needed            |
| **Programmes**              | ✅ Done       | Static                   | Informational page                               |
| **About** (`/apropos`)      | ✅ Done       | Static                   | Informational page                               |
| **Brain Boost Quiz**        | ✅ Done       | Client-side              | Quiz results not saved to DB yet                 |
| **Success Stories**         | ✅ Done       | Static                   | Hardcoded testimonials                           |
| **Tarifs** (Pricing)        | ✅ Done       | Static                   | Static pricing cards                             |
| **Contact** (`/contact`)    | ✅ Connected  | API → Supabase           | Saves to `contact_submissions` table             |
| **Newsletter** (Footer)     | ✅ Connected  | API → Supabase           | Saves to `newsletter_subscribers` table          |
| **Medical Lead** (Home)     | ✅ Connected  | API → Supabase           | Saves to `medical_leads` table                   |
| **Forum** (`/forum`)        | ✅ Connected  | API → Supabase           | CRUD with moderation, votes, answers             |
| **Blog** (`/blog`)          | ⚠️ Static    | Hardcoded array          | 3 mock articles, no dynamic routing, no DB       |
| **Patient Portal** (`/portal`) | ⚠️ UI Only | Calls XpRia APIs         | UI built, but XpRia portal APIs need testing     |
| **Centres** (`/centres`)    | ⚠️ Static    | Hardcoded                | No booking integration, no dynamic data          |
| **Franchise Dashboard**     | ❌ Placeholder| Static placeholder       | No auth, no analytics, no functionality          |
| **Ideas** (`/idees`)        | ⚠️ Unknown   | Unknown                  | Page exists, needs review                        |

---

## Phase Roadmap

| Phase | Document | Priority | Status | Description |
|-------|----------|----------|--------|-------------|
| 1 | [01_DATABASE_SETUP.md](./01_DATABASE_SETUP.md) | 🔴 Critical | `[x]` | Apply migration, seed data, verify Supabase local |
| 2 | [02_BLOG_DYNAMIC.md](./02_BLOG_DYNAMIC.md) | 🔴 Critical | `[x]` | Dynamic blog from Supabase, detail pages, SEO |
| 3 | [03_PATIENT_PORTAL.md](./03_PATIENT_PORTAL.md) | 🔴 Critical | `[ ]` | Secure auth, session mgmt, XpRia API integration |
| 4 | [04_BOOKING_INTEGRATION.md](./04_BOOKING_INTEGRATION.md) | 🟡 High | `[ ]` | Online booking from centres page via XpRia |
| 5 | [05_FRANCHISE_DASHBOARD.md](./05_FRANCHISE_DASHBOARD.md) | 🟡 High | `[ ]` | Authenticated franchise portal with analytics |
| 6 | [06_QUIZ_LEAD_CAPTURE.md](./06_QUIZ_LEAD_CAPTURE.md) | 🟢 Medium | `[x]` | Save Brain Boost quiz results to DB |
| 7 | [07_SEO_AND_METADATA.md](./07_SEO_AND_METADATA.md) | 🟢 Medium | `[x]` | SEO, OG tags, structured data, sitemap |
| 8 | [08_ADMIN_PANEL.md](./08_ADMIN_PANEL.md) | 🟢 Medium | `[ ]` | Admin UI for blog, forum moderation, contacts |
| 9 | [09_EMAIL_NOTIFICATIONS.md](./09_EMAIL_NOTIFICATIONS.md) | 🟢 Medium | `[ ]` | Email/SMS/WhatsApp notifications |
| 10 | [10_PRODUCTION_DEPLOY.md](./10_PRODUCTION_DEPLOY.md) | 🔴 Critical | `[ ]` | Vercel deploy, Supabase cloud, env config |

---

## Environment Variables Reference

```bash
# Local Supabase (Marketing DB — contacts, blog, forum)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>  # For admin/server ops

# XpRia Cabinet API (Patient Portal, Booking, Appointments)
NEXT_PUBLIC_XPRIA_API_URL=http://localhost:3000
NEXT_PUBLIC_XPRIA_API_KEY=<your-xpria-api-key>

# Portal JWT Secret (must match xperMVP's PORTAL_JWT_SECRET)
PORTAL_JWT_SECRET=<shared-secret>

# Production (Vercel)
NEXT_PUBLIC_WEBSITE_STATUS=online
```

---

## Key Repository Paths

| Path | Description |
|------|-------------|
| `nextjs/src/app/[locale]/` | All page routes (locale-aware) |
| `nextjs/src/app/api/` | Next.js API routes (contact, newsletter, forum, medical-lead) |
| `nextjs/src/components/` | Shared components (Header, Footer, Toast, EEGVisualizer, etc.) |
| `nextjs/src/lib/supabase.ts` | Supabase client singleton |
| `nextjs/src/context/LanguageContext.tsx` | i18n context provider |
| `nextjs/src/dictionaries/` | Translation files (fr.json, en.json, ar.json) |
| `nextjs/supabase/migrations/` | SQL migration files |
| `nextjs/.env.local` | Environment variables |

---

## XpRia Portal API Endpoints (from xperMVP repo)

These are the backend endpoints the patient portal calls:

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/portal/auth/init` | API Key | Start auth challenge (phone SMS or email magic link) |
| POST | `/api/v1/portal/auth/verify` | API Key | Verify OTP code or booking ref |
| GET | `/api/v1/portal/auth/callback` | — | Magic link callback |
| GET | `/api/v1/portal/appointments` | API Key + JWT | List patient appointments |
| PATCH | `/api/v1/portal/appointments` | API Key + JWT | Cancel or reschedule appointment |
| GET | `/api/v1/portal/availability?date=YYYY-MM-DD` | API Key | Get available time slots |
| POST | `/api/v1/portal/book` | API Key | Submit new booking (guest allowed) |
| POST | `/api/v1/portal/intake` | API Key + JWT | Submit intake questionnaire |
| GET | `/api/v1/portal/practice` | API Key | Get practice/cabinet info |

---

## How to Use This Roadmap

1. **Start with Phase 1** — Get the local Supabase database running and verified
2. **Work phases sequentially** — Each phase builds on the previous
3. **Each file is self-contained** — Contains tasks, subtasks, file references, code hints, and verification steps
4. **Track progress** — Use the checkbox format `[ ]` → `[/]` → `[x]`
5. **For AI agents** — Each task includes enough context (file paths, code snippets, API contracts) to implement without additional research
