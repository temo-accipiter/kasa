import "../../styles/main.scss"
import { useTranslation } from 'react-i18next'
import Banner from "../../components/banner/Banner"
import landscapeBanner from "../../assets/landscape.png"
import Collapse from "../../components/collapse/Collapse"

export default function About() {
  const { t } = useTranslation()

  return (
    <main className="about" id="main-content">
      <div className="about__container">
        {/* Utilisation du composant Banner avec une image de paysage */}
        <Banner image={landscapeBanner} alt={t('about.bannerAlt')} />

        {/* Une div pour contenir les éléments Collapse. */}
        <section className="about__collapse__container">
          <Collapse title={t('about.reliability.title')}>
            {t('about.reliability.content')}
          </Collapse>

          <Collapse title={t('about.respect.title')}>
            {t('about.respect.content')}
          </Collapse>

          <Collapse title={t('about.service.title')}>
            {t('about.service.content')}
          </Collapse>

          <Collapse title={t('about.security.title')}>
            {t('about.security.content')}
          </Collapse>
        </section>
      </div>
    </main>
  )
}
