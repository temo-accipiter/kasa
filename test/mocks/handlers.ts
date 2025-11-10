/**
 * MSW Request Handlers
 * Définit les mocks pour les appels API pendant les tests
 */

import { http, HttpResponse } from 'msw';

/**
 * Types pour les réponses mockées
 */
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string | null;
}

/**
 * Données mockées pour les tests
 */
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
};

const mockSubscription: Subscription = {
  id: 'sub_123',
  userId: '1',
  plan: 'premium',
  status: 'active',
  startDate: '2024-01-01',
  endDate: null,
};

/**
 * Handlers pour les endpoints API
 * Ajoutez vos propres endpoints selon vos besoins
 */
export const handlers = [
  // GET /api/user - Récupère l'utilisateur connecté
  http.get('/api/user', () => HttpResponse.json(mockUser)),

  // POST /api/auth/login - Connexion utilisateur
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Simule une connexion réussie
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json(
        {
          user: mockUser,
          token: 'mock-jwt-token',
        },
        { status: 200 }
      );
    }

    // Simule un échec de connexion
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // GET /api/subscription - Récupère l'abonnement de l'utilisateur
  http.get('/api/subscription', () => HttpResponse.json(mockSubscription)),

  // POST /api/subscription - Crée ou met à jour un abonnement
  http.post('/api/subscription', async ({ request }) => {
    const body = (await request.json()) as { plan: string };

    return HttpResponse.json(
      {
        ...mockSubscription,
        plan: body.plan,
      },
      { status: 201 }
    );
  }),

  // DELETE /api/subscription/:id - Annule un abonnement
  http.delete('/api/subscription/:id', ({ params }) => {
    const { id } = params;

    if (id === mockSubscription.id) {
      return HttpResponse.json(
        {
          ...mockSubscription,
          status: 'cancelled',
        },
        { status: 200 }
      );
    }

    return HttpResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }),

  // Exemple d'erreur serveur
  http.get('/api/error', () =>
    HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
  ),

  // Exemple de timeout (délai de réponse)
  http.get('/api/slow', async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    return HttpResponse.json({ message: 'Slow response' });
  }),
];

/**
 * Fonction utilitaire pour créer des handlers personnalisés dans les tests
 */
export const createMockHandler = <T>(
  url: string,
  data: T,
  method: 'get' | 'post' | 'put' | 'delete' = 'get'
) => http[method](url, () => HttpResponse.json(data));
