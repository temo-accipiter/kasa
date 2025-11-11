import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Home from "./Home"

// Mock des composants enfants
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

// Mock des données de logements
vi.mock("../../lib/data/logements.json", () => ({
  default: [
    {
      id: "1",
      title: "Test Logement 1",
      cover: "test1.jpg",
      pictures: [],
      description: "Test description 1",
      host: { name: "Test Host 1", picture: "host1.jpg" },
      rating: "5",
      location: "Test Location 1",
      equipments: [],
      tags: [],
    },
    {
      id: "2",
      title: "Test Logement 2",
      cover: "test2.jpg",
      pictures: [],
      description: "Test description 2",
      host: { name: "Test Host 2", picture: "host2.jpg" },
      rating: "4",
      location: "Test Location 2",
      equipments: [],
      tags: [],
    },
  ],
}))

describe("Home Page", () => {
  it("renders the home page", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    )

    const main = screen.getByRole("main")
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass("home")
  })

  it("renders the banner with correct text", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    )

    const banner = screen.getByTestId("banner")
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveTextContent("banner.home")
  })

  it("renders the cards container", () => {
    const { container } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const cardsContainer = container.querySelector(".home__card__container")
    expect(cardsContainer).toBeInTheDocument()
  })

  it("renders all logement cards", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    )

    const card1 = screen.getByTestId("card-1")
    const card2 = screen.getByTestId("card-2")

    expect(card1).toBeInTheDocument()
    expect(card2).toBeInTheDocument()
    expect(card1).toHaveTextContent("Test Logement 1")
    expect(card2).toHaveTextContent("Test Logement 2")
  })
})
