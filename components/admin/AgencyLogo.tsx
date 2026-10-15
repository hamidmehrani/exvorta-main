import React from 'react'
import { adminPanelConfig } from './panel.config'
import AdminBrandMark from './AdminBrandMark'

/**
 * Unified admin logo — shared across all projects, branded via panel.config.
 * Carries the Exvorta brand mark beside the site's own brand name.
 */
export const AgencyLogo: React.FC = () => {
  const { brandName, text } = adminPanelConfig

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
      <AdminBrandMark size={28} tone="dark" />
      <span
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: text,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        {brandName}
      </span>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#00966B',
          border: '1px solid rgba(0, 150, 107, 0.35)',
          background: 'rgba(0, 150, 107, 0.08)',
          borderRadius: '999px',
          padding: '3px 10px',
          lineHeight: 1.4,
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Powered by Exvorta
      </span>
    </div>
  )
}

export default AgencyLogo
