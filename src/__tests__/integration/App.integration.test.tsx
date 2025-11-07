import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../App'

describe('App Integration Tests', () => {
  it('renders App component with Header, Footer and Outlet', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    // Vérifier que le Header est présent
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    // Vérifier que le Footer est présent
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('Header and Footer are always visible', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    // Vérifier que le logo du header est visible
    const headerLogo = screen.getAllByAltText('Logo')[0]
    expect(headerLogo).toBeInTheDocument()

    // Vérifier que le texte du footer est visible
    const footerText = screen.getByText(/© 2020 Kasa. All rights reserved/i)
    expect(footerText).toBeInTheDocument()
  })

  it('Header contains navigation links', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    const accueilLink = screen.getByRole('link', { name: /accueil/i })
    const aboutLink = screen.getByRole('link', { name: /a propos/i })

    expect(accueilLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
  })
})
