# 🔍 Rapport d'Audit d'Accessibilité - Kasa (Manuel)

**Date**: 7 novembre 2025
**Type d'audit**: Analyse manuelle basée sur WCAG 2.1 (Niveau AA) + axe-core rules
**Analyseur**: Claude (analyse statique du code)

---

## 📊 Résumé Exécutif

| Catégorie    | Nombre de problèmes |
| ------------ | ------------------- |
| 🔴 Critiques | 5                   |
| 🟡 Majeurs   | 8                   |
| 🟢 Mineurs   | 4                   |
| **Total**    | **17**              |

**Score estimé**: **65/100**
(Basé sur les critères WCAG 2.1 Niveau AA)

---

## 🔴 Problèmes Critiques (Priorité 1)

### 1. **Langue du document incorrecte**

- **Fichier**: `public/index.html:2`
- **Problème**: `lang="en"` alors que le contenu est en français
- **Impact**: Les lecteurs d'écran utiliseront la mauvaise prononciation
- **WCAG**: 3.1.1 Language of Page (Level A)
- **Correctif**: Changer `lang="en"` en `lang="fr"`

```html
<!-- Avant -->
<html lang="en">
  <!-- Après -->
  <html lang="fr"></html>
</html>
```

---

### 2. **Composant Collapse non accessible au clavier**

- **Fichier**: `src/components/collapse/Collapse.tsx:18-25`
- **Problème**: Utilisation d'une image cliquable au lieu d'un bouton
- **Impact**:
  - Non utilisable au clavier (Tab + Enter)
  - Pas de feedback pour les lecteurs d'écran
  - Absence d'états ARIA
- **WCAG**: 2.1.1 Keyboard (Level A), 4.1.2 Name, Role, Value (Level A)
- **Correctif**: Remplacer par un `<button>` avec attributs ARIA appropriés

```tsx
// Avant
<img
  src={arrowIcon}
  alt="Une flèche"
  className={`collapse__arrow ${isCollapsed ? "" : "collapse__arrow--rotated"}`}
  onClick={toggleCollapse}
/>

// Après
<button
  className="collapse__toggle"
  onClick={toggleCollapse}
  aria-expanded={!isCollapsed}
  aria-controls={`collapse-content-${uniqueId}`}
>
  <img
    src={arrowIcon}
    alt=""
    role="presentation"
    className={`collapse__arrow ${isCollapsed ? "" : "collapse__arrow--rotated"}`}
  />
  <span className="visually-hidden">
    {isCollapsed ? "Afficher" : "Masquer"} le contenu
  </span>
</button>
```

---

### 3. **Carrousel SlideShow sans navigation clavier accessible**

- **Fichier**: `src/components/slideshow/SlideShow.tsx:34-58`
- **Problème**:
  - Boutons sans labels descriptifs
  - Pas de rôle ARIA pour le carrousel
  - Images sans alt descriptif
- **Impact**: Utilisateurs de lecteurs d'écran ne peuvent pas naviguer efficacement
- **WCAG**: 2.4.4 Link Purpose, 1.1.1 Non-text Content
- **Correctif**: Ajouter des aria-label et un contexte approprié

---

### 4. **Notation par étoiles non annoncée**

- **Fichier**: `src/components/star/StarRating.tsx:6-18`
- **Problème**: Les images d'étoiles ne sont pas regroupées avec un label accessible
- **Impact**: Lecteurs d'écran lisent "star, star, star..." sans contexte
- **WCAG**: 1.1.1 Non-text Content, 1.3.1 Info and Relationships
- **Correctif**: Utiliser un conteneur avec aria-label

```tsx
// Avant
<div className="star--rating">{stars}</div>

// Après
<div
  className="star--rating"
  role="img"
  aria-label={`Note: ${rating} sur 5 étoiles`}
>
  {stars}
</div>
```

---

### 5. **Mauvaise sémantique HTML dans Header**

- **Fichier**: `src/components/header/Header.tsx:8`
- **Problème**: Utilisation de `<main>` dans un `<header>`
- **Impact**: Structure sémantique confuse pour les technologies d'assistance
- **WCAG**: 1.3.1 Info and Relationships (Level A)
- **Correctif**: Remplacer `<main>` par `<div>`

