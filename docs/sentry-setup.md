# Sentry Error Monitoring Setup Guide

This document describes how to configure and activate Sentry error monitoring for Exvorta.com.

---

## 1. Quick Integration via `SENTRY_DSN`

The core monitoring layer is implemented in [`lib/error-reporting.ts`](file:///home/hamid/Desktop/Exvorta/Exvorta/lib/error-reporting.ts). It includes a zero-dependency HTTP Envelope client that automatically activates when `SENTRY_DSN` is present in the environment.

### Required Environment Variable
In your Vercel Project Settings (or `.env.production`):

```bash
SENTRY_DSN=https://<public_key>@<organization_slug>.ingest.sentry.io/<project_id>
```

When this variable is set:
- Any call to `reportError(error, context)` immediately captures the exception and dispatches it asynchronously to Sentry.
- Any call to `reportWarning(message, context)` forwards a warning-level event.
- If network requests to Sentry fail or timeout, the failure is caught non-blockingly and does not affect the user experience.

---

## 2. Advanced Full-Stack Sentry SDK (Optional)

If client-side automatic unhandled rejection capture and source map uploading are required:

1. Install the official Next.js SDK:
   ```bash
   pnpm add @sentry/nextjs
   ```

2. Run the Sentry wizard:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. Ensure `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` are initialized according to Next.js 15 standards.

---

## 3. Testing Sentry Dispatch

You can test error reporting by calling `reportError`:

```typescript
import { reportError } from '@/lib/error-reporting'

reportError(new Error('[TEST] Exvorta Sentry verification event'), {
  environment: process.env.NODE_ENV,
  trigger: 'manual_verification',
})
```

Check your Sentry dashboard under **Issues** to confirm delivery.
