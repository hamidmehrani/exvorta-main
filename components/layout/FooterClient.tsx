'use client'

import React from 'react'
import Link from 'next/link'
import { m } from 'framer-motion'
import { EASE_OUT } from '@/components/ui/Reveal'
import type { FooterColumn } from './Footer'

export default function FooterClient({ columns }: { columns: FooterColumn[] }) {
  return (
    <footer className="w-full bg-[#FAFAF8] border-t border-black/10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          {/* Brand */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="col-span-2 md:col-span-1"
          >
            <Link href="/" className="inline-flex items-center min-h-[44px] mb-4" aria-label="Exvorta home">
              <span className="font-serif text-xl font-semibold tracking-wide text-obsidian uppercase">
                EXVORTA
              </span>
            </Link>
            <p className="text-xs text-obsidian/40 leading-relaxed font-light max-w-xs">
              The definitive digital foundation for elite global traders. Precision-engineered in Dubai, UAE.
            </p>
          </m.div>

          {columns.map((column, colIndex) => (
            <m.div
              key={column.id || colIndex}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: colIndex * 0.08, ease: EASE_OUT }}
            >
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-obsidian mb-6">
                {column.title}
              </h4>
              <ul className="space-y-1 text-[11px] text-obsidian/60">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="group relative inline-flex min-h-[40px] items-center hover:text-obsidian transition-colors duration-300"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      <span className="absolute inset-x-0 bottom-[9px] h-px bg-obsidian scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-t border-black/5 pt-12 text-center"
        >
          <p className="text-[10px] tracking-widest text-obsidian/30 uppercase">© 2026 Exvorta. All rights reserved.</p>
        </m.div>
      </div>
    </footer>
  )
}
