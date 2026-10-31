import { describe, it, expect } from 'vitest'
import {
  DEFAULT_WHATSAPP_PHONE,
  WHATSAPP_DISMISSED_STORAGE_KEY,
  formatWhatsAppPhone,
  buildWhatsAppPrefill,
  buildWhatsAppUrl,
} from './whatsapp'

describe('WhatsApp utilities', () => {
  describe('Constants', () => {
    it('exports expected constants', () => {
      expect(DEFAULT_WHATSAPP_PHONE).toBe('97148793000')
      expect(WHATSAPP_DISMISSED_STORAGE_KEY).toBe('exv_wa_dismissed')
    })
  })

  describe('formatWhatsAppPhone', () => {
    it('strips spaces, plus signs, dashes, and parentheses', () => {
      expect(formatWhatsAppPhone('+971 4 879 3000')).toBe('97148793000')
      expect(formatWhatsAppPhone('+971-50-123-4567')).toBe('971501234567')
      expect(formatWhatsAppPhone('(971) 4-879-3000')).toBe('97148793000')
    })

    it('defaults to DEFAULT_WHATSAPP_PHONE when phone is null or undefined', () => {
      expect(formatWhatsAppPhone(null)).toBe(DEFAULT_WHATSAPP_PHONE)
      expect(formatWhatsAppPhone(undefined)).toBe(DEFAULT_WHATSAPP_PHONE)
      expect(formatWhatsAppPhone()).toBe(DEFAULT_WHATSAPP_PHONE)
    })

    it('defaults to DEFAULT_WHATSAPP_PHONE when string has no digits', () => {
      expect(formatWhatsAppPhone('')).toBe(DEFAULT_WHATSAPP_PHONE)
      expect(formatWhatsAppPhone('   ')).toBe(DEFAULT_WHATSAPP_PHONE)
      expect(formatWhatsAppPhone('invalid-phone')).toBe(DEFAULT_WHATSAPP_PHONE)
    })

    it('keeps already clean digit string intact', () => {
      expect(formatWhatsAppPhone('97148793000')).toBe('97148793000')
      expect(formatWhatsAppPhone('447123456789')).toBe('447123456789')
    })
  })

  describe('buildWhatsAppPrefill', () => {
    describe('general inquiries', () => {
      it('returns English general message', () => {
        expect(buildWhatsAppPrefill({ type: 'general' })).toBe(
          'Hello Exvorta team, I would like to inquire about your institutional trade services.'
        )
        expect(buildWhatsAppPrefill({ type: 'general', lang: 'en' })).toBe(
          'Hello Exvorta team, I would like to inquire about your institutional trade services.'
        )
      })

      it('returns Arabic general message', () => {
        expect(buildWhatsAppPrefill({ type: 'general', lang: 'ar' })).toBe(
          'مرحباً فريق إكسفورتا، أود الاستفسار عن خدمات التداول المؤسسية.'
        )
      })
    })

    describe('service inquiries', () => {
      it('returns English service message with custom name and default fallback', () => {
        expect(buildWhatsAppPrefill({ type: 'service', name: 'Digital Export Platform' })).toBe(
          'Hello Exvorta team, I would like to inquire regarding your Digital Export Platform services.'
        )
        expect(buildWhatsAppPrefill({ type: 'service' })).toBe(
          'Hello Exvorta team, I would like to inquire regarding your trade services.'
        )
      })

      it('returns Arabic service message with custom name and default fallback', () => {
        expect(buildWhatsAppPrefill({ type: 'service', name: 'حوسبة التجارة', lang: 'ar' })).toBe(
          'مرحباً فريق إكسفورتا، أود الاستفسار بخصوص خدمات حوسبة التجارة.'
        )
        expect(buildWhatsAppPrefill({ type: 'service', lang: 'ar' })).toBe(
          'مرحباً فريق إكسفورتا، أود الاستفسار بخصوص خدمات التداول.'
        )
      })
    })

    describe('pricing inquiries', () => {
      it('returns English pricing message with custom tier and default fallback', () => {
        expect(buildWhatsAppPrefill({ type: 'pricing', tier: 'Enterprise' })).toBe(
          'Hello Exvorta team, I would like to discuss institutional pricing for the Enterprise tier.'
        )
        expect(buildWhatsAppPrefill({ type: 'pricing' })).toBe(
          'Hello Exvorta team, I would like to discuss institutional pricing for the Custom tier.'
        )
      })

      it('returns Arabic pricing message with custom tier and default fallback', () => {
        expect(buildWhatsAppPrefill({ type: 'pricing', tier: 'المؤسسية', lang: 'ar' })).toBe(
          'مرحباً فريق إكسفورتا، أود مناقشة التسعير المؤسسي لباقة المؤسسية.'
        )
        expect(buildWhatsAppPrefill({ type: 'pricing', lang: 'ar' })).toBe(
          'مرحباً فريق إكسفورتا، أود مناقشة التسعير المؤسسي لباقة المخصصة.'
        )
      })
    })

    describe('contact inquiries', () => {
      it('returns English contact message', () => {
        expect(buildWhatsAppPrefill({ type: 'contact' })).toBe(
          'Hello Exvorta Trade Desk, I would like to speak with a representative.'
        )
        expect(buildWhatsAppPrefill({ type: 'contact', lang: 'en' })).toBe(
          'Hello Exvorta Trade Desk, I would like to speak with a representative.'
        )
      })

      it('returns Arabic contact message', () => {
        expect(buildWhatsAppPrefill({ type: 'contact', lang: 'ar' })).toBe(
          'مرحباً بمكتب تداول إكسفورتا، أود التحدث مع ممثل تجاري.'
        )
      })
    })

    describe('custom inquiries', () => {
      it('returns ref string or empty string', () => {
        expect(buildWhatsAppPrefill({ type: 'custom', ref: 'Ref #12345' })).toBe('Ref #12345')
        expect(buildWhatsAppPrefill({ type: 'custom' })).toBe('')
      })
    })
  })

  describe('buildWhatsAppUrl', () => {
    it('returns deep link without query param when message is omitted', () => {
      expect(buildWhatsAppUrl()).toBe('https://wa.me/97148793000')
      expect(buildWhatsAppUrl({ phone: '+971 50 111 2222' })).toBe('https://wa.me/971501112222')
    })

    it('returns deep link without query param when message is whitespace or empty', () => {
      expect(buildWhatsAppUrl({ message: '' })).toBe('https://wa.me/97148793000')
      expect(buildWhatsAppUrl({ message: '   ' })).toBe('https://wa.me/97148793000')
    })

    it('encodes explicit message string', () => {
      const url = buildWhatsAppUrl({ message: 'Hello World & Friends!' })
      expect(url).toBe('https://wa.me/97148793000?text=Hello%20World%20%26%20Friends!')
    })

    it('encodes Arabic and unicode characters properly', () => {
      const arabicText = 'مرحباً بمكتب تداول إكسفورتا'
      const url = buildWhatsAppUrl({ message: arabicText })
      expect(url.startsWith('https://wa.me/97148793000?text=')).toBe(true)
      const encoded = url.slice('https://wa.me/97148793000?text='.length)
      expect(decodeURIComponent(encoded)).toBe(arabicText)
    })

    it('uses context prefill when message is not explicitly provided', () => {
      const url = buildWhatsAppUrl({
        phone: '97148793000',
        context: { type: 'pricing', tier: 'Enterprise' },
      })
      expect(url).toBe(
        'https://wa.me/97148793000?text=' +
          encodeURIComponent('Hello Exvorta team, I would like to discuss institutional pricing for the Enterprise tier.')
      )
    })

    it('prioritizes explicit message over context if both provided', () => {
      const url = buildWhatsAppUrl({
        message: 'Direct override message',
        context: { type: 'general' },
      })
      expect(url).toBe('https://wa.me/97148793000?text=' + encodeURIComponent('Direct override message'))
    })
  })
})
