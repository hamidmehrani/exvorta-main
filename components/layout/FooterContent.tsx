import React from 'react'
import Link from '@/components/ui/AppLink'
import Image from 'next/image'
import type { FooterColumn } from './Footer'
import ExvortaLogo from '@/components/brand/ExvortaLogo'

/**
 * Site footer. Server-rendered: nothing here needs hydration, so it adds no
 * client JS (the previous version animated every column in with framer-motion
 * and kept them invisible until the page had booted).
 */
export default function FooterContent({ columns, brand = { name: 'EXVORTA', logoUrl: null } }: { columns: FooterColumn[]; brand?: { name: string; logoUrl: string | null } }) {
  return (
    <footer className="w-full border-t border-obsidian/10 bg-cream">
      <div className="container-site py-20 md:py-24">
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
            <p className="mb-8 max-w-xs text-sm font-light leading-relaxed text-muted">
              The definitive digital foundation for elite global traders. Precision-engineered in Dubai, UAE.
            </p>
            <p className="inline-flex items-center gap-2 border border-obsidian/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden />
              [ All systems operational ]
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:col-span-8 md:col-start-5 lg:col-start-6 lg:col-span-7">
            {columns.map((column, colIndex) => (
              <div key={column.id || colIndex}>
                <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian">
                  {column.title}
                </h2>
                <ul className="space-y-1 text-sm text-obsidian/75">
                  {column.links.map((link) => (
                    <li key={link.id || link.href}>
                      <Link
                        href={link.href}
                        className="group relative inline-flex min-h-[40px] items-center transition-colors duration-300 hover:text-obsidian"
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                      >
                        <span className="absolute inset-x-0 bottom-[9px] h-px origin-left scale-x-0 bg-obsidian transition-transform duration-300 group-hover:scale-x-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-obsidian/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            © {new Date().getFullYear()} Exvorta. All rights reserved.
          </p>
          <a
            href="#main-content"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-obsidian"
          >
            Back to top
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
