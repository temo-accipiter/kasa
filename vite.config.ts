import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Active le Fast Refresh pour React
      fastRefresh: true,
      // Support JSX runtime automatique
      jsxRuntime: 'automatic',
    }),
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
  },

  // Configuration du build
  build: {
    outDir: 'build',
    sourcemap: true,
    // Optimisation des chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },

  // Configuration CSS/SCSS
  css: {
    // Pas de configuration spécifique pour SCSS
    // Laisse Vite utiliser la configuration par défaut
  },

  // Optimisations des dépendances
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
