import "./styles/main.scss"
import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
