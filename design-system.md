# Exvorta Design System

Source of truth: `Exvorta designs/design_system/DESIGN.md` ("Institutional Elite") +
the HTML prototypes in `Exvorta designs/exvorta_*/code.html`.

## Brand concept

**Institutional Elite** — heritage authority × technical precision. Swiss-industrial
minimalism: warm paper foundation (Cream) against terminal-inspired dark interfaces
(Obsidian & Emerald). Architectural rigor via blueprint labels, hairlines, crosshairs.
Tactile depth via noise texture and glassmorphism.

## Colors

### Marketing surface (light)
| Token | Value | Usage |
|---|---|---|
| `cream` | `#FAFAF8` | Page background |
| `surface` | `#FFFFFF` | Cards on cream |
| `obsidian` | `#0D0D0D` | Headings, primary buttons, text |
| `hairline-light` | `rgba(0,0,0,0.05)` | Card borders, dividers |

### Product interface (dark)
| Token | Value | Usage |
|---|---|---|
| `dashboard` | `#0D0D0D` | Dashboard preview base |
| `sidebar` | `#141414` | Nested surface tier 1 |
| `card` | `#1A1A1A` | Nested surface tier 2 |
| `hairline-dark` | `rgba(255,255,255,0.1)` | Borders on dark |

### Functional accents
| Token | Value | Usage |
|---|---|---|
| `success` | `#00FF66` | Live data, cleared status (dark surfaces only) |
| `emerald` | `#059669` | Verified data on light surfaces |
| `warning` | `#FFB800` | Pending KYC, cautionary alerts |
| `info` | `#0066FF` | System notifications, pips |
| `danger` | `#DC2626` | Errors only |

Accents at 10% opacity form their `-bg` variants (`rgba(0,255,102,0.1)` etc.).

## Typography

- **Serif display**: Playfair Display 600 — hero 84px/1.1/-0.02em desktop,
  48px/1.2 mobile; section heads 60px→32px. Tight tracking, editorial.
- **Sans body/UI**: Inter — body-lg 18px/300/1.6, body-md 15px/300.
- **Blueprint label** (signature): Inter 11px / 500 / uppercase / `letter-spacing: 0.15–0.4em`.
  Navigation, eyebrows, metadata labels.
- **Technical mono**: system mono stack — terminal logs, table values, `[ SYS_ONLINE ]` badges.

Loaded via `next/font/local` (app/(frontend)/layout.tsx): Inter (variable) and
Playfair Display 600 — the single 600 file is declared for the 600–700 range so
`font-bold` headings use the same cut. Each file is downloaded once; there is no
`@font-face` in `globals.css`.

## Layout & spacing

- Container: max-w 1280px, gutter 24px → 32px @md (`.container-site`)
- Section rhythm: py-128px (lg) / py-96px (md)
- 12-col grid; mobile margins 20px; display type scales down aggressively

## Elevation

No heavy shadows. Tonal layering + glassmorphism:
- `.glass-panel`: white 80% + blur(12px) + hairline
- `.pg-glass` (on dark): white 3% + blur(10px) + white 10% border
- Glow reserved for primary CTAs and live-status pips only
- Global fractal noise overlay (`.bg-noise`, 5% opacity)

## Shapes

- Buttons/small elements: 4px radius (sharp, engineered). No pill buttons.
- Large framed viewports (dashboard): rounded-xl/lg
- Status pips/avatars: rounded-full

## Components

- **Buttons**: obsidian bg, white text, uppercase label, wide tracking, 4px radius
  (`.btn-primary`; defined in `@layer components`, so utilities such as `px-10`/`bg-white` override them). Secondary = 1px obsidian outline. Ghost = borderless hover-fill.
  Mono variant uses bracketed labels `[ REQUEST PROPOSAL ]`.
- **Badges**: uppercase hairline-bordered; success = emerald on 10% bg;
  system state = mono in brackets `[ SYS_ONLINE ]`
