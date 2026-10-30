import { describe, expect, it } from 'vitest'
import {
  calculateReadiness,
  CHECKLIST_ITEMS,
  CORRIDOR_METADATA,
  deserializeChecklistState,
  getChecklistItems,
  serializeChecklistState,
  validateAcidNumber,
  validateEgyptianTaxId,
  validateSaberCertificateNumber,
  type ChecklistContext,
  type ChecklistItem,
  type Corridor,
  type ItemStatus,
  type ProductRegulationStatus,
  type TransportMode,
} from './aci-saber'

describe('Regulatory Facts & Metadata', () => {
  it('validates CORRIDOR_METADATA for egypt_aci', () => {
    const meta = CORRIDOR_METADATA.egypt_aci
    expect(meta.id).toBe('egypt_aci')
    expect(meta.legalReference).toContain('Decree No. 38/2021')
    expect(meta.platform).toContain('Nafeza')
    expect(meta.platform).toContain('CargoX')
    expect(meta.platforms).toContain('Nafeza')
    expect(meta.platforms).toContain('CargoX')
    expect(meta.airMandateDate).toBe('2026-01-01')
    expect(meta.sourceDate).toBe('2026-10-27')
    expect(meta.name).toBeTruthy()
    expect(meta.nameAr).toBeTruthy()
    expect(meta.description).toBeTruthy()
    expect(meta.descriptionAr).toBeTruthy()
  })

  it('validates CORRIDOR_METADATA for ksa_saber', () => {
    const meta = CORRIDOR_METADATA.ksa_saber
    expect(meta.id).toBe('ksa_saber')
    expect(meta.legalReference).toContain('Royal Decree M/10')
    expect(meta.authority).toContain('SASO')
    expect(meta.authority).toContain('ZATCA')
    expect(meta.authorities.some((a) => a.includes('SASO'))).toBe(true)
    expect(meta.authorities.some((a) => a.includes('ZATCA'))).toBe(true)
    expect(meta.platform).toContain('FASAH')
    expect(meta.platforms).toContain('FASAH')
    expect(meta.platforms).toContain('SABER')
    expect(meta.sourceDate).toBe('2026-10-27')
    expect(meta.name).toBeTruthy()
    expect(meta.nameAr).toBeTruthy()
    expect(meta.description).toBeTruthy()
    expect(meta.descriptionAr).toBeTruthy()
  })

  it('validates every item in CHECKLIST_ITEMS has complete regulatory fields', () => {
    expect(CHECKLIST_ITEMS.length).toBeGreaterThan(0)

    for (const item of CHECKLIST_ITEMS) {
      expect(item.id.trim()).not.toBe('')
      expect(item.title.trim()).not.toBe('')
      expect(item.titleAr.trim()).not.toBe('')
      expect(item.description.trim()).not.toBe('')
      expect(item.descriptionAr.trim()).not.toBe('')
      expect(item.guidance.trim()).not.toBe('')
      expect(item.guidanceAr.trim()).not.toBe('')
      expect(item.consequenceOfNonCompliance.trim()).not.toBe('')
      expect(item.consequenceOfNonComplianceAr.trim()).not.toBe('')
      expect(item.sourceAuthority.trim()).not.toBe('')
      expect(item.legalReference.trim()).not.toBe('')
      expect(item.sourceDate).toBe('2026-10-27')
      expect(typeof item.appliesTo).toBe('function')
    }
  })

  it('verifies both corridors have items and mandatory items exist in each', () => {
    const egyptItems = CHECKLIST_ITEMS.filter((i) => i.corridor === 'egypt_aci')
    const ksaItems = CHECKLIST_ITEMS.filter((i) => i.corridor === 'ksa_saber')

    expect(egyptItems.length).toBeGreaterThan(0)
    expect(ksaItems.length).toBeGreaterThan(0)

    const egyptMandatory = egyptItems.filter((i) => i.isMandatory)
    const ksaMandatory = ksaItems.filter((i) => i.isMandatory)

    expect(egyptMandatory.length).toBeGreaterThan(0)
    expect(ksaMandatory.length).toBeGreaterThan(0)
  })
})

