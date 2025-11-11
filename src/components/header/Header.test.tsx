import { render, screen, within } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Header from "./Header"

describe("Header Component", () => {
  it("renders the header component", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const header = screen.getByRole("banner")
    expect(header).toBeInTheDocument()
  })

  it("renders the logo", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    // Utilise la clé i18n au lieu du texte traduit
    const logo = screen.getByAltText("header.logoAlt")
    expect(logo).toBeInTheDocument()
  })

  it("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    // Utilise les clés i18n au lieu du texte traduit
    const homeLink = screen.getByRole("link", { name: /header\.home/i })
    const aboutLink = screen.getByRole("link", { name: /header\.about/i })

    expect(homeLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
  })

  it("has correct link destinations", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    // Utilise les clés i18n au lieu du texte traduit
    const homeLink = screen.getByRole("link", { name: /header\.home/i })
    const aboutLink = screen.getByRole("link", { name: /header\.about/i })

    expect(homeLink).toHaveAttribute("href", "/")
    expect(aboutLink).toHaveAttribute("href", "/about")
  })

  it("logo links to home page", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const logoLinks = screen.getAllByRole("link")
    const logoLink = logoLinks.find((link) => {
      const { queryByRole } = within(link)
      return queryByRole("img")
    })

    expect(logoLink).toHaveAttribute("href", "/")
  })
})
