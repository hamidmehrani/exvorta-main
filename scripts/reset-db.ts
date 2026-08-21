import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI;
if (!connectionString) {
  console.error('DATABASE_URI or DATABASE_URI_UNPOOLED must be set');
  process.exit(1);
}

const dbName = (() => {
  try {
    const url = new URL(connectionString);
    return url.pathname.replace('/', '');
  } catch {
    return 'neondb';
  }
})();

const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 10000,
});

async function reset() {
  const client = await pool.connect();
  try {
    console.log(`Resetting database "${dbName}"...`);

    // Terminate all other connections to prevent deadlocks
    console.log(`Terminating all other connections to ${dbName}...`);
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1
        AND pid <> pg_backend_pid()
        AND state in ('idle', 'active', 'idle in transaction', 'idle in transaction (aborted)', 'disabled');
    `, [dbName]);

    // Drop the entire public schema and recreate it atomically.
    // This wipes ALL tables, types (ENUMs), sequences, and indexes.
    // Do NOT pre-create ENUMs here — the Drizzle migration will create everything.
    await client.query(`DROP SCHEMA IF EXISTS public CASCADE;`);
    await client.query(`CREATE SCHEMA public;`);
    await client.query(`GRANT ALL ON SCHEMA public TO public;`);
    await client.query(`GRANT ALL ON SCHEMA public TO neondb_owner;`);

    // Fix default search_path at DB level so all future connections see it
    await client.query(`ALTER DATABASE "${dbName}" SET search_path TO public;`);

    // Drop stale drizzle migration schema if it exists
    await client.query(`DROP SCHEMA IF EXISTS drizzle CASCADE;`);

    console.log('Schema wiped and recreated. search_path fixed at DB level.');
    console.log('Done. Run `payload migrate` to apply the schema.');
  } finally {
    client.release();
    await pool.end();
  }

  process.exit(0);
}

reset().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