```tsx
// Avant
<main className="header__container">

// Après
<div className="header__container">
```

---

## 🟡 Problèmes Majeurs (Priorité 2)

### 6. **Titre de page générique**

- **Fichier**: `public/index.html:27`
- **Problème**: `<title>React App</title>`
- **Impact**: Identification de page difficile dans les onglets et historique
- **WCAG**: 2.4.2 Page Titled (Level A)
- **Correctif**: `<title>Kasa - Location d'appartements entre particuliers</title>`

---

### 7. **Images avec alt génériques ou vides**

- **Fichiers multiples**:
  - `Header.tsx:10` - alt="Logo"
  - `Footer.tsx:7` - alt="Logo"
  - `Apart.tsx:48` - alt="host"
  - `SlideShow.tsx:29,47` - alt="Slide"
- **Impact**: Description non informative pour les utilisateurs malvoyants
- **WCAG**: 1.1.1 Non-text Content (Level A)
- **Correctifs**:
  - Logo: `alt="Kasa, location d'appartements"`
  - Host: `alt={logement.host.name}` ou `alt=""`
  - Slides: `alt={`Photo ${currentSlide + 1} de ${logement.title}`}`

---

### 8. **Boutons de navigation du carrousel sans labels**

- **Fichier**: `src/components/slideshow/SlideShow.tsx:34-58`
- **Problème**: Boutons avec seulement une image sans aria-label
- **Impact**: Lecteurs d'écran annoncent "button" sans contexte
- **WCAG**: 2.4.4 Link Purpose, 4.1.2 Name, Role, Value
- **Correctif**: Ajouter aria-label explicites

```tsx
<button
  className="slideshow__arrow slideshow__arrow--left"
  onClick={PreviousSlide}
  aria-label="Image précédente"
>
  <img src={leftArrowImage} alt="" role="presentation" />
</button>

<button
  className="slideshow__arrow slideshow__arrow--right"
  onClick={NextSlide}
  aria-label="Image suivante"
>
  <img src={rightArrowImage} alt="" role="presentation" />
</button>
```

---

### 9. **Absence d'indication de navigation actuelle**

- **Fichier**: `src/components/header/Header.tsx:13-15`
- **Problème**: NavLink sans aria-current
- **Impact**: Pas d'indication de la page actuelle pour les lecteurs d'écran
- **WCAG**: 2.4.8 Location (Level AAA, recommandé)
- **Note**: React Router ajoute automatiquement la classe "active", mais pas aria-current
- **Correctif**: Sera géré automatiquement par NavLink avec aria-current="page"

---

### 10. **Contrastes de couleurs à vérifier**

- **Fichiers**: Styles SCSS
- **Problème potentiel**: Les contrastes doivent être vérifiés (ratio 4.5:1 minimum)
- **Impact**: Lisibilité difficile pour les utilisateurs malvoyants
- **WCAG**: 1.4.3 Contrast (Minimum) (Level AA)
- **Correctif**: Audit des couleurs avec un outil de contraste

---

### 11. **Liens de cartes sans contexte de destination**

- **Fichier**: `src/components/card/Card.tsx:9`
- **Problème**: Lien enveloppant une image et un titre sans aria-label
- **Impact**: Contexte de destination peu clair
- **WCAG**: 2.4.4 Link Purpose (Level A)
- **Correctif**: Ajouter aria-label descriptif

```tsx
<Link to={`/apart/${item.id}`} aria-label={`Voir le logement ${item.title}`}>
```

---

### 12. **Tags sans rôle sémantique**

- **Fichier**: `src/pages/apart/Apart.tsx:32-38`
- **Problème**: Tags dans des `<div>` sans structure liste
- **Impact**: Pas de regroupement sémantique
- **WCAG**: 1.3.1 Info and Relationships
- **Correctif**: Utiliser une liste `<ul>` avec `<li>`

---

### 13. **État du collapse non annoncé**

