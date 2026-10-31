/**
 * Client-side HTML5 Canvas PNG export helper for Exvorta calculation dossiers (TOOL-10).
 *
 * Renders an institutional Swiss-Industrial summary card (1200x630, 2x retina scaled)
 * with obsidian background, subtle grid lines, corner brackets, metrics grid,
 * status banner, and mandatory attribution watermark.
 *
 * ZERO external dependencies: pure Canvas2D API, SSR-safe.
 */

// ============================================================================
// 1. Interfaces & Types
// ============================================================================

export interface CanvasCardMetric {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

export interface CanvasCardStatusBanner {
  title: string;
  text: string;
  variant?: 'emerald' | 'warning' | 'default';
}

export interface CanvasCardExportOptions {
  filename?: string; // Default: 'exvorta-calculation-dossier.png'
  badge?: string;    // Default: 'EXVORTA // CALCULATION DOSSIER'
  title: string;     // Main headline
  subtitle?: string; // Sub-headline
  referenceId?: string;
  date?: string;
  metrics: CanvasCardMetric[];
  statusBanner?: CanvasCardStatusBanner;
  notes?: string[];
  lang?: 'en' | 'ar';
}

// ============================================================================
// 2. Constants & Helpers
// ============================================================================

const DEFAULT_FILENAME = 'exvorta-calculation-dossier.png';
const DEFAULT_BADGE = 'EXVORTA // CALCULATION DOSSIER';

const FONT_SANS = '"Inter", "Vazirmatn", system-ui, -apple-system, sans-serif';
const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

/**
 * Sanitizes a proposed export filename, ensuring safety and a `.png` extension.
 */
export function sanitizeFilename(filename?: string, defaultName: string = DEFAULT_FILENAME): string {
  if (!filename || !filename.trim()) {
    return defaultName;
  }
  let cleaned = filename.trim().replace(/[\\/:*?"<>|\x00-\x1F]/g, '_');
  if (cleaned === '' || cleaned === '.png' || cleaned === '.PNG') {
    return defaultName;
  }
  if (!cleaned.toLowerCase().endsWith('.png')) {
    cleaned = `${cleaned}.png`;
  }
  return cleaned;
}

// ============================================================================
// 3. Canvas Rendering Engine
// ============================================================================

/**
 * Renders the calculation dossier onto an HTML5 Canvas element.
 * Canvas is sized to 2400x1260 with 2x scale for sharp retina output.
 */
export function renderCardToCanvas(canvas: HTMLCanvasElement, options: CanvasCardExportOptions): boolean {
  const scale = 2;
  const width = 1200;
  const height = 630;

  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  if (typeof ctx.save === 'function') ctx.save();
  if (typeof ctx.scale === 'function') ctx.scale(scale, scale);

  // Configure text direction if supported
  if (options.lang === 'ar' && 'direction' in ctx) {
    try {
      (ctx as unknown as { direction: string }).direction = 'rtl';
    } catch {
      // Ignore if direction cannot be set in current environment
    }
  }

  // 1. Dark obsidian background
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle grid lines (every 40px)
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 40; x < width; x += 40) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 40; y < height; y += 40) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // 3. 4 Corner brackets / crosshairs '+' inset 20px from borders
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const crosshairs = [
    { x: 20, y: 20 },
    { x: width - 20, y: 20 },
    { x: 20, y: height - 20 },
    { x: width - 20, y: height - 20 },
  ];
  const arm = 6;
  for (const pt of crosshairs) {
    ctx.moveTo(pt.x - arm, pt.y);
    ctx.lineTo(pt.x + arm, pt.y);
    ctx.moveTo(pt.x, pt.y - arm);
    ctx.lineTo(pt.x, pt.y + arm);
  }
  ctx.stroke();

  // 4. Outer frame: 1px border #262626 inset 16px
  ctx.strokeStyle = '#262626';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // 5. Top Header
  const badgeText = options.badge || DEFAULT_BADGE;
  ctx.font = `600 11px ${FONT_MONO}`;
  ctx.fillStyle = '#059669';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, 48, 52);

  const refParts: string[] = [];
  if (options.referenceId) refParts.push(`REF: ${options.referenceId}`);
  if (options.date) refParts.push(options.date);
  if (refParts.length > 0) {
    ctx.font = `500 11px ${FONT_MONO}`;
    ctx.fillStyle = '#737373';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(refParts.join('  •  '), width - 48, 52);
  }

  // 6. Title & Subtitle
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `bold 28px ${FONT_SANS}`;
  ctx.fillStyle = '#FAFAF8';
  ctx.fillText(options.title, 48, 92);

  if (options.subtitle) {
    ctx.font = `14px ${FONT_SANS}`;
    ctx.fillStyle = '#A3A3A3';
    ctx.fillText(options.subtitle, 48, 130);
  }

  // 7. Metrics Grid
  let currentY = options.subtitle ? 168 : 148;
  const metrics = options.metrics || [];
  const count = metrics.length;

