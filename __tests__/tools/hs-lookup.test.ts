import { describe, it, expect, vi } from 'vitest'
import { generateMetadata as generateMetadataEn } from '@/app/(frontend)/tools/hs-lookup/page'
import { generateMetadata as generateMetadataAr } from '@/app/(frontend)/tools/hs-lookup/ar/page'
import { STATIC_ROUTES } from '@/app/sitemap'

vi.mock('@/lib/payload-cache', () => ({
  getCachedSeoDefaults: vi.fn().mockResolvedValue(null),
  getCachedSitemapCollection: vi.fn().mockResolvedValue([]),
  getCachedRedirects: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn().mockResolvedValue({}),
}))

describe('HS Code Lookup Pages & Routing Contract', () => {
  it('generates correct metadata and alternates for English page', async () => {
    const meta = await generateMetadataEn()

    const titleStr = typeof meta.title === 'string'
      ? meta.title
      : ((meta.title as Record<string, string>)?.absolute || '')
    expect(titleStr).toContain('GCC HS 8→12-Digit Converter & Duty Lookup')
    expect(meta.description).toContain('Free customs tariff calculator converting 8-digit GCC codes')
    expect(meta.alternates?.canonical).toBe('/tools/hs-lookup')
    expect(meta.alternates?.languages?.en).toBe('/tools/hs-lookup')
    expect(meta.alternates?.languages?.ar).toBe('/tools/hs-lookup/ar')
    expect(meta.alternates?.languages?.['x-default']).toBe('/tools/hs-lookup')
  })

  it('generates correct metadata and alternates for Arabic mirror page', async () => {
    const meta = await generateMetadataAr()

    const titleStr = typeof meta.title === 'string'
      ? meta.title
      : ((meta.title as Record<string, string>)?.absolute || '')
    expect(titleStr).toContain('محول بنود النظام المنسق الخليجي (8 إلى 12 رقماً) وحاسبة الرسوم الجمركية')
    expect(meta.description).toContain('أداة مجانية لتحويل رموز النظام المنسق الموحدة')
    expect(meta.alternates?.canonical).toBe('/tools/hs-lookup/ar')
    expect(meta.alternates?.languages?.en).toBe('/tools/hs-lookup')
    expect(meta.alternates?.languages?.ar).toBe('/tools/hs-lookup/ar')
    expect(meta.alternates?.languages?.['x-default']).toBe('/tools/hs-lookup')
  })

  it('registers /tools/hs-lookup and /tools/hs-lookup/ar in STATIC_ROUTES sitemap', () => {
    const paths = STATIC_ROUTES.map((r) => r.path)
    expect(paths).toContain('/tools/hs-lookup')
    expect(paths).toContain('/tools/hs-lookup/ar')
  })
})
