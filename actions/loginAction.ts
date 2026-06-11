'use server'

import { getPayloadClient } from '@/lib/payload'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type LoginState = { success: boolean; error: string | null }

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const locale = formData.get('locale') as string || 'en'

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
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
  } catch (err) {
    return { success: false, error: 'Invalid credentials' }
  }

  redirect(`/${locale}`)
}
