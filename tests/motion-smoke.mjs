import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if((m.type()==='error'||(m.type()==='warning'&&m.text().includes('GSAP')))&&!m.text().includes('me.kis.v2.scr.kaspersky-labs.com'))errors.push(m.text());});
await page.goto('http://127.0.0.1:3148/');
await expect(page.locator('.lead-character').first()).toHaveCSS('opacity','1');
await page.locator('#dossier').scrollIntoViewIfNeeded();
await page.getByRole('tab',{name:/Lucia/}).click();
await expect(page.locator('.cast-profile h3')).toHaveText('Lucia Caminos');
await page.getByRole('link',{name:'The exchange',exact:true}).last().click();
await expect(page.locator('.exchange-heading')).toBeVisible();
expect(errors).toEqual([]);
console.log('PASS: normal-motion entrance, scroll reveal, dossier transition and client navigation without browser/GSAP errors.');
await page.emulateMedia({reducedMotion:'reduce'});
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});
 for(const route of ['cast','markets','about','how-to-buy']){
  await page.goto('http://127.0.0.1:3148/'+route);
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect(img).toHaveJSProperty('complete',true);}
  await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:'docs/screenshots/launch/'+route+'-'+width+'.png',fullPage:true});
 }
}
await page.goto('http://127.0.0.1:3148/');
await page.getByRole('button',{name:'Open menu'}).click();
await expect(page.getByRole('dialog')).toBeVisible();
await page.screenshot({path:'docs/screenshots/launch/menu-390.png'});
await browser.close();
