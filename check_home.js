const { getPayload } = require('payload');
const config = require('./payload.config').default;

async function run() {
  const payload = await getPayload({ config });
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } }
  });
  console.log("Pages found:", pages.docs.length);
  if (pages.docs.length > 0) {
    console.log(pages.docs[0].slug, pages.docs[0].title);
  }
  process.exit(0);
}
run().catch(console.error);
