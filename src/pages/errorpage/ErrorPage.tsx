import "../../styles/main.scss"
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next'

export default function ErrorPage() {
  const { t } = useTranslation()

  return (
    <main className="errorpage" id="main-content" role="main">
      <div className="errorpage__container">
        <h1 className="errorpage__title">{t('error.title')}</h1>
        <p className="errorpage__subtitle">
          {t('error.message')}
        </p>
        <Link to="/" className="errorpage__link">
          {t('error.returnHome')}
        </Link>
      </div>
    </main>
  )
}
