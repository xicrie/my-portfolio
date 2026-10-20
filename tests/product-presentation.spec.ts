import { test, expect } from "../playwright-fixture";

for (const width of [320, 390, 768, 1440]) {
  test(`readable product presentation and distinct hero assets at ${width}px`, async ({ page, context }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];page.on("pageerror", e => errors.push(e.message));
    for (const direction of ["ai","marketing"]) {
      await page.goto(`/?direction=${direction}#cases`);
      for(const trigger of await page.locator('[data-case-trigger]').all()) {
        const card=trigger.locator('xpath=ancestor::article');
        const cardImage=await card.locator('img').getAttribute('src');
        await expect(card.locator('.case-type-label')).toHaveCount(0);
        await expect(card.locator('.case-category')).toHaveCount(1);
        await expect(card.locator('button, a')).toHaveCount(1);
        await expect(card.locator('a[href*="Python"], button:has-text("LLM")')).toHaveCount(0);
        await trigger.click();
        const d=page.getByRole('dialog');await d.locator('.case-lead').waitFor();
        await expect(d.locator('dl')).toHaveCount(0);
        const hero=d.locator('.case-reader-cover img');
        await hero.evaluate(async(n:HTMLImageElement)=>{await n.decode()});
        const current=await hero.evaluate((n:HTMLImageElement)=>n.currentSrc);
        expect(current).not.toContain(cardImage!);
        expect(current).toContain(width<640?'-mobile.svg':'.svg');
        await hero.evaluate(async(n:HTMLImageElement)=>{await n.decode()});
        const prose=d.locator('.case-story-prose, .case-context, .case-original').first();
        const size=await prose.evaluate(n=>Number.parseFloat(getComputedStyle(n).fontSize));
        expect(size).toBeGreaterThanOrEqual(16);expect(size).toBeLessThanOrEqual(18);
        expect(await d.locator('.overflow-y-auto').first().evaluate(n=>n.scrollWidth-n.clientWidth)).toBeLessThanOrEqual(1);
        const bad=await d.evaluate(root=>{
          const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const hits:string[]=[];
          let node:Node|null;while((node=walker.nextNode())){
            const el=node.parentElement;if(!el||el.closest('pre, code, [aria-label="Технический JSON"]'))continue;
            if(/[\u2013\u2014]/.test(node.textContent??''))hits.push(node.textContent??'');
          }return hits;
        });expect(bad).toEqual([]);
        expect(await d.innerText()).not.toMatch(/Нужны экспорты|Следующий материал|синтетическая переписка|workflow|AI-assisted/);
        await d.getByRole('button',{name:'Закрыть',exact:true}).click();await d.waitFor({state:'hidden'});
      }
    }
    expect(context.pages()).toHaveLength(1);expect(errors).toEqual([]);
  });
}

test("assistant shows the actual product capabilities without a fabricated conversation", async ({page})=>{
  await page.goto('/?direction=ai&case=personal-assistant#cases');
  const d=page.getByRole('dialog');await d.locator('.case-lead').waitFor();
  await expect(d.locator('.inbox-example, blockquote')).toHaveCount(0);
  await expect(d).toContainText('ищет информацию в интернете');
  await expect(d).toContainText('Отправляет письма');
  await expect(d).toContainText('подключённые действия');
  expect(await d.innerText()).not.toMatch(/Дане|AI Inbox|Придуманный пример|прототип|нужно проверить по экспорту/i);
});

test("career includes confirmed Teletype work and seven years across disciplines",async({page})=>{
  await page.setViewportSize({width:390,height:1000});await page.goto('/#experience');
  const career=page.locator('#experience');
  await expect(career).toContainText('Более 7 лет в маркетинге и цифровых проектах');
  const card=career.locator('article').filter({hasText:'Teletype App'});
  await expect(card).toContainText('2026');
  await expect(card).toContainText('AI-маркетолог');
  await expect(card).toContainText('SaaS');
  await expect(card).toContainText('удержание пользователей');
  await expect(card).toContainText('UniSender');
  expect(await card.innerText()).not.toMatch(/\d+%|млн|тыс/);
  expect(await career.innerText()).not.toMatch(/[\u2013\u2014]/);
});

test("new author stories, clear titles and quiet navigation", async({page})=>{
  await page.goto('/#cases');const list=page.locator('#portfolio');
  expect(await list.innerText()).not.toMatch(/6 проектов|Направление|Тип материала/);
  for(const title of ['Помощник для поиска работы','AI-суфлёр для переговоров','Задачи из Telegram в YouGile','AI-аватар в Телеграме','Умный дневник в Телеграме','AI-ассистент в Телеграме'])await expect(list.getByRole('heading',{name:title,exact:true})).toBeVisible();
  await page.goto('/?case=telegram-roleplay#cases');const d=page.getByRole('dialog');await d.locator('.case-lead').waitFor();await d.locator('details summary').click();
  await expect(d).toContainText('Ксаавьер');await expect(d).toContainText('DeepSeek v3');await expect(d).toContainText('стресс-тестирование');await expect(d).toContainText('собственном сервере');expect(await d.innerText()).not.toMatch(/workflow.*не|По описанию автора|не подтвержден/);
  await page.goto('/?case=cbt-diary#cases');await d.locator('.case-lead').waitFor();expect(await d.innerText()).not.toMatch(/По описанию автора|До проверки workflow|не подтвержден/);await expect(d).toContainText('Notion');await expect(d).toContainText('недельные обзоры');await expect(d).toContainText('сохраняет записи в Notion');
});
