import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({channel:'msedge',headless:true});
const page = await browser.newPage({reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
for (const width of [320,375,390,430,768,1024,1440,1920]) {
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:3149/');
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.audacity-token-logo')).toHaveCount(3);
  await expect(page.locator('.token-plate .solana-mark')).toHaveCount(2);
  for (const selector of ['#contract','.terminal-identity','.closing-plate']) {
    const area=page.locator(selector);
    await area.scrollIntoViewIfNeeded();
    await expect(area.locator('.audacity-token-logo')).toHaveJSProperty('complete',true);
    const box=await area.locator('.token-name-with-logo').evaluate(el=>({h:el.getBoundingClientRect().height,line:parseFloat(getComputedStyle(el).lineHeight)}));
    if(box.h>box.line+2) throw new Error(`Ticker wraps: ${width} ${selector} ${JSON.stringify(box)}`);
    await area.getByRole('button',{name:'Copy contract address'}).click();
    await expect(area.getByRole('status')).toHaveText('COPIED!');
    if([320,390,1440].includes(width)) await area.screenshot({path:`docs/screenshots/logo-${width}-${selector.replace(/[.#]/g,'')}.png`,style:'.contract-banner,.mobile-trading{visibility:hidden!important}'});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
}
const icons=await page.locator('link[rel="icon"]').evaluateAll(els=>els.map(el=>el.getAttribute('href')));
expect(icons.some(url=>url.includes('icon.png'))).toBe(true);
expect(icons.some(url=>url.includes('favicon.ico'))).toBe(true);
for(const url of icons) expect((await page.request.get('http://127.0.0.1:3149'+url)).ok()).toBe(true);
console.log('PASS: three token logos, preserved Solana marks, single-line tickers, clipboard, no overflow at eight widths, PNG/ICO favicon responses.');
await browser.close();
