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
   - Updated `lib/analytics.ts` to include `cta_click` in `UmamiEventMap`.
   - Updated `docs/CONTRACTS.md` with Section CTA and Sticky Quote Bar specifications, tracking contracts, and dismissal persistence behaviors.
5. Verification:
   - `__tests__/section-cta.test.ts` (unit tests for SectionCtaBand component and click tracking).
   - `__tests__/sticky-quote-bar.test.ts` (unit tests for StickyQuoteBar visibility, scroll handling, dismiss state, and localStorage persistence).
   - `__tests__/pricing.test.ts` (updated pricing route render tests).
   - Full Vitest suite passing (294 tests).
   - `CARD_RISK=R1 bash scripts/agent/gate.sh` passes with `GATE OK`.
