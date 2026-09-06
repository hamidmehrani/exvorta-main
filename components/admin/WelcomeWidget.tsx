import React from 'react'
import Link from 'next/link'
import { adminPanelConfig } from './panel.config'
import ExvortaLogo from '@/components/brand/ExvortaLogo'
import '../../app/(payload)/admin.scss'

/**
 * Unified admin welcome widget — shared across all projects, branded via
 * panel.config. Shown at the top of the Payload dashboard.
 */
const WelcomeWidget: React.FC = () => {
  const { brandName, tagline, quickActions, accent } = adminPanelConfig

  return (
    <div
      className="welcome-widget-container"
      style={{
        background: '#0D0D0D',
        border: '1px solid #333',
        padding: '2rem',
        marginBottom: '2rem',
        fontFamily: 'monospace',
        color: accent,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <ExvortaLogo size={30} tone="dark" />
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontWeight: 'normal' }}>
          SYSTEM ONLINE: {brandName}
        </h2>
      </div>
      <div style={{ color: '#888', fontSize: '0.875rem', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '1rem' }}>&gt; {tagline}</p>
        <p style={{ marginBottom: '1rem' }}>&gt; Content, media and settings below. Use QUICK ACTIONS to jump straight to the essentials.</p>
        <div style={{ marginTop: '2rem', borderTop: '1px dashed #333', paddingTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>{'// QUICK ACTIONS'}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickActions.map((action) => (
                <li key={action.href}>
                  <Link href={action.href} style={{ color: accent, textDecoration: 'none' }}>
                    → {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>{'// TIPS'}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ color: '#888' }}>* Compress images before uploading</li>
              <li style={{ color: '#888' }}>* Check SEO metadata before publishing</li>
              <li style={{ color: '#888' }}>* Save drafts, then Publish when ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeWidget
