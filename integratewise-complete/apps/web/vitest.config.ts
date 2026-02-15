import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'src/__tests__/**/*.test.ts',
      'src/__tests__/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/*.test.tsx'
    ],
    exclude: [
      'node_modules',
      '.next',
      // Integration tests require a running server - run separately
      '**/integration/**',
      '**/*.integration.test.ts',
      '**/phase2-integration.test.ts',
      '**/phase3-integration.test.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.test.tsx'
      ]
    },
    testTimeout: 30000, // 30s for integration tests
    hookTimeout: 10000,
    // For integration tests, run sequentially
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
