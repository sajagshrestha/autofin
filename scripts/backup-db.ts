import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config({ path: '.env' });

const run = promisify(execFile);
const BACKUP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../backups');

async function backupDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('✗ DATABASE_URL is not set. Add it to .env (see .env.example) and try again.');
    process.exit(1);
  }

  await mkdir(BACKUP_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(BACKUP_DIR, `autofin-${timestamp}.dump`);

  console.log(`Backing up database to ${filePath} ...`);

  try {
    await run('pg_dump', [
      databaseUrl,
      '--no-owner',
      '--no-privileges',
      '--schema=public',
      '--format=custom',
      '--file',
      filePath,
    ]);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('✗ pg_dump was not found on PATH.');
      console.error('  Install PostgreSQL tools (e.g. brew install postgresql@17), or use the Supabase CLI instead:');
      console.error('    supabase db dump --data-only -f backup.sql');
      process.exit(1);
    }
    console.error('✗ Backup failed:', error.stderr || error.message);
    process.exit(1);
  }

  console.log(`✓ Backup created: ${filePath}`);
  console.log('Restore with: pg_restore --dbname "$DATABASE_URL" --clean --if-exists ' + filePath);
}

backupDatabase();