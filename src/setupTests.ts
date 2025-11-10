// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import './i18n/config'

// Mock pour i18next dans les tests
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      // Simple mock qui retourne la clé pour les tests
      if (params) {
        let result = key
        Object.keys(params).forEach((param) => {
          result = result.replace(`{{${param}}}`, params[param])
        })
        return result
      }
      return key
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: 'fr',
    },
  }),
  Trans: ({ children }: any) => children,
}))
