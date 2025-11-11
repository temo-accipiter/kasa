# Guide de Compression pour Production

Ce document explique comment configurer la compression Brotli et Gzip pour optimiser les performances de l'application en production.

## 📊 Bénéfices de la compression

La compression des assets permet de réduire considérablement la taille des fichiers transmis :

| Type de fichier | Sans compression | Avec Gzip | Avec Brotli |
| --------------- | ---------------- | --------- | ----------- |
| JavaScript      | 100%             | ~30-40%   | ~25-35%     |
| CSS             | 100%             | ~20-30%   | ~15-25%     |
| HTML            | 100%             | ~30-40%   | ~25-35%     |
| JSON            | 100%             | ~10-20%   | ~8-15%      |

**Brotli** est généralement 15-25% plus efficace que Gzip pour le contenu textuel.

## 🔧 Configuration par serveur

### Nginx

#### Configuration Gzip

```nginx
# Configuration Gzip
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
  text/plain
  text/css
  text/xml
  text/javascript
  application/json
  application/javascript
  application/xml+rss
  application/rss+xml
  application/atom+xml
  image/svg+xml
  application/x-font-ttf
  application/x-font-opentype
  application/vnd.ms-fontobject;
gzip_min_length 256;
gzip_disable "msie6";
```

#### Configuration Brotli

```nginx
# Installation du module Brotli requise
# Sur Ubuntu/Debian: apt-get install libnginx-mod-http-brotli-filter

brotli on;
brotli_comp_level 6;
brotli_types
  text/plain
  text/css
  text/xml
  text/javascript
  application/json
  application/javascript
  application/xml+rss
  application/rss+xml
  application/atom+xml
  image/svg+xml
  application/x-font-ttf
  application/x-font-opentype
  application/vnd.ms-fontobject;
brotli_static on;
```

#### Configuration complète avec cache

```nginx
server {
  listen 80;
  server_name votre-domaine.com;
  root /var/www/kasa/build;
  index index.html;

  # Compression Gzip
  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_min_length 256;
  gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml;

  # Compression Brotli
  brotli on;
  brotli_comp_level 6;
  brotli_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml application/atom+xml image/svg+xml;

  # Cache des assets avec hash (immutables)
  location ~* ^/assets/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  # Cache des images
  location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|avif)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  # Pas de cache pour index.html
  location / {
    try_files $uri $uri/ /index.html;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires 0;
  }

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### Apache

#### Configuration .htaccess

```apache
# Compression Gzip
<IfModule mod_deflate.c>
  # Compresser HTML, CSS, JavaScript, Text, XML et fonts
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
  AddOutputFilterByType DEFLATE application/x-font
  AddOutputFilterByType DEFLATE application/x-font-opentype
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE application/x-font-truetype
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/otf
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE image/x-icon
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml

  # Enlever les navigateurs problématiques
  BrowserMatch ^Mozilla/4 gzip-only-text/html
  BrowserMatch ^Mozilla/4\.0[678] no-gzip
  BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
  Header append Vary User-Agent
</IfModule>

# Compression Brotli
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css text/javascript
  AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json application/xml application/rss+xml
  AddOutputFilterByType BROTLI_COMPRESS application/x-font-ttf application/x-font-opentype application/vnd.ms-fontobject
  AddOutputFilterByType BROTLI_COMPRESS image/svg+xml
</IfModule>

# Cache des assets
<IfModule mod_expires.c>
  ExpiresActive On

  # Assets avec hash (immutables)
  <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2|ttf|eot)$">
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
  </FilesMatch>

  # HTML (pas de cache)
  <FilesMatch "\.(html|htm)$">
    ExpiresDefault "access plus 0 seconds"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
  </FilesMatch>
</IfModule>
```

### Netlify

Créer un fichier `netlify.toml` à la racine :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    # Security headers
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "no-referrer-when-downgrade"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"

# Netlify active automatiquement Brotli et Gzip
```

### Vercel

Créer un fichier `vercel.json` :

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

Vercel active automatiquement Brotli et Gzip pour tous les assets.

## 🔍 Vérification de la compression

### Via curl

```bash
# Vérifier Gzip
curl -H "Accept-Encoding: gzip" -I https://votre-domaine.com/assets/js/index.js

# Vérifier Brotli
curl -H "Accept-Encoding: br" -I https://votre-domaine.com/assets/js/index.js

# Rechercher le header "Content-Encoding: gzip" ou "Content-Encoding: br"
```

### Via DevTools

1. Ouvrir Chrome DevTools (F12)
2. Aller dans l'onglet Network
3. Recharger la page
4. Cliquer sur un fichier JS/CSS
5. Dans l'onglet Headers, chercher `Content-Encoding`

### Via des outils en ligne

- [GiftOfSpeed](https://www.giftofspeed.com/gzip-test/)
- [CheckGzipCompression](https://checkgzipcompression.com/)

## 📈 Métriques attendues

Après activation de la compression :

- **Réduction de 60-80%** des fichiers JavaScript
- **Réduction de 70-85%** des fichiers CSS
- **Amélioration de 30-50%** du temps de chargement initial
- **Réduction de la bande passante** serveur
- **Amélioration du score Lighthouse** (Performance)

## ⚠️ Notes importantes

1. **Sourcemaps** : Ne pas compresser les sourcemaps en production (configuré via `sourcemap: 'hidden'` dans vite.config.ts)

2. **Niveau de compression** :

   - Gzip : niveau 6 (bon compromis vitesse/taille)
   - Brotli : niveau 6-8 (selon charge serveur)

3. **Fichiers déjà compressés** : Ne pas compresser les images JPEG, PNG, MP4, etc. (déjà optimisés)

4. **Navigateurs anciens** : Désactiver la compression pour IE6 et versions similaires

5. **Taille minimum** : Ne compresser que les fichiers > 256 bytes pour éviter l'overhead

## 🚀 Prochaines étapes

1. Configurer votre serveur avec la compression appropriée
2. Activer le cache des assets hashed
3. Tester avec les outils mentionnés
4. Monitorer les métriques de performance
5. Ajuster les niveaux de compression selon la charge serveur

---

**Dernière mise à jour** : 2025-11-11
**Version** : 1.0
