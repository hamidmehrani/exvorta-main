const fs = require('fs');
let html = fs.readFileSync('/tmp/hero.html', 'utf8');
// Basic JSX conversion
html = html.replace(/class=/g, 'className=');
html = html.replace(/<!--(.*?)-->/g, '{/* $1 */}');
html = html.replace(/<br>/g, '<br/>');
html = html.replace(/style="([^"]*)"/g, (match, p1) => {
    // A quick hack for inline styles, mostly for height: 700px;
    if (p1.includes('height: 700px;')) return "style={{ height: '700px' }}";
    return match;
});
fs.writeFileSync('/tmp/hero.jsx', html);
