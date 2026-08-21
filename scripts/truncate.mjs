import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI,
});

async function run() {
  await client.connect();
  console.log('Truncating pages cascade...');
  await client.query('TRUNCATE pages CASCADE;');
  console.log('Truncated.');
  await client.end();
}
run();
