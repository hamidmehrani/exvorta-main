import { describe, expect, it } from 'vitest'
import {
  calculateCbm,
  calculateChargeableWeight,
  calculateVolumetricWeight,
  CONTAINER_SPECS,
  deserializeToolState,
  estimateContainerFit,
  getIncoterm,
  INCOTERMS,
  IncotermCode,
  listIncoterms,
  serializeToolState,
  VOLUMETRIC_RATIOS,
} from './incoterm-cbm'

describe('Incoterms 2020 Responsibility Matrix', () => {
  const ALL_CODES: IncotermCode[] = [
    'EXW',
    'FCA',
    'CPT',
    'CIP',
    'DAP',
    'DPU',
    'DDP',
    'FAS',
    'FOB',
    'CFR',
    'CIF',
  ]

  const REQUIRED_STAGES = [
    'exportPackaging',
    'loadingOrigin',
    'exportClearance',
    'originTerminalCharges',
    'mainCarriage',
    'cargoInsurance',
    'destinationTerminalCharges',
    'importClearance',
    'importDutiesAndTaxes',
    'unloadingDestination',
  ] as const

  it('defines all 11 standard Incoterms 2020', () => {
    const list = listIncoterms()
    expect(list).toHaveLength(11)
    const codes = list.map(item => item.code)
    for (const code of ALL_CODES) {
      expect(codes).toContain(code)
    }
  })

  it('has complete responsibility matrices for every Incoterm', () => {
    for (const code of ALL_CODES) {
      const term = INCOTERMS[code]
      expect(term).toBeDefined()
      expect(term.name).toBeTruthy()
      expect(term.description).toBeTruthy()
      expect(['multimodal', 'sea_inland_waterway']).toContain(term.category)

      for (const stage of REQUIRED_STAGES) {
        const party = term.responsibilities[stage]
        expect(['seller', 'buyer', 'negotiable']).toContain(party)
      }
    }
  })

  it('correctly categorizes multimodal vs sea/inland waterway rules', () => {
    const multimodalCodes: IncotermCode[] = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP']
    const seaCodes: IncotermCode[] = ['FAS', 'FOB', 'CFR', 'CIF']

    for (const code of multimodalCodes) {
      expect(INCOTERMS[code].category).toBe('multimodal')
    }
    for (const code of seaCodes) {
      expect(INCOTERMS[code].category).toBe('sea_inland_waterway')
    }
  })

  it('reflects key distinctive Incoterm 2020 legal obligations', () => {
    // DPU is the only term where seller unloads at destination
    expect(INCOTERMS.DPU.responsibilities.unloadingDestination).toBe('seller')
    expect(INCOTERMS.DAP.responsibilities.unloadingDestination).toBe('buyer')
    expect(INCOTERMS.DDP.responsibilities.unloadingDestination).toBe('buyer')

    // DDP is the only term where seller pays import clearance, duties and taxes
    expect(INCOTERMS.DDP.responsibilities.importClearance).toBe('seller')
    expect(INCOTERMS.DDP.responsibilities.importDutiesAndTaxes).toBe('seller')
    expect(INCOTERMS.DAP.responsibilities.importClearance).toBe('buyer')

    // EXW has minimal seller obligation (buyer clears export)
    expect(INCOTERMS.EXW.responsibilities.exportClearance).toBe('buyer')
    expect(INCOTERMS.EXW.responsibilities.loadingOrigin).toBe('buyer')

    // CIF and CIP mandate seller cargo insurance
    expect(INCOTERMS.CIF.responsibilities.cargoInsurance).toBe('seller')
    expect(INCOTERMS.CIP.responsibilities.cargoInsurance).toBe('seller')
    expect(INCOTERMS.FOB.responsibilities.cargoInsurance).toBe('buyer')
    expect(INCOTERMS.CFR.responsibilities.cargoInsurance).toBe('buyer')
  })

  it('getIncoterm handles case-insensitive lookup and trims whitespace', () => {
    expect(getIncoterm('fob')?.code).toBe('FOB')
    expect(getIncoterm('  cif  ')?.code).toBe('CIF')
    expect(getIncoterm('EXW')?.name).toBe('Ex Works')
    expect(getIncoterm('unknown')).toBeUndefined()
    expect(getIncoterm('')).toBeUndefined()
  })
})

