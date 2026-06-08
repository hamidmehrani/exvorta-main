# PROJECT.md — Exvorta
# Paste this at the start of every session (with CURRENT.md).

---

## What

Exvorta is a web design agency + SaaS ecosystem exclusively for global traders
(importers, exporters, trading companies). The agency generates first revenue;
the SaaS products build recurring income on top of the same client base.

Each SaaS product targets one specific pain point in the trading workflow.
Products are sold individually or as a bundle ("Exvorta Suite").

---

## Who

**Clients:** SMB importers/exporters and trading companies in UAE/GCC, then MENA.
**Primary pain:** Running trade operations on WhatsApp, Excel, and email.
**Budget:** $50–$500/month for tools. $800–$3,000 one-time for a website.

---

## Product Suite

| Product | Status | What it does |
|---------|--------|-------------|
| Exvorta Web | Active — building | Web design service for traders. First revenue stream. |
| Exvorta Docs | Planned (after first Web client) | AI-powered trade document generation (invoices, packing lists, CoO, BoL) |
| Exvorta Track | Planned | Shipment tracking dashboard with carrier API integrations |
| Exvorta CRM | Future | Buyer/supplier CRM built for how traders actually work |
| Exvorta Intel | Future | AI market intelligence — HS codes, duties, competitor pricing |
| Exvorta Suite | Vision | Full platform bundling all products |

---

## Tech Stack

### Phase 1 — exvorta.com (Marketing Site + Agency)
```
Framework:   Next.js 15 (App Router) + TypeScript + Tailwind CSS
CMS:         Payload CMS 3.0 (content, blog, portfolio, forms — same codebase as Next.js)
Database:    Neon PostgreSQL (free 512MB — used by Payload)
Auth:        Payload built-in (admin) + NextAuth (client portal, future)
Email:       Resend (3,000/month free)
Forms:       Payload Form Builder plugin
i18n:        next-intl + Payload i18n
Media:       Cloudinary (free 25GB)
Deploy:      Vercel (free tier, GitHub CI/CD)
Analytics:   Umami (self-hosted, GDPR-friendly)
Search:      Payload built-in / Orama
UI Lib:      shadcn/ui
```

### Phase 2+ — SaaS Products (Docs, Track, CRM)
```
Note: SaaS apps require multi-tenant auth, row-level security, and real-time data.
Payload CMS is not suitable for this. Phase 2 will introduce:
Backend/DB:  Supabase (Postgres + Auth + RLS + Realtime)
AI:          Google Gemini API + Claude API (Anthropic)
PDF:         pdf-lib or WeasyPrint
Payments:    PayPal + Bank Wire (no standard gateway — Iran restriction)
```

---

## Business Context

- Solo founder (Hamid), based in Iran, targeting international clients
- Payment received via sarraf (currency exchange broker) — 10–15% fee, factored into pricing
- All client communication async (no live video calls)
- Exvorta.com itself is the portfolio — site quality = sales tool
- Revenue target: $2,000–3,000/month within 12 months

---

## Design System

File: `UI-UX-GUIDELINES.md` — read this before writing any frontend code.
Direction: "Institutional Elite" — Swiss-industrial, minimal, authoritative
Fonts: Playfair Display (headings) + Inter 300 (body) + Monospace (data)
Colors: warm-cream #FAFAF8 (light) | obsidian #0D0D0D (text) | emerald #059669 (accent)
Rule: Header/Footer are shared components — never rebuild per page.

---

## Current Priority

**Exvorta Web** — finish and launch exvorta.com, then acquire first web design client.
Docs MVP starts only after first paying Web client is closed.

---

## Constraints (Know Before You Build)

- No standard payment gateway integration needed yet
- Mobile responsive required on all pages
- No native mobile app in Phase 1
- Keep dependencies minimal — solo founder maintains this codebase
- Payload CMS is for marketing site only — do not use for SaaS app logic
