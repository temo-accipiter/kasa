import "../../styles/main.scss"
import { NavLink } from "react-router-dom" // Utilisation de NavLink pour la gestion des styles actifs
import logo from "../../assets/LOGO.png"

export default function Header() {
  return (
    <header className="header">
      <main className="header__container">
        <NavLink to="/">
          <img src={logo} alt="Logo" />
        </NavLink>

        <nav className="header__nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/about">A propos</NavLink>
        </nav>
      </main>
    </header>
  )
}
