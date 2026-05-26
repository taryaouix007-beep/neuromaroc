# Phase 1 — Database Setup & Verification

> **Priority**: 🔴 Critical  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 1–2 hours  
> **Prerequisites**: Docker running, `supabase init` already done

---

## Goal

Ensure the local Supabase instance is running and the marketing database schema is applied with seed data. All existing API routes (`/api/contact`, `/api/newsletter`, `/api/medical-lead`, `/api/forum`) should work end-to-end against real PostgreSQL tables.

---

## Tasks

### 1.1 — Start Local Supabase
- `[ ]` **Run `supabase start`** from `nextjs/` directory
  ```bash
  cd /Users/macbook/Dev/GitHub/INFC/neuromaroc.com/nextjs
  supabase start
  ```
- `[ ]` **Verify output** contains:
  - `API URL: http://127.0.0.1:54321`
  - `anon key: ...`
  - `service_role key: ...`
  - `Studio URL: http://127.0.0.1:54323`
- `[ ]` **Update `.env.local`** with the exact `anon key` from the output
  - File: `nextjs/.env.local`
  - Set: `NEXT_PUBLIC_SUPABASE_ANON_KEY=<exact-key-from-output>`
  - Also add: `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>` (needed for admin operations later)

### 1.2 — Apply Database Migration
- `[ ]` **Check if migration was already applied**:
  ```bash
  supabase migration list
  ```
- `[ ]` If the migration `20260604000000_init_marketing_db.sql` shows as NOT applied, run:
  ```bash
  supabase db reset
  ```
  This applies all migrations in `supabase/migrations/` from scratch.

- `[ ]` **Verify tables exist** — Open Supabase Studio at `http://127.0.0.1:54323` or run:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name;
  ```
  Expected tables:
  - `contact_submissions`
  - `newsletter_subscribers`
  - `medical_leads`
  - `forum_questions`
  - `forum_answers`
  - `blog_posts`

### 1.3 — Verify RLS Policies
- `[ ]` Confirm RLS is enabled on all tables:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```
  All should show `rowsecurity = true`.

- `[ ]` Test that anonymous inserts work (since frontend uses anon key):
  ```sql
  -- Test via Supabase client or API call
  INSERT INTO contact_submissions (name, phone, city, message)
  VALUES ('Test User', '+212600000000', 'casablanca', 'Test message');
  ```

### 1.4 — Seed Forum with Sample Data
- `[ ]` **Create seed file**: `nextjs/supabase/seed.sql`
  
  This file should contain the default forum Q&A data that is currently hardcoded in the forum page component (`nextjs/src/app/[locale]/forum/page.tsx` lines 25–160).

  ```sql
  -- Seed Forum Questions
  INSERT INTO forum_questions (title, description, category, author_name, votes, approved) VALUES
  (
    'Mon enfant a des maux de ventre réguliers avant de partir à l''école le matin. Comment l''aider ?',
    'Il a 12 ans, ses notes sont correctes mais l''approche du collège l''angoisse énormément, au point de pleurer ou d''avoir des nausées certains matins. Nous avons vu un pédiatre, il n''y a rien de physiologique.',
    'stress',
    'Khadija (Maman de Rayane)',
    54,
    true
  ),
  (
    'Difficulté de concentration : mon fils de 15 ans décroche après 10 minutes d''études.',
    'Pendant les devoirs, il s''agite, vérifie son téléphone ou regarde par la fenêtre. Il prétend vouloir travailler mais n''y arrive pas. Est-ce un TDAH ou simplement de la fatigue ?',
    'attention',
    'Youssef B. (Casablanca)',
    42,
    true
  );

  -- Seed corresponding Forum Answers
  INSERT INTO forum_answers (question_id, author_name, author_title, text)
  SELECT id, 'Dr. Chadia Chakib', 'Fondatrice d''INFC Maroc',
    'Bonjour Khadija. Les maux de ventre matinaux sans cause physiologique sont des somatisations courantes d''un système nerveux en mode alerte (suractivation du système sympathique). La surcharge émotionnelle inhibe la digestion. Notre approche de régulation neuro-sensible aide le cerveau à stabiliser ses réponses face aux déclencheurs de stress, lui réapprenant à rester calme. En parallèle, je vous conseille de mettre en place une routine d''ancrage tactile de 2 minutes au réveil (toucher un objet froid, respiration calme) pour ramener l''attention dans le corps.'
  FROM forum_questions WHERE category = 'stress' LIMIT 1;

  INSERT INTO forum_answers (question_id, author_name, author_title, text)
  SELECT id, 'Rachid A.', 'Praticien Certifié INFC Casablanca',
    'Bonjour Youssef. Ce que vous décrivez est très fréquent et ne signifie pas automatiquement un TDAH. Le cerveau adolescent subit des restructurations massives, notamment au niveau du cortex préfrontal — la zone de l''attention volontaire. Quand cette zone est sous-alimentée en ondes bêta stables, toute stimulation externe (téléphone, bruit) devient une échappatoire involontaire.'
  FROM forum_questions WHERE category = 'attention' LIMIT 1;
  ```

- `[ ]` **Apply seed data**:
  ```bash
  supabase db reset  # This will re-apply migrations AND seed.sql
  ```

