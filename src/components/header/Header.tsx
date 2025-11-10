import "../../styles/main.scss"
import { NavLink } from "react-router-dom" // Utilisation de NavLink pour la gestion des styles actifs
import { useTranslation } from 'react-i18next'
import logo from "../../assets/LOGO.png"
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" aria-label={t('header.returnHome')}>
          <img src={logo} alt={t('header.logoAlt')} />
        </NavLink>

        <div className="header__actions">
          <nav className="header__nav" aria-label={t('header.mainNav')}>
            <NavLink to="/" end>
              {t('header.home')}
            </NavLink>
            <NavLink to="/about">{t('header.about')}</NavLink>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