- **Inputs**: subtle light-grey bg or underline; focus = sharp obsidian/emerald 1px border-bottom.
  Shared classes: `.field` / `.field-label` (Contact, Login); RFQ uses the floating-label underline variant.
  Rest underline is 28–30% obsidian — never the 5% hairline, which reads as no field at all.
- **Cards**: white bg, hairline border, shadow ≤ 3%; dark metric cards #1A1A1A + mono data
- **Schematic decoration**: 0.5px grid lines + corner crosshair marks on containers

## Motion rules

- Scroll/entrance motion is CSS-first: `Reveal`, `AnimatedSection`, `StaggerContainer`
  (transition + inline IntersectionObserver), `StaggerText` and `.rise` for the hero.
  Framer Motion is for interactive pieces only (tilt, magnetic, dashboard); GSAP is no longer used.
- Hero h1 staggers word-by-word (`StaggerText`), never fade-all-at-once; the LCP paragraph is never animated
- Bento cards: 3D tilt on hover + border glow
- Marquees: infinite CSS loop, pause on hover
- Header: solid cream surface (translucent glass turned dark sections grey), hide on scroll down / show on up,
  nav centred on the page, `aria-current` on the active route
- Scroll progress bar at top of viewport
- All motion disabled under `prefers-reduced-motion`; Lenis smooth-scroll skipped too
- Durations 0.4–0.7s, ease `[0.22, 1, 0.36, 1]`

## Audit findings fixed under this system (2026-08-25)

1. Lenis provider imported but never rendered → wired into layout
2. `animate-marquee` used without defined keyframes → defined in globals.css
3. Playfair Display referenced by every heading but never loaded → loaded via next/font
4. Dead links `/about`, `/web`, `/proposal` → mapped to real routes
5. Hero reveal was fade-all-at-once → word-by-word stagger

## Text contrast (WCAG AA)

- Secondary copy on cream uses `text-muted` (62% obsidian ≈ 5.3:1). Do not use `text-obsidian/40` or
  `text-black/40` for text — they are ≈ 2.8:1.
- On dark surfaces use `text-white/60` or stronger for mono micro-labels (40% fails at 9–10px).
- Eyebrows are 10–11px mono; 7–9px is reserved for decorative mock UI only.

## Audit log — 2026-10-15 (performance + design pass)

See `PERFORMANCE.md → Rendering architecture` for the invariants this pass established.

## Blueprint system — design pass 2026-10-15 (v2)

Done at the owner's explicit request ("full freedom, perfect the design"), which overrides the
"port `code.html` 1:1" rule for the areas below. The brand language is unchanged (Institutional Elite);
what changed is how consistently it is applied. Pages built from CMS blocks inherit everything.

### New tokens (`@theme` in `app/globals.css`)

| Token | Use |
|---|---|
| `text-display` / `text-headline` / `text-title` / `text-lede` / `text-label` / `text-mega` | The only heading/body scale. Fluid (`clamp`), each carries its own leading + tracking. Never hand-roll `text-[84px]` or `tracking-tighter` on headings. |
| `rule` / `rule-strong` / `rule-dark` | Structural lines (grid, ledger dividers, crosshairs). Replaces `border-black/5`, which is invisible on cream. |
| `muted-dark` | Secondary copy on obsidian (64% white ≈ 7:1). |
| `shadow-lift` | Hover elevation for `card-elite`. |

### New primitives

- **`.frame`** (+ `.frame-dark`) — the four corner crosshair marks from "Architectural Schematics". Put it on a
  non-clipping container; marks bleed 6px outside. Recolour with `--frame-mark`.
- **`.rails`** — two hairline column rails at the container edges (hero only).
- **`.bg-blueprint-grid` / `.bg-blueprint-grid-dark` / `.bg-aura-dark`** — visible blueprint grid and the emerald aura.
  Gradients only (no blur filters — see PERFORMANCE.md invariant 7).