describe('CBM Calculation Engine', () => {
  it('calculates volume in cm accurately', () => {
    // 1 box of 100 x 100 x 100 cm = 1.0 CBM
    const result = calculateCbm([
      { pieces: 1, length: 100, width: 100, height: 100, unit: 'cm', weightKg: 50 },
    ])
    expect(result.totalPieces).toBe(1)
    expect(result.totalCbm).toBe(1.0)
    expect(result.totalWeightKg).toBe(50)
    expect(result.breakdown[0].unitCbm).toBe(1.0)
    expect(result.breakdown[0].totalCbm).toBe(1.0)
  })

  it('multiplies by pieces correctly in cm', () => {
    // 10 boxes of 50 x 40 x 30 cm = (60,000 / 1,000,000) * 10 = 0.6 CBM
    const result = calculateCbm([
      { pieces: 10, length: 50, width: 40, height: 30, unit: 'cm', weightKg: 15 },
    ])
    expect(result.totalPieces).toBe(10)
    expect(result.totalCbm).toBe(0.6)
    expect(result.totalWeightKg).toBe(150)
    expect(result.breakdown[0].totalWeightKg).toBe(150)
  })

  it('calculates volume in inches with precise meter conversion', () => {
    // 1 box of 20 x 20 x 20 inches:
    // (20 * 0.0254)^3 = 0.508^3 = 0.131096512 CBM -> 0.131 CBM
    const result = calculateCbm([
      { pieces: 1, length: 20, width: 20, height: 20, unit: 'in', weightKg: 10 },
    ])
    expect(result.totalPieces).toBe(1)
    expect(result.totalCbm).toBe(0.131)
  })

  it('handles multi-item lists combining cm and in', () => {
    const items = [
      { id: 'box-a', pieces: 5, length: 60, width: 40, height: 40, unit: 'cm' as const, weightKg: 20 },
      { id: 'box-b', pieces: 2, length: 24, width: 24, height: 24, unit: 'in' as const, weightKg: 30 },
    ]
    // box-a: 60*40*40/1e6 = 0.096 CBM each * 5 = 0.48 CBM, 100 kg
    // box-b: (24*0.0254)^3 = 0.22653... CBM each * 2 = 0.4530... CBM -> 0.453 CBM, 60 kg
    // total CBM = 0.48 + 0.45307 = 0.933 CBM, total weight = 160 kg
    const result = calculateCbm(items)
    expect(result.totalPieces).toBe(7)
    expect(result.totalCbm).toBe(0.933)
    expect(result.totalWeightKg).toBe(160)
    expect(result.breakdown).toHaveLength(2)
    expect(result.breakdown[0].id).toBe('box-a')
    expect(result.breakdown[1].id).toBe('box-b')
  })

  it('handles empty lists and missing weight gracefully', () => {
    const emptyResult = calculateCbm([])
    expect(emptyResult.totalPieces).toBe(0)
    expect(emptyResult.totalCbm).toBe(0)
    expect(emptyResult.totalWeightKg).toBe(0)
    expect(emptyResult.breakdown).toEqual([])

    const noWeightResult = calculateCbm([
      { pieces: 2, length: 50, width: 50, height: 50, unit: 'cm' },
    ])
    expect(noWeightResult.totalWeightKg).toBe(0)
    expect(noWeightResult.breakdown[0].totalWeightKg).toBeUndefined()
  })
})

