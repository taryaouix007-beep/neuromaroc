# Phase 9 — Email & Notification System

> **Priority**: 🟢 Medium  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 4–6 hours  
> **Prerequisites**: Phase 1 (database), Phase 3 (portal auth)

---

## Goal

Set up automated email/SMS/WhatsApp notifications for key user actions:
- Contact form → Email alert to the nearest centre
- Newsletter signup → Welcome email
- Forum question submitted → Email to admin for moderation
- Booking confirmed → Confirmation email/SMS to patient
- Quiz completed → Follow-up email with results PDF

---

## Provider Options

| Provider | Channel | Pricing | Best For |
|----------|---------|---------|----------|
| **Resend** | Email | Free tier: 100 emails/day | Transactional emails |
| **SendGrid** | Email | Free tier: 100 emails/day | High volume |
| **Twilio** | SMS/WhatsApp | Pay per message | OTP codes, booking confirmations |
| **WhatsApp Business API** | WhatsApp | Pay per conversation | Morocco market (very high WhatsApp adoption) |
| **Supabase Edge Functions** | Webhook triggers | Included | DB-triggered automations |

> **Recommendation for Morocco**: Start with **Resend** for emails and the existing WhatsApp links for messaging. Add Twilio SMS later for OTP codes.

---

## Tasks

### 9.1 — Install Email Provider
- `[ ]` **Install Resend** (or SendGrid):
  ```bash
  cd /Users/macbook/Dev/GitHub/INFC/neuromaroc.com/nextjs
  npm install resend
  ```

- `[ ]` **Add API key** to `.env.local`:
  ```bash
  RESEND_API_KEY=re_xxxxxxxxxxxx
  EMAIL_FROM=noreply@neuromaroc.com     # Must verify domain on Resend
  EMAIL_ADMIN=admin@neuromaroc.com      # Admin notification recipient
  ```

### 9.2 — Create Email Utility
- `[ ]` **Create** `nextjs/src/lib/email.ts`

  ```typescript
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM = process.env.EMAIL_FROM || 'INFC Maroc <noreply@neuromaroc.com>';

  export async function sendEmail({
    to,
    subject,
    html,
    replyTo,
  }: {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
  }) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      });
      
      if (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error };
      }
      
      console.log('📧 Email sent:', data?.id);
      return { success: true, id: data?.id };
    } catch (err) {
      console.error('❌ Email exception:', err);
      return { success: false, error: err };
    }
  }
  ```

