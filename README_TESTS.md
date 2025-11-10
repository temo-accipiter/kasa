# 📋 Guide des Tests - Kasa

Documentation complète pour l'exécution et la maintenance des tests dans le projet Kasa.

## 🎯 Vue d'ensemble

Le projet Kasa utilise une architecture de tests moderne et complète :

- **Tests unitaires** : Vitest + React Testing Library + Jest DOM
- **Tests d'intégration** : Vitest + MSW + fetch polyfill
- **Tests E2E** : Playwright
- **Couverture de code** : V8 + rapports HTML
- **CI/CD** : GitHub Actions

## 🚀 Installation

Toutes les dépendances sont déjà installées. Si vous devez les réinstaller :

```bash
yarn install
```

## 📦 Scripts disponibles

### Tests unitaires et d'intégration (Vitest)

```bash
# Exécuter tous les tests
yarn test

# Exécuter les tests en mode watch
yarn test:watch

# Exécuter les tests avec interface UI
yarn test:ui

# Générer le rapport de couverture
yarn test:coverage

# Tests en mode CI (sans watch)
yarn test:ci
```

### Tests E2E (Playwright)

```bash
# Exécuter tous les tests E2E
yarn e2e

# Exécuter les tests E2E en mode headé (visible)
yarn e2e:headed

# Ouvrir l'interface UI Playwright
yarn e2e:ui

# Voir le rapport des tests E2E
yarn e2e:report

# Générer des tests E2E automatiquement
yarn e2e:codegen
```

### Autres commandes

```bash
# Vérification TypeScript
yarn typecheck

# Linter
yarn lint
yarn lint:fix
```

## 📁 Structure des tests

```
kasa/
├── test/                           # Configuration globale des tests
│   ├── setupTests.ts              # Setup Vitest + MSW + mocks globaux
│   └── mocks/
│       ├── handlers.ts            # Handlers MSW pour mocks API
│       └── server.ts              # Configuration serveur MSW
├── tests/
│   └── e2e/                       # Tests End-to-End Playwright
│       └── home.spec.ts           # Exemple: tests E2E page d'accueil
├── src/
│   ├── contexts/
│   │   ├── LoadingContext.tsx    # Exemple: contexte de chargement
│   │   └── __tests__/
│   │       └── LoadingContext.test.tsx  # Tests unitaires du contexte
│   ├── pages/
│   │   └── home/
│   │       ├── Home.tsx
│   │       └── __tests__/
│   │           └── Home.integration.test.tsx  # Tests d'intégration
│   └── components/
│       └── [component]/
│           └── [Component].test.tsx  # Tests existants
├── vitest.config.ts               # Configuration Vitest
├── playwright.config.ts           # Configuration Playwright
└── .github/
    └── workflows/
        └── tests.yml              # CI GitHub Actions
```

## 🧪 Types de tests

### 1. Tests unitaires

Tests isolés de composants, hooks, fonctions utilitaires.

**Exemple** : `src/contexts/__tests__/LoadingContext.test.tsx`

```typescript
import { renderHook, act } from '@testing-library/react';
import { LoadingProvider, useLoading } from '../LoadingContext';

describe('LoadingContext', () => {
  it('devrait gérer le state de chargement', () => {
    const { result } = renderHook(() => useLoading(), {
      wrapper: LoadingProvider,
    });

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.isLoading).toBe(true);
  });
});
```

### 2. Tests d'intégration

Tests de plusieurs composants ensemble avec leurs interactions.

**Exemple** : `src/pages/home/__tests__/Home.integration.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home'

describe('Home Page - Tests d\'intégration', () => {
  it('devrait afficher tous les logements', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const cards = screen.getAllByRole('link')
    expect(cards.length).toBeGreaterThan(0)
  })
})
```

### 3. Tests E2E (End-to-End)

Tests dans un vrai navigateur simulant les actions utilisateur.

**Exemple** : `tests/e2e/home.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test("devrait charger la page d'accueil", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main.home')).toBeVisible();
});
```

## 🛠️ Configuration

### Vitest (`vitest.config.ts`)

