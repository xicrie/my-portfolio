import { test, expect } from "../playwright-fixture";

for (const width of [390, 1440]) {
  test(`case URL, Back, scroll, inline assets and all nine materials at ${width}px`, async ({ page, context }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/?direction=ai#cases");
    await page.getByRole("group", { name: "Тип материала" }).getByRole("button", { name: "Приложения", exact: true }).click();
    const filterURL = page.url();
    const trigger = page.getByRole("button", { name: "Прочитать кейс: HH Career Engine", exact: true });
    await trigger.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await trigger.click();
    await expect(page).toHaveURL(/case=hh-career-engine/);
    const dialog = page.getByRole("dialog");
    const artifact = dialog.locator('[data-artifact="/projects/hh-career-engine-verification.json"]');
    await dialog.locator(".case-technical summary").click();
    await artifact.click();
    await expect(dialog.getByRole("group", { name: "Технический JSON" })).toContainText('"project": "HH Career Engine"');
    expect(context.pages()).toHaveLength(1);
    expect(page.url()).toContain("case=hh-career-engine");
    await page.goBack();
    await expect(dialog).not.toBeVisible();
    expect(page.url()).toBe(filterURL);
    await expect(trigger).toBeFocused();
    await expect.poll(async () => Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(5);
    await page.goForward();
    await expect(dialog).toBeVisible();
    await page.reload();
    await expect(dialog.getByRole("definition").first()).toBeVisible();
    const close = dialog.getByRole("button", { name: "Закрыть", exact: true });
    const box = await close.boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);
    await close.click();
    await expect(dialog).not.toBeVisible();
    for (const [direction,count] of [["ai",6],["marketing",3]] as const) {
    await page.goto(`/?direction=${direction}#cases`);
    const triggers = page.locator("[data-case-trigger]");
    await expect(triggers).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      const button = triggers.nth(i);
      const id = await button.getAttribute("data-case-trigger");
      await button.click();
      await expect(page).toHaveURL(new RegExp(`case=${id}`));
      await expect(dialog.locator('[role="status"]')).toHaveCount(0);
      await expect.poll(async () => (await dialog.innerText()).length).toBeGreaterThan(500);
      await expect(dialog).toHaveCount(1);
      const external = dialog.locator('a[target="_blank"]');
      for (const link of await external.all()) expect(await link.textContent()).toMatch(/новая вкладка/);
      expect(await dialog.locator(".overflow-y-auto").first().evaluate(n => n.scrollWidth - n.clientWidth)).toBeLessThanOrEqual(1);
      await dialog.getByRole("button", { name: "← К списку кейсов", exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(button).toBeFocused();
    }
    }
    await page.goto("/?direction=marketing&case=email-marketing-kts#cases");
    await expect(dialog).toBeVisible();
    await expect.poll(async () => (await dialog.innerText()).length).toBeGreaterThan(500);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/direction=marketing#cases$/);
    expect(errors).toEqual([]);
  });
}

test("canvas pauses offscreen and respects reduced motion", async ({ page }) => {
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.clearRect;
    (window as unknown as { paints: number }).paints = 0;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      (window as unknown as { paints: number }).paints++;
      return original.apply(this, args);
    };
  });
  await page.goto("/");
  await page.waitForTimeout(650);
  const start = await page.evaluate(() => (window as unknown as { paints: number }).paints);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as unknown as { paints: number }).paints) - start).toBeGreaterThan(3);
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const offscreen = await page.evaluate(() => (window as unknown as { paints: number }).paints);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as unknown as { paints: number }).paints) - offscreen).toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(650);
  const reduced = await page.evaluate(() => (window as unknown as { paints: number }).paints);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as unknown as { paints: number }).paints) - reduced).toBeLessThan(2);
});
