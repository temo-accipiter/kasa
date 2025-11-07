import "../../styles/main.scss"
import { Link } from "react-router-dom"

export default function ErrorPage() {
  return (
    <main className="errorpage" id="main-content" role="main">
      <div className="errorpage__container">
        <h1 className="errorpage__title">404</h1>
        <p className="errorpage__subtitle">
          Oups! La page que vous demandez n'existe pas.
        </p>
        <Link to="/" className="errorpage__link">
          Retourner sur la page d'accueil
        </Link>
      </div>
    </main>
  )
}
