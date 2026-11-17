import { test, expect } from "@playwright/test";

test("offscreen artwork waits for approach and loads fully without empty frames", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(decodeURIComponent(request.url())));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".lead-lucia img")).toHaveJSProperty("complete", true);
  await page.waitForTimeout(1800);
  expect(requests.some((url) => url.includes("leonida-causeway.webp"))).toBe(false);
  expect(requests.some((url) => url.includes("/api/market"))).toBe(false);
  for (const selector of [".landscape-frame", ".cast-stage", ".cast-roster", ".takeover-cast"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    for (const img of await page.locator(`${selector} img`).all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).not.toHaveAttribute("src", /^data:/);
      await expect.poll(() => img.evaluate((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 1)).toBe(true);
    }
  }
});

test("normal-motion hero entrance and GSAP scroll effects remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".lead-jason")).toHaveCSS("animation-duration", "1.1s");
  await expect(page.locator(".lead-lucia")).toHaveCSS("animation-delay", "0.2s");
  await expect(page.locator(".lead-lucia")).toHaveCSS("opacity", "1");
  await page.locator("#dossier").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /Lucia/ }).click();
  await expect(page.locator(".cast-profile h3")).toHaveText("Lucia Caminos");
  await expect(page.locator(".cast-heading h2")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});
