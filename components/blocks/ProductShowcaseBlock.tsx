"use client";

import React from 'react';
import Link from '@/components/ui/AppLink';
import { AnimatedSection, Reveal, StaggerContainer, StaggerItem } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/motion/TiltCard';
import { DocTemplateIcon, type DocTemplateIconName } from '@/components/ui/DocTemplateIcon';

const DOC_TEMPLATES = [
  {
    id: 'bol',
    tagline: 'Core shipping contract',
    name: 'Bill of Lading',
    icon: 'sailing',
    incoterms: 'CIF (Cost, Insurance & Freight)',
    hs: '2901.21.00',
    port: 'AE JEA (JEBEL ALI)',
    shipper: 'Global Petrochem LLC\nJafza One, Dubai, UAE',
    consignee: 'Vanguard Resources\nBotlek, Rotterdam, Netherlands',
    vessel: 'MSC Isabella',
    voyage: 'V-092A',
    pol: 'AE JEA',
    pod: 'NL RTM',
    desc: 'Petrochemical Raw Materials in ISO Tank Containers.',
    weight: '24,500.00 KGS',
    hs2: '2901.21.00',
    ref: 'EXV-8829-DXB',
  },
  {
    id: 'co',
    tagline: 'Customs clearance proof',
    name: 'Certificate of Origin',
    icon: 'workspace_premium',
    incoterms: 'FOB (Free On Board)',
    hs: '0904.11.00',
    port: 'TR IZM (IZMIR)',
    shipper: 'Aegean Organic Export Co.\nIzmir Organize Sanayi, Türkiye',
    consignee: 'Meridian Foods GmbH\nHafenstraße 12, Hamburg, Germany',
    vessel: 'APL Sentosa',
    voyage: 'V-0143W',
    pol: 'TR IZM',
    pod: 'DE HAM',
    desc: 'Certified Organic Oregano, Whole Leaf — EU/USDA NOP Organic.',
    weight: '18,200.00 KGS',
    hs2: '0904.11.00',
    ref: 'EXV-4471-IZM',
  },
  {
    id: 'insurance',
    tagline: 'All-risks cargo cover',
    name: 'Insurance Certificate',
    icon: 'verified_user',
    incoterms: 'CIP (Carriage & Insurance Paid)',
    hs: '9999.00.00',
    port: 'AE DXB (JEBEL ALI)',
    shipper: 'Exvorta Trade Services\nDMCC, Dubai, UAE',
    consignee: 'Novus Energy Pte.\nSingapore 049483',
    vessel: 'MV Sentinel',
    voyage: 'V-2201S',
    pol: 'AE DXB',
    pod: 'SG SIN',
    desc: 'Marine Cargo Insurance — All Risks (A) covering 4,500,000 USD shipment value.',
    weight: 'COVER: 4,500,000 USD',
    hs2: 'POLICY: MRN-88210',
    ref: 'EXV-9912-SIN',
  },
  {
    id: 'ai-packing',
    tagline: 'AI-classified · self-validating',
    name: 'AI Packing List',
    icon: 'auto_awesome',
    incoterms: 'DAP (Delivered At Place)',
    hs: '8542.31.00',
    port: 'TW TPE (TAIPEI)',
    shipper: 'OmniTech Manufacturing\nHsinchu Science Park, Taiwan',
    consignee: 'Corvus Distribution Ltd.\nLondon E14, United Kingdom',
    vessel: 'MV Helios',
    voyage: 'V-7712H',
    pol: 'TW TPE',
    pod: 'GB LHR',
    desc: 'AI-CLASSIFIED: Semiconductor Components — HS auto-matched 99.2% confidence, dual-use screened.',
    weight: 'AI: 9,850.00 KGS (est.)',
    hs2: 'AI MATCH: 8542.31',
    ref: 'EXV-1005-LHR',
  },
  {
    id: 'premium',
    tagline: 'Executive 6-document suite',
    name: 'Premium Dossier Pack',
    icon: 'diamond',
    incoterms: 'MULTI — Full Contract Suite',
    hs: 'COMPOSITE',
    port: 'GLOBAL ROUTING',
    shipper: 'Enterprise Client\nWhite-Glove Onboarding',
    consignee: 'All Counterparties\nSingle Source of Truth',
    vessel: 'MULTI-VESSEL',
    voyage: 'CONSOLIDATED',
    pol: 'MULTI-POL',
    pod: 'MULTI-POD',
    desc: 'Executive-grade bundle: B/L + CO + Insurance + Packing List, cross-validated, one signature — our most complete product.',
    weight: 'SUITE: 6 DOCUMENTS',
    hs2: 'STATUS: ALL CLEAR',
    ref: 'EXV-SUITE-001',
  },
] as const;

