import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  sanitizeFilename,
  renderCardToCanvas,
  exportCardAsPng,
  type CanvasCardExportOptions,
} from './canvas-export';

// ============================================================================
// Helpers & Mock Factories
// ============================================================================

interface MockCanvasRenderingContext2D {
  save: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  scale: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  strokeRect: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  font: string;
  textAlign: string;
  textBaseline: string;
  direction?: string;
}

function createMockContext(): MockCanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    direction: 'ltr',
  };
}

interface MockCanvasElement {
  width: number;
  height: number;
  getContext: ReturnType<typeof vi.fn>;
  toBlob?: ReturnType<typeof vi.fn>;
  toDataURL?: ReturnType<typeof vi.fn>;
}

function createMockCanvas(ctx: MockCanvasRenderingContext2D | null = createMockContext()): MockCanvasElement {
  return {
    width: 0,
    height: 0,
    getContext: vi.fn().mockImplementation((contextId: string) => {
      if (contextId === '2d') return ctx;
      return null;
    }),
    toBlob: vi.fn((callback: (b: Blob | null) => void) => {
      callback({ size: 1024, type: 'image/png' } as unknown as Blob);
    }),
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockPngData'),
  };
}

const sampleOptions: CanvasCardExportOptions = {
  title: 'Export Dossier Title',
  subtitle: 'Commercial Trade Summary',
  referenceId: 'REF-2026-X1',
  date: '2026-10-31',
  badge: 'EXVORTA // CUSTOM BADGE',
  metrics: [
    { label: 'Total Volume', value: '14.5 CBM', sub: 'Shared container space', highlight: true },
    { label: 'Gross Weight', value: '3,200 kg', sub: 'Actual basis' },
  ],
};

// ============================================================================
// Unit Tests: sanitizeFilename
// ============================================================================

describe('sanitizeFilename', () => {
  it('returns default filename when input is empty, whitespace, or undefined', () => {
    const defaultName = 'exvorta-calculation-dossier.png';
    expect(sanitizeFilename()).toBe(defaultName);
    expect(sanitizeFilename(undefined)).toBe(defaultName);
    expect(sanitizeFilename('')).toBe(defaultName);
    expect(sanitizeFilename('   ')).toBe(defaultName);
    expect(sanitizeFilename('\t\n ')).toBe(defaultName);
  });

  it('uses custom defaultName if provided when input is empty or invalid', () => {
    const customDefault = 'custom-backup.png';
    expect(sanitizeFilename('', customDefault)).toBe(customDefault);
    expect(sanitizeFilename('   ', customDefault)).toBe(customDefault);
    expect(sanitizeFilename(undefined, customDefault)).toBe(customDefault);
  });

  it('appends .png if missing from the filename', () => {
    expect(sanitizeFilename('my-report')).toBe('my-report.png');
    expect(sanitizeFilename('summary-2026')).toBe('summary-2026.png');
    expect(sanitizeFilename('dossier')).toBe('dossier.png');
  });

  it('replaces forbidden path and shell characters with underscore', () => {
    // Forbidden: \ / : * ? " < > | and control characters \x00-\x1F
    const input = 'dossier/export\\file:name*test?"<>|final';
    const result = sanitizeFilename(input);
    expect(result).toBe('dossier_export_file_name_test_____final.png');
    expect(result).not.toContain('/');
    expect(result).not.toContain('\\');
    expect(result).not.toContain(':');
    expect(result).not.toContain('*');
    expect(result).not.toContain('?');
    expect(result).not.toContain('"');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('|');
  });

  it('leaves already valid .png names intact', () => {
    expect(sanitizeFilename('valid-file.png')).toBe('valid-file.png');
    expect(sanitizeFilename('my_report_2026.png')).toBe('my_report_2026.png');
    expect(sanitizeFilename('ALREADY-UPPERCASE.PNG')).toBe('ALREADY-UPPERCASE.PNG');
  });

  it('returns default name if cleaned name reduces to only extension or empty string', () => {
    expect(sanitizeFilename('.png')).toBe('exvorta-calculation-dossier.png');
    expect(sanitizeFilename('.PNG')).toBe('exvorta-calculation-dossier.png');
  });
});

