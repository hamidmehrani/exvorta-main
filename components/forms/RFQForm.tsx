'use client'

import React, { useState } from 'react'
import { StaggerContainer, StaggerItem, EASE_OUT } from '@/components/ui/Reveal'
import { m, AnimatePresence } from 'framer-motion'
import { submitRFQ } from '@/app/(frontend)/actions/submitRFQ'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { MonoLabel } from '@/components/ui/MonoLabel'
import { Hairline } from '@/components/ui/Hairline'
import { Turnstile } from '@marsidev/react-turnstile'

const InputWrapper = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <StaggerItem className="relative w-full group">
    {children}
  </StaggerItem>
)

export default function RFQForm() {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await submitRFQ({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        companyName: formData.get('companyName') as string,
        businessType: formData.get('businessType') as string,
        mainMarkets: formData.get('mainMarkets') as string,
        budget: formData.get('budget') as string,
        message: formData.get('message') as string,
        botField: formData.get('bot-field') as string,
        turnstileToken: turnstileToken,
      })

      if (res.success) {
        setSuccess(true)
      } else {
        setError(res.error || 'Submission failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const inputClass = `peer bg-transparent border-b border-hairline-light text-black placeholder:text-transparent rounded-none px-0 py-4 pt-6 text-sm focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-emerald focus:border-brand-emerald uppercase font-mono tracking-widest w-full transition-colors duration-300 ${error ? 'border-red-500' : ''}`
  const labelClass = `absolute left-0 top-6 text-black/40 text-[10px] uppercase font-mono tracking-widest transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-[8px] peer-focus:text-brand-emerald peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[8px] peer-[:not(:placeholder-shown)]:text-black/60 peer-valid:top-0 peer-valid:text-[8px] peer-valid:text-black/60`

  if (success) {
    return (
      <m.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="bg-surface border border-hairline-light p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
      >
        <m.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-brand-emerald/10 border border-brand-emerald flex items-center justify-center mb-8"
        >
          <svg className="w-6 h-6 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <m.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
              strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7" 
            />
          </svg>
        </m.div>
        <MonoLabel className="text-2xl font-bold text-black mb-4 uppercase">[ SUCCESS ]</MonoLabel>
        <MonoLabel className="text-sm tracking-widest text-black/60 uppercase max-w-md">
          Your architectural requirements have been securely logged. An engineering director will initiate contact within 24 hours.
        </MonoLabel>
      </m.div>
    )
  }

  return (
    <m.form 
      onSubmit={onSubmit} 
      className="space-y-16"
      animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <input type="hidden" name="bot-field" />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="opacity-0 h-0 w-0 overflow-hidden pointer-events-none absolute">
          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} />
        </div>
      )}

      <StaggerContainer delayChildren={0.1} staggerChildren={0.05} className="space-y-8">
        <div className="mb-8 flex items-center gap-4 text-xs tracking-widest text-black uppercase">
          <MonoLabel>01. Company Details</MonoLabel>
          <Hairline className="flex-grow bg-black/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div className="md:col-span-2">
            <InputWrapper>
               <input id="rfq-name" name="name" className={inputClass} placeholder="FULL NAME" type="text" required disabled={isPending} />
               <label htmlFor="rfq-name" className={labelClass}>FULL NAME *</label>
               <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
            </InputWrapper>
          </div>
          <InputWrapper>
            <input id="rfq-companyName" name="companyName" className={inputClass} placeholder="COMPANY NAME" type="text" disabled={isPending} />
            <label htmlFor="rfq-companyName" className={labelClass}>COMPANY NAME (OPTIONAL)</label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
          <InputWrapper>
            <input id="rfq-email" name="email" className={inputClass} placeholder="YOUR EMAIL" type="email" disabled={isPending} />
            <label htmlFor="rfq-email" className={labelClass}>YOUR EMAIL</label>
<span className="block text-[9px] font-mono text-black/30 tracking-wide mt-1">Corporate or Gmail — both fine.</span>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
        </div>
      </StaggerContainer>

      <StaggerContainer delayChildren={0.1} staggerChildren={0.05} className="space-y-8">
        <div className="mb-8 flex items-center gap-4 text-xs tracking-widest text-black uppercase">
          <MonoLabel>02. Project Goals</MonoLabel>
          <Hairline className="flex-grow bg-black/10" />
        </div>
        <div className="space-y-10">
          <InputWrapper>
            <select id="rfq-businessType" name="businessType" className={inputClass} disabled={isPending} defaultValue="" required>
              <option value="" disabled hidden></option>
              <option value="importer">Importer</option>
              <option value="exporter">Exporter</option>
              <option value="trading_company">Trading Company</option>
            </select>
            <label htmlFor="rfq-businessType" className={`${labelClass} peer-valid:top-0 peer-valid:text-[8px] peer-valid:text-black/60`}>BUSINESS TYPE *</label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
          <InputWrapper>
            <input id="rfq-mainMarkets" name="mainMarkets" className={inputClass} placeholder="MAIN MARKETS" type="text" disabled={isPending} />
            <label htmlFor="rfq-mainMarkets" className={labelClass}>MAIN MARKETS</label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
          <InputWrapper>
            <textarea id="rfq-message" name="message" className={`${inputClass} resize-none`} placeholder="Briefly describe your main challenge or vision." rows={3} disabled={isPending}></textarea>
            <label htmlFor="rfq-message" className={labelClass}>PROJECT VISION</label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
        </div>
      </StaggerContainer>

      <StaggerContainer delayChildren={0.1} staggerChildren={0.05} className="space-y-8">
        <div className="mb-8 flex items-center gap-4 text-xs tracking-widest text-black uppercase">
          <MonoLabel>03. Timeline & Budget</MonoLabel>
          <Hairline className="flex-grow bg-black/10" />
        </div>
        <div className="grid grid-cols-1 gap-10">
          <InputWrapper>
            <select id="rfq-budget" name="budget" className={inputClass} disabled={isPending} defaultValue="" required>
              <option value="" disabled hidden></option>
              <option value="$800–1.5k">$800–1.5k</option>
              <option value="$1.5–3k">$1.5–3k</option>
              <option value="$3k+">$3k+</option>
            </select>
            <label htmlFor="rfq-budget" className={`${labelClass} peer-valid:top-0 peer-valid:text-[8px] peer-valid:text-black/60`}>ALLOCATED BUDGET *</label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
        </div>
      </StaggerContainer>

      <StaggerItem className="pt-8">
        <MagneticButton>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full relative py-6 rounded-none uppercase tracking-widest text-xs font-mono font-bold block disabled:opacity-80 overflow-hidden bg-text text-bg border border-text group hover:shadow-[0_0_20px_rgba(var(--brand-emerald),0.3)] transition-all duration-500"
          > 
            <div className={`absolute inset-0 w-full h-full bg-brand-emerald origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.65,0,0.35,1] ${isPending ? 'scale-y-100' : ''}`}></div>
            <span className="relative z-10 transition-colors duration-500 group-hover:text-bg flex items-center justify-center gap-2">
              {isPending && (
                <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isPending ? '[ PROCESSING... ]' : '[ SUBMIT PROPOSAL REQUEST ]'}
            </span>
          </button>
        </MagneticButton>
        <AnimatePresence>
          {error && (
            <m.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 font-mono text-[10px] tracking-widest text-center mt-4 uppercase font-bold"
            >
              [ ERROR: {error} ]
            </m.div>
          )}
        </AnimatePresence>
        <p className="mt-8 text-center text-[9px] text-black/40 font-mono uppercase tracking-widest"> 
          Your information is handled with the highest level of professional discretion.
        </p>
      </StaggerItem>
    </m.form>
  )
}
