import { describe, it, expect } from 'vitest'
import {
  defaultSocialProofConfig,
  buildTestimonialJsonLd,
  buildAggregateRatingJsonLd,
  type TestimonialItem,
} from './social-proof-data'
import {
  ClientLogoStrip,
  MetricCounters,
  TestimonialCard,
  SocialProofSection,
  defaultSocialProofConfig as barrelConfig,
  buildTestimonialJsonLd as barrelBuildTestimonial,
  buildAggregateRatingJsonLd as barrelBuildAggregate,
} from '@/components/social-proof'

describe('Social Proof Barrel Exports', () => {
  it('exports all core components and data helpers from components/social-proof', () => {
    expect(ClientLogoStrip).toBeDefined()
    expect(MetricCounters).toBeDefined()
    expect(TestimonialCard).toBeDefined()
    expect(SocialProofSection).toBeDefined()
    expect(barrelConfig).toBe(defaultSocialProofConfig)
    expect(barrelBuildTestimonial).toBe(buildTestimonialJsonLd)
    expect(barrelBuildAggregate).toBe(buildAggregateRatingJsonLd)
  })
})

describe('Social Proof Data & Config', () => {
  it('defaultSocialProofConfig has non-empty logos, counters, and testimonials', () => {
    expect(defaultSocialProofConfig.logos.length).toBeGreaterThan(0)
    expect(defaultSocialProofConfig.counters.length).toBeGreaterThan(0)
    expect(defaultSocialProofConfig.testimonials.length).toBeGreaterThan(0)
  })

  it('all default items in defaultSocialProofConfig have placeholder: true', () => {
    for (const logo of defaultSocialProofConfig.logos) {
      expect(logo.placeholder).toBe(true)
      expect(logo.placeholderLabel).toBeDefined()
      expect(logo.placeholderLabel.length).toBeGreaterThan(0)
      // Visual honesty: no mock brand graphics
      expect(logo.logoUrl).toBeUndefined()
    }

    for (const counter of defaultSocialProofConfig.counters) {
      expect(counter.placeholder).toBe(true)
      expect(counter.placeholderLabel).toBeDefined()
      expect(typeof counter.value).toBe('number')
      expect(counter.label.length).toBeGreaterThan(0)
    }

    for (const testimonial of defaultSocialProofConfig.testimonials) {
      expect(testimonial.placeholder).toBe(true)
      expect(testimonial.placeholderLabel).toBeDefined()
      expect(testimonial.quote.length).toBeGreaterThan(0)
      expect(testimonial.authorName).toContain('Specimen')
      expect(testimonial.ratingValue).toBeGreaterThanOrEqual(1)
      expect(testimonial.ratingValue).toBeLessThanOrEqual(5)
    }
  })
})

