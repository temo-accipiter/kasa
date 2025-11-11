# Guide d'optimisation des polices (Fonts)

## Vue d'ensemble

Les polices web peuvent représenter une part significative du poids d'une page et impacter directement les Core Web Vitals (CLS, LCP). Ce guide présente les meilleures pratiques pour optimiser le chargement des polices dans une application React/Vite.

## Table des matières

1. [Principes fondamentaux](#principes-fondamentaux)
2. [Formats de polices modernes](#formats-de-polices-modernes)
3. [font-display: swap](#font-display-swap)
4. [Subsetting (sous-ensemble de caractères)](#subsetting)
5. [Preconnect et DNS Prefetch](#preconnect-et-dns-prefetch)
6. [Preload pour polices critiques](#preload-pour-polices-critiques)
7. [Self-hosting vs CDN](#self-hosting-vs-cdn)
8. [Implémentation dans ce projet](#implémentation-dans-ce-projet)

---

## Principes fondamentaux

### Problèmes courants avec les polices web

- **FOIT (Flash of Invisible Text)** : Le texte est invisible pendant le chargement de la police
- **FOUT (Flash of Unstyled Text)** : Le texte s'affiche avec une police système puis change brusquement
- **CLS (Cumulative Layout Shift)** : Le changement de police provoque un décalage de mise en page
- **LCP (Largest Contentful Paint)** : Le chargement des polices retarde l'affichage du contenu principal

### Objectifs d'optimisation

1. **Réduire le poids** : Utiliser des formats modernes et du subsetting
2. **Améliorer le chargement** : Précharger les polices critiques
3. **Éviter les blocages** : Utiliser `font-display: swap`
4. **Minimiser le CLS** : Utiliser des polices système proches ou `size-adjust`

---

## Formats de polices modernes

### Ordre de préférence

```css
@font-face {
  font-family: 'Ma Police';
  src:
    url('/fonts/font.woff2') format('woff2'),
    /* Préféré : -30% vs woff */ url('/fonts/font.woff') format('woff'); /* Fallback */
  font-display: swap;
}
```

### Support des formats

| Format    | Compression | Support navigateurs  | Recommandation          |
| --------- | ----------- | -------------------- | ----------------------- |
| **WOFF2** | Excellent   | >95% (tous modernes) | ✅ Utiliser en priorité |
| **WOFF**  | Bon         | >98% (IE9+)          | ✅ Fallback uniquement  |
| TTF/OTF   | Aucune      | Universel            | ❌ Éviter (trop lourd)  |
| EOT       | Ancien      | IE uniquement        | ❌ Obsolète             |

**Recommandation** : Utiliser **uniquement WOFF2** pour les applications modernes (>95% de support).

---

## font-display: swap

### Description

`font-display: swap` indique au navigateur de :

1. Afficher le texte **immédiatement** avec une police système
2. Remplacer par la police web **dès qu'elle est chargée**

### Valeurs possibles

```css
font-display: auto; /* Comportement par défaut du navigateur (souvent block) */
font-display: block; /* Invisible 3s, puis swap → FOIT ❌ */
font-display: swap; /* Swap immédiat → FOUT, mais contenu visible ✅ */
font-display: fallback; /* Invisible 100ms, swap 3s, puis fallback */
font-display: optional; /* Invisible 100ms, puis fallback si pas chargé */
```

### Recommandation pour ce projet

```css
@font-face {
  font-family: 'Ma Police';
  src: url('/fonts/font.woff2') format('woff2');
  font-display: swap; /* ✅ Affichage immédiat du contenu */
}
```

**Pourquoi `swap` ?**

- ✅ Meilleur pour le LCP (Largest Contentful Paint)
- ✅ Pas de texte invisible (améliore UX)
- ⚠️ Peut causer un léger FOUT (acceptable vs FOIT)

---

## Subsetting

Le **subsetting** consiste à ne garder que les caractères utilisés dans la police, réduisant drastiquement sa taille.

### Exemple de réduction

```
Police complète : 250 KB
Subset latin :     80 KB  (-68%)
Subset optimisé :  40 KB  (-84%)
```

### Comment créer un subset

#### Avec Google Fonts

```
https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap&subset=latin
```

Paramètres :

- `subset=latin` : Caractères latins uniquement
- `subset=latin-ext` : Latin étendu (accents européens)
- `display=swap` : Force font-display

#### Avec FontTools (self-hosted)

```bash
# Installation
pip install fonttools brotli

# Subsetting manuel
pyftsubset font.ttf \
  --output-file=font-subset.woff2 \
  --flavor=woff2 \
  --layout-features=* \
  --unicodes=U+0020-007F,U+00A0-00FF  # Latin de base + Latin-1
```

#### Avec Glyphhanger (automatique)

```bash
# Installation
npm install -g glyphhanger

# Analyse des caractères utilisés dans votre site
glyphhanger http://localhost:3000 --subset=font.ttf

# Génère automatiquement un subset optimisé
```

### Recommandation

Pour ce projet (contenu en français) :

- ✅ Utiliser subset `latin` (couvre français, anglais, espagnol)
- ❌ Éviter subset `latin-ext` si pas nécessaire
- ✅ Tester avec du contenu réel pour vérifier la couverture

---

## Preconnect et DNS Prefetch

### Preconnect (prioritaire)

Établit une connexion anticipée au serveur de polices, économisant ~200-300ms.

```html
<!-- Dans index.html, AVANT les autres <link> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**Pourquoi `crossorigin` ?** Les polices sont chargées en CORS, nécessitant une connexion séparée.

### DNS Prefetch (fallback)

Si `preconnect` n'est pas supporté (très rare), fallback DNS lookup :

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

### Recommandation

```html
<!-- Preconnect pour Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- DNS Prefetch en fallback (optionnel) -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

**Attention** : Ne pas abuser de `preconnect` (max 2-3 domaines prioritaires).

---

## Preload pour polices critiques

### Description

`<link rel="preload">` force le navigateur à télécharger la police **immédiatement**, même avant le CSS.

### Syntaxe

```html
<link rel="preload" href="/fonts/ma-police.woff2" as="font" type="font/woff2" crossorigin />
```

**Attributs obligatoires** :

- `as="font"` : Type de ressource
- `crossorigin` : Requis même pour polices self-hosted (CORS anonyme)

### Quand utiliser preload ?

✅ **OUI** pour :

- Police du titre principal (hero)
- Police du corps de texte si visible above-the-fold
- Police utilisée dans le logo

❌ **NON** pour :

- Polices de titres secondaires
- Polices utilisées uniquement below-the-fold
- Plus de 2-3 polices (surcharge la bande passante)

### Exemple

```html
<!-- Preload uniquement la police principale en regular -->
<link rel="preload" href="/fonts/roboto-regular.woff2" as="font" type="font/woff2" crossorigin />

<!-- ❌ NE PAS preload toutes les variantes -->
<!-- Laissez les graisses bold/italic charger normalement -->
```

---

## Self-hosting vs CDN

### Google Fonts CDN

**Avantages** :

- ✅ Pas de gestion des fichiers
- ✅ Subset automatique
- ✅ Cache potentiel entre sites (moins vrai aujourd'hui)

**Inconvénients** :

- ❌ Requête supplémentaire (latence DNS + TLS)
- ❌ Dépendance externe (RGPD en Europe)
- ❌ Pas de contrôle total sur le cache

### Self-hosting

**Avantages** :

- ✅ Pas de requête externe (0 latence réseau)
- ✅ Conforme RGPD (pas de fuite de données)
- ✅ Contrôle total sur le cache et les headers
- ✅ Fonctionne offline (avec PWA)

**Inconvénients** :

- ❌ Gestion manuelle des fichiers
- ❌ Subsetting manuel si nécessaire

### Recommandation pour ce projet

**✅ Self-hosting** pour :

- Applications PWA (offline-first)
- Conformité RGPD stricte
- Polices customisées

**Configuration optimale** :

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.(woff2?)$/i.test(assetInfo.name ?? '')) {
            return 'assets/fonts/[name][extname]'; // Pas de hash pour caching long-term
          }
        },
      },
    },
  },
});
```

```nginx
# nginx.conf - Cache agressif pour polices
location ~* \.(woff2?|ttf|otf|eot)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## Implémentation dans ce projet

### 1. Structure des fichiers

```
public/
  fonts/
    roboto-regular.woff2
    roboto-bold.woff2
    roboto-italic.woff2
```

### 2. Déclaration CSS

```scss
// src/styles/_fonts.scss

@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* ✅ Affichage immédiat */
}

@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### 3. Preload dans index.html

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- ✅ Preload de la police critique (regular uniquement) -->
    <link
      rel="preload"
      href="/fonts/roboto-regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <!-- Si utilisation de Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <title>Kasa</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### 4. Utilisation dans les composants

```scss
// src/styles/main.scss

body {
  font-family:
    'Roboto',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-weight: 400;
}

h1,
h2,
h3 {
  font-weight: 700;
}
```

**Fallback fonts** : Toujours inclure des polices système similaires pour minimiser le CLS.

---

## Checklist d'optimisation

- [ ] ✅ Utiliser **WOFF2** uniquement (support >95%)
- [ ] ✅ Ajouter `font-display: swap` sur tous les @font-face
- [ ] ✅ Preload uniquement la police **critique** (1-2 max)
- [ ] ✅ Preconnect si utilisation de Google Fonts CDN
- [ ] ✅ Self-host les polices pour PWA et RGPD
- [ ] ✅ Subset latin pour réduire la taille (-50% à -80%)
- [ ] ✅ Utiliser des polices système en fallback
- [ ] ✅ Configurer le cache long-term sur le serveur (1 an)
- [ ] ❌ Ne **pas** preload toutes les variantes (bold, italic)
- [ ] ❌ Ne **pas** utiliser plus de 2-3 familles de polices

---

## Outils de validation

### 1. Lighthouse

```bash
# Tester le scoring des polices
lighthouse http://localhost:3000 --only-categories=performance
```

**Métriques à surveiller** :

- Ensure text remains visible during webload
- Eliminate render-blocking resources
- Reduce unused CSS

### 2. WebPageTest

[https://www.webpagetest.org/](https://www.webpagetest.org/)

**Vérifier** :

- Waterfall : temps de chargement des polices
- Font display timeline
- CLS causé par les polices

### 3. Chrome DevTools

```
Chrome DevTools → Network → Filter: Font
```

**Analyser** :

- Taille des fichiers WOFF2
- Timing (DNS, TLS, download)
- Headers de cache

---

## Ressources supplémentaires

- [MDN: font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [Web.dev: Best practices for fonts](https://web.dev/font-best-practices/)
- [CSS-Tricks: Font Loading Strategies](https://css-tricks.com/comprehensive-webfonts/)
- [Google Fonts Helper](https://gwfh.mranftl.com/fonts) : Télécharger + subset Google Fonts

---

## Résumé

| Technique              | Impact                | Priorité    |
| ---------------------- | --------------------- | ----------- |
| **WOFF2 format**       | -30% à -50% de taille | 🔴 Critique |
| **font-display: swap** | +10-30 pts Lighthouse | 🔴 Critique |
| **Subsetting**         | -50% à -80% de taille | 🟠 Haute    |
| **Preload critique**   | -200-500ms LCP        | 🟠 Haute    |
| **Preconnect CDN**     | -200-300ms latence    | 🟡 Moyenne  |
| **Self-hosting**       | -1 requête réseau     | 🟡 Moyenne  |

---

**Date de création** : Phase 3 - Assets & Images Optimization
**Dernière mise à jour** : 2025-11-11
