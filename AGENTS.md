<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## REBUILD RULES
- `code.html` files are the visual spec — port 1:1, never redesign
- `screen.png` is the acceptance test
- Header and Footer are shared — never rebuild per page
- Use tokens and primitives only — no raw hex, no ad-hoc font classes anywhere
- One page per session
- After each page, run `scripts/take-screenshots.js` and compare to matching `screen.png` before finishing
- Animations via Reveal component OR custom animation components (AnimatedHeadline, SectionReveal, MagneticButton). No regex/patch scripts ever.
