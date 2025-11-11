import { render, screen } from "@testing-library/react"
import Footer from "./Footer"

describe("Footer Component", () => {
  it("renders the footer component", () => {
    render(<Footer />)

    const footer = screen.getByRole("contentinfo")
    expect(footer).toBeInTheDocument()
  })

  it("renders the footer logo", () => {
    render(<Footer />)

    // Utilise la clé i18n au lieu du texte traduit
    const logo = screen.getByAltText("footer.logoAlt")
    expect(logo).toBeInTheDocument()
  })

  it("displays copyright text", () => {
    render(<Footer />)

    // Utilise la clé i18n au lieu du texte traduit
    const copyrightText = screen.getByText("footer.copyright")
    expect(copyrightText).toBeInTheDocument()
  })

  it("has correct CSS classes", () => {
    render(<Footer />)

    const footer = screen.getByRole("contentinfo")
    expect(footer).toHaveClass("footer")
  })

  it("logo has correct CSS class", () => {
    render(<Footer />)

    // Utilise la clé i18n au lieu du texte traduit
    const logo = screen.getByAltText("footer.logoAlt")
    expect(logo).toHaveClass("footer__logo")
  })
})
