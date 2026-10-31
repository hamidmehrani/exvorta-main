import React from 'react'
import {
  buildTestimonialJsonLd,
  type TestimonialItem,
} from '@/lib/social-proof/social-proof-data'

export interface TestimonialCardProps {
  item: TestimonialItem
  includeJsonLd?: boolean
  siteUrl?: string
  tone?: 'light' | 'dark'
  className?: string
}

export function TestimonialCard({
  item,
  includeJsonLd = true,
  siteUrl,
  tone = 'light',
  className = '',
}: TestimonialCardProps) {
  if (!item) {
    return null
  }

  const dark = tone === 'dark'
  const jsonLd = includeJsonLd ? buildTestimonialJsonLd(item, siteUrl) : null
  const maxRating = item.bestRating || 5

  return (
    <div
      className={`relative flex flex-col justify-between border p-6 sm:p-8 transition-colors ${
        dark
          ? 'border-rule-dark bg-charcoal/60 hover:border-emerald/40'
          : 'border-rule bg-surface hover:border-emerald/40'
      } ${className}`}
    >
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Top Header: Visual Honesty Specimen Banner & Rating */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {item.placeholder ? (
          <span
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
              dark
                ? 'border-rule-dark bg-charcoal text-muted-dark'
                : 'border-rule bg-surface-2 text-muted'
            }`}
          >
            {item.placeholderLabel || '[SAMPLE SPECIMEN // PENDING CLIENT SIGN-OFF]'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Verified Client
          </span>
        )}

        <div
          className="flex items-center gap-1 font-mono text-xs text-emerald"
          aria-label={`Rating: ${item.ratingValue} out of ${maxRating}`}
        >
          {Array.from({ length: maxRating }).map((_, idx) => (
            <span
              key={idx}
              className={idx < item.ratingValue ? 'text-emerald' : dark ? 'text-rule-dark' : 'text-rule'}
            >
              ★
            </span>
          ))}
          <span className={`ms-1.5 text-[11px] font-mono ${dark ? 'text-muted-dark' : 'text-muted'}`}>
            {item.ratingValue.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Testimonial Quote */}
      <blockquote
        className={`mb-8 font-serif text-base sm:text-lg font-light leading-relaxed ${
          dark ? 'text-white' : 'text-obsidian'
        }`}
      >
        “{item.quote}”
      </blockquote>

      {/* Author and Metadata Footer */}
      <div className={`mt-auto border-t pt-4 ${dark ? 'border-rule-dark' : 'border-rule'}`}>
        <div className="flex flex-col gap-1">
          <div
            className={`font-mono text-xs font-semibold ${
              dark ? 'text-white' : 'text-obsidian'
            }`}
          >
            {item.authorName}
          </div>
          <div className={`text-xs ${dark ? 'text-muted-dark' : 'text-muted'}`}>
            {item.authorRole}
            {item.companyName && <span> · {item.companyName}</span>}
          </div>
          {item.companySector && (
            <div className={`text-[11px] font-mono ${dark ? 'text-muted-dark/70' : 'text-muted/70'}`}>
              {item.companySector}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.countryOrRegion && (
            <span
              className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                dark
                  ? 'border-rule-dark text-muted-dark'
                  : 'border-rule text-muted'
              }`}
            >
              {item.countryOrRegion}
            </span>
          )}
          {item.verifiedTradeVolume && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider px-2 py-0.5 border border-emerald/30 bg-emerald/5 text-emerald">
              <span className="h-1 w-1 rounded-full bg-emerald" />
              {item.verifiedTradeVolume}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
