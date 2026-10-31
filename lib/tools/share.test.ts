import { describe, expect, it } from 'vitest'
import {
  buildWhatsAppShareUrl,
  formatIncotermShareText,
  formatDocGenShareText,
  formatGenericToolShareText,
} from './share'

describe('Pure Share Helpers: buildWhatsAppShareUrl', () => {
  it('builds a valid wa.me URL with correctly encoded query text', () => {
    const rawText = 'Exvorta Trade Calc: Incoterms 2020 FOB | Link: https://exvorta.com/tools/incoterm-cbm'
    const url = buildWhatsAppShareUrl(rawText)

    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    const encodedPart = url.slice('https://wa.me/?text='.length)
    expect(decodeURIComponent(encodedPart)).toBe(rawText)
  })

  it('correctly percent-encodes Arabic text, spaces, and punctuation', () => {
    const arabicText = 'حاسبة إكسفورتا للتجارة: إنكوتيرمز 2020 CIF | الحجم: 15 م³ | الرابط: https://exvorta.com/tools/incoterm-cbm/ar'
    const url = buildWhatsAppShareUrl(arabicText)

    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    expect(url).not.toContain(' ')
    expect(url).not.toContain('حاسبة')
    expect(decodeURIComponent(url.slice('https://wa.me/?text='.length))).toBe(arabicText)
  })

  it('injects zero PII, phone numbers, or extraneous query parameters', () => {
    const url = buildWhatsAppShareUrl('Test payload')
    const parsed = new URL(url)

    expect(parsed.protocol).toBe('https:')
    expect(parsed.hostname).toBe('wa.me')
    expect(parsed.pathname).toBe('/')
    expect(Array.from(parsed.searchParams.keys())).toEqual(['text'])
    expect(parsed.searchParams.has('phone')).toBe(false)
    expect(parsed.searchParams.has('utm_source')).toBe(false)
    expect(parsed.searchParams.has('email')).toBe(false)
  })
})

describe('Pure Share Helpers: formatIncotermShareText', () => {
  it('formats full English incoterm share text with all parameters', () => {
    const text = formatIncotermShareText({
      incoterm: 'FOB',
      cbm: 24.5,
      weightKg: 4200,
      containerFit: '20ft FCL',
      permalink: 'https://exvorta.com/tools/incoterm-cbm?code=FOB&cbm=24.5',
      lang: 'en',
    })

    expect(text).toBe(
      'Exvorta Trade Calc: Incoterms 2020 FOB | Volume: 24.5 CBM | Weight: 4200 kg | Fit: 20ft FCL | Link: https://exvorta.com/tools/incoterm-cbm?code=FOB&cbm=24.5'
    )
  })

  it('defaults to English when lang is omitted', () => {
    const text = formatIncotermShareText({
      incoterm: 'CIF',
      permalink: 'https://exvorta.com/tools/incoterm-cbm?code=CIF',
    })

    expect(text).toBe('Exvorta Trade Calc: Incoterms 2020 CIF | Link: https://exvorta.com/tools/incoterm-cbm?code=CIF')
  })

  it('formats English incoterm share text with optional parameters omitted', () => {
    const text = formatIncotermShareText({
      incoterm: 'DDP',
      cbm: 10,
      permalink: 'https://exvorta.com/tools/incoterm-cbm?code=DDP',
      lang: 'en',
    })

    expect(text).toBe('Exvorta Trade Calc: Incoterms 2020 DDP | Volume: 10 CBM | Link: https://exvorta.com/tools/incoterm-cbm?code=DDP')
    expect(text).not.toContain('Weight:')
    expect(text).not.toContain('Fit:')
  })

  it('formats full Arabic incoterm share text with all parameters', () => {
    const text = formatIncotermShareText({
      incoterm: 'CIF',
      cbm: 18.2,
      weightKg: 3500,
      containerFit: 'حاوية 20 قدم',
      permalink: 'https://exvorta.com/tools/incoterm-cbm/ar?code=CIF',
      lang: 'ar',
    })

    expect(text).toBe(
      'حاسبة إكسفورتا للتجارة: إنكوتيرمز 2020 CIF | الحجم: 18.2 م³ | الوزن: 3500 كجم | التعبئة: حاوية 20 قدم | الرابط: https://exvorta.com/tools/incoterm-cbm/ar?code=CIF'
    )
  })

  it('formats Arabic incoterm share text with optional parameters omitted', () => {
    const text = formatIncotermShareText({
      incoterm: 'EXW',
      permalink: 'https://exvorta.com/tools/incoterm-cbm/ar?code=EXW',
      lang: 'ar',
    })

    expect(text).toBe('حاسبة إكسفورتا للتجارة: إنكوتيرمز 2020 EXW | الرابط: https://exvorta.com/tools/incoterm-cbm/ar?code=EXW')
    expect(text).not.toContain('الحجم:')
    expect(text).not.toContain('الوزن:')
    expect(text).not.toContain('التعبئة:')
  })
})

