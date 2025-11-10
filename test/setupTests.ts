/**
 * Configuration globale pour les tests Vitest
 * Exécuté avant chaque fichier de test
 */

// Import des matchers personnalisés jest-dom pour des assertions DOM améliorées
import '@testing-library/jest-dom';

// Polyfill fetch pour les tests (MSW en dépend)
import 'whatwg-fetch';

// Import du serveur MSW pour les mocks d'API
import { server } from './mocks/server';

// Import de la configuration i18n pour les tests
import '../src/i18n/config';

/**
 * Configuration MSW (Mock Service Worker)
 * Intercepte les requêtes HTTP pendant les tests
 */

// Démarre le serveur MSW avant tous les tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn', // Avertit si une requête n'est pas mockée
  });
});

// Réinitialise les handlers après chaque test
afterEach(() => {
  server.resetHandlers();
});

// Ferme le serveur MSW après tous les tests
afterAll(() => {
  server.close();
});

/**
 * Mocks globaux
 */

// Mock pour window.matchMedia (utilisé par certains composants responsive)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock pour IntersectionObserver (utilisé par LazyImage)
class IntersectionObserverMock {
  observe = vi.fn();

  disconnect = vi.fn();

  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock pour scrollTo (utilisé dans certains composants)
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

/**
 * Mock i18next pour les tests
 * Retourne les clés de traduction au lieu des traductions réelles
 */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      // Remplace les paramètres dans la clé
      if (params) {
        let result = key;
        Object.keys(params).forEach((param) => {
          result = result.replace(`{{${param}}}`, String(params[param]));
        });
        return result;
      }
      return key;
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: 'fr',
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

/**
 * Mock pour les imports d'images et assets
 */
vi.mock('*.png', () => ({
  default: 'test-image.png',
}));

vi.mock('*.jpg', () => ({
  default: 'test-image.jpg',
}));

vi.mock('*.svg', () => ({
  default: 'test-image.svg',
}));

/**
 * Mock pour les imports CSS/SCSS
 */
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));

/**
 * Suppression des logs console pendant les tests (optionnel)
 * Décommenter si vous voulez des tests plus silencieux
 */
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
// }
