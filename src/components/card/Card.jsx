import "../../styles/main.scss"
import { Link } from "react-router-dom" // Importation de React Router pour créer des liens

export default function Card({ logement }) {
  return (
    <div className="card">
      {/* Utilisation de Link pour créer un lien vers la page du logement */}
      {/* Insérer la valeur de la variable logement.id dans la chaîne de caractères de manière dynamique (string interpolation) */}
      <Link to={`/apart/${logement.id}`}>
        {/* Ajout de dégradé sur les cartes*/}
        <div className="card--gradient"></div>
        {/* Image de couverture du logement */}
        <img
          src={logement.cover}
          alt={logement.title}
          className="card__cover"
        />
        {/* Titre du logement */}
        <div className="card__title">{logement.title}</div>
      </Link>
    </div>
  )
}
