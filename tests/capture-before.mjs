import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/screenshots/before',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
for(const width of [1440,390]){await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3148/',{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`docs/screenshots/before/home-${width}.png`,fullPage:true});await page.screenshot({path:`docs/screenshots/before/hero-${width}.png`});}
for(const route of ['cred','wanted','markets','missions','rewards','about']){await page.goto(`http://127.0.0.1:3148/${route}`);await page.screenshot({path:`docs/screenshots/before/${route}.png`,fullPage:true});}
await browser.close();
