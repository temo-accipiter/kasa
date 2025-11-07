import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import App from '../../App'
import Home from '../../pages/home/Home'
import About from '../../pages/about/About'
import ErrorPage from '../../pages/errorpage/ErrorPage'

// Mock des composants pour simplifier les tests d'intégration
jest.mock('../../components/banner/Banner', () => ({
  __esModule: true,
  default: ({ text }: { text?: string }) => (
    <div data-testid="banner">{text}</div>
  ),
}))

jest.mock('../../components/card/Card', () => ({
  __esModule: true,
  default: ({ item }: { item: { id: string; title: string } }) => (
    <div data-testid={`card-${item.id}`}>{item.title}</div>
  ),
}))

jest.mock('../../components/collapse/Collapse', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid={`collapse-${title.toLowerCase()}`}>{title}</div>
  ),
}))

jest.mock('../../lib/data/logements.json', () => [
  {
    id: '1',
    title: 'Test Logement',
    cover: 'test.jpg',
    pictures: [],
    description: 'Test description',
    host: { name: 'Test Host', picture: 'host.jpg' },
    rating: '5',
    location: 'Test Location',
    equipments: [],
    tags: [],
  },
])

describe('Navigation Integration Tests', () => {
  const setupRouter = (initialRoute = '/') => {
    const router = createMemoryRouter(
      [
        {
          element: <App />,
          children: [
            {
              path: '/',
              element: <Home />,
            },
            {
              path: 'about',
              element: <About />,
            },
            {
              path: '*',
              element: <ErrorPage />,
            },
          ],
        },
      ],
      {
        initialEntries: [initialRoute],
      },
    )

    return router
  }

  it('navigates from Home to About page', async () => {
    const user = userEvent.setup()
    const router = setupRouter('/')

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page d'accueil
    expect(screen.getByText('Chez vous, partout et ailleurs')).toBeInTheDocument()

    // Cliquer sur le lien "A propos"
    const aboutLink = screen.getByRole('link', { name: /a propos/i })
    await user.click(aboutLink)

    // Vérifier qu'on est maintenant sur la page About
    expect(screen.getByTestId('collapse-fiabilité')).toBeInTheDocument()
    expect(screen.getByTestId('collapse-respect')).toBeInTheDocument()
  })

  it('navigates from About to Home page', async () => {
    const user = userEvent.setup()
    const router = setupRouter('/about')

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page About
    expect(screen.getByTestId('collapse-fiabilité')).toBeInTheDocument()

    // Cliquer sur le lien "Accueil"
    const homeLink = screen.getByRole('link', { name: /accueil/i })
    await user.click(homeLink)

    // Vérifier qu'on est maintenant sur la page Home
    expect(screen.getByText('Chez vous, partout et ailleurs')).toBeInTheDocument()
  })

  it('displays ErrorPage for unknown routes', () => {
    const router = setupRouter('/unknown-route')

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page d'erreur
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(
      screen.getByText("Oups! La page que vous demandez n'existe pas."),
    ).toBeInTheDocument()
  })

  it('navigates from ErrorPage back to Home', async () => {
    const user = userEvent.setup()
    const router = setupRouter('/unknown-route')

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page d'erreur
    expect(screen.getByText('404')).toBeInTheDocument()

    // Cliquer sur le lien de retour à l'accueil
    const homeLink = document.querySelector('.errorpage__link')
    expect(homeLink).toBeInTheDocument()
    await user.click(homeLink!)

    // Vérifier qu'on est maintenant sur la page Home
    expect(screen.getByText('Chez vous, partout et ailleurs')).toBeInTheDocument()
  })

  it('Header and Footer remain visible during navigation', async () => {
    const user = userEvent.setup()
    const router = setupRouter('/')

    render(<RouterProvider router={router} />)

    // Vérifier que Header et Footer sont présents sur la page Home
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()

    // Naviguer vers About
    const aboutLink = screen.getByRole('link', { name: /a propos/i })
    await user.click(aboutLink)

    // Vérifier que Header et Footer sont toujours présents
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
