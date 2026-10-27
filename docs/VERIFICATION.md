# Exvorta Verification Tooling & Quality Gate Guide

**Card:** GROUND-0 (`t_fad6cf4e`)  
**Status:** VERIFIED against `main` (commit baseline)  
**Owner:** Exvorta Architecture (`exvorta-architect`)  
**Audience:** All factory profiles (`exvorta-builder`, `exvorta-qa`, `exvorta-reviewer`)

---

## 1. Overview

The Exvorta factory enforces multi-layered verification: local pre-submission checks via `scripts/agent/gate.sh`, automated visual regression and link integrity checks, and Vercel's atomic production deployment gate on `main`.

---

## 2. Verification Scripts Inventory

### A. Visual Regression & Design Acceptance (`scripts/take-screenshots.js`)
- **Purpose:** Proves visual fidelity against `Exvorta designs/<page>/screen.png` acceptance targets.
- **How it works:** Launches a headless Chromium instance via Playwright. Navigates to local routes across two standardized viewports:
  - Desktop: `1440 x 900`
  - Mobile: `390 x 844`
  Captures full-page screenshots into the `screenshots/` directory.
- **How to run:**
  ```bash
  # 1. Start development server in one terminal
  pnpm dev

  # 2. Run capture script in another shell
  node scripts/take-screenshots.js
  ```
- **Companion scripts:**
  - `scripts/take-insights-screenshots.js` — Captures dedicated views of the `/insights` archive and dynamic articles.
  - `scripts/capture-portfolio-screenshots.mjs` — Captures `/portfolio` and case study detail routes.

### B. Lighthouse Performance & Core Web Vitals (`run_baselines.sh` / `scripts/lighthouse-ci.sh`)
- **Purpose:** Proves that routes meet performance, SEO, best practices, and accessibility baselines with zero regressions.
- **How it works:** Executes Google Lighthouse CI against key production routes (`/`, `/portfolio`, `/insights`, `/rfq`). Evaluates Core Web Vitals (LCP, CLS, FCP) and generates report summaries.
- **How to run:**
  ```bash
  bash run_baselines.sh
  # or for dedicated CI run:
  bash scripts/lighthouse-ci.sh
  ```

### C. Broken Link & Anchor Crawling (`linkinator`)
- **Purpose:** Proves that all internal route links, anchor references, and cross-page navigation links resolve without 404 errors or redirection loops.
- **How it works:** Installed as a repository development dependency (`package.json`). Recursively spiders the site from the root URL and flags any non-200 responses.
- **How to run:**
  ```bash
  pnpm exec linkinator http://localhost:3000 --recurse --skip "^(?!http://localhost:3000)"
  ```

### D. Style & Token Consistency Checks (`scripts/check-dups.js`, `scripts/check-dups2.js`)
- **Purpose:** Proves that components do not accumulate redundant Tailwind utility classes, conflicting declarations, or duplicate key collisions.
- **How to run:**
  ```bash
  node scripts/check-dups.js
  node scripts/check-dups2.js
  ```

### E. The Factory Quality Gate (`scripts/agent/gate.sh`)
- **Purpose:** The mandatory verification gate for every card worktree. A card is only complete when `scripts/agent/gate.sh` outputs `GATE OK`.
- **Verification steps executed:**
  1. `changed` — Computes diff against `origin/main`.
  2. `scope` — Forbids prohibited files (`.env*`, `.pem`, `.db`, `.vercel/`) and checks protected infra paths against `CARD_RISK`.
  3. `docs-guard` — Forbids modifications to manager-owned `docs/blueprint.md` on `card/*` branches.
  4. `secrets` — Scans modified lines for leaked API keys, tokens, or credentials.
  5. `compile` — Validates shell scripts (`bash -n`) and TypeScript type-safety (`pnpm exec tsc --noEmit`).
  6. `lint` — Runs ESLint across the codebase (`pnpm lint`).
  7. `tests` — Runs unit tests via `pnpm exec vitest run` if vitest is installed.
- **How to run:**
  ```bash
  CARD_RISK=R0 bash scripts/agent/gate.sh
  ```

---

## 3. Honest Gap Analysis: Unit-Test Runner

- **Identified Gap:** The repository includes a test configuration stub at `__tests__/setup.ts`, but **no unit-test runner (e.g. `vitest` or `jest`) is currently declared in `package.json` dependencies**.
- **Current Behavior:** In `scripts/agent/gate.sh` (Step 7), test execution is intentionally skipped with the status note:
  > `vitest SKIP (vitest not installed yet — the first tool card adds it; see blueprint ADR-004)`
- **Resolution Path:** In accordance with Wave A task planning, `TOOL-1` (`/tools/incoterm-cbm`) will introduce `vitest` as a devDependency to verify pure TypeScript engines in `lib/tools/` without bloating production bundles.
- **Proposed Decision:** Formalized in **ADR-004 (Adopt Vitest)** submitted via card comment.
