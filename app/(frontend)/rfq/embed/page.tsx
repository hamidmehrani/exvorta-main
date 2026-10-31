'use client'

import React, { Suspense, useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitRFQ } from '@/app/(frontend)/actions/submitRFQ'
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/forms/TurnstileWidget'

interface Product {
  id: string
  name: string
  unit: string
  moq: number
}

interface Catalog {
  slug: string
  name: string
  products: Product[]
}

const INCOTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP', 'DDP', 'CIP', 'FCA'] as const

function RFQEmbedWidget() {
  const searchParams = useSearchParams()
  const catalogParam = searchParams.get('catalog')
  const catalogSlug = catalogParam && catalogParam.trim() ? catalogParam.trim() : 'example'

  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [incoterm, setIncoterm] = useState<string>('FOB')
  const [destinationPort, setDestinationPort] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [notes, setNotes] = useState('')
  const [botField, setBotField] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Report height via postMessage to parent container
  const reportHeight = useCallback(() => {
    if (typeof window !== 'undefined' && window.parent) {
      const height = document.documentElement.scrollHeight
      window.parent.postMessage({ type: 'rfq-embed-resize', height }, '*')
    }
  }, [])

  // Minimal chrome & height reporting on mount and window resize
  useEffect(() => {
    document.documentElement.classList.add('rfq-embed-mode')
    reportHeight()

    const onResize = () => reportHeight()
    window.addEventListener('resize', onResize)

    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      observer = new ResizeObserver(() => reportHeight())
      observer.observe(document.body)
    }

    return () => {
      document.documentElement.classList.remove('rfq-embed-mode')
      window.removeEventListener('resize', onResize)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [reportHeight])

  // Trigger postMessage when quantities, status, or catalog changes
  useEffect(() => {
    reportHeight()
    const timer = setTimeout(reportHeight, 40)
    return () => clearTimeout(timer)
  }, [catalog, quantities, isSubmitting, success, error, reportHeight])

  // Fetch catalog JSON on mount or when catalogSlug changes
  useEffect(() => {
    let active = true
    setIsLoadingCatalog(true)
    setCatalogError(null)

    const fetchCatalog = async () => {
      try {
        const safeSlug = encodeURIComponent(catalogSlug)
        const res = await fetch(`/rfq-catalogs/${safeSlug}.json`)
        if (!res.ok) {
          throw new Error(`Catalog "${catalogSlug}" not found (${res.status})`)
        }
        const data: Catalog = await res.json()
        if (!active) return

        if (!data || !Array.isArray(data.products)) {
          throw new Error('Invalid catalog format')
        }

        setCatalog(data)
        // Initialize quantities to 0
        const initialQty: Record<string, number> = {}
        data.products.forEach(p => {
          initialQty[p.id] = 0
        })
        setQuantities(initialQty)
      } catch (err) {
        if (!active) return
        setCatalogError(err instanceof Error ? err.message : 'Failed to load catalog')
      } finally {
        if (active) {
          setIsLoadingCatalog(false)
          reportHeight()
        }
      }
    }

    fetchCatalog()

    return () => {
      active = false
    }
  }, [catalogSlug, reportHeight])

  // Stepper quantity handlers
  const handleQuantityIncrement = (product: Product) => {
    setQuantities(prev => {
      const current = prev[product.id] || 0
      const next = current === 0 ? product.moq : current + 1
      return { ...prev, [product.id]: next }
    })
  }

  const handleQuantityDecrement = (product: Product) => {
    setQuantities(prev => {
      const current = prev[product.id] || 0
      if (current <= product.moq) {
        return { ...prev, [product.id]: 0 }
      }
      return { ...prev, [product.id]: current - 1 }
    })
  }

  const handleQuantityInputChange = (product: Product, rawValue: string) => {
    const parsed = parseInt(rawValue, 10)
    const val = isNaN(parsed) || parsed < 0 ? 0 : parsed
    setQuantities(prev => ({ ...prev, [product.id]: val }))
  }

  const handleQuantityInputBlur = (product: Product) => {
    setQuantities(prev => {
      const current = prev[product.id] || 0
      if (current > 0 && current < product.moq) {
        return { ...prev, [product.id]: product.moq }
      }
      return prev
    })
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!catalog) {
      setError('No catalog loaded.')
      return
    }

    // Collect selected items (quantity >= MOQ)
    const selectedItems = catalog.products
      .filter(p => (quantities[p.id] || 0) >= p.moq)
      .map(p => ({
        id: p.id,
        name: p.name,
        unit: p.unit,
        moq: p.moq,
        quantity: quantities[p.id] || 0,
      }))

    if (selectedItems.length === 0) {
      setError('Please select at least one product with minimum order quantity (MOQ).')
      return
    }

    // Check if any product has partial quantity below MOQ
    for (const p of catalog.products) {
      const q = quantities[p.id] || 0
      if (q > 0 && q < p.moq) {
        setError(`Minimum order quantity for ${p.name} is ${p.moq} ${p.unit}.`)
        return
      }
    }

    // Validate Contact Fields
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Please enter your full name.')
      return
    }
    if (trimmedName.length > 100) {
      setError('Name cannot exceed 100 characters.')
      return
    }

    const trimmedEmail = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid business email address.')
      return
    }
    if (trimmedEmail.length > 254) {
      setError('Email address is too long.')
      return
    }

    const trimmedCompany = companyName.trim()
    if (trimmedCompany.length > 100) {
      setError('Company name cannot exceed 100 characters.')
      return
    }

    setIsSubmitting(true)

    // Format message strictly matching requirement:
    // [RFQ Embed Request]\nCatalog: ${catalog}\nIncoterm: ${incoterm}\nDestination Port: ${port}\n\nSelected Products:\n${items.map(i => `- ${i.name} (${i.id}): ${i.quantity} ${i.unit} (MOQ: ${i.moq})`).join('\n')}\n\nNotes: ${notes}
    const formattedPort = destinationPort.trim()
    const formattedNotes = notes.trim()
    const formattedProducts = selectedItems
      .map(i => `- ${i.name} (${i.id}): ${i.quantity} ${i.unit} (MOQ: ${i.moq})`)
      .join('\n')

    const message = `[RFQ Embed Request]\nCatalog: ${catalogSlug}\nIncoterm: ${incoterm}\nDestination Port: ${formattedPort}\n\nSelected Products:\n${formattedProducts}\n\nNotes: ${formattedNotes}`

    try {
      const res = await submitRFQ({
        name: trimmedName,
        email: trimmedEmail,
        companyName: trimmedCompany || undefined,
        message,
        botField: botField || undefined,
        turnstileToken,
      })

      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || 'Failed to submit quote request.')
        turnstileRef.current?.reset()
        setTurnstileToken(undefined)
      }
    } catch {
      setError('An unexpected network error occurred. Please try again.')
      turnstileRef.current?.reset()
      setTurnstileToken(undefined)
    } finally {
      setIsSubmitting(false)
      reportHeight()
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setError(null)
    turnstileRef.current?.reset()
    setTurnstileToken(undefined)
    if (catalog) {
      const initialQty: Record<string, number> = {}
      catalog.products.forEach(p => {
        initialQty[p.id] = 0
      })
      setQuantities(initialQty)
    }
    setDestinationPort('')
    setNotes('')
    reportHeight()
  }

  // 1. Loading Catalog State
  if (isLoadingCatalog) {
    return (
      <div className="w-full bg-cream text-obsidian p-6 sm:p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-obsidian/20 border-t-obsidian mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Loading Catalog [{catalogSlug}]...
        </span>
      </div>
    )
  }

  // 2. Catalog Error State
  if (catalogError || !catalog) {
    return (
      <div className="w-full bg-cream text-obsidian p-6 sm:p-8">
        <div className="border border-danger/30 bg-danger/5 p-6 text-center space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest font-semibold text-danger">
            [ ERROR: {catalogError || 'Catalog not found'} ]
          </p>
          <p className="text-xs text-muted">
            Unable to load catalog &quot;{catalogSlug}&quot;. Please verify the query parameter or contact the catalog provider.
          </p>
        </div>
      </div>
    )
  }

  // 3. Success Confirmation Screen
  if (success) {
    return (
      <div ref={containerRef} className="w-full bg-cream text-obsidian p-4 sm:p-6">
        <div className="bg-surface border border-rule p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald/10 border border-emerald flex items-center justify-center text-emerald">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-emerald font-bold">
            [ RFQ SUBMISSION CONFIRMED ]
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-obsidian">
            Quote Request Received
          </h2>
          <p className="font-mono text-xs text-muted max-w-md leading-relaxed tracking-wide">
            Your request for <span className="text-obsidian font-semibold">{catalog.name}</span> has been securely transmitted. Our trade logistics team will prepare a scoped quote and initiate contact within 24 hours.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 border border-rule hover:border-obsidian text-obsidian font-mono text-xs uppercase tracking-widest bg-surface transition-colors"
            >
              [ Submit Another Request ]
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedCount = catalog.products.filter(p => (quantities[p.id] || 0) >= p.moq).length

  // 4. Main Cart & Form UI
  return (
    <div ref={containerRef} className="w-full bg-cream text-obsidian p-3 sm:p-6">
      <div className="bg-surface border border-rule shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 sm:p-6 space-y-6">
        {/* Header / Catalog Details */}
        <div className="border-b border-rule pb-4">
          <div className="flex items-center justify-between text-muted font-mono text-[10px] uppercase tracking-widest mb-1.5">
            <span>[ RFQ CART WIDGET ]</span>
            <span>CATALOG: {catalog.slug}</span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-obsidian">
            {catalog.name}
          </h1>
          <p className="font-mono text-[11px] text-muted tracking-wide mt-1">
            Configure order quantities and commercial delivery terms below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field for bot trapping */}
          <div
            aria-hidden="true"
            className="absolute opacity-0 -z-50 pointer-events-none h-0 w-0 overflow-hidden"
            tabIndex={-1}
          >
            <label htmlFor="rfq-botField">Do not fill this field</label>
            <input
              id="rfq-botField"
              name="botField"
              type="text"
              autoComplete="off"
              tabIndex={-1}
              value={botField}
              onChange={e => setBotField(e.target.value)}
            />
          </div>

          {/* Section 01: Product Selection */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
                01. Products & Quantities
              </span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                {selectedCount} item{selectedCount === 1 ? '' : 's'} selected
              </span>
            </div>

            <div className="divide-y divide-rule border border-rule bg-surface-2/40">
              {catalog.products.map(product => {
                const qty = quantities[product.id] || 0
                const isSelected = qty >= product.moq
                const isUnderMOQ = qty > 0 && qty < product.moq

                return (
                  <div
                    key={product.id}
                    className={`p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isSelected ? 'bg-surface' : 'bg-transparent'
                    }`}
                  >
                    <div className="space-y-1 text-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-obsidian">
                          {product.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                          ({product.id})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
                        <span>Unit: {product.unit}</span>
                        <span>•</span>
                        <span>MOQ: {product.moq} {product.unit}</span>
                        {isUnderMOQ && (
                          <span className="text-danger font-semibold">
                            (Min: {product.moq})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        disabled={qty === 0 || isSubmitting}
                        onClick={() => handleQuantityDecrement(product)}
                        className="w-8 h-8 flex items-center justify-center border border-rule bg-surface text-obsidian hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm transition-colors"
                      >
                        –
                      </button>

                      <input
                        type="number"
                        min="0"
                        aria-label={`Quantity of ${product.name} in ${product.unit}`}
                        value={qty}
                        disabled={isSubmitting}
                        onChange={e => handleQuantityInputChange(product, e.target.value)}
                        onBlur={() => handleQuantityInputBlur(product)}
                        className="w-20 h-8 text-center border-y border-rule bg-surface font-mono text-xs text-obsidian focus:outline-none focus:border-emerald"
                      />

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        disabled={isSubmitting}
                        onClick={() => handleQuantityIncrement(product)}
                        className="w-8 h-8 flex items-center justify-center border border-rule bg-surface text-obsidian hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm transition-colors"
                      >
                        +
                      </button>

                      <span className="font-mono text-[11px] text-muted ms-2 min-w-8 text-start">
                        {product.unit}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Section 02: Logistics & Commercial Terms */}
          <section className="space-y-3">
            <div className="border-b border-rule pb-2">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
                02. Logistics & Commercial Terms
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rfq-incoterm"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5 text-start"
                >
                  Incoterm
                </label>
                <select
                  id="rfq-incoterm"
                  value={incoterm}
                  disabled={isSubmitting}
                  onChange={e => setIncoterm(e.target.value)}
                  className="w-full h-10 px-3 border border-rule bg-surface text-obsidian font-mono text-xs focus:outline-none focus:border-emerald"
                >
                  {INCOTERMS.map(term => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="rfq-port"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5 text-start"
                >
                  Destination Port / Terminal
                </label>
                <input
                  id="rfq-port"
                  type="text"
                  placeholder="e.g. Rotterdam, Jebel Ali, Hamburg"
                  value={destinationPort}
                  disabled={isSubmitting}
                  onChange={e => setDestinationPort(e.target.value)}
                  className="w-full h-10 px-3 border border-rule bg-surface text-obsidian text-xs focus:outline-none focus:border-emerald placeholder:text-muted/60"
                />
              </div>
            </div>
          </section>

          {/* Section 03: Contact & Company Details */}
          <section className="space-y-3">
            <div className="border-b border-rule pb-2">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-obsidian">
                03. Contact Information
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rfq-name"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5 text-start"
                >
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  id="rfq-name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Contact Name"
                  value={name}
                  disabled={isSubmitting}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-10 px-3 border border-rule bg-surface text-obsidian text-xs focus:outline-none focus:border-emerald placeholder:text-muted/60"
                />
              </div>

              <div>
                <label
                  htmlFor="rfq-email"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5 text-start"
                >
                  Business Email <span className="text-danger">*</span>
                </label>
                <input
                  id="rfq-email"
                  type="email"
                  required
                  maxLength={254}
                  placeholder="name@company.com"
                  value={email}
                  disabled={isSubmitting}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-rule bg-surface text-obsidian text-xs focus:outline-none focus:border-emerald placeholder:text-muted/60"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="rfq-company"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5 text-start"
                >
                  Company Name (Optional)
                </label>
                <input
                  id="rfq-company"
                  type="text"
                  maxLength={100}
                  placeholder="Official registered company name"
                  value={companyName}
                  disabled={isSubmitting}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full h-10 px-3 border border-rule bg-surface text-obsidian text-xs focus:outline-none focus:border-emerald placeholder:text-muted/60"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="rfq-notes"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5 text-start"
                >
                  Additional Notes / Specifications (Optional)
                </label>
                <textarea
                  id="rfq-notes"
                  rows={3}
                  placeholder="Specify packaging requirements, target delivery window, or certifications required."
                  value={notes}
                  disabled={isSubmitting}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-3 border border-rule bg-surface text-obsidian text-xs focus:outline-none focus:border-emerald resize-none placeholder:text-muted/60"
                />
              </div>
            </div>
          </section>

          {/* Turnstile verification */}
          <div className="flex justify-center pt-2">
            <TurnstileWidget
              ref={turnstileRef}
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken(undefined)}
            />
          </div>

          {/* Error Message Alert */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 border border-danger/30 bg-danger/5 text-center font-mono text-[11px] font-bold text-danger uppercase tracking-wider"
            >
              [ ERROR: {error} ]
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-center justify-center font-mono text-xs uppercase tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-3.5 w-3.5 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  [ TRANSMITTING QUOTE REQUEST... ]
                </span>
              ) : (
                `[ REQUEST QUOTE (${selectedCount} ITEM${selectedCount === 1 ? '' : 'S'}) ]`
              )}
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
              Direct institutional quotation • Response within 24 business hours
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RFQEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-cream text-obsidian p-6 sm:p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-obsidian/20 border-t-obsidian mb-4" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            Initializing RFQ Widget...
          </span>
        </div>
      }
    >
      <RFQEmbedWidget />
    </Suspense>
  )
}
