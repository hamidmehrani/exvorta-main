'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  INCOTERMS,
  listIncoterms,
  getIncoterm,
  calculateCbm,
  calculateChargeableWeight,
  estimateContainerFit,
  serializeToolState,
  deserializeToolState,
  CONTAINER_SPECS,
  type IncotermCode,
  type TransportMode,
  type CargoItem,
  type Party,
  type IncotermResponsibilities,
} from '@/lib/tools/incoterm-cbm'

interface StageMeta {
  key: keyof IncotermResponsibilities
  label: string
  description: string
}

const STAGES: StageMeta[] = [
  { key: 'exportPackaging', label: 'Export Packaging', description: 'Packing and marking goods suitably for export transport.' },
  { key: 'loadingOrigin', label: 'Loading at Origin', description: 'Loading cargo onto first collecting vehicle at seller premises.' },
  { key: 'exportClearance', label: 'Export Clearance', description: 'Customs declaration, export licenses, and documentation at origin.' },
  { key: 'originTerminalCharges', label: 'Origin Terminal Charges', description: 'Handling charges and terminal fees at port/terminal of departure.' },
  { key: 'mainCarriage', label: 'Main Carriage', description: 'International freight transport between origin and destination ports/terminals.' },
  { key: 'cargoInsurance', label: 'Cargo Insurance', description: 'Procurement of marine/transit insurance coverage during transit.' },
  { key: 'destinationTerminalCharges', label: 'Destination Terminal Charges', description: 'Handling and port terminal fees upon arrival at destination.' },
  { key: 'importClearance', label: 'Import Clearance', description: 'Entry customs declarations and clearance formalities in destination country.' },
  { key: 'importDutiesAndTaxes', label: 'Import Duties & Taxes', description: 'Payment of tariffs, VAT, customs duties, and official fiscal charges.' },
  { key: 'unloadingDestination', label: 'Unloading at Destination', description: 'Discharging cargo from carrier vehicle at final buyer premises.' },
]

const DEFAULT_ITEMS: CargoItem[] = [
  { id: 'cargo-1', pieces: 10, length: 50, width: 40, height: 30, unit: 'cm', weightKg: 15 },
]

