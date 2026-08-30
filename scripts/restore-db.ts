import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config({ path: '.env' });

const run = promisify(execFile);
const BACKUP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../backups');

const BENIGN_ERROR_PATTERNS = [
  /DROP SCHEMA IF EXISTS public;?/,
  /CREATE SCHEMA public;?/,
  /cannot drop (function|schema|type|table|trigger) .* because other objects depend on it/i,
  /schema "public" already exists/i,
  /already exists with same argument types/i,
  /could not execute query: ERROR: (schema|relation|type|function|trigger) .* already exists/i,
  /^pg_restore: error: (schema|relation|type|function) ".*" already exists/i,
];

function isBenign(line) {
  return BENIGN_ERROR_PATTERNS.some((pattern) => pattern.test(line));
}

async function findLatestBackup() {
  const files = (await readdir(BACKUP_DIR)).filter((f) => f.endsWith('.dump'));
  if (files.length === 0) {
    console.error(`✗ No .dump files found in ${BACKUP_DIR}. Run 'pnpm db:backup' first.`);
    process.exit(1);
  }

  const withMtime = await Promise.all(
    files.map(async (f) => ({ file: f, mtime: (await stat(path.join(BACKUP_DIR, f))).mtimeMs })),
  );

  return path.join(BACKUP_DIR, withMtime.sort((a, b) => b.mtime - a.mtime)[0].file);
}

async function restoreDatabase(filePath) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('✗ DATABASE_URL is not set. Add it to .env (see .env.example) and try again.');
    process.exit(1);
  }

  if (!path.isAbsolute(filePath)) {
    filePath = path.resolve(filePath);
  }

  const stats = await stat(filePath).catch(() => null);
  if (!stats) {
    console.error(`✗ Backup file not found: ${filePath}`);
    process.exit(1);
  }

  console.warn(`
⚠  This will OVERWRITE the current database with the contents of the backup.
   Target: ${databaseUrl.replace(/\/\/.*@/, '//***@')}
   File:   ${filePath}
`);

  console.log('Restoring with pg_restore (--clean --if-exists --no-owner --no-privileges)...\n');

  let stderr = '';
  let exitCode = 0;
  try {
    await run(
      'pg_restore',
      ['--clean', '--if-exists', '--no-owner', '--no-privileges', '--dbname', databaseUrl, filePath],
      { maxBuffer: 10 * 1024 * 1024 },
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('✗ pg_restore was not found on PATH.');
      console.error('  Install PostgreSQL tools (e.g. brew install postgresql@17).');
      process.exit(1);
    }
    stderr = error.stderr || error.message || '';
    exitCode = error.code ?? 1;
  }

  if (exitCode) {
    const errorLines = stderr.split('\n').filter((line) => line.startsWith('pg_restore: error'));
    const realErrors = errorLines.filter((line) => !isBenign(line));
    const benignCount = errorLines.length - realErrors.length;

    if (realErrors.length > 0) {
      console.error(`✗ Restore failed with ${realErrors.length} error(s):`);
      realErrors.forEach((line) => console.error(`  ${line}`));
      if (benignCount > 0) {
        console.error(`  ...and ${benignCount} benign warning(s) suppressed.`);
      }
      process.exit(1);
    }

    console.log(`✓ Restore completed (${benignCount} benign warnings ignored, e.g. re-creating existing schema objects).`);
    return;
  }

  console.log('✓ Restore completed.');
}

const fileArg = process.argv[2];
restoreDatabase(fileArg ? path.resolve(fileArg) : await findLatestBackup());