import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/screenshots/after',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});
 await page.goto('http://127.0.0.1:3148/',{waitUntil:'load'});
 for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect(img).toHaveJSProperty('complete',true);await expect(img).not.toHaveJSProperty('naturalWidth',0);}
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'docs/screenshots/after/home-'+width+'.png',fullPage:true});
 await page.screenshot({path:'docs/screenshots/after/hero-'+width+'.png'});
}
await browser.close();
