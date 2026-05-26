# Phase 3 — Patient Portal (Secured)

> **Priority**: 🔴 Critical  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 8–12 hours  
> **Prerequisites**: Phase 1 complete, XpRia backend (`xperMVP`) running on localhost:3000

---

## Goal

Make the patient portal (`/portal`) fully functional with secure multi-method authentication, real appointment management, booking, and intake form submission — all integrated with the XpRia cabinet backend APIs.

---

## Current State

**File**: `nextjs/src/app/[locale]/portal/page.tsx` (1103 lines)

The portal UI is **fully built** with:
- Login view with 3 auth tabs (phone OTP, email magic link, booking reference)
- OTP verification view
- Dashboard with appointment list, cancel, reschedule
- Reschedule modal with date/slot selection
- Intake form wizard (3 steps)
- Full Arabic + French i18n

**What's missing**:
- The backend APIs it calls (XpRia portal endpoints) need to be verified working
- No rate limiting on auth attempts
- No token refresh mechanism
- No "new booking" flow from the portal dashboard
- Session management relies on `sessionStorage` only (lost on tab close)
- No error boundary or retry logic

---

## XpRia Portal API Reference

These endpoints live in the `xperMVP` repository and must be running on `localhost:3000`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/portal/auth/init` | POST | API Key | Initiate phone OTP or email magic link |
| `/api/v1/portal/auth/verify` | POST | API Key | Verify OTP code or booking reference |
| `/api/v1/portal/auth/callback` | GET | — | Magic link redirect handler |
| `/api/v1/portal/appointments` | GET | API Key + JWT | List patient's appointments |
| `/api/v1/portal/appointments` | PATCH | API Key + JWT | Cancel or reschedule an appointment |
| `/api/v1/portal/availability` | GET | API Key | Get available slots for a date |
| `/api/v1/portal/book` | POST | API Key | Submit a new booking request |
| `/api/v1/portal/intake` | POST | API Key + JWT | Submit intake questionnaire |
| `/api/v1/portal/practice` | GET | API Key | Get cabinet/practice info |

**Auth flow** (from `xperMVP/lib/api/portal-auth.ts`):
1. Patient enters phone or email → calls `/auth/init`
2. Backend sends OTP via SMS/WhatsApp or magic link via email
3. Patient enters OTP → calls `/auth/verify`
4. Backend returns a **Portal JWT** (HS256, 24h TTL for full scope, 1h for read-only)
5. Frontend stores JWT in `sessionStorage` and uses it for all subsequent API calls
6. JWT payload contains: `sub` (contact_id), `orgId`, `phone`, `email`, `method`, `scope`

**Auth strategies** (from `xperMVP/lib/api/portal-strategies/`):
- `phone.ts` — SMS OTP via Twilio or similar
- `email.ts` — Magic link via email
- `booking-ref.ts` — Appointment ID + last 4 digits of phone
- `supabase.ts` — Supabase Auth integration (optional)

---

## Tasks

### 3.1 — Verify XpRia Backend is Running
- `[ ]` Ensure the `xperMVP` project is running:
  ```bash
  cd /Users/macbook/Dev/GitHub/xperMVP
  npm run dev
  # Should start on localhost:3000
  ```
- `[ ]` Verify the API key in `.env.local` matches an actual key in the XpRia database:
  ```
  NEXT_PUBLIC_XPRIA_API_KEY=xpk_<actual-key>
  ```
  Check the `api_keys` table in the XpRia Supabase project to find a valid key for the INFC organization.

- `[ ]` Test the practice endpoint:
  ```bash
  curl -H "X-API-KEY: xpk_<key>" http://localhost:3000/api/v1/portal/practice
  ```
  Expected: JSON with practice/cabinet info

### 3.2 — Test Auth Flow End-to-End
- `[ ]` **Phone OTP flow**:
  1. Go to `http://localhost:3001/fr/portal`
  2. Enter a phone number that exists in the XpRia `contacts` table
  3. Click "Recevoir mes identifiants"
  4. Check XpRia server logs for the OTP code (in dev mode, it may be logged to console)
  5. Enter the OTP code
  6. Verify dashboard loads with patient data

- `[ ]` **Booking Reference flow**:
  1. Switch to the "Référence" tab
  2. Enter a valid appointment ID from the XpRia database
  3. Enter the last 4 digits of the patient's phone
  4. Verify dashboard loads

- `[ ]` **Email Magic Link flow**:
  1. Switch to the "Email" tab
  2. Enter a valid email
  3. Check for magic link in logs (or Mailpit at `http://localhost:54324` if using local Supabase email)
  4. Click the link
  5. Verify token is extracted from URL fragment and dashboard loads

