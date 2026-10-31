# Agent Notes — AGY-02: RFQ catalog builder script for client setups

- **Card:** `AGY-02` (Task `t_a4880467`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/agy-02-catalog-builder`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_a4880467`

## Objectives & Scope
1. Implement a pure TypeScript catalog builder, validator, and CSV parser (`lib/rfq-catalog-builder.ts`):
   - `validateCatalog(raw: unknown): ValidationResult`: Strict validation of slug (`/^[a-z0-9_-]+$/`), name, non-empty products array, product id (`/^[a-z0-9_-]+$/i`), uniqueness check, non-empty name and unit, positive finite MOQ (> 0).
   - `parseCsvCatalog(csvContent: string, options?: { slug?: string; name?: string })`: Robust CSV parser handling quotes, escaped quotes, CRLF/LF line breaks, header alias normalization, fallback/override options, and row error reporting.\
   - `buildCatalogJson(catalog: Catalog, indent: number = 2): string`: Deterministic JSON serializer strictly matching `public/rfq-catalogs/example.json`.
2. Implement comprehensive Vitest test suite (`lib/rfq-catalog-builder.test.ts`):
   - 29 unit and integration tests covering all valid/invalid schemas, round trips, header aliases, quoted strings, edge cases, and CLI child process execution.
3. Executable CLI script (`scripts/build-rfq-catalog.mjs`):
   - Self-contained executable Node.js script (`#!/usr/bin/env node`) with zero runtime npm dependencies using native `node:fs`, `node:path`, `node:process`.
   - Supports `-i, --input`, `-s, --slug`, `-n, --name`, `-o, --out`, `-c, --check`, `-h, --help`, and positional arguments.
   - Formatted stderr output on validation errors with row numbers; returns exit code 0 on success, 1 on failure.
4. Agency Documentation Update (`app/(frontend)/for-agencies/page.tsx`):
   - Integrated Step 1 CSV template specification, build CLI command, flag documentation, and header aliases table adhering to Institutional Elite design tokens.

## Verification
- `pnpm exec vitest run lib/rfq-catalog-builder.test.ts`: 29 passed.
- `pnpm exec tsc --noEmit`: PASS.
- `pnpm lint`: PASS.
- `CARD_RISK=R0 bash scripts/agent/gate.sh`: PASS (GATE OK).
