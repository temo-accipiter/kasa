import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour tests E2E
 * Documentation: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Répertoire des tests E2E
  testDir: './tests/e2e',

  // Timeout par défaut pour chaque test
  timeout: 30000,

  // Nombre de tentatives en cas d'échec
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers (parallélisation)
  workers: process.env.CI ? 1 : undefined,

  // Reporter pour les résultats des tests
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  // Options globales pour tous les tests
  use: {
    // URL de base pour navigation
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Timeout pour les actions (clic, remplissage, etc.)
    actionTimeout: 10000,

    // Trace en cas d'échec
    trace: 'on-first-retry',

    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',

    // Vidéo en cas d'échec
    video: 'retain-on-failure',

    // Locale
    locale: 'fr-FR',

    // Timezone
    timezoneId: 'Europe/Paris',
  },

  // Configuration des projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Tests mobiles
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
      },
    },

    // Tests tablette
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],

  // Serveur de développement pour les tests
  // Lance automatiquement l'application avant les tests
  webServer: {
    command: process.env.CI ? 'yarn preview' : 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Dossiers de sortie
  outputDir: 'test-results/',

  // Options globales
  forbidOnly: !!process.env.CI, // Interdit les .only en CI
  fullyParallel: true, // Parallélisation complète
});
