# Phase 6 — Quiz Lead Capture

> **Priority**: 🟢 Medium  
> **Status**: `[x]` Completed  
> **Estimated Effort**: 2–3 hours  
> **Prerequisites**: Phase 1 (database running)

---

## Goal

Save Brain Boost quiz results to the local Supabase database for lead tracking and practitioner follow-up. Currently, quiz results are calculated client-side and displayed in a radar chart, but never persisted.

---

## Current State

**File**: `nextjs/src/components/BrainBoostQuiz.tsx`

The quiz:
- Has ~15 multiple-choice questions across 4 categories
- Calculates percentage scores for: Fatigue Attentionnelle, Dette Sommeil, Niveau Stress, Charge Mémorielle
- Displays results as a radar chart (Chart.js)
- Offers a "Download PDF Guide" and "WhatsApp" CTA
- **Does NOT save results anywhere**

---

## Tasks

### 6.1 — Create Database Table
- `[ ]` **Create migration**: `nextjs/supabase/migrations/20260606000000_quiz_leads.sql`

  ```sql
  CREATE TABLE quiz_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    city TEXT,
    scores JSONB NOT NULL,           -- { fatigue: 66.6, sommeil: 33.3, stress: 100.0, memoire: 0.0 }
    total_score NUMERIC,             -- Overall vulnerability percentage
    locale TEXT DEFAULT 'fr',
    referrer TEXT,                    -- Where the user came from (UTM params, etc.)
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow public insert quiz_leads"
    ON quiz_leads FOR INSERT WITH CHECK (true);
  ```

### 6.2 — Create API Route
- `[ ]` **Create** `nextjs/src/app/api/quiz-lead/route.ts`

  ```typescript
  import { NextResponse } from "next/server";
  import { supabase } from "@/lib/supabase";

  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { name, email, phone, city, scores, totalScore, locale, referrer } = body;

      if (!scores) {
        return NextResponse.json(
          { success: false, error: "Quiz scores are required" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("quiz_leads")
        .insert([{
          name: name || null,
          email: email || null,
          phone: phone || null,
          city: city || null,
          scores,
          total_score: totalScore || null,
          locale: locale || "fr",
          referrer: referrer || null,
        }]);

      if (error) {
        console.error("❌ Failed to save quiz lead:", error);
        return NextResponse.json(
          { success: false, error: "Erreur lors de l'enregistrement" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Résultats enregistrés avec succès.",
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
  ```

### 6.3 — Add Lead Capture Modal to Quiz
- `[ ]` **Modify** `nextjs/src/components/BrainBoostQuiz.tsx`

  After the quiz results are displayed, show a **lead capture form** before or alongside the results:

  **Option A — Gate the results** (recommended for max lead capture):
  - After answering all questions, show: "Pour recevoir votre rapport personnalisé, entrez vos coordonnées"
  - Form: Name, Phone, City (email optional)
  - On submit → Save to DB → Show radar chart results

  **Option B — Optional capture** (less friction):
  - Show the radar chart results immediately
  - Below the chart, show: "Recevez un rapport complet par email"
  - Form: Name, Email (optional phone)
  - On submit → Save to DB

  **Implementation sketch** (Option A):
  ```typescript
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", phone: "", city: "", email: "" });
  
  // After quiz finishes, instead of showing results directly:
  if (quizFinished && !leadSubmitted) {
    return (
      <div className="lead-capture-form">
        <h3>🧠 Votre Bilan Neuro-Sensible est prêt !</h3>
        <p>Entrez vos coordonnées pour recevoir votre rapport personnalisé.</p>
        <form onSubmit={handleLeadSubmit}>
          <input placeholder="Nom et Prénom" required ... />
          <input type="tel" placeholder="+212 6XX XX XX XX" required ... />
          <select>
            <option value="">Votre ville</option>
            <option value="casablanca">Casablanca</option>
            <option value="marrakech">Marrakech</option>
            <option value="tanger">Tanger</option>
            <option value="kenitra">Kénitra</option>
            <option value="autre">Autre</option>
          </select>
          <input type="email" placeholder="Email (optionnel)" ... />
          <button type="submit" className="btn btn-gold">
            Voir mes résultats →
          </button>
        </form>
      </div>
    );
  }
  
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/quiz-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...leadData,
        scores: calculatedScores,
        totalScore: overallScore,
        locale: currentLocale,
      }),
    });
    setLeadSubmitted(true);
    // Now show the radar chart results
  };
  ```

### 6.4 — Add Skip Option
- `[ ]` Add a small "Passer" (Skip) link below the form for users who don't want to share info
  - Still save anonymous scores (name/phone/email = null) for analytics
  - Show results immediately

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/supabase/migrations/20260606000000_quiz_leads.sql` | CREATE | Quiz leads table |
| `nextjs/src/app/api/quiz-lead/route.ts` | CREATE | API route to save quiz results |
| `nextjs/src/components/BrainBoostQuiz.tsx` | MODIFY | Add lead capture form before results |

---

## Verification Checklist

- `[ ]` Migration applies without errors
- `[ ]` Quiz results are saved to `quiz_leads` table after form submission
- `[ ]` Anonymous scores (skip) are also saved
- `[ ]` Radar chart still displays correctly after form submit
- `[ ]` Form validation works (name + phone required)
- `[ ]` Quiz works in all 3 locales
- `[ ]` Data appears in Supabase Studio
