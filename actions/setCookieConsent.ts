'use server'

import { cookies } from 'next/headers'

export async function setCookieConsent(status: 'accepted' | 'declined') {
  const cookieStore = await cookies()
  cookieStore.set('cookie-consent', status, { 
    maxAge: 31536000, 
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
}
