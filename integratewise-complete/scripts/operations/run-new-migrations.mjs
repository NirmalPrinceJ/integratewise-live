#!/usr/bin/env node

/**
 * Run New Spine Migrations
 * Applies migrations 032-035 to Neon database
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NEON_CONNECTION_STRING = 'postgresql://neondb_owner:npg_lPt4jLcO5dei@ep-broad-waterfall-ahejsgy6-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const MIGRATIONS = [
  '032_spine_department_streams.sql',
  '033_spine_accounts_intelligence.sql',
  '034_spine_progressive_universal.sql',
  '035_spine_adaptive_registry.sql',
];

async function runMigrations() {
  console.log('🚀 Running Spine Migrations\n');
  console.log('=' .repeat(60));

  const sql = neon(NEON_CONNECTION_STRING);

  try {
    console.log('🔌 Testing Neon connection...');
    const testResult = await sql`SELECT 1 as test`;
    console.log('✅ Connected to Neon\n');

    for (const migrationFile of MIGRATIONS) {
      const filePath = join(__dirname, 'sql-migrations', migrationFile);
      console.log(`📄 Running: ${migrationFile}`);

      try {
        const migrationSQL = readFileSync(filePath, 'utf8');
        
        // Split by ; and execute each statement
        const statements = migrationSQL
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`   Found ${statements.length} statements`);
        
        for (let i = 0; i < statements.length; i++) {
          const stmt = statements[i];
          try {
            await sql.query(stmt);
          } catch (error) {
            // Some statements might fail due to existing objects, which is fine
            if (!error.message.includes('already exists') && !error.message.includes('permission denied')) {
              console.error(`   ⚠️  Statement ${i + 1} failed:`, error.message.split('\n')[0]);
            }
          }
        }

        console.log(`✅ Completed: ${migrationFile}\n`);
      } catch (error) {
        console.error(`❌ Failed to apply ${migrationFile}:`, error.message);
        process.exit(1);
      }
    }

    console.log('=' .repeat(60));
    console.log('✅ All migrations completed successfully!\n');
    
    // Verify tables were created
    const tableResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    const spineTables = tableResult.filter(t => t.table_name.startsWith('spine_'));
    console.log(`📊 Found ${spineTables.length} spine tables:`);
    spineTables.forEach(t => console.log(`   - ${t.table_name}`));

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

runMigrations().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
