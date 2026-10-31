'use client';

import React, { useState, useTransition, useEffect, useMemo } from 'react';
import { ToolShareBand } from '@/components/tools/ToolShareBand';
import { formatDocGenShareText } from '@/lib/tools/share';
import {
  type DocType,
  type DocLang,
  type DocLineItem,
  type ExportDocData,
  INCOTERMS,
  COMMON_CURRENCIES,
  COMMON_UNITS,
  calculateLineTotal,
  calculateDocTotals,
  formatCurrency,
  formatWeight,
  getVisibleFields,
  getTranslation,
  createEmptyLineItem,
  createDefaultDoc,
} from '@/lib/tools/docgen';
import { submitWaitlist } from '@/actions/submitWaitlist';
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/forms/TurnstileWidget';

// Default sensible demo data populated on top of createDefaultDoc
const INITIAL_DEMO_DATA: Partial<ExportDocData> = {
  docNumber: 'INV-2026-0842',
  date: new Date().toISOString().split('T')[0],
  currency: 'USD',
  incoterm: 'CIF',
  incotermLocation: 'Rotterdam, Netherlands',
  seller: {
    name: 'Apex Global Traders FZE',
    address: 'Building A3, Dubai CommerCity, Umm Ramool',
    taxId: 'TRN-10029482010003',
    country: 'United Arab Emirates',
    phone: '+971 4 881 9200',
    email: 'ops@apex-traders.ae',
  },
  buyer: {
    name: 'Rotterdam Bulk Logistics B.V.',
    address: 'Havenstraat 45, 3011 AL',
    taxId: 'NL882910482B01',
    country: 'Netherlands',
    phone: '+31 10 404 1234',
    email: 'import@rotterdam-logistics.nl',
  },
  carrier: {
    name: 'Al-Masar Intermodal Freight LLC',
    address: 'Port Rashid, Logistics Terminal 4, Dubai',
    vehicleReg: 'DXB-99210-T',
    driverName: 'Tariq Mansoor',
  },
  origin: 'Jebel Ali Port (AE JEA), UAE',
  destination: 'Port of Rotterdam (NL RTM), Netherlands',
  vesselOrFlightOrVehicle: 'MSC PALOMA / V-2604W',
  blOrAwbOrConsignmentNo: 'BL-DXB-902184',
  paymentTerms: '30 Days Net from B/L Date',
  notes: 'Goods are non-hazardous, packed on heat-treated ISPM-15 wooden pallets.',
  items: [
    {
      id: 'item-1',
      description: 'Premium Industrial Grade Polymer Pellets (Grade A-100)',
      hsCode: '3901.10.10',
      quantity: 24,
      unit: 'MT',
      unitPrice: 1250,
      netWeightKg: 24000,
      grossWeightKg: 24480,
      packagesCount: 24,
      packageType: 'PALLET',
      volumeCbm: 38.4,
    },
    {
      id: 'item-2',
      description: 'High-Density Polyethylene Granules (HDPE Resin)',
      hsCode: '3901.20.00',
      quantity: 10,
      unit: 'MT',
      unitPrice: 1420,
      netWeightKg: 10000,
      grossWeightKg: 10200,
      packagesCount: 10,
      packageType: 'PALLET',
      volumeCbm: 16.0,
    },
  ],
  options: {
    taxRate: 5,
    shippingFee: 1850,
    discount: 500,
  },
};

