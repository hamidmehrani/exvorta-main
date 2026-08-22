const fs = require('fs');

function fixFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    // Replace HTML comments with JSX comments
    content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
    // Also replace `<br>` with `<br/>`
    content = content.replace(/<br>/g, '<br/>');
    fs.writeFileSync(filename, content);
}

fixFile('components/blocks/HeroBlock.tsx');
fixFile('components/blocks/FeatureGridBlock.tsx');
fixFile('components/blocks/CTABlock.tsx');
console.log('Fixed JSX comments');