// ============================================================================
// Unit Tests: renderCardToCanvas
// ============================================================================

describe('renderCardToCanvas', () => {
  it('sets canvas.width to 2400 (1200 * 2) and canvas.height to 1260 (630 * 2)', () => {
    const ctx = createMockContext();
    const mockCanvas = createMockCanvas(ctx);

    const result = renderCardToCanvas(mockCanvas as unknown as HTMLCanvasElement, sampleOptions);

    expect(result).toBe(true);
    expect(mockCanvas.width).toBe(2400);
    expect(mockCanvas.height).toBe(1260);
  });

  it("returns false if getContext('2d') returns null", () => {
    const mockCanvas = createMockCanvas(null);

    const result = renderCardToCanvas(mockCanvas as unknown as HTMLCanvasElement, sampleOptions);

    expect(result).toBe(false);
    expect(mockCanvas.width).toBe(2400);
    expect(mockCanvas.height).toBe(1260);
  });

  it('calls save, scale, fillRect, stroke, fillText, and restore on mocked ctx', () => {
    const ctx = createMockContext();
    const mockCanvas = createMockCanvas(ctx);

    const result = renderCardToCanvas(mockCanvas as unknown as HTMLCanvasElement, sampleOptions);

    expect(result).toBe(true);
    expect(ctx.save).toHaveBeenCalledOnce();
    expect(ctx.scale).toHaveBeenCalledWith(2, 2);
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalledOnce();

    // Verify background obsidian rect (1200x630)
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 1200, 630);

    // Verify title and subtitle rendered
    expect(ctx.fillText).toHaveBeenCalledWith(sampleOptions.title, 48, 92);
    expect(ctx.fillText).toHaveBeenCalledWith(sampleOptions.subtitle, 48, 130);

    // Verify badge and reference ID
    expect(ctx.fillText).toHaveBeenCalledWith(sampleOptions.badge, 48, 52);
    expect(ctx.fillText).toHaveBeenCalledWith('REF: REF-2026-X1  •  2026-10-31', 1200 - 48, 52);

    // Verify mandatory watermark footer
    expect(ctx.fillText).toHaveBeenCalledWith('Issued via Exvorta • Commercial Trade & Logistics Intelligence', 48, 598);
    expect(ctx.fillText).toHaveBeenCalledWith('https://exvorta.com', 1200 - 48, 598);
  });

  it('renders default badge when options.badge is omitted', () => {
    const ctx = createMockContext();
    const mockCanvas = createMockCanvas(ctx);

    renderCardToCanvas(mockCanvas as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      badge: undefined,
    });

    expect(ctx.fillText).toHaveBeenCalledWith('EXVORTA // CALCULATION DOSSIER', 48, 52);
  });

  it('handles options without subtitle, referenceId, or date', () => {
    const ctx = createMockContext();
    const mockCanvas = createMockCanvas(ctx);

    const minimalOptions: CanvasCardExportOptions = {
      title: 'Minimal Dossier',
      metrics: [{ label: 'Score', value: '95' }],
    };

    const result = renderCardToCanvas(mockCanvas as unknown as HTMLCanvasElement, minimalOptions);

    expect(result).toBe(true);
    expect(ctx.fillText).toHaveBeenCalledWith('Minimal Dossier', 48, 92);
  });

  it('renders single-row metrics layout with 2 metrics and 4 metrics', () => {
    // 2 metrics
    const ctx2 = createMockContext();
    const canvas2 = createMockCanvas(ctx2);
    const options2: CanvasCardExportOptions = {
      ...sampleOptions,
      metrics: [
        { label: 'Volumetric', value: '4.5 CBM' },
        { label: 'Chargeable', value: '1,200 kg', highlight: true },
      ],
    };
    renderCardToCanvas(canvas2 as unknown as HTMLCanvasElement, options2);

    expect(ctx2.fillText).toHaveBeenCalledWith('VOLUMETRIC', expect.any(Number), expect.any(Number));
    expect(ctx2.fillText).toHaveBeenCalledWith('4.5 CBM', expect.any(Number), expect.any(Number));
    expect(ctx2.fillText).toHaveBeenCalledWith('CHARGEABLE', expect.any(Number), expect.any(Number));
    expect(ctx2.fillText).toHaveBeenCalledWith('1,200 kg', expect.any(Number), expect.any(Number));

    // 4 metrics
    const ctx4 = createMockContext();
    const canvas4 = createMockCanvas(ctx4);
    const options4: CanvasCardExportOptions = {
      ...sampleOptions,
      metrics: [
        { label: 'Metric 1', value: 'Val 1', sub: 'Sub 1' },
        { label: 'Metric 2', value: 'Val 2', sub: 'Sub 2' },
        { label: 'Metric 3', value: 'Val 3', sub: 'Sub 3' },
        { label: 'Metric 4', value: 'Val 4', sub: 'Sub 4' },
      ],
    };
    renderCardToCanvas(canvas4 as unknown as HTMLCanvasElement, options4);

    expect(ctx4.fillText).toHaveBeenCalledWith('METRIC 1', expect.any(Number), expect.any(Number));
    expect(ctx4.fillText).toHaveBeenCalledWith('METRIC 4', expect.any(Number), expect.any(Number));
  });

  it('renders multi-row layout when metric count is greater than 4', () => {
    const ctxMulti = createMockContext();
    const canvasMulti = createMockCanvas(ctxMulti);
    const optionsMulti: CanvasCardExportOptions = {
      ...sampleOptions,
      metrics: [
        { label: 'Metric 1', value: '1' },
        { label: 'Metric 2', value: '2' },
        { label: 'Metric 3', value: '3' },
        { label: 'Metric 4', value: '4' },
        { label: 'Metric 5', value: '5', highlight: true, sub: 'Fifth' },
        { label: 'Metric 6', value: '6' },
      ],
    };

    const result = renderCardToCanvas(canvasMulti as unknown as HTMLCanvasElement, optionsMulti);
    expect(result).toBe(true);

    expect(ctxMulti.fillText).toHaveBeenCalledWith('METRIC 1', expect.any(Number), expect.any(Number));
    expect(ctxMulti.fillText).toHaveBeenCalledWith('METRIC 5', expect.any(Number), expect.any(Number));
    expect(ctxMulti.fillText).toHaveBeenCalledWith('METRIC 6', expect.any(Number), expect.any(Number));
    expect(ctxMulti.fillText).toHaveBeenCalledWith('Fifth', expect.any(Number), expect.any(Number));
  });

  it('renders correctly without metrics', () => {
    const ctx = createMockContext();
    const canvas = createMockCanvas(ctx);

    const result = renderCardToCanvas(canvas as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      metrics: [],
    });

    expect(result).toBe(true);
  });

  it('renders statusBanner and handles emerald, warning, and default variants', () => {
    // 1. Emerald variant (default)
    const ctxEmerald = createMockContext();
    const canvasEmerald = createMockCanvas(ctxEmerald);
    renderCardToCanvas(canvasEmerald as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      statusBanner: {
        title: 'Compliance Status OK',
        text: 'All mandatory conditions satisfied',
        variant: 'emerald',
      },
    });
    expect(ctxEmerald.fillText).toHaveBeenCalledWith('Compliance Status OK', expect.any(Number), expect.any(Number));
    expect(ctxEmerald.fillText).toHaveBeenCalledWith('All mandatory conditions satisfied', expect.any(Number), expect.any(Number));

    // 2. Warning variant
    const ctxWarn = createMockContext();
    const canvasWarn = createMockCanvas(ctxWarn);
    renderCardToCanvas(canvasWarn as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      statusBanner: {
        title: 'Warning: Action Needed',
        text: 'Deadline in 14 days',
        variant: 'warning',
      },
    });
    expect(ctxWarn.fillText).toHaveBeenCalledWith('Warning: Action Needed', expect.any(Number), expect.any(Number));

    // 3. Default variant
    const ctxDef = createMockContext();
    const canvasDef = createMockCanvas(ctxDef);
    renderCardToCanvas(canvasDef as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      statusBanner: {
        title: 'Neutral Notice',
        text: 'Standard documentation applies',
        variant: 'default',
      },
    });
    expect(ctxDef.fillText).toHaveBeenCalledWith('Neutral Notice', expect.any(Number), expect.any(Number));
  });

  it('renders notes and respects overflow boundary safely', () => {
    const ctx = createMockContext();
    const canvas = createMockCanvas(ctx);

    renderCardToCanvas(canvas as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      notes: [
        'Volumetric divisor applied: 5,000 cc/kg for sea freight.',
        'Official exchange rate pegged at 3.6725 AED/USD.',
      ],
    });

    expect(ctx.fillText).toHaveBeenCalledWith('• Volumetric divisor applied: 5,000 cc/kg for sea freight.', 48, expect.any(Number));
    expect(ctx.fillText).toHaveBeenCalledWith('• Official exchange rate pegged at 3.6725 AED/USD.', 48, expect.any(Number));

    // Many notes that would exceed the 560 Y limit
    const ctxOverflow = createMockContext();
    const canvasOverflow = createMockCanvas(ctxOverflow);
    const manyNotes = Array.from({ length: 30 }, (_, i) => `Overflow note line ${i + 1}`);

    const resultOverflow = renderCardToCanvas(canvasOverflow as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      notes: manyNotes,
    });
    expect(resultOverflow).toBe(true);
  });

  it('configures text direction to rtl when lang is ar', () => {
    const ctx = createMockContext();
    const canvas = createMockCanvas(ctx);

    const result = renderCardToCanvas(canvas as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      lang: 'ar',
    });

    expect(result).toBe(true);
    expect(ctx.direction).toBe('rtl');
  });

  it('does not set direction to rtl when lang is en or omitted', () => {
    const ctx = createMockContext();
    const canvas = createMockCanvas(ctx);

    renderCardToCanvas(canvas as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      lang: 'en',
    });

    expect(ctx.direction).toBe('ltr');
  });

  it('gracefully handles direction property throwing an error', () => {
    const ctx = createMockContext();
    Object.defineProperty(ctx, 'direction', {
      get() {
        return 'ltr';
      },
      set() {
        throw new Error('direction not supported');
      },
      configurable: true,
    });
    const canvas = createMockCanvas(ctx);

    const result = renderCardToCanvas(canvas as unknown as HTMLCanvasElement, {
      ...sampleOptions,
      lang: 'ar',
    });

    expect(result).toBe(true);
  });
});

