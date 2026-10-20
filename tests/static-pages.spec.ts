import {test,expect}from'../playwright-fixture';
const ids=['hh-career-engine','telegram-ai-yougile','ai-prompter','telegram-roleplay','cbt-diary','personal-assistant','proptech-legend','article-proptech-2026','email-marketing-kts'];
test('homepage and all cases are readable and linked without JavaScript',async({browser,request})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('/');await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('[data-case-trigger]')).toHaveCount(6);await expect(page.getByText('AI-специалист на стыке автоматизации и маркетинга',{exact:true}).first()).toBeVisible();
 for(const id of ids){
  const response=await page.goto(`/cases/${id}/`);expect(response?.status()).toBe(200);await expect(page.locator('h1')).toHaveCount(1);
  const canonical=page.locator('link[rel=canonical]');await expect(canonical).toHaveAttribute('href',`https://xicrie.ru/cases/${id}/`);
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content',/.{30}/);
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()??'{}');expect(schema['@type']).toBe('CreativeWork');expect(schema.author.name).toBe('Алёна Степанова');
  expect(await page.locator('main').innerText()).not.toMatch(/по описанию автора|workflow не проверен|область проверки/i);
  expect((await page.locator('main').innerText()).length).toBeGreaterThan(700);
  const hero=page.locator('.case-reader-cover');const box=await hero.boundingBox();const main=await page.locator('main').boundingBox();expect(Math.abs(box!.y-main!.y)).toBeLessThan(2);
  await expect(page.getByRole('link',{name:/Следующий кейс:/})).toHaveAttribute('href',/^\/cases\//);
  if(id==='email-marketing-kts'){await page.getByText('Письмо 2. Как избежать долгого внедрения',{exact:true}).click();await expect(page.getByRole('region',{name:'Письмо 2',exact:true})).toContainText('FORMA');}
 }
 const sitemap=await request.get('/sitemap.xml');expect(sitemap.ok()).toBeTruthy();const xml=await sitemap.text();expect((xml.match(/<loc>/g)??[])).toHaveLength(10);for(const id of ids)expect(xml).toContain(`/cases/${id}/`);
 const robots=await request.get('/robots.txt');expect(await robots.text()).toContain('Sitemap: https://xicrie.ru/sitemap.xml');
 const notFound=await request.get('/404.html');expect(await notFound.text()).toContain('content="noindex"');await context.close();
});
test('modal cover touches its top, close remains reachable, and cards have equal dimensions',async({page})=>{
 for(const width of[320,390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});await page.goto('/#cases');
  const cards=page.locator('#portfolio article');const dimensions=await cards.evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
  expect(Math.max(...dimensions.map(d=>d.w))-Math.min(...dimensions.map(d=>d.w))).toBeLessThan(2);expect(Math.max(...dimensions.map(d=>d.h))-Math.min(...dimensions.map(d=>d.h))).toBeLessThan(2);
  await page.locator('[data-case-trigger]').first().click();const d=page.getByRole('dialog');await d.locator('.case-lead').waitFor();await page.waitForTimeout(300);const cover=d.locator('.case-reader-cover');const a=await d.boundingBox();const b=await cover.boundingBox();expect(Math.abs(a!.y-b!.y)).toBeLessThan(2);
  const close=d.getByRole('button',{name:'Закрыть',exact:true});const c=await close.boundingBox();expect(c!.y).toBeGreaterThan(b!.y);expect(c!.y+c!.height).toBeLessThan(b!.y+b!.height);
  await d.locator('.overflow-y-auto').evaluate(n=>n.scrollTop=n.scrollHeight);await expect(close).toBeInViewport();await page.keyboard.press('Escape');
 }
});

test('original two-colour line fills and resets with the original interactions',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/#skills');
 const stages=page.locator('#skills [role=button]');const line=page.locator('#skills .bg-gradient-to-r').first();const parent=line.locator('..');
 await stages.last().focus();await expect(stages.last()).toHaveAttribute('aria-expanded','true');
 await expect.poll(async()=>line.evaluate(n=>n.getBoundingClientRect().width/n.parentElement!.getBoundingClientRect().width)).toBeGreaterThan(.99);
 const gradient=await line.evaluate(n=>getComputedStyle(n).backgroundImage);expect(gradient).toContain('linear-gradient');expect(gradient).toMatch(/251, 191, 36|fbbf24/);expect(gradient).toMatch(/139, 92, 246|8b5cf6/);
 await page.keyboard.press('Escape');await expect.poll(async()=>line.evaluate(n=>n.getBoundingClientRect().width)).toBeLessThan(1);
 await stages.nth(2).hover();await expect.poll(async()=>line.evaluate(n=>n.getBoundingClientRect().width/n.parentElement!.getBoundingClientRect().width)).toBeGreaterThan(.49);
 expect(await parent.evaluate(n=>n.querySelectorAll('[role=button]').length)).toBe(5);
});
