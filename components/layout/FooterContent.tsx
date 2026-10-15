import React from 'react'
import Link from '@/components/ui/AppLink'
import Image from 'next/image'
import type { FooterColumn } from './Footer'
import ExvortaLogo from '@/components/brand/ExvortaLogo'

/**
 * Site footer. Server-rendered: nothing here needs hydration, so it adds no
 * client JS (the previous version animated every column in with framer-motion
 * and kept them invisible until the page had booted).
 *
 * Composition: brand + link ledger, a hairline legal bar, and an oversized
 * wordmark cropped by the page edge as the closing signature.
 */
export default function FooterContent({ columns, brand = { name: 'EXVORTA', logoUrl: null } }: { columns: FooterColumn[]; brand?: { name: string; logoUrl: string | null } }) {
  return (
    <footer className="relative w-full overflow-hidden border-t border-rule bg-cream">
      <div className="container-site pt-20 md:pt-24">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="mb-6 inline-flex min-h-[44px] items-center" aria-label={`${brand.name} home`}>
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={160}
                  height={32}
                  className="h-8 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <ExvortaLogo size={32} animated={false} />
              )}
            </Link>
            <p className="mb-8 max-w-xs text-base font-light leading-relaxed text-muted">
              The definitive digital foundation for elite global traders. Precision-engineered in Dubai, UAE.
            </p>
            <p className="inline-flex items-center gap-2.5 border border-rule-strong bg-surface px-3.5 py-2 font-mono text-label uppercase text-muted">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
              </span>
              [ All systems operational ]
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:col-span-8 md:col-start-5 lg:col-start-6 lg:col-span-7">
            {columns.map((column, colIndex) => (
              <div key={column.id || colIndex}>
                <h2 className="eyebrow mb-6 !text-obsidian">
                  <span className="h-1 w-1 rotate-45 bg-emerald" aria-hidden />
                  {column.title}
                </h2>
                <ul className="border-t border-rule">
                  {column.links.map((link) => (
                    <li key={link.id || link.href} className="border-b border-rule">
                      <Link
                        href={link.href}
                        className="group flex min-h-[48px] items-center justify-between gap-3 text-base text-obsidian/75 transition-colors duration-300 hover:text-obsidian"
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                        <span aria-hidden className="font-mono text-xs text-emerald opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-rule py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-label uppercase text-muted">
            © {new Date().getFullYear()} Exvorta. All rights reserved.
          </p>
          <p className="hidden font-mono text-label uppercase text-muted md:block" aria-hidden>
            25.2048° N · 55.2708° E
          </p>
          <a
            href="#main-content"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-label uppercase text-muted transition-colors hover:text-obsidian"
          >
            Back to top
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </a>
        </div>
      </div>

      {/* Closing signature: oversized wordmark, cropped by the page edge */}
      <div
        aria-hidden
        className="pointer-events-none -mb-[0.08em] select-none overflow-hidden whitespace-nowrap text-center font-sans text-mega font-bold uppercase text-obsidian/[0.045] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      >
        {brand.name}
      </div>
    </footer>
  )
}
