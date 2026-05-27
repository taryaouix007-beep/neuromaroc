# Phase 10 — Production Deployment

> **Priority**: 🔴 Critical (final phase)  
> **Status**: `[ ]` Not Started  
> **Estimated Effort**: 4–6 hours  
> **Prerequisites**: All previous phases complete and tested locally

---

## Goal

Deploy the INFC website to production with:
- Vercel hosting for the Next.js app
- Supabase Cloud for the production database
- Custom domain (`neuromaroc.com`) with SSL
- Environment variables configured for production
- Performance optimization

---

## Tasks

### 10.1 — Create Supabase Cloud Project
- `[ ]` **Create a new Supabase project** at [supabase.com](https://supabase.com)
  - Project name: `infc-neuromaroc`
  - Region: Choose closest to Morocco (e.g., `eu-west-1` / Frankfurt or `eu-west-3` / Paris)
  - Database password: Use a strong password, save securely

- `[ ]` **Record production credentials**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
  ```

### 10.2 — Apply Migrations to Production
- `[ ]` **Link local project to cloud project**:
  ```bash
  cd /Users/macbook/Dev/GitHub/INFC/neuromaroc.com/nextjs
  supabase link --project-ref <project-ref>
  ```

- `[ ]` **Push migrations**:
  ```bash
  supabase db push
  ```
  This applies all migrations from `supabase/migrations/` to the cloud database.

- `[ ]` **Verify tables** in the Supabase Cloud dashboard → Table Editor

- `[ ]` **Seed production data** (blog posts, forum Q&A — NOT test contacts):
  ```bash
  # Only seed blog and forum data, not test submissions
  supabase db push --seed
  ```
  Or manually run the seed SQL for blog posts and forum questions only.

### 10.3 — Create Production Supabase Auth Users
- `[ ]` **Create admin user** in Supabase Cloud → Authentication → Add User:
  - Email: `admin@neuromaroc.com`
  - Password: Strong password
  - Then create `franchise_profiles` row linking to this user

### 10.4 — Deploy to Vercel
- `[ ]` **Connect GitHub repository** to Vercel:
  1. Go to [vercel.com](https://vercel.com) → Import Project
  2. Select the GitHub repo: `INFC/neuromaroc.com`
  3. Set root directory to `nextjs/`
  4. Framework: Next.js (auto-detected)

- `[ ]` **Configure environment variables** in Vercel dashboard:

  ```bash
  # Supabase Production
  NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
  SUPABASE_SERVICE_ROLE_KEY=<production-service-role-key>

  # XpRia Cabinet API (production URL)
  NEXT_PUBLIC_XPRIA_API_URL=https://api.xpria.com   # or your production API URL
  NEXT_PUBLIC_XPRIA_API_KEY=<production-api-key>

  # Portal JWT
  PORTAL_JWT_SECRET=<shared-secret-with-xpria>

  # Email
  RESEND_API_KEY=re_<production-key>
  EMAIL_FROM=INFC Maroc <noreply@neuromaroc.com>
  EMAIL_ADMIN=admin@neuromaroc.com

  # Site Status
  NEXT_PUBLIC_WEBSITE_STATUS=online
  ```

- `[ ]` **Deploy**:
  ```bash
  # Vercel will auto-deploy on push to main branch
  git push origin main
  ```

### 10.5 — Custom Domain Setup
- `[ ]` **Add custom domain** in Vercel → Settings → Domains:
  - Add `neuromaroc.com`
  - Add `www.neuromaroc.com` (redirect to apex)

- `[ ]` **Update DNS records** at your domain registrar:
  - `A` record → Vercel's IP (`76.76.21.21`)
  - `CNAME` for `www` → `cname.vercel-dns.com`

- `[ ]` **Verify SSL certificate** — Vercel handles this automatically

### 10.6 — Configure Supabase for Production Domain
- `[ ]` **Update Supabase Auth settings** (Supabase Dashboard → Authentication → URL Configuration):
  - Site URL: `https://neuromaroc.com`
  - Redirect URLs: `https://neuromaroc.com/**`

- `[ ]` **Update CORS** if needed (Supabase Dashboard → Settings → API):
  - Add `https://neuromaroc.com` to allowed origins

### 10.7 — Performance Optimization
- `[ ]` **Enable Next.js Image Optimization**:
  - Remove `unoptimized` prop from all `<Image>` components
  - Configure `next.config.js` with production image domains:
    ```javascript
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: '*.supabase.co' },
      ],
    },
    ```

- `[ ]` **Add caching headers** for static assets:
  ```javascript
  // next.config.js
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  }
  ```

- `[ ]` **Enable ISR** (Incremental Static Regeneration) for blog pages:
  ```typescript
  // In blog listing page (if using Server Components):
  export const revalidate = 3600; // Revalidate every hour
  ```

- `[ ]` **Analyze bundle size**:
  ```bash
  npm run build
  # Check .next/analyze/ for bundle sizes
  ```

### 10.8 — Security Checklist
- `[ ]` **Move API keys to server-only env vars**:
  - `XPRIA_API_KEY` (without `NEXT_PUBLIC_` prefix) — proxy all API calls through Next.js API routes
  - `SUPABASE_SERVICE_ROLE_KEY` — never expose to client

- `[ ]` **Add rate limiting** to API routes (use `next-rate-limit` or similar):
  ```bash
  npm install rate-limiter-flexible
  ```

- `[ ]` **Content Security Policy** headers:
  ```javascript
  // next.config.js
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    }];
  }
  ```

- `[ ]` **HTTPS redirect** — Vercel handles this automatically

### 10.9 — Monitoring & Analytics
- `[ ]` **Add Google Analytics 4**:
  ```typescript
  // In layout.tsx or a dedicated component
  <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
  <Script id="ga4" strategy="afterInteractive">
    {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`}
  </Script>
  ```

- `[ ]` **Set up Google Search Console**:
  1. Verify ownership via DNS TXT record
  2. Submit sitemap: `https://neuromaroc.com/sitemap.xml`

