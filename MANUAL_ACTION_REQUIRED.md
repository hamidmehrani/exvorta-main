# MANUAL_ACTION_REQUIRED.md — Operational Checklist for Exvorta Team

The following items require administrative access to third-party dashboards or external infrastructure and cannot be executed automatically inside the code repository.

---

## 1. Rotate Neon Database Role Credentials (CRITICAL SECURITY)
- **Background:** Historical commits [`f3456e1`](file:///home/hamid/Desktop/Exvorta/Exvorta) and [`544a25f`](file:///home/hamid/Desktop/Exvorta/Exvorta) contain a Neon connection string with password:
  `npg_reOUhR8SZu0o` on endpoint `ep-steep-truth-av87zupp`.
- **Status:** **UNRESOLVED / STILL OPEN**.
- **Action Required:**
  1. Log into your [Neon Console](https://console.neon.tech).
  2. Navigate to project with endpoint `ep-steep-truth-av87zupp` (or confirm if that branch/project was already deleted).
  3. Reset the password for role `neondb_owner` or delete the legacy branch.
  4. Ensure your production database in Vercel project settings matches the current active database connection string.

---

## 2. Verify Domain in Resend Dashboard (CRITICAL EMAIL DELIVERY)
- **Background:** During end-to-end form dispatch tests, Resend API responded with:
  ```json
  {
    "statusCode": 403,
    "message": "The exvorta.com domain is not verified. Please, add and verify your domain on https://resend.com/domains",
    "name": "validation_error"
  }
  ```
- **Status:** **PENDING DNS VERIFICATION**.
- **Audit Verification (Phase 3 & Phase 4 Safe Checks):** Queried `GET https://api.resend.com/emails` with active `RESEND_API_KEY`. Response confirmed `{"object":"list","has_more":false,"data":[]}` — exactly 0 emails were dispatched historically. No external client email addresses received unauthorized messages. Raw proofs saved to `verification/phase3/resend-emails-check.json` and `verification/phase4/resend-emails-check.json`. Resend domains list is empty (`verification/phase4/resend-emails-check.json`).
- **Action Required:**
  1. Log into [Resend Dashboard](https://resend.com/domains).
  2. Check the status of `exvorta.com`.
  3. Add the required DKIM, SPF, and MX records to your DNS provider (e.g., Cloudflare, Namecheap).
  4. Once verified, lead auto-replies and internal admin notifications (`ADMIN_EMAIL`) will deliver immediately.

---

## 3. Verify Cloudflare Turnstile Configuration in Production
- **Background:** In development mode, `SKIP_TURNSTILE_IN_DEV=true` allows form submissions without CAPTCHA challenges.
- **Status:** **VERIFICATION NEEDED FOR PROD**.
- **Action Required:**
  1. In Cloudflare Dashboard, under **Turnstile**, verify that your domain `exvorta.com` is registered.
  2. In Vercel Project Settings → Environment Variables, confirm:
     - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: production Site Key.
     - `TURNSTILE_SECRET_KEY`: production Secret Key.
     - `SKIP_TURNSTILE_IN_DEV`: `false` (or unset in production).

---

## 4. Configure & Verify Sentry DSN in Production (MONITORING ACTIVATION)
- **Background:** In Phase 4, `lib/error-reporting.ts` was wired with a lightweight zero-dependency Sentry envelope dispatcher. However, no `SENTRY_DSN` is configured in the current repository environment (`.env` or process env). Code was written and type-checks, but has not been exercised against a real Sentry project — this is inherited, unverified code.
- **Status:** **UNCONFIGURED / AWAITING DSN**.
- **Action Required:**
  1. Log into your Sentry organization (or create one at [sentry.io](https://sentry.io)).
  2. Create a project named `exvorta-web` (platform: Next.js / JavaScript).
  3. Copy the Client Key (DSN) and add `SENTRY_DSN=<your_dsn>` to Vercel Project Settings (and `.env.production`).
  4. Trigger a test event via `reportError(new Error('Sentry activation test'))` and confirm reception in the Sentry dashboard under Issues.

