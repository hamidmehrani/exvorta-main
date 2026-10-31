# Agent Notes — TOOL-7 Tools hub /tools: index, SEO copy, email capture band

- **Card:** `TOOL-7` (Task `t_23954506`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/tool-7-hub`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_23954506`

## Objectives & Scope
1. Implement Trade Tools Hub index page (`/tools`):
   - Institutional dark hero section (`bg-obsidian`, `bg-aura-dark`, `bg-blueprint-grid-dark`) with eyebrow `[ SYS_INDEX // UTILITIES_ENGINE ]` and metrics/trust ribbon (`[ ZERO PAYWALLS ]`, `[ 100% UNRESTRICTED ]`, `[ AUDIT-READY MATH ]`, `[ ENTERPRISE SCHEMAS ]`).
   - Catalog section organizing live utilities and upcoming roadmap modules.
   - 3 Live tools with immediate production launch actions:
     - Incoterm & CBM Logistics Calculator (`/tools/incoterm-cbm`, plus Arabic alternate `/tools/incoterm-cbm/ar`)
     - Commercial Export Documentation Generator (`/tools/docs-generator`)
     - RFQ Cart & Spec Builder (`/rfq`)
   - 3 Roadmap tools with notify/waitlist hooks:
     - GCC HS 8→12-Digit Tariff Converter (`/waitlist?tool=hs-converter`)
     - Egypt ACI & KSA SABER Readiness Checker (`/waitlist?tool=readiness-checker`)
     - UAE E-Invoicing (PINT-AE) Assessment (`/waitlist?tool=einvoicing`)
   - "Why Our Trade Utilities Are Free & Public" institutional transparency section (Mathematical Transparency, Zero-Friction Evaluation, Regulatory Standardization).
2. Structured Data:
   - Schema.org `ItemList` JSON-LD schema with `WebApplication` entries declaring `offers: { price: "0", priceCurrency: "USD" }`.
3. Client Email Capture Band (`components/blocks/ToolsWaitlistBand.tsx`):
   - Accessible corporate email input with Turnstile / server action integration (`submitWaitlist({ source: 'Tools Hub', collection: 'waitlist' })`).
   - ARIA status and polite live announcements for success / error states.
4. Sitemap & Routing Contracts:
   - Registered `/tools` (priority 0.9, weekly) and `/tools/docs-generator` (priority 0.8, monthly) in `app/sitemap.ts`.
   - Updated `docs/CONTRACTS.md` routes table and documented ItemList schema invariants.
5. Automated Tests:
   - Added unit test suite in `__tests__/tools-hub.test.ts` testing metadata, hreflang alternates, catalog completeness, JSON-LD schema validity, and component rendering.

## Verification Checklist
- [x] Run worktree setup (`bash scripts/agent/worktree-setup.sh`).
- [x] Post plan to Kanban board (`kanban_comment`).
- [x] Brief Antigravity worker via `agy-pool` with `gemini-3.8-flash-high`.
- [x] Unit tests passing (`pnpm exec vitest run __tests__/tools-hub.test.ts` -> 15 passed, full suite 152 passed).
- [x] TypeScript compiler clean (`pnpm exec tsc --noEmit` -> 0 errors).
- [x] ESLint clean (`pnpm lint` -> 0 errors).
- [x] Factory gate passes (`CARD_RISK=R0 bash scripts/agent/gate.sh` -> GATE OK).
