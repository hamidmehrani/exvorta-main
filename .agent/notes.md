# Agent Notes — CONV-03: Resend transactional flows: confirmations that set expectations

- **Card:** `CONV-03` (Task `t_f075a6ea`)
- **Assignee:** `exvorta-builder`
- **Risk Level:** `R0`
- **Branch:** `card/conv-03-resend`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_f075a6ea`

## Objectives & Scope
1. Implement and standardize all transactional email automation hooks via Resend across Exvorta:
   - Leads / General contact: `payload/collections/Leads/hooks/sendLeadEmails.ts`
   - FormSubmissions / RFQ proposals: `payload/collections/FormSubmissions/hooks/sendRFQEmails.ts`
   - Waitlist / Early access: `payload/collections/Waitlist/hooks/sendWaitlistEmails.ts` (registered in `payload/collections/Waitlist.ts`)
2. Dual-Format Delivery Contract:
   - Provide high-fidelity, responsive HTML templates matching Institutional Elite design guidelines (#FAFAF8, #0D0D0D, #E5E5E0, serif and monospace typography, DIFC Dubai UAE address).
   - Provide structured, professional plain-text fallback for every email stream.
3. Realistic Institutional Copy:
   - Replace arbitrary or fake delivery SLA guarantees with authentic institutional copy setting measured expectations.
4. Header & Routing Discipline:
   - Client acknowledgments: `to: doc.email`, `replyTo: ownerEmail` (`OWNER_EMAIL || ADMIN_EMAIL || operations@<domain>`).
   - Admin internal alerts: `to: adminEmail`, `replyTo: doc.email` (so operations can reply directly to the customer).
5. Resilient Error Handling & Graceful Degradation:
   - If `ADMIN_EMAIL` is missing or placeholder, skip internal alert gracefully via `reportWarning` without throwing or aborting client confirmation.
   - Isolated try/catch blocks for client and admin email dispatches.
   - Any API or transport errors logged cleanly to `lib/error-reporting` via `reportError`.
6. Unit Testing & Verification:
   - `__tests__/send-lead-emails.test.ts` (13 tests)
   - `__tests__/send-rfq-emails.test.ts` (13 tests)
   - `__tests__/send-waitlist-emails.test.ts` (14 tests)
   - Full Vitest suite: 18 test files, 238 passed.
   - Documentation updated in `docs/CONTRACTS.md`.
