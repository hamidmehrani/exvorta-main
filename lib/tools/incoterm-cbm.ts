/**
 * Incoterms 2020 & CBM Calculation Engine
 *
 * 100% Pure TypeScript: zero React imports, zero DOM references,
 * zero network calls, zero side effects. Deterministic pure functions only.
 */

// ---------------------------------------------------------------------------
// 1. Incoterms 2020 Responsibility Matrix
// ---------------------------------------------------------------------------

export type IncotermCode =
  | 'EXW'
  | 'FCA'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DPU'
  | 'DDP'
  | 'FAS'
  | 'FOB'
  | 'CFR'
  | 'CIF'

export type TransportCategory = 'multimodal' | 'sea_inland_waterway'

export type Party = 'seller' | 'buyer' | 'negotiable'

export interface IncotermResponsibilities {
  exportPackaging: Party
  loadingOrigin: Party
  exportClearance: Party
  originTerminalCharges: Party
  mainCarriage: Party
  cargoInsurance: Party
  destinationTerminalCharges: Party
  importClearance: Party
  importDutiesAndTaxes: Party
  unloadingDestination: Party
}

export interface IncotermDefinition {
  code: IncotermCode
  name: string
  category: TransportCategory
  description: string
  responsibilities: IncotermResponsibilities
}

