import 'dotenv/config';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('⏳ Applying migration...');

  try {
    const migrationSQL = readFileSync(
      join(__dirname, '../drizzle/0001_chunky_captain_marvel.sql'),
      'utf-8'
    );

    await pool.query(migrationSQL);

    console.log('✅ Migration applied successfully!');
  } catch (error: any) {
    console.error('❌ Migration failed!');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();



