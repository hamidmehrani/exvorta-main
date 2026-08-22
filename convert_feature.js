const fs = require('fs');
let html = fs.readFileSync('manifesto_extracted.txt', 'utf8');

// fix React props
html = html.replace(/class=/g, 'className=')
           .replace(/data-stitch-orig-opacity="0"/g, '')
           .replace(/<!--.*?-->/g, '');

const componentCode = `import React from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

type FeatureGridBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'featureGrid' }>

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = (props) => {
  return (
    <AnimatedSection className="w-full">
      ${html}
    </AnimatedSection>
  )
}

export default FeatureGridBlock
`;

fs.writeFileSync('components/blocks/FeatureGridBlock.tsx', componentCode);
console.log('FeatureGridBlock.tsx created successfully.');
