const fs = require('fs');
const glob = require('glob');
const files = glob.sync('payload/blocks/*.ts');
const slugs = {};
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/slug:\s*['"]([^'"]+)['"]/);
  if (match) {
    const slug = match[1];
    if (slugs[slug]) {
      console.log(`Duplicate slug '${slug}' in ${file} and ${slugs[slug]}`);
    } else {
      slugs[slug] = file;
    }
  }
}