describe('Checklist Filtering (getChecklistItems)', () => {
  it('Egypt ACI sea vs air filtering', () => {
    const seaContext: ChecklistContext = { corridor: 'egypt_aci', mode: 'sea' }
    const seaItems = getChecklistItems(seaContext)
    const seaItemIds = seaItems.map((i) => i.id)

    expect(seaItemIds).toContain('eg_acid_sea_filing')
    expect(seaItemIds).toContain('eg_bill_of_lading')
    expect(seaItemIds).not.toContain('eg_acid_air_filing')
    expect(seaItemIds).not.toContain('eg_air_waybill')

    const airContext: ChecklistContext = { corridor: 'egypt_aci', mode: 'air' }
    const airItems = getChecklistItems(airContext)
    const airItemIds = airItems.map((i) => i.id)

    expect(airItemIds).toContain('eg_acid_air_filing')
    expect(airItemIds).toContain('eg_air_waybill')
    expect(airItemIds).not.toContain('eg_acid_sea_filing')
    expect(airItemIds).not.toContain('eg_bill_of_lading')
  })

  it('KSA SABER product regulation status filtering', () => {
    // When regulationStatus='regulated'
    const regContext: ChecklistContext = { corridor: 'ksa_saber', regulationStatus: 'regulated' }
    const regItems = getChecklistItems(regContext)
    const regIds = regItems.map((i) => i.id)

    expect(regIds).toContain('sa_pcoc_certificate')
    expect(regIds).toContain('sa_iso_test_report')
    expect(regIds).not.toContain('sa_sdoc_declaration')

    // When regulationStatus='non_regulated'
    const nonRegContext: ChecklistContext = {
      corridor: 'ksa_saber',
      regulationStatus: 'non_regulated',
    }
    const nonRegItems = getChecklistItems(nonRegContext)
    const nonRegIds = nonRegItems.map((i) => i.id)

    expect(nonRegIds).toContain('sa_sdoc_declaration')
    expect(nonRegIds).not.toContain('sa_pcoc_certificate')
    expect(nonRegIds).not.toContain('sa_iso_test_report')

    // When regulationStatus='exempt'
    const exemptContext: ChecklistContext = { corridor: 'ksa_saber', regulationStatus: 'exempt' }
    const exemptItems = getChecklistItems(exemptContext)
    const exemptIds = exemptItems.map((i) => i.id)

    expect(exemptIds).not.toContain('sa_pcoc_certificate')
    expect(exemptIds).not.toContain('sa_iso_test_report')
    expect(exemptIds).not.toContain('sa_sdoc_declaration')

    // SCoC is included across regulated, non_regulated, and exempt
    expect(regIds).toContain('sa_scoc_certificate')
    expect(nonRegIds).toContain('sa_scoc_certificate')
    expect(exemptIds).toContain('sa_scoc_certificate')
  })
})

