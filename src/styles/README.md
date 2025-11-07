# 📁 Architecture SCSS - Kasa

## 🎯 Vue d'ensemble

Cette architecture SCSS suit le pattern **7-1** et utilise la syntaxe moderne SASS avec `@use` et `@forward` pour une meilleure modularité et performance.

## 📂 Structure des dossiers

```
styles/
├── abstracts/          # Variables, mixins, fonctions (pas de CSS généré)
│   ├── _variables.scss # Tokens de design centralisés
│   ├── _mixins.scss    # Mixins réutilisables
│   ├── _functions.scss # Fonctions utilitaires
│   └── _index.scss     # Point d'entrée des abstracts
│
├── base/               # Styles de base et reset
│   ├── _reset.scss     # Reset CSS moderne
│   ├── _typography.scss# Styles typographiques
│   ├── _global.scss    # Styles globaux et utilities
│   ├── _animations.scss# Keyframes et animations
│   └── _index.scss     # Point d'entrée de base
│
├── components/         # Composants réutilisables
│   ├── _buttons.scss   # Styles des boutons
│   ├── _card.scss      # Composant carte
│   ├── _banner.scss    # Composant bannière
│   ├── _collapse.scss  # Composant accordéon
│   ├── _slideshow.scss # Composant carrousel
│   ├── _star-rating.scss # Notation par étoiles
│   └── _index.scss     # Point d'entrée des composants
│
├── layouts/            # Structures de mise en page
│   ├── _header.scss    # Layout header
│   ├── _footer.scss    # Layout footer
│   ├── _grid.scss      # Système de grille
│   └── _index.scss     # Point d'entrée des layouts
│
├── pages/              # Styles spécifiques aux pages
│   ├── _home.scss      # Page d'accueil
│   ├── _about.scss     # Page à propos
│   ├── _apart.scss     # Page détail appartement
│   ├── _error.scss     # Page 404
│   └── _index.scss     # Point d'entrée des pages
│
├── themes/             # Système de thèmes
│   └── _theme.scss     # Thème clair/sombre avec CSS variables
│
└── main.scss           # Point d'entrée principal
```

## 🚀 Nouvelle syntaxe SASS

### Migration de `@import` vers `@use` et `@forward`

**Avant (ancienne syntaxe):**

```scss
@import "abstracts/variables";
@import "abstracts/mixins";
```

**Après (nouvelle syntaxe):**

```scss
@use "abstracts" as *;
// ou avec namespace:
@use "abstracts";
// puis: abstracts.$primary-color
```

### Avantages

1. **Pas de duplication** - Les fichiers ne sont chargés qu'une seule fois
2. **Namespaces** - Évite les conflits de noms
3. **Performance** - Compilation plus rapide
4. **Meilleure organisation** - Dépendances explicites

## 🎨 Système de thème clair/sombre

Le projet utilise maintenant des **CSS Custom Properties** pour le theming:

### Activation du thème sombre

```javascript
// En JavaScript
document.documentElement.setAttribute("data-theme", "dark")
```

### Variables disponibles

```scss
// Utilisation dans SCSS
.element {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

Variables principales:

- `--color-primary` - Couleur primaire (#ff6060)
- `--color-background` - Fond de page
- `--color-text` - Couleur du texte
- `--color-surface` - Surfaces (cartes, etc.)
- `--border-radius-md` - Arrondi moyen
- `--spacing-lg` - Espacement large

## 📐 Design Tokens

### Couleurs

```scss
$color-primary: #ff6060;
$color-secondary: #000000;
$color-tertiary: #ffffff;
$color-background: #f6f6f6;
```

### Espacements

```scss
$spacing-xs: 0.5rem; // 5px
$spacing-sm: 1rem; // 10px
$spacing-md: 1.5rem; // 15px
$spacing-lg: 2rem; // 20px
$spacing-xl: 2.5rem; // 25px
$spacing-2xl: 3rem; // 30px
$spacing-3xl: 4rem; // 40px
$spacing-4xl: 5rem; // 50px
```

### Breakpoints

```scss
$breakpoint-xs: 375px;
$breakpoint-sm: 699px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1240px;
$breakpoint-2xl: 1440px;
```

## 🛠️ Mixins utiles

### Responsive Design

```scss
@use "../abstracts" as *;

