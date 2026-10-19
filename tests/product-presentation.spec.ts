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
        const prose=d.locator('.case-story-prose, .case-original').first();
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

test("inbox example is clearly illustrative and does not promise calendar or memory", async ({page})=>{
  await page.goto('/?direction=ai&case=personal-assistant#cases');
  const d=page.getByRole('dialog');const figure=d.getByRole('figure',{name:'Пример разбора сообщения'});
  await expect(figure).toContainText('Придуманный пример, не переписка с работающим ботом');
  await expect(figure.getByRole('heading',{name:'Задача',exact:true})).toBeVisible();
  await expect(figure.getByRole('heading',{name:'Гипотеза',exact:true})).toBeVisible();
  await expect(d.getByText(/Поиск, календарь, долговременная память/)).toBeVisible();
});

test("career includes confirmed Teletype work and seven years across disciplines",async({page})=>{
  await page.setViewportSize({width:390,height:1000});await page.goto('/#experience');
  const career=page.locator('#experience');
  await expect(career).toContainText('7+ лет в маркетинге, контенте и цифровых проектах');
  const card=career.locator('article').filter({hasText:'Teletype App'});
  await expect(card).toContainText('Июнь-июль 2026');
  await expect(card).toContainText('Маркетолог');
  await expect(card).toContainText('удержания и возврата');
  await expect(card).toContainText('UniSender');
  expect(await card.innerText()).not.toMatch(/\d+%|млн|тыс/);
  expect(await career.innerText()).not.toMatch(/[\u2013\u2014]/);
});
