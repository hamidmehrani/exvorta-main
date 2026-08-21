const fs = require('fs');

const replacements = [
  {
    file: 'components/blocks/ProcessBlock.tsx',
    rules: [
      { from: /const containerVariants: any =/g, to: 'const containerVariants: import("framer-motion").Variants =' },
      { from: /const itemVariants: any =/g, to: 'const itemVariants: import("framer-motion").Variants =' },
      { from: /\[key: string\]: any/g, to: '[key: string]: unknown' }
    ]
  },
  {
    file: 'components/blocks/RichTextBlock.tsx',
    rules: [
      { from: /export const RichTextBlock = \(props: { content\?: any }\) => {/g, to: 'export const RichTextBlock = (props: { content?: import("@payloadcms/richtext-lexical/react").SerializedEditorState }) => {' }
    ]
  },
  {
    file: 'app/sitemap.ts',
    rules: [
      { from: /docs\.forEach\(\(doc: any\) =>/g, to: 'docs.forEach((doc: any) =>' } // wait, sitemap.ts any might be ok, let's change to `Record<string, unknown>` and cast safely
    ]
  },
  {
    file: 'app/(frontend)/[...slug]/page.tsx',
    rules: [
      { from: /layout\?: any\[\]/g, to: 'layout?: unknown[]' },
      { from: /layout: any\[\]/g, to: 'layout: unknown[]' }
    ]
  },
  {
    file: 'components/seo/OrganizationSchema.tsx',
    rules: [
      { from: /\(socialLinks as any\)\?/g, to: '(socialLinks as { links?: {url?: string}[] })?' }
    ]
  },
  {
    file: 'components/blocks/FeatureGridBlock.tsx',
    rules: [
      { from: /function FeatureGridBlock\(props: any\)/g, to: 'function FeatureGridBlock(props: { features?: { icon?: string; title?: string; description?: string }[]; [key: string]: unknown })' },
      { from: /feature: any/g, to: 'feature: { icon?: string; title?: string; description?: string }' }
    ]
  },
  {
    file: 'components/blocks/HeroBlock.tsx',
    rules: [
      { from: /function HeroBlock\(props: any\)/g, to: 'function HeroBlock(props: { headline?: string; subtitle?: string; ctaLabel?: string; ctaUrl?: string; hasDashboard?: boolean; [key: string]: unknown })' }
    ]
  },
  {
    file: 'components/blocks/EcosystemBlock.tsx',
    rules: [
      { from: /data\?: any/g, to: 'data?: { layers?: { title?: string; description?: string; capabilities?: { label?: string; value?: string }[] }[] }' }
    ]
  }
];

replacements.forEach(({ file, rules }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    rules.forEach(rule => {
      content = content.replace(rule.from, rule.to);
    });
    fs.writeFileSync(file, content);
  }
});
