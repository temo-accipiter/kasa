import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { imagetools } from 'vite-imagetools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const shouldAnalyze = process.env.ANALYZE === 'true';

  return {
    plugins: [
      react({
        // Active le Fast Refresh pour React
        fastRefresh: true,
        // Support JSX runtime automatique
        jsxRuntime: 'automatic',
      }),
      // Image optimization avec vite-imagetools
      // Génère automatiquement WebP/AVIF à partir des images sources
      imagetools({
        // Supprime les métadonnées EXIF pour réduire la taille
        removeMetadata: true,
      }),
      // Visualizer pour analyse du bundle (activé via ANALYZE=true)
      ...(shouldAnalyze
        ? [
            visualizer({
              filename: 'reports/phase1/bundle-stats.html',
              open: false,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }) as PluginOption,
            visualizer({
              filename: 'reports/phase1/bundle-stats.json',
              open: false,
              gzipSize: true,
              brotliSize: true,
              template: 'raw-data',
              json: true,
            }) as PluginOption,
          ]
        : []),
    ],

    // Configuration des chemins
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // Configuration du serveur de développement
    server: {
      port: 3000,
      open: true,
      host: true,
      // Amélioration du temps de démarrage
      warmup: {
        clientFiles: ['./src/index.tsx', './src/App.tsx'],
      },
    },

    // Configuration du build
    build: {
      outDir: 'build',
      // Sourcemap conditionnelle : hidden en prod, true en dev
      sourcemap: isProduction ? 'hidden' : true,
      // Target moderne pour réduire les polyfills
      target: 'es2020',
      // Limite d'avertissement de taille de chunk
      chunkSizeWarningLimit: 1000,
      // Minification
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : undefined,
      // Options Rollup
      rollupOptions: {
        output: {
          // Chunking manuel optimisé
          manualChunks: (id) => {
            // React core (le plus stable, très rarement mis à jour)
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }

            // React Router (mis à jour indépendamment de React)
            if (
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')
            ) {
              return 'vendor-router';
            }

            // i18next ecosystem (peut être lazy-loadé)
            if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
              return 'vendor-i18n';
            }

            // Autres dépendances node_modules
            if (id.includes('node_modules')) {
              return 'vendor-misc';
            }
          },
          // Nommage des chunks avec hash pour cache busting
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()
              : 'chunk';
            return `assets/js/[name]-[hash].js`;
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.');
            const ext = info?.[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name ?? '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (ext === 'css') {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      // Amélioration du reporting
      reportCompressedSize: true,
      cssCodeSplit: true,
    },

    // Configuration CSS/SCSS
    css: {
      // Prétraitement SCSS avec configuration optimale
      preprocessorOptions: {
        scss: {
          // Charge automatiquement les variables/mixins si nécessaire
          // additionalData: `@import "@/styles/variables.scss";`
        },
      },
      devSourcemap: !isProduction,
    },

    // Optimisations des dépendances
    optimizeDeps: {
      // Include pour pré-bundler et améliorer le cold start
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'i18next',
        'react-i18next',
        'i18next-browser-languagedetector',
      ],
      // Exclude pour éviter le pré-bundling de modules problématiques
      exclude: [],
      // Utilise esbuild pour la vitesse
      esbuildOptions: {
        target: 'es2020',
      },
    },

    // Configuration esbuild pour le dev
    esbuild: {
      // Optimisations pour production
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },

    // Configuration JSON
    json: {
      stringify: true, // Optimise les gros fichiers JSON
    },
  };
});
