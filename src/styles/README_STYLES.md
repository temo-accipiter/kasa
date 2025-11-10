# 🎨 Guide d'Architecture SCSS - Kasa

> Architecture SCSS moderne optimisée pour applications React avec support TSA (Troubles du Spectre Autistique)

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Structure des dossiers](#structure-des-dossiers)
- [Conventions de nommage](#conventions-de-nommage)
- [Variables](#variables)
- [Mixins](#mixins)
- [Placeholders](#placeholders)
- [Animations](#animations)
- [Accessibilité](#accessibilité)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

Ce projet utilise une architecture SCSS moderne basée sur le **pattern 7-1** avec :

- ✅ Syntaxe moderne `@use` / `@forward` (pas de `@import`)
- ✅ Palette pastel optimisée pour enfants TSA
- ✅ Animations douces et apaisantes
- ✅ Accessibilité WCAG AA
- ✅ Support `prefers-reduced-motion` et `prefers-contrast`
- ✅ Design system avec tokens centralisés

---

## Structure des dossiers

```
src/styles/
├── abstracts/           # Variables, mixins, functions, placeholders
│   ├── _variables.scss  # Design tokens (couleurs, espacements, etc.)
│   ├── _mixins.scss     # Mixins réutilisables
│   ├── _functions.scss  # Fonctions utilitaires
│   ├── _placeholders.scss # Patterns réutilisables avec @extend
│   └── _index.scss      # Point d'entrée des abstracts
│
├── base/                # Styles de base
│   ├── _reset.scss      # Reset CSS
│   ├── _typography.scss # Styles typographiques
│   ├── _animations.scss # Keyframes et animations
│   ├── _accessibility.scss # Classes d'accessibilité
│   ├── _global.scss     # Styles globaux
│   └── _index.scss      # Point d'entrée base
│
├── components/          # Composants réutilisables
│   ├── _buttons.scss
│   ├── _card.scss
│   ├── _banner.scss
│   ├── _collapse.scss
│   ├── _slideshow.scss
│   ├── _star-rating.scss
│   └── _index.scss
│
├── layouts/             # Structures de mise en page
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _grid.scss
│   └── _index.scss
│
├── pages/               # Styles spécifiques aux pages
│   ├── _home.scss
│   ├── _about.scss
│   ├── _apart.scss
│   ├── _error.scss
│   └── _index.scss
│
├── themes/              # Systèmes de thème
│   └── _theme.scss      # CSS Custom Properties
│
└── main.scss            # 🎯 Point d'entrée principal
```

---

## Conventions de nommage

### BEM Simplifié

Nous utilisons une convention **BEM simplifiée** :

```scss
.block {
} // Composant principal
.block__element {
} // Élément du composant
.block--modifier {
} // Variante du composant
.block__element--modifier {
} // Variante d'un élément
```

**Exemples :**

```scss
// ✅ BON
.card {
}
.card__title {
}
.card__image {
}
.card--featured {
}
.card__title--large {
}

// ❌ MAUVAIS
.cardTitle {
} // camelCase non utilisé
.card-title {
} // Simple tiret non utilisé
.card_title {
} // Underscore simple non utilisé
```

### Classes utilitaires

Préfixez les classes utilitaires avec leur fonction :

```scss
.text-center           // Utilitaire texte
.flex-center           // Utilitaire layout
.animate-fade-in       // Utilitaire animation
.sr-only              // Utilitaire accessibilité
```

---

## Variables

### Importation

```scss
@use "../../styles/abstracts" as *;
```

### Palette de couleurs

#### Couleurs principales

```scss
$color-primary: #ff6060;
$color-secondary: #000000;
$color-tertiary: #ffffff;
$color-background: #f6f6f6;
$color-text-dark: #000000;
$color-text-light: #ffffff;
```

#### Palette pastel TSA 🎨

Couleurs douces et apaisantes optimisées pour enfants TSA :

```scss
$color-pastel-blue: #a8d5e2; // Bleu ciel doux
$color-pastel-green: #b8e6d5; // Vert menthe apaisant
$color-pastel-yellow: #ffeaa7; // Jaune crème doux
$color-pastel-pink: #ffccd5; // Rose poudré
$color-pastel-lavender: #d4c5f9; // Lavande douce
$color-pastel-peach: #ffd7ba; // Pêche pastel
$color-pastel-mint: #c7ecee; // Menthe claire
```

#### États et feedback

```scss
$color-success: #b8e6d5; // Vert pastel
$color-warning: #ffeaa7; // Jaune pastel
$color-error: #ffccd5; // Rose pastel (moins agressif)
$color-info: #a8d5e2; // Bleu pastel
```

### Espacement

```scss
$spacing-xs: 0.5rem; // 8px
$spacing-sm: 1rem; // 16px
$spacing-md: 1.5rem; // 24px
$spacing-lg: 2rem; // 32px
$spacing-xl: 2.5rem; // 40px
$spacing-2xl: 3rem; // 48px
$spacing-3xl: 4rem; // 64px
$spacing-4xl: 5rem; // 80px
```

### Typographie

```scss
$font-family-base: "Montserrat", sans-serif;

$font-size-xs: 1.2rem; // 12px
$font-size-sm: 1.4rem; // 14px
$font-size-base: 1.6rem; // 16px
$font-size-md: 1.8rem; // 18px
$font-size-lg: 2.2rem; // 22px
$font-size-xl: 2.4rem; // 24px
$font-size-2xl: 3rem; // 30px
$font-size-3xl: 3.6rem; // 36px
$font-size-4xl: 4.8rem; // 48px

$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;
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

### Transitions (optimisées TSA)

```scss
$transition-instant: 100ms;
$transition-fast: 200ms;
$transition-base: 400ms; // Plus doux pour TSA
$transition-slow: 600ms;
$transition-slower: 800ms;

$transition-ease: ease-in-out;
$transition-ease-out: cubic-bezier(0.33, 1, 0.68, 1);
$transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Mixins

### Responsive

```scss
// Mobile first
@include respond-above($breakpoint-md) {
  // Styles pour écrans moyens et plus
}

@include respond-below($breakpoint-lg) {
  // Styles pour écrans sous large
}

@include respond-between($breakpoint-md, $breakpoint-lg) {
  // Styles pour tablettes uniquement
}

// Shortcuts
@include mobile {
  // Styles mobile (< 768px)
}

@include tablet {
  // Styles tablette (768px - 1024px)
}

@include desktop {
  // Styles desktop (> 1024px)
}
```

### Layout

```scss
// Container centré
@include container;

// Flexbox centré
@include flex-center;

// Flexbox space-between
@include flex-between;

// Grilles automatiques
@include grid-auto-fit(250px, $spacing-lg);
@include grid-auto-fill(300px, $spacing-md);
```

### Accessibilité

```scss
// Masquer visuellement (accessible aux lecteurs d'écran)
@include visually-hidden;

// Focus visible
@include focus-visible;
@include focus-visible($color-tertiary); // Avec couleur custom

// Focus ring inset
@include focus-ring-inset;

// Accessible au clavier
@include keyboard-accessible;

// Support mouvement réduit
@include reduced-motion {
  animation: none;
}

// Respect des préférences de mouvement
@include respect-motion-preference;

// Haut contraste
@include high-contrast {
  border-width: 2px;
}
```

### TSA-Specific Mixins 🧩

```scss
// Animation douce
@include gentle-animation(opacity, $transition-slow);

// Hover subtil (évite sur-stimulation)
@include gentle-hover(1.02);

// Surface apaisante
@include calming-surface;

// Feedback interactif clair
@include interactive-feedback;
```

### Texte

```scss
// Tronquer avec ellipsis
@include text-truncate;

// Limiter à N lignes
@include text-clamp(2);
@include text-clamp(3);

// Font smoothing
@include font-smoothing;
```

### Reset

```scss
// Reset bouton
@include reset-button;

// Reset liste
@include reset-list;

// Reset lien
@include reset-link;
```

---

## Placeholders

Les placeholders sont réutilisés avec `@extend` et ne génèrent du CSS que s'ils sont utilisés.

### Layout

```scss
.mon-container {
  @extend %container;
}

.mon-flex-center {
  @extend %flex-center;
}

.mon-absolute-fill {
  @extend %absolute-fill;
}
```

### Cards

```scss
.ma-carte {
  @extend %card-base;
}

.ma-carte-interactive {
  @extend %card-interactive;
}

.ma-carte-elevee {
  @extend %card-elevated;
}
```

### Boutons

```scss
.mon-bouton {
  @extend %btn-base;
  @extend %btn-hover-lift;
}
```

### Images

```scss
.mon-image {
  @extend %img-cover;
  // ou
  @extend %img-contain;
  // ou
  @extend %img-responsive;
}
```

### TSA-Specific

```scss
.zone-apaisante {
  @extend %calming-surface;
}

.element-interactif {
  @extend %gentle-interactive;
}

.carte-pastel {
  @extend %pastel-card;
}
```

---

## Animations

### Keyframes disponibles

#### Standard

- `fade-in` - Apparition progressive
- `slide-in-left` - Glissement depuis la gauche
- `slide-in-right` - Glissement depuis la droite
- `slide-in-up` - Glissement depuis le bas
- `pulse` - Pulsation
- `spin` - Rotation
- `collapse-open` - Ouverture de collapse

#### TSA-Optimized 🌟

- `gentle-bounce` - Rebond doux
- `gentle-scale` - Zoom doux
- `soft-glow` - Lueur douce
- `slide-down-gentle` - Descente douce
- `zoom-in-gentle` - Zoom in doux

### Classes utilitaires

```html
<!-- Standard -->
<div class="animate-fade-in">...</div>
<div class="animate-slide-in-up">...</div>
<div class="animate-pulse">...</div>

<!-- TSA-Optimized -->
<div class="animate-gentle-bounce">...</div>
<div class="animate-gentle-scale">...</div>
<div class="animate-soft-glow">...</div>
```

### Custom animations

```scss
.mon-element {
  animation: fade-in $transition-slow ease-in;

  @include reduced-motion {
    animation: none;
  }
}
```

---

## Accessibilité

### Classes disponibles

```html
<!-- Masquer visuellement -->
<span class="visually-hidden">Texte pour lecteurs d'écran</span>
<span class="sr-only">Même chose</span>

<!-- Masquer complètement -->
<div class="a11y-hidden">Caché pour tous</div>

<!-- Skip link -->
<a href="#main" class="skip-link">Aller au contenu principal</a>

<!-- Touch target minimum -->
<button class="touch-target">OK</button>

<!-- Contraste -->
<div class="text-contrast-aa">Texte WCAG AA</div>
<div class="text-contrast-aaa">Texte WCAG AAA</div>
```

### Focus styles

Tous les éléments interactifs ont automatiquement un focus ring de 3px.

```scss
// Personnaliser le focus
.mon-bouton {
  @include focus-visible($color-pastel-blue);
}
```

### Prefers-reduced-motion

Toutes les animations respectent automatiquement `prefers-reduced-motion`.

---

## Exemples d'utilisation

### Exemple 1 : Créer un nouveau composant

**Avant (ancien style) :**

```scss
.my-component {
  padding: 20px;
  color: #ff6060;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
}
```

**Après (nouveau style) :**

```scss
// src/components/MyComponent/MyComponent.scss
@use "../../styles/abstracts" as *;

.my-component {
  // Espacement avec variables
  padding: $spacing-lg;

  // Couleur avec variable
  color: var(--color-primary, $color-primary);

  // Typographie avec variable
  font-size: $font-size-md;

  // Animation douce TSA
  @include gentle-animation(all, $transition-slow);

  // Hover doux
  @include gentle-hover(1.05);

  // Accessibilité
  @include focus-visible;

  // Responsive avec mixin
  @include mobile {
    padding: $spacing-sm;
    font-size: $font-size-sm;
  }
}
```

### Exemple 2 : Bouton avec BEM

```scss
@use "../../styles/abstracts" as *;

.button {
  // Base
  @extend %btn-base;
  @extend %btn-hover-lift;

  background-color: var(--color-primary, $color-primary);
  color: $color-text-light;

  // Variantes
  &--secondary {
    background-color: transparent;
    color: var(--color-primary, $color-primary);
    border: 2px solid var(--color-primary, $color-primary);
  }

  &--large {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
  }

  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
  }

  // Éléments
  &__icon {
    margin-right: $spacing-xs;
  }

  &__text {
    @include font-smoothing;
  }

  // États
  &:disabled {
    opacity: $opacity-disabled;
    cursor: not-allowed;
  }
}
```

### Exemple 3 : Card responsive

```scss
@use "../../styles/abstracts" as *;

.product-card {
  // Base avec placeholder
  @extend %card-interactive;

  // Layout
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  // Responsive
  @include mobile {
    gap: $spacing-sm;
  }

  &__image {
    @extend %img-cover;
    border-radius: $border-radius-md;
    aspect-ratio: 16 / 9;
  }

  &__title {
    @extend %heading-base;
    @include text-clamp(2);
    font-size: $font-size-lg;
    color: $color-text-dark;
  }

  &__description {
    @include text-clamp(3);
    color: $color-gray-dark;
    font-size: $font-size-base;
  }

  &__price {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: var(--color-primary, $color-primary);
  }

  // Variante pastel TSA
  &--pastel {
    @extend %pastel-card;
  }
}
```

---

## Bonnes pratiques

### ✅ À FAIRE

1. **Toujours utiliser les variables**

   ```scss
   // ✅ BON
   color: var(--color-primary, $color-primary);
   padding: $spacing-md;

   // ❌ MAUVAIS
   color: #ff6060;
   padding: 24px;
   ```

2. **Utiliser @use au lieu de @import**

   ```scss
   // ✅ BON
   @use "../../styles/abstracts" as *;

   // ❌ MAUVAIS
   @import "../../styles/abstracts";
   ```

3. **Toujours supporter prefers-reduced-motion**

   ```scss
   // ✅ BON
   .element {
     animation: slide-in 600ms ease-out;

     @include reduced-motion {
       animation: none;
     }
   }
   ```

4. **Utiliser les mixins responsive**

   ```scss
   // ✅ BON
   @include mobile {
     font-size: $font-size-sm;
   }

   // ❌ MAUVAIS
   @media (max-width: 768px) {
     font-size: 14px;
   }
   ```

5. **Respecter BEM**

   ```scss
   // ✅ BON
   .card {
   }
   .card__title {
   }
   .card--featured {
   }

   // ❌ MAUVAIS
   .card-title {
   }
   .featuredCard {
   }
   ```

### ❌ À ÉVITER

1. **Ne pas hardcoder les valeurs**
2. **Ne pas utiliser @import**
3. **Ne pas oublier l'accessibilité**
4. **Ne pas ignorer prefers-reduced-motion**
5. **Ne pas créer de nouveaux fichiers SCSS sans raison**

---

## Support navigateurs

- Chrome (dernières 2 versions)
- Firefox (dernières 2 versions)
- Safari (dernières 2 versions)
- Edge (dernières 2 versions)

---

## Ressources

- [SASS Documentation](https://sass-lang.com/documentation)
- [BEM Methodology](http://getbem.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

## Questions ?

Pour toute question sur l'architecture SCSS, consultez ce README ou contactez l'équipe de développement.

**Dernière mise à jour :** 2025-11-10