### 9.3 — Email Templates
- `[ ]` **Create** `nextjs/src/lib/email-templates.ts`

  ```typescript
  // Reusable HTML email wrapper with INFC branding
  function emailWrapper(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #faf8f0;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0a1628; font-size: 24px;">INFC Maroc</h1>
          <p style="color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Neurofeedback NeurOptimal®</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
          ${content}
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>INFC Maroc — Premier réseau de Neurofeedback au Maroc</p>
          <p><a href="https://neuromaroc.com" style="color: #d4af37;">neuromaroc.com</a></p>
        </div>
      </body>
      </html>
    `;
  }

  export function contactNotificationEmail(data: { name: string; phone: string; city: string; message?: string }) {
    return {
      subject: `📞 Nouvelle demande de contact — ${data.city}`,
      html: emailWrapper(`
        <h2 style="color: #0a1628;">Nouvelle demande de contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Nom:</td><td style="padding: 8px;">${data.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Téléphone:</td><td style="padding: 8px;">${data.phone}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Ville:</td><td style="padding: 8px;">${data.city}</td></tr>
          ${data.message ? `<tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${data.message}</td></tr>` : ''}
        </table>
        <p style="margin-top: 20px; color: #666;">Répondez à cette demande dans les 24 heures.</p>
      `),
    };
  }

  export function newsletterWelcomeEmail() {
    return {
      subject: "🧠 Bienvenue dans la Lettre Neuro-Sensible INFC",
      html: emailWrapper(`
        <h2 style="color: #0a1628;">Bienvenue !</h2>
        <p>Merci de vous être inscrit(e) à notre lettre d'information.</p>
        <p>Vous recevrez régulièrement :</p>
        <ul>
          <li>Des articles exclusifs sur la régulation cérébrale</li>
          <li>Des conseils pour mieux gérer le stress et le sommeil</li>
          <li>Des offres spéciales sur nos séances de neurofeedback</li>
        </ul>
        <p style="text-align: center; margin-top: 30px;">
          <a href="https://neuromaroc.com/fr/brain-boost" 
             style="background: #d4af37; color: #0a1628; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            🧠 Faire le test Brain Boost gratuit
          </a>
        </p>
      `),
    };
  }

  export function forumModerationEmail(data: { title: string; author: string; category: string }) {
    return {
      subject: `💬 Nouvelle question forum à modérer — ${data.category}`,
      html: emailWrapper(`
        <h2 style="color: #0a1628;">Question en attente de modération</h2>
        <p><strong>Auteur:</strong> ${data.author}</p>
        <p><strong>Catégorie:</strong> ${data.category}</p>
        <p><strong>Question:</strong> ${data.title}</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href="https://neuromaroc.com/fr/admin/forum" 
             style="background: #0a1628; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
            Modérer le Forum →
          </a>
        </p>
      `),
    };
  }

  export function bookingConfirmationEmail(data: { 
    name: string; date: string; time: string; centre: string; ref: string 
  }) {
    return {
      subject: `✅ Rendez-vous confirmé — ${data.date} à ${data.time}`,
      html: emailWrapper(`
        <h2 style="color: #0a1628;">Rendez-vous confirmé !</h2>
        <p>Bonjour ${data.name},</p>
        <p>Votre séance de neurofeedback est confirmée :</p>
        <div style="background: #faf8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>📅 <strong>Date:</strong> ${data.date}</p>
          <p>🕒 <strong>Heure:</strong> ${data.time}</p>
          <p>📍 <strong>Centre:</strong> ${data.centre}</p>
          <p>🔑 <strong>Référence:</strong> ${data.ref}</p>
        </div>
        <p style="color: #666; font-size: 14px;">
          Vous pouvez gérer votre rendez-vous depuis votre 
          <a href="https://neuromaroc.com/fr/portal" style="color: #d4af37;">espace patient</a>.
        </p>
      `),
    };
  }
  ```

### 9.4 — Integrate Emails into Existing API Routes
- `[ ]` **Modify** `nextjs/src/app/api/contact/route.ts` — Add email notification after successful insert

  ```typescript
  // After the successful supabase insert:
  const { sendEmail } = await import("@/lib/email");
  const { contactNotificationEmail } = await import("@/lib/email-templates");
  
  // Route to correct centre email based on city
  const centreEmails: Record<string, string> = {
    casablanca: "casablanca@neuromaroc.com",
    marrakech: "marrakech@neuromaroc.com",
    tanger: "tanger@neuromaroc.com",
    kenitra: "kenitra@neuromaroc.com",
  };
  const recipientEmail = centreEmails[city] || process.env.EMAIL_ADMIN || "admin@neuromaroc.com";
  
  const template = contactNotificationEmail({ name, phone, city, message });
  await sendEmail({ to: recipientEmail, ...template, replyTo: `tel:${phone}` });
  ```

- `[ ]` **Modify** `nextjs/src/app/api/newsletter/route.ts` — Send welcome email after successful signup

- `[ ]` **Modify** `nextjs/src/app/api/forum/route.ts` — Send moderation alert on new question

### 9.5 — WhatsApp Integration (Optional Enhancement)
- `[ ]` Add WhatsApp notification links in booking confirmation:
  ```
  https://wa.me/212622606011?text=Bonjour%20{name},%20votre%20RDV%20du%20{date}%20à%20{time}%20est%20confirmé.%20Référence:%20{ref}
  ```

---

## Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/src/lib/email.ts` | CREATE | Email sending utility |
| `nextjs/src/lib/email-templates.ts` | CREATE | Branded email templates |
| `nextjs/src/app/api/contact/route.ts` | MODIFY | Add email notification |
| `nextjs/src/app/api/newsletter/route.ts` | MODIFY | Add welcome email |
| `nextjs/src/app/api/forum/route.ts` | MODIFY | Add moderation alert |
| `nextjs/.env.local` | MODIFY | Add RESEND_API_KEY, email config |

---

## Verification Checklist

- `[ ]` Contact form submission sends email to correct centre
- `[ ]` Newsletter signup sends welcome email
- `[ ]` Forum question submission sends moderation alert
- `[ ]` Emails render correctly (test with Resend preview or Mailpit)
- `[ ]` Email sending failures don't break the main API response (graceful degradation)
- `[ ]` All emails use INFC branding
