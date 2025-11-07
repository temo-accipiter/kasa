import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ErrorPage from './ErrorPage'

describe('ErrorPage Component', () => {
  it('renders the error page', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    const errorPage = document.querySelector('.errorpage')
    expect(errorPage).toBeInTheDocument()
  })

  it('displays 404 error code', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveTextContent('404')
  })

  it('displays error message', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    const subtitle = screen.getByRole('heading', { level: 2 })
    expect(subtitle).toHaveTextContent(
      "Oups! La page que vous demandez n'existe pas.",
    )
  })

  it('displays link to home page', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    const homeLink = document.querySelector('.errorpage__link')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
    expect(homeLink?.textContent).toContain('Retourner')
  })

  it('has correct CSS classes', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    const errorPage = document.querySelector('.errorpage')
    const container = document.querySelector('.errorpage__container')
    const title = screen.getByRole('heading', { level: 1 })
    const subtitle = screen.getByRole('heading', { level: 2 })

    expect(errorPage).toHaveClass('errorpage')
    expect(container).toHaveClass('errorpage__container')
    expect(title).toHaveClass('errorpage__title')
    expect(subtitle).toHaveClass('errorpage__subtitle')
  })
})
