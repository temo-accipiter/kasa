# Release Notes & Rollback Guide

## Vue d'ensemble

Ce document décrit le processus de release, les étapes de validation, et les procédures de rollback en cas de problème.

---

## 📋 Pre-Release Checklist

### 1. Code Review

- [ ] Toutes les PRs sont approuvées par au moins 1 reviewer
- [ ] Tous les commentaires de review sont résolus
- [ ] Le code respecte les conventions du projet
- [ ] Tests unitaires et d'intégration passent
- [ ] Pas de `console.log` ou code de debug restant

### 2. Performance Validation

- [ ] Build successful avec `yarn build`
- [ ] Bundle size analysis reviewed (pas d'augmentation > 10%)
- [ ] Lighthouse CI scores:
  - Performance ≥ 75
  - Accessibility ≥ 90
  - Best Practices ≥ 90
  - SEO ≥ 90
- [ ] Core Web Vitals dans les limites acceptables:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### 3. Manual Testing

- [ ] Test sur navigateurs modernes (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive (mobile, tablet, desktop)
- [ ] Test keyboard navigation
- [ ] Test screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test sur connexion lente (3G throttling)

### 4. Documentation

- [ ] README à jour
- [ ] CHANGELOG.md mis à jour avec les changements
- [ ] Phase documentation complète (PHASE1-6.md)
- [ ] API documentation à jour si applicable

---

## 🚀 Release Process

### Version Numbering

Suivre Semantic Versioning (semver):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features (backward compatible)
- **PATCH** (0.0.x): Bug fixes

**Exemples**:

- `1.0.0` → `1.1.0` : Ajout de PWA support
- `1.1.0` → `1.1.1` : Fix d'un bug d'affichage
- `1.1.1` → `2.0.0` : Changement majeur d'architecture

### Step-by-Step Release

#### 1. Prepare Release Branch

```bash
# Create release branch
git checkout main
git pull origin main
git checkout -b release/v1.2.0

# Update version in package.json
yarn version --new-version 1.2.0

# Update CHANGELOG.md
# Add release notes under ## [1.2.0] - YYYY-MM-DD
```

#### 2. Generate Release Notes

**Template**:

```markdown
## [1.2.0] - 2025-11-11

### ✨ New Features

- Image optimization with WebP/AVIF support (#42)
- Client-side performance monitoring (#45)
- SEO improvements with dynamic meta tags (#46)

### 🐛 Bug Fixes

- Fix focus management on route change (#43)
- Fix card re-rendering issue (#44)

### 🚀 Performance

- Reduced bundle size by 78% for images
- Improved LCP by 52% (-1.3s)
- Reduced re-renders by 30-40% with React.memo

### 📝 Documentation

- Added PHASE3.md (Image optimization)
- Added PHASE5.md (Runtime performance)
- Updated docs/FONTS.md

### ⚠️ Breaking Changes

None

### 🔄 Dependencies

- Added: web-vitals@5.1.0
- Added: vite-imagetools@9.0.0

### 🙏 Contributors

- @contributor1
- @contributor2
```

#### 3. Create Git Tag

```bash
# Commit version bump
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.2.0"

# Create annotated tag
git tag -a v1.2.0 -m "Release version 1.2.0

New Features:
- Image optimization with WebP/AVIF
- Performance monitoring
- SEO improvements

Performance:
- 78% reduction in image sizes
- 52% improvement in LCP
- 30-40% reduction in re-renders"

# Push release branch and tag
git push origin release/v1.2.0
git push origin v1.2.0
```

#### 4. Merge to Main

```bash
# Create PR from release/v1.2.0 to main
gh pr create --base main --head release/v1.2.0 \
  --title "Release v1.2.0" \
  --body "Release notes: see CHANGELOG.md"

# Wait for CI to pass
# Get approval
# Merge PR
```

#### 5. Deploy to Production

**Netlify/Vercel (automatic)**:

```bash
# Deployment triggered automatically on main branch push
# Monitor deployment at:
# - Netlify: https://app.netlify.com/sites/[site-name]/deploys
# - Vercel: https://vercel.com/[user]/[project]/deployments
```

**Manual deployment**:

```bash
# Build production
yarn build

# Test build locally
npx serve -s build -p 3000

# Validate with Lighthouse
lighthouse http://localhost:3000 --view

# Deploy to server
rsync -avz --delete build/ user@server:/var/www/kasa/

# Or use deployment script
./scripts/deploy.sh production
```

#### 6. Post-Deployment Validation

- [ ] Smoke tests on production URL
- [ ] Verify Core Web Vitals in production (3-5 minutes)
- [ ] Check error tracking (Sentry, Bugsnag, etc.)
- [ ] Monitor RUM metrics (Real User Monitoring)
- [ ] Verify analytics are working

#### 7. Announce Release

```bash
# GitHub Release
gh release create v1.2.0 \
  --title "Release v1.2.0" \
  --notes-file CHANGELOG.md \
  --latest

# Optional: Slack/Discord notification
# Optional: Email notification to stakeholders
```

---

## 🔙 Rollback Procedures

### When to Rollback

Rollback immediately if:

- ❌ Critical bug affecting all users
- ❌ Security vulnerability discovered
- ❌ Core Web Vitals degraded > 20%
- ❌ Error rate > 5%
- ❌ Site is down or inaccessible

### Quick Rollback (< 5 minutes)

#### Option 1: Revert Git Tag (Recommended)

```bash
# Identify last good version
git tag --sort=-creatordate | head -5

# Revert to previous version
git checkout v1.1.0

# Build and deploy
yarn build

# Deploy (method depends on your setup)
./scripts/deploy.sh production --force

# Verify deployment
curl -I https://your-domain.com
```

#### Option 2: Revert via Platform

**Netlify**:

1. Go to Deploys tab
2. Find last successful deployment before release
3. Click "Publish deploy"
4. Wait ~30 seconds for deployment

**Vercel**:

1. Go to Deployments
2. Find previous production deployment
3. Click "..." → "Promote to Production"
4. Wait ~30 seconds for deployment

#### Option 3: Git Revert

```bash
# Create revert commit
git revert v1.2.0

# Or revert multiple commits
git revert HEAD~3..HEAD

# Push to main
git push origin main

# This triggers automatic deployment
```

### Detailed Rollback (< 30 minutes)

#### 1. Identify the Issue

```bash
# Check error logs
tail -f /var/log/app.log

# Check monitoring dashboards
# - Error rate
# - Response times
# - Core Web Vitals

# Check user reports
# - Support tickets
# - Social media
```

#### 2. Document the Issue

```markdown
## Rollback Report: v1.2.0

**Date**: 2025-11-11 14:30 UTC
**Rolled back to**: v1.1.0
**Reason**: Critical image loading bug causing blank pages for Safari users

**Impact**:

- Affected users: ~30% (Safari users)
- Duration: 15 minutes
- Error rate: 12%

**Root Cause**:

- WebP images not loading in Safari < 14
- Missing fallback in <picture> element

**Action Items**:

- [ ] Fix Safari compatibility
- [ ] Add browser compatibility tests
- [ ] Update image component with proper fallbacks
```

#### 3. Execute Rollback

```bash
# Option A: Deploy previous version
git checkout v1.1.0
yarn build
./scripts/deploy.sh production --force

# Option B: Revert commits
git revert v1.2.0
git push origin main

# Option C: Hot-fix
git checkout -b hotfix/safari-images
# Make minimal fix
git commit -m "hotfix: add Safari fallback for images"
git push origin hotfix/safari-images
```

#### 4. Verify Rollback

```bash
# Check deployment
curl -I https://your-domain.com

# Verify build version
# Add version endpoint: /api/version
curl https://your-domain.com/api/version

# Monitor for 5-10 minutes
# - Error rate should drop
# - Response times normalize
# - No new issues reported
```

#### 5. Post-Mortem

Create post-mortem document:

```markdown
## Post-Mortem: v1.2.0 Rollback

**Incident Summary**:

- Release v1.2.0 caused image loading failures in Safari
- 30% of users affected
- Rolled back in 15 minutes
- No data loss

**Timeline**:

- 14:00: Deployed v1.2.0
- 14:10: First user reports
- 14:15: Error rate spike detected
- 14:20: Decision to rollback
- 14:25: Rollback completed
- 14:30: Verified recovery

**Root Cause**:

- New Image component used WebP without proper fallback
- Safari < 14 doesn't support WebP
- Testing was done on latest Safari only

**What Went Well**:

- Quick detection (10 minutes)
- Fast rollback (5 minutes)
- Clear rollback procedure

**What Went Wrong**:

- Insufficient browser compatibility testing
- No Safari < 14 in test matrix
- Missing automated browser tests

**Action Items**:

- [ ] Add Safari 13 to CI test matrix
- [ ] Implement automated visual regression tests
- [ ] Update Image component with better fallbacks
- [ ] Add browser compatibility checklist to pre-release
```

---

## 📊 Monitoring & Alerts

### Key Metrics to Monitor

#### 1. Core Web Vitals (Real User Monitoring)

```javascript
// Already implemented in src/utils/metrics.ts
initMetrics({
  enabled: true,
  endpoint: 'https://analytics.your-domain.com/api/metrics',
  sampleRate: 0.1,
});
```

**Alerts**:

- LCP > 2.5s: Warning
- LCP > 4.0s: Critical
- CLS > 0.1: Warning
- CLS > 0.25: Critical
- FID > 100ms: Warning
- FID > 300ms: Critical

#### 2. Error Rate

```bash
# Sentry/Bugsnag example
# Set up alerts for:
# - Error rate > 1%: Warning
# - Error rate > 5%: Critical
```

#### 3. Build Size

```bash
# CI already tracks this
# Alert if:
# - JS bundle increases > 10%
# - Total build size > 5 MB
```

### Monitoring Tools

**Recommended**:

- **Sentry**: Error tracking
- **Google Analytics 4**: User behavior
- **Datadog/New Relic**: APM and RUM
- **Lighthouse CI**: Automated performance tests
- **Vercel Analytics**: Web Vitals tracking

**Configuration**:

```javascript
// src/index.tsx
import * as Sentry from '@sentry/react';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.REACT_APP_VERSION,
    tracesSampleRate: 0.1,
  });
}
```

---

## 🧪 Canary Deployment (Advanced)

For critical changes, use canary deployment:

### 1. Deploy to 10% of users

```bash
# Vercel example
vercel --prod --target canary

# Or use feature flags
# Deploy with CANARY=true environment variable
```

### 2. Monitor for 1-2 hours

- Watch error rates
- Compare Core Web Vitals to baseline
- Check user feedback

### 3. Gradual Rollout

```bash
# Increase to 50%
# Monitor for 1 hour

# Increase to 100%
# Final deployment
```

---

## 📚 Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Google SRE: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)

---

**Last Updated**: 2025-11-11
**Maintained by**: DevOps Team
