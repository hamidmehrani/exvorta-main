import { readOnlyPublic } from '../access'
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  access: readOnlyPublic,
  slug: 'media',
  admin: {
    group: 'Media',
    description: 'All images & files served via Cloudinary CDN. Alt text is auto-generated from the filename — refine it for SEO.',
  },
  upload: {
    disableLocalStorage: true, // we are using cloudinary
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 900, position: 'centre' },
      { name: 'hero', width: 1920, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate alt from filename if empty so drag-drop uploads never fail validation
        if (data && !data.alt && data.filename) {
          data.alt = String(data.filename)
            .split('.')[0]
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: { description: 'Auto-filled from filename. Edit for better SEO/accessibility.' },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      required: false,
    },
  ],
}

export default Media
