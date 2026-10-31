# Agent Notes — CONV-01: WhatsApp CTA component + deep links site-wide

- **Card:** `CONV-01`
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/conv-01-whatsapp`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_931e3b3f`

## Objectives & Scope
1. Implement clean WhatsApp helper utilities in `lib/whatsapp.ts`:
   - `formatWhatsAppPhone`: Strips non-digit characters, defaults to `'97148793000'`.
   - `buildWhatsAppPrefill`: Bilingual contextual prefilled messages for `general`, `service`, `pricing`, `contact`, and `custom` contexts.
   - `buildWhatsAppUrl`: Generates clean, encoded `wa.me` deep links.
   - Exported constants `DEFAULT_WHATSAPP_PHONE` and `WHATSAPP_DISMISSED_STORAGE_KEY`.
2. Unit test suite `lib/whatsapp.test.ts`:
   - 20 unit tests covering normalization, URL formatting, unicode/Arabic encoding, contextual prefills, and edge cases.
3. Institutional floating widget `components/ui/WhatsAppFloat.tsx`:
   - Design tokens: `bg-obsidian/95`, `border-rule-dark`, `text-cream`, `shadow-2xl`.
   - Position: `bottom-6 end-6 z-40` with logical RTL flip.
   - Live pulse indicator (`bg-emerald-500` ping) with localized label ("Trade Desk Active" / "مكتب التداول نشط").
   - Dismissal: Subtle `X` button with `localStorage.setItem('exv_wa_dismissed', 'true')` and SSR-safe `useEffect` check.
   - Telemetry: Dispatches `trackEvent(ANALYTICS_EVENTS.WHATSAPP_CLICKED, { location: 'floating_widget', page: window.location.pathname })`.
4. Reusable inline deep-link component `components/ui/WhatsAppLink.tsx`:
   - Provides accessible anchor with automated click telemetry.
5. Inline deep links site-wide:
   - `components/blocks/ContactFormBlock.tsx`: Added WhatsApp Trade Desk direct channel with `contact` prefill and click telemetry.
   - `app/(frontend)/pricing/pricing-data.ts` & `page.tsx`: Added WhatsApp Trade Desk direct channel with pricing context, Enterprise package WhatsApp CTA, and Commercial Dispatch CTA.
   - `components/layout/Footer.tsx` & `FooterContent.tsx`: Auto-formats WhatsApp links using `buildWhatsAppUrl` and wires `whatsapp_clicked` telemetry.
   - `components/layout/DeferredWidgets.tsx`: Correctly wires `WhatsAppFloat` with CMS configuration.
6. Documentation & Contracts:
   - Documented Section 8 (WhatsApp Integration & Deep Link Contract) in `docs/CONTRACTS.md`.

---

# Previous Notes — TOOL-8: Tool share hooks: WhatsApp share + result permalinks

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
