import React from 'react'
import { adminPanelConfig } from './panel.config'

/**
 * Unified admin logo — shared across all projects, branded via panel.config.
 */
export const AgencyLogo: React.FC = () => {
  const { brandLetter, brandName, accent, background, text } = adminPanelConfig

  return (
    <div className="flex items-center gap-2" style={{ padding: '4px 0' }}>
      <div
        className="flex items-center justify-center font-bold"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: accent,
          color: background,
          fontSize: '20px',
        }}
      >
        {brandLetter}
      </div>
      <span
        className="font-bold tracking-tight"
        style={{
          fontSize: '20px',
          color: text,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {brandName}
      </span>
    </div>
  )
}

export default AgencyLogo
