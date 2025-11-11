import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import App from "../../App"

describe("App Integration Tests", () => {
  it("renders App component with Header, Footer and Outlet", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    // Vérifier que le Header est présent
    const header = screen.getByRole("banner")
    expect(header).toBeInTheDocument()

    // Vérifier que le Footer est présent
    const footer = screen.getByRole("contentinfo")
    expect(footer).toBeInTheDocument()
  })

  it("Header and Footer are always visible", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    // Vérifier que le logo du header est visible (utilise la clé i18n)
    const headerLogo = screen.getByAltText("header.logoAlt")
    expect(headerLogo).toBeInTheDocument()

    // Vérifier que le texte du footer est visible (utilise la clé i18n)
    const footerText = screen.getByText("footer.copyright")
    expect(footerText).toBeInTheDocument()
  })

  it("Header contains navigation links", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    // Utilise les clés i18n au lieu du texte traduit
    const homeLink = screen.getByRole("link", { name: /header\.home/i })
    const aboutLink = screen.getByRole("link", { name: /header\.about/i })

    expect(homeLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
  })
})
