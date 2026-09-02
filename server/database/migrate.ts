import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { withTransaction, pool } from '../config/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('[PostgreSQL Migrator] Starting database migrations...');
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`[PostgreSQL Migrator] Executing migration: ${file}`);
    const sql = fs.readFileSync(filePath, 'utf-8');

    await withTransaction(async (client) => {
      await client.query(sql);
    });
    console.log(`[PostgreSQL Migrator] ✓ Migration completed: ${file}`);
  }

  console.log('[PostgreSQL Migrator] All migrations applied successfully.');
}

// Allow direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log('[PostgreSQL Migrator] Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[PostgreSQL Migrator] Migration failed:', err);
      process.exit(1);
    });
}
