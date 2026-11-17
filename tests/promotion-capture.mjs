import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
for(const width of [1440,390]){
 await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:3148/');
 await expect(page.locator('#contract .reveal-message')).toHaveText('CONTRACT REVEAL COMING SOON');
 await expect(page.locator('#contract code')).toHaveCount(0);
 await expect(page.locator('.buy-token')).toHaveCount(0);
 await page.locator('main img').evaluateAll(imgs=>imgs.forEach(i=>i.setAttribute('loading','eager')));
 await expect.poll(()=>page.locator('main img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'docs/screenshots/promotion/prelaunch-'+width+'.png'});
 await page.screenshot({path:'docs/screenshots/promotion/full-'+width+'.png',fullPage:true});
}
await browser.close();console.log('PASS: final empty-mint prelaunch and artwork captured.');