export default function DocsGeneratorPage() {
  const [doc, setDoc] = useState<ExportDocData>(() => ({
    ...createDefaultDoc('commercial-invoice'),
    ...INITIAL_DEMO_DATA,
    seller: { ...createDefaultDoc().seller, ...INITIAL_DEMO_DATA.seller },
    buyer: { ...createDefaultDoc().buyer, ...INITIAL_DEMO_DATA.buyer },
    carrier: { ...createDefaultDoc().carrier, ...INITIAL_DEMO_DATA.carrier },
    options: { ...createDefaultDoc().options, ...INITIAL_DEMO_DATA.options },
  }));

  const [lang, setLang] = useState<DocLang>('en');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [activeSection, setActiveSection] = useState<'header' | 'parties' | 'logistics' | 'items' | 'totals'>('header');

  // Email capture state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [captureEmail, setCaptureEmail] = useState('');
  const [captureName, setCaptureName] = useState('');
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [captureError, setCaptureError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const turnstileRef = React.useRef<TurnstileWidgetRef>(null);
  const [isCapturing, startCaptureTransition] = useTransition();

  const totals = calculateDocTotals(doc.items, doc.options);
  const visible = getVisibleFields(doc.docType);

  const t = (key: Parameters<typeof getTranslation>[0]) => getTranslation(key, lang);

  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareText = useMemo(() => {
    const permalink = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const docTypeLabel = doc.docType === 'commercial-invoice'
      ? t('commercialInvoiceTitle')
      : doc.docType === 'packing-list'
      ? t('packingListTitle')
      : t('cmrTitle');
    return formatDocGenShareText({
      docType: docTypeLabel,
      docNumber: doc.docNumber,
      permalink,
      lang,
    });
  }, [doc.docType, doc.docNumber, lang, currentUrl]);

  // Field change handlers
  const updateDoc = <K extends keyof ExportDocData>(field: K, value: ExportDocData[K]) => {
    setDoc((prev) => ({ ...prev, [field]: value }));
  };

  const updateSeller = (field: keyof ExportDocData['seller'], value: string) => {
    setDoc((prev) => ({
      ...prev,
      seller: { ...prev.seller, [field]: value },
    }));
  };

  const updateBuyer = (field: keyof ExportDocData['buyer'], value: string) => {
    setDoc((prev) => ({
      ...prev,
      buyer: { ...prev.buyer, [field]: value },
    }));
  };

  const updateCarrier = (field: keyof NonNullable<ExportDocData['carrier']>, value: string) => {
    setDoc((prev) => ({
      ...prev,
      carrier: { ...prev.carrier, [field]: value },
    }));
  };

  const updateOptions = (field: keyof NonNullable<ExportDocData['options']>, value: number) => {
    setDoc((prev) => ({
      ...prev,
      options: { ...prev.options, [field]: value },
    }));
  };

  // Line item manipulation
  const updateLineItem = (id: string, field: keyof DocLineItem, value: string | number) => {
    setDoc((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const addLineItem = () => {
    setDoc((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyLineItem()],
    }));
  };

  const removeLineItem = (id: string) => {
    setDoc((prev) => {
      if (prev.items.length <= 1) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      };
    });
  };

  // Switch document type
  const handleDocTypeChange = (type: DocType) => {
    setDoc((prev) => ({
      ...prev,
      docType: type,
    }));
  };

  // Trigger print
  const handlePrint = () => {
    window.print();
  };

  // Handle email save & send submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureEmail.trim()) {
      setCaptureError('Please provide a valid email address.');
      setCaptureStatus('error');
      return;
    }

    setCaptureStatus('idle');
    setCaptureError('');

    startCaptureTransition(async () => {
      try {
        const result = await submitWaitlist({
          email: captureEmail.trim(),
          source: 'Waitlist',
          company: captureName.trim() || undefined,
          turnstileToken,
          payload: {
            source: 'Docs-Generator',
            name: captureName.trim(),
            docType: doc.docType,
            docNumber: doc.docNumber,
            currency: doc.currency,
            itemsCount: doc.items.length,
            grandTotal: totals.grandTotal,
            issuedAt: new Date().toISOString(),
          },
        });

        if (result.success) {
          setCaptureStatus('success');
        } else {
          setCaptureStatus('error');
          setCaptureError(result.error || 'Failed to submit. Please try again.');
          turnstileRef.current?.reset();
          setTurnstileToken(undefined);
        }
      } catch {
        setCaptureStatus('error');
        setCaptureError('An unexpected network error occurred.');
        turnstileRef.current?.reset();
        setTurnstileToken(undefined);
      }
    });
  };

  return (
    <>
      {/* Standard Print CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, #header, #footer, .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .a4-sheet {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: auto !important;
          }
        }
      ` }} />

      <div className="min-h-screen bg-cream text-obsidian pb-24">
        {/* Top Header / System Banner */}
        <section className="no-print border-b border-rule bg-surface/80 backdrop-blur-sm sticky top-[var(--header-h,5rem)] z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shrink-0" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
                [ SYS_ONLINE // new state, per design-system ]
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-muted/60">
                /tools/docs-generator
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <ToolShareBand
                tool="docs-generator"
                title={lang === 'ar' ? 'مشاركة' : 'Share'}
                shareText={shareText}
                permalinkUrl={currentUrl}
                lang={lang}
              />

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-obsidian text-white rounded hover:bg-obsidian/85 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider border border-rule hover:border-obsidian/40 bg-white text-obsidian rounded transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Save & Send</span>
              </button>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <header className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-rule pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-emerald inline-block" />
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted">
                  TRADE DOCUMENT ENGINE
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-obsidian tracking-tight">
                Bilingual Docs Generator
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl font-light">
                Generate compliant international shipping documentation. Commercial Invoice, Packing List, and Geneva Convention CMR Consignment Note with instantaneous bilingual rendering (EN/AR).
              </p>
            </div>

            {/* Document Type & Language Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Doc Type Selector */}
              <div className="inline-flex rounded border border-rule bg-surface p-1 shadow-xs">
                {(['commercial-invoice', 'packing-list', 'cmr'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleDocTypeChange(type)}
                    className={`px-3 py-1.5 text-[11px] font-mono tracking-wider transition-colors rounded ${
                      doc.docType === type
                        ? 'bg-obsidian text-white font-medium shadow-xs'
                        : 'text-muted hover:text-obsidian hover:bg-cream'
                    }`}
                  >
                    {type === 'commercial-invoice' && 'Invoice'}
                    {type === 'packing-list' && 'Packing List'}
                    {type === 'cmr' && 'CMR Note'}
                  </button>
                ))}
              </div>

              {/* Language Selector */}
              <div className="inline-flex rounded border border-rule bg-surface p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 text-[11px] font-mono tracking-wider transition-colors rounded ${
                    lang === 'en'
                      ? 'bg-obsidian text-white font-medium shadow-xs'
                      : 'text-muted hover:text-obsidian hover:bg-cream'
                  }`}
                >
                  English (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ar')}
                  className={`px-3 py-1.5 text-[11px] font-mono tracking-wider transition-colors rounded ${
                    lang === 'ar'
                      ? 'bg-obsidian text-white font-medium shadow-xs'
                      : 'text-muted hover:text-obsidian hover:bg-cream'
                  }`}
                >
                  العربية (RTL)
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Tab Switcher: Editor vs Live Preview */}
          <div className="flex lg:hidden mt-4 border-b border-rule">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-2.5 text-center text-[12px] font-mono uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'editor'
                  ? 'border-obsidian text-obsidian font-bold'
                  : 'border-transparent text-muted hover:text-obsidian'
              }`}
            >
              1. Document Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2.5 text-center text-[12px] font-mono uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-obsidian text-obsidian font-bold'
                  : 'border-transparent text-muted hover:text-obsidian'
              }`}
            >
              2. Live A4 Preview
            </button>
          </div>
        </header>

        {/* Main Workspace Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls (Interactive Editor) */}
            <div
              className={`no-print lg:col-span-5 space-y-6 ${
                activeTab === 'editor' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Editor Navigation Pills */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-rule">
                {[
                  { id: 'header', label: 'Params' },
                  { id: 'parties', label: 'Parties' },
                  { id: 'logistics', label: 'Logistics' },
                  { id: 'items', label: `Items (${doc.items.length})` },
                  { id: 'totals', label: 'Totals & Notes' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSection(s.id as typeof activeSection)}
                    className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded transition-colors ${
                      activeSection === s.id
                        ? 'bg-obsidian text-white font-medium'
                        : 'bg-white border border-rule text-muted hover:text-obsidian'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 1. Header & Commercial Parameters */}
              {activeSection === 'header' && (
                <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-rule pb-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                      [ 01 // DOCUMENT IDENTIFIERS ]
                    </span>
                    <span className="text-[9px] font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded">
                      EDITABLE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Document Number
                      </label>
                      <input
                        type="text"
                        value={doc.docNumber}
                        onChange={(e) => updateDoc('docNumber', e.target.value)}
                        placeholder="e.g. INV-2026-0842"
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={doc.date}
                        onChange={(e) => updateDoc('date', e.target.value)}
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Currency
                      </label>
                      <select
                        value={doc.currency}
                        onChange={(e) => updateDoc('currency', e.target.value)}
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      >
                        {COMMON_CURRENCIES.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Incoterm (Incoterms® 2020)
                      </label>
                      <select
                        value={doc.incoterm}
                        onChange={(e) => updateDoc('incoterm', e.target.value)}
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      >
                        {INCOTERMS.map((term) => (
                          <option key={term} value={term}>
                            {term}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Incoterm Named Port / Place
                      </label>
                      <input
                        type="text"
                        value={doc.incotermLocation}
                        onChange={(e) => updateDoc('incotermLocation', e.target.value)}
                        placeholder="e.g. Rotterdam, Netherlands"
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Payment Terms
                      </label>
                      <input
                        type="text"
                        value={doc.paymentTerms || ''}
                        onChange={(e) => updateDoc('paymentTerms', e.target.value)}
                        placeholder="e.g. 30 Days Net from B/L Date or Irrevocable L/C at Sight"
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Parties: Seller & Buyer Cards */}
              {activeSection === 'parties' && (
                <div className="space-y-4">
                  {/* Seller / Exporter Card */}
                  <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-rule pb-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                        [ SELLER / EXPORTER ]
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Company / Shipper Name
                        </label>
                        <input
                          type="text"
                          value={doc.seller.name}
                          onChange={(e) => updateSeller('name', e.target.value)}
                          placeholder="e.g. Apex Global Traders FZE"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Physical Address
                        </label>
                        <textarea
                          rows={2}
                          value={doc.seller.address}
                          onChange={(e) => updateSeller('address', e.target.value)}
                          placeholder="Street, District, City, Postal Code"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={doc.seller.country}
                            onChange={(e) => updateSeller('country', e.target.value)}
                            placeholder="e.g. United Arab Emirates"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Tax ID / VAT Registration
                          </label>
                          <input
                            type="text"
                            value={doc.seller.taxId || ''}
                            onChange={(e) => updateSeller('taxId', e.target.value)}
                            placeholder="e.g. TRN-10029482010003"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={doc.seller.phone || ''}
                            onChange={(e) => updateSeller('phone', e.target.value)}
                            placeholder="+971 4 881 9200"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={doc.seller.email || ''}
                            onChange={(e) => updateSeller('email', e.target.value)}
                            placeholder="ops@apex-traders.ae"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buyer / Consignee Card */}
                  <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-rule pb-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                        [ BUYER / CONSIGNEE ]
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Company / Consignee Name
                        </label>
                        <input
                          type="text"
                          value={doc.buyer.name}
                          onChange={(e) => updateBuyer('name', e.target.value)}
                          placeholder="e.g. Rotterdam Bulk Logistics B.V."
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Delivery / Physical Address
                        </label>
                        <textarea
                          rows={2}
                          value={doc.buyer.address}
                          onChange={(e) => updateBuyer('address', e.target.value)}
                          placeholder="Street, Haven / Port Area, City, Postal Code"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={doc.buyer.country}
                            onChange={(e) => updateBuyer('country', e.target.value)}
                            placeholder="e.g. Netherlands"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Tax ID / VAT Registration
                          </label>
                          <input
                            type="text"
                            value={doc.buyer.taxId || ''}
                            onChange={(e) => updateBuyer('taxId', e.target.value)}
                            placeholder="e.g. NL882910482B01"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={doc.buyer.phone || ''}
                            onChange={(e) => updateBuyer('phone', e.target.value)}
                            placeholder="+31 10 404 1234"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={doc.buyer.email || ''}
                            onChange={(e) => updateBuyer('email', e.target.value)}
                            placeholder="import@rotterdam-logistics.nl"
                            className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Logistics, Transport & Carrier Details */}
              {activeSection === 'logistics' && (
                <div className="space-y-4">
                  {/* Origin & Destination */}
                  <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-4">
                    <div className="border-b border-rule pb-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                        [ ROUTING & CONSIGNMENT ]
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Place of Loading / Origin
                        </label>
                        <input
                          type="text"
                          value={doc.origin}
                          onChange={(e) => updateDoc('origin', e.target.value)}
                          placeholder="e.g. Jebel Ali Port (AE JEA), UAE"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Place of Delivery / Destination
                        </label>
                        <input
                          type="text"
                          value={doc.destination}
                          onChange={(e) => updateDoc('destination', e.target.value)}
                          placeholder="e.g. Port of Rotterdam (NL RTM), Netherlands"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Vessel / Flight / Vehicle No.
                        </label>
                        <input
                          type="text"
                          value={doc.vesselOrFlightOrVehicle || ''}
                          onChange={(e) => updateDoc('vesselOrFlightOrVehicle', e.target.value)}
                          placeholder="e.g. MSC PALOMA / V-2604W"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          B/L / AWB / Consignment No.
                        </label>
                        <input
                          type="text"
                          value={doc.blOrAwbOrConsignmentNo || ''}
                          onChange={(e) => updateDoc('blOrAwbOrConsignmentNo', e.target.value)}
                          placeholder="e.g. BL-DXB-902184"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Carrier Details (Box 16 for CMR) */}
                  <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-rule pb-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                        [ CARRIER DETAILS (CMR BOX 16) ]
                      </span>
                      {doc.docType === 'cmr' && (
                        <span className="text-[9px] font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded">
                          REQUIRED FOR CMR
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Carrier Company Name
                        </label>
                        <input
                          type="text"
                          value={doc.carrier?.name || ''}
                          onChange={(e) => updateCarrier('name', e.target.value)}
                          placeholder="e.g. Al-Masar Intermodal Freight LLC"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Carrier Address
                        </label>
                        <input
                          type="text"
                          value={doc.carrier?.address || ''}
                          onChange={(e) => updateCarrier('address', e.target.value)}
                          placeholder="e.g. Logistics City Terminal 4, Dubai, UAE"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Vehicle Plate / Reg.
                        </label>
                        <input
                          type="text"
                          value={doc.carrier?.vehicleReg || ''}
                          onChange={(e) => updateCarrier('vehicleReg', e.target.value)}
                          placeholder="e.g. DXB-99210-T"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Driver Name
                        </label>
                        <input
                          type="text"
                          value={doc.carrier?.driverName || ''}
                          onChange={(e) => updateCarrier('driverName', e.target.value)}
                          placeholder="e.g. Tariq Mansoor"
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Line Items Editor */}
              {activeSection === 'items' && (
                <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-rule pb-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                      [ MANIFEST & LINE ITEMS ]
                    </span>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-obsidian text-white rounded hover:bg-obsidian/85 flex items-center gap-1"
                    >
                      <span>+</span> Add Line
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                    {doc.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-cream/70 border border-rule rounded-md space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between border-b border-rule/50 pb-1.5">
                          <span className="text-[10px] font-mono text-muted uppercase font-medium">
                            Item #{index + 1}
                          </span>
                          {doc.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLineItem(item.id)}
                              className="text-danger hover:text-danger/80 text-[12px] font-bold px-1.5 py-0.5 rounded transition-colors"
                              title="Remove item"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Description & HS Code */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Description of Goods
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              placeholder="Product description and trade specs"
                              className="w-full bg-white border border-rule px-2.5 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              HS Code
                            </label>
                            <input
                              type="text"
                              value={item.hsCode || ''}
                              onChange={(e) => updateLineItem(item.id, 'hsCode', e.target.value)}
                              placeholder="e.g. 3901.10"
                              className="w-full bg-white border border-rule px-2.5 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>
                        </div>

                        {/* Quantity, Unit, Price */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-rule px-2.5 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Unit
                            </label>
                            <select
                              value={item.unit}
                              onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                              className="w-full bg-white border border-rule px-2 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            >
                              {COMMON_UNITS.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </div>

                          {visible.prices && (
                            <div className="col-span-2 sm:col-span-1">
                              <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                                Unit Price ({doc.currency})
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.unitPrice}
                                onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-rule px-2.5 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                              />
                            </div>
                          )}
                        </div>

                        {/* Packaging, Weights, Volume */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Pkg Count
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={item.packagesCount || 0}
                              onChange={(e) => updateLineItem(item.id, 'packagesCount', parseInt(e.target.value, 10) || 0)}
                              className="w-full bg-white border border-rule px-2 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Pkg Type
                            </label>
                            <input
                              type="text"
                              value={item.packageType || ''}
                              onChange={(e) => updateLineItem(item.id, 'packageType', e.target.value)}
                              placeholder="PALLET/BOX"
                              className="w-full bg-white border border-rule px-2 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Net Wt (kg)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.netWeightKg || 0}
                              onChange={(e) => updateLineItem(item.id, 'netWeightKg', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-rule px-2 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Gross Wt (kg)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.grossWeightKg || 0}
                              onChange={(e) => updateLineItem(item.id, 'grossWeightKg', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-rule px-2 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>
                        </div>

                        {/* Volume CBM */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">
                              Volume (CBM / m³)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={item.volumeCbm || 0}
                              onChange={(e) => updateLineItem(item.id, 'volumeCbm', parseFloat(e.target.value) || 0)}
                              className="w-full bg-white border border-rule px-2 py-1.5 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                            />
                          </div>

                          {visible.lineTotals && (
                            <div className="flex flex-col justify-end text-end pb-1 pe-1">
                              <span className="text-[9px] font-mono uppercase text-muted">Line Subtotal</span>
                              <span className="text-xs font-mono font-bold text-obsidian">
                                {formatCurrency(calculateLineTotal(item), doc.currency, lang)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Summary Adjustments & Notes */}
              {activeSection === 'totals' && (
                <div className="bg-surface border border-rule p-5 rounded-lg shadow-xs space-y-4">
                  <div className="border-b border-rule pb-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
                      [ TOTALS & ADJUSTMENTS ]
                    </span>
                  </div>

                  {visible.prices && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          VAT / Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={doc.options?.taxRate || 0}
                          onChange={(e) => updateOptions('taxRate', parseFloat(e.target.value) || 0)}
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Discount ({doc.currency})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={doc.options?.discount || 0}
                          onChange={(e) => updateOptions('discount', parseFloat(e.target.value) || 0)}
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                          Shipping Fee ({doc.currency})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={doc.options?.shippingFee || 0}
                          onChange={(e) => updateOptions('shippingFee', parseFloat(e.target.value) || 0)}
                          className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                      Notes & Special Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={doc.notes || ''}
                      onChange={(e) => updateDoc('notes', e.target.value)}
                      placeholder="e.g. Goods packed on fumigated pallets. Stated temperatures, handling warnings..."
                      className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                    />
                  </div>

                  {/* Calculated Totals Overview */}
                  <div className="bg-cream/60 p-3 rounded border border-rule space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-muted">
                      <span>Total Items & Packages:</span>
                      <span className="font-bold text-obsidian">{totals.totalPackages} pkgs ({totals.totalQuantity} units)</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Total Net / Gross Wt:</span>
                      <span className="font-bold text-obsidian">
                        {formatWeight(totals.totalNetWeight)} / {formatWeight(totals.totalGrossWeight)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Total Volume:</span>
                      <span className="font-bold text-obsidian">{totals.totalVolumeCbm} CBM</span>
                    </div>
                    {visible.prices && (
                      <div className="flex justify-between pt-2 border-t border-rule text-sm font-bold text-obsidian">
                        <span>Calculated Grand Total:</span>
                        <span className="text-emerald">{formatCurrency(totals.grandTotal, doc.currency, lang)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live A4 Document Preview */}
            <div
              className={`lg:col-span-7 ${
                activeTab === 'preview' ? 'block' : 'hidden lg:block'
              }`}
            >
              {/* Preview Sheet Container */}
              <div className="overflow-x-auto pb-10">
                <article
                  id="a4-document-preview"
                  className="a4-sheet max-w-[210mm] min-h-[297mm] shadow-lg bg-white text-neutral-900 border border-neutral-200 p-8 sm:p-12 mx-auto transition-all"
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  {/* Header / Brand Strip */}
                  <header className="border-b-2 border-neutral-900 pb-5 mb-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-neutral-900" />
                          <span className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-neutral-900">
                            EXVORTA
                          </span>
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                          INSTITUTIONAL TRADE INFRASTRUCTURE
                        </p>
                      </div>

                      <div className="text-end">
                        <h2 className="text-lg sm:text-xl font-bold font-serif uppercase tracking-tight text-neutral-900">
                          {doc.docType === 'commercial-invoice' && t('commercialInvoiceTitle')}
                          {doc.docType === 'packing-list' && t('packingListTitle')}
                          {doc.docType === 'cmr' && t('cmrTitle')}
                        </h2>
                        <div className="text-xs font-mono text-neutral-600 mt-1 space-y-0.5">
                          <div>
                            <span className="text-neutral-400 uppercase text-[10px]">
                              {t('docNumber')}:{' '}
                            </span>
                            <span className="font-bold text-neutral-900">{doc.docNumber || '—'}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 uppercase text-[10px]">
                              {t('date')}:{' '}
                            </span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Document Specific View 1: Commercial Invoice */}
                  {doc.docType === 'commercial-invoice' && (
                    <div className="space-y-6 text-xs">
                      {/* Parties: Seller & Buyer Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-neutral-300 p-4 rounded-sm bg-neutral-50/50">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-200 pb-1">
                            {t('sellerExporter')}
                          </span>
                          <div className="font-bold text-sm text-neutral-900">{doc.seller.name || '—'}</div>
                          <div className="text-neutral-600 whitespace-pre-line">{doc.seller.address || '—'}</div>
                          <div className="text-neutral-600">{doc.seller.country}</div>
                          {doc.seller.taxId && (
                            <div className="text-neutral-500 font-mono text-[11px]">
                              {t('taxId')}: {doc.seller.taxId}
                            </div>
                          )}
                          {doc.seller.phone && <div className="text-neutral-500">{doc.seller.phone}</div>}
                        </div>

                        <div className="space-y-1 border-t sm:border-t-0 sm:border-s border-neutral-200 pt-3 sm:pt-0 sm:ps-4">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-200 pb-1">
                            {t('buyerConsignee')}
                          </span>
                          <div className="font-bold text-sm text-neutral-900">{doc.buyer.name || '—'}</div>
                          <div className="text-neutral-600 whitespace-pre-line">{doc.buyer.address || '—'}</div>
                          <div className="text-neutral-600">{doc.buyer.country}</div>
                          {doc.buyer.taxId && (
                            <div className="text-neutral-500 font-mono text-[11px]">
                              {t('taxId')}: {doc.buyer.taxId}
                            </div>
                          )}
                          {doc.buyer.phone && <div className="text-neutral-500">{doc.buyer.phone}</div>}
                        </div>
                      </div>

                      {/* Trade Terms & Logistics Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-neutral-300 py-2.5 text-[11px] font-mono">
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('incoterm')}
                          </span>
                          <span className="font-bold text-neutral-900">
                            {doc.incoterm} {doc.incotermLocation ? `(${doc.incotermLocation})` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('currency')}
                          </span>
                          <span className="font-bold text-neutral-900">{doc.currency}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('origin')}
                          </span>
                          <span className="text-neutral-800">{doc.origin || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('destination')}
                          </span>
                          <span className="text-neutral-800">{doc.destination || '—'}</span>
                        </div>
                      </div>

                      {/* Itemized Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-start border-collapse border-b border-neutral-300">
                          <thead>
                            <tr className="border-b-2 border-neutral-900 text-[10px] font-mono uppercase text-neutral-600">
                              <th className="py-2 text-start w-12">#</th>
                              <th className="py-2 text-start">{t('description')}</th>
                              <th className="py-2 text-start w-28">{t('hsCode')}</th>
                              <th className="py-2 text-end w-20">{t('quantity')}</th>
                              <th className="py-2 text-start w-16 ps-2">{t('unit')}</th>
                              <th className="py-2 text-end w-24">{t('unitPrice')}</th>
                              <th className="py-2 text-end w-28">{t('lineTotal')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {doc.items.map((item, idx) => {
                              const lineTotal = calculateLineTotal(item);
                              return (
                                <tr key={item.id} className="align-top">
                                  <td className="py-2.5 font-mono text-neutral-400">{idx + 1}</td>
                                  <td className="py-2.5 pe-3">
                                    <div className="font-medium text-neutral-900">{item.description || '—'}</div>
                                    {item.packagesCount ? (
                                      <div className="text-[10px] text-neutral-500 font-mono">
                                        {item.packagesCount} {item.packageType || 'PKGS'}
                                      </div>
                                    ) : null}
                                  </td>
                                  <td className="py-2.5 font-mono text-neutral-600">{item.hsCode || '—'}</td>
                                  <td className="py-2.5 text-end font-mono font-medium">{item.quantity}</td>
                                  <td className="py-2.5 text-start font-mono text-neutral-600 ps-2">{item.unit}</td>
                                  <td className="py-2.5 text-end font-mono">
                                    {formatCurrency(item.unitPrice, doc.currency, lang)}
                                  </td>
                                  <td className="py-2.5 text-end font-mono font-bold text-neutral-900">
                                    {formatCurrency(lineTotal, doc.currency, lang)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Totals & Financial Breakdown */}
                      <div className="flex justify-end pt-2">
                        <div className="w-full sm:w-72 space-y-1.5 font-mono text-xs">
                          <div className="flex justify-between text-neutral-600">
                            <span>{t('subtotal')}:</span>
                            <span>{formatCurrency(totals.subtotal, doc.currency, lang)}</span>
                          </div>

                          {totals.discount > 0 && (
                            <div className="flex justify-between text-neutral-600">
                              <span>{t('discount')}:</span>
                              <span>-{formatCurrency(totals.discount, doc.currency, lang)}</span>
                            </div>
                          )}

                          {totals.tax > 0 && (
                            <div className="flex justify-between text-neutral-600">
                              <span>
                                {t('vat')} ({doc.options?.taxRate || 0}%):
                              </span>
                              <span>{formatCurrency(totals.tax, doc.currency, lang)}</span>
                            </div>
                          )}

                          {totals.shippingFee > 0 && (
                            <div className="flex justify-between text-neutral-600">
                              <span>{t('shippingFee')}:</span>
                              <span>{formatCurrency(totals.shippingFee, doc.currency, lang)}</span>
                            </div>
                          )}

                          <div className="flex justify-between border-t-2 border-neutral-900 pt-2 text-sm font-bold text-neutral-900">
                            <span>{t('grandTotal')}:</span>
                            <span>{formatCurrency(totals.grandTotal, doc.currency, lang)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Terms & Notes */}
                      {(doc.paymentTerms || doc.notes) && (
                        <div className="border border-neutral-200 p-3 bg-neutral-50 text-[11px] space-y-1 rounded-sm">
                          {doc.paymentTerms && (
                            <div>
                              <span className="font-mono font-bold uppercase text-[9px] text-neutral-500">
                                {t('paymentTerms')}:{' '}
                              </span>
                              <span className="text-neutral-800">{doc.paymentTerms}</span>
                            </div>
                          )}
                          {doc.notes && (
                            <div>
                              <span className="font-mono font-bold uppercase text-[9px] text-neutral-500">
                                {t('notes')}:{' '}
                              </span>
                              <span className="text-neutral-800 whitespace-pre-line">{doc.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Document Specific View 2: Packing List */}
                  {doc.docType === 'packing-list' && (
                    <div className="space-y-6 text-xs">
                      {/* Parties: Shipper & Consignee */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-neutral-300 p-4 rounded-sm bg-neutral-50/50">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-200 pb-1">
                            {t('seller')} (Shipper)
                          </span>
                          <div className="font-bold text-sm text-neutral-900">{doc.seller.name || '—'}</div>
                          <div className="text-neutral-600 whitespace-pre-line">{doc.seller.address || '—'}</div>
                          <div className="text-neutral-600">{doc.seller.country}</div>
                        </div>

                        <div className="space-y-1 border-t sm:border-t-0 sm:border-s border-neutral-200 pt-3 sm:pt-0 sm:ps-4">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block border-b border-neutral-200 pb-1">
                            {t('buyer')} (Consignee)
                          </span>
                          <div className="font-bold text-sm text-neutral-900">{doc.buyer.name || '—'}</div>
                          <div className="text-neutral-600 whitespace-pre-line">{doc.buyer.address || '—'}</div>
                          <div className="text-neutral-600">{doc.buyer.country}</div>
                        </div>
                      </div>

                      {/* Transport Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-neutral-300 py-2.5 text-[11px] font-mono">
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('vesselOrFlightOrVehicle')}
                          </span>
                          <span className="font-bold text-neutral-900">{doc.vesselOrFlightOrVehicle || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('blOrAwbOrConsignmentNo')}
                          </span>
                          <span className="font-bold text-neutral-900">{doc.blOrAwbOrConsignmentNo || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('origin')}
                          </span>
                          <span className="text-neutral-800">{doc.origin || '—'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block uppercase text-[9px]">
                            {t('destination')}
                          </span>
                          <span className="text-neutral-800">{doc.destination || '—'}</span>
                        </div>
                      </div>

                      {/* Packaging Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-start border-collapse border-b border-neutral-300">
                          <thead>
                            <tr className="border-b-2 border-neutral-900 text-[10px] font-mono uppercase text-neutral-600">
                              <th className="py-2 text-start w-28">{t('packages')}</th>
                              <th className="py-2 text-start">{t('description')}</th>
                              <th className="py-2 text-start w-24">{t('hsCode')}</th>
                              <th className="py-2 text-end w-20">{t('quantity')}</th>
                              <th className="py-2 text-end w-28">{t('netWeight')}</th>
                              <th className="py-2 text-end w-28">{t('grossWeight')}</th>
                              <th className="py-2 text-end w-24">{t('volume')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {doc.items.map((item) => (
                              <tr key={item.id} className="align-top">
                                <td className="py-2.5 font-mono font-medium text-neutral-900">
                                  {item.packagesCount || 1} {item.packageType || 'CTN'}
                                </td>
                                <td className="py-2.5 pe-3">
                                  <div className="font-medium text-neutral-900">{item.description || '—'}</div>
                                </td>
                                <td className="py-2.5 font-mono text-neutral-600">{item.hsCode || '—'}</td>
                                <td className="py-2.5 text-end font-mono">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-2.5 text-end font-mono">
                                  {formatWeight(item.netWeightKg || 0)}
                                </td>
                                <td className="py-2.5 text-end font-mono font-medium text-neutral-900">
                                  {formatWeight(item.grossWeightKg || 0)}
                                </td>
                                <td className="py-2.5 text-end font-mono text-neutral-600">
                                  {item.volumeCbm || 0} CBM
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Physical Summary Box */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-100 p-4 border border-neutral-300 rounded-sm font-mono text-xs">
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px]">{t('totalPackages')}</span>
                          <span className="font-bold text-base text-neutral-900">{totals.totalPackages}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px]">{t('totalNetWeight')}</span>
                          <span className="font-bold text-base text-neutral-900">{formatWeight(totals.totalNetWeight)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px]">{t('totalGrossWeight')}</span>
                          <span className="font-bold text-base text-neutral-900">{formatWeight(totals.totalGrossWeight)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px]">{t('totalVolume')}</span>
                          <span className="font-bold text-base text-neutral-900">{totals.totalVolumeCbm} CBM</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Specific View 3: CMR Consignment Note (Geneva Convention Boxes) */}
                  {doc.docType === 'cmr' && (
                    <div className="space-y-4 text-xs font-mono">
                      {/* Geneva Convention Boxes 1 - 4 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 border border-neutral-900 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900">
                        {/* Box 1: Sender */}
                        <div className="p-3 space-y-1">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                            {t('cmrBox1')}
                          </span>
                          <div className="font-bold text-sm text-neutral-900">{doc.seller.name || '—'}</div>
                          <div className="text-[11px] text-neutral-700 whitespace-pre-line">{doc.seller.address}</div>
                          <div className="text-[11px] text-neutral-700">{doc.seller.country}</div>
                          {doc.seller.taxId && <div className="text-[10px] text-neutral-500">VAT: {doc.seller.taxId}</div>}
                        </div>

                        {/* Box 2: Consignee */}
                        <div className="p-3 space-y-1">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                            {t('cmrBox2')}
                          </span>
                          <div className="font-bold text-sm text-neutral-900">{doc.buyer.name || '—'}</div>
                          <div className="text-[11px] text-neutral-700 whitespace-pre-line">{doc.buyer.address}</div>
                          <div className="text-[11px] text-neutral-700">{doc.buyer.country}</div>
                          {doc.buyer.taxId && <div className="text-[10px] text-neutral-500">VAT: {doc.buyer.taxId}</div>}
                        </div>
                      </div>

                      {/* Boxes 3, 4, 16 */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 border border-neutral-900 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900">
                        {/* Box 3: Delivery Place */}
                        <div className="p-3">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                            {t('cmrBox3')}
                          </span>
                          <div className="font-bold text-neutral-900 mt-1">{doc.destination || '—'}</div>
                        </div>

                        {/* Box 4: Taking Over Place & Date */}
                        <div className="p-3">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                            {t('cmrBox4')}
                          </span>
                          <div className="font-bold text-neutral-900 mt-1">{doc.origin || '—'}</div>
                          <div className="text-neutral-500 text-[10px] mt-0.5">Date: {doc.date}</div>
                        </div>

                        {/* Box 16: Carrier */}
                        <div className="p-3 space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                            {t('cmrBox16')}
                          </span>
                          <div className="font-bold text-neutral-900">{doc.carrier?.name || '—'}</div>
                          <div className="text-[10px] text-neutral-600">{doc.carrier?.address}</div>
                          <div className="text-[10px] text-neutral-800">
                            Plate: {doc.carrier?.vehicleReg || '—'} | Driver: {doc.carrier?.driverName || '—'}
                          </div>
                        </div>
                      </div>

                      {/* Box 5: Attached Documents */}
                      <div className="border border-neutral-900 p-2.5">
                        <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                          {t('cmrBox5')}
                        </span>
                        <div className="text-[11px] text-neutral-800 mt-0.5">
                          Commercial Invoice No. {doc.docNumber || '—'}, Packing List, Certificate of Origin
                        </div>
                      </div>

                      {/* Boxes 6-12 Goods Table */}
                      <div className="border border-neutral-900">
                        <div className="grid grid-cols-12 border-b border-neutral-900 bg-neutral-100 text-[9px] font-bold uppercase p-2">
                          <div className="col-span-5">{t('cmrBox6to9')}</div>
                          <div className="col-span-3 text-start">{t('cmrBox10')}</div>
                          <div className="col-span-2 text-end">{t('cmrBox11')}</div>
                          <div className="col-span-2 text-end">{t('cmrBox12')}</div>
                        </div>

                        <div className="divide-y divide-neutral-200">
                          {doc.items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 p-2.5 text-[11px] align-top">
                              <div className="col-span-5 pe-2">
                                <div className="font-bold text-neutral-900">
                                  {item.packagesCount} {item.packageType || 'PKGS'}
                                </div>
                                <div className="text-neutral-700">{item.description}</div>
                              </div>
                              <div className="col-span-3 text-neutral-600">{item.hsCode || '—'}</div>
                              <div className="col-span-2 text-end font-bold text-neutral-900">
                                {formatWeight(item.grossWeightKg || 0)}
                              </div>
                              <div className="col-span-2 text-end text-neutral-600">{item.volumeCbm || 0} m³</div>
                            </div>
                          ))}
                        </div>

                        {/* Sub-totals Row */}
                        <div className="grid grid-cols-12 border-t-2 border-neutral-900 bg-neutral-50 p-2 font-bold text-[11px]">
                          <div className="col-span-5">TOTAL: {totals.totalPackages} PACKAGES</div>
                          <div className="col-span-3" />
                          <div className="col-span-2 text-end">{formatWeight(totals.totalGrossWeight)}</div>
                          <div className="col-span-2 text-end">{totals.totalVolumeCbm} m³</div>
                        </div>
                      </div>

                      {/* Box 13: Sender Instructions */}
                      <div className="border border-neutral-900 p-3">
                        <span className="text-[9px] uppercase font-bold text-neutral-500 block">
                          {t('cmrBox13')}
                        </span>
                        <div className="text-[11px] text-neutral-800 mt-1">
                          {doc.notes || 'Incoterms: ' + doc.incoterm + ' ' + (doc.incotermLocation || '') + '. Cargo to be delivered directly to consignee.'}
                        </div>
                      </div>

                      {/* Boxes 22-24: Signatures and Stamps */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 border border-neutral-900 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900 min-h-[90px]">
                        <div className="p-3 flex flex-col justify-between">
                          <span className="text-[9px] uppercase font-bold text-neutral-500">
                            {t('cmrBox22')}
                          </span>
                          <div className="border-t border-dashed border-neutral-400 pt-1 text-[9px] text-neutral-400">
                            Date, Stamp & Signature
                          </div>
                        </div>

                        <div className="p-3 flex flex-col justify-between">
                          <span className="text-[9px] uppercase font-bold text-neutral-500">
                            {t('cmrBox23')}
                          </span>
                          <div className="border-t border-dashed border-neutral-400 pt-1 text-[9px] text-neutral-400">
                            Date, Stamp & Signature
                          </div>
                        </div>

                        <div className="p-3 flex flex-col justify-between">
                          <span className="text-[9px] uppercase font-bold text-neutral-500">
                            {t('cmrBox24')}
                          </span>
                          <div className="border-t border-dashed border-neutral-400 pt-1 text-[9px] text-neutral-400">
                            Date, Stamp & Signature
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Required Footer Branding */}
                  <footer className="mt-12 pt-4 border-t border-neutral-300 text-center text-[10px] font-mono text-neutral-500 tracking-wider">
                    {t('footerNotice')}
                  </footer>
                </article>
              </div>
            </div>
          </div>
        </main>

        {/* Email Capture Offer Modal ("Save & Send") */}
        {emailModalOpen && (
          <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/70 backdrop-blur-xs">
            <div className="bg-surface border border-rule max-w-md w-full p-6 rounded-xl shadow-2xl relative">
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="absolute top-4 end-4 text-muted hover:text-obsidian text-lg font-bold"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
                    DOCUMENT DISPATCH
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-obsidian">
                  Save & Email This Document
                </h3>
                <p className="text-xs text-muted font-light leading-relaxed">
                  Receive this prepared {doc.docType} directly in your inbox. Includes access to instant automated customs compliance checks and version management.
                </p>

                {captureStatus === 'success' ? (
                  <div className="p-4 bg-emerald/10 border border-emerald/30 rounded-lg text-start space-y-2">
                    <div className="flex items-center gap-2 text-emerald font-bold text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Document sent to your inbox / You&apos;re on the list!</span>
                    </div>
                    <p className="text-[11px] text-muted font-mono">
                      A copy has been queued for {captureEmail}. You can also print directly from your browser.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailModalOpen(false);
                        setCaptureStatus('idle');
                      }}
                      className="mt-2 w-full py-2 text-xs font-mono uppercase tracking-wider bg-obsidian text-white rounded hover:bg-obsidian/85"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Your Name / Company
                      </label>
                      <input
                        type="text"
                        value={captureName}
                        onChange={(e) => setCaptureName(e.target.value)}
                        placeholder="e.g. Apex Global Traders"
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={captureEmail}
                        onChange={(e) => setCaptureEmail(e.target.value)}
                        placeholder="operations@example.com"
                        className="w-full bg-cream border border-rule px-3 py-2 text-xs font-mono text-obsidian rounded focus:outline-none focus:border-obsidian"
                      />
                    </div>

                    <div className="flex justify-center py-1">
                      <TurnstileWidget
                        ref={turnstileRef}
                        onSuccess={setTurnstileToken}
                        onExpire={() => setTurnstileToken(undefined)}
                        theme="light"
                      />
                    </div>

                    {captureError && (
                      <p className="text-xs font-mono text-danger">{captureError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isCapturing}
                      className="w-full py-2.5 text-xs font-mono uppercase tracking-widest bg-obsidian text-white rounded hover:bg-obsidian/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isCapturing ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <span>Email Me This Document</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
