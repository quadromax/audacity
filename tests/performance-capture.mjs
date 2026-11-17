import { chromium } from '@playwright/test';
const phase = process.argv[2] || 'before';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await page.route('**/*kaspersky-labs.com/**', route => route.abort());
  await page.goto('http://127.0.0.1:3149/');
  for (const section of await page.locator('main > section').all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
  }
  const reset = page.getByRole('button', { name: 'Reset this device’s record' });
  if (await reset.isEnabled()) {
    await reset.click();
    await page.getByRole('button', { name: 'Yes, reset record' }).click();
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('main img').evaluateAll(images => images.forEach(img => img.loading = 'eager'));
  await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(img => img.complete && img.naturalWidth));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `docs/performance/${phase}-${width}.png`, fullPage: true, animations: 'disabled' });
  await page.close();
}
await browser.close();
