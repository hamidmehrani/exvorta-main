const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('payload/**/*.ts');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // simplistic check: if a file has "name: 'sectionTitle'" more than once
  let matches = content.match(/name:\s*['"]sectionTitle['"]/g);
  if (matches && matches.length > 1) {
    console.log(`Potential duplicate in ${file}`);
  }
}
