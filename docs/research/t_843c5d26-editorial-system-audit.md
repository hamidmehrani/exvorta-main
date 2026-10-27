# Research: Editorial System Audit — Insights Templates, Metadata, and Publication Path

- **Card ID:** `t_843c5d26` (INS-01)
- **Date:** October 28, 2026
- **Author:** `exvorta-researcher`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_843c5d26`
- **Branch:** `card/ins-01-editorial`
- **Risk Class:** `R0` (Research / Analytical Documentation / Zero Product Code)
- **Status:** COMPLETE / READY FOR VERIFICATION

---

## 1. Core Question & Executive Summary

### Core Question
What is the exact technical and architectural state of Exvorta's editorial pipeline (spanning Payload CMS collections, Next.js frontend routes, OpenGraph/SEO metadata generators, and Figma design templates), and what is the optimal, repeatable in-repo article publishing specification that satisfies institutional content standards without destabilizing production deployments?

### Executive Summary
The audit reveals that Exvorta's editorial system currently exists in an asymmetric, partially drafted state:
1. **Payload CMS Schema:** Fully defined collections exist for `Posts`, `Categories`, `Tags`, `Media`, and `Users`. The `Posts` collection supports drafting, slugs, author relationships, categories, tags, and Lexical rich-text content, backed by Neon Postgres and Cloudinary media storage.
2. **Frontend Index Route (`/insights`):** Production-ready Server Component (`app/(frontend)/insights/page.tsx`) querying the Payload `posts` collection with graceful degradation to baseline archive mode when the CMS is empty or unseeded. It renders `InsightsArchive` with category filtering and newsletter capture (`WeeklyBriefingForm`).
3. **Frontend Dynamic Route (`/insights/[slug]`):** Currently stubbed with a hard redirect to `/` and `robots: { index: false, follow: false }`. No rich-text rendering component currently exists in `components/` to render Lexical rich-text content for individual articles.
4. **Design Alignment:** Two visual specifications exist in Figma exports (`Exvorta designs/exvorta_insights/code.html` and `exvorta_blog/code.html`), providing clear visual specs for the insights index and long-form editorial articles (sticky table of contents, author profile card, executive summary callouts, and institutional monochrome styling).
5. **Publication Path Dilemma:** The project requires an explicit owner decision regarding publication workflow:
   - **Path A (Payload Admin Direct Entry):** Traditional headless CMS authoring via `/admin` GUI.
   - **Path B (In-Repo Git Markdown/MDX):** Version-controlled articles committed in-repo under `content/insights/`.
   - **Path C (Hybrid Pipeline):** In-repo markdown packages as source of truth, synchronized to Payload CMS via an automated CLI script (`scripts/sync-insights.ts`).
6. **RSS Syndication:** Currently absent (zero RSS/Atom routes exist). Adding an RSS 2.0 route handler at `app/feed.xml/route.ts` is technically trivial and requires no heavy external dependencies.

---

## 2. Research Methodology

### What Was Audited
1. **Payload CMS Architecture:**
   - Collection configurations: `payload/collections/Posts.ts`, `Categories.ts`, `Tags.ts`, `Media.ts`, `Users.ts`, and `Pages.ts`.
   - Database and plugin integration: `payload.config.ts` (Vercel Postgres adapter, Cloudinary storage plugin, Lexical editor configuration).
   - TypeScript typings: `payload-types.ts` (`Post`, `Category`, `Tag`, `Media`, `User`).
2. **Next.js Frontend Architecture:**
   - Route implementations: `app/(frontend)/insights/page.tsx` and `app/(frontend)/insights/[slug]/page.tsx`.
   - Layout & Shared Primitives: `app/(frontend)/layout.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`.
   - Blocks & Forms: `components/blocks/InsightsArchive.tsx`, `components/blocks/WeeklyBriefingForm.tsx`.
   - SEO & Metadata Generation: `utils/generateMeta.ts`, `app/sitemap.ts`, `app/robots.ts`.
3. **Design Specifications & Visual Law:**
   - Figma HTML markup: `Exvorta designs/exvorta_insights/code.html`, `Exvorta designs/exvorta_blog/code.html`.
   - Visual tokens & color palette: `design-system.md`.
4. **Repository Contracts & Rules:**
   - `docs/CONTRACTS.md` (route inventory, calculation engine purity, shared primitives).
   - Quality gate script: `scripts/agent/gate.sh`.
   - Agent notes and upstream parent results (`t_fad6cf4e` GROUND-0).

### What Was Excluded
- Product code implementation (strictly prohibited under `exvorta-researcher` protocol; implementation belongs to `exvorta-builder`).
- Database migrations or schema mutation on live databases (`push: false` in `payload.config.ts`).
- Executive owner decisions (options and trade-offs are presented objectively with open questions).

---

## 3. Findings Table (Facts Discipline)

| Fact / Architecture Finding | Classification | Primary Source & Location | Verification Date |
| :--- | :--- | :--- | :--- |
| `Posts` collection in Payload CMS defines 10 core fields: `title`, `slug`, `author` (User relation), `publishedDate`, `category` (Category relation), `tags` (Tags relation, hasMany), `content` (Lexical richText), `excerpt` (textarea), `featuredImage` (Media relation), and `status` ('draft' \| 'published'). | **VERIFIED** | `payload/collections/Posts.ts:1-74` | 2026-10-28 |
| `Media` collection uses Cloudinary CDN exclusively (`disableLocalStorage: true`) with auto-generated alt text from filename in `beforeValidate`. | **VERIFIED** | `payload/collections/Media.ts:11-35` | 2026-10-28 |
| Dynamic insight route `/insights/[slug]` is currently inactive, performing an unconditional `redirect('/')` with `robots: { index: false, follow: false }`. | **VERIFIED** | `app/(frontend)/insights/[slug]/page.tsx:1-12` | 2026-10-28 |
| `/insights` index route gracefully degrades when Payload CMS is empty or unseeded, rendering `InsightsArchive` in baseline mode with static mock cards. | **VERIFIED** | `app/(frontend)/insights/page.tsx:25-27` & `components/blocks/InsightsArchive.tsx:30-80` | 2026-10-28 |
| Weekly newsletter form (`WeeklyBriefingForm`) submits to the `submitWaitlist` server action with `{ source: 'Waitlist', collection: 'waitlist' }`. | **VERIFIED** | `components/blocks/WeeklyBriefingForm.tsx:22` | 2026-10-28 |
| Neither RSS XML nor Atom syndication feed exists in the codebase (`app/feed.xml`, `app/rss.xml`, or `package.json` feed packages). | **VERIFIED** | Ripgrep codebase search across `app/` and `package.json` | 2026-10-28 |
| No Lexical-to-HTML or custom Lexical React renderer currently exists in `components/` to render `Post.content` rich text on the frontend. | **VERIFIED** | File search in `components/` for `RichText` / Lexical renderers | 2026-10-28 |
| Sitemap at `app/sitemap.ts` includes `/insights` as a static entry (`priority: 0.8`), but does not dynamically query or list post slugs. | **VERIFIED** | `app/sitemap.ts:1-60` | 2026-10-28 |
| Figma blog template `Exvorta designs/exvorta_blog/code.html` specifies a two-column desktop layout (sticky TOC on left, article body on right, author card, and key metrics callout). | **VERIFIED** | `Exvorta designs/exvorta_blog/code.html:1-320` | 2026-10-28 |
| Exvorta content team and board agents produce markdown briefs and articles in-repo before publication to the live site. | **ASSUMPTION** | Card `t_843c5d26` description & workflow assumptions | 2026-10-28 |
| Neon Postgres connection pool limits migration connections to 1 (`max: 1`) to prevent advisory lock deadlocks. | **VERIFIED** | `payload.config.ts:127-132` | 2026-10-28 |

---

## 4. Technical Analysis & Layer-by-Layer Audit

### 4.1 Payload CMS Layer (`payload/collections/`)
- **`Posts.ts`:** Well-structured schema. The default status is `'draft'`. Read access is public for published posts (`readOnlyPublic`), ensuring drafts do not leak. However, `Posts.ts` lacks estimated reading time, canonical URL override, and structured trade metadata fields (e.g., target Incoterm, HS chapters, jurisdiction).
- **Taxonomies (`Categories.ts`, `Tags.ts`):** Categories and Tags exist as distinct relational collections. In `InsightsArchive.tsx`, filter buttons hardcode categories (`MARKET INTEL`, `COMPLIANCE`, `DOCUMENTS`, `ARCHITECTURE`), which should align with seeded slugs in `Categories.ts`.
- **Assets (`Media.ts`):** Media uploads are configured for Cloudinary. Any article package format must account for hero image URLs or local image assets uploaded through this pipeline.

### 4.2 Frontend Presentation Layer (`app/(frontend)/insights/`)
- **Index Route (`/insights`):** Server Component with `force-dynamic`. Correctly uses `getPayloadClient()` to fetch up to 50 posts sorted by `-publishedDate`. Handles database connection errors cleanly by catching and rendering fallback content.
- **Detail Route (`/insights/[slug]`):** Critical missing link. The route redirects to `/`. To activate single article reading, a builder must implement:
  1. `payload.find({ collection: 'posts', where: { slug: { equals: slug } } })`.
  2. Dynamic OpenGraph metadata generation via `utils/generateMeta.ts`.
  3. Lexical rich-text rendering or markdown rendering matching `Exvorta designs/exvorta_blog/code.html`.

### 4.3 SEO & Metadata Generation Layer (`utils/generateMeta.ts`)
- `generateMeta.ts` supports mapping `title`, `description`, `image`, and `url`.
- For single posts, OpenGraph `type` should be set to `article`, with `publishedTime`, `authors`, and `tags` mapped to standard meta tags.
- Dynamic XML sitemap generation in `app/sitemap.ts` must be extended to fetch published post slugs to ensure search engines index all trade intelligence articles.

### 4.4 Feed & Syndication Layer (RSS)
- RSS 2.0 can be implemented cleanly as a Next.js Route Handler at `app/feed.xml/route.ts` using native TypeScript string templates or a lightweight RSS generator, fetching the latest 20 published posts from Payload.

---

## 5. Proposed In-Repo Article Package Format Specification

To allow factory agents and human contributors to write articles directly in the repository with consistent metadata, we define the standard **Exvorta Article Package Format**.

### File Location Convention
- Directory: `content/insights/<slug>.md` (or `content/insights/<slug>/index.md`)

### Frontmatter Schema (YAML)
```yaml
---
title: "Institutional Guide to GCC Customs Tariffs & HS Classification"
slug: "gcc-customs-tariffs-hs-classification"
publishedDate: "2026-10-28T00:00:00.000Z"
author: "Exvorta Research Desk"
category: "Compliance"
tags:
  - "Customs"
  - "GCC"
  - "Tariffs"
  - "HS Codes"