### 3.3 — Improve Session Persistence
- `[ ]` **Switch from `sessionStorage` to `localStorage`** with expiry check

  Current code uses `sessionStorage` (line 84, 93 in portal page), which clears when the browser tab is closed. For better UX, use `localStorage` with a manual expiry check.

  **File**: `nextjs/src/app/[locale]/portal/page.tsx`
  
  ```typescript
  // Replace sessionStorage with localStorage + expiry
  const TOKEN_KEY = "xpria_portal_token";
  const TOKEN_EXPIRY_KEY = "xpria_portal_token_expiry";
  
  function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    // Set expiry to 23 hours from now (token is 24h, leave 1h buffer)
    const expiry = Date.now() + 23 * 60 * 60 * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
  }
  
  function getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!token || !expiry) return null;
    if (Date.now() > parseInt(expiry)) {
      // Token expired — clean up
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return null;
    }
    return token;
  }
  
  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }
  ```

### 3.4 — Add "Book New Appointment" Flow
- `[ ]` **Add a booking button** in the dashboard (currently shows "Prendre rendez-vous" link to `/centres`, but should allow booking from portal)

  Add a new view state `"book"` and implement a booking form:
  1. Select date → load available slots from `/api/v1/portal/availability?date=YYYY-MM-DD`
  2. Select time slot
  3. Optionally add notes
  4. Submit to `/api/v1/portal/book`

  **API payload** (from `xperMVP/app/api/v1/portal/book/route.ts`):
  ```typescript
  {
    guestName: string;     // Patient name (from session)
    guestPhone: string;    // Patient phone (from session)
    guestEmail?: string;   // Optional
    date: "YYYY-MM-DD";
    time: "HH:MM";
    serviceId?: string;
    serviceName?: string;
    providerId?: string;
    providerName?: string;
    notes?: string;
  }
  ```

### 3.5 — Add Rate Limiting on Auth Attempts
- `[ ]` **Client-side rate limiting**: Prevent brute-force OTP attempts

  ```typescript
  // Track attempts in state
  const [authAttempts, setAuthAttempts] = useState(0);
  const [authCooldown, setAuthCooldown] = useState(false);
  
  const handleAuthInit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authAttempts >= 3) {
      setAuthCooldown(true);
      showToast("⚠️ Trop de tentatives", "Veuillez patienter 60 secondes avant de réessayer.");
      setTimeout(() => {
        setAuthAttempts(0);
        setAuthCooldown(false);
      }, 60000);
      return;
    }
    setAuthAttempts(prev => prev + 1);
    // ... existing logic
  };
  ```

  > **Note**: Server-side rate limiting should also be implemented in the XpRia backend, but client-side is a good first layer.

### 3.6 — Add Error Boundary
- `[ ]` **Create** `nextjs/src/app/[locale]/portal/error.tsx`

  ```typescript
  "use client";
  
  export default function PortalError({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>Une erreur est survenue</h2>
        <p>{error.message}</p>
        <button onClick={reset} className="btn btn-navy">
          Réessayer
        </button>
      </div>
    );
  }
  ```

### 3.7 — Add Loading State Page
- `[ ]` **Create** `nextjs/src/app/[locale]/portal/loading.tsx`

  ```typescript
  export default function PortalLoading() {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <div className="spinner" />
        <p>Chargement de votre espace sécurisé...</p>
      </div>
    );
  }
  ```

### 3.8 — Security Hardening
- `[ ]` **HTTPS enforcement**: Ensure the magic link `returnUrl` uses HTTPS in production
- `[ ]` **Token validation**: Add a periodic token validation check (e.g., every 5 minutes, silently call a lightweight endpoint to verify the token is still valid)
- `[ ]` **XSS protection**: Ensure no user-controlled content is rendered via `dangerouslySetInnerHTML` in the portal
- `[ ]` **CORS**: Verify that XpRia portal endpoints allow requests from `neuromaroc.com` origin

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/src/app/[locale]/portal/page.tsx` | MODIFY | Session persistence, booking flow, rate limiting |
| `nextjs/src/app/[locale]/portal/error.tsx` | CREATE | Error boundary for portal |
| `nextjs/src/app/[locale]/portal/loading.tsx` | CREATE | Loading state |
| `nextjs/.env.local` | MODIFY | Verify/update XpRia API key |

---

## Verification Checklist

- `[ ]` Phone OTP login works end-to-end
- `[ ]` Email magic link login works end-to-end
- `[ ]` Booking reference login works end-to-end
- `[ ]` Dashboard shows real appointments from XpRia
- `[ ]` Cancel appointment works
- `[ ]` Reschedule appointment works (pick new date/slot)
- `[ ]` Intake form submission succeeds
- `[ ]` Session persists across page refresh (localStorage)
- `[ ]` Session expires after ~23 hours
- `[ ]` Logout clears token
- `[ ]` Rate limiting kicks in after 3 failed auth attempts
- `[ ]` Error boundary catches and displays errors gracefully
- `[ ]` Portal works in both French and Arabic
