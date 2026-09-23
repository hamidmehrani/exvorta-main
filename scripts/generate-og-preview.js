const sharp = require('/home/hamid/Desktop/Exvorta/Exvorta/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const exvortaRoot = '/home/hamid/Desktop/Exvorta/Exvorta';

const destinations = [
  path.join(exvortaRoot, 'public', 'og-image.png'),
  path.join(exvortaRoot, 'public', 'og-default.png'),
  path.join(exvortaRoot, 'app', '(frontend)', 'opengraph-image.png'),
  path.join(exvortaRoot, 'app', '(frontend)', 'twitter-image.png'),
  path.join(process.env.TMPDIR || '.', 'exvorta-hero-og.png'),
];

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Cream Gradient (Authentic Exvorta Site Background) -->
    <linearGradient id="creamBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF6" />
      <stop offset="45%" stop-color="#F8F6F0" />
      <stop offset="100%" stop-color="#F1ECE4" />
    </linearGradient>

    <!-- Browser Chrome Bar Gradient -->
    <linearGradient id="browserChrome" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EAE7DF" />
      <stop offset="100%" stop-color="#E2DDD4" />
    </linearGradient>

    <!-- Emerald Aura Gradient (Exact site hero ambient glow) -->
    <radialGradient id="emeraldAura" cx="50%" cy="32%" r="48%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.16" />
      <stop offset="40%" stop-color="#059669" stop-opacity="0.07" />
      <stop offset="100%" stop-color="#F8F6F0" stop-opacity="0" />
    </radialGradient>

    <!-- Fine Architectural 72px Grid (Exact site grid) -->
    <pattern id="siteGrid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#0D0D0D" stroke-opacity="0.04" stroke-width="1" />
    </pattern>

    <!-- Terminal Window Shadows & Gradients -->
    <linearGradient id="terminalHeader" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161B26" />
      <stop offset="100%" stop-color="#0F131D" />
    </linearGradient>

    <linearGradient id="terminalBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0B0E15" />
      <stop offset="100%" stop-color="#07090E" />
    </linearGradient>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.18" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.08" />
    </filter>

    <filter id="btnShadow" x="-10%" y="-20%" width="120%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.16" />
    </filter>
  </defs>

  <style>
    .serif { font-family: 'DejaVu Serif', 'Playfair Display', Georgia, 'Times New Roman', serif; }
    .sans { font-family: 'DejaVu Sans', 'Liberation Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .mono { font-family: 'DejaVu Sans Mono', 'Liberation Mono', 'Courier New', monospace; }
  </style>

  <!-- 1. BASE SITE BACKGROUND (Cream + Emerald Aura + Grid) -->
  <rect width="1200" height="630" fill="url(#creamBg)" />
  <rect width="1200" height="630" fill="url(#siteGrid)" />
  <rect width="1200" height="630" fill="url(#emeraldAura)" />

  <!-- 2. BROWSER WINDOW CHROME BAR (Top 36px) -->
  <g id="browser-bar">
    <rect x="0" y="0" width="1200" height="36" fill="url(#browserChrome)" />
    <line x1="0" y1="36" x2="1200" y2="36" stroke="#000000" stroke-opacity="0.08" stroke-width="1" />

    <!-- Window Controls -->
    <circle cx="20" cy="18" r="5.5" fill="#FF5F56" stroke="#E0443E" stroke-width="0.5" />
    <circle cx="38" cy="18" r="5.5" fill="#FFBD2E" stroke="#DEA123" stroke-width="0.5" />
    <circle cx="56" cy="18" r="5.5" fill="#27C93F" stroke="#1AAB29" stroke-width="0.5" />

    <!-- URL Pill Bar -->
    <g transform="translate(420, 6)">
      <rect x="0" y="0" width="360" height="24" rx="6" fill="#FAF8F5" stroke="#000000" stroke-opacity="0.08" stroke-width="1" />
      <!-- Lock Icon -->
      <path d="M 125 14 V 11 Q 125 7 129 7 Q 133 7 133 11 V 14 M 123 14 H 135 V 19 H 123 Z" fill="none" stroke="#10B981" stroke-width="1.2" stroke-linecap="round" />
      <text x="142" y="16.5" class="mono" font-size="11" font-weight="bold" fill="#334155" letter-spacing="0.5">https://exvorta.com</text>
    </g>
  </g>

  <!-- 3. SITE HEADER (Authentic Navigation Header) -->
  <g id="site-header" transform="translate(0, 36)">
    <rect x="0" y="0" width="1200" height="68" fill="#FAF8F5" fill-opacity="0.94" />
    <line x1="0" y1="68" x2="1200" y2="68" stroke="#000000" stroke-opacity="0.06" stroke-width="1" />

    <!-- Brand Logo (Left) -->
    <g transform="translate(60, 16)">
      <!-- Vector Mark -->
      <g transform="scale(0.036)">
        <path fill="#141414" fill-rule="evenodd" d="M 0 0 H 225 L 500 275 L 775 0 H 1000 V 225 L 725 500 L 1000 775 V 1000 H 775 L 500 725 L 225 1000 H 0 V 775 L 275 500 L 0 225 Z M 500 330 L 670 500 L 500 670 L 330 500 Z"/>
        <circle cx="780" cy="780" r="100" fill="#FFFFFF"/>
        <circle cx="780" cy="780" r="76" fill="#00966B"/>
      </g>
      <!-- Wordmark -->
      <text x="46" y="26" class="sans" font-size="22" font-weight="bold" fill="#141414" letter-spacing="1.2">exvorta</text>
    </g>

    <!-- Nav Links (Center) -->
    <g transform="translate(415, 39)" class="sans" font-size="11" font-weight="600" fill="#141414" fill-opacity="0.6" letter-spacing="2">
      <text x="0" y="0">EXVORTA WEB</text>
      <text x="130" y="0">PORTFOLIO</text>
      <text x="245" y="0">ECOSYSTEM</text>
      <text x="360" y="0">THE FIRM</text>
    </g>

    <!-- Header Actions (Right) -->
    <g transform="translate(940, 18)">
      <text x="0" y="21" class="mono" font-size="10" font-weight="bold" fill="#141414" fill-opacity="0.65" letter-spacing="1.5">CLIENT LOGIN</text>
      <g transform="translate(100, -3)">
        <rect x="0" y="0" width="168" height="36" fill="#141414" />
        <text x="84" y="22" text-anchor="middle" class="sans" font-size="10" font-weight="bold" fill="#FFFFFF" letter-spacing="1">[ START PROJECT ]</text>
      </g>
    </g>
  </g>

  <!-- 4. HERO SECTION CONTENT -->

  <!-- Status Pill: [ ENGINE V1.0 LIVE ] -->
  <g transform="translate(600, 138)">
    <rect x="-115" y="0" width="230" height="28" rx="14" fill="#FFFFFF" fill-opacity="0.85" stroke="#000000" stroke-opacity="0.1" stroke-width="1" />
    <circle cx="-95" cy="14" r="4" fill="#10B981" />
    <circle cx="-95" cy="14" r="8" fill="none" stroke="#10B981" stroke-opacity="0.3" stroke-width="1.5" />
    <text x="-82" y="19" class="mono" font-size="11" font-weight="bold" fill="#141414" fill-opacity="0.8" letter-spacing="1.5">[ ENGINE V1.0 LIVE ]</text>
    <rect x="85" y="8" width="4" height="12" fill="#10B981" />
  </g>

  <!-- Monumental Headline (Exact Playfair / Serif as in site) -->
  <g transform="translate(600, 212)" text-anchor="middle">
    <text x="0" y="0" class="serif" font-size="58" font-weight="bold" fill="#141414" letter-spacing="-0.5">Digital Infrastructure</text>
    <text x="0" y="62" class="serif" font-size="58" font-weight="bold" fill="#141414" letter-spacing="-0.5">for Global Traders</text>
  </g>

  <!-- Strategic Subheadline -->
  <g transform="translate(600, 314)" text-anchor="middle">
    <text x="0" y="0" class="sans" font-size="15.5" fill="#141414" fill-opacity="0.65" font-weight="normal">
      Websites that make institutional buyers take you seriously — built for exporters who compete
    </text>
    <text x="0" y="24" class="sans" font-size="15.5" fill="#141414" fill-opacity="0.65" font-weight="normal">
      on trust, not price. See the proof: three live deployments, one standard.
    </text>
  </g>

  <!-- CTA Button: [ START YOUR PROJECT ] -->
  <g transform="translate(600, 368)">
    <g transform="translate(-125, 0)" filter="url(#btnShadow)">
      <rect x="0" y="0" width="250" height="46" fill="#141414" />
      <text x="125" y="28" text-anchor="middle" class="sans" font-size="12" font-weight="bold" fill="#FFFFFF" letter-spacing="2">[ START YOUR PROJECT ]</text>
    </g>
  </g>

  <!-- 3 Proof Points Row -->
  <g transform="translate(600, 442)" text-anchor="middle" class="mono" font-size="11" font-weight="bold" fill="#141414" fill-opacity="0.55" letter-spacing="2">
    <!-- Point 1 -->
    <rect x="-248" y="-7" width="6" height="6" fill="#059669" transform="rotate(45 -245 -4)" />
    <text x="-160" y="0">3 LIVE DEPLOYMENTS</text>

    <!-- Point 2 -->
    <rect x="-3" y="-7" width="6" height="6" fill="#059669" transform="rotate(45 0 -4)" />
    <text x="70" y="0">&lt;1S GLOBAL LOAD</text>

    <!-- Point 3 -->
    <rect x="182" y="-7" width="6" height="6" fill="#059669" transform="rotate(45 185 -4)" />
    <text x="245" y="0">CMS YOU OWN</text>
  </g>

  <!-- 5. REALISTIC EXVORTA OS TERMINAL PANEL (Peeking from bottom fold) -->
  <g transform="translate(130, 474)" filter="url(#cardShadow)">
    <!-- Terminal Outer Frame -->
    <rect x="0" y="0" width="940" height="240" rx="12" fill="url(#terminalBg)" stroke="#334155" stroke-opacity="0.6" stroke-width="1.2" />

    <!-- Terminal Header Bar -->
    <path d="M 0 12 Q 0 0 12 0 L 928 0 Q 940 0 940 12 L 940 38 L 0 38 Z" fill="url(#terminalHeader)" />
    <line x1="0" y1="38" x2="940" y2="38" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1" />

    <!-- Traffic Lights -->
    <circle cx="20" cy="19" r="4.5" fill="#EF4444" />
    <circle cx="35" cy="19" r="4.5" fill="#F59E0B" />
    <circle cx="50" cy="19" r="4.5" fill="#10B981" />

    <!-- Tabs inside OS -->
    <g transform="translate(80, 23)" class="mono" font-size="11" font-weight="bold">
      <!-- Active Tab: LEDGER -->
      <rect x="-10" y="-14" width="76" height="26" rx="4" fill="#1E293B" />
      <text x="0" y="2" fill="#00E599">● LEDGER</text>
      <text x="90" y="2" fill="#64748B">TERMINAL</text>
      <text x="185" y="2" fill="#64748B">COMPLIANCE</text>
      <text x="290" y="2" fill="#64748B">ANALYTICS</text>
      <text x="390" y="2" fill="#64748B">DOCS</text>
    </g>

    <!-- Terminal Status (Right) -->
    <g transform="translate(730, 23)" class="mono" font-size="10" fill="#64748B">
      <text x="0" y="0">SYS: <tspan fill="#00E599">ONLINE</tspan> // 14ms</text>
    </g>

    <!-- Table Header inside OS -->
    <g transform="translate(24, 62)" class="mono" font-size="10" font-weight="bold" fill="#64748B" letter-spacing="1">
      <text x="0" y="0">BILL OF LADING</text>
      <text x="170" y="0">CONSIGNEE</text>
      <text x="380" y="0">ROUTE</text>
      <text x="580" y="0">VALUE (USD)</text>
      <text x="750" y="0">STATUS</text>
      <line x1="0" y1="10" x2="892" y2="10" stroke="#334155" stroke-opacity="0.5" stroke-width="1" />
    </g>

    <!-- Row 1: TRK-9821-X -->
    <g transform="translate(24, 98)" class="mono" font-size="11">
      <text x="0" y="0" fill="#E2E8F0" font-weight="bold">TRK-9821-X</text>
      <text x="170" y="0" fill="#94A3B8">Atlas Mfg Corp.</text>
      <text x="380" y="0" fill="#64748B">NLRTM → AEDXB</text>
      <text x="580" y="0" fill="#F1F5F9">$1,240,500</text>
      <rect x="746" y="-12" width="70" height="18" rx="3" fill="#064E3B" stroke="#00E599" stroke-opacity="0.4" stroke-width="1" />
      <text x="758" y="1" fill="#00E599" font-size="9.5" font-weight="bold">CLEARED</text>
    </g>

    <!-- Row 2: TRK-3302-B -->
    <g transform="translate(24, 130)" class="mono" font-size="11">
      <text x="0" y="0" fill="#E2E8F0" font-weight="bold">TRK-3302-B</text>
      <text x="170" y="0" fill="#94A3B8">Zeta Logistics</text>
      <text x="380" y="0" fill="#64748B">CNSHA → DEHAM</text>
      <text x="580" y="0" fill="#F1F5F9">$89,200</text>
      <rect x="746" y="-12" width="82" height="18" rx="3" fill="#0C4A6E" stroke="#38BDF8" stroke-opacity="0.4" stroke-width="1" />
      <text x="754" y="1" fill="#38BDF8" font-size="9.5" font-weight="bold">IN TRANSIT</text>
    </g>
  </g>
</svg>
`;

async function main() {
  const buf = Buffer.from(svg);
  for (const dest of destinations) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await sharp(buf)
      .png({ quality: 98, compressionLevel: 8 })
      .toFile(dest);
    console.log('Successfully written:', dest);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
