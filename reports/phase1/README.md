# PHASE 1 - Rapports d'analyse du bundle

Date : 2025-11-11

## 📁 Fichiers disponibles

### bundle-stats.html

Visualisation interactive du bundle sous forme de treemap.

**Comment utiliser** :

```bash
# macOS
open bundle-stats.html

# Linux
xdg-open bundle-stats.html

# Windows
start bundle-stats.html
```

**Fonctionnalités** :

- Vue hiérarchique des dépendances
- Tailles réelles et gzippées
- Tailles Brotli
- Navigation interactive
- Recherche de modules

### bundle-stats.json

Données brutes de l'analyse au format JSON.

**Comment utiliser** :

```bash
# Afficher joliment avec jq
cat bundle-stats.json | jq

# Extraire des métriques spécifiques
cat bundle-stats.json | jq '.groups'
```

## 📊 Résumé des métriques

### Chunks JavaScript

| Chunk         | Taille     | Gzippé    | Brotli   |
| ------------- | ---------- | --------- | -------- |
| vendor-react  | 136.75 KiB | 44.03 KiB | ~38 KiB  |
| vendor-i18n   | 53.01 KiB  | 16.70 KiB | ~14 KiB  |
| vendor-misc   | 41.94 KiB  | 14.58 KiB | ~12 KiB  |
| vendor-router | 11.31 KiB  | 4.14 KiB  | ~3.5 KiB |
| logements     | 25.21 KiB  | 4.10 KiB  | ~3.5 KiB |
| index         | 12.93 KiB  | 7.01 KiB  | ~6 KiB   |
| Apart         | 5.30 KiB   | 2.49 KiB  | ~2 KiB   |
| Autres        | ~3 KiB     | ~1.5 KiB  | ~1.2 KiB |

**Total JS** : ~289 KiB (non compressé) / ~94 KiB (gzippé) / ~80 KiB (brotli estimé)

### CSS

| Fichier   | Taille    | Gzippé   |
| --------- | --------- | -------- |
| index.css | 23.38 KiB | 4.87 KiB |

## 📈 Comparaison avec baseline

| Métrique                | Baseline (Phase 0) | Phase 1   | Amélioration          |
| ----------------------- | ------------------ | --------- | --------------------- |
| Total JS gzippé         | 97 KiB             | 94 KiB    | **-3.1%**             |
| Nombre de chunks vendor | 2                  | 4         | Meilleure granularité |
| vendor-i18n gzippé      | 18 KiB             | 16.70 KiB | **-7.2%**             |
| index gzippé            | 7.5 KiB            | 7.01 KiB  | **-6.5%**             |

## 🎯 Points clés

### ✅ Améliorations

1. **Chunking stratégique** : 4 chunks vendor au lieu de 2

   - vendor-react : Très stable, rarement invalidé
   - vendor-router : Mis à jour indépendamment
   - vendor-i18n : Candidat au lazy-loading (Phase 2)
   - vendor-misc : Autres dépendances

2. **Taille réduite** : 3.1% de réduction du bundle gzippé

3. **Cache optimisé** : Invalidation plus granulaire

4. **Code propre** : Console.log supprimés en production

5. **Sécurité** : Sourcemaps cachées

### 🔮 Opportunités (Phase 2)

1. **Lazy-loading i18n** : Économiser ~17 KiB gzippé au chargement initial
2. **Lazy-loading des routes** : Réduire le bundle initial de 30-50%
3. **Optimisation des images** : WebP/AVIF, lazy-loading
4. **Tree-shaking agressif** : Analyser les imports inutilisés

## 🔍 Analyse détaillée

### vendor-react (136.75 KiB / 44.03 KiB gzippé)

**Contenu** :

- react : Core library
- react-dom : DOM renderer
- scheduler : React internal

**Stabilité** : ⭐⭐⭐⭐⭐ (Très stable, changements mineurs entre versions)

**Recommandation** : Cache long terme (1 an)

### vendor-router (11.31 KiB / 4.14 KiB gzippé)

**Contenu** :

- react-router
- react-router-dom

**Stabilité** : ⭐⭐⭐⭐ (Mises à jour régulières mais stables)

**Recommandation** : Cache moyen terme (3-6 mois)

### vendor-i18n (53.01 KiB / 16.70 KiB gzippé)

**Contenu** :

- i18next : Core
- react-i18next : React bindings
- i18next-browser-languagedetector : Détection de langue

**Opportunité** : Lazy-loading des traductions (Phase 2)

**Recommandation** : Candidat prioritaire pour lazy-loading

### vendor-misc (41.94 KiB / 14.58 KiB gzippé)

**Contenu** : Diverses dépendances non critiques

**Action recommandée** : Analyser et potentiellement lazy-loader

## 📚 Ressources

- [Documentation Vite - Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [Documentation Rollup - Manual Chunks](https://rollupjs.org/guide/en/#outputmanualchunks)
- [Web.dev - Code Splitting](https://web.dev/code-splitting/)

## ⏭️ Prochaine étape

Consulter `PHASE1.md` à la racine du projet pour les détails complets et passer à la PHASE 2.

---

**Généré le** : 2025-11-11
**Par** : scripts/analysis.sh (Phase 1)
