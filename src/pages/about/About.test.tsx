import { render, screen } from "@testing-library/react"
import About from "./About"

// Mock du composant Banner
vi.mock("../../components/banner/Banner", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div data-testid="banner">{alt}</div>,
}))

// Mock du composant Collapse
vi.mock("../../components/collapse/Collapse", () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid={`collapse-${title.toLowerCase()}`}>
      <div>{title}</div>
      <div>{children}</div>
    </div>
  ),
}))

describe("About Page", () => {
  it("renders the about page", () => {
    render(<About />)

    const main = screen.getByRole("main")
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass("about")
  })

  it("renders the banner", () => {
    render(<About />)

    const banner = screen.getByTestId("banner")
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveTextContent("Paysage")
  })

  it("renders all collapse sections", () => {
    render(<About />)

    const fiabiliteCollapse = screen.getByTestId("collapse-fiabilité")
    const respectCollapse = screen.getByTestId("collapse-respect")
    const serviceCollapse = screen.getByTestId("collapse-service")
    const securiteCollapse = screen.getByTestId("collapse-sécurité")

    expect(fiabiliteCollapse).toBeInTheDocument()
    expect(respectCollapse).toBeInTheDocument()
    expect(serviceCollapse).toBeInTheDocument()
    expect(securiteCollapse).toBeInTheDocument()
  })

  it("displays correct titles for collapse sections", () => {
    render(<About />)

    expect(screen.getByText("Fiabilité")).toBeInTheDocument()
    expect(screen.getByText("Respect")).toBeInTheDocument()
    expect(screen.getByText("Service")).toBeInTheDocument()
    expect(screen.getByText("Sécurité")).toBeInTheDocument()
  })

  it("displays correct content in collapse sections", () => {
    render(<About />)

    expect(
      screen.getByText(/Les annonces postées sur Kasa garantissent/i),
    ).toBeInTheDocument()

    // Note: Le texte "Les bienveillance fait partie..." apparaît dans deux sections (Respect et Service)
    const bienveillanceTexts = screen.getAllByText(
      /Les bienveillance fait partie des valeurs/i,
    )
    expect(bienveillanceTexts.length).toBeGreaterThanOrEqual(1)

    expect(
      screen.getByText(/La sécurité est la priorité de Kasa/i),
    ).toBeInTheDocument()
  })
})
