import { getPayloadClient } from '../lib/payload'

async function linkGlobals() {
  console.log('Linking Global Navigation and Footer via Local API...')
  process.env.DATABASE_URI = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI
  try {
    const payload = await getPayloadClient()

    // Query all pages to get their IDs
    const { docs: pages } = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
    })

    const getPageLink = (slug: string, label: string) => {
      const page = pages.find(p => p.slug === slug)
      if (page) {
        return {
          type: 'reference',
          label,
          reference: {
            relationTo: 'pages',
            value: page.id,
          },
        }
      }
      return { type: 'custom', label, url: `/${slug}` } // Fallback
    }

    const getFallbackLink = (slug: string, label: string) => {
      return { type: 'custom', label, url: `/${slug}` }
    }

    const headerData = {
      links: [
        { link: getFallbackLink('web', 'SOLUTIONS') },
        { link: getPageLink('portfolio', 'PORTFOLIO') },
        { link: getPageLink('ecosystem', 'ECOSYSTEM') },
        { link: getPageLink('rfq', 'REQUEST PROPOSAL') },
      ],
    }

    const footerData = {
      columns: [
        {
          title: 'THE ECOSYSTEM',
          links: [
            { link: getPageLink('web', 'Exvorta Web') },
            { link: getPageLink('ecosystem', 'Exvorta Ecosystem') }, // Or docs
            { link: getPageLink('portfolio', 'Portfolio') },
          ],
        },
        {
          title: 'COMPANY',
          links: [
            { link: getPageLink('the-firm', 'Our Vision') },
            { link: getPageLink('blog', 'Design Blueprints') },
            { link: getPageLink('waitlist', 'Contact Us') },
          ],
        },
        {
          title: 'LEGAL & ACCESS',
          links: [
            { link: getPageLink('rfq', 'Request Proposal') },
            { link: { type: 'custom', label: 'Privacy Policy', url: '/legal#privacy' } },
            { link: { type: 'custom', label: 'Terms of Service', url: '/legal#terms' } },
          ],
        },
      ],
      copyrightText: '© 2026 Exvorta. All rights reserved.',
    }

    try {
      await payload.updateGlobal({
        slug: 'navigation',
        data: headerData as any,
      })
      console.log('Successfully linked Navigation Global with references!')
    } catch (e) {
      console.warn('Reference linking failed for Navigation, retrying with custom links...')
      const fallbackHeaderData = {
        links: [
          { link: getFallbackLink('web', 'SOLUTIONS') },
          { link: getFallbackLink('portfolio', 'PORTFOLIO') },
          { link: getFallbackLink('ecosystem', 'ECOSYSTEM') },
          { link: getFallbackLink('rfq', 'REQUEST PROPOSAL') },
        ],
      }
      await payload.updateGlobal({
        slug: 'navigation',
        data: fallbackHeaderData as any,
      })
      console.log('Successfully linked Navigation Global with custom paths!')
    }

    try {
      await payload.updateGlobal({
        slug: 'footer',
        data: footerData as any,
      })
      console.log('Successfully linked Footer Global with references!')
    } catch (e) {
      console.warn('Reference linking failed for Footer, retrying with custom links...')
      const fallbackFooterData = {
        columns: [
          {
            title: 'THE ECOSYSTEM',
            links: [
              { link: getFallbackLink('web', 'Exvorta Web') },
              { link: getFallbackLink('ecosystem', 'Exvorta Ecosystem') },
              { link: getFallbackLink('portfolio', 'Portfolio') },
            ],
          },
          {
            title: 'COMPANY',
            links: [
              { link: getFallbackLink('the-firm', 'Our Vision') },
              { link: getFallbackLink('blog', 'Design Blueprints') },
              { link: getFallbackLink('waitlist', 'Contact Us') },
            ],
          },
          {
            title: 'LEGAL & ACCESS',
            links: [
              { link: getFallbackLink('rfq', 'Request Proposal') },
              { link: { type: 'custom', label: 'Privacy Policy', url: '/legal#privacy' } },
              { link: { type: 'custom', label: 'Terms of Service', url: '/legal#terms' } },
            ],
          },
        ],
        copyrightText: '© 2026 Exvorta. All rights reserved.',
      }
      await payload.updateGlobal({
        slug: 'footer',
        data: fallbackFooterData as any,
      })
      console.log('Successfully linked Footer Global with custom paths!')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error linking globals:', error)
    process.exit(1)
  }
}

linkGlobals()