describe('Readiness Calculation (calculateReadiness)', () => {
  it('returns 100% score and READY verdict for empty checklist', () => {
    const result = calculateReadiness([], {})
    expect(result.scorePct).toBe(100)
    expect(result.verdict).toBe('READY')
    expect(result.blockingItemIds).toEqual([])
    expect(result.totalMandatory).toBe(0)
    expect(result.readyCount).toBe(0)
    expect(result.pendingCount).toBe(0)
    expect(result.missingCount).toBe(0)
    expect(result.warnings).toEqual([])
    expect(result.warningsAr).toEqual([])
  })

  it('returns 100% score, READY verdict, and empty blockingItemIds when all items are ready', () => {
    const items = getChecklistItems({ corridor: 'egypt_aci', mode: 'sea' })
    const statusMap: Record<string, ItemStatus> = {}
    for (const item of items) {
      statusMap[item.id] = 'ready'
    }

    const result = calculateReadiness(items, statusMap)
    expect(result.scorePct).toBe(100)
    expect(result.verdict).toBe('READY')
    expect(result.readyCount).toBe(items.length)
    expect(result.missingCount).toBe(0)
    expect(result.pendingCount).toBe(0)
    expect(result.blockingItemIds).toEqual([])
  })

  it('returns verdict BLOCKED and identifies blocking IDs when mandatory items are missing', () => {
    const items = getChecklistItems({ corridor: 'egypt_aci', mode: 'sea' })
    const statusMap: Record<string, ItemStatus> = {}
    // Leave all items as missing (default)
    const result = calculateReadiness(items, statusMap)

    expect(result.verdict).toBe('BLOCKED')
    expect(result.blockingItemIds.length).toBeGreaterThan(0)
    expect(result.blockingItemIds).toContain('eg_acid_sea_filing')
    expect(result.scorePct).toBe(0)
    expect(result.warnings.some((w) => w.includes('cannot proceed'))).toBe(true)
    expect(result.warningsAr.some((w) => w.includes('لا يمكن شحن البضاعة'))).toBe(true)
  })

  it('returns verdict AT_RISK when non-mandatory items are missing or items are pending', () => {
    const items = getChecklistItems({ corridor: 'egypt_aci', mode: 'sea' })
    const statusMap: Record<string, ItemStatus> = {}
    for (const item of items) {
      statusMap[item.id] = 'ready'
    }

    // Set one item to pending
    const firstItemId = items[0].id
    statusMap[firstItemId] = 'pending'

    const pendingResult = calculateReadiness(items, statusMap)
    expect(pendingResult.verdict).toBe('AT_RISK')
    expect(pendingResult.blockingItemIds).toEqual([])
    expect(pendingResult.pendingCount).toBe(1)
    expect(pendingResult.warnings.some((w) => w.includes('at risk'))).toBe(true)

    // Test with a synthetic non-mandatory item that is missing
    const mockNonMandatoryItem: ChecklistItem = {
      id: 'mock_optional_item',
      corridor: 'egypt_aci',
      title: 'Optional Item',
      titleAr: 'عنصر اختياري',
      description: 'Optional Description',
      descriptionAr: 'وصف اختياري',
      category: 'commercial_docs',
      sourceAuthority: 'Customs',
      sourceDate: '2026-10-27',
      legalReference: 'Ref',
      isMandatory: false,
      appliesTo: () => true,
      guidance: 'Guidance',
      guidanceAr: 'إرشاد',
      consequenceOfNonCompliance: 'None',
      consequenceOfNonComplianceAr: 'لا يوجد',
    }

    const mixedItems = [...items, mockNonMandatoryItem]
    const allMandatoryReadyMap: Record<string, ItemStatus> = {}
    for (const item of items) {
      allMandatoryReadyMap[item.id] = 'ready'
    }
    allMandatoryReadyMap[mockNonMandatoryItem.id] = 'missing'

    const nonMandatoryMissingResult = calculateReadiness(mixedItems, allMandatoryReadyMap)
    expect(nonMandatoryMissingResult.verdict).toBe('AT_RISK')
    expect(nonMandatoryMissingResult.blockingItemIds).toEqual([])
    expect(nonMandatoryMissingResult.missingCount).toBe(1)
  })

  it('correctly populates English and Arabic warnings', () => {
    // 1. Egypt ACI provisional warning & Sea 48h warning
    const seaItems = getChecklistItems({ corridor: 'egypt_aci', mode: 'sea' })
    const seaResult = calculateReadiness(seaItems, {})

    expect(seaResult.warnings.some((w) => w.includes('19-digit ACID number syntax is provisional'))).toBe(true)
    expect(seaResult.warningsAr.some((w) => w.includes('صيغة رقم ACID المكون من 19 رقماً هي مواصفة مؤقتة'))).toBe(true)
    expect(seaResult.warnings.some((w) => w.includes('at least 48 hours prior to vessel departure'))).toBe(true)
    expect(seaResult.warningsAr.some((w) => w.includes('قبل 48 ساعة على الأقل من إبحار السفينة'))).toBe(true)

    // 2. Egypt ACI Air freight >= 4h warning
    const airItems = getChecklistItems({ corridor: 'egypt_aci', mode: 'air' })
    const airResult = calculateReadiness(airItems, {})

    expect(airResult.warnings.some((w) => w.includes('>= 4h before departure'))).toBe(true)
    expect(airResult.warningsAr.some((w) => w.includes('قبل 4 ساعات على الأقل من الإقلاع'))).toBe(true)

    // 3. KSA SABER SCoC mandatory warning & Regulated product warning
    const ksaRegItems = getChecklistItems({ corridor: 'ksa_saber', regulationStatus: 'regulated' })
    const ksaRegResult = calculateReadiness(ksaRegRegItemsCheck(ksaRegItems), {})

    expect(ksaRegResult.warnings.some((w) => w.includes('Shipment Certificate (SCoC) is strictly mandatory'))).toBe(true)
    expect(ksaRegResult.warningsAr.some((w) => w.includes('شهادة مطابقة الإرسالية (SCoC) إلزامية تماماً'))).toBe(true)
    expect(ksaRegResult.warnings.some((w) => w.includes('ISO/IEC 17025 accredited test report and a CAB-issued Product Certificate (PCoC)'))).toBe(true)
    expect(ksaRegResult.warningsAr.some((w) => w.includes('تقرير اختبار معتمد وفق ISO/IEC 17025 وشهادة مطابقة منتج (PCoC)'))).toBe(true)

    // 4. KSA SABER Non-regulated SDoC warning
    const ksaNonRegItems = getChecklistItems({
      corridor: 'ksa_saber',
      regulationStatus: 'non_regulated',
    })
    const ksaNonRegResult = calculateReadiness(ksaNonRegItems, {})

    expect(ksaNonRegResult.warnings.some((w) => w.includes('Self-Declaration of Conformity (SDoC)'))).toBe(true)
    expect(ksaNonRegResult.warningsAr.some((w) => w.includes('إقرار مطابقة ذاتي إلكتروني (SDoC)'))).toBe(true)
  })
})

