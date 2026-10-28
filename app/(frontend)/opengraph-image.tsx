import { ImageResponse } from 'next/og'

export const alt = 'Exvorta — Digital Infrastructure for Global Traders'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
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

        {/* Top Bar: Brand + System Indicator */}
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
              EXVORTA
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
              [ SYS_ONLINE &bull; INSTITUTIONAL ]
            </span>
          </div>
        </div>

        {/* Middle: Eyebrow + Headline + Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxWidth: '1000px',
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
            [ DIGITAL TRADE INFRASTRUCTURE ]
          </div>
          <h1
            style={{
              fontFamily: 'serif',
              fontSize: 60,
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#FAFAF8',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Digital Infrastructure for Global Traders
          </h1>
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: 22,
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
            }}
          >
            High-trust cross-border trade platforms, bilingual EN/AR architecture, and automated export workflows.
          </p>
        </div>

        {/* Bottom Bar: Institutional Specifications & Canonical */}
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
            <span>[ EN/AR BILINGUAL ]</span>
            <span>[ INCOTERMS 2020 ]</span>
            <span>[ CONTAINER-LOAD RFQ ]</span>
          </div>

          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            EXVORTA.COM
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
