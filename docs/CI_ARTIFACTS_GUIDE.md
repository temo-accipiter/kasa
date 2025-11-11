# CI Artifacts Interpretation Guide

## 📋 Vue d'ensemble

Ce guide explique comment interpréter les artifacts générés par notre pipeline CI/CD pour identifier les problèmes de performance et prendre des décisions éclairées.

---

## 🎯 Types d'Artifacts

### 1. Bundle Visualizer

**Fichier**: `bundle-visualizer-{sha}.html`

**Description**: Visualisation interactive du bundle JavaScript en treemap.

**Comment l'utiliser**:

1. Télécharger l'artifact depuis GitHub Actions
2. Extraire et ouvrir `bundle-stats.html` dans un navigateur
3. Explorer la treemap interactive

**Que chercher**:

✅ **Good Signs**:

- Vendor chunks bien séparés (react, router, i18n)
- Pas de doublons de dépendances
- Taille des chunks équilibrée

❌ **Red Flags**:

- **Chunk > 200 KB**: Considérer code-splitting
- **Doublons**: Même librairie importée plusieurs fois
- **Heavy dependencies**: Librairies lourdes (Moment.js, Lodash entier)

**Exemple d'analyse**:

```
Treemap showing:
├─ vendor-react (136 KB)    ✅ Good - Core React
├─ vendor-router (11 KB)    ✅ Good - Separated
├─ vendor-i18n (53 KB)      ✅ Good - Can be lazy-loaded
├─ vendor-misc (42 KB)      ⚠️  Check - What's inside?
│  ├─ lodash (30 KB)        ❌ BAD - Use lodash-es or cherry-pick
│  └─ other libs (12 KB)    ✅ OK
└─ app code (25 KB)         ✅ Good - Main app code
```

**Actions**:

```bash
# If you find heavy dependencies:
yarn remove lodash
yarn add lodash-es

# Update imports
import debounce from 'lodash-es/debounce'
```

---

### 2. Bundle Size Report

**Fichier**: `bundle-size-report-{sha}.md`

**Description**: Rapport markdown détaillé des tailles de fichiers.

**Format**:

```markdown
## JavaScript Bundles (Gzipped)

| File                  | Size    | Gzipped |
| --------------------- | ------- | ------- |
| index-BEw90g_i.js     | 48.5 KB | 12.5 KB |
| vendor-react-BoLS.js  | 532 KB  | 136 KB  |
| vendor-router-DfGX.js | 44 KB   | 11 KB   |

## Total Build Size

**Total**: 2.5M
```

**Interprétation**:

| Métrique               | Good     | Warning  | Critical |
| ---------------------- | -------- | -------- | -------- |
| **Index.js**           | < 15 KB  | 15-25 KB | > 25 KB  |
| **Total JS (gzip)**    | < 100 KB | 100-150  | > 150 KB |
| **Total CSS (gzip)**   | < 10 KB  | 10-20 KB | > 20 KB  |
| **Total Build Size**   | < 3 MB   | 3-5 MB   | > 5 MB   |
| **Largest Asset**      | < 200 KB | 200-500  | > 500 KB |
| **Number of JS files** | < 10     | 10-20    | > 20     |

**Actions by Size**:

```bash
# If total JS > 150 KB:
# 1. Check for unnecessary dependencies
yarn why <package-name>

# 2. Use dynamic imports for heavy features
const HeavyComponent = lazy(() => import('./HeavyComponent'))

# 3. Enable tree-shaking
# Check imports are ES modules (import/export, not require)

# 4. Analyze what's inside vendor chunks
ANALYZE=true yarn build
```

---

### 3. Bundle Size Comparison (PR only)

**Visible in**: PR comment

**Description**: Compare les tailles de bundle entre la branche base et la PR.

**Format**:

