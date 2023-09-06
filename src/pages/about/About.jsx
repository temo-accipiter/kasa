import "../../styles/main.scss"
import Banner from "../../components/banner/Banner"
import landscapeBanner from "../../assets/landscape.png"
import Collapse from "../../components/collapse/Collapse"

export default function About() {
  return (
    <div className="about">
      <div className="about__container">
        {/* Utilisation du composant Banner avec une image de paysage */}
        <Banner image={landscapeBanner} alt="Paysage" />

        <div className="about__collapse__container">
          <div className="collapse__container">
            <Collapse title="Fiabilité" className="about__collapse__element">
              <p className="collapse__text">
                Les annonces postées sur Kasa garantissent une fiabilité totale.
                Les photos sont conformes aux logements, et toutes les
                informations sont régulièrement vérifiées par nos équipes.
              </p>
            </Collapse>

            <Collapse title="Respect" className="about__collapse__element">
              <p className="collapse__text">
                Les bienveillance fait partie des valeurs fondatrices de Kasa.
                Tout comportement discriminatoire ou de perturbation du
                voisinage entraînera une exclusion de notre plateforme.
              </p>
            </Collapse>

            <Collapse title="Service" className="about__collapse__element">
              <p className="collapse__text">
                Les bienveillance fait partie des valeurs fondatrices de Kasa.
                Tout comportement discriminatoire ou de perturbation du
                voisinage entraînera une exclusion de notre plateforme.
              </p>
            </Collapse>

            <Collapse title="Sécurité" className="about__collapse__element">
              <p className="collapse__text">
                La sécurité est la priorité de Kasa. Aussi bien pour nos hôtes
                que pour les voyageurs, chaque logement correspond aux critères
                de sécurité établis par nos services. En laissant une note aussi
                bien à l'hôte qu'au locataire, cela permet à nos équipes de
                vérifier que les standards sont bien respectés. Nous organisons
                également des ateliers sur la sécurité domestique pour nos
                hôtes.
              </p>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  )
}
