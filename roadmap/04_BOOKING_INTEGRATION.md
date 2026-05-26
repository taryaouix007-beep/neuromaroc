# Phase 4 — Booking Integration

> **Priority**: 🟡 High  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 6–8 hours  
> **Prerequisites**: Phase 1 (database), Phase 3 (portal APIs verified)

---

## Goal

Allow patients to book neurofeedback sessions directly from the INFC website — both from the `/centres` page (as guests) and from the `/portal` dashboard (as authenticated patients). This integrates with the XpRia booking API.

---

## Current State

**File**: `nextjs/src/app/[locale]/centres/page.tsx`

The centres page currently has:
- Hardcoded list of 4 centres (Casablanca, Marrakech, Tanger, Kénitra)
- Each centre has address, phone, WhatsApp, hours, Google Maps embed
- WhatsApp links for "Prendre RDV" — no online booking
- No connection to XpRia booking API
- Images for each centre

---

## XpRia Booking API Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/portal/availability?date=YYYY-MM-DD` | GET | API Key | Get available time slots for a date |
| `/api/v1/portal/book` | POST | API Key | Submit a booking request (no JWT needed — guest booking) |
| `/api/v1/portal/practice` | GET | API Key | Get practice info (services, providers, branches) |

**Booking Payload** (from `xperMVP/app/api/v1/portal/book/route.ts`):
```typescript
{
  guestName: string;        // Required: Patient full name
  guestPhone: string;       // Required: Phone number
  guestEmail?: string;      // Optional: Email
  date: "YYYY-MM-DD";       // Required: Selected date
  time: "HH:MM";            // Required: Selected time slot
  serviceId?: string;       // Optional: Service UUID
  serviceName?: string;     // Optional: Service name
  providerId?: string;      // Optional: Practitioner UUID
  providerName?: string;    // Optional: Practitioner name
  notes?: string;           // Optional: Patient notes
}
```

---

## Tasks

### 4.1 — Create Booking Component
- `[ ]` **Create** `nextjs/src/components/BookingWidget.tsx`

  A reusable booking widget that can be embedded in both the centres page and the portal.

  **Props**:
  ```typescript
  interface BookingWidgetProps {
    centreName?: string;        // Pre-select centre
    onSuccess?: () => void;     // Callback after successful booking
    prefillName?: string;       // Pre-fill from portal session
    prefillPhone?: string;      // Pre-fill from portal session
    prefillEmail?: string;      // Pre-fill from portal session
  }
  ```

  **Steps in the booking flow**:
  1. **Guest Info** — Name, phone, email (pre-filled if from portal)
  2. **Select Date** — Calendar showing next 14 days, weekend days greyed out
  3. **Select Time** — Load slots from `/api/v1/portal/availability?date=YYYY-MM-DD`
  4. **Confirm** — Review summary, optional notes, submit
  5. **Success** — Show booking reference number, offer to add to calendar

  **Design**:
  - Use the site's gold/navy color scheme
  - Animate step transitions
  - Show a progress indicator (Step 1 of 4)
  - Mobile-first responsive layout
  - Disable past dates and dates with no availability

