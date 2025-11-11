#!/bin/bash

# PHASE 0 - Analyse & Baseline
# Script d'analyse des performances et du bundle
# Génère des rapports dans reports/baseline/

set -e

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

log_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

log_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Fonction pour afficher une section
section() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Variables
REPORT_DIR="reports/baseline"
BUILD_DIR="build"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
PREVIEW_PORT=4173
PREVIEW_URL="http://localhost:${PREVIEW_PORT}"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

section "PHASE 0 - Analyse & Baseline"

log_info "Timestamp: ${TIMESTAMP}"
log_info "Répertoire des rapports: ${REPORT_DIR}"

# 1. Créer le dossier de rapports
section "1. Préparation"

log_info "Création du dossier de rapports..."
mkdir -p "${REPORT_DIR}"
log_success "Dossier créé: ${REPORT_DIR}"

# 2. Nettoyer les anciens builds
log_info "Nettoyage des anciens builds..."
if [ -d "${BUILD_DIR}" ]; then
    rm -rf "${BUILD_DIR}"
    log_success "Build existant supprimé"
fi

# 3. Build avec analyse du bundle
section "2. Build & Analyse du bundle"

log_info "Exécution du build avec analyse..."
log_info "Commande: ANALYZE=true yarn vite build"
log_warning "Note: TypeScript check (tsc) est ignoré pour cette analyse"

if ANALYZE=true yarn vite build > "${REPORT_DIR}/build-output-${TIMESTAMP}.log" 2>&1; then
    log_success "Build terminé avec succès"
else
    log_error "Le build a échoué"
    log_info "Consultez le log: ${REPORT_DIR}/build-output-${TIMESTAMP}.log"
    exit 1
fi

# 4. Analyser la taille des chunks
log_info "Analyse de la taille des chunks..."

if [ -d "${BUILD_DIR}" ]; then
    # Créer un rapport des tailles de fichiers
    {
        echo "# Rapport de taille des fichiers - ${TIMESTAMP}"
        echo ""
        echo "## Assets principaux"
        echo ""
        echo "| Fichier | Taille | Taille compressée (gzip) |"
        echo "|---------|--------|--------------------------|"

        # Analyser les fichiers JS
        find "${BUILD_DIR}" -name "*.js" -type f -exec sh -c '
            file="$1"
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            gzip_size=$(gzip -c "$file" | wc -c)
            printf "| %s | %s | %s |\n" "$(basename "$file")" "$(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size} bytes")" "$(numfmt --to=iec-i --suffix=B $gzip_size 2>/dev/null || echo "${gzip_size} bytes")"
        ' _ {} \;

        echo ""
        echo "## Assets CSS"
        echo ""
        echo "| Fichier | Taille | Taille compressée (gzip) |"
        echo "|---------|--------|--------------------------|"

        # Analyser les fichiers CSS
        find "${BUILD_DIR}" -name "*.css" -type f -exec sh -c '
            file="$1"
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            gzip_size=$(gzip -c "$file" | wc -c)
            printf "| %s | %s | %s |\n" "$(basename "$file")" "$(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size} bytes")" "$(numfmt --to=iec-i --suffix=B $gzip_size 2>/dev/null || echo "${gzip_size} bytes")"
        ' _ {} \;

        echo ""
        echo "## Taille totale du build"
        echo ""
        total_size=$(du -sh "${BUILD_DIR}" | cut -f1)
        echo "Taille totale: **${total_size}**"

    } > "${REPORT_DIR}/bundle-size-${TIMESTAMP}.md"

    log_success "Rapport de taille généré: bundle-size-${TIMESTAMP}.md"
fi

# Vérifier si le rapport de visualisation a été généré
if [ -f "${REPORT_DIR}/bundle-stats.html" ]; then
    log_success "Rapport de visualisation généré: bundle-stats.html"
else
    log_warning "Le rapport de visualisation n'a pas été généré"
fi

