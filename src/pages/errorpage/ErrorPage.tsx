import "../../styles/main.scss"
import { Link } from "react-router-dom"

export default function ErrorPage() {
  return (
    <div className="errorpage">
      <div className="errorpage__container">
        <h1 className="errorpage__title">404</h1>
        <h2 className="errorpage__subtitle">
          Oups! La page que vous demandez n'existe pas.
        </h2>
        <Link to="/" className="errorpage__link">
          Retourner sur la page d’accueil
        </Link>
      </div>
    </div>
  )
}