excerpt: "A comprehensive breakdown of 12-digit HS code standardization across Saudi Arabia (ZATCA) and the UAE (Federal Customs Authority)."
featuredImage: "/images/insights/gcc-customs-guide.jpg"
featuredImageAlt: "GCC customs clearance document and container freight terminal"
status: "published"
readingTime: "6 min read"
seo:
  title: "GCC Customs Tariffs & HS Classification Guide | Exvorta"
  description: "Institutional analysis of customs duty rates, unified tariff codes, and import compliance in the GCC region."
---
```

### Mandatory Body Sections
1. **Executive Summary / Key Takeaways:** Monospace callout box summarizing core implications for commodity exporters.
2. **Context & Regulatory Framework:** Sourced analysis citing primary trade authorities.
3. **Operational Impact Table:** Markdown table comparing procedures across key corridors.
4. **Internal Tool Integration CTA:** Direct link to an Exvorta calculation engine (e.g. Incoterm Matrix or CBM Calculator).
5. **Proposal Action Banner:** Standard institutional RFQ banner directing readers to `/rfq`.

---

## 6. Publication Path Evaluation & Decision Options (needs_input)

| Attribute | Option A: Payload Admin Direct Entry | Option B: In-Repo Git-Backed Markdown/MDX | Option C: Hybrid Pipeline (Git Source → Payload Sync) |
| :--- | :--- | :--- | :--- |
| **Source of Truth** | Neon Postgres Database | Git Repository (`content/insights/`) | Git Repository (`content/insights/`) |
| **Authoring Workflow** | Login to `/admin`, use Lexical editor, upload images via UI. | Commit `.md` file to branch, submit PR, review via git. | Commit `.md` file to branch, run sync script to populate Payload. |
| **Agent Usability** | Low — requires headless browser or complex database seeds. | Very High — agents operate natively via filesystem and git. | High — agents write markdown; CI or script syncs to CMS. |
| **CMS Alignment** | 100% native Payload CMS. | Bypasses Payload `posts` collection entirely. | Fully populates Payload while preserving Git audit trail. |
| **Frontend Impact** | Requires Lexical rich-text renderer on `/insights/[slug]`. | Requires Markdown parser/renderer (e.g. `next-mdx-remote` or unified). | Requires Lexical or HTML parser on `/insights/[slug]`. |
| **Risk Profile** | R0 (uses existing admin). | R1 (touches routing and adds parsing dependencies). | R0/R1 (adds non-invasive sync script). |

### Trade-off Recommendation
- **Option C (Hybrid Pipeline)** is the most resilient institutional choice: it allows automated board agents (`exvorta-builder`, `exvorta-researcher`) to draft version-controlled markdown packages in git, while feeding Payload CMS so non-technical stakeholders and client admins can review and edit via the Payload Admin interface.

---

## 7. Sample Article Scaffold

```markdown
---
title: "Institutional Guide to GCC Customs Tariffs & HS Classification"
slug: "gcc-customs-tariffs-hs-classification"
publishedDate: "2026-10-28T00:00:00.000Z"
author: "Exvorta Research Desk"
category: "Compliance"
tags:
  - "Customs"
  - "GCC"
  - "Tariffs"
  - "HS Codes"