// ============================================================================
// Unit Tests: exportCardAsPng
// ============================================================================

describe('exportCardAsPng', () => {
  it('returns false if typeof window === "undefined"', async () => {
    // In node environment, window is undefined by default
    expect(typeof window).toBe('undefined');

    const result = await exportCardAsPng(sampleOptions);
    expect(result).toBe(false);
  });

  describe('in simulated browser environment', () => {
    let mockLink: {
      download: string;
      href: string;
      style: { display: string };
      click: ReturnType<typeof vi.fn>;
    };
    let mockCanvas: MockCanvasElement;
    let mockCtx: MockCanvasRenderingContext2D;
    let mockBody: {
      appendChild: ReturnType<typeof vi.fn>;
      removeChild: ReturnType<typeof vi.fn>;
    };
    let mockDocument: {
      createElement: ReturnType<typeof vi.fn>;
      body: typeof mockBody | null;
    };
    let mockURL: {
      createObjectURL: ReturnType<typeof vi.fn>;
      revokeObjectURL: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      mockLink = {
        download: '',
        href: '',
        style: { display: '' },
        click: vi.fn(),
      };

      mockCtx = createMockContext();
      mockCanvas = createMockCanvas(mockCtx);

      mockBody = {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      };

      mockDocument = {
        createElement: vi.fn((tagName: string) => {
          if (tagName === 'canvas') return mockCanvas;
          if (tagName === 'a') return mockLink;
          return {};
        }),
        body: mockBody,
      };

      mockURL = {
        createObjectURL: vi.fn().mockReturnValue('blob:https://exvorta.com/mock-blob-uuid'),
        revokeObjectURL: vi.fn(),
      };

      // Mount mocks onto globalThis
      (globalThis as unknown as { window: unknown }).window = {
        URL: mockURL,
      };
      (globalThis as unknown as { document: unknown }).document = mockDocument;
    });

    afterEach(() => {
      // Clean up globals
      delete (globalThis as unknown as { window?: unknown }).window;
      delete (globalThis as unknown as { document?: unknown }).document;
      vi.restoreAllMocks();
    });

    it('returns true and triggers download link click using toBlob and createObjectURL', async () => {
      const optionsWithFilename: CanvasCardExportOptions = {
        ...sampleOptions,
        filename: 'my-custom-dossier',
      };

      const result = await exportCardAsPng(optionsWithFilename);

      expect(result).toBe(true);
      expect(mockDocument.createElement).toHaveBeenCalledWith('canvas');
      expect(mockDocument.createElement).toHaveBeenCalledWith('a');

      // Check toBlob called
      expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png');

      // Check createObjectURL and revokeObjectURL
      expect(mockURL.createObjectURL).toHaveBeenCalled();
      expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:https://exvorta.com/mock-blob-uuid');

      // Check link setup and click
      expect(mockLink.download).toBe('my-custom-dossier.png');
      expect(mockLink.href).toBe('blob:https://exvorta.com/mock-blob-uuid');
      expect(mockBody.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalledOnce();
      expect(mockBody.removeChild).toHaveBeenCalledWith(mockLink);
    });

    it('falls back to toDataURL if toBlob is not available', async () => {
      // Remove toBlob support on canvas
      mockCanvas.toBlob = undefined;
      mockCanvas.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,fallbackData123');

      const result = await exportCardAsPng({
        ...sampleOptions,
        filename: 'fallback-card.png',
      });

      expect(result).toBe(true);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      expect(mockLink.download).toBe('fallback-card.png');
      expect(mockLink.href).toBe('data:image/png;base64,fallbackData123');
      expect(mockLink.click).toHaveBeenCalledOnce();
      expect(mockURL.createObjectURL).not.toHaveBeenCalled();
    });

    it('triggers link.click directly if document.body is not present', async () => {
      mockDocument.body = null;
      mockCanvas.toBlob = undefined;
      mockCanvas.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,dataWithoutBody');

      const result = await exportCardAsPng(sampleOptions);

      expect(result).toBe(true);
      expect(mockLink.click).toHaveBeenCalledOnce();
    });

    it('returns false if canvas rendering fails (e.g. getContext returns null)', async () => {
      mockCanvas.getContext = vi.fn().mockReturnValue(null);

      const result = await exportCardAsPng(sampleOptions);

      expect(result).toBe(false);
      expect(mockLink.click).not.toHaveBeenCalled();
    });

    it('returns false if canvas creation returns null or throws', async () => {
      mockDocument.createElement = vi.fn((tag: string) => {
        if (tag === 'canvas') return null;
        return mockLink;
      });

      const result = await exportCardAsPng(sampleOptions);

      expect(result).toBe(false);
    });

    it('returns false if neither toBlob nor toDataURL are functions', async () => {
      mockCanvas.toBlob = undefined;
      mockCanvas.toDataURL = undefined;

      const result = await exportCardAsPng(sampleOptions);

      expect(result).toBe(false);
    });
  });
});
