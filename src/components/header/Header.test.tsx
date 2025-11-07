import { render, screen, within } from '@testing-library/react'
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

  it('renders the logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const accueilLink = screen.getByRole('link', { name: /accueil/i })
    const aboutLink = screen.getByRole('link', { name: /a propos/i })

    expect(accueilLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
  })

  it('has correct link destinations', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const accueilLink = screen.getByRole('link', { name: /accueil/i })
    const aboutLink = screen.getByRole('link', { name: /a propos/i })

    expect(accueilLink).toHaveAttribute('href', '/')
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('logo links to home page', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    const logoLinks = screen.getAllByRole('link')
    const logoLink = logoLinks.find((link) => {
      const { queryByRole } = within(link)
      return queryByRole('img')
    })

    expect(logoLink).toHaveAttribute('href', '/')
  })
})
