# Goal Description

Restore the site's design from the "Boilerplate" theme to the premium "Institutional Elite" Exvorta design. The task requires a deep audit to find remnants of the Boilerplate, rebuilding or restoring the layout shell (Header, Footer, layout chrome), aligning design tokens (`globals.css`, `tailwind.config.ts`), resolving missing BlockRenderer mappings, and doing a 1:1 match against the reference HTML in the `Exvorta designs/` folder.

## User Review Required

Since the prompt mandates matching the reference 1:1, I will need to port components directly from the provided `Exvorta designs/` HTML into the React codebase. 
**Important Note on Git History:** Preliminary git history checks show that `components/layout/HeaderClient.tsx` and `Footer.tsx` were initialized as "Boilerplate" in the *very first commit*. The "Institutional Elite" versions of these files do not appear to exist in the `components/layout/` git history. Therefore, I will port them 1:1 from `Exvorta designs/exvorta_home page/code.html`. If you know of a specific commit hash or alternate file path where they previously existed as React components, please let me know. Otherwise, I will proceed with rebuilding them faithfully from the reference HTML.

## Proposed Changes

### Audit and Restructure

- Search and remove all instances of the "Boilerplate" theme (colors like lavender/navy, "Get Started" buttons, etc.).
- Update `app/globals.css` and `tailwind.config.ts` to include the Exvorta design tokens (cream #FAFAF8, obsidian #0D0D0D, emerald #059669) and typography (Playfair Display, Inter, monospace).

### Layout & Chrome (components/layout/)

#### [MODIFY] [Header.tsx](file:///home/hamid/Desktop/Exvorta/Exvorta/components/layout/Header.tsx)
#### [MODIFY] [HeaderClient.tsx](file:///home/hamid/Desktop/Exvorta/Exvorta/components/layout/HeaderClient.tsx)
- Port the EXVORTA header from the reference `code.html`.
- Replace the yellow "B" logo with the EXVORTA wordmark.
- Use monospace uppercase nav links with animated underlines.
- Include the black obsidian "REQUEST PROPOSAL" CTA.

#### [MODIFY] [Footer.tsx](file:///home/hamid/Desktop/Exvorta/Exvorta/components/layout/Footer.tsx)
- Port the EXVORTA footer from the reference `code.html`.
- Apply obsidian dark background, cream text.
- Add link columns, monospace micro-labels, and hairline dividers.

#### [MODIFY] [layout.tsx (frontend)](file:///home/hamid/Desktop/Exvorta/Exvorta/app/(frontend)/layout.tsx)
- Apply the correct global theme wrappers and fonts to match the Exvorta aesthetic.

### Block Renderer & Blocks (components/blocks/)

#### [MODIFY] [BlockRenderer.tsx](file:///home/hamid/Desktop/Exvorta/Exvorta/components/blocks/BlockRenderer.tsx)
- Ensure all required block mappings are registered: `portfolioArchive`, `productShowcase`, `roadmap`, etc.

#### [NEW/MODIFY] PortfolioArchiveBlock.tsx
- Create/restore this component to resolve the missing renderer warning and match the Exvorta design.

#### [NEW/MODIFY] ProductShowcaseBlock.tsx
- Create/restore this component to resolve the missing renderer warning and match the Exvorta design.

#### [NEW/MODIFY] RoadmapBlock.tsx
- Create/restore this component to resolve the missing renderer warning and match the Exvorta design.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify an exit code of 0.
- Run `npx tsc --noEmit` to ensure zero type errors.

### Manual Verification
- Execute bash commands to curl `http://localhost:3000` and `grep` for "Boilerplate" (must be 0 matches) and "EXVORTA" (must be present).
- Visually verify the site using the dev server, matching the homepage section by section against `Exvorta designs/exvorta_home page/home-page.png`.
- Confirm the 3 missing component renderer warnings are gone.
