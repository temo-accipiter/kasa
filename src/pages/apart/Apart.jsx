import "../../styles/main.scss"
import { useParams } from "react-router-dom"
import logements from "../../data/logements.json"
import StarRating from "../../components/star/StarRating"
import Collapse from "../../components/collapse/Collapse"
import Slideshow from "../../components/slideshow/SlideShow" // Importez le composant Slideshow

export default function Apart() {
  const { id } = useParams()

  // Recherche des données du logement en fonction de l'ID
  const logement = logements.find((item) => item.id === id)

  // Si le logement n'est pas trouvé, affiche un message
  if (!logement) {
    return <div className="apart__error">Logement non trouvé</div>
  }

  return (
    <div className="apart">
      <div className="apart__container">
        <Slideshow images={logement.pictures} />

        <div className="apart__content">
          <div className="apart__content__1">
            <h2 className="apart__content__title">{logement.title}</h2>
            <h3 className="apart__content__location">{logement.location}</h3>

            <div className="apart__content__tags">
              {/* Utilisation d'une boucle pour afficher les tags */}
              {logement.tags.map((tags, index) => (
                <div key={`${tags}-${index}`} className="apart__content__tag">
                  {tags}
                </div>
              ))}
            </div>
          </div>

          <div className="apart__content__2">
            <div className="apart__host">
              {" "}
              {/* photo et nom de host */}
              <h3 className="apart__host__name">{logement.host.name}</h3>
              <img
                src={logement.host.picture}
                alt="host"
                className="apart__host__img"
              />
            </div>
            <StarRating rating={logement.rating} />{" "}
            {/* Convertir une chaîne de caractères en un nombre entier */}
          </div>
        </div>

        <div className="apart__collapse">
          <div className="apart__collapse__element">
            <Collapse title="Description">
              <p>{logement.description}</p>
            </Collapse>
          </div>

          <div className="apart__collapse__element">
            <Collapse title="Équipements" className="apart__collapse__list">
              <ul>
                {logement.equipments.map((equipments, index) => (
                  <li key={`${equipments}-${index}`}>{equipments}</li>
                ))}
              </ul>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  )
}
