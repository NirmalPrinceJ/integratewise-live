#!/usr/bin/env node

/**
 * Neon Database Migration Verification Script
 * Checks if all migration tables exist in Neon database
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function verifyNeonMigrations(): Promise<void> {
  console.log('🔍 Neon Database Migration Verification\n');
  console.log('=' .repeat(50));

  // Load environment variables
  const envPath = join(__dirname, '..', '.secrets');
  let neonConnectionString = '';

  try {
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && key.trim() === 'NEON_CONNECTION_STRING') {
        neonConnectionString = value.replace(/"/g, '').trim();
      }
    });
  } catch (error) {
    console.error('❌ Could not load .secrets file. Please ensure it exists.');
    process.exit(1);
  }

  if (!neonConnectionString) {
    console.error('❌ NEON_CONNECTION_STRING not found in .secrets file');
    process.exit(1);
  }

  // Connect to Neon
  console.log('🔌 Connecting to Neon...');
  const sql = neon(neonConnectionString);

  try {
    // Get all tables in the database
    const dbTablesResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'sql_%'
      ORDER BY table_name
    `;

    const dbTables = dbTablesResult.map((row: any) => row.table_name);
    console.log(`✅ Connected to Neon - ${dbTables.length} tables found`);

    // Get migration files
    const migrationDir = join(__dirname, '..', 'sql-migrations');
    const migrationFiles = readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql') && !file.includes('flow-a'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files`);

    // Extract table names from migration files
    const migrationTables = new Set<string>();

    for (const file of migrationFiles) {
      try {
        const content = readFileSync(join(migrationDir, file), 'utf8');
        const tableMatches = content.match(/CREATE TABLE(?: IF NOT EXISTS)? (\w+)/g);
        if (tableMatches) {
          tableMatches.forEach(match => {
            const tableName = match.replace(/CREATE TABLE(?: IF NOT EXISTS)? /, '');
            migrationTables.add(tableName);
          });
        }
      } catch (error) {
        console.error(`Error reading migration ${file}:`, error.message);
      }
    }

    console.log(`📋 Migration files define ${migrationTables.size} tables`);

    // Compare
    const missingTables = Array.from(migrationTables).filter(table => !dbTables.includes(table));
    const extraTables = dbTables.filter(table => !migrationTables.has(table));

    console.log('\n📊 MIGRATION VERIFICATION RESULTS');
    console.log('=' .repeat(40));

    console.log(`Database tables: ${dbTables.length}`);
    console.log(`Migration tables: ${migrationTables.size}`);
    console.log(`Missing tables: ${missingTables.length}`);
    console.log(`Extra tables: ${extraTables.length}`);

    if (missingTables.length > 0) {
      console.log('\n❌ MISSING TABLES (defined in migrations but not in database):');
      missingTables.forEach(table => console.log(`  - ${table}`));
    }

    if (extraTables.length > 0) {
      console.log('\n⚠️  EXTRA TABLES (in database but not in migrations):');
      extraTables.forEach(table => console.log(`  - ${table}`));
    }

    if (missingTables.length === 0) {
      console.log('\n✅ All migration tables exist in the database!');
    }

    // Show all tables for reference
    console.log('\n📋 ALL DATABASE TABLES:');
    dbTables.forEach(table => console.log(`  - ${table}`));

    console.log('\n📋 ALL MIGRATION TABLES:');
    Array.from(migrationTables).sort().forEach(table => console.log(`  - ${table}`));

  } catch (error) {
    console.error('❌ Database connection or query failed:', error);
    process.exit(1);
  }
}

// Run the verification
verifyNeonMigrations().catch(console.error);