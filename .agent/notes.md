# Agent Notes — PLAT-11: DB backup & restore runbook

- **Card:** `PLAT-11` (Task `t_0ab0b63f`)
- **Assignee:** `exvorta-researcher`
- **Risk Level:** `R0`
- **Branch:** `card/plat-11-backups`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_0ab0b63f`

## Completed Actions
1. Initialized card worktree and verified environment under risk profile `R0`.
2. Inspected database configuration, scripts, and documentation (`drizzle.config.ts`, `payload.config.ts`, `scripts/backup-db.sh`, `scripts/reset-db.ts`, `scripts/run-migration.ts`, `scripts/test-db.ts`, `docs/getting-started.md`, `.env.example`).
3. Created comprehensive restoration runbook and drill checklist at `docs/runbooks/db-restore.md`:
   - Backup architecture & components (Neon WAL/PITR, logical SQL dumps, external Cloudinary media).
   - Roles and permission boundaries (owner credentials vs worker zero-secrets policy).
   - Step-by-step restoration procedure via direct unpooled connection string.
   - Monthly 30-minute disaster recovery drill checklist.
   - Sourced facts table (VERIFIED / ASSUMPTION) and open questions for project owner.

## Verification
- Validating repository state against factory gate (`CARD_RISK=R0 bash scripts/agent/gate.sh`).
