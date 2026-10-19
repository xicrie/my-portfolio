import { test, expect } from "../playwright-fixture";

test("two directions and six material types replace technology navigation", async ({ page }) => {
  await page.goto("/#cases");
  const portfolio = page.locator("#portfolio");
  await expect(page.getByRole("group", { name: "Направление проектов" }).getByRole("button")).toHaveCount(2);
  await expect(portfolio.getByRole("article")).toHaveCount(6);
  const types = page.getByRole("group", { name: "Тип материала" });
  await expect(types.getByRole("button")).toHaveCount(4);
  for (const [type,count] of [["Приложения",2],["Telegram-боты",3],["Автоматизации",1]] as const) {
    await types.getByRole("button", { name: type, exact: true }).click();
    await expect(portfolio.getByRole("article")).toHaveCount(count);
    await page.reload();
    await expect(portfolio.getByRole("article")).toHaveCount(count);
  }
  await page.getByRole("button", { name: "Marketing / CRM", exact: true }).click();
  await expect(portfolio.getByRole("article")).toHaveCount(3);
  for (const type of ["Кейсы","Статьи","Рассылки"]) {
    await types.getByRole("button", { name: type, exact: true }).click();
    await expect(portfolio.getByRole("article")).toHaveCount(1);
  }
  expect(await types.innerText()).not.toMatch(/Python|SQLite|n8n|Storytelling/);
});

test("type filters survive reload and browser history; legacy links are normalized", async ({ page }) => {
  await page.goto("/?direction=ai#cases");
  await page.getByRole("button", { name: "Marketing / CRM", exact: true }).click();
  await page.getByRole("group", { name: "Тип материала" }).getByRole("button", { name: "Статьи", exact: true }).click();
  await expect(page).toHaveURL(/direction=marketing&type=articles#cases$/);
  await page.reload();
  await expect(page.locator("#portfolio article")).toHaveCount(1);
  await page.goBack();
  await expect(page.locator("#portfolio article")).toHaveCount(3);
  await page.goBack();
  await expect(page.locator("#portfolio article")).toHaveCount(6);
  await page.goForward();
  await expect(page.getByRole("button", { name: "Marketing / CRM", exact: true })).toHaveAttribute("aria-pressed","true");
  await page.goto("/?direction=marketing&tag="+encodeURIComponent("Статьи")+"#cases");
  await expect(page).toHaveURL(/type=articles/);
  expect(page.url()).not.toContain("tag=");
  await page.goto("/?direction=all&tag=Python#cases");
  await expect(page).toHaveURL(/direction=ai#cases$/);
  await expect(page.locator("#portfolio article")).toHaveCount(6);
  await page.goto("/?direction=marketing&type=applications&case=hh-career-engine#cases");
  await expect(page).toHaveURL(/direction=ai&type=applications&case=hh-career-engine/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button",{name:"Прочитать кейс: HH Career Engine",exact:true})).toBeFocused();
  await page.goto("/?direction=marketing&type=unknown#cases");
  await expect(page).toHaveURL(/direction=marketing#cases$/);
});

test("proof is readable without mistaking automated checks for product results", async ({ page }) => {
  await page.goto("/?direction=ai&case=telegram-ai-yougile#cases");
  const dialog = page.getByRole("dialog");
  const details = dialog.locator(".case-technical");
  await expect(dialog.getByRole("definition").first()).toContainText("Workflow");
  await expect(details).not.toHaveAttribute("open","");
  await expect(dialog.getByText(/32 локальные проверки/)).not.toBeVisible();
  await details.locator("summary").click();
  await expect(dialog.getByText(/поля назначения исполнителя и дедлайна YouGile автоматически не заполняются/i)).toBeVisible();
  await expect(details).toContainText("программных проверок не означает количество");
  await dialog.getByRole("button", { name: "Закрыть", exact: true }).click();
  await page.getByRole("button", { name: "Прочитать кейс: AI-суфлёр", exact: true }).click();
  await dialog.locator(".case-technical summary").click();
  await expect(dialog.getByText(/11 изолированных проверок чистых функций/)).toBeVisible();
  await expect(dialog.locator('[data-artifact="/projects/ai-prompter-brief.json"]')).toBeVisible();
  for (const path of ["/projects/yougile-workflow-verification.json", "/projects/ai-prompter-brief.json"]) {
    const response = await page.request.get(path);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("application/json");
  }
});

test("keyboard reading traps and restores focus without clickable technology tags", async ({ page }) => {
  await page.goto("/?direction=ai#cases");
  const trigger = page.getByRole("button", { name: "Прочитать кейс: HH Career Engine", exact: true });
  await trigger.focus();await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("definition").nth(1)).toContainText("Требования");
  await expect(dialog.getByText(/350 passed, 1 skipped/)).not.toBeVisible();
  await dialog.locator(".case-technical summary").click();
  const technologies = dialog.getByRole("region", { name: "Технологии",exact:true });
  await expect(technologies.getByRole("button")).toHaveCount(0);
  const before = page.url();await technologies.getByText("SQLite / WAL",{exact:true}).click();
  expect(page.url()).toBe(before);
  for (let i = 0; i < 12; i++) {await page.keyboard.press("Tab");expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBeTruthy();}
  await page.keyboard.press("Escape");await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 900 });await trigger.click();
  await dialog.getByRole("button", { name: "Закрыть", exact: true }).click();await expect(trigger).toBeFocused();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`navigation, anchors and resources at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(el => el.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    })).toEqual([]);
    expect(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')]
      .map(el => el.getAttribute("href")!)
      .filter(href => href.length > 1 && !document.getElementById(href.slice(1))))).toEqual([]);
    const visibleControls = await page.locator("header a, header button").evaluateAll(nodes => nodes
      .filter(node => (node as HTMLElement).offsetWidth > 0)
      .map(node => ({ left: node.getBoundingClientRect().left, right: node.getBoundingClientRect().right })));
    for (const rect of visibleControls) {
      expect(rect.left).toBeGreaterThanOrEqual(0);
      expect(rect.right).toBeLessThanOrEqual(width);
    }
    if (width < 1024) {
      const menu = page.locator('header button[aria-controls="mobile-navigation"]');
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(menu).toBeFocused();
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await menu.click();
      await page.locator("#mobile-navigation").getByRole("link", { name: "Портфолио", exact: true }).click();
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await expect(page).toHaveURL(/#cases$/);
    } else {
      await page.getByRole("link", { name: "Смотреть проекты", exact: true }).click();
      await expect(page).toHaveURL(/#cases$/);
    }
    await expect(page.getByRole("link", { name: /xicrie@gmail.com/ })).toHaveAttribute("href", "mailto:xicrie@gmail.com");
    await expect(page.getByRole("link", { name: "Посмотреть на HH", exact: true })).toHaveAttribute("href", /^https:\/\/hh\.ru\/resume\//);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    for (const path of ["/Favicon.png", "/images/alena-hero.webp", "/projects/hh-career-engine-verification.json"]) {
      const response = await page.request.get(path);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()["content-type"]).not.toContain("text/html");
    }
  });
}

test("skills are available by keyboard and touch without leaving the screen", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#skills");
    const stages = page.locator("#skills [role=button]");
    for (let i = 0; i < await stages.count(); i++) {
      const stage = stages.nth(i);
      await stage.focus();
      await expect(stage).toHaveAttribute("aria-expanded", "true");
      const id = await stage.getAttribute("aria-controls");
      const panel = page.locator(`#${id}`);
      await expect(panel).toBeVisible();
      const box = await panel.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
      await expect(stage).toHaveAttribute("aria-expanded", "false");
      await stage.click();
      await expect(stage).toHaveAttribute("aria-expanded", "true");
    }
  }
});

test("career carousel moves by buttons and releases page scrolling at its edges", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/#experience");
  const scroller = page.getByRole("region", { name: "Карьера и компании — прокручиваемые карточки" });
  await expect(scroller).toHaveAttribute("tabindex", "0");
  await page.getByRole("button", { name: "Прокрутить вправо", exact: true }).click();
  await expect.poll(() => scroller.evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
  for (const edge of ["start", "end", "middle"]) {
    const prevented = await scroller.evaluate((el, position) => {
      el.scrollTo({ left: position === "start" ? 0 : position === "end" ? el.scrollWidth : (el.scrollWidth - el.clientWidth) / 2, behavior: "instant" });
      const wheel = new WheelEvent("wheel", { deltaY: position === "start" ? -100 : 100, cancelable: true });
      el.dispatchEvent(wheel);
      return wheel.defaultPrevented;
    }, edge);
    expect(prevented).toBe(edge === "middle");
  }
});
