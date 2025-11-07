const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runAccessibilityAudit() {
  const reportsDir = path.join(__dirname, '../audit-reports');

  // Créer le dossier des rapports s'il n'existe pas
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  console.log("🚀 Lancement de l'audit d'accessibilité...\n");

  // Lancer le navigateur
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const url = 'http://localhost:3000';
    const pages = [
      { path: '/', name: 'home' },
      { path: '/about', name: 'about' },
    ];

    const results = {};

    for (const page of pages) {
      const pageUrl = `${url}${page.path}`;
      console.log(`\n📊 Audit de la page: ${pageUrl}`);

      const { lhr } = await lighthouse(pageUrl, {
        port: new URL(browser.wsEndpoint()).port,
        output: 'json',
        onlyCategories: ['accessibility'],
        formFactor: 'desktop',
      });

      // Extraire les résultats d'accessibilité
      const accessibilityScore = lhr.categories.accessibility.score * 100;
      const audits = lhr.audits;

      results[page.name] = {
        url: pageUrl,
        score: accessibilityScore,
        audits: {},
      };

      console.log(`✓ Score d'accessibilité: ${accessibilityScore}/100`);

      // Collecter les problèmes
      const issues = [];
      Object.keys(audits).forEach((auditKey) => {
        const audit = audits[auditKey];
        if (audit.score !== null && audit.score < 1) {
          issues.push({
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            impact: audit.details?.impact,
            items: audit.details?.items,
          });
          results[page.name].audits[auditKey] = {
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue,
          };
        }
      });

      console.log(`⚠️  ${issues.length} problèmes d'accessibilité détectés`);
    }

    // Sauvegarder les résultats
    const reportPath = path.join(reportsDir, `audit-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);

    // Générer un résumé
    generateSummary(results, reportsDir, timestamp);

    return results;
  } catch (error) {
    console.error("❌ Erreur lors de l'audit:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

function generateSummary(results, reportsDir, timestamp) {
  let summary = "# 🔍 Rapport d'Audit d'Accessibilité\n\n";
  summary += `**Date**: ${new Date().toLocaleString('fr-FR')}\n\n`;
  summary += '## 📊 Scores par page\n\n';

  Object.keys(results).forEach((pageName) => {
    const page = results[pageName];
    const emoji = page.score >= 90 ? '🟢' : page.score >= 50 ? '🟡' : '🔴';
    summary += `- **${pageName}** ${emoji}: ${page.score}/100\n`;
  });

  summary += '\n## ⚠️ Problèmes détectés\n\n';

  Object.keys(results).forEach((pageName) => {
    const page = results[pageName];
    const issueCount = Object.keys(page.audits).length;

    if (issueCount > 0) {
      summary += `### Page: ${pageName}\n\n`;
      Object.keys(page.audits).forEach((auditKey) => {
        const audit = page.audits[auditKey];
        summary += `- **${audit.title}**\n`;
        summary += `  - Score: ${Math.round(audit.score * 100)}%\n`;
        if (audit.displayValue) {
          summary += `  - Détail: ${audit.displayValue}\n`;
        }
        summary += '\n';
      });
    }
  });

  const summaryPath = path.join(reportsDir, `summary-${timestamp}.md`);
  fs.writeFileSync(summaryPath, summary);
  console.log(`📄 Résumé sauvegardé: ${summaryPath}`);
}

// Exécuter l'audit
runAccessibilityAudit()
  .then(() => {
    console.log('\n✅ Audit terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Échec de l'audit:", error);
    process.exit(1);
  });
