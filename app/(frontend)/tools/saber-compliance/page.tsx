import { redirect } from 'next/navigation'

export default function SaberComplianceRedirect() {
  redirect('/tools/corridor-checker?corridor=ksa_saber')
}
