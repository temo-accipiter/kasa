import "../../styles/main.scss"
import { Link } from "react-router-dom" // Importation de React Router pour créer des liens
import { useTranslation } from 'react-i18next'
import { CardProps } from "../../types"

export default function Card({ item }: CardProps) {
  const { t } = useTranslation()

  return (
    <div className="card">
      {/* Utilisation de Link pour créer un lien vers la page du logement */}
      <Link
        to={`/apart/${item.id}`}
        aria-label={t('card.viewAccommodation', { title: item.title })}
      >
        {/* Ajout de dégradé sur les cartes*/}
        <div className="card--gradient" aria-hidden="true"></div>
        {/* Image de couverture du logement */}
        <img
          src={item.cover}
          alt=""
          className="card__cover"
          role="presentation"
        />
        <div className="card__title">{item.title}</div>
      </Link>
    </div>
  )
}
