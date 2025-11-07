import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer Component', () => {
  it('renders the footer component', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders the footer logo', () => {
    render(<Footer />)

    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
  })

  it('displays copyright text', () => {
    render(<Footer />)

    const copyrightText = screen.getByText(/© 2020 Kasa. All rights reserved/i)
    expect(copyrightText).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('footer')
  })

  it('logo has correct CSS class', () => {
    render(<Footer />)

    const logo = screen.getByAltText('Logo')
    expect(logo).toHaveClass('footer__logo')
  })
})
