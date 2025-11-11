import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import App from "../../App"
import Home from "../../pages/home/Home"
import About from "../../pages/about/About"
import ErrorPage from "../../pages/errorpage/ErrorPage"

// Mock des composants pour simplifier les tests d'intégration
vi.mock("../../components/banner/Banner", () => ({
  __esModule: true,
  default: ({ text }: { text?: string }) => (
    <div data-testid="banner">{text}</div>
  ),
}))

vi.mock("../../components/card/Card", () => ({
  __esModule: true,
  default: ({ item }: { item: { id: string; title: string } }) => (
    <div data-testid={`card-${item.id}`}>{item.title}</div>
  ),
}))

vi.mock("../../components/collapse/Collapse", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid={`collapse-${title.toLowerCase()}`}>{title}</div>
  ),
}))

vi.mock("../../lib/data/logements.json", () => ({
  default: [
    {
      id: "1",
      title: "Test Logement",
      cover: "test.jpg",
      pictures: [],
      description: "Test description",
      host: { name: "Test Host", picture: "host.jpg" },
      rating: "5",
      location: "Test Location",
      equipments: [],
      tags: [],
    },
  ],
}))

describe("Navigation Integration Tests", () => {
  const setupRouter = (initialRoute = "/") => {
    const router = createMemoryRouter(
      [
        {
          element: <App />,
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "about",
              element: <About />,
            },
            {
              path: "*",
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

  it("navigates from Home to About page", async () => {
    const user = userEvent.setup()
    const router = setupRouter("/")

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page d'accueil
    expect(screen.getByText("banner.home")).toBeInTheDocument()

    // Cliquer sur le lien "A propos"
    const aboutLink = screen.getByRole("link", { name: /header\.about/i })
    await user.click(aboutLink)

    // Vérifier qu'on est maintenant sur la page About
    expect(
      screen.getByTestId("collapse-about.reliability.title"),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId("collapse-about.respect.title"),
    ).toBeInTheDocument()
  })

  it("navigates from About to Home page", async () => {
    const user = userEvent.setup()
    const router = setupRouter("/about")

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page About
    expect(
      screen.getByTestId("collapse-about.reliability.title"),
    ).toBeInTheDocument()

    // Cliquer sur le lien "Accueil"
    const homeLink = screen.getByRole("link", { name: /header\.home/i })
    await user.click(homeLink)

    // Vérifier qu'on est maintenant sur la page Home
    expect(screen.getByText("banner.home")).toBeInTheDocument()
  })

  it("displays ErrorPage for unknown routes", () => {
    const router = setupRouter("/unknown-route")

    render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page d'erreur
    expect(screen.getByText("error.title")).toBeInTheDocument()
    expect(screen.getByText("error.message")).toBeInTheDocument()
  })

  it("navigates from ErrorPage back to Home", async () => {
    const user = userEvent.setup()
    const router = setupRouter("/unknown-route")

    const { container } = render(<RouterProvider router={router} />)

    // Vérifier qu'on est sur la page d'erreur
    expect(screen.getByText("error.title")).toBeInTheDocument()

    // Cliquer sur le lien de retour à l'accueil
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const homeLink = container.querySelector(".errorpage__link")
    expect(homeLink).toBeInTheDocument()
    await user.click(homeLink!)

    // Vérifier qu'on est maintenant sur la page Home
    expect(screen.getByText("banner.home")).toBeInTheDocument()
  })

  it("Header and Footer remain visible during navigation", async () => {
    const user = userEvent.setup()
    const router = setupRouter("/")

    render(<RouterProvider router={router} />)

    // Vérifier que Header et Footer sont présents sur la page Home
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()

    // Naviguer vers About
    const aboutLink = screen.getByRole("link", { name: /header\.about/i })
    await user.click(aboutLink)

    // Vérifier que Header et Footer sont toujours présents
    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
