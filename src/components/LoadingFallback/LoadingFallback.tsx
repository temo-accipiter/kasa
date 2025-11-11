import { useTranslation } from "react-i18next"
import "./LoadingFallback.scss"

/**
 * Composant de chargement affiché pendant le lazy-loading des routes
 *
 * Affiche un spinner élégant et un message de chargement
 * pour améliorer l'expérience utilisateur pendant les transitions
 */
export default function LoadingFallback() {
  const { t } = useTranslation()

  return (
    <div className="loading-fallback">
      <div className="loading-fallback__container">
        <div className="loading-fallback__spinner" aria-hidden="true" />
        <p className="loading-fallback__text">{t("loading")}</p>
      </div>
    </div>
  )
}