describe('Volumetric and Chargeable Weight Calculations', () => {
  it('verifies standard cargo ratios', () => {
    expect(VOLUMETRIC_RATIOS.air).toBe(167)
    expect(VOLUMETRIC_RATIOS.sea).toBe(1000)
    expect(VOLUMETRIC_RATIOS.courier).toBe(200)
  })

  it('calculates volumetric weight across air, sea, and courier', () => {
    const cbm = 2.5
    expect(calculateVolumetricWeight(cbm, 'air')).toBe(417.5) // 2.5 * 167
    expect(calculateVolumetricWeight(cbm, 'sea')).toBe(2500)   // 2.5 * 1000
    expect(calculateVolumetricWeight(cbm, 'courier')).toBe(500) // 2.5 * 200
  })

  it('selects chargeable weight basis correctly when actual weight is heavier', () => {
    // Sea freight: actual 3,000 kg, CBM = 2 (volumetric = 2,000 kg)
    const res = calculateChargeableWeight(3000, 2, 'sea')
    expect(res.actualWeightKg).toBe(3000)
    expect(res.volumetricWeightKg).toBe(2000)
    expect(res.chargeableWeightKg).toBe(3000)
    expect(res.chargeableBasis).toBe('actual')
  })

  it('selects chargeable weight basis correctly when volumetric weight is heavier', () => {
    // Air freight: actual 100 kg, CBM = 1 (volumetric = 167 kg)
    const res = calculateChargeableWeight(100, 1, 'air')
    expect(res.actualWeightKg).toBe(100)
    expect(res.volumetricWeightKg).toBe(167)
    expect(res.chargeableWeightKg).toBe(167)
    expect(res.chargeableBasis).toBe('volumetric')
  })

  it('handles courier mode when actual and volumetric are equal', () => {
    // Courier: actual 200 kg, CBM = 1 (volumetric = 200 kg)
    const res = calculateChargeableWeight(200, 1, 'courier')
    expect(res.chargeableWeightKg).toBe(200)
    expect(res.chargeableBasis).toBe('actual')
  })
})

describe('Container-Fit Estimator', () => {
  it('exposes standard container specs with usable CBM and max payload limits', () => {
    expect(CONTAINER_SPECS['20ft'].usableCbm).toBe(28.0)
    expect(CONTAINER_SPECS['20ft'].maxPayloadKg).toBe(25000)
    expect(CONTAINER_SPECS['40ft'].usableCbm).toBe(58.0)
    expect(CONTAINER_SPECS['40ft'].maxPayloadKg).toBe(26500)
    expect(CONTAINER_SPECS['40hc'].usableCbm).toBe(68.0)
    expect(CONTAINER_SPECS['40hc'].maxPayloadKg).toBe(26500)
  })

  it('recommends LCL as primary suggestion when volume < 15 CBM', () => {
    const smallFit = estimateContainerFit(8.5, 1200)
    expect(smallFit.isLclRecommended).toBe(true)
    expect(smallFit.primarySuggestion).toContain('LCL')
  })

  it('does not recommend LCL when volume >= 15 CBM', () => {
    const fclFit = estimateContainerFit(15.0)
    expect(fclFit.isLclRecommended).toBe(false)
    expect(fclFit.primarySuggestion).not.toContain('LCL')
  })

  it('selects optimal single container match for 20ft', () => {
    const fit = estimateContainerFit(20)
    expect(fit.isLclRecommended).toBe(false)
    expect(fit.containers['20ft']).toBe(1)
    expect(fit.containers['40ft']).toBe(0)
    expect(fit.containers['40hc']).toBe(0)
    expect(fit.optimalCombination.summary).toContain("20' Standard")
  })

  it('selects optimal single container match for 40ft', () => {
    const fit = estimateContainerFit(45)
    expect(fit.isLclRecommended).toBe(false)
    expect(fit.containers['40ft']).toBe(1)
    expect(fit.containers['20ft']).toBe(0)
    expect(fit.containers['40hc']).toBe(0)
    expect(fit.optimalCombination.summary).toContain("40' Standard")
  })

  it('selects optimal single container match for 40hc', () => {
    const fit = estimateContainerFit(65)
    expect(fit.isLclRecommended).toBe(false)
    expect(fit.containers['40hc']).toBe(1)
    expect(fit.containers['20ft']).toBe(0)
    expect(fit.containers['40ft']).toBe(0)
    expect(fit.optimalCombination.summary).toContain("40' High Cube")
  })

  it('calculates space utilization percentage accurately for each container size', () => {
    const fit = estimateContainerFit(14)
    // 14 / 28.0 = 50.0%
    expect(fit.utilization['20ft'].spaceUtilizationPct).toBe(50.0)
    // 14 / 58.0 = 24.1%
    expect(fit.utilization['40ft'].spaceUtilizationPct).toBe(24.1)
    // 14 / 68.0 = 20.6%
    expect(fit.utilization['40hc'].spaceUtilizationPct).toBe(20.6)
  })

  it('handles multiple container overflow for large cargo volume', () => {
    // 80 CBM: 1x 40' High Cube (68 CBM) + 1x 20' Standard (28 CBM) = 96 CBM capacity
    const fit = estimateContainerFit(80)
    expect(fit.containers['40hc']).toBe(1)
    expect(fit.containers['20ft']).toBe(1)
    expect(fit.optimalCombination.totalContainers).toBe(2)
    expect(fit.optimalCombination.summary).toBe("1x 40' High Cube + 1x 20' Standard")
  })

  it('adjusts container count when payload weight exceeds single container max', () => {
    // 20 CBM fits in 1x 20ft by volume, but 60,000 kg exceeds 25,000 kg limit
    const fit = estimateContainerFit(20, 60000)
    expect(fit.optimalCombination.totalContainers).toBeGreaterThanOrEqual(2)
    expect(fit.utilization['20ft'].fitsWeight).toBe(false)
  })
})

