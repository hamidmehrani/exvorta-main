# Uptime & Health Check Runbook (Exvorta OS)

- **Document Version:** 1.0.0
- **Card:** `PLAT-13` (Task `t_6722d4c6`)
- **Risk Class:** R0 (Additive operational script and documentation)
- **Status:** Sourced & Verified Runbook
- **Date Verified:** October 28, 2026
- **Target Architecture:** Next.js 15 App Router (`/api/health`, `/`) + Vercel Edge / Production (`https://exvorta.com`)

---

## 1. Overview & Operational Architecture

This runbook establishes standard operating procedures for continuous uptime monitoring, failure detection, and alerting for the Exvorta web platform. Uptime monitoring is executed via an automated check script (`scripts/uptime-check.sh`) designed to run on a factory host cron or scheduled runner without requiring production credentials.

### 1.1 Monitored Endpoints & Contracts

| Endpoint | Target Method | Expected Status | Contract Validation | Verified Source |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | `200 OK` | JSON payload containing `{"status": "healthy"}` | `app/api/health/route.ts` [VERIFIED] |
| `/` | `GET` | `200 OK` | Public storefront home page HTML response | `app/(frontend)/page.tsx` [VERIFIED] |

### 1.2 Failure Thresholds & Retry Semantics
- **Timeout:** 10 seconds per request (configurable via `TIMEOUT_SECONDS`).
- **Retries:** 2 retries (total 3 attempts) with a 3-second delay between attempts (configurable via `MAX_RETRIES` and `RETRY_DELAY`).
- **Failure Classification:** An alert is triggered only if an endpoint fails all 3 attempts. Transient network blips within 1–2 attempts are logged as warnings and self-cleared.

---

## 2. Roles, Permissions & Secret Boundaries

Strict separation of concerns applies between automated worker profiles and the project owner:

### 2.1 Zero Secrets Policy (Repository & Worktree Hygiene)
- **PUBLIC Repository Constraint:** In compliance with ADR-000 and ADR-003, no credentials, bot tokens, or webhook secrets are committed to git or stored in the repository.
- **Alert Dispatch:** Scheduling and alert routing (Telegram bot tokens, chat IDs) are managed strictly **owner-side** in external system environments (e.g. systemd environment files or root crontabs).
- **Gate Compliance:** `scripts/agent/gate.sh` scans all changed files for secret patterns and credential tokens. The monitoring script accepts alerts via caller exit code integration or external environment variables.

---

## 3. Uptime Check Script Specification

The primary monitoring executable is `scripts/uptime-check.sh`.

### 3.1 Syntax and Invocation
```bash
# Basic run against production default (https://exvorta.com)
./scripts/uptime-check.sh

# Run against a Vercel preview deployment or custom domain
./scripts/uptime-check.sh https://preview.exvorta.com

# Silent execution mode for cron (only outputs on failure, exit code 1)
SILENT=1 ./scripts/uptime-check.sh
```

### 3.2 Environment Variables
- `TARGET_URL`: Base URL to check (default: `https://exvorta.com`).
- `TIMEOUT_SECONDS`: Request timeout in seconds (default: `10`).
- `MAX_RETRIES`: Number of retry attempts on non-200 responses (default: `2`).
- `RETRY_DELAY`: Delay in seconds between retries (default: `3`).
- `SILENT`: Suppresses informational output when set to `1` (errors and exit code remain active).

---

## 4. Owner-Side Cron Scheduling & Telegram Alert Setup

The owner configures scheduled execution and alert notifications on the host or monitoring instance.

### 4.1 Recommended Cron Integration
Schedule checks every 5 minutes using `cron`:

```bash
# Edit owner crontab
crontab -e
```

Add the following entry (using an owner-side wrapper or direct invocation):

```bash
# Check Exvorta uptime every 5 minutes; dispatch Telegram alert on failure
*/5 * * * * SILENT=1 /home/azureuser/projects/exvorta/scripts/uptime-check.sh || /home/azureuser/ops/notify-telegram.sh "🚨 Exvorta Uptime Alert: Health check failed on https://exvorta.com"
```

### 4.2 Standalone Owner Notification Wrapper (`notify-telegram.sh`)
Owner-managed helper script stored outside the public repo (e.g., in `/home/azureuser/ops/`):