- Environnement jsdom
- Setup automatique avec MSW
- Couverture V8
- Seuils de couverture : 70%
- Support TypeScript complet

### Playwright (`playwright.config.ts`)

- Navigateurs : Chromium, Firefox, WebKit
- Tests mobile et tablette
- Screenshots et vidéos en cas d'échec
- Serveur de développement automatique

### MSW (Mock Service Worker)

Mock les appels API pendant les tests.

**Configuration** : `test/mocks/handlers.ts`

```typescript
export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ id: '1', name: 'Test User' });
  }),
];
```

**Utilisation dans un test** :

```typescript
import { server } from 'test/mocks/server';
import { http, HttpResponse } from 'msw';

test('test avec mock custom', () => {
  server.use(
    http.get('/api/custom', () => {
      return HttpResponse.json({ data: 'custom' });
    })
  );
  // ... votre test
});
```

## 📊 Couverture de code

Générer le rapport de couverture :

```bash
yarn test:coverage
```

Le rapport est généré dans `coverage/` :

- `coverage/index.html` : Rapport HTML interactif
- `coverage/lcov.info` : Format LCOV pour Codecov
- `coverage/coverage-summary.json` : Résumé JSON

### Seuils de couverture

| Métrique   | Seuil minimum |
| ---------- | ------------- |
| Branches   | 70%           |
| Functions  | 70%           |
| Lines      | 70%           |
| Statements | 70%           |

## 🔧 Bonnes pratiques

### 1. Nommage des fichiers de test

- Tests unitaires : `[Component].test.tsx`
- Tests d'intégration : `[Feature].integration.test.tsx`
- Tests E2E : `[page].spec.ts`

### 2. Organisation

- Placez les tests unitaires à côté du fichier source
- Créez un dossier `__tests__/` pour plusieurs tests
- Tests E2E dans `tests/e2e/`

### 3. Écriture des tests

```typescript
// ✅ BON : Tests descriptifs et isolés
describe('LoadingContext', () => {
  it('devrait démarrer le chargement', () => {
    // Test isolé avec setup clair
  });
});

// ❌ MAUVAIS : Tests vagues ou dépendants
test('it works', () => {
  // Test peu descriptif
});
```

### 4. Mocks

- Utilisez MSW pour mocker les API
- Mockez les modules externes dans `setupTests.ts`
- Évitez les mocks trop complexes

### 5. Accessibilité

Utilisez les queries accessibles de Testing Library :

```typescript
// ✅ BON
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');

// ❌ À ÉVITER
screen.getByTestId('submit-button');
container.querySelector('.button');
```

## 🚦 CI/CD

Les tests sont exécutés automatiquement sur GitHub Actions :

1. **Lint & Typecheck** : Vérifie le code
2. **Tests unitaires** : Exécute les tests Vitest avec couverture
3. **Tests E2E** : Exécute Playwright sur 3 navigateurs
4. **Vérification couverture** : Vérifie les seuils

Voir `.github/workflows/tests.yml` pour la configuration complète.

## 🐛 Debugging

### Tests unitaires

```bash
# Mode UI interactif
yarn test:ui

# Mode watch avec filtre
yarn test --watch --grep "LoadingContext"
```

### Tests E2E

```bash
# Mode headé (voir le navigateur)
yarn e2e:headed

# Mode debug
yarn e2e:ui

# Voir les traces
yarn e2e:report
```

### Logs

Décommentez dans `test/setupTests.ts` pour désactiver les logs :

```typescript
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
```

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

## 🤝 Contribution

Avant de soumettre une PR :

1. Exécutez tous les tests : `yarn test --run`
2. Vérifiez la couverture : `yarn test:coverage`
3. Exécutez les tests E2E : `yarn e2e`
4. Vérifiez le lint : `yarn lint`
5. Vérifiez TypeScript : `yarn typecheck`

## 🆘 Support

En cas de problème :

1. Vérifiez que les dépendances sont à jour : `yarn install`
2. Nettoyez le cache : `rm -rf node_modules/.vite`
3. Consultez les logs d'erreur complets
4. Cherchez dans les issues GitHub du projet

---

**Dernière mise à jour** : 2025-11-10
**Version** : 1.0.0