```markdown
## 📦 Bundle Size Comparison

| Type                     | Base    | PR      | Difference       |
| ------------------------ | ------- | ------- | ---------------- |
| **JavaScript (gzipped)** | 94.2 KB | 96.5 KB | 📈 +2.3 KB (+2%) |
| **CSS (gzipped)**        | 5.0 KB  | 5.1 KB  | 📈 +0.1 KB (+2%) |

⚠️ **Warning**: JavaScript bundle size increased by more than 5 KB!
```

**Interprétation**:

| Increase | Action                                     |
| -------- | ------------------------------------------ |
| < 2 KB   | ✅ Acceptable                              |
| 2-5 KB   | ⚠️ Review - Justify in PR description      |
| 5-10 KB  | ❌ Requires explanation and optimization   |
| > 10 KB  | 🚨 Block PR - Significant issue to address |

**Common Causes**:

1. **New Dependency**: Check if really needed

```bash
# Check what the dependency brings
yarn why new-package
npm view new-package dist.size

# Consider alternatives
# lodash → lodash-es
# moment → date-fns or dayjs
# axios → native fetch
```

2. **Large Asset**: Image not optimized

```bash
# Optimize images
yarn add -D imagemin imagemin-webp

# Use vite-imagetools
import image from './image.jpg?w=800&format=webp'
```

3. **Code Duplication**: Same code in multiple chunks

```bash
# Check for duplication in bundle-visualizer
# Refactor to shared module
```

---

### 4. Lighthouse Reports

**Fichier**: `lighthouse-reports-{sha}/` (folder)

**Description**: Rapports Lighthouse JSON complets.

**Comment l'utiliser**:

1. Télécharger l'artifact
2. Ouvrir `lhr-{timestamp}.html` dans un navigateur
3. Analyser les scores et recommandations

**Lighthouse Scores**:

| Category       | Good | Needs Work | Poor |
| -------------- | ---- | ---------- | ---- |
| Performance    | 90+  | 50-89      | < 50 |
| Accessibility  | 90+  | 50-89      | < 50 |
| Best Practices | 90+  | 50-89      | < 50 |
| SEO            | 90+  | 50-89      | < 50 |

**Performance Métriques**:

| Metric                           | Good    | Needs Work  | Poor    |
| -------------------------------- | ------- | ----------- | ------- |
| **FCP** (First Contentful Paint) | < 1.8s  | 1.8s - 3s   | > 3s    |
| **LCP** (Largest Contentful)     | < 2.5s  | 2.5s - 4s   | > 4s    |
| **TBT** (Total Blocking Time)    | < 200ms | 200ms-600ms | > 600ms |
| **CLS** (Cumulative Layout)      | < 0.1   | 0.1 - 0.25  | > 0.25  |
| **Speed Index**                  | < 3.4s  | 3.4s - 5.8s | > 5.8s  |

**Common Issues & Fixes**:

#### Performance < 90

**Issue**: "Eliminate render-blocking resources"

```html
<!-- Bad -->
<link rel="stylesheet" href="styles.css" />

<!-- Good -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
```

**Issue**: "Unused JavaScript"

```javascript
// Bad: Import everything
import _ from 'lodash';

// Good: Import only what you need
import debounce from 'lodash-es/debounce';
```

**Issue**: "Image elements do not have explicit width and height"

```jsx
// Bad
<img src="image.jpg" alt="Description" />

// Good
<img src="image.jpg" alt="Description" width={800} height={600} />
```

#### Accessibility < 90

**Issue**: "Links do not have a discernible name"

```jsx
// Bad
<Link to="/about">
  <img src="icon.png" />
</Link>

// Good
<Link to="/about" aria-label="About page">
  <img src="icon.png" alt="" />
</Link>
```

**Issue**: "Background and foreground colors do not have sufficient contrast"

```scss
// Bad
color: #888;
background: #fff; // Contrast ratio: 2.85 (FAIL)

// Good
color: #666;
background: #fff; // Contrast ratio: 4.54 (PASS)
```

#### SEO < 90

**Issue**: "Document does not have a meta description"

```jsx
// In your page component
useSEO({
  title: 'Page Title - Kasa',
  description: 'Detailed description for SEO',
});
```

---

### 5. Lighthouse Summary

