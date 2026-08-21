import { Pool } from 'pg';

const dbUri = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI;
if (!dbUri) throw new Error("Missing DATABASE_URI");

const pool = new Pool({ connectionString: dbUri });

async function dropAll() {
  console.log("Executing DROP SCHEMA PUBLIC CASCADE...");
  await pool.query('DROP SCHEMA IF EXISTS public CASCADE;');
  await pool.query('CREATE SCHEMA public;');
  console.log("Done dropping schema.");
  process.exit(0);
}

dropAll().catch((e) => {
  console.error("Failed to drop:", e);
  process.exit(1);
});