- **`.eyebrow`**, `.eyebrow-index`, `.eyebrow-dark` — the blueprint label. A section's marker is an emerald diamond
  (or a number in lists); never write `[ BRACKETS ]` inside a heading block, `unbracket()` CMS values instead.
- **`.card-elite`** — hairline card that lifts on hover. Use it for stand-alone cards.
- **Ledger layout** — grouped cells share 1px rules inside a `frame` (`border border-rule` on the grid,
  `border-e`/`border-b` on cells, emerald/success top-rule sweep on hover). Use it instead of floating cards.
- **`.on-dark`** — put on any obsidian section: `.btn-primary`, `.btn-ghost`, `.btn-mono`, `.eyebrow` and focus rings
  invert automatically. Do not hand-roll `bg-white text-obsidian` buttons.
- **`<SectionHeading>`** (`components/ui/SectionHeading.tsx`) — eyebrow → headline → lede, one scale everywhere.
- **`<CtaBand>`** (`components/ui/CtaBand.tsx`) — the closing statement band shared by CTA, CTA banner and the portfolio close.

### Buttons

`.btn-primary`: lit top edge, one sheen sweep and the DESIGN.md "subtle blue glow" on hover (success-green on dark).
`.btn-ghost`: fill rises from the baseline. Labels are 11px (`text-label`), 500 weight. All motion is
transform/opacity/shadow and is disabled under `prefers-reduced-motion`.

### Typography

Playfair has no italic file: never use `italic` on serif text (it synthesises a faux oblique). Playfair's default
old-style figures make "03" read as "o3"; `.font-serif` now forces lining figures.

### Section rhythm

Cream → white (`bg-surface`, tonal layer) → obsidian. A page should never have more than two consecutive cream sections.

### Home page

Hero: visible grid + rails, survey strip (Dubai coordinates), dual CTA, stat ledger, crosshair-framed OS panel that
peeks above the fold. Reach strip below. Manifesto as a ledger. Closing statement is a framed `CtaBand`.
Footer: bordered link ledger and the cropped `text-mega` wordmark.

## Design pass v3 — 2026-10-22 (consistency + responsive polish)

Same brief as v2 ("perfect the design"): the brand language is untouched; this pass removed the last off-system pages
and fixed real defects found in a desktop + mobile review of every public route.

### New tokens / primitives (`app/globals.css`)

| Token | Use |
|---|---|
| `text-micro` (9px mono, 0.14em) | Decorative product mock-ups only (dashboards, tickers, paper documents). Real UI copy never goes below `text-label`. |
| `accent`, `accent-ink`, `accent-lift` colours | Runtime-themable per-project accent (`--case-accent*` set on the page root). `accent` = fills/rules/buttons, `accent-ink` = small text on light, `accent-lift` = small text/numerals on obsidian. Fall back to emerald/success. |
| `--eyebrow-accent` / `--eyebrow-accent-dark` | Recolours the `.eyebrow-index` chip inside a themed section. |
| `shadow-deep` | Framed product viewport on obsidian. |
| `.hairline` | `<Hairline>` had no CSS (0px high → every divider using it was invisible). Now a 1px `rule` line. |

### Pages brought onto the system

- **Case studies** (`ProjectThemedLayout`): server component, index-chip eyebrows, `frame` ledgers, per-project identity
  (nutave gold, spicevo rust, stonvi slate). A known case study ignores CMS colours that still equal the Payload
  collection defaults (`#059669` / `#FAFAF8`), otherwise every project rendered emerald. The hero frame prefers the
  bundled `/portfolio-<slug>.webp` capture (`capture` in `case-study-data.ts`) over Cloudinary.
- **Ecosystem** (`EcosystemBlock`): server component; one `MockWindow` chrome for the five product mock-ups, fluid
  (no `min-w` + horizontal scroll), a single module eyebrow/badge pattern, diamond-node roadmap, `CtaBand` close.
- **Legal**: hero/strip/body on tokens, sticky in-page index on desktop, readable 2xl measure.
- **Document Engine** (home): stacks on mobile (template tabs → paper → action); desktop layout unchanged.

