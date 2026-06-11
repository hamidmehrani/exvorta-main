import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  const securityTxt = `Contact: mailto:security@exvorta.com
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en
Canonical: https://exvorta.com/.well-known/security.txt`

  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
