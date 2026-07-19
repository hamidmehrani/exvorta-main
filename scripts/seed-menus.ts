import { getPayload } from 'payload'
import config from '../payload.config'

async function seedMenus() {
  const payload = await getPayload({ config })

  console.log('Seeding pages...')
  
  // Find or create Home page
  const homeRes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
  })
  
  let homePage = homeRes.docs[0]
  if (!homePage) {
    homePage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        _status: 'published',
        layout: [],
      },
    })
    console.log('Created Home page.')
  } else {
    console.log('Home page already exists.')
  }

  // Find or create Contact page
  const contactRes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'contact' } },
  })
  
  let contactPage = contactRes.docs[0]
  if (!contactPage) {
    contactPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Contact Us',
        slug: 'contact',
        _status: 'published',
        layout: [],
      },
    })
    console.log('Created Contact page.')
  } else {
    console.log('Contact page already exists.')
  }

  console.log('Seeding menus...')

  const navLinks = [
    {
      link: {
        type: 'reference' as const,
        reference: { relationTo: 'pages' as const, value: homePage.id },
        label: 'Home',
        openInNewTab: false,
      },
    },
    {
      link: {
        type: 'reference' as const,
        reference: { relationTo: 'pages' as const, value: contactPage.id },
        label: 'Contact',
        openInNewTab: false,
      },
    },
  ]

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      links: navLinks,
    },
  })
  console.log('Updated Navigation global.')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          title: 'Quick Links',
          links: navLinks,
        },
      ],
      copyrightText: 'Boilerplate Engine',
    },
  })
  console.log('Updated Footer global.')

  console.log('Seed completed successfully.')
  process.exit(0)
}

seedMenus().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
