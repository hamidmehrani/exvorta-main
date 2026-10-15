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
