# Agent Notes — INS-02: Keyword map EN/AR → 12-month topic backlog

- **Card:** `INS-02` (Task `t_c7c87907`)
- **Assignee:** `exvorta-researcher`
- **Risk Level:** `R0`
- **Branch:** `card/ins-02-keywords`
- **Workspace:** `/home/azureuser/projects/exvorta/.worktrees/t_c7c87907`

## Objectives & Scope
1. Ground Exvorta's 12-month editorial roadmap in the verified bilingual keyword research from `RES-02` (`docs/research/keywords.md`).
2. Cluster keywords into 3 strategic intent tiers: Tool & Calculation Queries, Regulatory How-Tos & Compliance, and Cost, Commercial & Infrastructure Strategy.
3. Output `docs/research/content-backlog.md` with ≥20 mapped topics (delivered 24 topics spanning Month 01 to Month 12), including target queries (EN + AR), content formats, CTAs, destination routes, and priority classifications.
4. Document Next.js dynamic metadata and Schema.org JSON-LD specifications for the upcoming `INS-02` frontend detail route implementation.
5. Cite official regulatory bodies with verified access dates and honest fact discipline (`VERIFIED`, `UNVERIFIED`, `ASSUMPTION`).

## Verification Checklist
- [x] Orient worktree and confirm baseline dependencies (`bash scripts/agent/worktree-setup.sh`).
- [x] Audit parent keyword dataset `docs/research/keywords.md` and editorial audit `docs/research/t_843c5d26-editorial-system-audit.md`.
- [x] Author comprehensive 24-topic 12-month editorial roadmap in `docs/research/content-backlog.md`.
- [x] Update `.agent/notes.md` to reflect task state and objectives.
- [ ] Execute repository gate verification (`CARD_RISK=R0 bash scripts/agent/gate.sh`).
- [ ] Commit research documents to branch `card/ins-02-keywords`.
- [ ] Push branch to origin (`git push -u origin HEAD`).
- [ ] Submit handoff via `kanban_request_review` to `exvorta-reviewer`.
