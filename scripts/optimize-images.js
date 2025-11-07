const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const assetsDir = path.join(__dirname, '../src/assets');
  const originalSizes = {};
  const optimizedSizes = {};

  console.log('🖼️  Optimisation des images en cours...\n');

  // Lire tous les fichiers PNG
  const files = fs.readdirSync(assetsDir).filter((file) => /\.(png|jpg|jpeg)$/i.test(file));

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    originalSizes[file] = stats.size;

    // Créer un fichier temporaire
    const tempPath = path.join(assetsDir, `temp_${file}`);

    try {
      if (file.endsWith('.png')) {
        // Optimiser les PNG
        await sharp(filePath)
          .png({
            quality: 80,
            compressionLevel: 9,
            adaptiveFiltering: true,
          })
          .toFile(tempPath);
      } else {
        // Optimiser les JPEG
        await sharp(filePath)
          .jpeg({
            quality: 80,
            progressive: true,
          })
          .toFile(tempPath);
      }

      // Remplacer l'original par la version optimisée
      fs.renameSync(tempPath, filePath);

      const newStats = fs.statSync(filePath);
      optimizedSizes[file] = newStats.size;
    } catch (err) {
      console.error(`Erreur avec ${file}:`, err.message);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  // Afficher les résultats
  console.log("📊 Résultats de l'optimisation:\n");
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of Object.keys(originalSizes)) {
    const original = originalSizes[file];
    const optimized = optimizedSizes[file] || original;
    const saved = original - optimized;
    const percent = original > 0 ? ((saved / original) * 100).toFixed(1) : 0;

    totalOriginal += original;
    totalOptimized += optimized;

    console.log(`${file}:`);
    console.log(`  Avant:  ${(original / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Après:  ${(optimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Économie: ${(saved / 1024 / 1024).toFixed(2)} MB (${percent}%)\n`);
  }

  const totalSaved = totalOriginal - totalOptimized;
  const totalPercent = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0;

  console.log('📈 TOTAL:');
  console.log(`  Avant:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Après:  ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Économie: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${totalPercent}%)`);
  console.log(`\n✅ Optimisation terminée! ${files.length} images optimisées.`);
}

optimizeImages().catch((err) => {
  console.error("❌ Erreur lors de l'optimisation:", err);
  process.exit(1);
});
