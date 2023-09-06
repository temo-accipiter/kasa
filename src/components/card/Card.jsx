import "../../styles/main.scss"
import { Link } from "react-router-dom" // Importation de React Router pour créer des liens

export default function Card({ logement }) {
  return (
    <div className="card">
      {/* Utilisation de Link pour créer un lien vers la page du logement */}
      <Link to={`/apart/${logement.id}`}>
        {" "}
        {/* Insérer la valeur de la variable logement.id dans la chaîne de caractères de manière dynamique (string interpolation) */}
        <div className="card--gradient"></div>{" "}
        {/* Ajout de dégradé sur les cartes*/}
        <img
          src={logement.cover}
          alt={logement.title}
          className="card__cover"
        />{" "}
        {/* Image de couverture du logement */}
        <div className="card__title">{logement.title}</div>{" "}
        {/* Titre du logement */}
      </Link>
    </div>
  )
}
