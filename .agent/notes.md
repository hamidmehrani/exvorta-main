# Agent Notes — INS-11: From WhatsApp Chaos to an RFQ Cart: A Trading Company Playbook

- **Card:** `INS-11` (Task `t_d4d67787`)
- **Assignee:** `exvorta-researcher`
- **Risk Level:** `R0`
- **Branch:** `card/ins-11`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_d4d67787`

## Objectives & Scope
1. Execute research card `INS-11`: "From WhatsApp chaos to an RFQ cart: a trading company playbook".
2. Follow `exvorta-researcher` facts discipline:
   - Claims classified as `VERIFIED` (primary/official source + link + access date), `UNVERIFIED` (plausible, needs named confirmer), or `ASSUMPTION`.
   - Regulatory frameworks cited directly (UAE Federal Decree-Law No. 46 of 2021 on Electronic Transactions and Trust Services, ICC Incoterms 2020 Publication 723E, UN/CEFACT Buy-Ship-Pay RDM v1.0, Saudi ZATCA/FASAH, Egypt Law 15/2004).
3. Produce comprehensive research document under `docs/research/INS-11-whatsapp-to-rfq-cart.md`:
   - Question
   - Method (searched & excluded)
   - Findings table (`fact | label | source | date`)
   - Comprehensive Operational Playbook & Trading Systems Analysis
   - Implications for Exvorta product tools (`/rfq`, `/rfq/embed`, `/for-agencies`, `/tools/incoterm-cbm`)
   - Open Questions for the Project Owner
4. Verify gate passes (`CARD_RISK=R0 bash scripts/agent/gate.sh`), push branch (`git push -u origin HEAD`), and hand off via `kanban_request_review`.

## Verification Checklist
- [x] Orient worktree and confirm environment (`scripts/agent/worktree-setup.sh`).
- [x] Verify existing test harness & lint baseline (`pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit`).
- [x] Conduct primary regulatory and standards research (UN/CEFACT, ICC Incoterms 2020, UAE Decree-Law 46/2021).
- [ ] Author `docs/research/INS-11-whatsapp-to-rfq-cart.md` adhering to researcher protocol.
- [ ] Run factory gate (`CARD_RISK=R0 bash scripts/agent/gate.sh` -> GATE OK).
- [ ] Commit artifact and push branch (`git push -u origin HEAD`).
- [ ] Submit review handoff via `kanban_request_review` ending with `Not verified:` line.
