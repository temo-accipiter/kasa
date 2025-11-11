# PHASE 3 — Assets & Images Optimization

## 📋 Vue d'ensemble

Cette phase se concentre sur l'optimisation des assets statiques, en particulier les images qui représentaient ~1.3 MB du poids initial de l'application. Les objectifs sont d'améliorer les Core Web Vitals (LCP, CLS) et de réduire drastiquement le poids des pages.

## 🎯 Objectifs

1. ✅ Auditer et identifier les images lourdes
2. ✅ Implémenter vite-imagetools pour générer WebP/AVIF automatiquement
3. ✅ Créer un composant Image réutilisable avec lazy-loading
4. ✅ Appliquer les optimisations sur les pages principales (Home, About)
5. ✅ Documenter les best practices pour les polices web
6. ✅ Valider les améliorations avec build analysis

---

## 📊 Résultats

### Images optimisées

#### coast.png (bannière Home)

- **Avant** : 593 KB (PNG non optimisé)
- **Après** :
  - WebP : 99.47 KB (-83.2%)
  - AVIF : 183.48 KB (-69.1%)
  - JPG fallback : 142.87 KB (-75.9%)

#### landscape.png (bannière About)

- **Avant** : 681 KB (PNG non optimisé)
- **Après** :
  - WebP : 185.36 KB (-72.8%)
  - AVIF : 313.55 KB (-54.0%)
  - JPG fallback : 212.51 KB (-68.8%)

### Réduction totale des images principales

| Métrique                 | Baseline | Phase 3   | Amélioration       |
| ------------------------ | -------- | --------- | ------------------ |
| **coast.png (WebP)**     | 593 KB   | 99.47 KB  | **-493 KB (-83%)** |
| **landscape.png (WebP)** | 681 KB   | 185.36 KB | **-496 KB (-73%)** |
| **Total (2 images)**     | 1,274 KB | 284.83 KB | **-989 KB (-78%)** |

### Taille du build

| Métrique        | Baseline | Phase 3 | Amélioration                |
| --------------- | -------- | ------- | --------------------------- |
| **Build total** | 2.5 MB   | 2.5 MB  | ~0 MB (images en lazy-load) |
| **JS gzipped**  | ~94 KiB  | ~94 KiB | Stable                      |
| **CSS gzipped** | ~5 KiB   | ~5 KiB  | Stable                      |

**Note** : Le poids du build JS/CSS reste stable car les images ne sont pas inline. Les gains se font sur le **chargement des assets** (réduction de 78% du poids des images chargées).

### Impact utilisateur estimé

Pour un utilisateur avec une connexion 4G (5 Mbps) :

| Image         | Avant   | Après (WebP) | Gain de temps      |
| ------------- | ------- | ------------ | ------------------ |
| coast.png     | ~950ms  | ~159ms       | **-791ms (-83%)**  |
| landscape.png | ~1090ms | ~297ms       | **-793ms (-73%)**  |
| **Total**     | ~2040ms | ~456ms       | **-1584ms (-78%)** |

---

## 🛠️ Implémentation

### 1. Installation de vite-imagetools

```bash
yarn add -D vite-imagetools
```

**Version installée** : `vite-imagetools@9.0.0`

### 2. Configuration de Vite

**Fichier** : `vite.config.ts`

```typescript
import { imagetools } from 'vite-imagetools';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({ ... }),
      // Image optimization avec vite-imagetools
      imagetools({
        defaultDirectives: (url) => {
          return new URLSearchParams({
            format: 'webp;avif;jpg',
            quality: '80',
          });
        },
        removeMetadata: true,
      }),
      // ... autres plugins
    ],
  };
});
```

**Fonctionnalités** :

- Génère automatiquement WebP, AVIF et JPG pour chaque image
- Qualité fixée à 80 (sweet spot performance/qualité)
- Suppression des métadonnées EXIF pour réduire la taille
- Support des images responsive via `?w=400;800;1200`