function ksaRegRegItemsCheck(items: ChecklistItem[]): ChecklistItem[] {
  return items
}

describe('Validation Helpers', () => {
  describe('validateAcidNumber', () => {
    it('accepts valid 19-digit numeric strings', () => {
      const validPlain = '1234567890123456789'
      const res1 = validateAcidNumber(validPlain)
      expect(res1.isValid).toBe(true)
      expect(res1.normalized).toBe('1234567890123456789')
      expect(res1.isProvisional).toBe(true)
      expect(res1.error).toBeUndefined()

      const withDashes = '1234-5678-9012-3456-789'
      const res2 = validateAcidNumber(withDashes)
      expect(res2.isValid).toBe(true)
      expect(res2.normalized).toBe('1234567890123456789')
      expect(res2.isProvisional).toBe(true)

      const withSpaces = ' 1234 5678 9012 3456 789 '
      const res3 = validateAcidNumber(withSpaces)
      expect(res3.isValid).toBe(true)
      expect(res3.normalized).toBe('1234567890123456789')
      expect(res3.isProvisional).toBe(true)
    })

    it('rejects empty inputs with isProvisional true and clear error messages', () => {
      const res = validateAcidNumber('')
      expect(res.isValid).toBe(false)
      expect(res.isProvisional).toBe(true)
      expect(res.error).toBe('ACID number is required.')
      expect(res.errorAr).toBe('رقم التسجيل المسبق للشحنات (ACID) مطلوب.')
    })

    it('rejects non-numeric characters', () => {
      const res = validateAcidNumber('123456789012345678A')
      expect(res.isValid).toBe(false)
      expect(res.isProvisional).toBe(true)
      expect(res.error).toBe('ACID number must contain only numeric digits.')
      expect(res.errorAr).toBe('يجب أن يتكون رقم ACID من أرقام فقط.')
    })

    it('rejects strings shorter than 19 digits', () => {
      const res = validateAcidNumber('123456789012345678')
      expect(res.isValid).toBe(false)
      expect(res.isProvisional).toBe(true)
      expect(res.error).toBe(
        'ACID number must be exactly 19 digits (provisional forwarder specification).'
      )
      expect(res.errorAr).toBe(
        'يجب أن يتكون رقم ACID من 19 رقماً بالضبط (مواصفة مؤقتة قيد اعتماد المخلص الجمركي).'
      )
    })

    it('rejects strings longer than 19 digits', () => {
      const res = validateAcidNumber('12345678901234567890')
      expect(res.isValid).toBe(false)
      expect(res.isProvisional).toBe(true)
      expect(res.error).toBe(
        'ACID number must be exactly 19 digits (provisional forwarder specification).'
      )
    })
  })

  describe('validateEgyptianTaxId', () => {
    it('accepts exactly 9 digits', () => {
      const res1 = validateEgyptianTaxId('123456789')
      expect(res1.isValid).toBe(true)
      expect(res1.normalized).toBe('123456789')
      expect(res1.error).toBeUndefined()

      const res2 = validateEgyptianTaxId('123-456-789')
      expect(res2.isValid).toBe(true)
      expect(res2.normalized).toBe('123456789')

      const res3 = validateEgyptianTaxId(' 123 456 789 ')
      expect(res3.isValid).toBe(true)
      expect(res3.normalized).toBe('123456789')
    })

    it('rejects empty input', () => {
      const res = validateEgyptianTaxId('')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('Egyptian Tax ID is required.')
      expect(res.errorAr).toBe('رقم البطاقة الضريبية المصرية مطلوب.')
    })

    it('rejects non-numeric characters', () => {
      const res = validateEgyptianTaxId('12345678A')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('Egyptian Tax ID must contain only numeric digits.')
      expect(res.errorAr).toBe('يجب أن يحتوي الرقم الضريبي المصري على أرقام فقط.')
    })

    it('rejects wrong length (less than 9 digits)', () => {
      const res = validateEgyptianTaxId('12345678')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('Egyptian Tax ID must be exactly 9 digits.')
      expect(res.errorAr).toBe(
        'يجب أن يتكون الرقم الضريبي المصري من 9 أرقام بالضبط (رقم البطاقة الضريبية).'
      )
    })

    it('rejects wrong length (more than 9 digits)', () => {
      const res = validateEgyptianTaxId('1234567890')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('Egyptian Tax ID must be exactly 9 digits.')
    })
  })

  describe('validateSaberCertificateNumber', () => {
    it('accepts alphanumeric references with hyphens, underscores, slashes (length 6-35)', () => {
      const validCases = [
        'SASO-2026-001',
        'PC_12345/A',
        'SCoC-998877-KSA',
        'ABC123',
        '12345678901234567890123456789012345',
      ]
      for (const val of validCases) {
        const res = validateSaberCertificateNumber(val)
        expect(res.isValid).toBe(true)
        expect(res.normalized).toBe(val)
        expect(res.error).toBeUndefined()
      }
    })

    it('rejects empty input', () => {
      const res = validateSaberCertificateNumber('   ')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('SABER certificate number is required.')
      expect(res.errorAr).toBe('رقم شهادة سابر مطلوب.')
    })

    it('rejects spaces inside the certificate code', () => {
      const res = validateSaberCertificateNumber('SASO 12345')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe(
        'SABER certificate number must contain only letters, numbers, hyphens, and slashes.'
      )
      expect(res.errorAr).toBe(
        'يجب أن يحتوي رقم شهادة سابر على حروف أو أرقام أو فواصل فقط دون مسافات أو رموز خاصة.'
      )
    })

    it('rejects invalid special characters', () => {
      const res1 = validateSaberCertificateNumber('SASO@123')
      expect(res1.isValid).toBe(false)
      expect(res1.error).toBe(
        'SABER certificate number must contain only letters, numbers, hyphens, and slashes.'
      )

      const res2 = validateSaberCertificateNumber('SASO#12345')
      expect(res2.isValid).toBe(false)
    })

    it('rejects length shorter than 6 characters', () => {
      const res = validateSaberCertificateNumber('ABC12')
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('SABER certificate number must be between 6 and 35 characters.')
      expect(res.errorAr).toBe('يجب أن يتراوح طول رقم شهادة سابر بين 6 و35 حرفاً.')
    })

    it('rejects length longer than 35 characters', () => {
      const res = validateSaberCertificateNumber('A'.repeat(36))
      expect(res.isValid).toBe(false)
      expect(res.error).toBe('SABER certificate number must be between 6 and 35 characters.')
    })
  })
})

