# Guide de Tests - Kasa

Ce document explique comment utiliser les tests dans le projet Kasa.

## Configuration

Le projet utilise:
- **Jest**: Framework de test
- **React Testing Library**: Bibliothèque de test pour React
- **TypeScript**: Support complet pour les tests

## Scripts disponibles

### Exécuter les tests en mode interactif
```bash
npm test
```

### Exécuter les tests avec rapport de couverture
```bash
npm run test:coverage
```

### Exécuter les tests en mode CI
```bash
npm run test:ci
```

## Structure des tests

```
src/
├── __tests__/
│   └── integration/          # Tests d'intégration
│       ├── App.integration.test.tsx
│       └── Navigation.integration.test.tsx
├── components/
│   ├── header/
│   │   ├── Header.tsx
│   │   └── Header.test.tsx   # Tests unitaires
│   └── footer/
│       ├── Footer.tsx
│       └── Footer.test.tsx
└── pages/
    ├── home/
    │   ├── Home.tsx
    │   └── Home.test.tsx
    ├── about/
    │   ├── About.tsx
    │   └── About.test.tsx
    └── errorpage/
        ├── ErrorPage.tsx
        └── ErrorPage.test.tsx
```

## Types de tests

### Tests Unitaires

Les tests unitaires testent les composants individuellement en isolation. Ils sont placés à côté du composant qu'ils testent.

**Exemple:**
```typescript
// Header.test.tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'

describe('Header Component', () => {
  it('renders the header component', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
```

### Tests d'Intégration

Les tests d'intégration vérifient que plusieurs composants fonctionnent correctement ensemble. Ils sont dans le dossier `src/__tests__/integration/`.

**Exemple:**
```typescript
// Navigation.integration.test.tsx
it('navigates from Home to About page', async () => {
  const user = userEvent.setup()
  const router = setupRouter('/')

  render(<RouterProvider router={router} />)

  const aboutLink = screen.getByRole('link', { name: /a propos/i })
  await user.click(aboutLink)

  expect(screen.getByTestId('collapse-fiabilité')).toBeInTheDocument()
})
```

## Couverture de Code

La configuration de couverture est définie dans `jest.config.js`:

- **Seuils minimaux**: 70% pour les branches, fonctions, lignes et statements
- **Fichiers exclus**:
  - Fichiers de définition TypeScript (*.d.ts)
  - Point d'entrée (index.tsx)
  - Fichiers de configuration

### Générer un rapport de couverture

```bash
npm run test:coverage
```

Le rapport sera généré dans le dossier `coverage/`:
- `coverage/lcov-report/index.html`: Rapport HTML détaillé
- `coverage/lcov.info`: Rapport pour les outils d'intégration continue

## GitHub Actions

Les tests sont automatiquement exécutés lors de chaque push et pull request grâce à GitHub Actions.

**Configuration**: `.github/workflows/test.yml`

Le workflow:
1. Exécute sur Node.js 18.x et 20.x
2. Installe les dépendances
3. Exécute le linter
4. Exécute les tests avec couverture
5. Upload les rapports de couverture vers Codecov
6. Archive les rapports de couverture (30 jours)

## Bonnes Pratiques

### 1. Nommer les tests clairement
```typescript
it('displays 404 error code', () => {
  // Test implementation
})
```

### 2. Utiliser les bonnes queries
- `getByRole`: Privilégier pour l'accessibilité
- `getByText`: Pour le contenu textuel
- `getByTestId`: En dernier recours

### 3. Nettoyer après les tests
```typescript
afterEach(() => {
  cleanup()
})
```

### 4. Mocker les dépendances externes
```typescript
jest.mock('../../components/banner/Banner', () => ({
  __esModule: true,
  default: ({ text }: { text?: string }) => (
    <div data-testid="banner">{text}</div>
  ),
}))
```

## Dépannage

### Les tests échouent en mode watch
- Appuyez sur `a` pour relancer tous les tests
- Appuyez sur `q` pour quitter

### Erreur "Cannot find module"
```bash
npm install --legacy-peer-deps
```

### Les tests sont lents
- Utilisez `npm run test:ci` pour un mode plus rapide
- Limitez les tests avec `it.only()` pendant le développement

## Ressources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
