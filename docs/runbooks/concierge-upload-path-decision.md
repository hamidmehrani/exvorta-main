# Decision Record: Concierge Audit Document Upload Architecture & Security Path

## Status: PROPOSED (Recommendation Documented, Awaiting Owner Sign-Off for Direct Storage)
**Risk Level**: R1 (Architecture & Operations Decision)  
**Date**: October 2026  
**Context**: Task CONV-04 / Concierge 24-Hour Forensic Audit Pipeline  

---

## 1. Executive Summary & Problem Context

The Exvorta Concierge 24-Hour Audit program invites prospective enterprise clients to submit their last 3 international trade shipments (specifically Commercial Invoices [CI], Packing Lists [PL], and Bills of Lading [BL] / Air Waybills [AWB]). These documents contain sensitive commercial information:
- Unit prices, supplier identities, and contract margin terms
- Harmonized System (HS) classifications and declared customs values
- Carrier freight rates, bunker adjustment factors (BAF), and peak season surcharges (PSS)
- Demurrage/detention free-time agreements and container dwell terms

Because the repository is **PUBLIC** and production operates under strict zero-trust principles:
1. **Zero Client Data in Git**: No client files or PII can ever enter the git tree.
2. **Zero Unencrypted Public Storage**: Documents must never be accessible via unauthenticated public URLs (e.g. public Cloudinary asset buckets or open S3 buckets).
3. **Owner Sign-off Gate**: Any persistent storage integration (AWS S3, Cloudflare R2, Cloudinary signed uploads) requires explicit owner sign-off and environment variable provisioning.

---

## 2. Ingestion Path Evaluation

We evaluated two architectural paths for collecting documents from prospect shippers:

| Evaluation Dimension | Option A: Direct Cloudinary / S3 Signed Upload | Option B: Asynchronous Dual-Track (Form + Secure Link / Email) |
| :--- | :--- | :--- |
| **User Experience (Intake)** | Single-page drag-and-drop file uploader directly on `/concierge`. | Structured intake form capturing shipment parameters + cloud share link (Dropbox/Drive/OneDrive) or email reply. |
| **Security & Privacy Posture** | Requires pre-signed upload URLs and access-token generation. Risk of unauthenticated file injection or malicious binary payloads. | Zero file binary handling on Exvorta servers. Prospects retain ACL ownership in their corporate drive or send via TLS email. |
| **Infra & Credential Dependency** | Requires active Cloudinary/S3 credentials with private access control policies, signed token endpoints, and virus scanning hooks. | Zero new infra dependencies. Uses existing `submitLeadAction` server action + Payload local CMS + transactional email pipeline. |
| **Compliance & Public Repo Safety** | High risk if bucket policies or signed tokens are misconfigured in public code. | Zero exposure. Fits the public repo architecture where no production secrets exist. |
| **Time-to-Production** | Requires multi-day backend setup, virus scanning, signed token rotation, and owner security approval. | Ready immediately; fully operational on current stack without additional secrets. |

---

## 3. Recommended Architectural Decision

### Recommended Path: Option B (Asynchronous Dual-Track Intake) with Future Option A Expansion

1. **Phase 1 (Immediate / Current Implementation): Asynchronous Ingestion**
   - The `/concierge` intake form captures structured lane metadata (lane, freight mode, volume, spend, pain points, contact info).
   - The form includes an optional **Secure Document Link** field where enterprise shippers provide a read-only link (Dropbox, Box, Google Drive, OneDrive, SharePoint) to their shipment bundle.
   - Upon form submission, the system triggers `submitLeadAction`, logging the intake in Payload CMS under `leads` (`source: 'RFQ'`, `auditType: '24h-concierge'`).
   - The immediate confirmation screen and automated acknowledgment email instruct the client:
     > *"To expedite your 24-hour video audit, reply directly to this confirmation email attaching your last 3 Commercial Invoices, Packing Lists, and B/Ls, or share via your corporate OneDrive/Google Drive link."*
   - Internal audit engineers ingest the files into an isolated, encrypted vault outside the public web app repository.

2. **Phase 2 (Post-Owner Sign-Off): Signed S3 / Cloudflare R2 Direct Uploads**
   - If direct browser uploads are mandated by the owner:
     - Use Cloudflare R2 or AWS S3 with **Pre-Signed PUT URLs** generated server-side.
     - Files expire via automatic lifecycle rules (e.g., 7-day retention TTL after dossier delivery).
     - Bucket must be strictly private with SSE-KMS encryption at rest.
     - Cloudinary is **NOT recommended for trade documents** (Cloudinary is an image/video CDN; using it for confidential PDFs with proprietary invoice data introduces unnecessary risk).

---

## 4. Implementation Guidelines & Invariants

1. **Database Storage**: The `leads` collection stores only the structured metadata and the external document link. Never store raw binary files in the database.
2. **Access Control**: Only authorized audit directors can view lead submissions in Payload admin.
3. **SLA Clock Trigger**: The 24-hour audit clock begins upon receipt of either:
   - The complete form submission with valid document link, OR
   - The document delivery to `concierge@exvorta.com`.

---

## 5. Summary & Action Items

- **Immediate Implementation**: Option B deployed on `/concierge` using `ConciergeIntakeForm` and `submitLeadAction`.
- **Owner Action (if Option A is desired)**: Provide signed S3 / Cloudflare R2 bucket credentials and approve R2 risk-level environment configuration.
