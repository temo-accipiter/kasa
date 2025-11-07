import "../../styles/main.scss"
import logo from "../../assets/logowhite.png"

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer__logo" src={logo} alt="Kasa" />
      <div className="footer__text">© 2020 Kasa. Tous droits réservés</div>
    </footer>
  )
}
