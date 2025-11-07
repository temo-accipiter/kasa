import "../../styles/main.scss"
import { useState } from "react"
import arrowIcon from "../../assets/fleche.png"
import { CollapseProps } from "../../types"

export default function Collapse({ title, children }: CollapseProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true) // Utilisation du hook useState pour gérer l'état du collapse

  // Fonction pour basculer l'état du collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="collapse">
      <div className="collapse__header">
        <h3>{title}</h3>
        <img
          src={arrowIcon}
          alt="Une flèche"
          className={`collapse__arrow ${
            isCollapsed ? "" : "collapse__arrow--rotated"
          }`}
          onClick={toggleCollapse}
        />
      </div>

      <div className={`collapse__content ${isCollapsed ? "close" : "open"}`}>
        {children}
      </div>
    </div>
  )
}