export const INCOTERMS: Record<IncotermCode, IncotermDefinition> = {
  EXW: {
    code: 'EXW',
    name: 'Ex Works',
    category: 'multimodal',
    description: 'Seller makes goods available at their premises. Buyer assumes all risk and costs from origin to destination.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'buyer',
      exportClearance: 'buyer',
      originTerminalCharges: 'buyer',
      mainCarriage: 'buyer',
      cargoInsurance: 'buyer',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  FCA: {
    code: 'FCA',
    name: 'Free Carrier',
    category: 'multimodal',
    description: 'Seller delivers goods cleared for export to the carrier nominated by buyer at named place.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'buyer',
      mainCarriage: 'buyer',
      cargoInsurance: 'buyer',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  CPT: {
    code: 'CPT',
    name: 'Carriage Paid To',
    category: 'multimodal',
    description: 'Seller pays freight to destination. Risk transfers to buyer when handed to first carrier.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'buyer',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  CIP: {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    category: 'multimodal',
    description: 'Seller pays freight and maximum cargo insurance (Institute Cargo Clauses A) to destination.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'seller',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  DAP: {
    code: 'DAP',
    name: 'Delivered At Place',
    category: 'multimodal',
    description: 'Seller delivers goods ready for unloading at named destination. Buyer handles import clearance and taxes.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'seller',
      destinationTerminalCharges: 'seller',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  DPU: {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    category: 'multimodal',
    description: 'Seller delivers and unloads goods at destination. Only Incoterm requiring seller to unload.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'seller',
      destinationTerminalCharges: 'seller',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'seller',
    },
  },
  DDP: {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    category: 'multimodal',
    description: 'Seller delivers goods cleared for import with duties and taxes paid. Maximum seller obligation.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'seller',
      destinationTerminalCharges: 'seller',
      importClearance: 'seller',
      importDutiesAndTaxes: 'seller',
      unloadingDestination: 'buyer',
    },
  },
  FAS: {
    code: 'FAS',
    name: 'Free Alongside Ship',
    category: 'sea_inland_waterway',
    description: 'Seller delivers goods alongside vessel at named origin port. Waterway transport only.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'buyer',
      cargoInsurance: 'buyer',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  FOB: {
    code: 'FOB',
    name: 'Free On Board',
    category: 'sea_inland_waterway',
    description: 'Seller delivers goods loaded on board vessel at named origin port. Risk transfers when on board.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'buyer',
      cargoInsurance: 'buyer',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  CFR: {
    code: 'CFR',
    name: 'Cost and Freight',
    category: 'sea_inland_waterway',
    description: 'Seller pays freight to destination port. Risk transfers to buyer once loaded on board at origin.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'buyer',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
  CIF: {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    category: 'sea_inland_waterway',
    description: 'Seller pays freight and marine insurance (Clause C) to destination port. Risk transfers on board.',
    responsibilities: {
      exportPackaging: 'seller',
      loadingOrigin: 'seller',
      exportClearance: 'seller',
      originTerminalCharges: 'seller',
      mainCarriage: 'seller',
      cargoInsurance: 'seller',
      destinationTerminalCharges: 'buyer',
      importClearance: 'buyer',
      importDutiesAndTaxes: 'buyer',
      unloadingDestination: 'buyer',
    },
  },
}

export function getIncoterm(code: string): IncotermDefinition | undefined {
  if (!code) return undefined
  const upper = code.trim().toUpperCase() as IncotermCode
  return INCOTERMS[upper]
}

export function listIncoterms(): IncotermDefinition[] {
  return Object.values(INCOTERMS)
}

// ---------------------------------------------------------------------------
// 2. CBM Calculation
// ---------------------------------------------------------------------------

export interface CargoItem {
  id?: string
  pieces: number
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
  weightKg?: number
}

export interface CargoItemBreakdown {
  id: string
  pieces: number
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
  unitCbm: number
  totalCbm: number
  cbm: number
  weightKg?: number
  totalWeightKg?: number
}

export interface CbmCalculationResult {
  totalPieces: number
  totalCbm: number
  totalWeightKg: number
  breakdown: CargoItemBreakdown[]
}

const INCH_TO_METER = 0.0254

export function calculateCbm(items: CargoItem[]): CbmCalculationResult {
  if (!items || items.length === 0) {
    return {
      totalPieces: 0,
      totalCbm: 0,
      totalWeightKg: 0,
      breakdown: [],
    }
  }

  let totalPieces = 0
  let rawTotalCbm = 0
  let rawTotalWeight = 0

  const breakdown: CargoItemBreakdown[] = items.map((item, index) => {
    const pieces = Math.max(0, Math.round(item.pieces || 0))
    const length = Math.max(0, item.length || 0)
    const width = Math.max(0, item.width || 0)
    const height = Math.max(0, item.height || 0)
    const unit: 'cm' | 'in' = item.unit === 'in' ? 'in' : 'cm'
    const weightKg = item.weightKg !== undefined && !isNaN(item.weightKg) && item.weightKg >= 0
      ? item.weightKg
      : undefined

    let unitCbm = 0
    if (unit === 'cm') {
      unitCbm = (length * width * height) / 1_000_000
    } else {
      unitCbm = (length * INCH_TO_METER) * (width * INCH_TO_METER) * (height * INCH_TO_METER)
    }

    const itemTotalCbm = unitCbm * pieces
    const itemTotalWeight = weightKg !== undefined ? weightKg * pieces : 0

    totalPieces += pieces
    rawTotalCbm += itemTotalCbm
    rawTotalWeight += itemTotalWeight

    const roundedItemTotalCbm = Number(itemTotalCbm.toFixed(3))
    const roundedUnitCbm = Number(unitCbm.toFixed(4))

    return {
      id: item.id || `item-${index + 1}`,
      pieces,
      length,
      width,
      height,
      unit,
      unitCbm: roundedUnitCbm,
      totalCbm: roundedItemTotalCbm,
      cbm: roundedItemTotalCbm,
      weightKg,
      totalWeightKg: weightKg !== undefined ? Number(itemTotalWeight.toFixed(2)) : undefined,
    }
  })

  const totalCbm = Number(rawTotalCbm.toFixed(3))
  const totalWeightKg = Number(rawTotalWeight.toFixed(2))

  return {
    totalPieces,
    totalCbm,
    totalWeightKg,
    breakdown,
  }
}

// ---------------------------------------------------------------------------
// 3. Volumetric Weight & kg <-> CBM Estimator
// ---------------------------------------------------------------------------

export type TransportMode = 'air' | 'sea' | 'courier'

export const VOLUMETRIC_RATIOS: Record<TransportMode, number> = {
  air: 167,     // 1 CBM = 167 kg (1:6 ratio, 6,000 cm³/kg)
  sea: 1000,    // 1 CBM = 1,000 kg (LCL standard)
  courier: 200, // 1 CBM = 200 kg (5,000 cm³/kg)
} as const

export function calculateVolumetricWeight(cbm: number, mode: TransportMode): number {
  const ratio = VOLUMETRIC_RATIOS[mode]
  const val = Math.max(0, cbm) * ratio
  return Number(val.toFixed(2))
}

export interface ChargeableWeightResult {
  actualWeightKg: number
  volumetricWeightKg: number
  chargeableWeightKg: number
  chargeableBasis: 'actual' | 'volumetric'
}

export function calculateChargeableWeight(
  actualWeightKg: number,
  cbm: number,
  mode: TransportMode
): ChargeableWeightResult {
  const safeActual = Math.max(0, actualWeightKg || 0)
  const volumetricWeightKg = calculateVolumetricWeight(cbm, mode)
  const isVolumetric = volumetricWeightKg > safeActual

  return {
    actualWeightKg: safeActual,
    volumetricWeightKg,
    chargeableWeightKg: isVolumetric ? volumetricWeightKg : safeActual,
    chargeableBasis: isVolumetric ? 'volumetric' : 'actual',
  }
}

// ---------------------------------------------------------------------------
// 4. Container-Fit Estimator
// ---------------------------------------------------------------------------

// NOTE: Container capacities below are indicative, not a quote.
// Actual packing depends on cargo geometry, palletization, weight distribution, and carrier limits.
export const CONTAINER_SPECS = {
  '20ft': { name: "20' Standard", internalCbm: 33.2, usableCbm: 28.0, maxPayloadKg: 25000 },
  '40ft': { name: "40' Standard", internalCbm: 67.7, usableCbm: 58.0, maxPayloadKg: 26500 },
  '40hc': { name: "40' High Cube", internalCbm: 76.4, usableCbm: 68.0, maxPayloadKg: 26500 },
} as const

export type ContainerType = keyof typeof CONTAINER_SPECS

export interface ContainerSizeUtilization {
  containerType: ContainerType
  name: string
  usableCbm: number
  maxPayloadKg: number
  spaceUtilizationPct: number
  volumeUtilizationPct: number
  weightUtilizationPct?: number
  fitsVolume: boolean
  fitsWeight: boolean
  fitsInSingle: boolean
}

export interface OptimalContainers {
  '20ft': number
  '40ft': number
  '40hc': number
  summary: string
  totalContainers: number
  totalCapacityCbm: number
}

export interface ContainerFitResult {
  cbm: number
  weightKg?: number
  isLclRecommended: boolean
  primarySuggestion: string
  containers: {
    '20ft': number
    '40ft': number
    '40hc': number
  }
  optimalCombination: OptimalContainers
  optimalContainers: OptimalContainers
  utilization: Record<ContainerType, ContainerSizeUtilization>
}

export function estimateContainerFit(cbm: number, weightKg?: number): ContainerFitResult {
  const safeCbm = Math.max(0, cbm || 0)
  const safeWeight = weightKg !== undefined ? Math.max(0, weightKg) : undefined
  const isLclRecommended = safeCbm < 15

  // Determine optimal combination
  let n40hc = 0
  let n40 = 0
  let n20 = 0

  if (safeCbm > 0) {
    n40hc = Math.floor(safeCbm / CONTAINER_SPECS['40hc'].usableCbm)
    const remCbm = safeCbm - n40hc * CONTAINER_SPECS['40hc'].usableCbm

    if (remCbm > 0) {
      if (remCbm <= CONTAINER_SPECS['20ft'].usableCbm) {
        n20 = 1
      } else if (remCbm <= CONTAINER_SPECS['40ft'].usableCbm) {
        n40 = 1
      } else {
        n40hc += 1
      }
    }
  }

  // Weight payload check: ensure combination also supports weight
  if (safeWeight && safeWeight > 0) {
    const calcWeightCap = (c20: number, c40: number, chc: number) =>
      c20 * CONTAINER_SPECS['20ft'].maxPayloadKg +
      c40 * CONTAINER_SPECS['40ft'].maxPayloadKg +
      chc * CONTAINER_SPECS['40hc'].maxPayloadKg

    while (calcWeightCap(n20, n40, n40hc) < safeWeight) {
      n40hc += 1
    }
  }

  // If safeCbm == 0 and safeWeight == 0, default to 0 containers
  if (safeCbm === 0 && (!safeWeight || safeWeight === 0)) {
    n20 = 0
    n40 = 0
    n40hc = 0
  }

  const parts: string[] = []
  if (n40hc > 0) parts.push(`${n40hc}x 40' High Cube`)
  if (n40 > 0) parts.push(`${n40}x 40' Standard`)
  if (n20 > 0) parts.push(`${n20}x 20' Standard`)

  const summary = parts.length > 0 ? parts.join(' + ') : "1x 20' Standard"
  const totalContainers = n20 + n40 + n40hc
  const totalCapacityCbm = Number(
    (n20 * CONTAINER_SPECS['20ft'].usableCbm +
     n40 * CONTAINER_SPECS['40ft'].usableCbm +
     n40hc * CONTAINER_SPECS['40hc'].usableCbm).toFixed(1)
  )

  const optimalCombination: OptimalContainers = {
    '20ft': n20,
    '40ft': n40,
    '40hc': n40hc,
    summary,
    totalContainers,
    totalCapacityCbm,
  }

  const primarySuggestion = isLclRecommended
    ? 'LCL (Less than Container Load)'
    : summary

  const round1 = (val: number) => Math.round((val + Number.EPSILON) * 10) / 10

  const buildUtil = (type: ContainerType): ContainerSizeUtilization => {
    const spec = CONTAINER_SPECS[type]
    const spaceUtil = round1((safeCbm / spec.usableCbm) * 100)
    const weightUtil = safeWeight !== undefined ? round1((safeWeight / spec.maxPayloadKg) * 100) : undefined
    const fitsVolume = safeCbm <= spec.usableCbm
    const fitsWeight = safeWeight !== undefined ? safeWeight <= spec.maxPayloadKg : true

    return {
      containerType: type,
      name: spec.name,
      usableCbm: spec.usableCbm,
      maxPayloadKg: spec.maxPayloadKg,
      spaceUtilizationPct: spaceUtil,
      volumeUtilizationPct: spaceUtil,
      weightUtilizationPct: weightUtil,
      fitsVolume,
      fitsWeight,
      fitsInSingle: fitsVolume && fitsWeight,
    }
  }

  return {
    cbm: safeCbm,
    weightKg: safeWeight,
    isLclRecommended,
    primarySuggestion,
    containers: {
      '20ft': n20,
      '40ft': n40,
      '40hc': n40hc,
    },
    optimalCombination,
    optimalContainers: optimalCombination,
    utilization: {
      '20ft': buildUtil('20ft'),
      '40ft': buildUtil('40ft'),
      '40hc': buildUtil('40hc'),
    },
  }
}

// ---------------------------------------------------------------------------
// 5. URL Query Params Serialization
// ---------------------------------------------------------------------------

export interface IncotermCbmToolState {
  incoterm?: IncotermCode | string
  transportMode?: TransportMode
  items: CargoItem[]
}

export function serializeToolState(state: Partial<IncotermCbmToolState>): string {
  const params = new URLSearchParams()

  if (state.incoterm) {
    params.set('incoterm', state.incoterm.toUpperCase().trim())
  }
  if (state.transportMode) {
    params.set('mode', state.transportMode)
  }
  if (state.items && state.items.length > 0) {
    params.set('items', JSON.stringify(state.items))
  }

  return params.toString()
}

export function deserializeToolState(input?: string | URLSearchParams | null): IncotermCbmToolState {
  const result: IncotermCbmToolState = {
    items: [],
  }

  if (!input) return result

  let params: URLSearchParams
  if (typeof input === 'string') {
    const query = input.startsWith('?') ? input.slice(1) : input
    try {
      params = new URLSearchParams(query)
    } catch {
      return result
    }
  } else {
    params = input
  }

  const rawIncoterm = params.get('incoterm')
  if (rawIncoterm && typeof rawIncoterm === 'string') {
    const cleaned = rawIncoterm.toUpperCase().trim()
    if (getIncoterm(cleaned)) {
      result.incoterm = cleaned as IncotermCode
    } else if (cleaned.length > 0) {
      result.incoterm = cleaned
    }
  }

  const rawMode = params.get('mode') || params.get('transportMode')
  if (rawMode === 'air' || rawMode === 'sea' || rawMode === 'courier') {
    result.transportMode = rawMode
  }

  const rawItems = params.get('items')
  if (rawItems && typeof rawItems === 'string') {
    try {
      const parsed = JSON.parse(rawItems)
      if (Array.isArray(parsed)) {
        const validatedItems: CargoItem[] = []
        for (const item of parsed) {
          if (item && typeof item === 'object') {
            const pieces = Number(item.pieces)
            const length = Number(item.length)
            const width = Number(item.width)
            const height = Number(item.height)
            const unit: 'cm' | 'in' = item.unit === 'in' ? 'in' : 'cm'
            const weightKg = item.weightKg !== undefined && !isNaN(Number(item.weightKg))
              ? Number(item.weightKg)
              : undefined

            if (!isNaN(pieces) && !isNaN(length) && !isNaN(width) && !isNaN(height)) {
              validatedItems.push({
                ...(item.id ? { id: String(item.id) } : {}),
                pieces: Math.max(1, Math.round(pieces)),
                length: Math.max(0, length),
                width: Math.max(0, width),
                height: Math.max(0, height),
                unit,
                ...(weightKg !== undefined ? { weightKg: Math.max(0, weightKg) } : {}),
              })
            }
          }
        }
        result.items = validatedItems
      }
    } catch {
      // Malformed JSON is safely swallowed, leaving result.items empty
    }
  }

  return result
}
