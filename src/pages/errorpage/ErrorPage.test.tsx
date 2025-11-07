import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ErrorPage from './ErrorPage'

describe('ErrorPage Component', () => {
  it('renders the error page', () => {
    const { container } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const errorPage = container.querySelector('.errorpage')
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
    const { container } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const homeLink = container.querySelector('.errorpage__link')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
    expect(homeLink?.textContent).toContain('Retourner')
  })

  it('has correct CSS classes', () => {
    const { container } = render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>,
    )

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const errorPage = container.querySelector('.errorpage')
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const errorPageContainer = container.querySelector('.errorpage__container')
    const title = screen.getByRole('heading', { level: 1 })
    const subtitle = screen.getByRole('heading', { level: 2 })

    expect(errorPage).toHaveClass('errorpage')
    expect(errorPageContainer).toHaveClass('errorpage__container')
    expect(title).toHaveClass('errorpage__title')
    expect(subtitle).toHaveClass('errorpage__subtitle')
  })
})
