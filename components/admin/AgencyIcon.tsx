import React from 'react'

/**
 * Unified admin favicon icon — identical across all four projects.
 * Token-adaptive via fallback chains.
 */
const BRAND_LETTER = 'E'

export const AgencyIcon: React.FC = () => {
  const accent = 'var(--color-accent, var(--ex-accent, var(--theme-success-400, #059669)))'
  const bg = 'var(--color-bg, var(--ex-bg, var(--theme-bg, #0A0A0A)))'

  return (
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
  )
}

export default AgencyIcon
