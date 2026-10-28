# Agent Notes — RES-05: Portfolio evidence pack (owner interview → real case studies)

- **Card:** `RES-05` (Task `t_7e14b6bc`)
- **Assignee:** `exvorta-researcher`
- **Risk Level:** `R0`
- **Branch:** `card/res-05-portfolio-evidence`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_7e14b6bc`

## Completed Actions
1. Initialized worktree environment and set card risk (`CARD_RISK=R0`).
2. Inspected in-repo case study data in `components/blocks/case-study-data.ts` and component usage in `ProjectThemedLayout.tsx`.
3. Extracted and audited live production deployments on subdomains: Stonvi (`stonvi.exvorta.com`), Spicevo (`spicevo.exvorta.com/en`), and Nutave (`nutave.exvorta.com/en`).
4. Cross-referenced live claims, stats, compliance certificates, and client references against in-repo fallbacks, identifying metric drift and rich production assets (Stonvi 49+ markets / 1M SQM / Dubai Creek Harbour; Spicevo Control Union CU-TR-2847691 / CCOF / Bureau Veritas certs and named references; Nutave BRC Grade A / 72h GCC transit / NT SKU tracking).
5. Formulated Client Permissions & Legal Attribution Protocol (Tier 1 Named, Tier 2 Masked Person, Tier 3 Anonymized Company).
6. Established a 6-cluster Future Client Evidence Pack Checklist (Entity & Jurisdiction, Regulatory Certifications, Trade Volumes, Batch Proof, Testimonials, High-Fidelity Visuals).
7. Authored research document `docs/research/t_7e14b6bc-portfolio-evidence-pack.md` adhering strictly to facts discipline (VERIFIED / UNVERIFIED / ASSUMPTION labels, primary URLs, access dates).

## Verification & Next Steps
- Run repository gate verification: `CARD_RISK=R0 bash scripts/agent/gate.sh`.
- Commit changes (`docs/research/t_7e14b6bc-portfolio-evidence-pack.md` and `.agent/notes.md`) and push branch `card/res-05-portfolio-evidence` to `origin HEAD`.
- Hand off task via `kanban_request_review(summary, reviewer="exvorta-reviewer", metadata)`.
