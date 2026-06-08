import { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  fields: [
    { name: 'url', type: 'text', required: true, admin: { description: 'YouTube or Vimeo URL' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
  ],
}
