import React from 'react'

export interface PageWrapperProps {
  children: React.ReactNode
  noiseOpacity?: number
  className?: string
}

/**
 * The page's single <main> landmark (page components must render a <div>, not
 * another <main>). No overflow clipping here: `overflow: hidden` on an
 * ancestor silently disables `position: sticky` for everything inside.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  noiseOpacity = 0.02,
  className = '',
}) => {
  return (
    <div className={`relative flex min-h-[calc(100vh-var(--header-h))] w-full flex-col bg-bg text-text ${className}`}>
      {/* Fixed, viewport-sized grain tile: one cheap layer instead of a
          page-tall filtered SVG repainted over the whole document. */}
      <div aria-hidden="true" className="noise-overlay" style={{ opacity: noiseOpacity }} />

      <main id="main-content" className="relative z-10 flex w-full flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}

export default PageWrapper
