# Agent Notes — PG-07: Partner program page (tax consultants, clearing agents, free-zone setup agencies)

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
