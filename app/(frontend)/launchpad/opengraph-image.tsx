import { ImageResponse } from 'next/og'

export const alt = 'Exvorta Launchpad — Trade Platform for Emerging Exporters'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function LaunchpadOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0A',
          padding: '64px 72px',
          border: '12px solid #141414',
          position: 'relative',
        }}
      >
        {/* Architectural hairline inner border */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
          }}
        />

        {/* Top Bar: Brand + Launchpad Program Badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#00FF66',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 16,
                letterSpacing: '0.25em',
                color: '#FAFAF8',
                fontWeight: 700,
              }}
            >
              EXVORTA // LAUNCHPAD
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 14px',
              border: '1px solid rgba(0, 255, 102, 0.3)',
              backgroundColor: 'rgba(0, 255, 102, 0.08)',
              borderRadius: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                letterSpacing: '0.15em',
                color: '#00FF66',
                textTransform: 'uppercase',
              }}
            >
              [ 2 MILESTONES &bull; EN/AR ARCHITECTURE ]
            </span>
          </div>
        </div>

        {/* Middle: Eyebrow + Headline + 3 Core Deliverables */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '1040px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: '0.3em',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
            }}
          >
            [ EXPORTER ACCELERATION PROGRAM ]
          </div>
          <h1
            style={{
              fontFamily: 'serif',
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#FAFAF8',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Trade Platform for Emerging Exporters
          </h1>

          {/* 3 Core Deliverables Row */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#141414',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 18px',
                borderRadius: '4px',
                flex: 1,
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#00FF66', letterSpacing: '0.1em' }}>
                01 // SITE
              </span>
              <span style={{ fontFamily: 'sans-serif', fontSize: 15, color: '#FAFAF8', marginTop: '4px', fontWeight: 500 }}>
                Bilingual EN/AR Portal
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#141414',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 18px',
                borderRadius: '4px',
                flex: 1,
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#00FF66', letterSpacing: '0.1em' }}>
                02 // RFQ
              </span>
              <span style={{ fontFamily: 'sans-serif', fontSize: 15, color: '#FAFAF8', marginTop: '4px', fontWeight: 500 }}>
                Embedded Container Cart
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#141414',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '14px 18px',
                borderRadius: '4px',
                flex: 1,
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#00FF66', letterSpacing: '0.1em' }}>
                03 // SAAS
              </span>
              <span style={{ fontFamily: 'sans-serif', fontSize: 15, color: '#FAFAF8', marginTop: '4px', fontWeight: 500 }}>
                12 Mo Growth Operations
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Specifications & Canonical */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontFamily: 'monospace',
              fontSize: 12,
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.45)',
            }}
          >
            <span>[ ZERO-CDN DEPENDENCY ]</span>
            <span>[ NATIVE RTL TYPOGRAPHY ]</span>
            <span>[ INCOTERMS FOB/CIF/CFR ]</span>
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            EXVORTA.COM/LAUNCHPAD
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