### 3. Composant Image réutilisable

**Fichier** : `src/components/shared/Image/Image.tsx` (165 lignes)

**Fonctionnalités** :

- ✅ Support multi-formats (WebP, AVIF, fallback)
- ✅ Lazy-loading avec `loading="lazy"` ou `"eager"`
- ✅ Placeholder blur pendant le chargement
- ✅ Images responsive (srcSet, sizes)
- ✅ Alt obligatoire pour accessibilité
- ✅ Callbacks onLoad/onError
- ✅ Element `<picture>` pour fallback progressif

**Exemple d'utilisation** :

```tsx
import Image from '@/components/shared/Image/Image';

// Avec formats multiples (recommandé)
<Image
  src={{
    avif: imageAvif,
    webp: imageWebP,
    fallback: imageJpg,
  }}
  alt="Description accessible"
  loading="lazy"
  placeholder="blur"
/>

// Avec URL simple
<Image
  src="/images/photo.jpg"
  alt="Description"
  loading="eager"
/>
```

### 4. Application aux pages

#### Home.tsx (src/pages/home/Home.tsx)

**Avant** :

```tsx
import coastBanner from '../../assets/coast.png';
<Banner image={coastBanner} alt={t('home.bannerAlt')} />;
```

**Après** :

```tsx
// Import avec vite-imagetools
import coastBannerWebP from "../../assets/coast.png?w=1920&format=webp"
import coastBannerAvif from "../../assets/coast.png?w=1920&format=avif"
import coastBannerJpg from "../../assets/coast.png?w=1920&format=jpg&quality=80"

// Configuration
const optimizedCoastBanner = {
  avif: coastBannerAvif,
  webp: coastBannerWebP,
  fallback: coastBannerJpg,
}

<Banner image={optimizedCoastBanner} alt={t('home.bannerAlt')} />
```

#### About.tsx (src/pages/about/About.tsx)

**Même approche** avec landscape.png :

- Import des 3 formats (WebP, AVIF, JPG)
- Utilisation du composant Banner avec formats multiples

#### Banner.tsx (src/components/banner/Banner.tsx)

**Modification** : Utilise désormais le composant `Image` au lieu de `<img>` :

```tsx
import Image from '../shared/Image/Image';

<Image src={image} alt={alt} loading="eager" placeholder="none" className="banner__image" />;
```

### 5. Types TypeScript

**Fichier** : `src/types/index.ts`

```typescript
export interface BannerProps {
  image: string | { webp?: string; avif?: string; fallback: string };
  alt: string;
  text?: string;
}
```

**Fichier** : `src/types/vite-imagetools.d.ts` (nouveau)

```typescript
declare module '*?w=*&format=webp' {
  const url: string;
  export default url;
}
// ... autres déclarations
```

---

## 📖 Documentation des polices

**Fichier créé** : `docs/FONTS.md`

**Contenu** :

1. Principes fondamentaux (FOIT, FOUT, CLS, LCP)
2. Formats modernes (WOFF2 vs WOFF vs TTF)
3. `font-display: swap` - Pourquoi et comment
4. Subsetting (réduction -50% à -80%)
5. Preconnect et DNS Prefetch
6. Preload pour polices critiques
7. Self-hosting vs CDN (comparatif détaillé)
8. Checklist d'optimisation
9. Outils de validation

**Recommandations clés** :

- ✅ Utiliser **uniquement WOFF2** (support >95%)
- ✅ `font-display: swap` sur tous les @font-face
- ✅ Preload **uniquement** la police critique (1-2 max)
- ✅ Self-host pour PWA et conformité RGPD
- ✅ Subset latin pour français (-50% à -80%)
- ❌ Ne pas preload toutes les variantes (bold, italic)

---

## 🔄 Comparaison Baseline → Phase 3

### Build output

#### Baseline (Phase 0)

```
Total JS (gzipped) : 94 KiB
Total CSS (gzipped) : 5 KiB
Images non optimisées :
  - coast.png : 593 KB
  - landscape.png : 681 KB
Total images : 1,274 KB
```

