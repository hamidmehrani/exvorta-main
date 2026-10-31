'use client'

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

export interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError?: (error?: Error | string) => void
  onExpire?: () => void
  theme?: 'auto' | 'light' | 'dark'
  className?: string
  id?: string
}

export interface TurnstileWidgetRef {
  reset: () => void
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      onSuccess,
      onError,
      onExpire,
      theme = 'dark',
      className = '',
      id,
    },
    ref,
  ) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const turnstileInstanceRef = useRef<TurnstileInstance | undefined>(undefined)

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          setErrorMessage(null)
          try {
            turnstileInstanceRef.current?.reset()
          } catch {
            // Graceful fallback if widget instance unmounted
          }
        },
      }),
      [],
    )

    const handleSuccess = useCallback(
      (token: string) => {
        setErrorMessage(null)
        onSuccess(token)
      },
      [onSuccess],
    )

    const handleError = useCallback(
      (err?: Error | string) => {
        setErrorMessage(
          'Security verification issue. Please check your connection or ad blocker and try again.',
        )
        onError?.(err)
      },
      [onError],
    )

    const handleExpire = useCallback(() => {
      setErrorMessage('Security verification expired. Please verify again.')
      onExpire?.()
    }, [onExpire])

    // If site key is not configured, degrade gracefully
    if (!siteKey) {
      if (process.env.NODE_ENV !== 'production') {
        return (
          <div
            className={`flex items-center justify-center p-3 font-mono text-[11px] text-muted/70 border border-dashed border-rule rounded-[4px] bg-surface-2/40 ${className}`.trim()}
          >
            [DEV: Turnstile verification bypassed — NEXT_PUBLIC_TURNSTILE_SITE_KEY unset]
          </div>
        )
      }
      return null
    }

    return (
      <div className={`flex flex-col items-center justify-center min-h-[65px] ${className}`.trim()}>
        <Turnstile
          ref={turnstileInstanceRef}
          siteKey={siteKey}
          id={id}
          options={{ theme }}
          onSuccess={handleSuccess}
          onError={handleError}
          onExpire={handleExpire}
        />
        {errorMessage && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-2 text-center font-mono text-xs text-danger tracking-wide"
          >
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)

export default TurnstileWidget
