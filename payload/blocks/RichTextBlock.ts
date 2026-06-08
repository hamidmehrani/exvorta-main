import { Block } from 'payload'
import {
  lexicalEditor,
  BlocksFeature,
  UploadFeature,
  HeadingFeature,
  AlignFeature,
  InlineToolbarFeature,
  LinkFeature,
  HTMLConverterFeature,
} from '@payloadcms/richtext-lexical'
import { CTABlock } from './CTABlock'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          AlignFeature(),
          InlineToolbarFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'posts'],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'text',
                  },
                ],
              },
            },
          }),
          BlocksFeature({
            blocks: [CTABlock],
          }),
          HTMLConverterFeature({}),
        ],
      }),
      required: true,
      localized: true,
    },
  ],
}
