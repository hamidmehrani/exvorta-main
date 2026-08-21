const fs = require('fs');
let code = fs.readFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/HeroBlock.tsx', 'utf8');

// Fix SVG and Path
code = code.replace(/<svg([^>]*)\/>/g, '<svg$1>');
code = code.replace(/<path([^>]*)\/>/g, '<path$1 />');

// Remove double slash closing for path which might have been generated
code = code.replace(/<path([^>]*)\/ \/>/g, '<path$1 />');

fs.writeFileSync('/home/hamid/Desktop/Exvorta/Exvorta/components/blocks/HeroBlock.tsx', code);
