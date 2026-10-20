import { test, expect } from "../playwright-fixture";

for (const width of [320, 390, 1440]) {
  test(`short product stories and optional readonly technologies at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];page.on("pageerror", e => errors.push(e.message));
    await page.goto("/?direction=ai#cases");
    for (const title of ["Автоотклик на вакансии","Задачи из Telegram в YouGile","AI-суфлёр для переговоров"]) {
      const trigger = page.getByRole("link", { name: `Прочитать кейс: ${title}`, exact: true });await trigger.click();
      const dialog = page.getByRole("dialog");await dialog.getByRole("heading",{name:"Результат",exact:true}).waitFor();
      await expect(dialog.locator('[data-story-section]')).toHaveCount(5);
      await expect(dialog.getByRole("navigation")).toHaveCount(0);
      await expect(dialog.locator("dl, table, [data-artifact]")).toHaveCount(0);
      const details=dialog.locator(".case-technical");await expect(details).not.toHaveAttribute("open","");
      const summary=details.locator("summary");await summary.focus();await page.keyboard.press("Enter");await expect(details).toHaveAttribute("open","");
      const technologies=details.getByRole("region",{name:"Технологии",exact:true});
      await expect(technologies).toBeVisible();await expect(technologies.locator('a,button')).toHaveCount(0);
      expect((await details.innerText()).split(/\s+/).length).toBeLessThan(130);
      expect(await dialog.locator(".overflow-y-auto").first().evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
      await page.keyboard.press("Escape");await expect(trigger).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}

test("public evidence remains available separately from the product story", async ({ request }) => {
  const response=await request.get('/projects/engineering-examples.json');expect(response.ok()).toBeTruthy();const data=await response.json();
  expect(data.hh.synthetic).toBe(true);expect(data.n8n.synthetic).toBe(true);
  const graph=await request.get('/images/engineering/yougile-workflow.svg');expect(graph.ok()).toBeTruthy();expect(await graph.text()).toContain('35 узлов');
});
