const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const designsDir = path.join(__dirname, '../Exvorta designs');
const directories = fs.readdirSync(designsDir).filter(f => fs.statSync(path.join(designsDir, f)).isDirectory());

const result = {};

for (const dir of directories) {
    const htmlPath = path.join(designsDir, dir, 'code.html');
    if (!fs.existsSync(htmlPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    const pageData = {
        hasDashboard: false,
        sections: []
    };

    if (html.includes('bg-dashboard') || html.includes('Terminal Log') || html.includes('SYS_ONLINE')) {
        pageData.hasDashboard = true;
    }

    $('section, header, footer').each((i, el) => {
        const id = $(el).attr('id') || $(el).attr('data-purpose') || 'section-' + i;
        const textNodes = [];
        
        // simple text extraction
        $(el).find('h1, h2, h3, h4, p, span, div, a').each((j, child) => {
            // only get direct text to avoid massive duplication
            const text = $(child).clone().children().remove().end().text().trim();
            if (text && text.length > 3) {
                textNodes.push({ tag: child.tagName.toLowerCase(), text });
            }
        });
        
        pageData.sections.push({
            id,
            texts: textNodes
        });
    });

    result[dir] = pageData;
}

fs.writeFileSync(path.join(__dirname, 'extracted_designs.json'), JSON.stringify(result, null, 2));
console.log('Extraction complete. Saved to extracted_designs.json');
