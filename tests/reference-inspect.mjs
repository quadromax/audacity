import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const report = [];
  for (const [name, url] of [
    ["home", "https://gtamemes.xyz/"],
    ["cred", "https://gtamemes.xyz/cred"],
    ["wanted", "https://gtamemes.xyz/wanted"],
    ["bawsaq", "https://bawsaq.gtamemes.xyz/"],
  ]) {
    try {
      const res = await page.goto(url, {
        timeout: 15000,
        waitUntil: "domcontentloaded",
      });
      await page.screenshot({ path: `docs/screenshots/reference-${name}.png` });
      report.push({
        url,
        status: res.status(),
        title: await page.title(),
        text: (await page.locator("body").innerText()).slice(0, 7000),
      });
    } catch (e) {
      report.push({ url, error: e.message });
    }
  }
  await fs.writeFile(
    "docs/reference-inspection.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
  await browser.close();
})();