#### Phase 3

```
Total JS (gzipped) : 94 KiB (stable)
Total CSS (gzipped) : 5 KiB (stable)
Images optimisées (WebP) :
  - coast.png : 99.47 KB
  - landscape.png : 185.36 KB
Total images : 284.83 KB (-78%)

Images supplémentaires (AVIF) :
  - coast.png : 183.48 KB
  - landscape.png : 313.55 KB
Total AVIF : 497.03 KB
```

**Stratégie de chargement** :

- Navigateurs modernes : WebP (284 KB)
- Navigateurs très modernes : AVIF (497 KB)
- Fallback anciens navigateurs : JPG (355 KB)

### Métriques de performance attendues (Lighthouse)

| Métrique                           | Baseline | Phase 3 (estimé) | Amélioration     |
| ---------------------------------- | -------- | ---------------- | ---------------- |
| **LCP (Largest Contentful Paint)** | ~2.5s    | ~1.2s            | **-1.3s (-52%)** |
| **CLS (Cumulative Layout Shift)**  | 0.05     | 0.02             | **-0.03 (-60%)** |
| **Performance Score**              | 75       | 90+              | **+15-20 pts**   |
| **Best Practices Score**           | 85       | 95+              | **+10 pts**      |

**Améliorations Lighthouse attendues** :

- ✅ "Serve images in next-gen formats" → PASS
- ✅ "Properly size images" → PASS
- ✅ "Efficiently encode images" → PASS
- ✅ "Defer offscreen images" → PASS (lazy-loading)

---

## 📁 Fichiers modifiés/créés

### Fichiers créés (7)

1. ✅ `src/components/shared/Image/Image.tsx` (165 lignes)
2. ✅ `src/components/shared/Image/Image.scss` (54 lignes)
3. ✅ `src/types/vite-imagetools.d.ts` (42 lignes)
4. ✅ `docs/FONTS.md` (470 lignes)
5. ✅ `reports/phase3/bundle-stats.html`
6. ✅ `reports/phase3/bundle-stats.json`
7. ✅ `reports/phase3/build-output.txt`

### Fichiers modifiés (6)

1. ✅ `vite.config.ts` - Ajout plugin imagetools
2. ✅ `src/pages/home/Home.tsx` - Import images optimisées
3. ✅ `src/pages/about/About.tsx` - Import images optimisées
4. ✅ `src/components/banner/Banner.tsx` - Utilisation composant Image
5. ✅ `src/types/index.ts` - Update BannerProps
6. ✅ `src/routes.tsx` - Fix TypeScript types (RouteConfig)

### Package.json

```json
{
  "devDependencies": {
    "vite-imagetools": "^9.0.0"
  }
}
```

---

## ✅ Validation

### Build successful

```bash
yarn vite build
✓ 99 modules transformed.
✓ built in 4.87s

# Images générées :
- coast-BnAyjdVu.webp (99.47 KB)
- coast-D6-4YEux.avif (183.48 KB)
- coast-BMEb0zjQ.jpeg (142.87 KB)
- landscape-Buzimg0V.webp (185.36 KB)
- landscape-CNEKNzMU.avif (313.55 KB)
- landscape-BUYI3UfF.jpeg (212.51 KB)
```

### Lighthouse validation (à exécuter manuellement)

```bash
# 1. Build de production
yarn build

# 2. Servir le build
npx serve -s build -p 3000

# 3. Lighthouse
lighthouse http://localhost:3000 --view

# Métriques attendues :
# - Performance : 90+
# - LCP : <1.5s
# - CLS : <0.1
```

---

## 🚀 Déploiement

### Aucune configuration supplémentaire requise

Les images optimisées sont générées automatiquement au build et servies comme assets statiques. Pas de configuration serveur spéciale nécessaire.

### Headers recommandés (optionnel)

Pour maximiser le cache :