excerpt: "A comprehensive breakdown of 12-digit HS code standardization across Saudi Arabia (ZATCA) and the UAE (Federal Customs Authority)."
featuredImage: "/images/insights/gcc-customs.jpg"
featuredImageAlt: "Container freight inspection and customs documentation"
status: "published"
readingTime: "5 min read"
---

> **EXECUTIVE SUMMARY**  
> GCC customs authorities have accelerated the transition from 8-digit to 10- and 12-digit Harmonized System (HS) classifications. Exporters operating between Jebel Ali (UAE) and King Abdulaziz Port (Dammam) must align product declarations with national Integrated Customs Tariff schedules to eliminate demurrage and border inspection holds.

## 1. Regulatory Context & Corridor Harmonization
Under the Unified GCC Customs Tariff, member states apply a standard 5% common external tariff on most non-exempt manufactured imports. However, national tax authorities (ZATCA in KSA and FTA in the UAE) enforce divergent excise duties and VAT rates (15% in Saudi Arabia vs 5% in UAE).

### Key Regional Tariff Parameters
| Jurisdiction | Customs Authority | Standard Tariff | Import VAT | National Code Digits |
| :--- | :--- | :--- | :--- | :--- |
| **Saudi Arabia** | ZATCA (FASAH platform) | 5.0% baseline (up to 20% on protected goods) | 15.0% | 12 digits |
| **United Arab Emirates** | Federal Customs Authority (Dubai Trade) | 5.0% standard | 5.0% | 8 digits |
| **Oman** | Royal Oman Police Customs (Bayan) | 5.0% standard | 5.0% | 8 digits |

