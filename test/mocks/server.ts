/**
 * MSW Server Setup
 * Configure le serveur Mock Service Worker pour les tests
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Serveur MSW pour Node.js (tests)
 * Intercepte toutes les requêtes HTTP pendant les tests
 * et retourne les réponses mockées définies dans handlers.ts
 */
export const server = setupServer(...handlers);

/**
 * Fonction utilitaire pour réinitialiser les handlers pendant les tests
 * Utilisé dans setupTests.ts avec afterEach()
 */
export const resetHandlers = () => {
  server.resetHandlers();
};

/**
 * Fonction utilitaire pour ajouter des handlers temporaires pendant un test
 *
 * Exemple d'utilisation dans un test :
 *
 * import { server } from 'test/mocks/server'
 * import { http, HttpResponse } from 'msw'
 *
 * test('handles custom response', () => {
 *   server.use(
 *     http.get('/api/custom', () => {
 *       return HttpResponse.json({ custom: 'data' })
 *     })
 *   )
 *   // ... votre test
 * })
 */
