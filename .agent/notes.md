# Agent Notes — CONV-02: Turnstile on all public forms

- **Card:** `CONV-02` (Task `t_2665f59e`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R2`
- **Branch:** `card/conv-02-turnstile`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_2665f59e`

## Objectives & Scope
1. Reusable Accessible Turnstile Widget (`components/forms/TurnstileWidget.tsx`):
   - Design-system aligned wrapper around `@marsidev/react-turnstile` with dark theme default (`theme="dark"`).
   - Imperative ref handle (`TurnstileWidgetRef`) providing `reset()` method to clear state on failed submissions.
   - Accessible feedback announcements with `role="alert"` and `aria-live="polite"` on expiration or network blockages.
   - Prevents layout shift (CLS) with `min-h-[65px]`.
   - Graceful degradation: renders dev indicator in non-prod when site key is unset, or null in production.
2. Form Wiring Across All 10 Public Submission Forms:
   - `components/forms/ContactForm.tsx`: Standardized with `TurnstileWidget`, resets widget on error, handles token pass-through.
   - `components/forms/RFQForm.tsx` & `app/(frontend)/rfq/embed/page.tsx`: Standardized with `TurnstileWidget`, token state, and reset on submission error.
   - `components/blocks/WaitlistClientForm.tsx`: Standardized with `TurnstileWidget`, passes `turnstileToken` to `submitWaitlist`.
   - `components/blocks/WeeklyBriefingForm.tsx`: Wired `TurnstileWidget`, passes `turnstileToken` to `submitWaitlist` with `source: 'WeeklyBriefing'`.
   - `components/blocks/RoadmapBlock.tsx`: Wired `TurnstileWidget`, passes `turnstileToken` to `submitLead`.
   - `components/blocks/ToolsWaitlistBand.tsx`: Wired `TurnstileWidget`, passes `turnstileToken` to `submitWaitlist`.
   - `app/(frontend)/partners/PartnerApplicationForm.tsx`: Standardized with `TurnstileWidget`, resets on submission error.
   - `app/(frontend)/tools/docs-generator/page.tsx`: Wired `TurnstileWidget` in document email dispatch modal.
   - `app/(frontend)/tools/uae-einvoicing/UaeEinvoicingCalculator.tsx` & `ar/UaeEinvoicingCalculatorAr.tsx`: Wired `TurnstileWidget` in EN/AR readiness assessment lead capture.
3. Server Action & Verification Hardening (`lib/rate-limit.ts`):
   - `verifyTurnstile(token: string | undefined, ip?: string)`:
     - Cloudflare test key support when `ALLOW_TEST_TURNSTILE_KEY === 'true'` (passes for `1x...` test secret with `XXXX.DUMMY.TOKEN.XXXX` / `test-token`; blocks for `2x...` fail secret).
     - Graceful dev bypass when `SKIP_TURNSTILE_IN_DEV === 'true'` or placeholder secret.
     - Production validation with Cloudflare siteverify API and 5-second timeout (`AbortSignal.timeout(5000)`).
     - Fail closed (`false`) on network aborts or errors with telemetry reporting.
     - Consistent error response across `submitLead.ts` and `submitRFQ.ts`: `{ success: false, error: 'Security verification failed. Please refresh and try again.' }`.
4. Documentation & Contracts:
   - Updated `docs/CONTRACTS.md` with Section 8: Bot Protection & Cloudflare Turnstile Security Contract.
   - Updated `.env.example` with documented Turnstile variables and Cloudflare dummy test keys.
5. Unit Tests:
   - Created `__tests__/turnstile.test.ts` with 11 comprehensive tests for `verifyTurnstile`.
   - Updated `__tests__/contact-lead.test.ts` to test server action rejection on invalid and missing tokens.
   - Full test suite passes: 16 test files, 210 tests passed.
   - TypeScript check clean (`tsc --noEmit`).
   - Factory gate passes: `CARD_RISK=R2 bash scripts/agent/gate.sh` -> `GATE OK`.

---

# Agent Notes — TOOL-8: Tool share hooks: WhatsApp share + result permalinks

- **Card:** `TOOL-8` (Task `t_43f32f3b`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/tool-8-share`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_43f32f3b`

## Objectives & Scope
1. Implement WhatsApp deep-link sharing and result permalinks for Exvorta interactive trade tools:
   - English Incoterm & CBM Calculator (`/tools/incoterm-cbm`)
   - Arabic Incoterm & CBM Calculator (`/tools/incoterm-cbm/ar`)
   - Document Generator (`/tools/docs-generator`)
2. Pure logic share helpers in `lib/tools/share.ts`:
   - `buildWhatsAppShareUrl(text: string): string` -> `https://wa.me/?text=${encodeURIComponent(text)}`
   - `formatIncotermShareText(params: IncotermShareParams): string` (bilingual EN & AR)
   - `formatDocGenShareText(params: DocGenShareParams): string` (bilingual EN & AR)
   - `formatGenericToolShareText(params: GenericToolShareParams): string` (bilingual EN & AR)
   - Guarantees zero PII, zero tokens, zero user private details in URL query parameters.
3. Standardized, design-system compliant client component `components/tools/ToolShareBand.tsx`:
   - Tokenized UI: `font-mono text-xs uppercase tracking-wider`, `border-rule`, `hover:bg-cream`, `focus-visible:ring-obsidian`, `rounded-[4px]`.
   - Copy Link button with clipboard write, fallback textarea copy, and live polite feedback announcement (`aria-live="polite"`).
   - WhatsApp share anchor with `target="_blank" rel="noopener noreferrer"` and official green icon.
   - Umami event tracking dispatch: `trackEvent(ANALYTICS_EVENTS.TOOL_SHARE, { tool, method: 'copy_link' | 'whatsapp' })`.
   - Full RTL and logical property support (`dir={isAr ? 'rtl' : 'ltr'}`).
4. Tool UI integrations:
   - Replaced custom copy link buttons in `IncotermCbmCalculator.tsx` and `IncotermCbmCalculatorAr.tsx` with unified `ToolShareBand`.
   - Added `ToolShareBand` to action bar in `app/(frontend)/tools/docs-generator/page.tsx`.
5. Telemetry & Analytics Contract:
   - Added `TOOL_SHARE: 'tool_share'` in `lib/analytics.ts`.
   - Documented event schema and zero-PII privacy guarantee in `docs/CONTRACTS.md`.
6. Unit tests:
   - 17 unit tests in `lib/tools/share.test.ts` testing URL generation, Arabic percent encoding, optional parameter omission, and zero PII.
   - All tests passing in test suite.
   - TypeScript check clean (`tsc --noEmit`).
   - Factory gate passes (`GATE OK`).

---

# Previous Notes — TOOL-6 UAE e-invoicing (PINT-AE) readiness assessment

- **Card:** `TOOL-6` (Task `t_81913841`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/tool-6-einv-readiness`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_81913841`

## Objectives & Scope
1. Implement Pure Calculation Engine & Tests (`lib/tools/einv-readiness.ts`, `lib/tools/einv-readiness.test.ts`):
   - Strict compliance with `docs/research/regulatory-facts.md` (Decree-Law No. 16/17 of 2024, Cabinet Decision No. 106/2025, MD 243 & 244/2025, MR 66/2026).
   - Pure functions: `calculateReadinessScore`, `determinePhaseAndDeadline`, `getASPChecklist`, `evaluateReadiness`, `serializeAssessmentInput`, `deserializeAssessmentInput`.
   - 15 comprehensive unit tests covering phase thresholds (Phase 1 >50M July 2026, Phase 2 >10M Jan 2027, etc.), score calculation, technical checklists, permalink serialization, and edge cases.
2. English & Arabic Assessment Routes & Interactive Calculators:
   - `app/(frontend)/tools/uae-einvoicing/page.tsx`: English server component with institutional metadata, JSON-LD `SoftwareApplication` schema, and fallback skeleton.
   - `app/(frontend)/tools/uae-einvoicing/UaeEinvoicingCalculator.tsx`: Interactive client questionnaire, live score meter, deadline timer, ASP evaluation, and lead capture.
   - `app/(frontend)/tools/uae-einvoicing/ar/page.tsx`: Arabic RTL mirror route with full localization and bidirectional `hreflang` alternates.
   - `app/(frontend)/tools/uae-einvoicing/ar/UaeEinvoicingCalculatorAr.tsx`: Arabic client component with full RTL translations and technical guidance.
3. Sitemap & Contracts:
   - Registered `/tools/uae-einvoicing` and `/tools/uae-einvoicing/ar` in `app/sitemap.ts`.
   - Updated `docs/CONTRACTS.md` with the new tool routes and hreflang pairings.

## Verification Checklist
- [x] Run worktree setup (`bash scripts/agent/worktree-setup.sh`).
- [x] Post plan to Kanban board (`kanban_comment`).
- [x] Brief Antigravity worker via `agy-pool` with `gemini-3.8-flash-high`.
- [x] Unit tests passing (`pnpm exec vitest run lib/tools/einv-readiness.test.ts` -> 15 passed, full suite 180 passed).
- [x] TypeScript compiler clean (`pnpm exec tsc --noEmit` -> 0 errors).
- [x] ESLint clean (`pnpm lint` -> 0 errors).
- [x] Factory gate passes (`CARD_RISK=R0 bash scripts/agent/gate.sh` -> GATE OK).
