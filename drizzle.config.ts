import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './payload-generated-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI_UNPOOLED || process.env.DATABASE_URI || '',
  },
});
