import "../../styles/main.scss";
import { useParams } from "react-router-dom";
import logements from "../../data/logements.json";
import StarRating from "../../components/star/StarRating";
import Collapse from "../../components/collapse/Collapse";
import Slideshow from "../../components/slideshow/SlideShow"; // Importez le composant Slideshow

export default function Apart() {
  const { id } = useParams();

  // Recherche des données du logement en fonction de l'ID
  const logement = logements.find((item) => item.id === id);

  // Si le logement n'est pas trouvé, affiche un message
  if (!logement) {
    return <div>Logement non trouvé</div>;
  }

  return (
    <div className="apart">
      <div className="apart_container">
        <Slideshow images={logement.pictures} />

        <div className="apart_content">
          <div className="apart_content_1">
            <h2 className="apart_content_title">{logement.title}</h2>
            <h3 className="apart_content_location">{logement.location}</h3>
            <div className="apart_content_tags">
              {/* Utilisation d'une boucle pour afficher les tags */}
              {logement.tags.map((tag, index) => (
                <button key={index} className="apart_content_tag">{tag}</button>))}
            </div>
          </div>
          
          <div className="apart_content_2">
            <div className="apart_host">   {/* photo et nom de host */}
              <h3 className="apart_host_name">{logement.host.name}</h3>
              <img src={logement.host.picture} alt="host" className="apart_host_img" />
            </div>

            <StarRating rating={logement.rating} /> {/* Convertir une chaîne de caractères en un nombre entier */}
          </div>
        </div>

        <div className="apart_collapse">
          <Collapse title="Description" className="apart_collapse_element">
            <p>{logement.description}</p>
          </Collapse>

          <Collapse title="Équipements" className="apart_collapse_element">
            <ul className="apart_collapse_list">
              {logement.equipments.map((equipment, index) => (
                <li key={index}>{equipment}</li>
              ))}
            </ul>
          </Collapse>
        </div>
      </div>
    </div>
  );
}
