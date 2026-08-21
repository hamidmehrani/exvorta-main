# Exvorta — Disaster Recovery Plan

## Overview

| Metric | Target |
|--------|--------|
| **RTO** (Recovery Time Objective) | < 1 hour |
| **RPO** (Recovery Point Objective) | < 24 hours |
| **Uptime SLA Target** | 99.9% |

---

## Backup Strategy

### Automated Backups
- **Neon PostgreSQL**: Built-in point-in-time restore, 7-day retention (Free tier), 30-day (Pro tier)
- Access: Neon Console → Project → Restore

### Manual Backups (Pre-deployment)
Run before every production deployment:
```bash
./scripts/backup-db.sh
# Output: ./backups/exvorta_backup_YYYYMMDD_HHMMSS.sql
```

### What's Backed Up
- ✅ All Payload CMS data (pages, posts, projects, leads, users)
- ✅ Configuration globals (settings, navigation, footer)
- ✅ Form submissions and lead data
- ❌ Media files (stored in Cloudinary — separate backup strategy)
- ❌ Code (in Git — always recoverable)

### Media Backup (Cloudinary)
- Cloudinary maintains its own redundant storage
- For additional safety, use Cloudinary's built-in backup to S3 (paid feature)
- All uploaded assets are also referenced in the DB by URL

---

## Disaster Scenarios & Response

### Scenario 1: Site Down (5xx Errors)

**Symptoms:** All routes return 500, Vercel shows build errors

**Response:**
1. Check Vercel Dashboard → Deployments → last successful deploy
2. Roll back via Vercel CLI:
   ```bash
   vercel rollback
   ```
   Or via Dashboard: Deployments → ··· (last good deploy) → Promote to Production
3. If rollback resolves: investigate root cause before redeploying
4. If rollback fails: check for environment variable changes, DB connectivity

**Time to resolve:** < 15 minutes

---

### Scenario 2: Database Connection Failure

**Symptoms:** Pages render but show errors, admin panel inaccessible

**Diagnosis:**
```bash
# Check health endpoint
curl https://exvorta.com/api/health
# → {"status":"healthy"} means Next.js is up but DB may be down
```

**Response:**
1. Check Neon Console → Project → Monitoring (connection pool, query errors)
2. Verify `DATABASE_URI` is correct in Vercel Environment Variables
3. Check if Neon region has an incident: [status.neon.tech](https://status.neon.tech)
4. If Neon is down: wait for Neon SLA resolution (typically < 15 min for serverless)
5. As last resort: switch to Docker Postgres temporarily (local only)

**Time to resolve:** 15 min – 1 hour (depending on Neon incident)

---

### Scenario 3: Corrupted Database Migration

**Symptoms:** After deploying schema change, site returns errors or data is missing

**Response:**
1. Immediately roll back the code deployment:
   ```bash
   vercel rollback
   ```
2. Restore database from pre-deployment backup:
   ```bash
   # Using Neon point-in-time restore:
   # → Neon Console → Project → Restore → select timestamp before migration
   
   # Or from manual backup:
   psql "$DATABASE_URI" < backups/exvorta_backup_YYYYMMDD_HHMMSS.sql
   ```
3. Verify site is operational:
   ```bash
   ./scripts/verify-deployment.sh https://exvorta.com
   ```
4. Investigate migration failure before retrying

---

### Scenario 4: Admin Panel Inaccessible

**Symptoms:** `/admin` returns 401/403 or shows login loop

**Response:**
1. Check `PAYLOAD_SECRET` hasn't changed in Vercel (changing it invalidates all sessions)
2. Try clearing cookies and logging in fresh
3. If credentials lost: access Neon DB directly to reset the users table:
   ```sql
   -- In Neon SQL Editor:
   SELECT email, role FROM users;
   -- Use Payload CLI to create new admin (dev environment)
   ```
4. If admin panel errors (500): check Vercel function logs

---

### Scenario 5: Media Upload Failures

**Symptoms:** Image uploads fail in admin panel

**Response:**
1. Check Cloudinary API credentials in Vercel env vars
2. Check Cloudinary Console → Quota usage (free tier: 25 GB)
3. Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are set
4. Existing images remain accessible even if uploads fail

---

### Scenario 6: Vercel Build Failing

**Symptoms:** Deployment shows red X, build errors in Vercel Dashboard

**Response:**
1. Read build logs in Vercel Dashboard → Deployments → (failing deploy) → Build Logs
2. Common causes:
   - Missing environment variable → add in Vercel Dashboard
   - TypeScript errors → run `npx tsc --noEmit` locally first
   - Dependency conflict → check if `npm install --legacy-peer-deps` would resolve
3. Fix locally, test with `npm run build`, then push

---

## Recovery Verification

After any recovery action, run:

```bash
# Full smoke test
./scripts/verify-deployment.sh https://exvorta.com

# Check critical routes manually:
curl -s https://exvorta.com/api/health | jq .
```

Expected health response:
```json
{ "status": "healthy", "timestamp": "...", "uptime": 12345 }
```

---

## Monitoring Alerts Setup

### Recommended: UptimeRobot (Free)
1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://exvorta.com/api/health`
3. Interval: 5 minutes
4. Notification: email + Slack/Telegram
5. Expected keyword: `"healthy"`

### Vercel Alerting
- Enable in Vercel Dashboard → Project → Notifications
- Alert on: failed deployments, 4xx/5xx error spikes

---

## Access Recovery

### If Vercel access is lost:
- Recovery via GitHub account (SSO linked)
- Contact: Vercel support at https://vercel.com/support

### If Neon access is lost:
- Recovery via email/Google account
- Contact: Neon support at https://neon.tech/contact

### If Cloudinary access is lost:
- Recovery via email
- All existing media remains accessible via CDN URLs even if console is locked out

---

## Post-Incident Review

After any incident that caused > 30 minutes of downtime:

1. Write a brief incident report:
   - What happened
   - When it started / was detected
   - Root cause
   - Timeline of response
   - What's changed to prevent recurrence

2. Update this document if recovery procedures were insufficient

3. Check if any monitoring gap allowed the incident to go undetected
