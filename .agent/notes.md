# Agent Notes — CONV-04: 'Send your last 3 shipments' concierge flow

- **Card:** `CONV-04` (Task `t_e5f2a76b`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/conv-04-concierge`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_e5f2a76b`

## Objectives & Scope
1. `/concierge` route (`app/(frontend)/concierge/page.tsx`):
   - Hero section: "Send your last 3 shipments" / async concierge intake, Dubai trade desk header, SLA badge (`24H_AUDIT_SLA`).
   - 3-step mechanics per `docs/runbooks/concierge-24h-audit.md`:
     - Step 01: Submit shipment parameters / last 3 CI (Commercial Invoice), PL (Packing List), or BL (Bill of Lading).
     - Step 02: 24-Hour Private Video Audit & 100-Point Export Index diagnostic (synthesizing top 3 commercial friction points).
     - Step 03: Preloaded Exvorta Workspace & tailored deployment scope (Launchpad $1,500 or Global Trade Infrastructure $3,000).
   - Dedicated Intake Form (`components/forms/ConciergeIntakeForm.tsx`):
     - Uses existing server action `submitLeadAction` (`actions/submitLead.ts`): zero client documents stored in repo or database; captures verified corporate contact, trade lane, monthly export volume, document checklist (CI, PL, BL), and preferred submission channel.
     - Expectation copy & security guarantee: strict confidentiality, TLS 1.3, zero third-party brokering, async-first turnaround within 24 hours.
2. Upload Path Decision Documentation:
   - `docs/runbooks/concierge-upload-path-decision.md`: Architectural decision and analysis comparing Option 1 (Cloudinary Signed Upload) vs Option 2 (Encrypted Email-to-Owner / Secure Cloud Drive Link), evaluating security, compliance (ADR-003 public repo hygiene, zero client data in DB/repo), operational friction, and concrete recommendation.
   - Update `docs/CONTRACTS.md` with route contract, submission schema, and operational constraints.
   - Update `app/sitemap.ts` to include `/concierge`.
3. Verification:
   - Factory gate checks (`CARD_RISK=R1 bash scripts/agent/gate.sh`).
   - All code generation dispatched to `agy-pool` with `gemini-3.8-flash-high`.

---

# Agent Notes — CONV-07: Scroll CTAs + sticky quote bar (tasteful)

- **Card:** `CONV-07` (Task `t_492a86c5`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/conv-07-ctas`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_492a86c5`

## Objectives & Scope
1. Implement tasteful scroll-triggered CTAs and a sticky quote bar across key conversion routes adhering to `design-system.md` and analytics contracts (`docs/CONTRACTS.md`).
2. Components created:
   - `components/ui/SectionCtaBand.tsx`: Scroll-triggered / in-page CTA section featuring institutional typography, subtle micro-accents, responsive action buttons (`/rfq`, `/contact`), and Umami analytics tracking (`cta_click`).
   - `components/ui/StickyQuoteBar.tsx`: Tasteful bottom-docked sticky proposal and quote bar. Appears smoothly after scrolling past 300px, includes dismiss button with persistent localStorage dismissal (`exvorta_sticky_quote_dismissed_<key>`), mobile-safe padding avoiding floating widgets, and Umami tracking (`sticky_quote_click`, `sticky_quote_dismiss`).
3. Integration:
   - Integrated `SectionCtaBand` and `StickyQuoteBar` into `/pricing` (`app/(frontend)/pricing/page.tsx`).
4. Analytics & Contracts:
   - Updated `lib/analytics.ts` to include `cta_click` in `UmamiEventMap``.
   - Updated `docs/CONTRACTS.md` with Section CTA and Sticky Quote Bar specifications, tracking contracts, and dismissal persistence behaviors.
5. Verification:
   - `__tests__/section-cta.test.ts` (unit tests for SectionCtaBand component and click tracking).
   - `__tests__/sticky-quote-bar.test.ts` (unit tests for StickyQuoteBar visibility, scroll handling, dismiss state, and localStorage persistence).
   - `__tests__/pricing.test.ts` (updated pricing route render tests).
   - Full Vitest suite passing (294 tests).
   - `CARD_RISK=R1 bash scripts/agent/gate.sh` passes with `GATE OK`.
