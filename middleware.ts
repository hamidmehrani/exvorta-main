import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

let redirectCache: Array<{from: string; to: string; statusCode: number}> = [];
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getRedirects(reqUrl: string) {
  if (Date.now() - lastFetch < CACHE_TTL) return redirectCache;
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || new URL(reqUrl).origin;
    const res = await fetch(`${serverUrl}/api/redirects?limit=1000`);
    if (res.ok) {
      redirectCache = (await res.json())?.docs || [];
      lastFetch = Date.now();
    }
  } catch (e) {
    console.error('Redirect fetch failed', e);
  }
  return redirectCache;
}

export default async function middleware(req: NextRequest) {
  try {
    const redirects = await getRedirects(req.url);
    const pathname = req.nextUrl.pathname;
    const match = redirects.find((r: {from: string; to: string; statusCode?: number | string}) => r.from === pathname);
    if (match && match.to) {
      return NextResponse.redirect(new URL(match.to, req.url), { status: parseInt(String(match.statusCode)) || 301 });
    }
  } catch {
    // Ignore errors
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon.ico|icon.png|fonts/.*|images/.*|.*\\.png$|.*\\.woff2$).*)']
};