  if (count > 0) {
    const contentWidth = 1104; // from x=48 to x=1152

    if (count <= 4) {
      // 1 row of N columns
      const gap = 16;
      const colWidth = (contentWidth - (count - 1) * gap) / count;
      const boxHeight = 104;

      for (let i = 0; i < count; i++) {
        const m = metrics[i];
        const bx = 48 + i * (colWidth + gap);
        const by = currentY;

        ctx.fillStyle = '#141414';
        ctx.fillRect(bx, by, colWidth, boxHeight);
        ctx.strokeStyle = '#262626';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, colWidth, boxHeight);

        // Label
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `600 11px ${FONT_SANS}`;
        ctx.fillStyle = '#888888';
        ctx.fillText(m.label.toUpperCase(), bx + 18, by + 16);

        // Value
        ctx.font = `bold 22px ${FONT_SANS}`;
        ctx.fillStyle = m.highlight ? '#10B981' : '#FAFAF8';
        ctx.fillText(m.value, bx + 18, by + 40);

        // Sub-label
        if (m.sub) {
          ctx.font = `500 11px ${FONT_SANS}`;
          ctx.fillStyle = '#737373';
          ctx.fillText(m.sub, bx + 18, by + 72);
        }
      }

      currentY += boxHeight + 20;
    } else {
      // Multi-row grid (> 4 metrics, 2 rows)
      const cols = Math.ceil(count / 2);
      const rows = 2;
      const gapX = 16;
      const gapY = 12;
      const colWidth = (contentWidth - (cols - 1) * gapX) / cols;
      const boxHeight = 84;

      for (let i = 0; i < count; i++) {
        const m = metrics[i];
        const r = Math.floor(i / cols);
        const c = i % cols;
        const bx = 48 + c * (colWidth + gapX);
        const by = currentY + r * (boxHeight + gapY);

        ctx.fillStyle = '#141414';
        ctx.fillRect(bx, by, colWidth, boxHeight);
        ctx.strokeStyle = '#262626';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, colWidth, boxHeight);

        // Label
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `600 10px ${FONT_SANS}`;
        ctx.fillStyle = '#888888';
        ctx.fillText(m.label.toUpperCase(), bx + 14, by + 12);

        // Value
        ctx.font = `bold 18px ${FONT_SANS}`;
        ctx.fillStyle = m.highlight ? '#10B981' : '#FAFAF8';
        ctx.fillText(m.value, bx + 14, by + 32);

        // Sub-label
        if (m.sub) {
          ctx.font = `500 10px ${FONT_SANS}`;
          ctx.fillStyle = '#737373';
          ctx.fillText(m.sub, bx + 14, by + 58);
        }
      }

      currentY += rows * boxHeight + (rows - 1) * gapY + 20;
    }
  }

  // 8. Status / Recommendation Banner (if provided)
  if (options.statusBanner) {
    const bannerY = currentY;
    const bannerHeight = 72;
    const bannerWidth = 1104;

    ctx.fillStyle = '#171717';
    ctx.fillRect(48, bannerY, bannerWidth, bannerHeight);
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.strokeRect(48, bannerY, bannerWidth, bannerHeight);

    // Left accent stroke
    let accentColor = '#059669'; // emerald
    if (options.statusBanner.variant === 'warning') {
      accentColor = '#F59E0B';
    } else if (options.statusBanner.variant === 'default') {
      accentColor = '#737373';
    }

    ctx.fillStyle = accentColor;
    ctx.fillRect(48, bannerY, 4, bannerHeight);

    // Banner title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `bold 13px ${FONT_SANS}`;
    ctx.fillStyle = '#FAFAF8';
    ctx.fillText(options.statusBanner.title, 48 + 20, bannerY + 16);

    // Banner text
    ctx.font = `500 12px ${FONT_SANS}`;
    ctx.fillStyle = '#D4D4D4';
    ctx.fillText(options.statusBanner.text, 48 + 20, bannerY + 40);

    currentY += bannerHeight + 16;
  }

  // 9. Notes (if provided)
  if (options.notes && options.notes.length > 0) {
    ctx.font = `500 11px ${FONT_SANS}`;
    ctx.fillStyle = '#888888';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (const note of options.notes) {
      if (currentY + 14 > 560) break;
      ctx.fillText(`• ${note}`, 48, currentY);
      currentY += 18;
    }
  }

  // 10. Mandatory Watermark & Footer
  const footerY = 574;
  ctx.strokeStyle = '#262626';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, footerY);
  ctx.lineTo(width - 48, footerY);
  ctx.stroke();

  ctx.textBaseline = 'middle';
  ctx.font = `500 11px ${FONT_SANS}`;
  ctx.fillStyle = '#737373';
  ctx.textAlign = 'left';
  ctx.fillText('Issued via Exvorta • Commercial Trade & Logistics Intelligence', 48, 598);

  ctx.font = `600 11px ${FONT_SANS}`;
  ctx.fillStyle = '#10B981';
  ctx.textAlign = 'right';
  ctx.fillText('https://exvorta.com', width - 48, 598);

  if (typeof ctx.restore === 'function') ctx.restore();

  return true;
}

// ============================================================================
// 4. Client Export Trigger
// ============================================================================

function triggerDownload(href: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = href;
  link.style.display = 'none';

  if (document.body && typeof document.body.appendChild === 'function') {
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    link.click();
  }
}

/**
 * Exports a calculation result dossier card as a downloadable PNG image.
 *
 * Guarded for SSR safety: returns `false` if `window` or `document` is undefined.
 * Zero external dependencies: uses native HTML5 Canvas and browser download triggers.
 */
export async function exportCardAsPng(options: CanvasCardExportOptions): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    if (!canvas) return false;

    const rendered = renderCardToCanvas(canvas, options);
    if (!rendered) return false;

    const filename = sanitizeFilename(options.filename);

    // Prefer toBlob if supported with URL.createObjectURL
    if (typeof canvas.toBlob === 'function' && typeof window.URL?.createObjectURL === 'function') {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        triggerDownload(url, filename);
        if (typeof window.URL.revokeObjectURL === 'function') {
          window.URL.revokeObjectURL(url);
        }
        return true;
      }
    }

    // Fallback to toDataURL
    if (typeof canvas.toDataURL === 'function') {
      const dataUrl = canvas.toDataURL('image/png');
      triggerDownload(dataUrl, filename);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