describe('Pure Share Helpers: formatDocGenShareText', () => {
  it('formats English document share text with docNumber', () => {
    const text = formatDocGenShareText({
      docType: 'Commercial Invoice',
      docNumber: 'INV-2026-089',
      permalink: 'https://exvorta.com/tools/docs-generator',
      lang: 'en',
    })

    expect(text).toBe('Exvorta DocGen: Commercial Invoice #INV-2026-089 | Link: https://exvorta.com/tools/docs-generator')
  })

  it('formats English document share text when docNumber is omitted or empty', () => {
    const text = formatDocGenShareText({
      docType: 'Packing List',
      permalink: 'https://exvorta.com/tools/docs-generator',
      lang: 'en',
    })

    expect(text).toBe('Exvorta DocGen: Packing List | Link: https://exvorta.com/tools/docs-generator')
    expect(text).not.toContain('#')
  })

  it('formats Arabic document share text with docNumber', () => {
    const text = formatDocGenShareText({
      docType: 'فاتورة تجارية',
      docNumber: 'INV-2026-089',
      permalink: 'https://exvorta.com/tools/docs-generator',
      lang: 'ar',
    })

    expect(text).toBe('مولد وثائق إكسفورتا: فاتورة تجارية رقم INV-2026-089 | الرابط: https://exvorta.com/tools/docs-generator')
  })

  it('formats Arabic document share text when docNumber is omitted', () => {
    const text = formatDocGenShareText({
      docType: 'قائمة التعبئة',
      permalink: 'https://exvorta.com/tools/docs-generator',
      lang: 'ar',
    })

    expect(text).toBe('مولد وثائق إكسفورتا: قائمة التعبئة | الرابط: https://exvorta.com/tools/docs-generator')
    expect(text).not.toContain('رقم')
  })

  it('defaults to English when lang is omitted', () => {
    const text = formatDocGenShareText({
      docType: 'CMR Consignment Note',
      docNumber: 'CMR-441',
      permalink: 'https://exvorta.com/tools/docs-generator',
    })

    expect(text).toBe('Exvorta DocGen: CMR Consignment Note #CMR-441 | Link: https://exvorta.com/tools/docs-generator')
  })
})

describe('Pure Share Helpers: formatGenericToolShareText', () => {
  it('formats English generic tool share text with summary', () => {
    const text = formatGenericToolShareText({
      title: 'Tariff Finder',
      summary: 'HS Code 0901.11 Arabica Beans',
      permalink: 'https://exvorta.com/tools/tariff',
      lang: 'en',
    })

    expect(text).toBe('Exvorta Tariff Finder: HS Code 0901.11 Arabica Beans | Link: https://exvorta.com/tools/tariff')
  })

  it('formats English generic tool share text without summary', () => {
    const text = formatGenericToolShareText({
      title: 'Tariff Finder',
      permalink: 'https://exvorta.com/tools/tariff',
      lang: 'en',
    })

    expect(text).toBe('Exvorta Tariff Finder | Link: https://exvorta.com/tools/tariff')
  })

  it('formats Arabic generic tool share text with summary', () => {
    const text = formatGenericToolShareText({
      title: 'دليل التعرفة الجمركية',
      summary: 'بند 0901.11 بن عربي غير محمص',
      permalink: 'https://exvorta.com/tools/tariff/ar',
      lang: 'ar',
    })

    expect(text).toBe('إكسفورتا دليل التعرفة الجمركية: بند 0901.11 بن عربي غير محمص | الرابط: https://exvorta.com/tools/tariff/ar')
  })

  it('formats Arabic generic tool share text without summary', () => {
    const text = formatGenericToolShareText({
      title: 'دليل التعرفة الجمركية',
      permalink: 'https://exvorta.com/tools/tariff/ar',
      lang: 'ar',
    })

    expect(text).toBe('إكسفورتا دليل التعرفة الجمركية | الرابط: https://exvorta.com/tools/tariff/ar')
  })
})