describe('Schema.org Review JSON-LD Generator', () => {
  const sampleTestimonial: TestimonialItem = {
    id: 'test-1',
    quote: 'Superior trade execution and digital manifest architecture.',
    authorName: 'Alex Mercer',
    authorRole: 'Chief Logistics Officer',
    companyName: 'Global Freight Ltd',
    companySector: 'Logistics',
    countryOrRegion: 'United Arab Emirates',
    ratingValue: 5,
    bestRating: 5,
    verifiedTradeVolume: '$30M annual throughput',
    placeholder: false,
  }

  it('buildTestimonialJsonLd produces valid Schema.org Review markup', () => {
    const jsonLd = buildTestimonialJsonLd(sampleTestimonial)
    expect(jsonLd).not.toBeNull()
    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Organization',
        name: 'Exvorta',
        url: 'https://exvorta.com',
      },
      author: {
        '@type': 'Person',
        name: 'Alex Mercer',
        jobTitle: 'Chief Logistics Officer',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
      },
      reviewBody: 'Superior trade execution and digital manifest architecture.',
      publisher: {
        '@type': 'Organization',
        name: 'Exvorta',
      },
    })
  })

  it('supports custom siteUrl parameter', () => {
    const jsonLd = buildTestimonialJsonLd(sampleTestimonial, 'https://staging.exvorta.com')
    expect(jsonLd?.itemReviewed).toEqual({
      '@type': 'Organization',
      name: 'Exvorta',
      url: 'https://staging.exvorta.com',
    })
  })

  it('handles optional authorRole gracefully', () => {
    const itemWithoutRole: TestimonialItem = {
      ...sampleTestimonial,
      authorRole: '',
    }
    const jsonLd = buildTestimonialJsonLd(itemWithoutRole)
    expect(jsonLd?.author).toEqual({
      '@type': 'Person',
      name: 'Alex Mercer',
    })
  })

  it('supports custom bestRating', () => {
    const itemWithCustomScale: TestimonialItem = {
      ...sampleTestimonial,
      ratingValue: 9,
      bestRating: 10,
    }
    const jsonLd = buildTestimonialJsonLd(itemWithCustomScale)
    expect(jsonLd?.reviewRating).toEqual({
      '@type': 'Rating',
      ratingValue: 9,
      bestRating: 10,
    })
  })

  it('handles empty or malformed inputs gracefully', () => {
    expect(buildTestimonialJsonLd(null)).toBeNull()
    expect(buildTestimonialJsonLd(undefined)).toBeNull()
    expect(buildTestimonialJsonLd({} as TestimonialItem)).toBeNull()
    expect(buildTestimonialJsonLd({ quote: '' } as TestimonialItem)).toBeNull()
    expect(buildTestimonialJsonLd({ quote: 'Good', authorName: '' } as TestimonialItem)).toBeNull()
  })
})

describe('Schema.org AggregateRating JSON-LD Generator', () => {
  const testimonials: TestimonialItem[] = [
    {
      id: 't-1',
      quote: 'Excellent platform.',
      authorName: 'User A',
      authorRole: 'Director',
      companyName: 'Company A',
      companySector: 'Trade',
      countryOrRegion: 'UAE',
      ratingValue: 5,
      placeholder: false,
    },
    {
      id: 't-2',
      quote: 'Very thorough.',
      authorName: 'User B',
      authorRole: 'Manager',
      companyName: 'Company B',
      companySector: 'Freight',
      countryOrRegion: 'KSA',
      ratingValue: 4,
      placeholder: false,
    },
  ]

  it('buildAggregateRatingJsonLd calculates accurate average and counts', () => {
    const jsonLd = buildAggregateRatingJsonLd(testimonials)
    expect(jsonLd).not.toBeNull()
    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: {
        '@type': 'Organization',
        name: 'Exvorta',
        url: 'https://exvorta.com',
      },
      ratingValue: 4.5,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 2,
      reviewCount: 2,
    })
  })

  it('rounds decimal average cleanly to 1 decimal place', () => {
    const threeTestimonials: TestimonialItem[] = [
      { ...testimonials[0], ratingValue: 5 },
      { ...testimonials[1], ratingValue: 5 },
      { ...testimonials[1], ratingValue: 4 },
    ]
    // (5 + 5 + 4) / 3 = 14 / 3 = 4.6666... -> 4.7
    const jsonLd = buildAggregateRatingJsonLd(threeTestimonials)
    expect(jsonLd?.ratingValue).toBe(4.7)
    expect(jsonLd?.ratingCount).toBe(3)
  })

  it('supports custom siteUrl parameter for AggregateRating', () => {
    const jsonLd = buildAggregateRatingJsonLd(testimonials, 'https://test.exvorta.com')
    expect(jsonLd?.itemReviewed).toEqual({
      '@type': 'Organization',
      name: 'Exvorta',
      url: 'https://test.exvorta.com',
    })
  })

  it('handles empty or malformed testimonial lists gracefully', () => {
    expect(buildAggregateRatingJsonLd(null)).toBeNull()
    expect(buildAggregateRatingJsonLd(undefined)).toBeNull()
    expect(buildAggregateRatingJsonLd([])).toBeNull()
    expect(buildAggregateRatingJsonLd([{} as TestimonialItem])).toBeNull()
    expect(buildAggregateRatingJsonLd([{ quote: 'No rating' } as TestimonialItem])).toBeNull()
  })
})
