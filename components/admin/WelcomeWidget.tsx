import React from 'react'
import Link from 'next/link'
import '../../app/(payload)/admin.scss'

const WelcomeWidget: React.FC = () => {
  return (
    <div className="welcome-widget-container" style={{
      background: '#0D0D0D',
      border: '1px solid #333',
      padding: '2rem',
      marginBottom: '2rem',
      fontFamily: 'monospace',
      color: '#00FF66'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '12px', height: '12px', background: '#00FF66', marginRight: '12px' }}></div>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, fontWeight: 'normal' }}>
          SYSTEM ONLINE: EXVORTA OS
        </h2>
      </div>
      <div style={{ color: '#888', fontSize: '0.875rem', lineHeight: '1.6' }}>
        <p style={{ marginBottom: '1rem' }}>&gt; Initializing CMS modules...</p>
        <p style={{ marginBottom: '1rem' }}>&gt; Environment: PRODUCTION_READY</p>
        <p style={{ marginBottom: '1rem' }}>&gt; Welcome to the Exvorta infrastructure terminal.</p>
        <div style={{ marginTop: '2rem', borderTop: '1px dashed #333', paddingTop: '1rem', display: 'flex', gap: '2rem' }}>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>{'// QUICK ACTIONS'}</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><Link href="/admin/collections/pages" style={{ color: '#00FF66', textDecoration: 'none' }}>→ Manage Pages</Link></li>
              <li><Link href="/admin/collections/products" style={{ color: '#00FF66', textDecoration: 'none' }}>→ Update Portfolio</Link></li>
              <li><Link href="/admin/globals/navigation" style={{ color: '#00FF66', textDecoration: 'none' }}>→ Configure Routing</Link></li>
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