## 2. Documentation Architecture for Border Clearance
To achieve green-lane customs clearance across GCC land borders and maritime ports, documentation packets must incorporate:
1. **Standard Commercial Invoice:** Bilingual (Arabic/English) with itemized HS codes.
2. **Certificate of Origin (COO):** Attested by national chambers of commerce.
3. **Electronic Declaration Form:** Pre-filed via FASAH (KSA) or Dubai Trade (UAE) prior to vessel arrival.

## 3. Recommended Operational Workflow
Exporters should integrate automated duty calculations and container load optimization prior to dispatching cargo.

- Estimate container utilization using the **[Exvorta CBM Calculator](/tools/cbm)**.
- Review applicable risk transfer terms with the **[Exvorta Incoterm Matrix](/tools/incoterms)**.

---

> ### Request an Export Advisory Consultation
> Exvorta structures end-to-end trade corridors and compliant digital clearance infrastructure for enterprise commodity exporters.  
> **[ [ REQUEST PROPOSAL ] ](/rfq)**
```

---

## 8. Implications for Future Tasks & Contracts

1. **`docs/CONTRACTS.md`:** Must be amended to include an "Editorial" section establishing the article package schema, required metadata keys, and the chosen publication path.
2. **`INS-02` (Frontend Detail Route Implementation):** Must implement `app/(frontend)/insights/[slug]/page.tsx` with dynamic metadata generation, schema.org `Article` JSON-LD, and layout styling matching `Exvorta designs/exvorta_blog/code.html`.
3. **`INS-03` (Syndication & RSS):** Must implement `app/feed.xml/route.ts` providing standard RSS 2.0 syndication for published insight articles.

---

## 9. Open Questions for the Project Owner (Decision Gate)

1. **Publication Workflow Decision:** Does the project owner approve **Option C (Hybrid Pipeline: Git Markdown Source → Automated Payload Sync)**, or is **Option A (Payload Admin UI Direct)** or **Option B (Pure Git Markdown)** preferred?
2. **Author Model:** Should authors continue to reference the `users` collection in Payload, or should an independent `Authors` collection (or simple frontmatter string) be established for research desk bylines?
3. **RSS Syndication Priority:** Should the RSS feed (`app/feed.xml`) be scheduled as an immediate R0 follow-up card (`INS-03`)?

---
*Not verified: live database sync of sample article (VERIFIED: schema audit of Posts/Categories/Tags/Media, route audit of /insights and /insights/[slug], Figma design spec alignment, and gate validation rules).* 