- `[ ]` **Enable Vercel Analytics** (optional, built-in):
  ```bash
  npm install @vercel/analytics
  ```
  ```typescript
  import { Analytics } from '@vercel/analytics/react';
  // Add <Analytics /> in layout.tsx
  ```

### 10.10 — Post-Deploy Verification
- `[ ]` **Test all pages** on production URL
- `[ ]` **Test all forms** (contact, newsletter, medical lead, forum)
- `[ ]` **Test patient portal** auth flow
- `[ ]` **Test booking** (if XpRia production API is available)
- `[ ]` **Test all 3 locales** (fr, ar, en)
- `[ ]` **Check mobile responsiveness**
- `[ ]` **Run Lighthouse audit** (target: Performance > 90, SEO > 95)
- `[ ]` **Check SEO**:
  - Sitemap accessible: `https://neuromaroc.com/sitemap.xml`
  - Robots.txt accessible: `https://neuromaroc.com/robots.txt`
  - OG image loads correctly
  - Google Search Console shows no errors

---

## Files Modified

| File | Action | Description |
|------|--------|-------------|
| `nextjs/next.config.js` or `next.config.ts` | MODIFY | Image config, headers, caching |
| `nextjs/.env.local` | — | Local only (not deployed) |
| Vercel Dashboard | CONFIGURE | All production env vars |
| DNS Provider | CONFIGURE | A and CNAME records |
| Supabase Cloud Dashboard | CONFIGURE | Auth URLs, CORS |

---

## Verification Checklist

- `[ ]` Production site loads at `https://neuromaroc.com`
- `[ ]` SSL certificate is valid
- `[ ]` All forms submit successfully to production database
- `[ ]` Blog loads from production Supabase
- `[ ]` Forum loads from production Supabase
- `[ ]` Patient portal connects to production XpRia API
- `[ ]` Franchise dashboard login works
- `[ ]` Emails send in production
- `[ ]` Lighthouse Performance > 90
- `[ ]` Lighthouse SEO > 95
- `[ ]` Google Search Console: no critical errors
- `[ ]` Mobile responsive on all pages
- `[ ]` All 3 locales work correctly
- `[ ]` Security headers present
- `[ ]` No API keys exposed in client-side JavaScript
