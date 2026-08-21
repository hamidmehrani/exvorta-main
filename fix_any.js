const fs = require('fs');
const glob = require('glob');

const files = [
  'app/sitemap.ts',
  'app/(frontend)/[...slug]/page.tsx',
  'components/blocks/FeatureGridBlock.tsx',
  'components/blocks/ProcessBlock.tsx',
  'components/blocks/FeatureShowcaseBlock.tsx',
  'components/blocks/HeroBlock.tsx',
  'components/blocks/VisionBlock.tsx',
  'components/blocks/ProductShowcaseBlock.tsx',
  'components/blocks/CTABlock.tsx',
  'components/blocks/ProjectSingleLayout.tsx',
  'components/blocks/EcosystemBlock.tsx',
  'components/blocks/RichTextBlock.tsx',
  'components/blocks/PortfolioArchiveLayout.tsx',
  'components/blocks/FounderBlock.tsx',
  'components/blocks/TestimonialBlock.tsx',
  'components/blocks/RoadmapBlock.tsx',
  'components/seo/OrganizationSchema.tsx',
  'components/layout/DeferredWidgets.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace `props: any` with `props: Record<string, unknown>`
  content = content.replace(/props: any/g, 'props: Record<string, unknown>');
  
  // Replace `[key: string]: any` with `[key: string]: unknown`
  content = content.replace(/\[key: string\]: any/g, '[key: string]: unknown');
  
  // specific replacements
  content = content.replace(/\(doc: any\)/g, '(doc: Record<string, unknown>)');
  content = content.replace(/\(r: any\)/g, '(r: Record<string, unknown>)');
  content = content.replace(/as { layout\?: any\[\] }/g, 'as { layout?: unknown[] }');
  content = content.replace(/as { layout: any\[\] }/g, 'as { layout: unknown[] }');
  content = content.replace(/feature: any/g, 'feature: Record<string, unknown>');
  content = content.replace(/const containerVariants: any/g, 'const containerVariants: import("framer-motion").Variants');
  content = content.replace(/const itemVariants: any/g, 'const itemVariants: import("framer-motion").Variants');
  content = content.replace(/const container: any/g, 'const container: import("framer-motion").Variants');
  content = content.replace(/const item: any/g, 'const item: import("framer-motion").Variants');
  content = content.replace(/media\?: any/g, 'media?: unknown');
  content = content.replace(/p: any/g, 'p: Record<string, unknown>');
  content = content.replace(/projectSpecifics: Record<string, any>/g, 'projectSpecifics: Record<string, unknown>');
  content = content.replace(/const specifics: any/g, 'const specifics: Record<string, unknown>');
  content = content.replace(/stat: any/g, 'stat: Record<string, unknown>');
  content = content.replace(/data\?: any/g, 'data?: Record<string, unknown>');
  content = content.replace(/content\?: any/g, 'content?: unknown');
  content = content.replace(/let siteSettings: any = null/g, 'let siteSettings: Record<string, unknown> | null = null');
  content = content.replace(/let socialLinks: any = null/g, 'let socialLinks: Record<string, unknown> | null = null');
  content = content.replace(/cookieConfig: any/g, 'cookieConfig: Record<string, unknown>');

  fs.writeFileSync(file, content);
});
console.log('Fixed any types');