```bash
#!/usr/bin/env bash
# /home/azureuser/ops/notify-telegram.sh (OWNER-SIDE ONLY, NEVER COMMITTED TO GIT)
set -euo pipefail

MESSAGE="${1:-🚨 Exvorta Alert: Uptime check failed}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

if [[ -z "$TELEGRAM_BOT_TOKEN" || -z "$TELEGRAM_CHAT_ID" ]]; then
  echo "Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in the host environment." >&2
  exit 1
fi

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=${MESSAGE}" \
  -d "parse_mode=HTML" >/dev/null
```

### 4.3 Systemd Timer Alternative (Production Host Service)
For hosts utilizing systemd instead of crontab:

1. **Service Definition (`/etc/systemd/system/exvorta-uptime.service`):**
```ini
[Unit]
Description=Exvorta Uptime & Health Check
After=network.target

[Service]
Type=oneshot
User=azureuser
WorkingDirectory=/home/azureuser/projects/exvorta
ExecStart=/bin/bash /home/azureuser/projects/exvorta/scripts/uptime-check.sh
EnvironmentFile=/etc/default/exvorta-alerts
ExecStopPost=/bin/bash -c 'if [ "$$EXIT_STATUS" != "0" ]; then /usr/local/bin/send-telegram-alert "🚨 Exvorta is DOWN"; fi'
```

2. **Timer Definition (`/etc/systemd/system/exvorta-uptime.timer`):**
```ini
[Unit]
Description=Run Exvorta Uptime Check every 5 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
Unit=exvorta-uptime.service

[Install]
WantedBy=timers.target
```

---

## 5. Verification & Incident Response Procedure

### 5.1 Drill & Smoke Verification
To verify the monitoring pipeline without causing downtime:
1. Run `./scripts/uptime-check.sh` locally:
   ```bash
   chmod +x scripts/uptime-check.sh
   ./scripts/uptime-check.sh https://exvorta.com
   ```
2. Test error detection against an invalid port or nonexistent endpoint:
   ```bash
   ./scripts/uptime-check.sh https://httpstat.us/500 || echo "Correctly detected failure (exit code $?)"
   ```
3. Test shellcheck compliance:
   ```bash
   npx --yes shellcheck scripts/uptime-check.sh
   ```

### 5.2 Incident Triage Protocol
When an alert is received:
1. **Confirm Status:** Run `./scripts/uptime-check.sh` manually from the command line.
2. **Inspect Vercel Deployments:** Check Vercel console for build errors, deployment rollbacks, or edge routing anomalies.
3. **Inspect Application Health:** Query `curl -i https://exvorta.com/api/health` to determine if process runtime or database connectivity is impaired.
4. **Escalate:** If 500 errors persist, consult `docs/runbooks/db-restore.md` or contact the lead architect.

---

## 6. Findings, Assumptions & Open Questions

### Findings Table
| Fact / Policy | Label | Primary Source | Verified Date |
| :--- | :--- | :--- | :--- |
| `/api/health` returns HTTP 200 with JSON `status: 'healthy'` | **VERIFIED** | `app/api/health/route.ts:5-13` | Oct 28, 2026 |
| Public root `/` returns HTTP 200 | **VERIFIED** | `scripts/verify-deployment.sh:42-56` | Oct 28, 2026 |
| Gate enforces zero secrets and `bash -n` on changed shell scripts | **VERIFIED** | `scripts/agent/gate.sh:81-98` | Oct 28, 2026 |
| ShellCheck v0.11.0 available via `npx --yes shellcheck` | **VERIFIED** | `npx --yes shellcheck --version` | Oct 28, 2026 |
| Host cron and Telegram alerting are managed outside the public repository | **VERIFIED** | Card PLAT-13 Brief & ADR-003 | Oct 28, 2026 |

### Open Questions & Needs Input (`needs_input`)
- None. Owner-side credentials and alerts are decoupled from the repository in compliance with zero-secret policies.

---

## 7. Reviewer Summary & Verification Log

- **Author Profile:** `exvorta-builder`
- **Verification Method:** ShellCheck static analysis (`npx --yes shellcheck scripts/uptime-check.sh`), syntax verification (`bash -n scripts/uptime-check.sh`), live execution against `https://exvorta.com`, and factory gate check (`CARD_RISK=R0 bash scripts/agent/gate.sh`).
- **Not verified:** Owner-side cron daemon installation and live Telegram message dispatch in production (VERIFIED: scripts/uptime-check.sh passes shellcheck, returns 200 OK on https://exvorta.com, CARD_RISK=R0 gate.sh passes).
