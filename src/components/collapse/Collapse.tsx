import "../../styles/main.scss"
import { useState, useId } from "react"
import { useTranslation } from 'react-i18next'
import arrowIcon from "../../assets/fleche.png"
import { CollapseProps } from "../../types"

export default function Collapse({ title, children }: CollapseProps) {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true) // Utilisation du hook useState pour gérer l'état du collapse
  const contentId = useId() // Génère un ID unique pour aria-controls

  // Fonction pour basculer l'état du collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="collapse">
      <div className="collapse__header">
        <h3 id={`${contentId}-title`}>{title}</h3>
        <button
          type="button"
          className="collapse__button"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
          aria-labelledby={`${contentId}-title`}
        >
          <img
            src={arrowIcon}
            alt=""
            role="presentation"
            className={`collapse__arrow ${
              isCollapsed ? "" : "collapse__arrow--rotated"
            }`}
          />
          <span className="visually-hidden">
            {isCollapsed ? t('collapse.show') : t('collapse.hide')} {t('collapse.content')}
          </span>
        </button>
      </div>

      <div
        id={contentId}
        className={`collapse__content ${isCollapsed ? "close" : "open"}`}
        aria-hidden={isCollapsed}
      >
        {children}
      </div>
    </div>
  )
}
