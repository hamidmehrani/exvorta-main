# Emergency Response Guide

> **This document is for emergencies only.**
> Keep it up to date. Print a copy and store it offline.

---

## 🚨 Site Is Down — First Response

1. **Check Vercel Status**: https://vercel-status.com
2. **Check Neon Status**: https://neonstatus.com
3. **Check your uptime monitor** (UptimeRobot dashboard)
4. **Try rolling back**:
   ```bash
   npx vercel rollback
   ```
5. **Verify health endpoint**: `curl https://exvorta.com/api/health`
6. **Read full procedures**: [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)

---

## Dashboard Access

| Service | URL | Login Method |
|---------|-----|-------------|
| **Vercel** | https://vercel.com/dashboard | GitHub SSO |
| **Neon (Database)** | https://console.neon.tech | Google / email |
| **Cloudinary (Media)** | https://cloudinary.com/console | email |
| **Resend (Email)** | https://resend.com/dashboard | email |
| **Cloudflare (Turnstile/DNS)** | https://dash.cloudflare.com | email / 2FA |
| **CMS Admin** | https://exvorta.com/admin | CMS credentials |

---

## Credential Storage

> **Do NOT store real credentials in this file.**
> Use a password manager (1Password, Bitwarden, etc.)

All production secrets are stored in:
- [ ] Password manager: ________________
- [ ] Vercel Environment Variables (source of truth for running app)

Backup access method: ________________

---

## Key People

| Role | Name | Contact |
|------|------|---------|
| Lead Developer | ____________ | ____________ |
| Backup Developer | ____________ | ____________ |
| DevOps/Infra | ____________ | ____________ |
| Client Contact | ____________ | ____________ |

---

## Emergency Commands

```bash
# Roll back to previous Vercel deployment
npx vercel rollback

# Check site health
curl -s https://exvorta.com/api/health | python3 -m json.tool

# Quick DB backup before any risky operation
DATABASE_URI="<your-uri>" ./scripts/backup-db.sh

# Verify deployment after rollback
./scripts/verify-deployment.sh https://exvorta.com

# Force ISR cache clear for all pages
curl -X POST https://exvorta.com/api/revalidate \
  -H "x-revalidate-secret: $PAYLOAD_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"collection": "pages"}'

# Enable maintenance mode (via CMS)
# → https://exvorta.com/admin → Globals → Site Settings → Maintenance Mode ON
```

---

## Domain Registrar

| Item | Value |
|------|-------|
| Registrar | ____________ |
| Registrar login | ____________ |
| Domain expiry date | ____________ |
| DNS provider | Cloudflare |
| DNS records | A: `76.76.21.21` / CNAME: `cname.vercel-dns.com` |

**SSL**: Auto-provisioned by Vercel via Let's Encrypt — renews automatically.

---

## Escalation Path

1. **First**: Check Vercel logs + attempt rollback (< 5 min)
2. **Second**: Contact Lead Developer (< 15 min)
3. **Third**: Enable maintenance mode via CMS to prevent bad UX
4. **Fourth**: Contact Vercel support (enterprise SLA): https://vercel.com/support
5. **Fifth**: Contact Neon support (DB issues): https://neon.tech/contact

---

## After the Emergency

1. Restore full service
2. Run `./scripts/verify-deployment.sh https://exvorta.com`
3. Write an incident report (what happened, root cause, fix)
4. Update DISASTER_RECOVERY.md if procedures were insufficient
5. Check if monitoring caught the issue — if not, improve alerting
