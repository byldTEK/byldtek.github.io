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
    expect(html).toContain('A mobile platform for managing shared building finances');
    expect(html).toContain('BETA');
    expect(html).toMatch(/<html[^>]*lang="en"[^>]*dir="ltr"/);
  });

  test('Arabic page ships real content in the initial response', async ({ request }) => {
    const res = await request.get('/ar/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('نبني');
    expect(html).toContain('منصة هاتف لإدارة المصروفات المشتركة للمباني');
    expect(html).not.toContain('بونيان');
    expect(html).toMatch(/<html[^>]*lang="ar"[^>]*dir="rtl"/);
  });

  test('sitemap and robots exist', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    const sitemap = await request.get('/sitemap.xml');
    const llms = await request.get('/llms.txt');

    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('User-agent: OAI-SearchBot\nAllow: /');
    expect(await sitemap.text()).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain('# byldTEK');
  });

  test('homepage exposes complete Organization and WebSite entities', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]));
    const nodes = graphs.flatMap((graph) => graph['@graph'] ?? [graph]);
    const organization = nodes.find((node) => node['@type'] === 'Organization');
    const website = nodes
      .find((node) => node['@type'] === 'WebSite');

    expect(organization).toBeTruthy();
    expect(organization.name).toBe('byldTEK');
    expect(organization.areaServed).toBe('Worldwide');
    expect(organization.availableLanguage).toEqual(['English', 'Arabic']);
    expect(organization.contactPoint.contactType).toBe('sales and general inquiries');
    expect(organization.sameAs).toHaveLength(8);
    expect(website).toBeTruthy();
    expect(website.name).toBe('byldTEK');
    expect(website.alternateName).toBe('byldtek.com');
    expect(website.url).toBe('https://byldtek.com/');
    expect(website.publisher).toEqual({ '@id': 'https://byldtek.com/#organization' });
    expect(website.inLanguage).toEqual(['en', 'ar']);
  });

  test('homepage metadata and visible copy describe byldTEK consistently', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'byldTEK — We make ideas work.'
    );
    await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute('content', 'ar_EG');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('header a[aria-label="byldTEK"]')).toHaveAttribute('href', '/');
    await expect(page.getByText('byldTEK is a software engineering company', { exact: false })).toBeVisible();
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

test.describe('mobile Bunyan gallery', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test('a vertical swipe starting on the gallery continues page scrolling', async ({ page }) => {
    await page.goto('/');
    const gallery = page.locator('.bunyan-gallery');
    await gallery.scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.bunyan-gallery img')]
        .every((image) => image.complete && image.naturalWidth > 0));

    const box = await gallery.boundingBox();
    expect(box).not.toBeNull();
    const startX = box.x + box.width / 2;
    const startY = Math.min(box.y + box.height / 2, 700);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    const cdp = await page.context().newCDPSession(page);

    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y: startY }],
    });
    for (const distance of [30, 60, 90, 120, 150]) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: startX, y: startY - distance }],
      });
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });

    await expect.poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThanOrEqual(scrollBefore + 100);
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