export function IncotermCbmCalculator() {
  const searchParams = useSearchParams()

  // Initialize state from URL query parameters if present, or defaults
  const parsedInitial = useMemo(() => {
    return deserializeToolState(searchParams?.toString())
  }, [searchParams])

  const initialCode: IncotermCode = (parsedInitial.incoterm && getIncoterm(parsedInitial.incoterm))
    ? (parsedInitial.incoterm as IncotermCode)
    : 'FOB'

  const initialMode: TransportMode = parsedInitial.transportMode || 'sea'
  const initialItems: CargoItem[] = parsedInitial.items && parsedInitial.items.length > 0
    ? parsedInitial.items
    : DEFAULT_ITEMS

  const [selectedCode, setSelectedCode] = useState<IncotermCode>(initialCode)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'multimodal' | 'sea_inland_waterway'>('all')
  const [transportMode, setTransportMode] = useState<TransportMode>(initialMode)
  const [cargoItems, setCargoItems] = useState<CargoItem[]>(initialItems)
  const [copiedLink, setCopiedLink] = useState(false)

  // Reactive URL query parameter synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return
    const query = serializeToolState({
      incoterm: selectedCode,
      transportMode,
      items: cargoItems,
    })
    const newPath = query ? `${window.location.pathname}?${query}` : window.location.pathname
    window.history.replaceState(null, '', newPath)
  }, [selectedCode, transportMode, cargoItems])

  // Calculations
  const incotermDef = useMemo(() => INCOTERMS[selectedCode] || INCOTERMS.FOB, [selectedCode])
  const incotermsList = useMemo(() => listIncoterms(), [])

  const filteredIncoterms = useMemo(() => {
    if (categoryFilter === 'all') return incotermsList
    return incotermsList.filter(item => item.category === categoryFilter)
  }, [incotermsList, categoryFilter])

  const cbmResult = useMemo(() => calculateCbm(cargoItems), [cargoItems])
  const chargeableResult = useMemo(() => {
    return calculateChargeableWeight(cbmResult.totalWeightKg, cbmResult.totalCbm, transportMode)
  }, [cbmResult.totalWeightKg, cbmResult.totalCbm, transportMode])

  const containerResult = useMemo(() => {
    return estimateContainerFit(cbmResult.totalCbm, cbmResult.totalWeightKg)
  }, [cbmResult.totalCbm, cbmResult.totalWeightKg])

  // Cargo Item Management
  const handleAddItem = useCallback(() => {
    setCargoItems(prev => [
      ...prev,
      {
        id: `cargo-${Date.now()}-${prev.length + 1}`,
        pieces: 1,
        length: 60,
        width: 40,
        height: 40,
        unit: 'cm',
        weightKg: 10,
      },
    ])
  }, [])

  const handleRemoveItem = useCallback((indexToRemove: number) => {
    setCargoItems(prev => {
      if (prev.length <= 1) return prev
      return prev.filter((_, idx) => idx !== indexToRemove)
    })
  }, [])

  const handleUpdateItem = useCallback((index: number, updates: Partial<CargoItem>) => {
    setCargoItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
  }, [])

  const handleGlobalUnitChange = useCallback((unit: 'cm' | 'in') => {
    setCargoItems(prev => prev.map(item => ({ ...item, unit })))
  }, [])

  // Link copy & Reset
  const handleCopyLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    const query = serializeToolState({
      incoterm: selectedCode,
      transportMode,
      items: cargoItems,
    })
    const fullUrl = `${window.location.origin}${window.location.pathname}${query ? `?${query}` : ''}`
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2200)
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = fullUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2200)
      } catch {
        // clipboard write fallback
      }
    }
  }, [selectedCode, transportMode, cargoItems])

  const handleReset = useCallback(() => {
    setSelectedCode('FOB')
    setCategoryFilter('all')
    setTransportMode('sea')
    setCargoItems(DEFAULT_ITEMS)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const renderPartyBadge = (party: Party) => {
    if (party === 'seller') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-semibold rounded-[3px] bg-emerald/10 text-emerald border border-emerald/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald" aria-hidden="true" />
          Seller
        </span>
      )
    }
    if (party === 'buyer') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-[3px] bg-obsidian/5 text-muted border border-rule">
          <span className="w-1.5 h-1.5 rounded-full bg-muted" aria-hidden="true" />
          Buyer
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider font-medium rounded-[3px] bg-warning/10 text-warning border border-warning/30">
        <span className="w-1.5 h-1.5 rounded-full bg-warning" aria-hidden="true" />
        Negotiable
      </span>
    )
  }

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24">
      {/* Action Toolbar: Share & Reset */}
      <div className="w-full border-y border-rule bg-surface-2/60 py-4">
        <div className="container-site flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Live Client-Side Trade Engine &bull; Zero Network Lag
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule bg-surface text-obsidian hover:border-obsidian transition-colors rounded-[4px] cursor-pointer"
              aria-label={copiedLink ? 'Link copied to clipboard' : 'Copy shareable configuration link'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  copiedLink ? 'bg-emerald shadow-[0_0_6px_var(--color-emerald)]' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
              <span>{copiedLink ? '[ Copied! ]' : '[ Copy Shareable Link ]'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 border border-rule hover:border-obsidian text-muted hover:text-obsidian bg-transparent transition-colors rounded-[4px] cursor-pointer"
            >
              [ Reset ]
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: Incoterm Responsibility Matrix Explorer */}
      <section className="container-site" aria-labelledby="section-incoterms-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rule">
            <div>
              <p className="eyebrow mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                Section A &bull; Incoterms 2020 Matrix
              </p>
              <h2 id="section-incoterms-title" className="font-serif text-title font-semibold text-obsidian">
                Responsibility Matrix Explorer
              </h2>
              <p className="mt-2 text-sm text-muted font-light max-w-2xl">
                Compare official ICC Incoterms 2020 division of costs, risks, and transport logistics between seller and buyer.
              </p>
            </div>

            {/* Filter by Category */}
            <div className="flex flex-wrap items-center gap-1.5 bg-surface-2 p-1 border border-rule rounded-[4px] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-[2px] ${
                  categoryFilter === 'all'
                    ? 'bg-obsidian text-white font-semibold'
                    : 'text-muted hover:text-obsidian'
                }`}
              >
                All (11)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('multimodal')}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-[2px] ${
                  categoryFilter === 'multimodal'
                    ? 'bg-obsidian text-white font-semibold'
                    : 'text-muted hover:text-obsidian'
                }`}
              >
                Multimodal (7)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('sea_inland_waterway')}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-[2px] ${
                  categoryFilter === 'sea_inland_waterway'
                    ? 'bg-obsidian text-white font-semibold'
                    : 'text-muted hover:text-obsidian'
                }`}
              >
                Sea / Waterway (4)
              </button>
            </div>
          </div>

          {/* Incoterm Selector Grid */}
          <div className="py-8">
            <label className="field-label mb-3">Select Incoterm 2020 Rule:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
              {filteredIncoterms.map(term => {
                const isSelected = term.code === selectedCode
                return (
                  <button
                    key={term.code}
                    type="button"
                    onClick={() => setSelectedCode(term.code)}
                    className={`flex flex-col items-center justify-center p-3 border rounded-[4px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-obsidian text-white border-obsidian shadow-sm ring-1 ring-obsidian'
                        : 'bg-surface hover:bg-surface-2 text-obsidian border-rule hover:border-obsidian/40'
                    }`}
                  >
                    <span className="font-mono text-base font-bold tracking-wider">{term.code}</span>
                    <span className={`text-[10px] uppercase font-mono tracking-widest mt-1 ${isSelected ? 'text-white/70' : 'text-muted'}`}>
                      {term.category === 'multimodal' ? 'Any Mode' : 'Sea/Water'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Incoterm Details Banner */}
          <div className="border border-rule bg-surface-2 p-6 rounded-[4px] mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-mono text-2xl font-bold px-3 py-1 bg-obsidian text-white rounded-[3px]">
                  {incotermDef.code}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-obsidian">{incotermDef.name}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {incotermDef.category === 'multimodal'
                      ? 'Multimodal (Applicable to Any Mode or Modes of Transport)'
                      : 'Sea and Inland Waterway Transport Only'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald" aria-hidden="true" /> Seller Obligation
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted" aria-hidden="true" /> Buyer Obligation
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-obsidian/80 font-light border-t border-rule pt-4 leading-relaxed">
              {incotermDef.description}
            </p>
          </div>

          {/* 10-Stage Responsibility Table / Ledger */}
          <div className="overflow-x-auto border border-rule rounded-[4px]">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-rule font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th scope="col" className="p-4 text-start font-medium w-16">#</th>
                  <th scope="col" className="p-4 text-start font-medium w-1/3">Stage</th>
                  <th scope="col" className="p-4 text-start font-medium">Scope & Legal Description</th>
                  <th scope="col" className="p-4 text-end font-medium w-40">Responsible Party</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-sans text-sm">
                {STAGES.map((stage, idx) => {
                  const party = incotermDef.responsibilities[stage.key]
                  return (
                    <tr key={stage.key} className="hover:bg-surface-2/40 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="p-4 font-medium text-obsidian">{stage.label}</td>
                      <td className="p-4 text-muted font-light text-xs md:text-sm">{stage.description}</td>
                      <td className="p-4 text-end">{renderPartyBadge(party)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION B: Cargo Dimensions & CBM Math */}
      <section className="container-site" aria-labelledby="section-cbm-title">
        <div className="frame border border-rule bg-surface p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rule">
            <div>
              <p className="eyebrow mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                Section B &bull; Volume & Chargeable Weight
              </p>
              <h2 id="section-cbm-title" className="font-serif text-title font-semibold text-obsidian">
                Cargo Dimensions & CBM Math
              </h2>
              <p className="mt-2 text-sm text-muted font-light max-w-2xl">
                Add cartons, crates, or pallet dimensions in metric or imperial units. Calculations compute exact cubic meters and chargeable freight weight automatically.
              </p>
            </div>

            {/* Quick Global Unit Selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">All Units:</span>
              <div className="flex border border-rule rounded-[4px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleGlobalUnitChange('cm')}
                  className="px-2.5 py-1 font-mono text-xs uppercase hover:bg-surface-2 text-obsidian"
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => handleGlobalUnitChange('in')}
                  className="px-2.5 py-1 font-mono text-xs uppercase border-s border-rule hover:bg-surface-2 text-obsidian"
                >
                  IN
                </button>
              </div>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="py-6 border-b border-rule">
            <label className="field-label mb-3">Freight Mode & Volumetric Factor:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { mode: 'sea' as const, label: 'Sea Freight (LCL)', factor: '1 CBM = 1,000 kg', desc: 'Standard maritime cargo baseline' },
                { mode: 'air' as const, label: 'Air Freight', factor: '1 CBM = 167 kg', desc: 'IATA 1:6 ratio (6,000 cm³/kg)' },
                { mode: 'courier' as const, label: 'Courier / Express', factor: '1 CBM = 200 kg', desc: 'Express courier 1:5 ratio (5,000 cm³/kg)' },
              ].map(item => {
                const isActive = transportMode === item.mode
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setTransportMode(item.mode)}
                    className={`p-4 border rounded-[4px] text-start transition-all cursor-pointer ${
                      isActive
                        ? 'bg-obsidian text-white border-obsidian ring-1 ring-obsidian'
                        : 'bg-surface hover:bg-surface-2 text-obsidian border-rule'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-2 text-muted border border-rule'
                      }`}>
                        {item.factor}
                      </span>
                    </div>
                    <p className={`text-xs font-light ${isActive ? 'text-white/70' : 'text-muted'}`}>{item.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cargo Items List */}
          <div className="py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="field-label">Cargo Packages ({cargoItems.length}):</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 bg-obsidian text-white hover:bg-obsidian/90 transition-colors rounded-[3px] cursor-pointer"
              >
                <span>+</span> Add Cargo Item
              </button>
            </div>

            {cargoItems.map((item, idx) => {
              const breakdown = cbmResult.breakdown[idx]
              return (
                <div key={item.id || idx} className="p-4 border border-rule bg-surface-2/40 rounded-[4px] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-1 bg-surface border border-rule rounded-[2px]">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 flex-1">
                    <div>
                      <label htmlFor={`cargo-pieces-${item.id || idx}`} className="block text-[10px] font-mono uppercase text-muted mb-1">Pieces</label>
                      <input
                        id={`cargo-pieces-${item.id || idx}`}
                        type="number"
                        min="1"
                        step="1"
                        value={item.pieces || ''}
                        onChange={e => handleUpdateItem(idx, { pieces: Math.max(1, parseInt(e.target.value, 10) || 0) })}
                        className="field min-h-[40px] px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        placeholder="1"
                        aria-label={`Pieces for package ${idx + 1}`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`cargo-length-${item.id || idx}`} className="block text-[10px] font-mono uppercase text-muted mb-1">Length</label>
                      <input
                        id={`cargo-length-${item.id || idx}`}
                        type="number"
                        min="0"
                        step="any"
                        value={item.length || ''}
                        onChange={e => handleUpdateItem(idx, { length: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="field min-h-[40px] px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        placeholder="0"
                        aria-label={`Length for package ${idx + 1}`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`cargo-width-${item.id || idx}`} className="block text-[10px] font-mono uppercase text-muted mb-1">Width</label>
                      <input
                        id={`cargo-width-${item.id || idx}`}
                        type="number"
                        min="0"
                        step="any"
                        value={item.width || ''}
                        onChange={e => handleUpdateItem(idx, { width: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="field min-h-[40px] px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        placeholder="0"
                        aria-label={`Width for package ${idx + 1}`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`cargo-height-${item.id || idx}`} className="block text-[10px] font-mono uppercase text-muted mb-1">Height</label>
                      <input
                        id={`cargo-height-${item.id || idx}`}
                        type="number"
                        min="0"
                        step="any"
                        value={item.height || ''}
                        onChange={e => handleUpdateItem(idx, { height: Math.max(0, parseFloat(e.target.value) || 0) })}
                        className="field min-h-[40px] px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        placeholder="0"
                        aria-label={`Height for package ${idx + 1}`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`cargo-unit-${item.id || idx}`} className="block text-[10px] font-mono uppercase text-muted mb-1">Unit</label>
                      <select
                        id={`cargo-unit-${item.id || idx}`}
                        value={item.unit}
                        onChange={e => handleUpdateItem(idx, { unit: e.target.value as 'cm' | 'in' })}
                        className="field min-h-[40px] px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        aria-label={`Dimension unit for package ${idx + 1}`}
                      >
                        <option value="cm">cm</option>
                        <option value="in">inches</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`cargo-weight-${item.id || idx}`} className="block text-[10px] font-mono uppercase text-muted mb-1">Weight/pc (kg)</label>
                      <input
                        id={`cargo-weight-${item.id || idx}`}
                        type="number"
                        min="0"
                        step="any"
                        value={item.weightKg !== undefined ? item.weightKg : ''}
                        onChange={e => {
                          const val = e.target.value === '' ? undefined : Math.max(0, parseFloat(e.target.value) || 0)
                          handleUpdateItem(idx, { weightKg: val })
                        }}
                        className="field min-h-[40px] px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
                        placeholder="Optional"
                        aria-label={`Weight per piece in kg for package ${idx + 1}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-rule pt-3 lg:pt-0">
                    <div className="text-end">
                      <span className="block font-mono text-xs font-semibold text-obsidian">
                        {breakdown ? `${breakdown.totalCbm.toFixed(3)} m³` : '0.000 m³'}
                      </span>
                      <span className="block font-mono text-[10px] text-muted">
                        {breakdown?.totalWeightKg ? `${breakdown.totalWeightKg.toFixed(1)} kg total` : 'No weight'}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={cargoItems.length <= 1}
                      onClick={() => handleRemoveItem(idx)}
                      className={`font-mono text-xs px-2.5 py-1.5 border rounded-[3px] transition-colors ${
                        cargoItems.length <= 1
                          ? 'opacity-30 border-rule text-muted cursor-not-allowed'
                          : 'border-rule hover:border-danger hover:text-danger text-muted cursor-pointer'
                      }`}
                      aria-label={`Remove package item ${idx + 1}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Live Calculated Metrics Cards */}
          <div className="mt-8 pt-8 border-t border-rule grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">Total Pieces</span>
              <span className="font-mono text-2xl font-bold text-obsidian">{cbmResult.totalPieces}</span>
              <span className="block text-xs text-muted mt-1">Cargo units count</span>
            </div>

            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">Total Volume (CBM)</span>
              <span className="font-mono text-2xl font-bold text-emerald">{cbmResult.totalCbm.toFixed(3)} m³</span>
              <span className="block text-xs text-muted mt-1">Cubic meters total</span>
            </div>

            <div className="p-4 border border-rule bg-surface-2 rounded-[4px]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">Actual vs Volumetric</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-obsidian">{cbmResult.totalWeightKg.toFixed(1)}</span>
                <span className="text-xs text-muted">/</span>
                <span className="font-mono text-lg font-semibold text-muted">{chargeableResult.volumetricWeightKg.toFixed(1)} kg</span>
              </div>
              <span className="block text-xs text-muted mt-1 font-mono">Actual vs Vol. weight</span>
            </div>

            <div className="p-4 border border-rule bg-surface-2 rounded-[4px] relative overflow-hidden">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1">Chargeable Weight</span>
              <span className="font-mono text-2xl font-bold text-obsidian">{chargeableResult.chargeableWeightKg.toFixed(1)} kg</span>
              <div className="mt-1">
                <span className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                  chargeableResult.chargeableBasis === 'volumetric'
                    ? 'bg-warning/15 text-warning font-semibold border border-warning/30'
                    : 'bg-emerald/15 text-emerald font-semibold border border-emerald/30'
                }`}>
                  [{chargeableResult.chargeableBasis === 'volumetric' ? 'Volumetric Applies' : 'Actual Weight Applies'}]
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: Container-Fit Estimator */}
      <section className="container-site" aria-labelledby="section-container-title">
        <div className="frame frame-dark border border-rule-dark bg-[#0D0D0D] text-white p-6 md:p-10 rounded-[4px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rule-dark">
            <div>
              <p className="eyebrow eyebrow-dark mb-2">
                <span className="eyebrow-index" aria-hidden="true">
                  <i className="block h-1.5 w-1.5 rotate-45 bg-current" />
                </span>
                Section C &bull; Maritime Equipment
              </p>
              <h2 id="section-container-title" className="font-serif text-title font-semibold text-white">
                Container-Fit Estimator
              </h2>
              <p className="mt-2 text-sm text-muted-dark font-light max-w-2xl">
                Simulate standard ISO shipping container capacity utilization and receive immediate FCL versus LCL allocation recommendations based on total CBM.
              </p>
            </div>

            {/* Recommendation Highlight Pill */}
            <div className="self-start md:self-auto">
              <div className={`px-4 py-3 border rounded-[4px] ${
                containerResult.isLclRecommended
                  ? 'border-warning/40 bg-warning/10 text-warning'
                  : 'border-emerald/40 bg-emerald/10 text-emerald'
              }`}>
                <span className="block font-mono text-[10px] uppercase tracking-widest font-semibold">
                  Primary Recommendation:
                </span>
                <span className="font-mono text-sm font-bold">
                  {containerResult.isLclRecommended
                    ? 'LCL (Less than Container Load) Recommended'
                    : `FCL: ${containerResult.primarySuggestion}`}
                </span>
              </div>
            </div>
          </div>

          {/* Container Size Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            {(['20ft', '40ft', '40hc'] as const).map(type => {
              const spec = CONTAINER_SPECS[type]
              const util = containerResult.utilization[type]
              const fits = util.fitsInSingle

              return (
                <div
                  key={type}
                  className="p-6 border border-rule-dark bg-[#141414] rounded-[4px] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-rule-dark">
                      <h3 className="font-mono text-lg font-bold text-white">{spec.name}</h3>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                        fits ? 'bg-emerald/20 text-emerald border border-emerald/30' : 'bg-white/10 text-muted-dark'
                      }`}>
                        {fits ? 'Single Fit' : 'Requires Multiple'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
                      <div>
                        <span className="block text-muted-dark text-[10px] uppercase">Usable CBM</span>
                        <span className="text-sm font-semibold text-white">{spec.usableCbm} m³</span>
                      </div>
                      <div>
                        <span className="block text-muted-dark text-[10px] uppercase">Max Payload</span>
                        <span className="text-sm font-semibold text-white">{spec.maxPayloadKg.toLocaleString()} kg</span>
                      </div>
                    </div>

                    {/* Volume Utilization Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-muted-dark">Volume Fill</span>
                        <span className={util.spaceUtilizationPct > 100 ? 'text-warning font-semibold' : 'text-emerald'}>
                          {util.spaceUtilizationPct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            util.spaceUtilizationPct > 100 ? 'bg-warning' : 'bg-emerald'
                          }`}
                          style={{ width: `${Math.min(100, util.spaceUtilizationPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Weight Utilization Bar (if weight present) */}
                    {util.weightUtilizationPct !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-muted-dark">Weight Fill</span>
                          <span className={util.weightUtilizationPct > 100 ? 'text-danger font-semibold' : 'text-white/80'}>
                            {util.weightUtilizationPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              util.weightUtilizationPct > 100 ? 'bg-danger' : 'bg-white/60'
                            }`}
                            style={{ width: `${Math.min(100, util.weightUtilizationPct)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-rule-dark text-[11px] text-muted-dark font-mono">
                    Internal Volume: {spec.internalCbm} m³
                  </div>
                </div>
              )
            })}
          </div>

          {/* Allocation Summary Ledger */}
          <div className="p-4 border border-rule-dark bg-[#1A1A1A] rounded-[4px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-dark block">
                Equipment Allocation Strategy:
              </span>
              <p className="text-sm font-light text-white/90 mt-1">
                {containerResult.isLclRecommended
                  ? `Cargo volume is ${cbmResult.totalCbm.toFixed(3)} m³ (< 15 m³ benchmark). Consolidating via LCL is more cost-effective than booking a dedicated 20ft container.`
                  : `Optimal FCL combination: ${containerResult.optimalCombination.summary} (${containerResult.optimalCombination.totalCapacityCbm} m³ total usable capacity).`}
              </p>
            </div>
            <div className="font-mono text-xs text-muted-dark px-3 py-1.5 border border-rule-dark rounded-[2px] bg-[#141414]">
              Total Containers: <strong className="text-white">{containerResult.optimalCombination.totalContainers}</strong>
            </div>
          </div>

          {/* Mandatory Disclaimer Callout */}
          <div className="mt-6 p-4 border border-rule-dark bg-white/[0.02] rounded-[4px]">
            <p className="font-mono text-[11px] leading-relaxed text-muted-dark">
              NOTE: Container capacities below are indicative, not a quote. Actual packing depends on cargo geometry, palletization, weight distribution, and carrier limits.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IncotermCbmCalculator
