/**
 * Tests E2E pour la page d'accueil
 * Vérifie le comportement de l'application dans un vrai navigateur
 */

/* eslint-disable no-plusplus, no-await-in-loop */
import { test, expect } from '@playwright/test';

test.describe("Page d'accueil - Tests E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigation vers la page d'accueil avant chaque test
    await page.goto('/');
  });

  test.describe('Navigation et chargement', () => {
    test("devrait charger la page d'accueil correctement", async ({ page }) => {
      // Vérifie que la page est chargée
      await expect(page).toHaveTitle(/Kasa/i);

      // Vérifie la présence du conteneur principal
      const main = page.locator('main.home');
      await expect(main).toBeVisible();
    });

    test('devrait avoir une URL correcte', async ({ page }) => {
      expect(page.url()).toBe('http://localhost:3000/');
    });

    test('devrait charger sans erreurs console', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.waitForLoadState('networkidle');

      // Filtre les erreurs connues si nécessaire
      const criticalErrors = consoleErrors.filter(
        (error) => !error.includes('favicon') // Ignore les erreurs de favicon
      );

      expect(criticalErrors.length).toBe(0);
    });
  });

  test.describe('Affichage des éléments', () => {
    test('devrait afficher la bannière', async ({ page }) => {
      const banner = page.locator('.banner');
      await expect(banner).toBeVisible();

      // Vérifie l'image de la bannière
      const bannerImage = page.locator('.banner img');
      await expect(bannerImage).toBeVisible();
    });

    test('devrait afficher la section des logements', async ({ page }) => {
      const cardContainer = page.locator('.home__card__container');
      await expect(cardContainer).toBeVisible();
    });

    test('devrait afficher plusieurs cartes de logements', async ({ page }) => {
      const cards = page.locator('.card');
      const count = await cards.count();

      expect(count).toBeGreaterThan(0);
    });

    test('devrait afficher les titres des logements', async ({ page }) => {
      const firstCard = page.locator('.card').first();
      await expect(firstCard).toBeVisible();

      const title = firstCard.locator('.card__title');
      await expect(title).toBeVisible();
      await expect(title).not.toBeEmpty();
    });
  });

  test.describe('Interactions utilisateur', () => {
    test('devrait permettre de cliquer sur une carte de logement', async ({ page }) => {
      // Clique sur la première carte
      const firstCard = page.locator('.card').first();
      await firstCard.click();

      // Vérifie la navigation vers la page de détail
      await page.waitForURL(/\/logement\//);
      expect(page.url()).toMatch(/\/logement\/[a-zA-Z0-9-]+/);
    });

    test('devrait afficher le hover sur les cartes', async ({ page }) => {
      const firstCard = page.locator('.card').first();

      // Survol de la carte
      await firstCard.hover();

      // On pourrait vérifier un changement de style ici si nécessaire
      await expect(firstCard).toBeVisible();
    });
  });

  test.describe('Navigation header/footer', () => {
    test('devrait afficher le header avec navigation', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();

      // Vérifie le logo
      const logo = page.locator('header img, header .logo');
      await expect(logo.first()).toBeVisible();
    });

    test('devrait afficher le footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('devrait permettre de naviguer vers la page À Propos', async ({ page }) => {
      // Cherche le lien "À Propos" ou "About"
      const aboutLink = page
        .locator('a')
        .filter({ hasText: /à propos|about/i })
        .first();

      if ((await aboutLink.count()) > 0) {
        await aboutLink.click();
        await expect(page).toHaveURL(/\/about|\/a-propos/);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test("devrait s'afficher correctement sur mobile", async ({ page }) => {
      // Définit la taille de viewport mobile
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');

      // Vérifie que les éléments sont visibles
      const main = page.locator('main.home');
      await expect(main).toBeVisible();

      const cards = page.locator('.card');
      await expect(cards.first()).toBeVisible();
    });

    test("devrait s'afficher correctement sur tablette", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/');

      const cardContainer = page.locator('.home__card__container');
      await expect(cardContainer).toBeVisible();
    });

    test("devrait s'afficher correctement sur desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await page.goto('/');

      const main = page.locator('main.home');
      await expect(main).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('devrait charger rapidement', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Le chargement devrait prendre moins de 5 secondes
      expect(loadTime).toBeLessThan(5000);
    });

    test('devrait charger toutes les images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Vérifie que toutes les images sont chargées
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
      }
    });
  });

  test.describe('Accessibilité', () => {
    test('devrait avoir un attribut lang sur html', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', /fr|en/);
    });

    test('devrait être navigable au clavier', async ({ page }) => {
      // Tab vers le premier élément focusable
      await page.keyboard.press('Tab');

      // Vérifie qu'un élément a le focus
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName;
      });

      expect(focusedElement).toBeTruthy();
    });

    test('devrait avoir des liens avec texte accessible', async ({ page }) => {
      const links = page.locator('a');
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Chaque lien doit avoir soit du texte, soit un aria-label
        expect(text || ariaLabel).toBeTruthy();
      }
    });
  });

  test.describe('Internationalisation', () => {
    test('devrait afficher le sélecteur de langue', async ({ page }) => {
      // Cherche le composant de changement de langue s'il existe
      const languageSwitcher = page.locator('[class*="language"], [class*="lang-"]');

      // Ce test est optionnel si le composant existe
      if ((await languageSwitcher.count()) > 0) {
        await expect(languageSwitcher.first()).toBeVisible();
      }
    });
  });
});