.element {
  @include mobile {
    // Styles pour mobile
  }

  @include tablet {
    // Styles pour tablette
  }

  @include desktop {
    // Styles pour desktop
  }
}
```

### Layout

```scss
// Container centré
.container {
  @include container;
}

// Flexbox centré
.flex-center {
  @include flex-center;
}

// Flexbox space-between
.header {
  @include flex-between;
}
```

### Visual

```scss
// Ombre de carte avec hover
.card {
  @include card-shadow;
}

// Transition fluide
.button {
  @include smooth-transition(transform);
}
```

## 📝 Utilisation dans les composants

### Import des abstracts

```scss
// Dans n'importe quel fichier SCSS
@use "../abstracts" as *;

.my-component {
  color: $color-primary;
  padding: $spacing-lg;
  border-radius: var(--border-radius-md);

  @include mobile {
    padding: $spacing-md;
  }
}
```

## 🎯 Classes utilitaires

### Espacement

```html
<div class="mt-lg mb-xl px-md">...</div>
```

- `mt-*` - margin-top
- `mb-*` - margin-bottom
- `ml-*` - margin-left
- `mr-*` - margin-right
- `mx-*` - margin horizontal
- `my-*` - margin vertical
- `pt-*` - padding-top (idem pour pb, pl, pr, px, py)

Tailles: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Display & Flexbox

```html
<div class="d-flex flex-between">...</div>
<div class="d-grid">...</div>
```

### Animations

```html
<div class="animate-fade-in">...</div>
<div class="animate-slide-in-left">...</div>
```

## 🔧 Configuration du projet

### Import principal

Le fichier `main.scss` est le point d'entrée unique:

```scss
// src/styles/main.scss
@use "themes/theme";
@use "abstracts" as *;
@use "base";
@use "layouts";
@use "components";
@use "pages";
```

### Import dans l'application

```javascript
// src/index.tsx ou App.tsx
import "./styles/main.scss"
```

## 📊 Compatibilité

### Navigateurs supportés

- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

### Variables CSS

Les CSS Custom Properties sont supportées dans tous les navigateurs modernes. Pour IE11, un fallback avec PostCSS peut être ajouté.

## 🎓 Best Practices

1. **Toujours utiliser `@use` au lieu de `@import`**
2. **Préférer les CSS variables pour les valeurs dynamiques**
3. **Utiliser les mixins pour éviter la duplication**
4. **Nommer les classes avec BEM** (Block Element Modifier)
5. **Mobile-first** - Écrire d'abord pour mobile, puis desktop
6. **Éviter les sélecteurs profonds** (max 3 niveaux)

## 🔄 Migration depuis l'ancienne structure

### Étapes effectuées

1. ✅ Migration de `@import` vers `@use`/`@forward`
2. ✅ Création d'un système de variables centralisé
3. ✅ Ajout du système de thème clair/sombre
4. ✅ Création de mixins réutilisables
5. ✅ Organisation en 7-1 pattern
6. ✅ Suppression du code mort
7. ✅ Ajout de classes utilitaires

### Rétrocompatibilité

Les anciennes variables sont toujours disponibles pour assurer la compatibilité:

```scss
// Legacy support
$primary-color: $color-primary;
$small: $breakpoint-sm;
$br: (...); // Map des border-radius
```

## 📚 Ressources

- [Documentation SASS officielle](https://sass-lang.com/)
- [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern)
- [BEM Methodology](http://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Auteur**: Refactorisation SCSS Kasa
**Date**: Novembre 2025
**Version**: 2.0.0
