'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { easings } from '@/lib/animations'

/* ─────────────────────────── data ─────────────────────────── */

interface LedgerRow {
  bol: string
  consignee: string
  hs: string
  origin: string
  destination: string
  value: number
  status: 'CLEARED' | 'IN TRANSIT' | 'PENDING KYC' | 'CUSTOMS HOLD'
  eta: string
  vessel: string
}

const LEDGER: LedgerRow[] = [
  { bol: 'TRK-9821-X', consignee: 'Atlas Mfg Corp.', hs: '8411.82', origin: 'Rotterdam (NLRTM)', destination: 'Dubai (AEDXB)', value: 1240500, status: 'CLEARED', eta: '6d', vessel: 'MV Meridian' },
  { bol: 'TRK-3302-B', consignee: 'Zeta Logistics', hs: '8544.49', origin: 'Shanghai (CNSHA)', destination: 'Hamburg (DEHAM)', value: 89200, status: 'IN TRANSIT', eta: '11d', vessel: 'MV Aurora B.' },
  { bol: 'TRK-4491-C', consignee: 'Novus Energy', hs: '2710.12', origin: 'Houston (USHOU)', destination: 'Singapore (SGSIN)', value: 4500000, status: 'PENDING KYC', eta: '9d', vessel: 'MV Sentinel' },
  { bol: 'TRK-1005-D', consignee: 'OmniTech Ltd.', hs: '8542.31', origin: 'Taipei (TWTPE)', destination: 'London (GBHRW)', value: 2150000, status: 'CLEARED', eta: '3d', vessel: 'MV Helios' },
  { bol: 'TRK-9912-A', consignee: 'Nexus Materials', hs: '7208.39', origin: 'Mumbai (INBOM)', destination: 'Antwerp (BEANR)', value: 310000, status: 'CUSTOMS HOLD', eta: '—', vessel: 'MV Falcon' },
  { bol: 'TRK-2044-F', consignee: 'Aegis Trading', hs: '8421.29', origin: 'Los Angeles (USLAX)', destination: 'Tokyo (JPTYO)', value: 545000, status: 'CLEARED', eta: '14d', vessel: 'MV Kestrel' },
  { bol: 'TRK-7788-G', consignee: 'Helix Chemicals', hs: '2914.20', origin: 'Jebel Ali (AEJEA)', destination: 'Rotterdam (NLRTM)', value: 780000, status: 'IN TRANSIT', eta: '7d', vessel: 'MV Ionis' },
  { bol: 'TRK-5521-H', consignee: 'Corvus Foods', hs: '0904.11', origin: 'Izmir (TRIZM)', destination: 'New York (USNYC)', value: 415000, status: 'CLEARED', eta: '5d', vessel: 'MV Spice Route' },
]

const STATUS_STYLES: Record<LedgerRow['status'], string> = {
  CLEARED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'IN TRANSIT': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  'PENDING KYC': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'CUSTOMS HOLD': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
}

const TERMINAL_SCRIPT: { t: string; kind: 'ok' | 'info' | 'warn' | 'sys'; ref?: string }[] = [
  { t: 'Customs cleared at AE-DXB', kind: 'ok', ref: 'TRK-9821-X' },
  { t: 'Vessel arrived at berth BE-ANR', kind: 'info', ref: 'TRK-9912-A' },
  { t: 'KYC verification requested US-HOU', kind: 'warn', ref: 'TRK-4491-C' },
  { t: 'Automated commercial invoice generated', kind: 'sys', ref: 'SYS_DOC_ENGINE' },
  { t: 'Sanctions screen passed GLOBAL', kind: 'ok', ref: 'TRK-1005-D' },
  { t: 'Route optimization complete · saved $12.4k', kind: 'sys', ref: 'SYS_ROUTE_ENGINE' },
  { t: 'Departed origin port CN-SHA', kind: 'info', ref: 'TRK-3302-B' },
  { t: 'HS tariff match 99.2% confidence', kind: 'sys', ref: 'SYS_HS_ENGINE' },
]

const COMPLIANCE = [
  { name: 'Export Controls', status: 'CLEAR', detail: 'Dual-use screening passed · 0 flags', pct: 100 },
  { name: 'Sanctions Screening', status: 'CLEAR', detail: 'OFAC + EU + UN lists · 8,412 entities scanned', pct: 100 },
  { name: 'HS Code Validation', status: '99.2%', detail: 'AI tariff classification · 3 low-confidence reviews', pct: 99 },
  { name: 'KYC Verification', status: '1 OPEN', detail: 'Novus Energy · UBO documents pending', pct: 86 },
  { name: 'Certificate Registry', status: 'VALID', detail: '142 active certificates · 0 expiring < 30d', pct: 100 },
]

