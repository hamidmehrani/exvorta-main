# Agent Notes — PG-08 Contact page upgrade: project brief form + expectations

- **Card:** `PG-08` (Task `t_532db4e8`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/pg-08-contact`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_532db4e8`

## Objectives & Scope
1. Transform `/contact` contact form into a structured project brief form.
2. Form fields:
   - Full Name (`name`, required)
   - Business Email (`email`, required)
   - Company Name (`company`, required)
   - Type of Trade (`tradeType`, required: Agricultural Commodities & Food, Building Materials & Construction, Chemicals & Polymers, Consumer / FMCG / Retail, Industrial Equipment & Machinery, Metals & Minerals, Textiles & Apparel, General Trading & Commodities, Other / Specialized)
   - Current Website / Digital Presence (`currentSite`, optional)
   - Budget Band (`budgetBand`, required: $25k–$50k, $50k–$100k, $100k–$250k, $250k+)
   - Target Timeline (`timeline`, required: Immediate (< 1 mo), 1–3 months, 3–6 months, Exploring / Planning)
   - Project Scope & Requirements (`message`, required)
   - Preferred Communication (`callPreference`, required: Async Review Only [default], Request Intro Call)
3. Async-first expectation copy:
   - Clear expectation note: "Strictly async-first: Every brief is evaluated directly by senior engineers within 1 business day. No unsolicited sales calls and zero spam."
4. Structured success state ("What happens next"):
   - 3-step timeline:
     - 01: Engineering Review (Direct analysis of technical requirements and trade constraints within 1 business day)
     - 02: Architectural Scope & Estimate (Detailed written response with fixed-price or milestone estimates)
     - 03: Alignment (Direct kickoff or async specification review per communication preference)
5. Integration & Security:
   - Passes extra brief fields via `actions/submitLead.ts` into Payload lead record JSON `payload` object.
   - Defaults `source` to `'RFQ'` if not supplied or empty.
   - Cloudflare Turnstile token validation and honeypot (`bot-field`).
   - WCAG-AA compliant accessible form controls, labels, and status announcements.
6. Verification & Test Coverage:
   - Unit tests added in `__tests__/contact-lead.test.ts` exercising `submitLeadAction` payload extraction, bot-field rejection, email validation, and Turnstile checking.
   - Full test suite passing (131 tests).
   - Gate verification passing cleanly (`GATE OK` under `CARD_RISK=R1`).

---

# Previous Notes — PG-07: Partner program page (tax consultants, clearing agents, free-zone setup agencies)

- **Card:** `PG-07` (Task `t_cfc26138`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/pg-07-partners`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_cfc26138`

## Objectives & Scope
1. Implement institutional Channel Partner Program page (`/partners`) targeting key professional intermediaries:
   - Tax Consultants & Corporate Tax Advisors
   - Clearing Agents & Customs Brokers
   - Free-Zone Setup & Company Formation Agencies
2. Institutional 20% flat revenue share across all Exvorta web platform tiers (Starter $1,500 / $300 share, Growth $3,000 / $600 share, Custom Enterprise $10,000+ / $2,000+ share, Retainers/Add-ons).
3. Client-side interactive accreditation form (`PartnerApplicationForm.tsx`) using `useActionState`, tokenized design system primitives, honeypot spam detection, and `submitLeadAction` integration.
4. Server-side page layout (`page.tsx`) with metadata, OpenGraph, JSON-LD schemas (`FAQPage`, `Service`), structured commission ledger, 4-step referral workflow, value stack, and FAQ.
5. Register `/partners` in `app/sitemap.ts` (`STATIC_ROUTES` priority 0.8, weekly).
6. Document route contract and submission semantics in `docs/CONTRACTS.md`.
7. Author comprehensive Vitest test suite (`__tests__/partners.test.ts`) covering partner categories, commission calculations, form rendering, ARIA semantics, and sitemap registration.

## Verification Checklist
- [x] Orient worktree and confirm baseline dependencies (`bash scripts/agent/worktree-setup.sh`).
- [x] Author structured partner data & constants in `app/(frontend)/partners/partners-data.ts`.
- [x] Build accessible `PartnerApplicationForm` component in `app/(frontend)/partners/PartnerApplicationForm.tsx`.
- [x] Build institutional `/partners` landing page in `app/(frontend)/partners/page.tsx`.
- [x] Register `/partners` route in `app/sitemap.ts`.
- [x] Document route contract in `docs/CONTRACTS.md`.
- [x] Add comprehensive test coverage in `__tests__/partners.test.ts`.
- [x] Run full test suite (`pnpm exec vitest run` -> 137 passed).
- [x] Run TypeScript check (`pnpm exec tsc --noEmit` -> 0 errors).
- [x] Run linter (`pnpm lint` -> 0 errors).
- [x] Run factory gate (`CARD_RISK=R0 bash scripts/agent/gate.sh` -> GATE OK).
