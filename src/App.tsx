import "./styles/main.scss"
import { useTranslation } from "react-i18next"
import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import { Outlet } from "react-router-dom"
import { useFocusManagement, useSkipLink } from "./hooks/useFocusManagement"
import { useReducedMotionClass } from "./hooks/useReducedMotion"

export default function App() {
  const { t } = useTranslation()

  // Manage focus on route changes for accessibility
  useFocusManagement({ targetSelector: "#main-content" })

  // Enable skip link functionality
  useSkipLink()

  // Add reduced-motion class to document for CSS
  useReducedMotionClass()

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t("app.skipToContent")}
      </a>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
