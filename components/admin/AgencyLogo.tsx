import React from 'react'

/**
 * Unified admin logo — identical across Exvorta, Stonvi, Nutave, Spicevo.
 * Uses CSS custom properties with fallback chains so it adapts to each
 * project's token scheme without per-project edits.
 */
const BRAND_LETTER = 'E'
const BRAND_NAME = 'EXVORTA OS'

export const AgencyLogo: React.FC = () => {
  const accent = 'var(--color-accent, var(--ex-accent, var(--theme-success-400, #059669)))'
  const bg = 'var(--color-bg, var(--ex-bg, var(--theme-bg, #0A0A0A)))'
  const text = 'var(--color-text, var(--ex-text, var(--theme-text, #E5E5E5)))'

  return (
    <div className="flex items-center gap-2" style={{ padding: '4px 0' }}>
      <div
        className="flex items-center justify-center font-bold"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: accent,
          color: bg,
          fontSize: '20px',
        }}
      >
        {BRAND_LETTER}
      </div>
      <span
        className="font-bold tracking-tight"
        style={{
          fontSize: '20px',
          color: text,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {BRAND_NAME}
      </span>
    </div>
  )
}

export default AgencyLogo