const VOLUME_SERIES = [34, 42, 38, 51, 47, 62, 58, 71, 66, 79, 84, 92]
const LANES = [
  { route: 'CNSHA → DEHAM', vol: '31%', pct: 31 },
  { route: 'NLRTM → AEDXB', vol: '24%', pct: 24 },
  { route: 'USHOU → SGSIN', vol: '19%', pct: 19 },
  { route: 'TWTPE → GBHRW', vol: '14%', pct: 14 },
  { route: 'INBOM → BEANR', vol: '12%', pct: 12 },
]

const DOCS = [
  { name: 'Commercial Invoice — TRK-9821-X.pdf', size: '248 KB', gen: 'AI', when: '2m ago' },
  { name: 'Bill of Lading — TRK-1005-D.pdf', size: '112 KB', gen: 'AI', when: '18m ago' },
  { name: 'Certificate of Origin — TRK-5521-H.pdf', size: '96 KB', gen: 'AUTO', when: '1h ago' },
  { name: 'Packing List — TRK-3302-B.xlsx', size: '64 KB', gen: 'AUTO', when: '2h ago' },
  { name: 'Insurance Certificate — TRK-4491-C.pdf', size: '131 KB', gen: 'AI', when: '3h ago' },
]

/* ─────────────────────────── helpers ─────────────────────────── */

