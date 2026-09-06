import React from 'react'
import ExvortaLogo from '@/components/brand/ExvortaLogo'

/**
 * Unified admin favicon icon — shared across all projects.
 * Uses the Exvorta brand mark.
 */
export const AgencyIcon: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: '#FAFAF8',
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <ExvortaLogo size={24} />
    </div>
  )
}

export default AgencyIcon
