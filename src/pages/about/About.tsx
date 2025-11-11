import "../../styles/main.scss"
import { useTranslation } from "react-i18next"
import Banner from "../../components/banner/Banner"
// Image optimisée avec vite-imagetools : génère WebP/AVIF + fallback
import landscapeBannerWebP from "../../assets/landscape.png?w=1920&format=webp"
import landscapeBannerAvif from "../../assets/landscape.png?w=1920&format=avif"
import landscapeBannerJpg from "../../assets/landscape.png?w=1920&format=jpg&quality=80"
import Collapse from "../../components/collapse/Collapse"

export default function About() {
  const { t } = useTranslation()

  // Configuration de l'image optimisée avec formats modernes
  const optimizedLandscapeBanner = {
    avif: landscapeBannerAvif,
    webp: landscapeBannerWebP,
    fallback: landscapeBannerJpg,
  }

  return (
    <main className="about" id="main-content">
      <div className="about__container">
        {/* Utilisation du composant Banner avec une image de paysage optimisée */}
        <Banner image={optimizedLandscapeBanner} alt={t("about.bannerAlt")} />

        {/* Une div pour contenir les éléments Collapse. */}
        <section className="about__collapse__container">
          <Collapse title={t("about.reliability.title")}>
            {t("about.reliability.content")}
          </Collapse>

          <Collapse title={t("about.respect.title")}>
            {t("about.respect.content")}
          </Collapse>

          <Collapse title={t("about.service.title")}>
            {t("about.service.content")}
          </Collapse>

          <Collapse title={t("about.security.title")}>
            {t("about.security.content")}
          </Collapse>
        </section>
      </div>
    </main>
  )
}
