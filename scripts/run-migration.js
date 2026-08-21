const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  // Find the latest .ts migration file
  const migrationsDir = path.join(process.cwd(), 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  files.sort();
  const latestFile = path.join(migrationsDir, files[files.length - 1]);
  console.log('Using migration:', latestFile);
  
  const content = fs.readFileSync(latestFile, 'utf8');
  // Extract the SQL from the up() function's sql template literal
  const sqlMatch = content.match(/await db\.execute\(sql`([\s\S]*?)`\)/);
  if (!sqlMatch) {
    console.error("No SQL found in migration file");
    process.exit(1);
  }
  const sqlContent = sqlMatch[1];
  console.log("Extracted SQL length:", sqlContent.length);
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI });
  try {
    console.log("Executing SQL...");
    await pool.query(sqlContent);
    console.log("Migration executed successfully!");
  } catch(e) {
    console.error("Migration failed:", e.message);
    process.exit(1);
  }
  await pool.end();
}
main();
