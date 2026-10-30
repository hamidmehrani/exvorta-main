# Agent Notes — TOOL-4: GCC HS 8→12-digit converter & duty lookup

- **Card:** `TOOL-4` (Task `t_b3094344`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0` (Additive)
- **Branch:** `card/tool-4-hs-converter`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_b3094344`

## Objectives & Scope
1. Implement pure calculation and tariff lookup engine (`lib/tools/hs-converter.ts`) grounded in GCC Unified Customs Tariff (8-digit) and national 12-digit extensions for UAE (Dubai Customs Notice 10/2025, Cabinet Resolution 119/2024) and KSA (ZATCA Resolution 1447-88-5).
2. Author comprehensive Vitest test suite (`lib/tools/hs-converter.test.ts`) covering 8-to-12 digit conversion, code normalization, CIF duty/VAT/excise calculations, and search across codes and bilingual descriptions (29 tests).
3. Author interactive client UI component (`app/(frontend)/tools/hs-lookup/HsConverterTool.tsx`) with search, jurisdiction filters, quick-select preset chips, 8→12 digit breakdown panel, dynamic CIF duty estimator, controlling authority notes, statutory citation badges, and URL state synchronization.
4. Author server page route (`app/(frontend)/tools/hs-lookup/page.tsx`) with SEO metadata, bidirectional hreflang alternates, `<Suspense>` boundary, and closing lead-gen CTA band.
5. Author Arabic mirror (`app/(frontend)/tools/hs-lookup/ar/HsConverterToolAr.tsx` and `app/(frontend)/tools/hs-lookup/ar/page.tsx`) with `dir="rtl" lang="ar"`, CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`), and professional Arabic customs terminology.
6. Author parity redirect alias (`app/(frontend)/tools/hs-converter/page.tsx`) forwarding to `/tools/hs-lookup`.
7. Author route and sitemap tests (`__tests__/tools/hs-lookup.test.ts`).
8. Register `/tools/hs-lookup` and `/tools/hs-lookup/ar` in `app/sitemap.ts` (`STATIC_ROUTES`).
9. Document tool contract in `docs/CONTRACTS.md`.

## Verification Checklist
- [x] Orient worktree and confirm baseline dependencies (`bash scripts/agent/worktree-setup.sh`).
- [x] Brief pure calculation engine and tests via Antigravity worker (`lib/tools/hs-converter.ts`, `lib/tools/hs-converter.test.ts`).
- [x] Brief frontend UI components and App Router pages via Antigravity worker (`HsConverterTool.tsx`, `page.tsx`, `HsConverterToolAr.tsx`, `ar/page.tsx`, `hs-converter/page.tsx`).
- [x] Register routes in `app/sitemap.ts`.
- [x] Document route and engine contracts in `docs/CONTRACTS.md`.
- [x] Author metadata and sitemap tests in `__tests__/tools/hs-lookup.test.ts`.
- [x] Verify tests: `pnpm exec vitest run lib/tools/hs-converter.test.ts` (29 passed).
- [x] Verify tests: `pnpm exec vitest run __tests__/tools/hs-lookup.test.ts` (5 passed).
- [x] Verify full test suite: `pnpm exec vitest run` (159 passed).
- [x] Verify TypeScript: `pnpm exec tsc --noEmit` (0 errors).
- [x] Verify Lint: `pnpm lint` (0 errors).
- [x] Run factory gate: `CARD_RISK=R0 bash scripts/agent/gate.sh` (GATE OK).
