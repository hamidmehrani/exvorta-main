@AGENTS.md

## REBUILD RULES
- `code.html` files are the visual spec — port 1:1, never redesign
- `screen.png` is the acceptance test
- Header and Footer are shared — never rebuild per page
- Use tokens and primitives only — no raw hex, no ad-hoc font classes anywhere
- One page per session
- After each page, run `scripts/take-screenshots.js` and compare to matching `screen.png` before finishing
- Animations ONLY via the existing Reveal component — no regex/patch scripts modifying components ever