function useClock() {
  const [now, setNow] = useState<string>('--:--:--')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(
        [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
          .map(n => String(n).padStart(2, '0'))
          .join(':'),
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const fmt = (n: number) => n.toLocaleString('en-US')

/* ─────────────────────────── panel ─────────────────────────── */

type Tab = 'ledger' | 'terminal' | 'compliance' | 'analytics' | 'docs'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'ledger',
    label: 'Ledger',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
  },
  {
    id: 'terminal',
    label: 'Live Ops',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
]

export function ExvortaOsPanel({ prefersReducedMotion = false }: { prefersReducedMotion?: boolean }) {
  const clock = useClock()
  const [tab, setTab] = useState<Tab>('ledger')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<'bol' | 'value' | 'status'>('bol')
  const [sortAsc, setSortAsc] = useState(true)
  const [selected, setSelected] = useState<LedgerRow | null>(null)
  const [terminalCount, setTerminalCount] = useState(4)

  // terminal: reveal lines progressively
  useEffect(() => {
    if (prefersReducedMotion) { setTerminalCount(TERMINAL_SCRIPT.length); return }
    const id = setInterval(() => {
      setTerminalCount(c => (c >= TERMINAL_SCRIPT.length ? 1 : c + 1))
    }, 3200)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? LEDGER.filter(r =>
          [r.bol, r.consignee, r.origin, r.destination, r.vessel].some(v =>
            v.toLowerCase().includes(q),
          ),
        )
      : LEDGER
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortAsc ? 1 : -1
      if (sortKey === 'value') return (a.value - b.value) * dir
      return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir
    })
    return sorted
  }, [query, sortKey, sortAsc])

  const totalValue = useMemo(() => LEDGER.reduce((s, r) => s + r.value, 0), [])

  const setSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortAsc(a => !a)
    else { setSortKey(k); setSortAsc(true) }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 80, scale: 0.96, filter: 'blur(8px)' }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, delay: 0.75, ease: easings.cinematic }}
      className="exvorta-os relative w-full max-w-[1400px] mx-auto rounded-xl shadow-2xl overflow-hidden bg-[#0B0F14] border border-white/10 flex flex-col mt-20 will-change-transform text-left"
      data-purpose="dashboard-preview"
      dir="ltr"
    >
      {/* ── window chrome ── */}
      <div className="h-11 border-b border-white/10 flex items-center px-3 sm:px-4 justify-between bg-black/40 gap-2">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="text-[9px] sm:text-[10px] text-white/40 tracking-widest uppercase font-mono truncate">Exvorta OS — Command Center</div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-[9px] text-white/45 font-mono">{clock} UTC</span>
          <span className="text-[9px] text-emerald-400 font-mono border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 rounded whitespace-nowrap">SYS_ONLINE</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* ── sidebar rail (desktop) / tab bar (mobile uses bottom tabs) ── */}
        <div className="hidden md:flex w-14 border-r border-white/10 bg-black/30 flex-col items-center py-4 space-y-2 shrink-0">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-label={t.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 relative group ${
                tab === t.id
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{t.icon}</svg>
              {i === 2 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
              )}
              <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded bg-black border border-white/10 text-[9px] uppercase tracking-widest text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                {t.label}
              </span>
            </button>
          ))}
          <div className="mt-auto w-9 h-9 rounded-lg flex items-center justify-center text-white/25">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>

        {/* ── main column ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
          {/* top bar */}
          <div className="h-13 min-h-[52px] border-b border-white/10 flex items-center justify-between gap-3 px-3 sm:px-5 bg-black/20">
            <div className="hidden lg:flex items-center space-x-2 text-[10px] uppercase tracking-widest font-mono min-w-0">
              <span className="text-white/40">Workspace</span>
              <span className="text-white/20">/</span>
              <span className="text-white/40">Global Routing</span>
              <span className="text-white/20">/</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-white/60 lg:hidden truncate">
              {TABS.find(t => t.id === tab)?.label}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {tab === 'ledger' && (
                <div className="relative min-w-0">
                  <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-32 sm:w-44 md:w-56 bg-black/40 border border-white/10 rounded pl-8 pr-2 py-1.5 text-[11px] text-white placeholder-white/25 focus:outline-none focus:border-emerald-400/40 transition-colors"
                    placeholder="Search BOL, client, port…"
                    aria-label="Search ledger"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-3 shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 border border-white/10 flex items-center justify-center text-[10px] font-semibold">AM</div>
                <div className="hidden sm:block text-right">
                  <div className="text-[11px] font-medium leading-tight">A. Mercer</div>
                  <div className="text-[8px] text-white/40 uppercase tracking-wider">Admin</div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI strip — always visible */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10 bg-black/10 divide-x divide-white/10 shrink-0">
            {[
              { label: 'Volume (TEU)', value: '34,290', accent: 'text-white' },
              { label: 'Clearances', value: '142', accent: 'text-white' },
              { label: 'Ledger Value', value: '$' + fmt(totalValue / 1000) + 'k', accent: 'text-emerald-400' },
              { label: 'Jurisdictions', value: '14', accent: 'text-white' },
            ].map(k => (
              <div key={k.label} className="px-3 sm:px-5 py-2.5 sm:py-3">
                <div className="text-[8px] sm:text-[9px] text-white/40 tracking-widest uppercase">{k.label}</div>
                <div className={`text-lg sm:text-2xl font-light ${k.accent}`}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* tab content */}
          <div className="flex-1 overflow-hidden min-h-[380px] sm:min-h-[440px] relative" dir="ltr">
            <AnimatePresence mode="wait">
              {/* ══ LEDGER ══ */}
              {tab === 'ledger' && (
                <motion.div
                  key="ledger"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easings.cinematic }}
                  className="absolute inset-0 flex flex-col min-h-0"
                >
                  <div className="px-3 sm:px-5 py-2 flex items-center justify-between border-b border-white/10 bg-black/10 shrink-0">
                    <span className="text-[9px] text-white/40 tracking-widest uppercase font-mono">Live Clearance Ledger — {rows.length} shipments</span>
                    <button
                      type="button"
                      onClick={() => {
                        const header = 'BOL,CONSIGNEE,HS CODE,ORIGIN,DESTINATION,VALUE,STATUS,ETA,VESSEL'
                        const csv = [header, ...rows.map(r => [r.bol, r.consignee, r.hs, r.origin, r.destination, r.value, r.status, r.eta, r.vessel].join(','))].join('\n')
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url; a.download = 'exvorta-ledger.csv'; a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="text-[9px] text-white/60 hover:text-emerald-400 uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded transition-colors"
                    >
                      Export
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [overscroll-behavior-x:contain]">
                    <table className="w-full text-left text-[11px] whitespace-nowrap min-w-[640px]">
                      <thead className="text-[8px] text-white/45 uppercase tracking-widest bg-[#10151B] sticky top-0 z-10">
                        <tr>
                          <th scope="col" aria-sort={sortKey === 'bol' ? (sortAsc ? 'ascending' : 'descending') : undefined} aria-label="Sort by BOL" className="px-3 sm:px-4 py-2.5 font-normal border-b border-white/5 cursor-pointer hover:text-white/60" onClick={() => setSort('bol')}>BOL {sortKey === 'bol' && (sortAsc ? '↑' : '↓')}</th>
                          <th className="px-3 sm:px-4 py-2.5 font-normal border-b border-white/5">Consignee</th>
                          <th className="px-3 sm:px-4 py-2.5 font-normal border-b border-white/5 hidden md:table-cell">HS Code</th>
                          <th className="px-3 sm:px-4 py-2.5 font-normal border-b border-white/5 hidden lg:table-cell">Route</th>
                          <th scope="col" aria-sort={sortKey === 'value' ? (sortAsc ? 'ascending' : 'descending') : undefined} aria-label="Sort by value" className="px-3 sm:px-4 py-2.5 font-normal border-b border-white/5 text-right cursor-pointer hover:text-white/60" onClick={() => setSort('value')}>Value {sortKey === 'value' && (sortAsc ? '↑' : '↓')}</th>
                          <th scope="col" aria-sort={sortKey === 'status' ? (sortAsc ? 'ascending' : 'descending') : undefined} aria-label="Sort by status" className="px-3 sm:px-4 py-2.5 font-normal border-b border-white/5 text-right cursor-pointer hover:text-white/60" onClick={() => setSort('status')}>Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-white/70 font-mono">
                        {rows.map((r, i) => (
                          <tr
                            key={r.bol}
                            tabIndex={0}
                            aria-selected={selected?.bol === r.bol}
                            onClick={() => setSelected(r)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(r) } }}
                            className={`hover:bg-white/5 cursor-pointer transition-colors ${selected?.bol === r.bol ? 'bg-emerald-500/5' : ''}`}
                            style={prefersReducedMotion ? undefined : { animation: `osrow 0.4s ease both`, animationDelay: `${i * 40}ms` }}
                          >
                            <td className="px-3 sm:px-4 py-2.5 text-white">{r.bol}</td>
                            <td className="px-3 sm:px-4 py-2.5">{r.consignee}</td>
                            <td className="px-3 sm:px-4 py-2.5 text-white/40 hidden md:table-cell">{r.hs}</td>
                            <td className="px-3 sm:px-4 py-2.5 hidden lg:table-cell">
                              <span className="text-white/80">{r.origin.split(' ')[0]}</span>
                              <span className="text-white/25"> → </span>
                              <span className="text-white/80">{r.destination.split(' ')[0]}</span>
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 text-right">${fmt(r.value)}</td>
                            <td className="px-3 sm:px-4 py-2.5 text-right">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                            </td>
                          </tr>
                        ))}
                        {rows.length === 0 && (
                          <tr><td colSpan={6} className="px-4 py-8 text-center text-white/45 font-mono text-[10px]">NO MATCHING SHIPMENTS</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 sm:px-5 py-1.5 border-t border-white/10 bg-black/20 text-[8px] text-white/45 font-mono tracking-widest uppercase shrink-0">
                    Click a row to inspect · sorted by {sortKey} {sortAsc ? 'asc' : 'desc'}
                  </div>
                </motion.div>
              )}

              {/* ══ TERMINAL ══ */}
              {tab === 'terminal' && (
                <motion.div
                  key="terminal"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easings.cinematic }}
                  className="absolute inset-0 flex flex-col min-h-0"
                >
                  {!prefersReducedMotion && (
                    <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 h-14 z-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.06), transparent)' }} animate={{ top: ['-15%', '115%'] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }} />
                  )}
                  <div className="px-3 sm:px-5 py-2 border-b border-white/10 bg-black/10 flex items-center justify-between shrink-0">
                    <span className="text-[9px] text-white/40 tracking-widest uppercase font-mono flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                      Operations Feed — realtime
                    </span>
                    <span className="text-[8px] text-white/40 font-mono">stream: global</span>
                  </div>
                  <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [overscroll-behavior-y:contain] p-3 sm:p-4 space-y-3 font-mono text-[10px] sm:text-[11px]">
                    {TERMINAL_SCRIPT.slice(0, terminalCount).map((entry, i) => {
                      const color =
                        entry.kind === 'ok' ? 'border-emerald-400/40' :
                        entry.kind === 'info' ? 'border-sky-400/40' :
                        entry.kind === 'warn' ? 'border-amber-400/40' : 'border-white/10'
                      const stamp = new Date(Date.now() - (terminalCount - i) * 60000)
                      const time = [stamp.getUTCHours(), stamp.getUTCMinutes(), stamp.getUTCSeconds()].map(n => String(n).padStart(2, '0')).join(':')
                      return (
                        <motion.div
                          key={`${i}-${entry.t}`}
                          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, ease: easings.cinematic }}
                          className={`border-l-2 ${color} pl-3 ${i === terminalCount - 1 ? '' : 'opacity-80'}`}
                        >
                          <div className="text-white/45 mb-0.5">[{time} UTC]</div>
                          <div className="text-white/85">{entry.t}</div>
                          <div className={entry.kind === 'ok' ? 'text-emerald-400/80 mt-0.5' : entry.kind === 'warn' ? 'text-amber-400/80 mt-0.5' : entry.kind === 'info' ? 'text-sky-400/80 mt-0.5' : 'text-white/40 mt-0.5'}>{entry.ref}</div>
                        </motion.div>
                      )
                    })}
                    <div className="flex items-center gap-1 text-emerald-400/70 font-mono text-[10px] pl-3">
                      <span>▍</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ COMPLIANCE ══ */}
              {tab === 'compliance' && (
                <motion.div
                  key="compliance"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easings.cinematic }}
                  className="absolute inset-0 flex flex-col min-h-0"
                >
                  <div className="px-3 sm:px-5 py-2 border-b border-white/10 bg-black/10 shrink-0">
                    <span className="text-[9px] text-white/40 tracking-widest uppercase font-mono">Compliance Health — 14 jurisdictions</span>
                  </div>
                  <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [overscroll-behavior-y:contain] p-3 sm:p-5 space-y-3">
                    {COMPLIANCE.map((c, i) => (
                      <motion.div
                        key={c.name}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, delay: i * 0.07, ease: easings.cinematic }}
                        className="border border-white/10 bg-white/[0.03] rounded-lg p-3 sm:p-4 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs sm:text-sm text-white/85 font-medium">{c.name}</span>
                          <span className={`text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                            c.pct === 100 ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                            c.pct > 90 ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' :
                            'text-orange-400 border-orange-400/20 bg-orange-400/10'
                          }`}>{c.status}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-2">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            initial={prefersReducedMotion ? { width: `${c.pct}%` } : { width: 0 }}
                            animate={{ width: `${c.pct}%` }}
                            transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: easings.cinematic }}
                          />
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-white/40 font-mono">{c.detail}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ══ ANALYTICS ══ */}
              {tab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easings.cinematic }}
                  className="absolute inset-0 flex flex-col min-h-0"
                >
                  <div className="px-3 sm:px-5 py-2 border-b border-white/10 bg-black/10 shrink-0">
                    <span className="text-[9px] text-white/40 tracking-widest uppercase font-mono">Trade Analytics — trailing 12 months</span>
                  </div>
                  <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [overscroll-behavior-y:contain] p-3 sm:p-5 space-y-6 min-h-0">
                    {/* bar chart */}
                    <div>
                      <div className="text-[9px] text-white/40 tracking-widest uppercase mb-3">Throughput (k TEU)</div>
                      <div className="flex items-end gap-1 sm:gap-1.5 h-28 sm:h-36">
                        {VOLUME_SERIES.map((v, i) => (
                          <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                            <motion.div
                              className="w-full rounded-t-sm bg-gradient-to-t from-emerald-600/40 to-emerald-400/80 group-hover:from-emerald-500/60 group-hover:to-emerald-300 transition-colors"
                              initial={prefersReducedMotion ? { height: `${v}%` } : { height: 0 }}
                              animate={{ height: `${v}%` }}
                              transition={{ duration: 0.6, delay: i * 0.045, ease: easings.cinematic }}
                            />
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] text-emerald-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[7px] text-white/40 font-mono mt-1.5">
                        <span>JAN</span><span className="hidden sm:inline">MAR</span><span className="hidden sm:inline">MAY</span><span className="hidden sm:inline">JUL</span><span className="hidden sm:inline">SEP</span><span>DEC</span>
                      </div>
                    </div>
                    {/* lanes */}
                    <div>
                      <div className="text-[9px] text-white/40 tracking-widest uppercase mb-3">Top Lanes</div>
                      <div className="space-y-2.5">
                        {LANES.map((l, i) => (
                          <div key={l.route}>
                            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono mb-1">
                              <span className="text-white/70">{l.route}</span>
                              <span className="text-white/40">{l.vol}</span>
                            </div>
                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-sky-500/70 to-emerald-400"
                                initial={prefersReducedMotion ? { width: `${l.pct * 3}%` } : { width: 0 }}
                                animate={{ width: `${l.pct * 3}%` }}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: easings.cinematic }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ DOCS ══ */}
              {tab === 'docs' && (
                <motion.div
                  key="docs"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easings.cinematic }}
                  className="absolute inset-0 flex flex-col min-h-0"
                >
                  <div className="px-3 sm:px-5 py-2 border-b border-white/10 bg-black/10 flex items-center justify-between shrink-0">
                    <span className="text-[9px] text-white/40 tracking-widest uppercase font-mono">Document Engine — auto-generated</span>
                    <span className="text-[8px] text-emerald-400 font-mono border border-emerald-400/20 px-1.5 py-0.5 rounded">AI</span>
                  </div>
                  <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [overscroll-behavior-y:contain] p-3 sm:p-5 space-y-2">
                    {DOCS.map((d, i) => (
                      <motion.div
                        key={d.name}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06, ease: easings.cinematic }}
                        className="flex items-center gap-3 border border-white/10 bg-white/[0.03] rounded-lg px-3 sm:px-4 py-3 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03] transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-white/40 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] sm:text-[11px] text-white/85 truncate font-mono">{d.name}</div>
                          <div className="text-[8px] text-white/35 font-mono mt-0.5">{d.size} · {d.when}</div>
                        </div>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${d.gen === 'AI' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-sky-400 border-sky-400/20 bg-sky-400/10'}`}>{d.gen}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-3 sm:px-5 py-1.5 border-t border-white/10 bg-black/20 text-[8px] text-white/45 font-mono tracking-widest uppercase shrink-0">
                    Every document generated, verified and archived automatically
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── mobile tab bar ── */}
      <div className="md:hidden border-t border-white/10 bg-black/40 flex shrink-0" dir="ltr">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-label={t.label}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[7px] uppercase tracking-widest transition-colors ${
              tab === t.id ? 'text-emerald-400' : 'text-white/30'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{t.icon}</svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── shipment detail drawer ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="absolute inset-0 bg-black/60 z-30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#0D1218] border-l border-white/15 z-40 flex flex-col shadow-2xl"
              initial={prefersReducedMotion ? { x: 0 } : { x: '100%' }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? { x: 0 } : { x: '100%' }}
              transition={{ duration: 0.35, ease: easings.cinematic }}
            >
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-black/30 shrink-0">
                <span className="text-[10px] tracking-widest uppercase font-mono text-white/50">Shipment — <span className="text-white">{selected.bol}</span></span>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="w-7 h-7 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [overscroll-behavior-y:contain] p-4 sm:p-5 space-y-4 font-mono text-[11px]">
                <div className={`text-[9px] px-2 py-1 rounded border inline-block ${STATUS_STYLES[selected.status]}`}>{selected.status}</div>
                {[
                  ['Consignee', selected.consignee],
                  ['Vessel', selected.vessel],
                  ['HS Code', selected.hs],
                  ['Origin', selected.origin],
                  ['Destination', selected.destination],
                  ['Est. Value', '$' + fmt(selected.value)],
                  ['ETA', selected.eta === '—' ? 'On hold' : `${selected.eta} days`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <span className="text-white/35 uppercase text-[9px] tracking-widest">{k}</span>
                    <span className="text-white/85 text-right">{v}</span>
                  </div>
                ))}
                <div className="pt-2 space-y-2">
                  <div className="text-[9px] text-white/35 uppercase tracking-widest mb-1">Milestones</div>
                  {[
                    ['Booking confirmed', true],
                    ['Origin customs cleared', selected.status !== 'PENDING KYC' && selected.status !== 'CUSTOMS HOLD'],
                    ['Departed origin port', selected.status === 'IN TRANSIT' || selected.status === 'CLEARED'],
                    ['Vessel in transit', selected.status === 'IN TRANSIT'],
                    ['Destination customs cleared', selected.status === 'CLEARED'],
                  ].map(([label, done], i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${done ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400' : 'border-white/15 text-transparent'}`}>✓</span>
                      <span className={`text-[10px] ${done ? 'text-white/70' : 'text-white/30'}`}>{label as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 sm:px-5 py-3 border-t border-white/10 bg-black/30 shrink-0">
                <div className="text-[8px] text-white/45 font-mono tracking-widest uppercase text-center">Demo data — your data lives here in your panel</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default ExvortaOsPanel
