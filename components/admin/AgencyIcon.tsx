import React from 'react'
import { adminPanelConfig } from './panel.config'

/**
 * Unified admin favicon icon — shared across all projects, branded via panel.config.
 */
export const AgencyIcon: React.FC = () => {
  const { brandLetter, accent, background } = adminPanelConfig

  return (
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
  )
}

export default AgencyIcon