describe('URL Query Params Serialization & Deserialization', () => {
  it('serializes and deserializes tool state in full roundtrip', () => {
    const originalState = {
      incoterm: 'FOB' as const,
      transportMode: 'air' as const,
      items: [
        { id: 'item-1', pieces: 5, length: 50, width: 40, height: 30, unit: 'cm' as const, weightKg: 10 },
        { id: 'item-2', pieces: 2, length: 20, width: 20, height: 20, unit: 'in' as const },
      ],
    }

    const query = serializeToolState(originalState)
    expect(query).toContain('incoterm=FOB')
    expect(query).toContain('mode=air')
    expect(query).toContain('items=')

    const deserialized = deserializeToolState(query)
    expect(deserialized.incoterm).toBe('FOB')
    expect(deserialized.transportMode).toBe('air')
    expect(deserialized.items).toHaveLength(2)
    expect(deserialized.items[0].pieces).toBe(5)
    expect(deserialized.items[0].length).toBe(50)
    expect(deserialized.items[1].unit).toBe('in')
  })

  it('deserializes query string with leading question mark or URLSearchParams instance', () => {
    const qs = '?incoterm=CIF&mode=sea'
    const fromString = deserializeToolState(qs)
    expect(fromString.incoterm).toBe('CIF')
    expect(fromString.transportMode).toBe('sea')

    const fromParams = deserializeToolState(new URLSearchParams('incoterm=DDP&mode=courier'))
    expect(fromParams.incoterm).toBe('DDP')
    expect(fromParams.transportMode).toBe('courier')
  })

  it('is resilient against malformed or missing parameters', () => {
    expect(deserializeToolState('')).toEqual({ items: [] })
    expect(deserializeToolState(null)).toEqual({ items: [] })
    expect(deserializeToolState(undefined)).toEqual({ items: [] })

    // Malformed items JSON
    const malformed = deserializeToolState('?items={not_json}&incoterm=xyz&mode=invalid')
    expect(malformed.items).toEqual([])
    expect(malformed.incoterm).toBe('XYZ')
    expect(malformed.transportMode).toBeUndefined()
  })

  it('filters out invalid items within items JSON', () => {
    const jsonItems = JSON.stringify([
      { pieces: 3, length: 10, width: 10, height: 10, unit: 'cm' },
      { invalid: 'garbage' }, // missing pieces, length, width, height -> NaN
      null,
    ])
    const res = deserializeToolState(`?items=${encodeURIComponent(jsonItems)}`)
    expect(res.items).toHaveLength(1)
    expect(res.items[0].pieces).toBe(3)
  })
})
