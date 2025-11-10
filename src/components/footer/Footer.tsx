import "../../styles/main.scss"
import { useTranslation } from 'react-i18next'
import logo from "../../assets/logowhite.png"

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <img className="footer__logo" src={logo} alt={t('footer.logoAlt')} />
      <div className="footer__text">{t('footer.copyright')}</div>
    </footer>
  )
}
