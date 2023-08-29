import "../../styles/main.scss";
import { NavLink } from "react-router-dom"; // Utilisation de NavLink au lieu de Link
import logo from "../../assets/LOGO.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header_container">
        <div className="header_logo">
          <img src={logo} alt="Logo" />
        </div>

        <nav className="header_nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/about">A propos</NavLink>
        </nav>
      </div>
    </header>
  );
}
