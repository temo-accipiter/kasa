import "../../styles/main.scss"
import { Link } from "react-router-dom" // Importation de React Router pour créer des liens
import { CardProps } from "../../types"

export default function Card({ item }: CardProps) {
  return (
    <div className="card">
      {/* Utilisation de Link pour créer un lien vers la page du logement */}
      <Link to={`/apart/${item.id}`}>
        {/* Ajout de dégradé sur les cartes*/}
        <div className="card--gradient"></div>
        {/* Image de couverture du logement */}
        <img src={item.cover} alt={item.title} className="card__cover" />
        <div className="card__title">{item.title}</div>
      </Link>
    </div>
  )
}