# 5. Démarrer le serveur preview
section "3. Lancement de Lighthouse"

log_info "Démarrage du serveur preview..."
yarn preview > /dev/null 2>&1 &
PREVIEW_PID=$!

log_info "PID du serveur: ${PREVIEW_PID}"
log_info "Attente du démarrage du serveur (10 secondes)..."
sleep 10

# Vérifier que le serveur est bien démarré
if ! curl -s "${PREVIEW_URL}" > /dev/null; then
    log_error "Le serveur preview n'a pas démarré correctement"
    kill ${PREVIEW_PID} 2>/dev/null || true
    exit 1
fi

log_success "Serveur preview démarré: ${PREVIEW_URL}"

# 6. Exécuter Lighthouse
log_info "Exécution de Lighthouse..."

# Lighthouse avec options optimales (ne pas échouer si Chrome n'est pas disponible)
LIGHTHOUSE_SUCCESS=false
if npx lighthouse "${PREVIEW_URL}" \
    --output=html \
    --output=json \
    --output-path="${REPORT_DIR}/lighthouse-${TIMESTAMP}" \
    --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
    --only-categories=performance,accessibility,best-practices,pwa \
    --quiet 2>&1; then
    LIGHTHOUSE_SUCCESS=true
    log_success "Analyse Lighthouse terminée"

    # Extraire les scores principaux du JSON
    if [ -f "${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json" ]; then
        log_info "Extraction des scores..."

        {
            echo "# Scores Lighthouse - Baseline - ${TIMESTAMP}"
            echo ""
            echo "## Scores principaux"
            echo ""

            # Utiliser node pour parser le JSON
            node -e "
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.json', 'utf8'));
            const categories = report.categories;

            console.log('| Catégorie | Score |');
            console.log('|-----------|-------|');
            console.log('| Performance | ' + (categories.performance.score * 100).toFixed(0) + '/100 |');
            console.log('| Accessibility | ' + (categories.accessibility.score * 100).toFixed(0) + '/100 |');
            console.log('| Best Practices | ' + (categories['best-practices'].score * 100).toFixed(0) + '/100 |');
            console.log('| PWA | ' + (categories.pwa.score * 100).toFixed(0) + '/100 |');
            console.log('');
            console.log('## Métriques de performance');
            console.log('');
            console.log('| Métrique | Valeur |');
            console.log('|----------|--------|');

            const metrics = report.audits;
            const fcp = metrics['first-contentful-paint'];
            const lcp = metrics['largest-contentful-paint'];
            const tti = metrics['interactive'];
            const si = metrics['speed-index'];
            const tbt = metrics['total-blocking-time'];
            const cls = metrics['cumulative-layout-shift'];

            if (fcp) console.log('| First Contentful Paint (FCP) | ' + fcp.displayValue + ' |');
            if (lcp) console.log('| Largest Contentful Paint (LCP) | ' + lcp.displayValue + ' |');
            if (tti) console.log('| Time to Interactive (TTI) | ' + tti.displayValue + ' |');
            if (si) console.log('| Speed Index | ' + si.displayValue + ' |');
            if (tbt) console.log('| Total Blocking Time (TBT) | ' + tbt.displayValue + ' |');
            if (cls) console.log('| Cumulative Layout Shift (CLS) | ' + cls.displayValue + ' |');
            "
        } > "${REPORT_DIR}/lighthouse-scores-${TIMESTAMP}.md"

        log_success "Scores extraits: lighthouse-scores-${TIMESTAMP}.md"
    fi
else
    log_warning "L'analyse Lighthouse a échoué (Chrome non disponible)"
    log_info "Pour exécuter Lighthouse localement:"
    log_info "  1. Assurez-vous que Chrome/Chromium est installé"
    log_info "  2. Lancez: yarn preview (dans un terminal séparé)"
    log_info "  3. Lancez: npx lighthouse http://localhost:4173 --output=html --output-path=reports/baseline/lighthouse.report.html"
