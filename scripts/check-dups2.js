const fs = require('fs');
const files = fs.readdirSync('payload/blocks').filter(f => f.endsWith('.ts'));

files.forEach(f => {
  const content = fs.readFileSync('payload/blocks/' + f, 'utf8');
  let count = 0;
  // match name: 'sectionTitle' or name: "sectionTitle"
  const regex = /name\s*:\s*['"]sectionTitle['"]/g;
  while (regex.exec(content)) count++;
  if (count > 1) {
    console.log(`Duplicate sectionTitle in ${f}, count: ${count}`);
  }
});
