// Smoke tests for the things that actually broke during development:
// content missing from raw HTML, wrong <html lang/dir>, scroll-state not
// updating (the dev-mode hydration bug), and the interactive bits added
// during the accessibility pass. Not a full suite — just tripwires for the
// specific regressions this project already had once.
const { test, expect } = require('@playwright/test');

test.describe('raw HTML (no JS) — the original SEO problem', () => {
  test('English page ships real content in the initial response', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('We make');
    expect(html).toContain('ideas work');
    expect(html).toMatch(/<html[^>]*lang="en"[^>]*dir="ltr"/);
  });

  test('Arabic page ships real content in the initial response', async ({ request }) => {
    const res = await request.get('/ar/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('نبني');
    expect(html).toMatch(/<html[^>]*lang="ar"[^>]*dir="rtl"/);
  });

  test('sitemap and robots exist', async ({ request }) => {
    expect((await request.get('/robots.txt')).status()).toBe(200);
    expect((await request.get('/sitemap.xml')).status()).toBe(200);
  });

  test('contact form asks for a reply address and exposes submission status', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    expect(html).toMatch(/<input[^>]*type="email"[^>]*required/);
    expect(html).toMatch(/role="status"[^>]*aria-live="polite"/);
  });

  test('OG image meta tags point to real, fetchable images', async ({ request, page, baseURL }) => {
    for (const path of ['/', '/ar/']) {
      await page.goto(path);
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();
      // og:image is an absolute production URL (metadataBase); test against
      // the local server by keeping only its path.
      const localUrl = new URL(new URL(ogImage).pathname + new URL(ogImage).search, baseURL);
      const imgRes = await request.get(localUrl.toString());
      expect(imgRes.status()).toBe(200);
      expect(imgRes.headers()['content-type']).toContain('image');
    }
  });
});

test.describe('scroll-driven sections actually track scroll', () => {
  test('Capabilities section advances as the page scrolls', async ({ page }) => {
    await page.goto('/');
    const active = () => page.locator('#capabilities >> text=AI & Automation').first();
    await expect(active()).toBeVisible();

    // Scroll deep enough into the 500vh pinned section (relative to actual
    // viewport height, not a hardcoded pixel guess) that a later capability
    // should now be active.
    const vh = await page.evaluate(() => window.innerHeight);
    await page.evaluate((y) => window.scrollTo(0, y), vh * 3);
    await page.waitForFunction(() => window.scrollY > 0);
    await page.waitForTimeout(300);

    const mobileApps = page.locator('#capabilities >> text=Mobile Apps').first();
    await expect(mobileApps).toHaveCSS('color', 'rgb(11, 19, 32)'); // active title color
  });

  test('no console errors during scroll on either route', async ({ page }) => {
    for (const path of ['/', '/ar/']) {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e));
      await page.goto(path);
      await page.mouse.wheel(0, 6000);
      await page.waitForTimeout(300);
      expect(errors).toEqual([]);
    }
  });
});

test.describe('interactive pieces from the a11y pass', () => {
  test('contact chips are real, keyboard-operable buttons', async ({ page }) => {
    await page.goto('/#contact');
    const chip = page.getByRole('button', { name: 'AI & Automation' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  test('legal modal traps focus and closes on Escape', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Privacy' }).first().click();
    const closeBtn = page.getByRole('button', { name: /CLOSE/ });
    await expect(closeBtn).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('language switch navigates to a real, distinct URL', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'عربي' }).click();
    await expect(page).toHaveURL(/\/ar\/?$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
