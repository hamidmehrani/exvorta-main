---
name: Institutional Elite
colors:
  surface: '#fcf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444846'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747876'
  outline-variant: '#c4c7c5'
  surface-tint: '#5d5f5d'
  primary: '#5d5f5d'
  on-primary: '#ffffff'
  primary-container: '#fafaf8'
  on-primary-container: '#727372'
  inverse-primary: '#c6c7c5'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#006c4a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ebfff1'
  on-tertiary-container: '#00835b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e3e1'
  primary-fixed-dim: '#c6c7c5'
  on-primary-fixed: '#1a1c1b'
  on-primary-fixed-variant: '#454746'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  warm-cream: '#FAFAF8'
  obsidian: '#0D0D0D'
  emerald: '#059669'
  success-glow: '#00FF66'
  surface-white: '#FFFFFF'
  zinc-dark: '#141414'
  zinc-elevated: '#1A1A1A'
  warning-amber: '#FFB800'
  info-blue: '#0066FF'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 60px
    fontWeight: '600'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '300'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.15em
  mono-data:
    fontFamily: monospace
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.4'
  mono-terminal:
    fontFamily: monospace
    fontSize: 10px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  dashboard-max: 1440px
  section-gap-lg: 8rem
  section-gap-md: 6rem
  gutter: 1.5rem
  ui-padding-dense: 0.875rem 1.25rem
---

## Brand & Style

This design system embodies the concept of "Institutional Elite"—a visual language tailored for global infrastructure and high-end digital trade. It creates a feeling of inherited authority merged with technical precision. The aesthetic is a deliberate intersection of **Minimalism** and **Modern Corporate**, utilizing a "Swiss-Industrial" philosophy. 

Key attributes include:
- **Heritage Meets Tech:** A warm, paper-like foundation (Cream) contrasted against high-density, terminal-inspired interfaces (Obsidian & Emerald).
- **Architectural Rigor:** Layouts are structured like blueprints, using wide-tracked uppercase labels and hairline dividers to establish a sense of organization and "Military-grade" robustness.
- **Tactile Digital:** The use of subtle noise textures and glassmorphic layers adds depth, making the software feel like a physical tool rather than a standard web application.

## Colors

The palette is bifurcated to serve two distinct environments:

### The Marketing Surface (Light)
The primary canvas is **Warm Cream**, which avoids the sterile nature of pure white. **Obsidian** provides high-contrast legibility for headings and primary actions, while subtle **Black (5%)** borders create separation without visual noise.

### The Product Interface (Dark)
Inside dashboard components and technical previews, the system shifts to an **Obsidian** base. Here, **Emerald** and **Success Glow** are used as functional accents to represent live data, system uptime, and "cleared" statuses. Surfaces use slight tonal shifts (**Zinc Dark**) to indicate hierarchy and nesting.

### Functional Accents
- **Emerald/Success:** Indicates verified data, online status, and positive growth.
- **Warning Amber:** Used for pending KYC or cautionary alerts.
- **Info Blue:** Reserved for system notifications and informational pips.

## Typography

The typography strategy relies on the tension between a romantic, editorial serif and a functional, utilitarian sans-serif.

- **Editorial Expression:** Use **Playfair Display** for all primary headings. It should be typeset with tight tracking to emphasize its high-end, authoritative character.
- **Functional Interface:** Use **Inter** for all UI elements. Standard body copy should favor a light weight (300) to maintain an airy, sophisticated feel. 
- **The Blueprint Label:** A signature element of the design system is the use of **Inter** at small sizes (11px) with heavy letter spacing and uppercase styling. This is used for navigation, sub-headers, and metadata labels to evoke the feel of an industrial schematic.
- **Technical Mono:** A system monospace stack is used exclusively for live terminal logs, data values in tables, and technical identifiers.

## Layout & Spacing

The layout model follows a **Fixed Grid** philosophy with generous vertical breathing room to denote prestige.

- **Vertical Rhythm:** Marketing sections are separated by large gaps (96px to 128px) to allow content to "own" the screen.
- **Grid System:** A 12-column grid is standard. On desktop, content is centered within a 1280px container. For the dashboard viewports, the width extends to 1440px to accommodate high-density data.
- **Dense UI:** In product views, padding is reduced to an 8px-based system (e.g., 24px internal card padding) to maximize information density while maintaining legibility.
- **Responsive Reflow:** On mobile, margins reduce to 20px, and large display type scales down aggressively (e.g., 84px to 48px) to prevent awkward word breaks.

## Elevation & Depth

This design system eschews heavy traditional shadows in favor of **Tonal Layering** and **Glassmorphism**.

- **Surface Tiers:** Hierarchy is established by stacking colors. On light mode, white cards sit on the Cream background with a hairline 5% black border. In dark mode, surfaces are distinguished by moving from #0D0D0D to #141414.
- **Glassmorphism:** Premium sections (like the R&D Viewport) utilize backdrop blurs (10px - 12px) with very low-opacity white overlays (3%-8%). This creates a "heads-up display" (HUD) effect.
- **Glow Accents:** A blue or emerald glow (`shadow-glow`) is used sparingly on primary CTAs and active status indicators to simulate a backlit digital display.
- **The Noise Filter:** A global fractal noise SVG overlay is applied to the background to break the digital flatness, giving the "Institutional" base a tactile, vellum-like quality.

## Shapes

The shape language is primarily **Soft (0.25rem)** to maintain a sharp, professional edge.

- **Standard Elements:** Buttons and small cards use a minimal radius (4px) to feel precise and engineered.
- **Container Elements:** Large dashboard previews or "R&D Viewports" use a more pronounced **Rounded-LG (1rem)** or **XL (1.5rem)** to frame complex content as a self-contained window.
- **Functional Pips:** Status indicators, notification dots, and user avatars are always **Rounded-Full (Pill-shaped)**.

## Components

### Buttons
- **Primary:** Obsidian background, white text, uppercase label with wide tracking, 4px radius. Includes a subtle blue glow on hover.
- **Secondary/Outline:** Obsidian 1px border, no background, uppercase label.
- **Ghost:** No border or background, transitions to a subtle cream/grey background on hover.

### Institutional Badges
- Small, uppercase text with a hairline border. 
- **Success State:** Emerald text on a 10% opacity Emerald background. 
- **System State:** Monospace text wrapped in brackets, e.g., `[ SYS_ONLINE ]`.

### Glassmorphic Panels
- Used for high-end product previews.
- Dark background (3% white opacity) with a `12px` backdrop blur and a `10% white` hairline border.

### Input Fields
- Underlined style or subtle light-grey background with no borders. Focus state should use a sharp Obsidian or Emerald 1px bottom border.

### Cards
- **Marketing:** White background, hairline border, no shadow (or very subtle 3% opacity shadow).
- **Dashboard Metric:** Dark grey background (#1A1A1A), 8px radius, with monospace data values and emerald trend indicators.

### Architectural Schematics
- A decorative component pattern using thin `0.5px` grid lines and "target" crosshair icons at the corners of containers to reinforce the "Engineering" narrative.