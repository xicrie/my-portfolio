import { test, expect } from '../playwright-fixture';

const photoSelector = '[data-hero-photo]';

test('photo quote closes after a click, fast re-entry and leaving the picture', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const photo = page.locator(photoSelector);
  const cloud = page.locator('#hero-quote');
  await photo.hover();
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  const quote = await cloud.innerText();
  const cloudBox = await cloud.boundingBox();
  await page.mouse.move(cloudBox!.x + 30, cloudBox!.y + 30);
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  await expect(cloud).toHaveText(quote);
  await photo.click();
  await page.mouse.move(5, 900);
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => cloud.evaluate(n => getComputedStyle(n).opacity)).toBe('0');
  for (let i = 0; i < 12; i++) {
    await photo.hover();
    await page.mouse.move(5, 900);
  }
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => cloud.evaluate(n => getComputedStyle(n).opacity)).toBe('0');
  await expect.poll(() => photo.locator('.lucide-lightbulb').evaluate(n => getComputedStyle(n).color)).toBe('rgb(181, 160, 141)');
});

test('quote rotation stops on leave and restarts without leftover timers', async ({ page }) => {
  await page.goto('/');
  await page.clock.install();
  const photo = page.locator(photoSelector);
  const cloud = page.locator('#hero-quote');
  await photo.hover();
  const first = await cloud.innerText();
  await page.clock.fastForward(6100);
  await expect(cloud).not.toHaveText(first);
  await page.mouse.move(5, 900);
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
  const stopped = await cloud.innerText();
  await page.clock.fastForward(18000);
  await expect(cloud).toHaveText(stopped);
  await photo.hover();
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  await expect(cloud).not.toHaveText(stopped);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
});

test('keyboard quotes dismiss on Escape and when focus moves away', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const photo = page.locator(photoSelector);
  await photo.focus();
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
});

test('touch quote dismisses outside the photo and after its reading timeout', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  const photo = page.locator(photoSelector);
  await photo.tap();
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  await page.touchscreen.tap(5, 500);
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
  await page.clock.install();
  await photo.tap();
  await expect(photo).toHaveAttribute('aria-expanded', 'true');
  await page.clock.fastForward(6100);
  await expect(photo).toHaveAttribute('aria-expanded', 'false');
  await context.close();
});