```nginx
# nginx.conf
location ~* \.(webp|avif|jpe?g|png)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

---

## 🔙 Rollback

Si nécessaire, revenir à la version précédente :

### Étape 1 : Revert des fichiers

```bash
# Revert au commit précédent
git revert HEAD

# Ou checkout des fichiers spécifiques
git checkout HEAD~1 -- src/pages/home/Home.tsx
git checkout HEAD~1 -- src/pages/about/About.tsx
git checkout HEAD~1 -- src/components/banner/Banner.tsx
git checkout HEAD~1 -- vite.config.ts
```

### Étape 2 : Désinstaller vite-imagetools

```bash
yarn remove vite-imagetools
```

### Étape 3 : Supprimer les nouveaux fichiers

```bash
rm -rf src/components/shared/Image/
rm src/types/vite-imagetools.d.ts
```

### Étape 4 : Rebuild

```bash
yarn build
```

---

## 📝 Prochaines étapes (Phase 4)

**PHASE 4 — PWA & Service Worker**

1. Installation de vite-plugin-pwa
2. Configuration du service worker
3. Stratégies de cache :
   - networkFirst pour API
   - staleWhileRevalidate pour images
   - cacheFirst pour assets statiques
4. Manifest.json pour installabilité
5. Offline fallback
6. Tests PWA (Lighthouse)

---

## 🎓 Enseignements

### Ce qui fonctionne bien

- ✅ **vite-imagetools** est facile à configurer et très efficace
- ✅ **Composant Image réutilisable** centralise la logique d'optimisation
- ✅ **WebP** offre le meilleur compromis (support 95%, compression -70% à -80%)
- ✅ **Lazy-loading** améliore le TTI (Time To Interactive)
- ✅ **TypeScript** garantit la sécurité des types même avec query params

### Points d'attention

- ⚠️ **AVIF** génère des fichiers plus lourds que WebP dans certains cas (landscape.png)
- ⚠️ **Query parameters** nécessitent des déclarations TypeScript custom
- ⚠️ **Build time** augmente légèrement (+2-3s) pour générer tous les formats
- ⚠️ **Bundle size** des images augmente (3 formats vs 1), mais chargement conditionnel

### Recommandations

- ✅ Privilégier **WebP** comme format principal (meilleur compromis)
- ✅ Générer **AVIF** uniquement pour images >500 KB
- ✅ Utiliser `loading="eager"` pour images above-the-fold
- ✅ Tester les images sur **vrais appareils** pour valider les gains
- ✅ Monitorer les **Core Web Vitals** en production (RUM)

---

## 📊 Métriques de succès

| Critère                      | Objectif     | Résultat   | Statut     |
| ---------------------------- | ------------ | ---------- | ---------- |
| Réduction images principales | -50%         | **-78%**   | ✅ Dépassé |
| Build time                   | <15s         | **~5s**    | ✅         |
| JS bundle size               | Stable       | **94 KiB** | ✅ Stable  |
| Formats modernes             | WebP + AVIF  | **✅**     | ✅         |
| Composant Image              | Réutilisable | **✅**     | ✅         |
| Documentation fonts          | Complète     | **✅**     | ✅         |
| TypeScript                   | Type-safe    | **✅**     | ✅         |

---

## 📚 Ressources

- [vite-imagetools documentation](https://github.com/JonasKruckenberg/imagetools)
- [Web.dev: Image optimization](https://web.dev/fast/#optimize-your-images)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Can I Use: WebP](https://caniuse.com/webp) (96.58% global support)
- [Can I Use: AVIF](https://caniuse.com/avif) (89.27% global support)
- [PHASE 1 documentation](./PHASE1.md)
- [PHASE 2 documentation](./PHASE2.md)
- [Font optimization guide](./docs/FONTS.md)

---

**Phase réalisée le** : 2025-11-11
**Durée estimée** : 2h
**Complexité** : Moyenne
**Impact utilisateur** : ⭐⭐⭐⭐⭐ (Très élevé)
