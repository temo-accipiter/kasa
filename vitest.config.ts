import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Configuration Vitest pour tests unitaires et d'intégration
 * Compatible avec React 18 + Vite + Yarn PnP
 */
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    // Environnement jsdom pour simuler le DOM du navigateur
    environment: 'jsdom',

    // Fichiers de setup exécutés avant chaque test
    setupFiles: ['./test/setupTests.ts'],

    // Pattern de fichiers de test
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}'],

    // Fichiers à exclure
    exclude: ['node_modules', 'build', '.yarn', 'tests/e2e/**', '**/*.stories.tsx'],

    // Variables globales (comme Jest)
    globals: true,

    // Couverture de code avec V8
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'test/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
        '**/__mocks__/**',
        'src/index.tsx',
        'src/setupTests.ts',
        '**/*.stories.tsx',
        'src/types/**',
      ],
      // Seuils de couverture
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },

    // Parallélisation des tests (activé par défaut avec threads)
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    // Timeout par défaut pour les tests
    testTimeout: 10000,

    // Watch mode ignore patterns
    watchExclude: ['**/node_modules/**', '**/build/**', '**/.yarn/**'],

    // Interface de test (compatible Jest)
    api: {
      port: 51204,
    },

    // Reporter pour l'affichage des résultats
    reporters: ['default', 'html'],

    // Clearing mocks automatiquement
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