fi

# 7. Arrêter le serveur preview
log_info "Arrêt du serveur preview..."
kill ${PREVIEW_PID} 2>/dev/null || true
log_success "Serveur arrêté"

# 8. Générer un résumé
section "4. Génération du rapport de synthèse"

{
    echo "# PHASE 0 - Rapport de Baseline"
    echo ""
    echo "Date: ${TIMESTAMP}"
    echo ""
    echo "## 📊 Résumé de l'analyse"
    echo ""
    echo "Cette analyse établit les métriques de base avant optimisation."
    echo ""
    echo "## 📁 Fichiers générés"
    echo ""
    echo "### Bundle Analysis"
    echo "- \`bundle-stats.html\` : Visualisation interactive du bundle"
    echo "- \`bundle-size-${TIMESTAMP}.md\` : Rapport détaillé des tailles"
    echo "- \`build-output-${TIMESTAMP}.log\` : Log du build"

    if [ "$LIGHTHOUSE_SUCCESS" = true ]; then
        echo ""
        echo "### Lighthouse Reports"
        echo "- \`lighthouse-${TIMESTAMP}.report.html\` : Rapport Lighthouse complet"
        echo "- \`lighthouse-${TIMESTAMP}.report.json\` : Données JSON Lighthouse"
        echo "- \`lighthouse-scores-${TIMESTAMP}.md\` : Scores extraits"
    else
        echo ""
        echo "### Lighthouse Reports"
        echo "⚠️ Lighthouse n'a pas pu s'exécuter (Chrome non disponible)"
        echo ""
        echo "Pour exécuter Lighthouse localement:"
        echo "\`\`\`bash"
        echo "# Terminal 1: Démarrer le serveur preview"
        echo "yarn preview"
        echo ""
        echo "# Terminal 2: Exécuter Lighthouse"
        echo "npx lighthouse http://localhost:4173 \\"
        echo "  --output=html \\"
        echo "  --output=json \\"
        echo "  --output-path=reports/baseline/lighthouse.report \\"
        echo "  --only-categories=performance,accessibility,best-practices,pwa"
        echo "\`\`\`"
    fi

    echo ""
    echo "## 🔍 Pour consulter les rapports"
    echo ""
    echo "### Visualisation du bundle"
    echo "\`\`\`bash"
    echo "open ${REPORT_DIR}/bundle-stats.html"
    echo "# ou sur Linux:"
    echo "xdg-open ${REPORT_DIR}/bundle-stats.html"
    echo "\`\`\`"

    if [ "$LIGHTHOUSE_SUCCESS" = true ]; then
        echo ""
        echo "### Rapport Lighthouse"
        echo "\`\`\`bash"
        echo "open ${REPORT_DIR}/lighthouse-${TIMESTAMP}.report.html"
        echo "\`\`\`"
        echo ""
        echo "### Scores Lighthouse"
        echo "\`\`\`bash"
        echo "cat ${REPORT_DIR}/lighthouse-scores-${TIMESTAMP}.md"
        echo "\`\`\`"
    fi

    echo ""
    echo "## ✅ Prochaines étapes"
    echo ""
    echo "1. Consultez les rapports générés"
    echo "2. Identifiez les opportunités d'optimisation"
    echo "3. Passez à la PHASE 1 du refactor"
    echo ""
} > "${REPORT_DIR}/README.md"

log_success "Rapport de synthèse généré: README.md"

# 9. Afficher un résumé
section "5. Résumé"

log_success "Analyse terminée !"
echo ""
log_info "📁 Tous les rapports sont disponibles dans: ${REPORT_DIR}"
echo ""
log_info "📊 Fichiers générés:"
ls -lh "${REPORT_DIR}" | tail -n +2 | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
log_info "📖 Consultez ${REPORT_DIR}/README.md pour plus d'informations"
echo ""
log_success "PHASE 0 terminée avec succès !"
