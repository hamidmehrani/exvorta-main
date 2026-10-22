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

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setIsPending(false)
      setError('Security check not complete — please wait for verification.')
      return
    }

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

  // Underline fields (design system: "focus = sharp 1px border-bottom"). The
  // rest border was 5% black — effectively invisible — so the form read as a
  // blank column; 28% obsidian is clearly a field without becoming a box.
  const inputClass = `peer bg-transparent border-b border-rule-strong hover:border-obsidian/60 text-obsidian placeholder:text-transparent rounded-none px-0 py-4 pt-6 text-sm focus:ring-0 focus-visible:outline-none focus:border-emerald focus:shadow-[0_1px_0_0_var(--color-emerald)] uppercase font-mono tracking-widest w-full transition-[border-color,box-shadow] duration-300 ${error ? 'border-danger' : ''}`
  const labelClass = `absolute start-0 top-6 text-muted text-label uppercase font-mono tracking-widest transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:text-micro peer-focus:text-emerald peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-micro peer-[:not(:placeholder-shown)]:text-muted`

  if (success) {
    return (
      <m.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="frame bg-surface border border-rule p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
      >
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-emerald/10 border border-emerald flex items-center justify-center mb-8"
        >
          <svg className="w-6 h-6 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <m.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
              strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7" 
            />
          </svg>
        </m.div>
        <h2 className="mb-4 font-serif text-title font-semibold text-obsidian">Request received.</h2>
        <MonoLabel className="max-w-md text-label uppercase leading-relaxed text-muted">
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
        <div className="flex justify-center">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken(undefined)}
          />
        </div>
      )}

      <StaggerContainer delayChildren={0.1} staggerChildren={0.05} className="space-y-8">
        <div className="mb-8 flex items-center gap-4">
          <p className="eyebrow !text-obsidian"><span className="eyebrow-index">01</span>Company Details</p>
          <Hairline className="flex-1" />
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
            <input id="rfq-email" name="email" className={inputClass} placeholder="YOUR EMAIL" type="email" required disabled={isPending} />
            <label htmlFor="rfq-email" className={labelClass}>YOUR EMAIL</label>
<span className="mt-1 block font-mono text-micro text-muted">Corporate or Gmail — both fine.</span>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
        </div>
      </StaggerContainer>

      <StaggerContainer delayChildren={0.1} staggerChildren={0.05} className="space-y-8">
        <div className="mb-8 flex items-center gap-4">
          <p className="eyebrow !text-obsidian"><span className="eyebrow-index">02</span>Project Goals</p>
          <Hairline className="flex-1" />
        </div>
        <div className="space-y-10">
          <InputWrapper>
            <select id="rfq-businessType" name="businessType" className={inputClass} disabled={isPending} defaultValue="" required>
              <option value="" disabled hidden></option>
              <option value="importer">Importer</option>
              <option value="exporter">Exporter</option>
              <option value="trading_company">Trading Company</option>
            </select>
            <label htmlFor="rfq-businessType" className={`${labelClass} peer-valid:top-0 peer-valid:text-micro peer-valid:text-muted`}>BUSINESS TYPE *</label>
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
        <div className="mb-8 flex items-center gap-4">
          <p className="eyebrow !text-obsidian"><span className="eyebrow-index">03</span>Timeline &amp; Budget</p>
          <Hairline className="flex-1" />
        </div>
        <div className="grid grid-cols-1 gap-10">
          <InputWrapper>
            <select id="rfq-budget" name="budget" className={inputClass} disabled={isPending} defaultValue="" required>
              <option value="" disabled hidden></option>
              <option value="$800–1.5k">$800–1.5k</option>
              <option value="$1.5–3k">$1.5–3k</option>
              <option value="$3k+">$3k+</option>
            </select>
            <label htmlFor="rfq-budget" className={`${labelClass} peer-valid:top-0 peer-valid:text-micro peer-valid:text-muted`}>ALLOCATED BUDGET *</label>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-emerald peer-focus:w-full transition-all duration-500"></div>
          </InputWrapper>
        </div>
      </StaggerContainer>

      <StaggerItem className="pt-8">
        <MagneticButton fullWidth>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary min-h-[56px] w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending && (
              <svg className="h-3 w-3 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isPending ? '[ PROCESSING... ]' : '[ SUBMIT PROPOSAL REQUEST ]'}
          </button>
        </MagneticButton>
        <AnimatePresence>
          {error && (
            <m.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="mt-4 text-center font-mono text-label font-bold uppercase text-danger"
            >
              [ ERROR: {error} ]
            </m.div>
          )}
        </AnimatePresence>
        <p className="mt-8 text-center font-mono text-micro uppercase text-muted">
          Your information is handled with the highest level of professional discretion.
        </p>
      </StaggerItem>
    </m.form>
  )
}
