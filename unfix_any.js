const fs = require('fs');

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
  
  content = content.replace(/props: Record<string, unknown>/g, 'props: any');
  content = content.replace(/\[key: string\]: unknown/g, '[key: string]: any');
  content = content.replace(/\(doc: Record<string, unknown>\)/g, '(doc: any)');
  content = content.replace(/\(r: Record<string, unknown>\)/g, '(r: any)');
  content = content.replace(/as { layout\?: unknown\[\] }/g, 'as { layout?: any[] }');
  content = content.replace(/as { layout: unknown\[\] }/g, 'as { layout: any[] }');
  content = content.replace(/feature: Record<string, unknown>/g, 'feature: any');
  content = content.replace(/const containerVariants: import\("framer-motion"\).Variants/g, 'const containerVariants: any');
  content = content.replace(/const itemVariants: import\("framer-motion"\).Variants/g, 'const itemVariants: any');
  content = content.replace(/const container: import\("framer-motion"\).Variants/g, 'const container: any');
  content = content.replace(/const item: import\("framer-motion"\).Variants/g, 'const item: any');
  content = content.replace(/media\?: unknown/g, 'media?: any');
  content = content.replace(/p: Record<string, unknown>/g, 'p: any');
  content = content.replace(/projectSpecifics: Record<string, unknown>/g, 'projectSpecifics: Record<string, any>');
  content = content.replace(/const specifics: Record<string, unknown>/g, 'const specifics: any');
  content = content.replace(/stat: Record<string, unknown>/g, 'stat: any');
  content = content.replace(/data\?: Record<string, unknown>/g, 'data?: any');
  content = content.replace(/content\?: unknown/g, 'content?: any');
  content = content.replace(/let siteSettings: Record<string, unknown> \| null = null/g, 'let siteSettings: any = null');
  content = content.replace(/let socialLinks: Record<string, unknown> \| null = null/g, 'let socialLinks: any = null');
  content = content.replace(/cookieConfig: Record<string, unknown>/g, 'cookieConfig: any');

  fs.writeFileSync(file, content);
});
console.log('Reverted any types');
