'use server'

import { getPayloadClient } from '@/lib/payload'

export async function submitRFQ(formData: {
  name: string
  email: string
  companyName?: string
  businessType?: string
  mainMarkets?: string
  budget?: string
  message?: string
}) {
  try {
    const payload = await getPayloadClient()
    
    await payload.create({
      collection: 'form-submissions',
      data: {
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName || '',
        businessType: (formData.businessType as "importer" | "exporter" | "trading_company") || undefined,
        mainMarkets: formData.mainMarkets || '',
        budget: (['$800–1.5k', '$1.5–3k', '$3k+'].includes(String(formData.budget)) ? formData.budget : null) as '$800–1.5k' | '$1.5–3k' | '$3k+' | null,
        message: formData.message || '',
        status: 'pending',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting RFQ:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit form' }
  }
}
