# Database Backup & Restore Runbook (Exvorta OS)

- **Document Version:** 1.0.0
- **Card:** `PLAT-11` (Task `t_0ab0b63f`)
- **Date Verified:** October 27, 2026
- **Status:** Sourced & Verified Runbook
- **Target Architecture:** Neon Serverless PostgreSQL + Drizzle ORM + Payload CMS 3.88

---

## 1. Overview & Architecture Summary

This runbook establishes verified procedures for restoring the Exvorta PostgreSQL database from logical backups and Neon point-in-time snapshots, fulfilling disaster recovery requirements under PLAT-11.

### 1.1 What Is Backed Up Where

| Component | Storage Location | Backup Mechanism | Classification | Verified Source |
| :--- | :--- | :--- | :--- | :--- |
| **Relational Data & CMS Collections** | Neon PostgreSQL (`public` schema) | Logical `pg_dump` plain SQL via `scripts/backup-db.sh` + Neon continuous WAL storage snapshots | **VERIFIED** | `scripts/backup-db.sh`, `payload.config.ts` (Oct 27, 2026) |
| **CMS Schema & Migrations** | `migrations/` & `drizzle/` tables | Tracked in Git repository; migration execution history tracked in database migration metadata tables | **VERIFIED** | `scripts/run-migration.ts`, `drizzle.config.ts` (Oct 27, 2026) |
| **Media Assets & Binaries** | Cloudinary Cloud Storage | Stored externally via Payload Cloudinary storage plugin (`payload/storage-cloudinary`). Binary files are NOT stored inside Postgres; only asset URLs/metadata are in Postgres. | **VERIFIED** | `payload.config.ts:136-147` (Oct 27, 2026) |
| **Environment & Secrets** | Vercel Project Settings / Secure Vault | Managed outside Git repository. The public repo and factory worktrees never store live credentials. | **VERIFIED** | `.env.example`, `scripts/agent/gate.sh` (Oct 27, 2026) |

### 1.2 Backup Cadence

1. **Continuous / Automated (Neon Infrastructure):**
   - **Neon WAL / PITR:** Neon provides continuous Write-Ahead Log (WAL) archiving allowing Point-in-Time Recovery to any second within the retention window (default 7 days on standard plans). [VERIFIED: Neon Architecture Specifications]
2. **Scheduled Logical Dumps (`scripts/backup-db.sh`):**
   - **Frequency:** Daily automated or weekly manual snapshot, and mandatory pre-migration snapshot prior to applying breaking schema changes or major CMS upgrades. [ASSUMPTION: Recommended operational baseline for Exvorta]
   - **Artifact Location:** `./backups/exvorta_backup_${TIMESTAMP}.sql` (ephemeral local storage; must be synced to cold storage by owner). [VERIFIED: `scripts/backup-db.sh:31-36`]

---

## 2. Roles, Permissions & Secret Boundaries

Strict separation of concerns applies between automated worker profiles and the project owner:

### 2.1 Owner-Only Secrets & Roles
The project **OWNER** holds and manages:
- **Neon Cloud Console Administration:** Access to project branching, point-in-time restore, role assignment, and endpoint configuration.
- **`neondb_owner` Role Credentials:** The administrative PostgreSQL superuser/owner role used for schema recreation and DDL privileges (`GRANT ALL ON SCHEMA public TO neondb_owner`).
- **Production Connection Strings:**
  - `DATABASE_URI`: Pooled connection string (`ep-*-pooler...`) with PgBouncer for Next.js runtime.
  - `DATABASE_URI_UNPOOLED`: Direct connection string (`ep-...`) for DDL migrations, advisory locks, and backup/restore.
- **Production `PAYLOAD_SECRET`:** 32-byte encryption key for Payload CMS sessions and auth tokens.
- **Production `CLOUDINARY_*` API Keys:** Required to restore or sync media libraries.

### 2.2 Worker Boundary (Zero Secrets Policy)
- Automated agent workers and CI runners **NEVER** hold, log, or receive production credentials.
- `scripts/agent/worktree-setup.sh` and `scripts/agent/gate.sh` strictly reject and block on any secret-shaped tokens (`npg_*`, private keys, embedded connection passwords).

---

## 3. Step-by-Step Database Restore Procedure

Follow these exact steps during an incident or scheduled disaster recovery drill.

### Step 1: Pre-Flight & Target Isolation (Est. 3 min)
1. Determine the restore target:
   - **For drills or staging:** Create an isolated Neon branch via the Neon Console (`drills/restore-test-YYYYMMDD`). **NEVER restore directly into active production during a drill.**
   - **For disaster recovery:** If restoring production, place the site in maintenance mode or stop Vercel traffic to prevent split-brain writes.
2. Obtain the target direct (unpooled) connection string:
   ```bash
   export TARGET_DATABASE_URI="<direct-unpooled-connection-string-from-neon-console>"
   ```
   > [!IMPORTANT]
   > Always use the direct unpooled endpoint (`DATABASE_URI_UNPOOLED`). Pooled connections through PgBouncer block DDL locks and schema manipulation commands.

### Step 2: Retrieve & Verify Backup File (Est. 2 min)
1. Verify the integrity and size of the backup dump:
   ```bash
   ls -lh ./backups/exvorta_backup_*.sql
   head -n 20 ./backups/exvorta_backup_<TIMESTAMP>.sql
   tail -n 20 ./backups/exvorta_backup_<TIMESTAMP>.sql
   ```
2. Confirm the dump contains valid PostgreSQL plain-text commands (`SET statement_timeout`, `CREATE TABLE`, `COPY`, etc.).

