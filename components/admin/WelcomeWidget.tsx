import React from 'react'
import Link from 'next/link'
import '../../app/(payload)/admin.scss'

/**
 * Unified admin welcome widget — identical component across Exvorta, Stonvi,
 * Nutave, Spicevo. Brand + quick actions are configured per project below.
 */
interface QuickAction {
  label: string
  href: string
}

interface WelcomeWidgetProps {
  systemName?: string
  tagline?: string
  quickActions?: QuickAction[]
}

const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({
  systemName = 'EXVORTA OS',
  tagline = 'Welcome to the Exvorta infrastructure terminal.',
  quickActions = [
    { label: 'Manage Pages', href: '/admin/collections/pages' },
    { label: 'Update Portfolio', href: '/admin/collections/projects' },
    { label: 'Configure Routing', href: '/admin/globals/navigation' },
  ],
}) => {
  const accent = '#00FF66'

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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '12px', height: '12px', background: accent, marginRight: '12px' }}></div>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontWeight: 'normal' }}>
          SYSTEM ONLINE: {systemName}
        </h2>
      </div>
      <div style={{ color: '#888', fontSize: '0.875rem', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '1rem' }}>&gt; Initializing CMS modules...</p>
        <p style={{ marginBottom: '1rem' }}>&gt; Environment: PRODUCTION_READY</p>
        <p style={{ marginBottom: '1rem' }}>&gt; {tagline}</p>
        <div style={{ marginTop: '2rem', borderTop: '1px dashed #333', paddingTop: '1rem', display: 'flex', gap: '2rem' }}>
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
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>{'// PROTOCOLS'}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ color: '#888' }}>* Ensure image assets are compressed</li>
              <li style={{ color: '#888' }}>* Verify SEO metadata before publish</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeWidget
