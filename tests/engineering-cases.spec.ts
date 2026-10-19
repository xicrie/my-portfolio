import { test, expect } from "../playwright-fixture";

for (const width of [320, 390, 1440]) {
  test(`product stories and optional engineering evidence at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];page.on("pageerror", e => errors.push(e.message));
    await page.goto("/?direction=ai#cases");
    for (const [title,diagramPath] of [["HH Career Engine","hh-data.svg"],["Из Telegram в YouGile","yougile-workflow.svg"],["AI-суфлёр","soufleur-architecture.svg"]]) {
      const trigger = page.getByRole("button", { name: `Прочитать кейс: ${title}`, exact: true });await trigger.click();
      const dialog = page.getByRole("dialog");await expect(dialog.getByRole("list",{name:"Сценарий пользователя"})).toBeVisible();
      const nav=dialog.getByRole("navigation",{name:"Содержание кейса"});
      await expect(nav.getByRole("button")).toHaveCount(4);
      for(const button of await nav.getByRole("button").all()){await button.click();expect(await dialog.locator(".overflow-y-auto").first().evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);}
      const details=dialog.locator(".case-technical");await expect(details).not.toHaveAttribute("open","");
      const summary=details.locator("summary");await summary.focus();await page.keyboard.press("Enter");await expect(details).toHaveAttribute("open","");
      await expect(details.getByRole("heading",{name:"Технологии",exact:true})).toBeVisible();
      const diagram=details.locator(`img[src="/images/engineering/${diagramPath}"]`).first();await diagram.scrollIntoViewIfNeeded();await diagram.evaluate(async n=>{await(n as HTMLImageElement).decode()});await diagram.locator("..").click();
      await expect(dialog.getByRole("group",{name:"Увеличенная схема"})).toBeVisible();
      expect(await dialog.locator(".overflow-y-auto").first().evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
      await page.keyboard.press("Escape");await expect(trigger).toBeFocused();
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
