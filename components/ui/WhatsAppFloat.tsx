import React from 'react'
import { getPayloadClient } from '@/lib/payload'

export default async function WhatsAppFloat() {
  const payload = await getPayloadClient()
  let config: any = null

  try {
    config = await payload.findGlobal({
      slug: 'whatsapp-config',
    })
  } catch (error) {}

  if (!config?.enableWidget || !config?.phoneNumber) {
    return null
  }

  const phone = config.phoneNumber.replace(/[^0-9]/g, '')
  const message = config.defaultMessage ? encodeURIComponent(config.defaultMessage) : ''
  const url = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="Chat on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.552 4.195 1.6 6.007L.175 24l6.108-1.597C8.04 23.36 10.016 23.882 12.031 23.882 18.677 23.882 24 18.497 24 11.851 24 5.205 18.677 0 12.031 0zm0 21.84c-1.84 0-3.642-.494-5.218-1.428l-.374-.222-3.87.1012 1.03-3.774-.244-.388c-1.026-1.632-1.567-3.52-1.567-5.467 0-5.688 4.629-10.317 10.317-10.317 5.688 0 10.317 4.629 10.317 10.317 0 5.688-4.629 10.317-10.317 10.317zm5.666-7.72c-.311-.155-1.838-.908-2.124-1.012-.286-.104-.494-.155-.702.155-.208.311-.804 1.012-.986 1.22-.182.208-.364.234-.675.078-.311-.155-1.312-.483-2.502-1.543-.925-.824-1.55-1.84-1.732-2.15-.182-.311-.02-.48.136-.635.14-.14.311-.364.467-.546.155-.182.208-.311.311-.519.104-.208.052-.388-.026-.546-.078-.155-.702-1.692-.962-2.317-.253-.606-.51-.524-.702-.534-.182-.01-.39-.01-.598-.01-.208 0-.546.078-.832.39-.286.311-1.09 1.064-1.09 2.595 0 1.53 1.116 3.01 1.272 3.218.155.208 2.193 3.348 5.312 4.694.743.32 1.322.511 1.775.654.747.237 1.428.203 1.966.123.6-.088 1.838-.751 2.098-1.477.26-.726.26-1.35.182-1.477-.078-.127-.286-.203-.598-.358z" />
      </svg>
    </a>
  )
}