describe('URL State Serialization & Deserialization', () => {
  it('serializes corridor, mode, regulationStatus, statusMap to query string', () => {
    const state: {
      corridor: Corridor
      mode?: TransportMode
      regulationStatus?: ProductRegulationStatus
      statusMap: Record<string, ItemStatus>
    } = {
      corridor: 'ksa_saber',
      mode: 'sea',
      regulationStatus: 'regulated',
      statusMap: {
        sa_importer_saber_reg: 'ready',
        sa_pcoc_certificate: 'pending',
      },
    }

    const qs = serializeChecklistState(state)
    const params = new URLSearchParams(qs)

    expect(params.get('corridor')).toBe('ksa_saber')
    expect(params.get('mode')).toBe('sea')
    expect(params.get('regulationStatus')).toBe('regulated')
    expect(JSON.parse(params.get('statusMap') ?? '{}')).toEqual({
      sa_importer_saber_reg: 'ready',
      sa_pcoc_certificate: 'pending',
    })
  })

  it('deserializes query string back to exact object', () => {
    const original = {
      corridor: 'egypt_aci' as Corridor,
      mode: 'air' as TransportMode,
      regulationStatus: 'non_regulated' as ProductRegulationStatus,
      statusMap: {
        eg_importer_nafeza_reg: 'ready' as ItemStatus,
        eg_acid_air_filing: 'missing' as ItemStatus,
      },
    }

    const qs = serializeChecklistState(original)
    const parsed = deserializeChecklistState(qs)

    expect(parsed).toEqual(original)

    // With leading question mark
    const parsedWithQ = deserializeChecklistState(`?${qs}`)
    expect(parsedWithQ).toEqual(original)
  })

  it('safely handles malformed strings, invalid JSON in statusMap, and missing params', () => {
    // Empty query string
    expect(deserializeChecklistState('')).toEqual({
      corridor: 'egypt_aci',
      statusMap: {},
    })

    // Missing params falls back to sensible defaults
    expect(deserializeChecklistState('corridor=ksa_saber')).toEqual({
      corridor: 'ksa_saber',
      statusMap: {},
    })

    // Invalid corridor falls back to egypt_aci
    expect(deserializeChecklistState('corridor=unknown_corridor')).toEqual({
      corridor: 'egypt_aci',
      statusMap: {},
    })

    // Invalid mode and regulationStatus are ignored (undefined)
    expect(
      deserializeChecklistState('corridor=ksa_saber&mode=rocket&regulationStatus=super_regulated')
    ).toEqual({
      corridor: 'ksa_saber',
      statusMap: {},
    })

    // Invalid JSON in statusMap falls back to empty statusMap
    expect(deserializeChecklistState('statusMap={not-json}')).toEqual({
      corridor: 'egypt_aci',
      statusMap: {},
    })

    // Non-object JSON in statusMap falls back to empty statusMap
    expect(deserializeChecklistState('statusMap=["ready"]')).toEqual({
      corridor: 'egypt_aci',
      statusMap: {},
    })

    // Invalid status values in statusMap are omitted, preserving valid entries
    const mixedStatus = encodeURIComponent(
      JSON.stringify({
        valid_item_1: 'ready',
        invalid_item_2: 'invalid_status',
        valid_item_3: 'pending',
      })
    )
    const result = deserializeChecklistState(`statusMap=${mixedStatus}`)
    expect(result.statusMap).toEqual({
      valid_item_1: 'ready',
      valid_item_3: 'pending',
    })
  })

  it('provides readinessScore and missingMandatoryItems in ReadinessResult', () => {
    const items = getChecklistItems({ corridor: 'egypt_aci', mode: 'sea' })
    const res = calculateReadiness(items, {})
    expect(res.readinessScore).toBe(res.scorePct)
    expect(res.missingMandatoryItems).toEqual(res.blockingItemIds)
  })
})