### 4.2 — Add Booking API Proxy Route
- `[ ]` **Create** `nextjs/src/app/api/booking/route.ts`

  This proxies to the XpRia booking API, adding the API key server-side (so it's not exposed to the client).

  ```typescript
  import { NextResponse } from "next/server";

  const XPRIA_API_URL = process.env.NEXT_PUBLIC_XPRIA_API_URL || "http://localhost:3000";
  const XPRIA_API_KEY = process.env.NEXT_PUBLIC_XPRIA_API_KEY || "";

  // GET /api/booking?date=2026-06-15
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ success: false, error: "Date is required" }, { status: 400 });
    }

    try {
      const res = await fetch(`${XPRIA_API_URL}/api/v1/portal/availability?date=${date}`, {
        headers: { "X-API-KEY": XPRIA_API_KEY },
      });
      const data = await res.json();
      return NextResponse.json(data);
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  // POST /api/booking
  export async function POST(request: Request) {
    try {
      const body = await request.json();

      const res = await fetch(`${XPRIA_API_URL}/api/v1/portal/book`, {
        method: "POST",
        headers: {
          "X-API-KEY": XPRIA_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  ```

  > **Security note**: In production, move `XPRIA_API_KEY` to a server-only env var (without the `NEXT_PUBLIC_` prefix) and always proxy through the API route. The current setup exposes the key to the client.

### 4.3 — Add Booking Modal to Centres Page
- `[ ]` **Modify** `nextjs/src/app/[locale]/centres/page.tsx`

  Add a "Réserver en ligne" button to each centre card that opens the `BookingWidget` in a modal overlay.

  ```typescript
  // In each centre card, add alongside the existing WhatsApp button:
  <button 
    className="btn btn-gold"
    onClick={() => openBookingModal("Casablanca")}
  >
    📅 Réserver en ligne
  </button>
  ```

  The modal should:
  - Overlay the page with a dark backdrop
  - Contain the `<BookingWidget />` component
  - Be dismissible with a close button or backdrop click
  - Pre-fill the centre name

### 4.4 — Add Booking to Portal Dashboard
- `[ ]` **Modify** `nextjs/src/app/[locale]/portal/page.tsx`

  Add a "Nouveau rendez-vous" button in the dashboard that shows the booking widget with pre-filled patient info from the session.

  ```typescript
  // In the dashboard appointments section, when no upcoming appointments:
  <button 
    className="btn btn-gold"
    onClick={() => setView("book")}
  >
    ➕ Nouveau rendez-vous
  </button>
  ```

### 4.5 — Add i18n for Booking UI
- `[ ]` **Update dictionaries** with booking-related translations:

  ```json
  {
    "booking": {
      "title": "Réserver une séance",
      "stepInfo": "Vos informations",
      "stepDate": "Choisir la date",
      "stepTime": "Choisir l'heure",
      "stepConfirm": "Confirmation",
      "yourName": "Nom complet",
      "yourPhone": "Numéro de téléphone",
      "yourEmail": "Email (optionnel)",
      "selectDate": "Sélectionnez une date",
      "noSlots": "Aucun créneau disponible à cette date",
      "notes": "Notes ou informations complémentaires",
      "confirm": "Confirmer le rendez-vous",
      "success": "Rendez-vous confirmé !",
      "successMsg": "Vous recevrez une confirmation par SMS/WhatsApp.",
      "bookingRef": "Référence de réservation",
      "back": "Retour",
      "next": "Suivant"
    }
  }
  ```

### 4.6 — Confirmation & Follow-up
- `[ ]` After successful booking, show:
  - Booking reference number
  - Date and time summary
  - Centre name
  - "Ajouter au calendrier" link (generate `.ics` file)
  - "Accéder au portail patient" link
  - WhatsApp shortcut to confirm

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/src/components/BookingWidget.tsx` | CREATE | Reusable multi-step booking component |
| `nextjs/src/app/api/booking/route.ts` | CREATE | Proxy to XpRia booking & availability APIs |
| `nextjs/src/app/[locale]/centres/page.tsx` | MODIFY | Add booking modal trigger |
| `nextjs/src/app/[locale]/portal/page.tsx` | MODIFY | Add booking flow from portal dashboard |
| `nextjs/src/dictionaries/fr.json` | MODIFY | Add booking translations |
| `nextjs/src/dictionaries/en.json` | MODIFY | Add booking translations |
| `nextjs/src/dictionaries/ar.json` | MODIFY | Add booking translations |

---

## Verification Checklist

- `[ ]` Booking widget renders correctly in centres page modal
- `[ ]` Available slots load correctly for selected date
- `[ ]` Guest booking (no login) works from centres page
- `[ ]` Authenticated booking works from portal dashboard
- `[ ]` Booking confirmation shows reference number
- `[ ]` Calendar download (.ics) works
- `[ ]` Booking appears in XpRia backend appointments
- `[ ]` Error handling: no slots available, server error, validation errors
- `[ ]` Mobile responsive layout
- `[ ]` Works in all 3 locales
