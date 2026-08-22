const fs = require('fs');
let html = fs.readFileSync('cta_extracted.txt', 'utf8');

html = html.replace(/class=/g, 'className=')
           .replace(/<!--.*?-->/g, '');

const componentCode = `import React from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

type CTABlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cta' }>

export const CTABlock: React.FC<CTABlockProps> = (props) => {
  return (
    <AnimatedSection className="w-full">
      ${html}
    </AnimatedSection>
  )
}

export default CTABlock
`;

fs.writeFileSync('components/blocks/CTABlock.tsx', componentCode);
console.log('CTABlock.tsx created successfully.');
