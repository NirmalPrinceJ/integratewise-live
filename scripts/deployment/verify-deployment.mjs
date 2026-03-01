#!/usr/bin/env node

/**
 * Verify Adaptive Spine Deployment
 * Checks that all components are working correctly
 */

import { neon } from '@neondatabase/serverless';
import fetch from 'node-fetch';

const LOADER_URL = process.env.NEXT_PUBLIC_LOADER_URL || 'http://localhost:8787';
const CONNECTOR_URL = process.env.NEXT_PUBLIC_CONNECTOR_URL || 'http://localhost:8788';
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_CONNECTION_STRING;

async function verifyDeployment() {
  console.log('🔍 Adaptive Spine Deployment Verification\n');
  console.log('=' .repeat(60));

  let allHealthy = true;

  // 1. Check Loader Worker
  console.log('\n1️⃣  Loader Worker');
  console.log('-' .repeat(60));
  try {
    const response = await fetch(`${LOADER_URL}/loader/health`, {
      timeout: 5000,
    });
    if (response.ok) {
      console.log(`✅ Loader is running at ${LOADER_URL}`);
    } else {
      console.log(`⚠️  Loader returned status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Loader not responding: ${error.message}`);
    allHealthy = false;
  }

  // 2. Check Connector Manager
  console.log('\n2️⃣  Connector Manager');
  console.log('-' .repeat(60));
  try {
    const response = await fetch(`${CONNECTOR_URL}/connector/health`, {
      timeout: 5000,
    });
    if (response.ok) {
      console.log(`✅ Connector Manager is running at ${CONNECTOR_URL}`);
    } else {
      console.log(`⚠️  Connector Manager returned status ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Connector Manager not responding: ${error.message}`);
    allHealthy = false;
  }

  // 3. Check Database
  console.log('\n3️⃣  Neon Database');
  console.log('-' .repeat(60));
  if (!DATABASE_URL) {
    console.log('❌ DATABASE_URL not configured');
    allHealthy = false;
  } else {
    try {
      const sql = neon(DATABASE_URL);
      const result = await sql`SELECT 1 as test`;
      console.log('✅ Database connection successful');

      // Check for new tables
      const tables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name LIKE 'spine_%'
        ORDER BY table_name
      `;

      if (tables.length > 0) {
        console.log(`✅ Found ${tables.length} spine tables`);
        console.log('   Tables:');
        tables.forEach(t => console.log(`     - ${t.table_name}`));
      } else {
        console.log('⚠️  No spine tables found (migrations may not have run)');
      }

      // Check for schema registry
      const registryCheck = await sql`
        SELECT COUNT(*) as count
        FROM information_schema.tables
        WHERE table_name = 'spine_schema_registry'
      `;

      if (registryCheck[0].count > 0) {
        console.log('✅ Adaptive registry table exists');

        // Check for observations
        const observations = await sql`
          SELECT COUNT(*) as count
          FROM spine_schema_registry LIMIT 1
        `;
        if (observations[0].count > 0) {
          console.log(`✅ ${observations[0].count} field observations recorded`);
        } else {
          console.log('ℹ️  No field observations yet (expected before first upload)');
        }
      }
    } catch (error) {
      console.log(`❌ Database connection failed: ${error.message}`);
      allHealthy = false;
    }
  }

  // 4. Check Environment Configuration
  console.log('\n4️⃣  Environment Configuration');
  console.log('-' .repeat(60));

  const envChecks = [
    { name: 'NEXT_PUBLIC_LOADER_URL', value: process.env.NEXT_PUBLIC_LOADER_URL },
    { name: 'NEXT_PUBLIC_CONNECTOR_URL', value: process.env.NEXT_PUBLIC_CONNECTOR_URL },
    { name: 'DATABASE_URL', value: process.env.DATABASE_URL ? '***' : undefined },
    { name: 'NEON_CONNECTION_STRING', value: process.env.NEON_CONNECTION_STRING ? '***' : undefined },
  ];

  let configComplete = true;
  envChecks.forEach(check => {
    if (check.value) {
      console.log(`✅ ${check.name} = ${check.value}`);
    } else {
      console.log(`❌ ${check.name} not set`);
      configComplete = false;
    }
  });

  if (!configComplete) {
    allHealthy = false;
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  if (allHealthy) {
    console.log('✅ All checks passed! Deployment is ready.\n');
    console.log('Next step: Upload a CSV file to test end-to-end adaptive observation');
  } else {
    console.log('⚠️  Some checks failed. See details above.\n');
    console.log('Next step: Review the DEPLOYMENT_CHECKLIST.md for setup instructions');
  }
  console.log('');
}

verifyDeployment().catch(console.error);