### Rules this pass enforced

- Cards that contain a `BrowserFrame` use `bare` so the frame never draws a second, differently-toned border.
- The URL pill in `BrowserFrame` never truncates the host: the live dot and the word "Open" drop out on narrow screens.
- Never render an empty placeholder in a "proof" surface: `PortfolioShowcaseBlock` falls back to the flagship case study.
- `FounderBlock` without a CMS portrait renders an on-brand monogram plate, never a stock placeholder image.
- Primary/ghost CTAs inside bands and cards are `w-full sm:w-auto` so labels never wrap to an orphaned `]`.

## Design pass v4 — 2026-10-26 ("Blueprint Atlas" home hero + 3D)

Done at the owner's explicit request (redesign, 3D, "most perfect design"), which overrides the "port `code.html`
1:1" rule for the home hero. Direction picked from Mobbin references (Atlas exploded-view process, basement.studio
wireframes, Spline's axis cube): **A — Blueprint Atlas**, evolving the existing blueprint language rather than replacing it.

### What changed

- **Home hero is an obsidian stage** (`components/blocks/HomeHeroStage.tsx`), used only by the default branch of
  `HeroBlock` (the `/web` and about heroes are untouched). Copy left, WebGL right, a module index + proof strip along the
  bottom. The `ExvortaOsPanel` moved into its own cream section directly below (`data-purpose="hero-product"`).
- **The 3D object is the module roadmap**: five slabs — Web (live), Docs & Track, CRM, Intel, Suite — in the same order and
  dates as `EcosystemBlock`'s `PHASES`. Data lives in `components/three/infra-stack-data.ts`; change a module there and the
  3D scene, poster and DOM index all follow.
- **Scroll choreography** (desktop, viewport ≥ 701px tall): the stage pins for ~115vh of scroll. 0–32 % explodes the stack,
  the rest sweeps a highlight through the five modules (lit slab, scan line, callout, caption, bottom index). Below `lg` or on
  short windows the stage is a normal block and the sweep follows the scene through the viewport.

### New primitives

| Piece | Use |
|---|---|
| `pin:` variant (`@custom-variant` in `globals.css`) | Applies only where a full-height sticky stage fits (≥1024×701). Mirrors `PIN_QUERY` in `HomeHeroStage`. |
| `components/three/stack-colors.ts` | Reads `--color-surface/success/emerald/card/dashboard` at runtime. **The scene never hard-codes a colour** — a token change re-skins WebGL too. |
| `InfraPoster` | SSR isometric SVG of the stack. First paint, no-WebGL, data-saver and the canvas cross-fade all use it. |

### Rules for 3D on this site

- three.js / R3F load only through `next/dynamic(..., { ssr: false })` and mount on `requestIdleCallback`, only if WebGL2
  exists, `saveData` is off and device memory ≥ 2 GB. Never import `three` from a server component or the main bundle.
- The canvas renders only while on screen (IntersectionObserver → `frameloop`), caps DPR at 1.75 (1.5 on phones), and a
  frame-time watchdog drops DPR to 1 after two slow windows.
- `prefers-reduced-motion`: one still frame (`frameloop="demand"`), all callouts visible, no scroll coupling, no pointer parallax.
- The h1 and lede stay server-rendered CSS/HTML (invariants 4 + the un-animated LCP paragraph still apply).
- Prefer unlit `MeshBasicMaterial`/`ShaderMaterial` ending in `#include <colorspace_fragment>` so token colours match the DOM.

### Process section — 3D build sequence (v4, round two)

`ProcessBlock` (server, CMS-driven `steps[]`) now renders `ProcessStage` (client): an obsidian scrollytelling section where
one website is built in front of the visitor while the steps scroll past.

