'use server'

import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkRateLimit } from '@/lib/rate-limit'

export type LoginState = { success: boolean; error: string | null }

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  // Rate-limit brute-force attempts per IP (same limiter as public forms).
  const ip = (await headers()).get('x-forwarded-for') || 'unknown'
  const payloadClient = await getPayloadClient()
  const rate = await checkRateLimit(payloadClient, `login:${ip}`)
  if (!rate.allowed) {
    return { success: false, error: 'Too many attempts. Please try again later.' }
  }

  try {
    const payload = await getPayloadClient()
    const { token } = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    } else {
      return { success: false, error: 'Authentication failed' }
    }
  } catch {
    return { success: false, error: 'Invalid credentials' }
  }

  redirect('/')
}
