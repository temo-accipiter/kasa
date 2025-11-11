import "../../styles/main.scss"
import { memo } from "react"
import { Link } from "react-router-dom" // Importation de React Router pour créer des liens
import { useTranslation } from "react-i18next"
import { CardProps } from "../../types"

/**
 * Card component optimized with React.memo to prevent unnecessary re-renders
 *
 * This component is rendered in a list and benefits from memoization
 * to avoid re-rendering when parent state changes but card props remain the same
 */
function Card({ item }: CardProps) {
  const { t } = useTranslation()

  return (
    <div className="card">
      {/* Utilisation de Link pour créer un lien vers la page du logement */}
      <Link
        to={`/apart/${item.id}`}
        aria-label={t("card.viewAccommodation", { title: item.title })}
      >
        {/* Ajout de dégradé sur les cartes*/}
        <div className="card--gradient" aria-hidden="true"></div>
        {/* Image de couverture du logement */}
        <img
          src={item.cover}
          alt=""
          className="card__cover"
          role="presentation"
          loading="lazy"
        />
        <div className="card__title">{item.title}</div>
      </Link>
    </div>
  )
}

// Memoize the component to prevent re-renders when props haven't changed
// This is especially useful when rendering many cards in a list
export default memo(Card)
