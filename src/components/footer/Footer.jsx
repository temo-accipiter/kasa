import "../../styles/main.scss";
import logo from "../../assets/logowhite.png";

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer_logo" src={logo} alt="Logo" />
      <div className="footer_text">© 2020 Kasa. All rights reserved</div>
    </footer>
  );
}
