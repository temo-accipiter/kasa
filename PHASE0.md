# PHASE 0 - Analyse & Baseline

## 📋 Objectif

Cette phase établit les métriques de base de l'application avant toute optimisation. Elle permet de mesurer l'impact des optimisations futures en comparant les résultats avec ces données de référence.

## 🎯 Livrables

### 1. Configuration d'analyse du bundle

- **Fichier modifié** : `vite.config.ts`
- **Ajout** : Integration de `rollup-plugin-visualizer`
- **Déclenchement** : Variable d'environnement `ANALYZE=true`

### 2. Script d'analyse automatisé

- **Fichier** : `scripts/analysis.sh`
- **Fonctionnalités** :
  - Nettoyage des anciens builds
  - Build Vite avec analyse du bundle
  - Génération de rapports de taille
  - Tentative d'exécution de Lighthouse (optionnel)
  - Génération d'un rapport de synthèse

### 3. Rapports générés

Tous les rapports sont disponibles dans `reports/baseline/` :

- `bundle-stats.html` : Visualisation interactive du bundle (treemap)
- `bundle-size-*.md` : Rapport détaillé des tailles de fichiers
- `build-output-*.log` : Logs de build
- `README.md` : Documentation des rapports

## 📊 Métriques baseline actuelles

### Bundle JavaScript

| Fichier          | Taille  | Taille gzippée | Description                                   |
| ---------------- | ------- | -------------- | --------------------------------------------- |
| `vendor-*.js`    | 187 KiB | 62 KiB         | Dépendances principales (React, React Router) |
| `i18n-*.js`      | 53 KiB  | 18 KiB         | Internationalisation (i18next)                |
| `logements-*.js` | 25 KiB  | 4.1 KiB        | Données des logements                         |
| `index-*.js`     | 14 KiB  | 7.5 KiB        | Point d'entrée principal                      |
| `Apart-*.js`     | 5.2 KiB | 2.5 KiB        | Composant d'appartement                       |
| Autres chunks    | ~3 KiB  | ~2 KiB         | Composants de page                            |

**Total JS** : ~288 KiB (~97 KiB gzippé)

### Bundle CSS

| Fichier       | Taille | Taille gzippée |
| ------------- | ------ | -------------- |
| `index-*.css` | 23 KiB | 4.8 KiB        |

### Taille totale du build

**2.5 MB** (incluant les assets images)

## 🔍 Observations initiales

### Points positifs ✅

1. **Code splitting déjà en place** : Les routes sont séparées en chunks individuels
2. **Vendor chunking** : Les dépendances sont isolées dans un chunk séparé
3. **i18n chunking** : L'internationalisation est dans un chunk dédié
4. **Tailles gzippées acceptables** : La compression est efficace

### Opportunités d'optimisation 🎯

1. **Bundle vendor (187 KiB / 62 KiB gzippé)**

   - Peut être optimisé avec du tree-shaking plus agressif
   - Possibilité de lazy-loading pour certaines dépendances

2. **Bundle i18n (53 KiB / 18 KiB gzippé)**

   - Peut être optimisé en chargeant les langues à la demande
   - Opportunité de lazy-loading des traductions

3. **Assets images (contribuent à ~2.3 MB)**

   - Nécessitent optimisation avec compression moderne (WebP, AVIF)
   - Possibilité d'implémentation de lazy-loading

4. **PWA non implémentée**
   - Pas de service worker
   - Pas de manifest
   - Pas de stratégie de cache

## 🚀 Commandes disponibles

### Exécuter l'analyse complète

```bash
./scripts/analysis.sh
```

### Visualiser le rapport du bundle

```bash
# macOS
open reports/baseline/bundle-stats.html

# Linux
xdg-open reports/baseline/bundle-stats.html

# Windows
start reports/baseline/bundle-stats.html
```

### Build avec analyse (manuel)

```bash
ANALYZE=true yarn build
```

### Exécuter Lighthouse (nécessite Chrome)

```bash
# Terminal 1: Démarrer le serveur preview
yarn preview

# Terminal 2: Exécuter Lighthouse
npx lighthouse http://localhost:4173 \
  --output=html \
  --output=json \
  --output-path=reports/baseline/lighthouse.report \
  --only-categories=performance,accessibility,best-practices,pwa
```

## 📝 Checklist de validation

- [x] rollup-plugin-visualizer installé
- [x] vite.config.ts modifié pour intégrer le plugin
- [x] Script d'analyse créé et exécutable
- [x] Dossier reports/baseline/ créé
- [x] Rapports de bundle générés
- [x] Rapport de synthèse généré
- [x] Documentation créée

## 🔄 Commande de rollback

Si vous souhaitez annuler les modifications de cette phase :

```bash
git checkout HEAD~1 -- vite.config.ts scripts/analysis.sh
yarn remove rollup-plugin-visualizer
rm -rf reports/
```

## ⏭️ Prochaines étapes

Une fois cette phase validée, passez à la **PHASE 1** qui se concentrera sur :

- Configuration Vite optimale
- Optimisation des dépendances
- Configuration du cache
- Gestion des assets modernes

## 📌 Notes importantes

1. **TypeScript check** : Le script d'analyse utilise `vite build` au lieu de `tsc && vite build` pour éviter les erreurs de type dans les fichiers de test. Pour le build de production complet, utilisez `yarn build`.

2. **Lighthouse** : L'analyse Lighthouse nécessite Chrome/Chromium. Dans les environnements CI/CD ou conteneurisés, elle peut échouer. Le script continue même si Lighthouse échoue.

3. **Rapports timestampés** : Chaque exécution génère de nouveaux rapports avec un timestamp. Cela permet de comparer les performances entre différentes versions.

4. **Git** : Les rapports dans `reports/baseline/` peuvent être commités pour tracer l'évolution des métriques, ou ajoutés au `.gitignore` s'ils sont trop volumineux.

## 🆘 Dépannage

### Le script échoue lors du build

- Vérifiez que toutes les dépendances sont installées : `yarn install`
- Vérifiez qu'il n'y a pas d'erreurs de syntaxe dans le code source

### Le visualizer ne génère pas de rapport

- Assurez-vous que la variable `ANALYZE=true` est définie
- Vérifiez les logs dans `reports/baseline/build-output-*.log`

### Lighthouse échoue

- C'est normal dans les environnements sans Chrome
- Suivez les instructions dans le rapport pour l'exécuter localement

---

**Date de création** : 2025-11-11
**Auteur** : Claude Code
**Version** : 1.0
