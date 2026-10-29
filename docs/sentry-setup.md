# Sentry Error Monitoring Setup Guide

This document describes how to configure and activate Sentry error monitoring for Exvorta.com.

---

## 1. Quick Integration via `SENTRY_DSN`

The core monitoring layer is implemented in [`lib/error-reporting.ts`](file:///home/azureuser/projects/exvorta/.worktrees/t_b51690ce/lib/error-reporting.ts). It includes a zero-dependency HTTP Envelope client that automatically activates when `SENTRY_DSN` is present in the environment.

### Required Environment Variable
In your Vercel Project Settings (or `.env.production`):

```bash
SENTRY_DSN=https://<public_key>@<organization_slug>.ingest.sentry.io/<project_id>
```

When this variable is set:
- Any call to `reportError(error, context)` immediately captures the exception and dispatches it asynchronously to Sentry.
- Any call to `reportWarning(message, context)` forwards a warning-level event.
- If `SENTRY_DSN` is unset or invalid, all error reporting utilities gracefully no-op without throwing.
- If network requests to Sentry fail or timeout, the failure is caught non-blockingly and does not affect the user experience.

---

## 2. Release Tagging via Git Commit SHA

The envelope dispatcher automatically inspects environment variables to attach release metadata to every Sentry event payload:

```typescript
const release =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GIT_COMMIT_SHA ||
  undefined
```

### Precedence Hierarchy:
1. `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`: Built-in Vercel system variable exposed to both client-side and server environments.
2. `VERCEL_GIT_COMMIT_SHA`: Serverless runtime Vercel system variable.
3. `GIT_COMMIT_SHA`: Generic CI/CD commit identifier fallback.
4. `undefined`: Safely omitted in local development or untagged environments without breaking the envelope format.

This enables issue tracking across production deploys, suspect commit identification, and regression detection without extra build-time SDK overhead.

---

## 3. Error Boundaries Integration

The Next.js App Router error handling surfaces are integrated with `reportError`:

1. **Route Level (`app/(frontend)/error.tsx`)**:
   Captures unhandled errors across all frontend routes and pages:
   ```typescript
   reportError(error, { digest: error.digest, boundary: 'frontend-error' })
   ```

2. **Root Application Level (`app/global-error.tsx`)**:
   Captures catastrophic root layout failures:
   ```typescript
   reportError(error, { digest: error.digest, boundary: 'global-error' })
   ```
   Renders fallback UI conforming to brand design tokens (`bg-surface`, `text-obsidian`, `border-rule`) with a client-side retry action.

---

## 4. Advanced Full-Stack Sentry SDK (Optional)

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

## 5. Verification & Testing

### Automated Unit Tests
The error reporting subsystem is verified via Vitest in `__tests__/error-reporting.test.ts`:
- Graceful no-op when `SENTRY_DSN` is unset or invalid (never throwing).
- `safeAsync` result return and error capture behavior.
- Sentry HTTP Envelope generation (`application/x-sentry-envelope`, `X-Sentry-Auth`, headers, event_id, level, exception, release).
- Release tagging precedence and fallback.
- Non-blocking network failure handling.

Run tests:
```bash
pnpm exec vitest run __tests__/error-reporting.test.ts
```

### Manual Verification
You can trigger a test event in any server or client context:

```typescript
import { reportError } from '@/lib/error-reporting'

reportError(new Error('[TEST] Exvorta Sentry verification event'), {
  environment: process.env.NODE_ENV,
  trigger: 'manual_verification',
})
```

Check your Sentry dashboard under **Issues** to confirm delivery.