- **Fichier**: `src/components/collapse/Collapse.tsx`
- **Problème**: Pas d'aria-expanded sur l'élément de contrôle
- **Impact**: État ouvert/fermé non communiqué
- **WCAG**: 4.1.2 Name, Role, Value (Level A)
- **Correctif**: (Couvert par le correctif #2)

---

## 🟢 Problèmes Mineurs (Priorité 3)

### 14. **Skip link manquant**

- **Fichier**: `public/index.html` / `src/App.tsx`
- **Problème**: Pas de lien "Aller au contenu principal"
- **Impact**: Navigation au clavier moins efficace
- **WCAG**: 2.4.1 Bypass Blocks (Level A)
- **Correctif**: Ajouter un skip link au début de App.tsx

---

### 15. **Landmark regions non définies explicitement**

- **Fichiers**: Composants divers
- **Problème**: Pas de `role` explicite pour certaines régions
- **Impact**: Navigation par landmarks moins efficace
- **WCAG**: Bonne pratique (non obligatoire si balises HTML5 sémantiques)
- **Note**: Utilisation correcte de `<header>`, `<footer>`, `<main>`, `<nav>`

---

### 16. **Focus visible à vérifier**

- **Fichiers**: Styles SCSS
- **Problème potentiel**: Indicateurs de focus personnalisés à vérifier
- **Impact**: Navigation clavier difficile sans indicateurs clairs
- **WCAG**: 2.4.7 Focus Visible (Level AA)
- **Correctif**: S'assurer que `:focus-visible` est stylisé

---

### 17. **Chargement sans indication pour technologies d'assistance**

- **Fichier**: `src/index.tsx:44-54`
- **Problème**: Fallback "Chargement..." sans role="status" ou aria-live
- **Impact**: État de chargement non annoncé
- **WCAG**: 4.1.3 Status Messages (Level AA)
- **Correctif**: Ajouter aria-live="polite"

```tsx
<div
  role="status"
  aria-live="polite"
  style={{...}}
>
  Chargement...
</div>
```

---

## 📋 Plan d'Action Recommandé

### Phase 1 - Critiques (À corriger immédiatement)

1. ✅ Corriger la langue du document (HTML)
2. ✅ Rendre le composant Collapse accessible
3. ✅ Améliorer l'accessibilité du SlideShow
4. ✅ Ajouter un contexte pour le StarRating
5. ✅ Corriger la sémantique HTML du Header

### Phase 2 - Majeurs (À corriger rapidement)

6. ✅ Mettre à jour le titre de la page
7. ✅ Améliorer les textes alternatifs
8. ✅ Ajouter aria-label aux boutons
9. ✅ Restructurer les tags en liste
10. ⚠️ Vérifier les contrastes (audit manuel avec outil)

### Phase 3 - Mineurs (Amélioration continue)

11. ✅ Ajouter skip link
12. ✅ Améliorer le feedback de chargement
13. ⚠️ Vérifier et améliorer les styles de focus

---

## 🧪 Recommandations de Tests

### Tests manuels à effectuer après correctifs:

1. **Navigation clavier**: Tester Tab, Shift+Tab, Enter, Space, Flèches
2. **Lecteur d'écran**: Tester avec NVDA (Windows), JAWS, ou VoiceOver (Mac)
3. **Zoom**: Tester jusqu'à 200% de zoom
4. **Contraste**: Utiliser Chrome DevTools ou WebAIM Contrast Checker
5. **axe-core**: Lancer l'application en mode dev avec la console ouverte

### Outils recommandés:

- **axe DevTools** (extension Chrome/Firefox)
- **WAVE** (extension d'évaluation d'accessibilité)
- **Lighthouse** (intégré dans Chrome DevTools)
- **NVDA** ou **JAWS** (lecteurs d'écran)
- **Keyboard navigation testing** (Tab, Shift+Tab)

---

## 📚 Références

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

---

**Note**: Ce rapport est basé sur une analyse statique du code source. Des tests avec de vrais utilisateurs et technologies d'assistance sont fortement recommandés pour valider les correctifs.
