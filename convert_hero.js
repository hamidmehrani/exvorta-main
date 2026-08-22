const fs = require('fs');
let html = fs.readFileSync('hero_extracted.txt', 'utf8');

// fix React props
html = html.replace(/class=/g, 'className=')
           .replace(/viewbox=/g, 'viewBox=')
           .replace(/stroke-linecap=/g, 'strokeLinecap=')
           .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
           .replace(/stroke-width=/g, 'strokeWidth=')
           .replace(/stroke-dasharray=/g, 'strokeDasharray=')
           .replace(/style="([^"]*)"/g, (match, p1) => {
               // naive style to object conversion for basic styles like height and bgImage
               if(p1.includes('height: 700px;')) return 'style={{ height: "700px" }}';
               if(p1.includes('background-image')) {
                 return `style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}`
               }
               return match;
           });

const componentCode = `import React from 'react'
import { Page } from '@/payload-types'
import { AnimatedSection } from '@/components/ui/Reveal'

type HeroBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export const HeroBlock: React.FC<HeroBlockProps> = (props) => {
  return (
    <AnimatedSection className="w-full">
      ${html}
    </AnimatedSection>
  )
}

export default HeroBlock
`;

fs.writeFileSync('components/blocks/HeroBlock.tsx', componentCode);
console.log('HeroBlock.tsx created successfully.');
