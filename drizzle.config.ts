import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config({ path: '.env' });

export default {
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;