### 1.5 — Seed Blog with Sample Posts
- `[ ]` Add blog seed data to the same `seed.sql` file:

  ```sql
  -- Seed Blog Posts (migrated from the hardcoded array in blog/page.tsx)
  INSERT INTO blog_posts (slug, icon, category, title, description, content, locale, author_name) VALUES
  (
    'preparer-cerveau-examens',
    '📚',
    'Guide Pratique',
    'Préparer le cerveau pour les examens',
    'Ce que la neuroscience nous apprend vraiment sur la surcharge cognitive, l''attention et la mémoire des étudiants.',
    '<h2>Introduction</h2><p>La période des examens représente un défi majeur pour le système nerveux des étudiants. La surcharge cognitive, combinée au stress émotionnel, peut réduire considérablement les capacités de mémorisation et de concentration.</p><h2>Le rôle du cortisol dans la mémoire</h2><p>Le cortisol, l''hormone du stress, a un effet paradoxal sur la mémoire : à faible dose, il aide à la consolidation ; à forte dose, il bloque le rappel et l''encodage. C''est pourquoi un étudiant "blanchi" lors d''un examen a souvent révisé mais ne peut pas accéder à ses souvenirs.</p><h2>Comment le Neurofeedback peut aider</h2><p>En entraînant le cerveau à réduire les ondes bêta-hautes (suractivation anxieuse) et à renforcer les ondes alpha-thêta (calme attentif), le neurofeedback prépare le terrain neurologique optimal pour les révisions et la performance en examen.</p><h2>Conseils pratiques</h2><ul><li>Fractionnez les révisions en blocs de 25 minutes (technique Pomodoro).</li><li>Hydratez-vous régulièrement (le cerveau est composé à 75% d''eau).</li><li>Pratiquez 5 minutes de respiration cohérente avant chaque session.</li></ul>',
    'fr',
    'Dr. Chadia Chakib'
  ),
  (
    'regulation-vs-correction',
    '🧠',
    'Neuroscience',
    'Régulation vs Correction',
    'Pourquoi l''approche neuro-sensible privilégie l''auto-organisation du cerveau plutôt que la correction forcée.',
    '<h2>Deux philosophies opposées</h2><p>La plupart des approches thérapeutiques traditionnelles reposent sur un principe de correction : identifier ce qui "ne va pas" et le forcer à changer. L''approche neuro-sensible NeurOptimal® fonctionne différemment.</p><h2>L''auto-régulation</h2><p>Le cerveau est un système dynamique non-linéaire, ce qui signifie qu''il a une capacité intrinsèque à s''organiser et à trouver son équilibre optimal. Le neurofeedback NeurOptimal® fournit simplement un "miroir mathématique" au cerveau, lui permettant de voir ses propres schémas d''activité en temps réel.</p><h2>Pourquoi cette distinction compte</h2><p>Quand on corrige de force un schéma cérébral, le cerveau peut développer une dépendance à la stimulation externe. En revanche, quand on l''aide à se réguler lui-même, les changements sont durables car ils viennent de l''intérieur du système.</p>',
    'fr',
    'Dr. Chadia Chakib'
  ),
  (
    'impact-bruit-mental-sommeil',
    '💤',
    'Bien-être',
    'L''impact du bruit mental sur le sommeil',
    'Découvrez comment la réduction du chaos interne favorise un sommeil profond et réparateur.',
    '<h2>Le chaos intérieur</h2><p>Le "bruit mental" désigne cette agitation continue de pensées, préoccupations et ruminations qui empêchent le cerveau de basculer naturellement vers les ondes lentes du sommeil profond.</p><h2>Les ondes cérébrales du sommeil</h2><p>Pour s''endormir naturellement, le cerveau doit passer d''un état bêta (alerte) à alpha (relaxation), puis thêta (somnolence) et enfin delta (sommeil profond). Quand le bruit mental persiste, le cerveau reste coincé en bêta.</p><h2>Le neurofeedback comme solution</h2><p>En aidant le cerveau à mieux gérer ses transitions d''ondes cérébrales, le neurofeedback peut restaurer un cycle de sommeil sain. Beaucoup de clients INFC rapportent une amélioration significative de leur sommeil dès les premières séances.</p>',
    'fr',
    'Dr. Chadia Chakib'
  );
  ```

### 1.6 — End-to-End Verification
- `[ ]` **Start the Next.js dev server** (if not running):
  ```bash
  cd /Users/macbook/Dev/GitHub/INFC/neuromaroc.com/nextjs
  npm run dev
  ```
- `[ ]` **Test Contact form**: Go to `http://localhost:3001/fr/contact`, submit a form, verify row appears in `contact_submissions` table via Supabase Studio
- `[ ]` **Test Newsletter**: Subscribe via the footer form on the homepage, verify row in `newsletter_subscribers`
- `[ ]` **Test Forum**: Go to `/fr/forum`, verify questions load from DB (not hardcoded fallback), submit a new question, verify it appears in DB
- `[ ]` **Test Medical Lead**: Submit the professional form on the homepage, verify row in `medical_leads`

---

## Files Modified/Created in This Phase

| File | Action | Description |
|------|--------|-------------|
| `nextjs/.env.local` | MODIFY | Update Supabase keys from `supabase start` output |
| `nextjs/supabase/seed.sql` | CREATE | Seed data for forum questions, answers, and blog posts |

---

## Verification Checklist

- `[ ]` `supabase start` runs without errors
- `[ ]` All 6 tables exist in the local database
- `[ ]` RLS policies allow anonymous inserts where needed
- `[ ]` Seed data is populated (forum questions, blog posts)
- `[ ]` All 4 API routes work end-to-end (contact, newsletter, medical-lead, forum)
- `[ ]` Supabase Studio accessible at `http://127.0.0.1:54323`