const PIPELINE = ['Select', 'Prefill', 'Validate', 'Stamp', 'Deliver'] as const;
/** Pipeline stages completed so far (the mock stops at "Validate"). */
const PIPELINE_DONE = 3;

/** Bar widths (px) of the decorative barcode on the paper. */
const BARCODE = [1, 2, 1, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 1, 3, 1, 2];
/** 6×6 decorative QR matrix. */
const QR = [
  1, 0, 1, 1, 0, 1,
  1, 1, 0, 0, 1, 1,
  0, 1, 1, 1, 0, 0,
  1, 0, 0, 1, 1, 1,
  1, 1, 1, 0, 0, 1,
  0, 1, 0, 1, 1, 1,
];

const FEATURES = ['Intelligent Template Memory', 'Digital Signatures', 'Bank-Grade Compliance & API Ready'];

/** Read-only field shown in the engine's sidebar. */
function EngineField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <span className="block font-mono text-micro uppercase text-white/50">{label}</span>
      <div className="rounded border border-rule-dark bg-white/5 px-2.5 py-2 font-mono text-micro tracking-normal text-white/70">
        {value}
      </div>
    </div>
  );
}

/** Label/value cell of the paper document. */
function PaperLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-micro uppercase text-muted">{children}</div>;
}

export function ProductShowcaseBlock() {
  const [activeDoc, setActiveDoc] = React.useState(0);
  const doc = DOC_TEMPLATES[activeDoc];
  const [shipperName, shipperAddr] = doc.shipper.split('\n');
  const [consigneeName, consigneeAddr] = doc.consignee.split('\n');

  return (
    <AnimatedSection
      className="relative w-full overflow-hidden border-y border-rule bg-surface py-24 md:py-32"
      id="document-engine"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Marketing copy — leads on mobile, sits right on desktop */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Document Automation"
              title={
                <>
                  Trade Documents,
                  <br />
                  Automated &amp; Perfected.
                </>
              }
              description="Stop wasting hours on manual paperwork. Instantly generate, digitally sign, and manage strictly compliant global trade documents from official templates."
            />

            <StaggerContainer as="ul" className="mt-10 border-y border-rule" staggerChildren={0.1} delayChildren={0.2}>
              {FEATURES.map((feature) => (
                <StaggerItem
                  as="li"
                  key={feature}
                  className="flex items-center gap-4 border-b border-rule py-4 last:border-b-0"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-bg text-label text-emerald"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="text-base font-medium text-obsidian">{feature}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal delay={0.35} y={12} className="mt-10">
              <Link className="btn-primary min-h-[52px] w-full px-8 py-4 sm:w-auto" href="/rfq">
                Request Exvorta Docs Access →
              </Link>
            </Reveal>
          </div>

          {/* Document Engine mock */}
          <Reveal className="order-2 lg:order-1" y={36} duration={0.9}>
            <TiltCard maxTilt={4} glow={false}>
              <div className="on-dark flex flex-col overflow-hidden rounded-xl border border-rule-dark bg-dashboard shadow-lift md:min-h-[640px]">
                {/* Window chrome */}
                <div className="flex h-10 shrink-0 items-center border-b border-rule-dark bg-white/5 px-4">
                  <div className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 pe-8">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
                    <span className="font-mono text-micro uppercase text-white/70">Document Engine</span>
                    <span className="rounded-sm border border-rule-dark px-1.5 py-0.5 font-mono text-micro text-white/50">AI</span>
                  </div>
                </div>

                {/* Pipeline stages */}
                <ol
                  className="flex items-center border-b border-rule-dark bg-white/[0.02] px-4 py-3 font-mono text-micro uppercase"
                  aria-label="Document pipeline"
                >
                  {PIPELINE.map((stage, i) => {
                    const done = i < PIPELINE_DONE;
                    return (
                      <React.Fragment key={stage}>
                        <li className="flex items-center gap-1.5">
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border text-micro font-bold ${
                              done
                                ? 'border-success/50 bg-success-bg text-success'
                                : 'border-rule-dark bg-white/5 text-white/50'
                            }`}
                          >
                            {done ? '✓' : i + 1}
                          </span>
                          <span className={`hidden sm:inline ${done ? 'text-white/80' : 'text-white/50'}`}>{stage}</span>
                        </li>
                        {i < PIPELINE.length - 1 && (
                          <span
                            aria-hidden
                            className={`mx-2 h-px flex-1 ${i < PIPELINE_DONE - 1 ? 'bg-success/40' : 'bg-white/10'}`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </ol>

                <div className="flex flex-1 flex-col md:flex-row">
                  {/* Sidebar: template picker + read-only fields */}
                  <div className="flex flex-col border-b border-rule-dark bg-sidebar p-4 md:w-[34%] md:border-b-0 md:border-e md:p-5">
                    <span className="mb-3 block font-mono text-micro uppercase text-white/50">Select Template</span>
                    <div
                      role="tablist"
                      aria-label="Document templates"
                      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0"
                    >
                      {DOC_TEMPLATES.map((t, i) => {
                        const active = i === activeDoc;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setActiveDoc(i)}
                            className={`flex shrink-0 items-center justify-between gap-3 rounded border px-3 py-2 text-start font-mono text-micro tracking-normal transition-colors duration-200 md:w-full ${
                              active
                                ? 'border-success/50 bg-success-bg text-white'
                                : 'border-rule-dark bg-white/[0.03] text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="flex min-w-0 items-start gap-2.5">
                              <DocTemplateIcon
                                name={t.icon as DocTemplateIconName}
                                className={`mt-px h-4 w-4 shrink-0 transition-colors ${active ? 'text-success' : 'text-white/50'}`}
                              />
                              <span className="min-w-0">
                                <span className="block whitespace-nowrap leading-tight md:whitespace-normal">{t.name}</span>
                                <span className="mt-0.5 hidden font-sans text-micro tracking-normal text-white/50 md:block">
                                  {t.tagline}
                                </span>
                              </span>
                            </span>
                            {active && (
                              <span className="hidden text-success md:inline" aria-hidden>
                                ●
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 hidden space-y-4 md:mt-8 md:block">
                      <EngineField label="Incoterms" value={doc.incoterms} />
                      <EngineField label="HS Code" value={doc.hs} />
                      <EngineField label="Port of Origin" value={doc.port} />
                    </div>

                    <Link
                      href="/rfq"
                      aria-label="Generate document"
                      className="btn-primary mt-6 hidden w-full justify-center whitespace-nowrap px-3 py-3 md:mt-auto md:flex"
                    >
                      Generate →
                    </Link>
                  </div>

                  {/* Paper preview */}
                  <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-card p-4 sm:p-6 md:p-8">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(white_0.5px,transparent_0.5px)] [background-size:20px_20px]"
                    />
                    <div className="relative flex w-full max-w-sm flex-col bg-surface p-5 text-obsidian shadow-lift md:h-full md:max-w-none">
                      {/* Header: barcode + reference */}
                      <div className="mb-4 flex items-start justify-between border-b border-rule pb-2">
                        <div className="flex h-6 items-end gap-px" aria-hidden>
                          {BARCODE.map((w, i) => (
                            <span key={i} className="h-full bg-obsidian" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                        <div className="text-end">
                          <PaperLabel>Document Reference</PaperLabel>
                          <div className="font-mono text-micro tracking-normal text-obsidian">REF: {doc.ref}</div>
                        </div>
                      </div>

                      {/* Partners */}
                      <div className="grid grid-cols-2 border-b border-rule-strong">
                        <div className="border-e border-rule-strong p-2">
                          <PaperLabel>1. Shipper</PaperLabel>
                          <div className="mt-0.5 text-micro font-light leading-tight tracking-normal">
                            {shipperName}
                            <br />
                            {shipperAddr}
                          </div>
                        </div>
                        <div className="p-2">
                          <PaperLabel>2. Consignee</PaperLabel>
                          <div className="mt-0.5 text-micro font-light leading-tight tracking-normal">
                            {consigneeName}
                            <br />
                            {consigneeAddr}
                          </div>
                        </div>
                      </div>

                      {/* Logistics */}
                      <div className="grid grid-cols-2 border-b border-rule-strong bg-surface-2/60 sm:grid-cols-4">
                        {[
                          ['Vessel', doc.vessel],
                          ['Voyage', doc.voyage],
                          ['POL', doc.pol],
                          ['POD', doc.pod],
                        ].map(([label, value], i) => (
                          <div
                            key={label}
                            className={`p-2 ${i % 2 === 0 ? 'border-e border-rule-strong' : ''} ${
                              i < 3 ? 'sm:border-e sm:border-rule-strong' : 'sm:border-e-0'
                            }`}
                          >
                            <PaperLabel>{label}</PaperLabel>
                            <div className="text-micro tracking-normal">{value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <div className="mb-auto pt-3">
                        <PaperLabel>7. Description of goods and services</PaperLabel>
                        <p className="mt-1.5 text-label font-light leading-relaxed tracking-normal">{doc.desc}</p>
                        <div className="mt-2 grid grid-cols-1 gap-1 border-t border-rule pt-2 font-mono text-micro tracking-normal text-muted sm:grid-cols-2 sm:gap-2">
                          <div>
                            WEIGHT: <span className="text-obsidian">{doc.weight}</span>
                          </div>
                          <div className="sm:text-end">
                            HS: <span className="text-obsidian">{doc.hs2}</span>
                          </div>
                        </div>
                      </div>

                      {/* Signature */}
                      <div className="mt-6 flex items-end justify-between border-t border-rule pt-3">
                        <div className="border border-rule p-0.5" aria-hidden>
                          <div className="grid h-6 w-6 grid-cols-6 gap-px bg-surface">
                            {QR.map((on, i) => (
                              <span key={i} className={on ? 'bg-obsidian' : 'bg-surface'} />
                            ))}
                          </div>
                        </div>
                        <div className="min-w-[100px] text-end">
                          <PaperLabel>Digital Signature</PaperLabel>
                          <span className="sr-only">Alex Mercer</span>
                          <svg
                            aria-hidden
                            viewBox="0 0 96 28"
                            className="ms-auto mt-1 h-6 w-24 text-info"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 21c5-12 9-16 11-12 1.5 3-4 12-1 12 4 0 6-9 10-9 3 0 1 8 4 8 4 0 5-7 9-7 3 0 2 6 5 6 5 0 8-5 13-6 5-1 10 1 17-1" />
                          </svg>
                        </div>
                      </div>

                      <span className="absolute bottom-3 end-3 rounded-sm border border-success/40 bg-emerald px-3 py-1.5 font-mono text-micro font-bold uppercase text-white shadow-lift">
                        ✓ Compliance Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile action row — the sidebar button is desktop-only */}
                <div className="border-t border-rule-dark bg-sidebar p-4 md:hidden">
                  <Link href="/rfq" className="btn-primary w-full justify-center py-3">
                    Generate Document
                  </Link>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default ProductShowcaseBlock;