**Fichier**: `lighthouse-summary-{sha}.md`

**Description**: Résumé rapide des scores Lighthouse.

**Format**:

```markdown
## Lighthouse Scores

| Category       | Score |
| -------------- | ----- |
| Performance    | 87    |
| Accessibility  | 95    |
| Best Practices | 92    |
| SEO            | 98    |
```

**Quick Actions by Score**:

**Performance 75-90**:

- ✅ Good baseline
- 🔍 Review opportunities tab in full report
- 🎯 Target: Image optimization, code splitting

**Performance < 75**:

- ❌ Needs immediate attention
- 🔍 Check diagnostics tab for bottlenecks
- 🎯 Priority: Eliminate blocking resources, reduce unused code

**Accessibility < 90**:

- ❌ Review all issues
- 🔍 Test with screen reader
- 🎯 Fix: Color contrast, ARIA labels, keyboard navigation

---

## 📊 Analyzing Trends

### Week-over-Week Comparison

```bash
# Download artifacts from last 5 builds
# Compare bundle sizes

Week 1: 94 KB
Week 2: 96 KB (+2 KB) ⚠️
Week 3: 98 KB (+2 KB) ⚠️
Week 4: 102 KB (+4 KB) 🚨 ALERT

# Action: Audit recent changes
git log --since="1 month ago" --oneline
```

### Performance Budget

Set budgets in `lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "resource-summary:script:size": ["error", { "maxNumericValue": 150000 }],
        "resource-summary:stylesheet:size": ["error", { "maxNumericValue": 20000 }],
        "resource-summary:image:size": ["warn", { "maxNumericValue": 500000 }]
      }
    }
  }
}
```

---

## 🛠️ Tools & Commands

### Analyze Locally

```bash
# Build with analysis
ANALYZE=true yarn build

# Serve build
npx serve -s build -p 3000

# Run Lighthouse
lighthouse http://localhost:3000 --view

# Bundle size
du -sh build
find build -name "*.js" -exec gzip -c {} \; | wc -c
```

### Compare Branches

```bash
# Build both branches and compare
git checkout main
yarn build
du -sh build > baseline.txt

git checkout feature-branch
yarn build
du -sh build > feature.txt

diff baseline.txt feature.txt
```

### Visualizer Analysis

```bash
# Generate interactive visualizer
ANALYZE=true yarn build

# Open in browser
open reports/phase1/bundle-stats.html

# Check for:
# - Duplicate dependencies (same lib in multiple chunks)
# - Unexpectedly large files
# - Unnecessary includes
```

---

## ✅ Decision Matrix

### Should I Merge This PR?

| Condition                       | Action    | Reason                          |
| ------------------------------- | --------- | ------------------------------- |
| Bundle +0-2 KB, Lighthouse 90+  | ✅ Merge  | Excellent                       |
| Bundle +2-5 KB, Lighthouse 85+  | ⚠️ Review | Acceptable with justification   |
| Bundle +5-10 KB, Lighthouse 80+ | ❌ Block  | Requires optimization           |
| Bundle +10 KB+                  | 🚨 Block  | Significant regression          |
| Lighthouse Performance < 75     | 🚨 Block  | Below acceptable threshold      |
| Lighthouse Accessibility < 90   | ❌ Block  | Accessibility is non-negotiable |

### PR Review Checklist

```markdown
## Performance Review

- [ ] Bundle size increase justified and documented
- [ ] No duplicate dependencies
- [ ] Images optimized (WebP/AVIF)
- [ ] Code-splitting used for heavy features
- [ ] Lighthouse scores above thresholds
- [ ] No accessibility regressions

## If Bundle Size Increased

**Reason**: [Explain why increase is necessary]
**Mitigation**: [What was done to minimize impact]
**Future**: [Plan to reduce size in future PR]
```

---

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Phobia](https://bundlephobia.com/) - Check package sizes
- [Package Phobia](https://packagephobia.com/) - Installed size checker

---

**Last Updated**: 2025-11-11
**Maintained by**: DevOps Team
