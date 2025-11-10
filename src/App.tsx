import "./styles/main.scss"
import { useTranslation } from 'react-i18next'
import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import { Outlet } from "react-router-dom"

export default function App() {
  const { t } = useTranslation()

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('app.skipToContent')}
      </a>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
