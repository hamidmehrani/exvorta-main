const fs = require('fs');
const files = fs.readdirSync('payload/blocks').filter(f => f.endsWith('.ts'));

files.forEach(f => {
  const content = fs.readFileSync('payload/blocks/' + f, 'utf8');
  const matches = content.match(/name:\s*['"]sectionTitle['"]/g);
  if (matches && matches.length > 1) {
    console.log(`Duplicate sectionTitle in ${f}`);
  }
});
