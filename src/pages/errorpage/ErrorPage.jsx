import "../../styles/main.scss";
import { useRouteError, Link } from "react-router-dom"; // Importez Link depuis React Router

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="errorpage">
      <h1 className="errorpage_title">404</h1>
      <h2 className="errorpage_subtitle">Oups! La page que vous demandez n'existe pas.</h2>
      <p>
        <Link to="/" className="nerrorpage_link">Retourner sur la page d’accueil</Link>
      </p>
    </div>
  )
}

