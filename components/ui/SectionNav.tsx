'use client'

import { useEffect, useRef, useState } from 'react'

export interface SectionNavItem {
  /** DOM id of the section this entry scrolls to. */
  id: string
  label: string
}

interface SectionNavProps {
  items: readonly SectionNavItem[]
  label: string
  /** `brand` lights the active entry emerald; `accent` uses the page's case-study accent. */
  tone?: 'brand' | 'accent'
}

/**
 * Sticky chapter nav for long pages. Sits under the site header and slides up
 * into its slot while the header is hidden (`html[data-header]`, set by
 * HeaderClient). The current chapter is the section crossing the middle of the
 * viewport. Plain anchors, so it works without JS and with the browser's own
 * scroll-padding; the highlight is the only thing JS adds.
 */
export default function SectionNav({ items, label, tone = 'brand' }: SectionNavProps) {
  const [active, setActive] = useState<string | null>(null)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const targets = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el)
    if (targets.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
          else setActive((prev) => (prev === entry.target.id ? null : prev))
        }
      },
      // A thin band across the middle of the viewport.
      { rootMargin: '-45% 0px -54% 0px' },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  // Keep the current chapter visible in the horizontally scrolling strip on phones.
  useEffect(() => {
    const strip = list.current
    const el = active ? strip?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null
    if (!strip || !el) return
    const left = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2
    strip.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [active])

  const on = tone === 'accent' ? 'text-accent-lift' : 'text-success'
  const bar = tone === 'accent' ? 'bg-accent-lift' : 'bg-success'

  return (
    <nav
      aria-label={label}
      className="on-dark sticky top-(--header-h) z-40 border-b border-rule-dark bg-obsidian transition-[top] duration-300 ease-[var(--ease-cinematic)] motion-reduce:transition-none [html[data-header=hidden]_&]:top-0"
    >
      <div className="container-site">
        <ol ref={list} className="relative -mx-4 flex snap-x overflow-x-auto font-mono text-label uppercase [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((it, i) => {
            const current = active === it.id
            return (
              <li key={it.id} data-id={it.id} className="shrink-0 snap-start">
                <a
                  href={`#${it.id}`}
                  aria-current={current ? 'location' : undefined}
                  className={`relative inline-flex min-h-12 items-center gap-2.5 px-4 transition-colors duration-300 hover:text-white motion-reduce:transition-none ${
                    current ? on : 'text-muted-dark'
                  }`}
                >
                  <span className="tabular-nums text-white/60">{String(i + 1).padStart(2, '0')}</span>
                  {it.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-4 bottom-0 h-px origin-left transition-transform duration-500 ease-[var(--ease-cinematic)] motion-reduce:transition-none ${bar} ${
                      current ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
