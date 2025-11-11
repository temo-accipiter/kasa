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
    expect(banner).toHaveTextContent("about.bannerAlt")
  })

  it("renders all collapse sections", () => {
    render(<About />)

    const fiabiliteCollapse = screen.getByTestId(
      "collapse-about.reliability.title",
    )
    const respectCollapse = screen.getByTestId("collapse-about.respect.title")
    const serviceCollapse = screen.getByTestId("collapse-about.service.title")
    const securiteCollapse = screen.getByTestId("collapse-about.security.title")

    expect(fiabiliteCollapse).toBeInTheDocument()
    expect(respectCollapse).toBeInTheDocument()
    expect(serviceCollapse).toBeInTheDocument()
    expect(securiteCollapse).toBeInTheDocument()
  })

  it("displays correct titles for collapse sections", () => {
    render(<About />)

    expect(screen.getByText("about.reliability.title")).toBeInTheDocument()
    expect(screen.getByText("about.respect.title")).toBeInTheDocument()
    expect(screen.getByText("about.service.title")).toBeInTheDocument()
    expect(screen.getByText("about.security.title")).toBeInTheDocument()
  })

  it("displays correct content in collapse sections", () => {
    render(<About />)

    expect(screen.getByText("about.reliability.content")).toBeInTheDocument()
    expect(screen.getByText("about.respect.content")).toBeInTheDocument()
    expect(screen.getByText("about.service.content")).toBeInTheDocument()
    expect(screen.getByText("about.security.content")).toBeInTheDocument()
  })
})
