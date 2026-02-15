#!/usr/bin/env node

/**
 * IntegrateWise OS - Cleanup Script
 * 
 * This script identifies and optionally removes orphan directories
 * that are no longer needed after the unified apps/os codebase consolidation.
 * 
 * Usage:
 *   node scripts/cleanup-orphans.mjs           # Dry run - list only
 *   node scripts/cleanup-orphans.mjs --delete  # Actually delete
 */

import { readdirSync, statSync, rmSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')

// Directories that are now orphaned after consolidation
const ORPHAN_DIRECTORIES = [
  // Old OS UI variants (now consolidated into apps/os)
  'apps/integratewise-os',
  'apps/integratewise-os-internal',
  'apps/integratewise-os-new',
  
  // Archive directories (review before deleting)
  // '_archive',  // Uncomment if you want to include
  
  // Internal projects (UI-only, features merged into apps/os)
  // Note: These are outside the main monorepo
  // '../Internal/integrate-wise-ai-workspace (2)',
  // '../Internal/integrate-wise-operating-syst-2',
]

// Files that might be orphaned
const ORPHAN_FILES = [
  // Add any orphan files here
]

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let unitIndex = 0
  let size = bytes
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

function getDirSize(dirPath) {
  let size = 0
  try {
    const files = readdirSync(dirPath)
    for (const file of files) {
      const filePath = join(dirPath, file)
      const stat = statSync(filePath)
      if (stat.isDirectory()) {
        size += getDirSize(filePath)
      } else {
        size += stat.size
      }
    }
  } catch (e) {
    // Ignore errors (permission issues, etc.)
  }
  return size
}

function main() {
  const shouldDelete = process.argv.includes('--delete')
  
  console.log('=' .repeat(60))
  console.log('IntegrateWise OS - Orphan Directory Cleanup')
  console.log('=' .repeat(60))
  console.log('')
  console.log(`Mode: ${shouldDelete ? '🔴 DELETE' : '🔵 DRY RUN (list only)'}`)
  console.log('')
  
  let totalSize = 0
  let foundCount = 0
  
  console.log('Checking for orphan directories...\n')
  
  for (const relativePath of ORPHAN_DIRECTORIES) {
    const fullPath = join(ROOT, relativePath)
    
    if (existsSync(fullPath)) {
      foundCount++
      const size = getDirSize(fullPath)
      totalSize += size
      
      console.log(`📁 Found: ${relativePath}`)
      console.log(`   Size: ${formatSize(size)}`)
      
      if (shouldDelete) {
        try {
          rmSync(fullPath, { recursive: true, force: true })
          console.log(`   ✅ Deleted`)
        } catch (e) {
          console.log(`   ❌ Failed to delete: ${e.message}`)
        }
      }
      console.log('')
    } else {
      console.log(`⬜ Not found (already removed): ${relativePath}`)
    }
  }
  
  console.log('-'.repeat(60))
  console.log('')
  console.log(`Summary:`)
  console.log(`  - Orphan directories found: ${foundCount}`)
  console.log(`  - Total size: ${formatSize(totalSize)}`)
  
  if (!shouldDelete && foundCount > 0) {
    console.log('')
    console.log('To delete these directories, run:')
    console.log('  node scripts/cleanup-orphans.mjs --delete')
  }
  
  console.log('')
  console.log('=' .repeat(60))
  console.log('')
  console.log('Note: The Internal folder projects are outside this monorepo.')
  console.log('Review and delete manually if needed:')
  console.log('  - ../Internal/integrate-wise-ai-workspace (2)')
  console.log('  - ../Internal/integrate-wise-operating-syst-2')
  console.log('')
}

main()
