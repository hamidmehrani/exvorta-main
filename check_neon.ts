import { neon } from '@neondatabase/serverless';

async function run() {
  const sql = neon('postgresql://neondb_owner:npg_reOUhR8SZu0o@ep-steep-truth-av87zupp-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require');
  
  const pages = await sql`SELECT id, slug, title, _status FROM pages WHERE slug = 'home'`;
  console.log('Home pages found:', pages.length);
  if (pages.length > 0) {
    console.log(pages[0]);
  }
}

run().catch(console.error);
