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
    const trigger = page.getByRole("link", { name: "Прочитать кейс: Помощник для поиска работы", exact: true });
    await trigger.scrollIntoViewIfNeeded();
    // Clicking can make Playwright scroll again after the card hover transform.
    // Compare the actual activation position, rather than an earlier snapshot.
    await trigger.evaluate(node => node.addEventListener("click", () => {
      node.setAttribute("data-open-scroll-y", String(window.scrollY));
    }, { capture: true, once: true }));
    await trigger.click();
    const before = Number(await page.locator('[data-case-trigger="hh-career-engine"]').getAttribute("data-open-scroll-y"));
    await expect(page).toHaveURL(/case=hh-career-engine/);
    const dialog = page.getByRole("dialog");
    await dialog.locator(".case-technical summary").click();
    await expect(dialog.getByRole("region",{name:"Технологии",exact:true})).toContainText("SQLite");
    await expect(dialog.locator('[data-artifact]')).toHaveCount(0);
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
    await expect(dialog.getByRole("heading", { name: "О продукте", exact: true })).toBeVisible();
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
      for (const link of await external.all()) {expect(await link.getAttribute("rel")).toContain("noopener");expect(await link.textContent()).not.toMatch(/новая вкладка|внешний сайт/);}
      expect(await dialog.locator(".overflow-y-auto").first().evaluate(n => n.scrollWidth - n.clientWidth)).toBeLessThanOrEqual(1);
      await expect(dialog.getByRole("button",{name:/К списку кейсов/})).toHaveCount(0);
      await dialog.getByRole("button", { name: "Закрыть", exact: true }).click();
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
