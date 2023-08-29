import "../../styles/main.scss";
import { useRouteError, Link } from "react-router-dom"; 

export default function ErrorPage() {
    // Utilisation du hook useRouteError pour obtenir les détails de l'erreur de la route
  const error = useRouteError();
  console.error(error);

  return (
    <div className="errorpage">
      <div className="errorpage_container">
        <h1 className="errorpage_title">404</h1>
        <h2 className="errorpage_subtitle">Oups! La page que vous demandez n'existe pas.</h2>
        <p>
          <Link to="/" className="errorpage_link">Retourner sur la page d’accueil</Link>
        </p>
      </div>
    </div>
  )
}