- **Stages** (`components/three/site-build-data.ts` → `SiteBuildScene`): 0 Blueprint (grid paper + survey/dimension marks) →
  1 Compose (blocks fill in) → 2 Extrude (blocks rise into architecture) → 3 Deploy (site lifts, arcs launch to a ring of edge
  nodes). The scene is decoupled from the step count: step *i* of *n* sits at `i / (n − 1)` along the 0…3 stage axis
  (`stageFromProgress`), so 3 or 6 CMS steps both work.
- **Layout**: desktop = steps left, sticky full-height stage right; mobile = stage sticks to the top (40svh), steps scroll
  beneath. The stage column uses `display: contents` on phones so it sticks against the whole run of steps.
- **Step labels**: `stepNumber`, else `icon`, else `01…`. The home "dark-split" seed variant (steps with `icon`, no
  `stepNumber`) renders correctly.
- **Fallbacks**: `SiteBuildPoster` (SSR iso SVG), no-WebGL / data-saver → poster, reduced-motion → still frame at stage 2.7
  and the stage tag is hidden. The canvas chunk only starts loading when the section is within 900px of the viewport.

### Shared 3D plumbing

| Piece | Role |
|---|---|
| `StageCanvas` | The one WebGL wrapper: on-screen gating, DPR cap + frame-time watchdog (ignores gaps > 250ms), reduced motion, pointer ref, token colours. A scene is `children: (ctx) => <Scene {...ctx} />`. |
| `capability.ts` → `canRunWebGL()` | WebGL2 present, `saveData` off, ≥ 2 GB device memory. |
| `iso.ts` | Isometric projection for SSR posters. |

New 3D sections should be: a `*Scene.tsx`, a `*Canvas.tsx` that wraps it in `StageCanvas`, an SSR `*Poster.tsx`, and a section
component that `next/dynamic`s the canvas. Nothing else may import `three`.

### Closing sections — footer, portfolio, pricing (v4, round three)

References chosen from Mobbin: Sequence's contact card + Structured's oversized wordmark (footer), Customer.io / Contractbook
metric-first cards + Grammarly's snap carousel (portfolio), Linear's elevated recommended column + Amplemarket's "Custom" path
(pricing). The rule for all three: **no invented facts** — no prices, response times or claims that are not already in the repo.

- **Footer**: a three-cell "reach us" ledger above the link grid — `hello@exvorta.com` (the public address from the Contact page),
  live Dubai time (`DubaiClock`, client island, fixed-width placeholder so no hydration shift), and "Request a custom scope" → `/rfq`.
  The wordmark is `FooterWordmark` (client island): an emerald spotlight follows a mouse pointer via CSS variables
  (`.wordmark-spot` in `globals.css`); touch and reduced-motion get the static faint wordmark. Still pure decoration.
- **Portfolio (home section)**: each card leads with two proof metrics from `case-study-data` (`CardStats`), the title is a
  stretched link (whole card is the target; "Live site" sits above it with `z-10`), and phones get a swipeable snap carousel
  with the next card peeking. The frame's duplicated volume/service rows were dropped.
- **Pricing**: the CMS repeats "All packages include…" on every tier — it is now stated once above the ledger (chips) and a per-tier
  line only renders when tiers differ. Every column has price slot + CTA before the feature list, and "Recommended" marks the
  middle tier. A "not sure?" strip offers two next steps (scope request, see the work). Prices stay "Pricing upon proposal":
  there is no real number to show, so the planned glass-numeral treatment was intentionally not built.

### Roadmap block (v4, round four)

`RoadmapBlock` now renders the same five modules as the hero stack and the ecosystem page, straight from `STACK_MODULES`
(name, date, one-line caption), so a roadmap change is made in one place (`infra-stack-data.ts`) and shows up in the hero, the
callouts and this timeline. Web links to `/web`; the planned modules link to `/waitlist`. The suite vision panel uses the SSR
`InfraPoster` with a slow CSS float (`@keyframes float`, off under reduced motion) instead of decorative spinning circles.
The waitlist form is unchanged. The header was reviewed and deliberately left as is (active route, hide-on-scroll, mobile menu
already work).
