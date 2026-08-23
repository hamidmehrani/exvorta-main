'use client'

import React, { useState, useEffect } from 'react'
import { submitWaitlist } from '@/actions/submitWaitlist'
import { Turnstile } from '@marsidev/react-turnstile'
import { m, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '@/components/ui/Reveal'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { MonoLabel } from '@/components/ui/MonoLabel'

interface Props {
  placeholder?: string
  buttonText?: string
  source?: string
}

export function WaitlistClientForm({ placeholder, buttonText, source }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string>()
  const [isValid, setIsValid] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Basic validation for the pulse effect
    setIsValid(email.length > 5 && email.includes('@'))
  }, [email])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const emailVal = formData.get('email') as string
    const botField = formData.get('bot-field') as string
    
    const payloadData: Record<string, unknown> = {}
    formData.forEach((value, key) => {
      if (!['email', 'bot-field', 'cf-turnstile-response', 'source'].includes(key) && value) {
        payloadData[key] = value
      }
    })

    try {
      const result = await submitWaitlist({
        source: 'Waitlist',
        email: emailVal,
        botField,
        turnstileToken,
        payload: Object.keys(payloadData).length > 0 ? payloadData : undefined
      })
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsPending(false)
    }
  }

  const inputClass = "bg-transparent border-b border-white/20 px-8 py-5 text-white placeholder:text-transparent font-mono tracking-widest outline-none focus:border-brand-emerald focus:ring-0 transition-colors rounded-none text-center w-full peer relative z-10"
  const labelClass = "absolute inset-0 flex items-center justify-center text-white/40 font-mono tracking-widest uppercase transition-all duration-300 pointer-events-none peer-focus:scale-110 peer-focus:opacity-0 peer-not-placeholder-shown:scale-110 peer-not-placeholder-shown:opacity-0"

  const InputWrapper = ({ children, isFocused }: { children: React.ReactNode, isFocused?: boolean }) => (
    <div className="relative w-full group overflow-hidden bg-brand-obsidian/50 backdrop-blur-sm">
      {children}
      <div className="absolute inset-0 pointer-events-none border border-transparent group-focus-within:border-brand-emerald/30 group-focus-within:shadow-[inset_0_0_20px_rgba(var(--brand-emerald),0.1)] transition-all duration-500"></div>
    </div>
  )

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="w-full max-w-md"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-none relative">
        <input type="hidden" name="source" value={source || 'Waitlist'} />
        <input type="hidden" name="bot-field" />
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="opacity-0 h-0 w-0 overflow-hidden pointer-events-none absolute">
            <Turnstile 
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} 
              onSuccess={(token) => setTurnstileToken(token)}
            />
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {success ? (
            <m.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="flex flex-col items-center gap-8 py-8 relative"
            >
              <div className="absolute inset-0 bg-brand-emerald/5 blur-[50px] rounded-full pointer-events-none" />
              <m.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                className="w-20 h-20 border border-brand-emerald bg-brand-emerald/10 flex items-center justify-center rounded-none"
              >
                <svg className="w-8 h-8 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <m.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
                    strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7" 
                  />
                </svg>
              </m.div>
              <div className="flex flex-col items-center gap-2 text-center">
                <MonoLabel className="text-xl font-bold text-white uppercase tracking-widest">[ ACCESS GRANTED ]</MonoLabel>
                <MonoLabel className="text-xs tracking-widest text-white/50 uppercase">
                  POSITION SECURED IN QUEUE. YOU WILL BE NOTIFIED WHEN YOUR NODE IS READY.
                </MonoLabel>
              </div>
              <div className="flex flex-col items-center mt-4">
                <MonoLabel className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Waitlist Position</MonoLabel>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-mono text-brand-emerald font-bold">#</span>
                  <m.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-mono text-white tracking-widest tabular-nums"
                  >
                    0412
                  </m.span>
                </div>
              </div>
            </m.div>
          ) : (
            <m.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4 relative"
            >
              <InputWrapper>
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="ENTER FULL NAME..."
                  className={inputClass}
                  disabled={isPending}
                />
                <label className={labelClass}>ENTER FULL NAME...</label>
              </InputWrapper>
              
              <InputWrapper>
                <input 
                  name="company"
                  type="text" 
                  required
                  placeholder="ENTER COMPANY NAME..."
                  className={inputClass}
                  disabled={isPending}
                />
                <label className={labelClass}>ENTER COMPANY NAME...</label>
              </InputWrapper>
              
              <InputWrapper>
                <input 
                  name="role"
                  type="text" 
                  required
                  placeholder="ENTER YOUR ROLE..."
                  className={inputClass}
                  disabled={isPending}
                />
                <label className={labelClass}>ENTER YOUR ROLE...</label>
              </InputWrapper>
              
              <InputWrapper>
                <input 
                  name="email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder || 'ENTER CORPORATE EMAIL...'}
                  className={inputClass}
                  disabled={isPending}
                />
                <label className={labelClass}>{placeholder || 'ENTER CORPORATE EMAIL...'}</label>
              </InputWrapper>
              
              <div className="mt-4">
                <m.div
                  animate={isValid && !isPending ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 1.5, repeat: isValid ? Infinity : 0, ease: "easeInOut" }}
                >
                  <MagneticButton>
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="group relative bg-white text-black px-8 py-5 text-sm font-mono uppercase tracking-[0.3em] transition-all w-full font-bold rounded-none disabled:opacity-80 cursor-pointer overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                      <div className={`absolute inset-0 w-full h-full bg-brand-emerald origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[0.65,0,0.35,1] ${isPending ? 'scale-y-100' : ''}`}></div>
                      <span className="relative z-10 transition-colors duration-500 group-hover:text-white flex items-center justify-center gap-2">
                        {isPending && (
                          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {isPending ? '[ SECURING... ]' : (buttonText || '[ SECURE POSITION ]')}
                      </span>
                    </button>
                  </MagneticButton>
                </m.div>
              </div>
              
              <AnimatePresence>
                {error && (
                  <m.div 
                    initial={{ opacity: 0, x: [-10, 10, -10, 10, 0] }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-red-500 font-mono text-[10px] tracking-widest text-center mt-2 uppercase border border-red-500/30 bg-red-500/5 py-2"
                  >
                    [ ERROR: {error} ]
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          )}
        </AnimatePresence>
      </form>
    </m.div>
  )
}

export default WaitlistClientForm;
