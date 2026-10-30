# Agent Notes — PLAT-06: Accessibility sweep (WCAG-AA baseline)

- **Card:** `PLAT-06` (Task `t_250d0f18`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R1`
- **Branch:** `card/plat-06-a11y`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_250d0f18`

## Requirements & Scope
1. WCAG 2.1 AA baseline across core sales and utility routes (`/`, `/launchpad`, `/rfq`, `/contact`, `/tools/*`).
2. Verify `<SkipToContent />` component and ensure `#main-content` landmark association across all pages via `PageWrapper.tsx`.
3. Standardize `:focus-visible` styles with design token contrast (`var(--color-obsidian)` / `#ffffff`).
4. Audit explicit `<label>` bindings, `aria-required`, and accessible alert announcements on `RFQForm.tsx` and `ContactForm.tsx`.
5. Author complete accessibility guidelines and RFQ keyboard traversal walkthrough in `docs/a11y.md`.
6. Enforce zero critical/serious axe violations and clean gate verification (`GATE OK`).

## Current Status
- Verified `SkipToContent.tsx` skip navigation link wiring to `#main-content`.
- Verified single `<main id="main-content">` landmark in `components/layout/PageWrapper.tsx`.
- Verified form control accessibility in `RFQForm.tsx` and `ContactForm.tsx`.
- Created comprehensive standard documentation in `docs/a11y.md`.
- Sourced `scripts/agent/env.sh` and verified `CARD_RISK=R1 bash scripts/agent/gate.sh` passes (`GATE OK`, 121 tests passing).