### Step 3: Schema Clean / Reset (Est. 2 min)
Execute the verified schema wipe sequence from `scripts/reset-db.ts` to ensure an idempotent, clean restoration target:
```bash
# Option A: Run reset script against target connection
DATABASE_URI_UNPOOLED="$TARGET_DATABASE_URI" npx tsx scripts/reset-db.ts

# Option B: Manual SQL execution via psql
psql "$TARGET_DATABASE_URI" << 'EOF'
-- Terminate existing connections to target
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid <> pg_backend_pid()
  AND state in ('idle', 'active', 'idle in transaction', 'disabled');

-- Wipe schema and drizzle metadata
DROP SCHEMA IF EXISTS public CASCADE;
DROP SCHEMA IF EXISTS drizzle CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO neondb_owner;
ALTER DATABASE current_database() SET search_path TO public;
EOF
```
*Source: `scripts/reset-db.ts:28-53` [VERIFIED]*

### Step 4: Import Backup Data (Est. 5-10 min)
Stream the plain SQL backup into PostgreSQL using `psql`:
```bash
psql --set ON_ERROR_STOP=on "$TARGET_DATABASE_URI" < ./backups/exvorta_backup_<TIMESTAMP>.sql
```
*Source: `scripts/backup-db.sh:60` [VERIFIED]*

### Step 5: Validate Schema & Migration Alignment (Est. 3 min)
Run the migration runner with the Next.js environment shim to check migration sync:
```bash
NODE_OPTIONS="--require ./scripts/next-env-shim.cjs" \
DATABASE_URI_UNPOOLED="$TARGET_DATABASE_URI" \
npx tsx scripts/run-migration.ts status
```
*Source: `scripts/run-migration.ts:17-22` [VERIFIED]*

### Step 6: Application Smoke Test & Data Verification (Est. 5 min)
Verify Payload CMS can query core collections through the restored connection:
```bash
DATABASE_URI="$TARGET_DATABASE_URI" \
PAYLOAD_SECRET="temporary-drill-secret-or-production-secret" \
npx tsx scripts/test-db.ts
```
Expected output:
```
Testing Payload connection...
✅ Pages found: [N]
✅ Home page: Home (or configured page title)
```
*Source: `scripts/test-db.ts:7-12` [VERIFIED]*

---

## 4. Monthly 30-Minute Restore Drill Checklist

The project Owner or Lead Engineer must conduct this drill monthly to validate business continuity. Target completion time: `< 30 minutes`.

- [ ] **T+00m — Drill Initialization:**
  - [ ] Log drill start time in operational log.
  - [ ] Create a dedicated drill branch in Neon Console (`git-style branch from prod` or fresh database).
- [ ] **T+05m — Capture Fresh Backup:**
  - [ ] Run `DATABASE_URI="[PROD_URI]" ./scripts/backup-db.sh`.
  - [ ] Confirm file created in `./backups/` and note size.
- [ ] **T+10m — Execute Restore:**
  - [ ] Run reset script against drill branch target.
  - [ ] Execute `psql "$DRILL_DB_URI" < ./backups/exvorta_backup_[TIMESTAMP].sql`.
- [ ] **T+20m — Integrity & Smoke Verification:**
  - [ ] Run `scripts/run-migration.ts status` — confirm no unapplied pending migrations.
  - [ ] Run `scripts/test-db.ts` — confirm Pages and Home page return valid records.
  - [ ] Confirm Cloudinary asset URLs resolve on sample Page documents.
- [ ] **T+25m — Teardown:**
  - [ ] Delete temporary drill branch in Neon Console to prevent compute accrual.
  - [ ] Clean up local test backup dump from local workspace.
- [ ] **T+30m — Sign-Off:**
  - [ ] Record drill completion, elapsed time, and findings.

---

## 5. Findings, Assumptions & Open Questions

### Findings Table
| Fact / Policy | Label | Primary Source | Verified Date |
| :--- | :--- | :--- | :--- |
| Backup script exports plain SQL without owner/privileges | **VERIFIED** | `scripts/backup-db.sh:45-51` | Oct 27, 2026 |
| Migrations and DDL require unpooled direct URI | **VERIFIED** | `payload.config.ts:47-62` | Oct 27, 2026 |
| Reset script safely drops `public` and `drizzle` schemas with cascade | **VERIFIED** | `scripts/reset-db.ts:38-51` | Oct 27, 2026 |
| Binary media files reside on Cloudinary, not inside PostgreSQL dump | **VERIFIED** | `payload.config.ts:136-147`, `docs/getting-started.md:33-35` | Oct 27, 2026 |
| Offsite storage destination for `./backups/*.sql` is currently local only | **VERIFIED** | `scripts/backup-db.sh:32-36` | Oct 27, 2026 |

### Open Questions & Needs Input (`needs_input`)
1. **Offsite Storage Automation:** `./backups/` currently saves SQL dumps to the local disk where the script is executed. An automated cron/action uploading encrypted dumps to an offsite S3/GCS bucket with lifecycle retention is recommended.
2. **Cloudinary Asset Backup Policy:** PostgreSQL holds media URLs; if assets in Cloudinary are accidentally deleted, PostgreSQL restore alone will not recover binary images. Owner should confirm whether Cloudinary backup/versioning is enabled.

---

## 6. Reviewer Summary & Verification Log

- **Author Profile:** `exvorta-researcher`
- **Verification Method:** Direct inspection of repo scripts (`backup-db.sh`, `reset-db.ts`, `db-setup.sh`, `run-migration.ts`, `test-db.ts`), database configuration (`payload.config.ts`, `drizzle.config.ts`), and environment specification (`.env.example`).
- **Not verified:** Live execution of `psql` restore against a production database (prevented by design: no live production credentials in factory worktree; live drill must be executed by owner).
