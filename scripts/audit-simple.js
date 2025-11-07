const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Créer le dossier des rapports
const reportsDir = path.join(__dirname, '../audit-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const buildDir = path.join(__dirname, '../build');

console.log("🔍 Audit d'accessibilité Kasa\n");

// Vérifier si build existe
if (!fs.existsSync(buildDir)) {
  console.log('📦 Build non trouvé, lancement du build...');
  execSync('yarn build', { stdio: 'inherit' });
}

console.log('🚀 Démarrage du serveur de production...\n');

// Démarrer un serveur simple pour le build
const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const serve = serveStatic(buildDir);
const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

const PORT = 3456;
server.listen(PORT, () => {
  console.log(`✓ Serveur démarré sur http://localhost:${PORT}\n`);

  // Attendre que le serveur soit prêt
  setTimeout(() => {
    runAudits();
  }, 2000);
});

function runAudits() {
  const pages = [
    { url: `http://localhost:${PORT}/`, name: 'home' },
    { url: `http://localhost:${PORT}/about`, name: 'about' },
  ];

  const results = {};

  pages.forEach((page) => {
    console.log(`📊 Audit: ${page.name} (${page.url})`);

    const outputPath = path.join(reportsDir, `lighthouse-${page.name}-${timestamp}.json`);

    try {
      // Exécuter Lighthouse avec focus sur l'accessibilité
      execSync(
        `npx lighthouse "${page.url}" --output=json --output-path="${outputPath}" --only-categories=accessibility --chrome-flags="--headless --no-sandbox" --quiet`,
        { stdio: 'inherit' }
      );

      // Lire les résultats
      const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      const accessibilityScore = Math.round(report.categories.accessibility.score * 100);

      results[page.name] = {
        url: page.url,
        score: accessibilityScore,
        audits: {},
      };

      console.log(`✓ Score: ${accessibilityScore}/100\n`);

      // Collecter les problèmes
      Object.keys(report.audits).forEach((auditKey) => {
        const audit = report.audits[auditKey];
        if (audit.score !== null && audit.score < 1 && audit.id !== 'structured-data') {
          results[page.name].audits[auditKey] = {
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            details: audit.details,
          };
        }
      });
    } catch (error) {
      console.error(`❌ Erreur lors de l'audit de ${page.name}:`, error.message);
    }
  });

  // Générer le résumé
  generateSummary(results, timestamp);

  // Arrêter le serveur
  server.close(() => {
    console.log('\n✅ Audit terminé!\n');
    process.exit(0);
  });
}

function generateSummary(results, timestamp) {
  let summary = "# 🔍 Rapport d'Audit d'Accessibilité - Kasa\n\n";
  summary += `**Date**: ${new Date().toLocaleString('fr-FR')}\n\n`;
  summary += '---\n\n';
  summary += '## 📊 Scores par page\n\n';

  let totalIssues = 0;

  Object.keys(results).forEach((pageName) => {
    const page = results[pageName];
    const emoji = page.score >= 90 ? '🟢' : page.score >= 50 ? '🟡' : '🔴';
    const issueCount = Object.keys(page.audits).length;
    totalIssues += issueCount;

    summary += `### ${emoji} ${pageName.toUpperCase()}\n\n`;
    summary += `- **Score d'accessibilité**: ${page.score}/100\n`;
    summary += `- **Problèmes détectés**: ${issueCount}\n`;
    summary += `- **URL**: ${page.url}\n\n`;
  });

  summary += `\n**Total des problèmes**: ${totalIssues}\n\n`;
  summary += '---\n\n';
  summary += '## ⚠️ Détails des problèmes\n\n';

  Object.keys(results).forEach((pageName) => {
    const page = results[pageName];
    const issueCount = Object.keys(page.audits).length;

    if (issueCount > 0) {
      summary += `### 📄 Page: ${pageName}\n\n`;

      Object.values(page.audits).forEach((audit, index) => {
        summary += `#### ${index + 1}. ${audit.title}\n\n`;
        summary += `- **ID**: \`${audit.id}\`\n`;
        summary += `- **Score**: ${Math.round(audit.score * 100)}%\n`;
        summary += `- **Description**: ${audit.description}\n\n`;

        // Ajouter des détails si disponibles
        if (audit.details && audit.details.items && audit.details.items.length > 0) {
          summary += '**Éléments concernés**:\n';
          audit.details.items.slice(0, 3).forEach((item) => {
            if (item.node) {
              summary += `- \`${item.node.snippet || item.node.selector || 'N/A'}\`\n`;
            }
          });
          if (audit.details.items.length > 3) {
            summary += `- ... et ${audit.details.items.length - 3} autre(s)\n`;
          }
          summary += '\n';
        }
      });

      summary += '\n';
    }
  });

  summary += '---\n\n';
  summary += '## 📋 Recommandations générales\n\n';
  summary += '- Vérifier tous les contrastes de couleurs (ratio minimum 4.5:1)\n';
  summary += '- Ajouter des labels ARIA appropriés\n';
  summary += "- S'assurer que tous les éléments interactifs sont accessibles au clavier\n";
  summary += '- Utiliser des balises sémantiques HTML appropriées\n';
  summary += '- Fournir des alternatives textuelles pour les images\n';
  summary += "- Tester avec des lecteurs d'écran (NVDA, JAWS, VoiceOver)\n\n";

  const summaryPath = path.join(reportsDir, `AUDIT-INITIAL-${timestamp}.md`);
  fs.writeFileSync(summaryPath, summary);
  console.log(`\n📄 Résumé sauvegardé: ${summaryPath}`);

  // Sauvegarder aussi les données JSON
  const jsonPath = path.join(reportsDir, `audit-data-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`📄 Données JSON: ${jsonPath}`);
}
