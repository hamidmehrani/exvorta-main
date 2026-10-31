'use client';

import React, { useRef, useState } from 'react';

// ============================================================================
// 1. Interfaces & Types
// ============================================================================

export interface ToolResultMetric {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

export interface ToolResultStatusBanner {
  title: string;
  description: string;
  badge?: string;
  variant?: 'emerald' | 'amber' | 'sky' | 'neutral';
}

export interface ToolResultCardAction {
  label: string;
  icon?: 'copy' | 'print' | 'image' | 'whatsapp' | 'share';
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ToolResultCardProps {
  title: string;
  subtitle?: string;
  badge?: string; // e.g. "EXVORTA // CARGO & INCOTERMS DOSSIER"
  referenceId?: string;
  date?: string;
  statusBanner?: ToolResultStatusBanner;
  metrics?: ToolResultMetric[];
  children?: React.ReactNode; // custom body sections (tables, allocation grids, gap lists)
  // Action configurations
  summaryText?: string;       // Plain text to copy to clipboard
  whatsappText?: string;      // Formatted text for WhatsApp share
  onExportPng?: () => Promise<boolean | void> | void; // PNG export handler using canvas-export
  onPrint?: () => void;       // Print handler (default: window.print())
  onCopySummary?: () => void; // Optional custom copy handler
  customActions?: ToolResultCardAction[];
  notes?: string[];           // Bullet points / disclaimers
  className?: string;
  lang?: 'en' | 'ar';
}

// ============================================================================
// 2. Standard SVG Icons (Zero external dependencies)
// ============================================================================

function PrinterIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function DownloadIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ImageIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function CopyIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function Share2Icon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function SpinnerIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function renderActionIcon(icon?: 'copy' | 'print' | 'image' | 'whatsapp' | 'share', loading?: boolean) {
  if (loading) {
    return <SpinnerIcon className="w-3.5 h-3.5 shrink-0" />;
  }
  switch (icon) {
    case 'copy':
      return <CopyIcon className="w-3.5 h-3.5 shrink-0" />;
    case 'print':
      return <PrinterIcon className="w-3.5 h-3.5 shrink-0" />;
    case 'image':
      return <ImageIcon className="w-3.5 h-3.5 shrink-0" />;
    case 'whatsapp':
      return <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />;
    case 'share':
      return <Share2Icon className="w-3.5 h-3.5 shrink-0" />;
    default:
      return null;
  }
}

function getActionButtonClasses(variant: 'primary' | 'secondary' | 'ghost' = 'secondary') {
  const base =
    'h-8 px-3 text-xs font-mono tracking-wider uppercase rounded transition-colors inline-flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0';
  switch (variant) {
    case 'primary':
      return `${base} bg-neutral-100 text-neutral-950 hover:bg-white font-semibold shadow-sm`;
    case 'ghost':
      return `${base} bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-800/60 border border-transparent hover:border-neutral-800`;
    case 'secondary':
    default:
      return `${base} bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800`;
  }
}

// ============================================================================
// 3. ToolResultCard Component
// ============================================================================

export function ToolResultCard({
  title,
  subtitle,
  badge = 'EXVORTA // DOSSIER',
  referenceId,
  date,
  statusBanner,
  metrics,
  children,
  summaryText,
  whatsappText,
  onExportPng,
  onPrint,
  onCopySummary,
  customActions,
  notes,
  className = '',
  lang = 'en',
}: ToolResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedRefId, setCopiedRefId] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isAr = lang === 'ar';

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback below
      }
    }
    if (typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      } catch {
        return false;
      }
    }
    return false;
  };

  const handleCopyRef = async () => {
    if (!referenceId) return;
    const ok = await copyToClipboard(referenceId);
    if (ok) {
      setCopiedRefId(true);
      setTimeout(() => setCopiedRefId(false), 2000);
    }
  };

  const handleCopySummary = async () => {
    if (onCopySummary) {
      try {
        await onCopySummary();
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      } catch {
        // Ignore
      }
      return;
    }
    if (summaryText) {
      const ok = await copyToClipboard(summaryText);
      if (ok) {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      }
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportPng = async () => {
    if (!onExportPng || isExporting) return;
    setIsExporting(true);
    try {
      await onExportPng();
    } catch (err) {
      // Silently handle error or log in dev
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to export PNG:', err);
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Determine grid columns
  const metricCount = metrics?.length || 0;
  const gridColsClass =
    metricCount === 1
      ? 'grid-cols-1'
      : metricCount === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : metricCount === 3
          ? 'grid-cols-1 sm:grid-cols-3'
          : 'grid-cols-2 lg:grid-cols-4';

  const hasQuickActions =
    Boolean(onPrint) ||
    typeof window !== 'undefined' ||
    Boolean(onExportPng) ||
    Boolean(whatsappText) ||
    Boolean(summaryText || onCopySummary) ||
    Boolean(customActions && customActions.length > 0);

  return (
    <div
      id="tool-result-dossier"
      ref={cardRef}
      dir={isAr ? 'rtl' : 'ltr'}
      className={`result-card printable-card relative rounded-lg border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 lg:p-8 text-neutral-100 shadow-xl backdrop-blur-sm print:bg-white print:text-black print:border-neutral-300 print:shadow-none print:p-0 ${className}`}
    >
      {/* Corner crosshairs for Swiss-Industrial precision (screen only) */}
      <span className="absolute top-2 left-2 font-mono text-[10px] text-neutral-700 select-none pointer-events-none print:hidden leading-none" aria-hidden="true">+</span>
      <span className="absolute top-2 right-2 font-mono text-[10px] text-neutral-700 select-none pointer-events-none print:hidden leading-none" aria-hidden="true">+</span>
      <span className="absolute bottom-2 left-2 font-mono text-[10px] text-neutral-700 select-none pointer-events-none print:hidden leading-none" aria-hidden="true">+</span>
      <span className="absolute bottom-2 right-2 font-mono text-[10px] text-neutral-700 select-none pointer-events-none print:hidden leading-none" aria-hidden="true">+</span>

      {/* Embedded print media overrides */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .result-card.printable-card {
            background-color: #ffffff !important;
            color: #0d0d0d !important;
            border: 1px solid #d4d4d4 !important;
            box-shadow: none !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 16px !important;
          }
          .result-card.printable-card * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── Top Bar / Dossier Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800/80 print:border-neutral-300">
        <div className="font-mono text-xs uppercase tracking-wider text-emerald-400 print:text-emerald-700 font-semibold flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse print:animate-none print:bg-emerald-600" aria-hidden="true" />
          <span>{badge}</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-neutral-400 print:text-neutral-600">
          {referenceId && (
            <button
              type="button"
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded px-1 -mx-1"
              title={copiedRefId ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'انقر لنسخ المعرف المرجعي' : 'Click to copy reference ID')}
              aria-label={isAr ? `نسخ المعرف المرجعي ${referenceId}` : `Copy reference ID ${referenceId}`}
            >
              <span>
                REF:{' '}
                <span className="text-neutral-200 group-hover:text-emerald-400 transition-colors font-semibold">
                  {referenceId}
                </span>
              </span>
              {copiedRefId ? (
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{isAr ? 'تم النسخ' : 'COPIED'}</span>
              ) : (
                <CopyIcon className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 opacity-70 group-hover:opacity-100 print:hidden" />
              )}
            </button>
          )}

          {referenceId && date && (
            <span className="text-neutral-700 select-none print:text-neutral-400">•</span>
          )}

          {date && <span>{date}</span>}
        </div>
      </div>

      {/* ── Title & Subtitle ── */}
      <div className="mt-4 mb-5">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white print:text-black font-sans">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-400 print:text-neutral-600 font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Action Bar (Quick Actions, hidden during print) ── */}
      {hasQuickActions && (
        <div className="no-print flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-neutral-800/80">
          {/* Print / PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className={getActionButtonClasses('secondary')}
            aria-label={isAr ? 'طباعة المستند أو تصديره بصيغة PDF' : 'Print dossier or save as PDF'}
          >
            <PrinterIcon />
            <span>{isAr ? 'طباعة / PDF' : 'Print / PDF'}</span>
          </button>

          {/* Save PNG */}
          {Boolean(onExportPng) && (
            <button
              type="button"
              onClick={handleExportPng}
              disabled={isExporting}
              className={getActionButtonClasses('secondary')}
              aria-label={isAr ? 'حفظ المستند كصورة PNG' : 'Save dossier as PNG image'}
            >
              {isExporting ? <SpinnerIcon /> : <DownloadIcon />}
              <span>
                {isExporting
                  ? (isAr ? 'جاري التصدير...' : 'Exporting...')
                  : (isAr ? 'حفظ كصورة PNG' : 'Save PNG')}
              </span>
            </button>
          )}

          {/* Share on WhatsApp */}
          {Boolean(whatsappText) && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappText!)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={getActionButtonClasses('secondary')}
              aria-label={isAr ? 'مشاركة ملخص التقرير عبر واتساب' : 'Share summary on WhatsApp'}
            >
              <WhatsAppIcon />
              <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
            </a>
          )}

          {/* Copy Summary */}
          {Boolean(summaryText || onCopySummary) && (
            <button
              type="button"
              onClick={handleCopySummary}
              className={getActionButtonClasses('secondary')}
              aria-label={isAr ? 'نسخ ملخص التقرير للحافظة' : 'Copy dossier summary to clipboard'}
            >
              {copiedSummary ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon />}
              <span>
                {copiedSummary
                  ? (isAr ? 'تم النسخ!' : 'Copied!')
                  : (isAr ? 'نسخ الملخص' : 'Copy Summary')}
              </span>
            </button>
          )}

          {/* Custom Actions */}
          {customActions?.map((action, idx) => (
            <button
              key={`${action.label}-${idx}`}
              type="button"
              onClick={() => {
                if (!action.disabled && !action.loading) {
                  action.onClick();
                }
              }}
              disabled={action.disabled || action.loading}
              className={getActionButtonClasses(action.variant)}
              aria-label={action.label}
            >
              {renderActionIcon(action.icon, action.loading)}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Status / Recommendation Banner ── */}
      {statusBanner && (
        <div
          className={`mb-6 p-4 rounded-md border ${
            statusBanner.variant === 'emerald'
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300 print:bg-emerald-50 print:border-emerald-300 print:text-black'
              : statusBanner.variant === 'amber'
                ? 'border-amber-500/30 bg-amber-950/20 text-amber-300 print:bg-amber-50 print:border-amber-300 print:text-black'
                : statusBanner.variant === 'sky'
                  ? 'border-sky-500/30 bg-sky-950/20 text-sky-300 print:bg-sky-50 print:border-sky-300 print:text-black'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-200 print:bg-neutral-50 print:border-neutral-300 print:text-black'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                statusBanner.variant === 'emerald'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                  : statusBanner.variant === 'amber'
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : statusBanner.variant === 'sky'
                      ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                      : 'bg-neutral-400'
              }`}
              aria-hidden="true"
            />
            {statusBanner.badge && (
              <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-current/25 bg-current/10 font-semibold">
                {statusBanner.badge}
              </span>
            )}
            <span className="font-bold text-sm tracking-tight text-white print:text-black">
              {statusBanner.title}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 print:text-neutral-700 leading-relaxed ps-4">
            {statusBanner.description}
          </p>
        </div>
      )}

      {/* ── Key Metrics Grid ── */}
      {metrics && metrics.length > 0 && (
        <div className={`grid ${gridColsClass} gap-3 sm:gap-4 mb-6`}>
          {metrics.map((metric, idx) => (
            <div
              key={`${metric.label}-${idx}`}
              className={`relative p-3.5 sm:p-4 rounded border transition-colors ${
                metric.highlight
                  ? 'border-emerald-500/30 bg-emerald-950/20 print:bg-emerald-50 print:border-emerald-300'
                  : 'border-neutral-800 bg-neutral-950/60 print:bg-neutral-50 print:border-neutral-300'
              }`}
            >
              <div className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 print:text-neutral-600 mb-1 truncate">
                {metric.label}
              </div>
              <div
                className={`font-mono text-xl sm:text-2xl font-bold tracking-tight ${
                  metric.highlight
                    ? 'text-emerald-400 print:text-emerald-700'
                    : 'text-white print:text-black'
                }`}
              >
                {metric.value}
              </div>
              {metric.sub && (
                <div className="font-sans text-xs text-neutral-400 print:text-neutral-600 mt-1">
                  {metric.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Arbitrary Children Slot ── */}
      {children && (
        <div className="mt-6 pt-6 border-t border-neutral-800 print:border-neutral-300">
          {children}
        </div>
      )}

      {/* ── Notes / Disclaimers Section ── */}
      {notes && notes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-800/80 print:border-neutral-300 text-xs text-neutral-400 print:text-neutral-700 space-y-1.5">
          {notes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="font-mono text-[10px] text-neutral-400 print:text-neutral-500 select-none shrink-0 mt-0.5">
                [{String(idx + 1).padStart(2, '0')}]
              </span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Mandatory Institutional Watermark & Brand Footer ── */}
      <div className="mt-6 pt-4 border-t border-neutral-800 print:border-neutral-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 print:text-neutral-700">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 print:bg-black shrink-0"
            aria-hidden="true"
          />
          <span>Issued via Exvorta • Commercial Trade & Logistics Intelligence</span>
        </div>
        <a
          href="https://exvorta.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-emerald-400 print:text-neutral-800 transition-colors"
        >
          exvorta.com
        </a>
      </div>
    </div>
  );
}

export default ToolResultCard;
