import "../../styles/main.scss"
import { NavLink } from "react-router-dom" // Utilisation de NavLink pour la gestion des styles actifs
import logo from "../../assets/LOGO.png"

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/">
          <div className="header__logo">
            <img src={logo} alt="Logo" />
          </div>
        </NavLink>

        <nav className="header__nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/about">A propos</NavLink>
        </nav>
      </div>
    </header>
  )
}
