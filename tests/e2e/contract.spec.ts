import { test, expect } from "@playwright/test";
import { DEMO_CA } from "../../src/lib/launch";
const areas = [
  ".contract-banner",
  "#contract",
  ".closing-plate",
  ".terminal-identity",
];
test.use({ permissions: ["clipboard-read", "clipboard-write"] });
test("all four contract areas copy the same demo value at eight widths", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    for (const selector of areas) {
      const area = page.locator(selector),
        button = area.getByRole("button", { name: "Copy contract address" });
      await expect(area.locator(".address-display code")).toHaveText(DEMO_CA);
      await expect(button).toBeEnabled();
      await button.click();
      await expect(button).toHaveText("COPIED!");
      await expect(area.getByRole("status")).toHaveText("COPIED!");
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        DEMO_CA,
      );
    }
    await expect(page.locator(".contract-banner .launch-status")).toHaveText(
      "LAUNCHING",
    );
    await expect(
      page
        .locator("button")
        .filter({ hasText: /LAUNCHING SOON|TRADING UNAVAILABLE/ }),
    ).toHaveCount(0);
    await expect(page.locator('a[href*="pump.fun/coin"]')).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const cardLogos = page.locator(".token-plate img.solana-mark");
    await expect(cardLogos).toHaveCount(2);
    for (const logo of await cardLogos.all()) {
      await expect(logo).toHaveJSProperty("complete", true);
      expect(
        await logo.evaluate((e) => (e as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
      const size = await logo.boundingBox();
      expect(size!.width / size!.height).toBeCloseTo(101 / 88, 1);
    }
    if ([320, 390, 768, 1440, 1920].includes(width)) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: "docs/screenshots/contract-pass/page-" + width + ".png",
        fullPage: true,
        animations: "disabled",
      });
      for (const [name, selector] of [
        ["banner", ".contract-banner"],
        ["hero-card", "#contract"],
        ["final-card", ".closing-plate"],
        ["market-controls", ".terminal-identity"],
      ]) {
        await page.locator(selector).screenshot({
          path: "docs/screenshots/contract-pass/" + name + "-" + width + ".png",
          animations: "disabled",
          style:
            selector === ".contract-banner"
              ? ".skip-link{visibility:hidden!important}"
              : ".contract-banner,.mobile-trading,.skip-link{visibility:hidden!important}",
        });
      }
    }
  }
  expect(errors).toEqual([]);
});
test("copy success returns to normal and is operable from keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const button = page
    .locator("#contract")
    .getByRole("button", { name: "Copy contract address" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveText("COPIED!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    DEMO_CA,
  );
  await expect(button).toHaveText("COPY CA", { timeout: 5000 });
  await expect(
    page.locator("#contract").getByRole("status", { includeHidden: true }),
  ).toBeEmpty();
});
for (const mode of ["missing", "denied"]) {
  test(
    "native fallback copies exact text when async clipboard is " + mode,
    async ({ page }) => {
      await page.goto("/");
      await page.evaluate((mode) => {
        if (mode === "missing")
          Object.defineProperty(navigator.clipboard, "writeText", {
            configurable: true,
            value: undefined,
          });
        else
          Object.defineProperty(navigator.clipboard, "writeText", {
            configurable: true,
            value: async () => {
              throw new DOMException("Denied", "NotAllowedError");
            },
          });
      }, mode);
      for (const selector of areas) {
        const area = page.locator(selector),
          button = area.getByRole("button", { name: "Copy contract address" });
        await button.click();
        await expect(area.getByRole("status")).toHaveText("COPIED!");
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
          DEMO_CA,
        );
        await expect(button).toBeFocused();
        await expect(
          page.locator('textarea[aria-label="Contract copy buffer"]'),
        ).toHaveCount(0);
      }
    },
  );
}
test("clipboard failure never claims success and retry recovers", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw new DOMException("Denied", "NotAllowedError");
      },
    });
    document.execCommand = () => false;
  });
  for (const selector of areas) {
    const area = page.locator(selector);
    await area.getByRole("button", { name: "Copy contract address" }).click();
    await expect(area.getByRole("status")).toHaveText(
      "COPY FAILED — TRY AGAIN",
    );
    await expect(
      area.getByRole("button", { name: "Copy contract address" }),
    ).toHaveText("COPY CA");
  }
  await page.reload();
  await page
    .locator(".terminal-identity")
    .getByRole("button", { name: "Copy contract address" })
    .click();
  await expect(
    page.locator(".terminal-identity").getByRole("status"),
  ).toHaveText("COPIED!");
});
test("status pulses normally and is static for reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".contract-banner .launch-status i")).toHaveCSS(
    "animation-name",
    "launch-breathe",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".contract-banner .launch-status i")).toHaveCSS(
    "animation-name",
    "none",
  );
});
