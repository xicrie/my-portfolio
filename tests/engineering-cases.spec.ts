import { test, expect } from "../playwright-fixture";

for (const width of [320, 390, 1440]) {
  test(`engineering reading, navigation and diagrams at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/?direction=ai#cases");
    for (const title of ["HH Career Engine", "Telegram → AI → YouGile", "AI-суфлёр"]) {
      const trigger = page.getByRole("button", { name: `Прочитать кейс: ${title}`, exact: true });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog.getByText("Обзор за 30 секунд", { exact: true })).toBeVisible();
      await expect(dialog.getByRole("list", { name: "Подтверждённый стек" })).toBeVisible();
      const nav = dialog.getByRole("navigation", { name: "Содержание AI-кейса" });
      if (title !== "AI-суфлёр") {
        const details = dialog.locator("details").filter({ has: page.locator("summary", { hasText: "Инженерный разбор" }) });
        await expect(details).not.toHaveAttribute("open", "");
        await nav.getByRole("button", { name: "Инженерный разбор", exact: true }).click();
        await expect(details).toHaveAttribute("open", "");
        expect(await details.evaluate(el => el.parentElement === document.activeElement)).toBeTruthy();
        const summary = details.locator("summary");
        await summary.focus();
        await page.keyboard.press("Enter");
        await expect(details).not.toHaveAttribute("open", "");
        await page.keyboard.press("Enter");
        await expect(details).toHaveAttribute("open", "");
        await nav.getByRole("button", { name: "Данные и контракты", exact: true }).click();
        await expect(dialog.locator("pre").first()).toBeVisible();
        if (title === "Telegram → AI → YouGile") {
          await nav.getByRole("button", { name: "Все 35 узлов", exact: true }).click();
          const diagram = dialog.locator('img[src="/images/engineering/yougile-workflow.svg"]').first();
          await diagram.scrollIntoViewIfNeeded();
          await expect(diagram).toBeVisible();
          await diagram.evaluate(async n => { await (n as HTMLImageElement).decode(); });
          await diagram.locator("..").click();
          await expect(diagram.locator("..")).toHaveAttribute("aria-expanded", "true");
          await expect(dialog.getByRole("group", { name: "Увеличенная схема" })).toBeVisible();
        }
      }
      for (const button of await nav.getByRole("button").all()) {
        await button.click();
        const overflow = await dialog.locator(".overflow-y-auto").first().evaluate(el => el.scrollWidth - el.clientWidth);
        expect(overflow).toBeLessThanOrEqual(1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      }
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}

test("public evidence is explicitly synthetic and the workflow diagram is available", async ({ request }) => {
  const response = await request.get("/projects/engineering-examples.json");
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.hh.synthetic).toBe(true);
  expect(data.n8n.synthetic).toBe(true);
  expect(data.hh.examples.find((e: { scenario: string }) => e.scenario.includes("до 180"))).toMatchObject({ decision: "REVIEW", score: 89.8, execution: "demo_no_send" });
  expect(data.n8n.validated.assignee_name).toBe("");
  expect(data.n8n.createPayload).not.toHaveProperty("assigned");
  const graph = await request.get("/images/engineering/yougile-workflow.svg");
  expect(graph.ok()).toBeTruthy();
  expect(await graph.text()).toContain("35 узлов");
});
