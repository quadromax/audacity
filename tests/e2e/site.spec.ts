import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { DEMO_CA } from "../../src/lib/launch";
async function loadArt(page: Page) {
  // Exercise viewport loading before capturing the entire long page.
  for (const section of await page.locator("main > section").all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
  }
  await page
    .locator("main img")
    .evaluateAll((images) =>
      images.forEach((img) => img.setAttribute("loading", "eager")),
    );
  await expect
    .poll(
      () =>
        page
          .locator("main img")
          .evaluateAll((images) =>
            images.every(
              (img) =>
                img instanceof HTMLImageElement &&
                img.complete &&
                img.naturalWidth > 0,
            ),
          ),
      { timeout: 20000 },
    )
    .toBe(true);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
}
test("all routes, redirects, artwork, metadata and browser errors", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      !m.text().includes("me.kis.v2.scr.kaspersky-labs.com")
    )
      errors.push(m.text());
  }); // Host antivirus injection is blocked by CSP, not an application error.
  for (const route of [
    "/",
    "/cast",
    "/files",
    "/dossier",
    "/markets",
    "/how-to-buy",
    "/about",
    "/cred",
    "/wanted",
    "/missions",
    "/rewards",
  ]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await loadArt(page);
    expect(await page.locator('a[href="#"]').count()).toBe(0);
  }
  await page.goto("/");
  await expect(page).toHaveTitle("AUDACITY");
  for (const path of [
    "/icon.svg",
    "/opengraph-image",
    "/sitemap.xml",
    "/robots.txt",
  ])
    expect((await request.get(path)).status()).toBe(200);
  expect(errors).toEqual([]);
});
test("responsive scenes and captures at eight widths", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await loadArt(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "docs/screenshots/launch/home-" + width + ".png",
      fullPage: true,
      animations: "disabled",
    });
    if ([390, 1440].includes(width)) {
      await page.screenshot({
        path: "docs/screenshots/launch/hero-" + width + ".png",
        animations: "disabled",
      });
      for (const id of ["market", "wanted", "how-to-buy"]) {
        await page
          .locator("#" + id)
          .screenshot({
            path: "docs/screenshots/launch/" + id + "-" + width + ".png",
            animations: "disabled",
          });
      }
    }
  }
});
test("mobile navigation, Escape, focus return and route links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: /The cast/ })
    .click();
  await expect(page).toHaveURL(/\/cast$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("all eight characters, both Dimez, keyboard and swipe", async ({
  page,
}) => {
  await page.goto("/cast");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(8);
  const names = [
    "Jason Duval",
    "Lucia Caminos",
    "Cal Hampton",
    "Boobie Ike",
    "Dre’Quan Priest",
    "Real Dimez",
    "Raul Bautista",
    "Brian Heder",
  ];
  for (let i = 0; i < 8; i++) {
    await tabs.nth(i).click();
    await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".cast-profile h3")).toHaveText(names[i]);
    await expect(page.locator(".cast-portrait img")).toHaveAttribute(
      "alt",
      i === 5 ? /Bae-Luxe and Roxy/ : new RegExp(names[i]),
    );
  }
  await tabs.last().focus();
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.setViewportSize({ width: 390, height: 844 });
  const stage = page.locator(".cast-stage");
  await stage.dispatchEvent("pointerdown", {
    pointerType: "touch",
    clientX: 300,
  });
  await stage.dispatchEvent("pointerup", { pointerType: "touch", clientX: 80 });
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(5).click();
  await page.getByRole("button", { name: "Open dossier" }).click();
  await expect(
    page.getByText("Bae-Luxe · Roxy", { exact: true }),
  ).toBeVisible();
  await loadArt(page);
  await page
    .locator(".cast-gallery")
    .screenshot({ path: "docs/screenshots/launch/real-dimez-390.png" });
});
test("five meaningful missions, persistence and confirmable reset", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Open dossier" }).click();
  await page.getByRole("tab", { name: /Lucia/ }).click();
  await page.getByRole("tab", { name: /Real Dimez/ }).click();
  await page.locator("#market").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("audacity-discoveries-v3") || "[]"),
      ),
    )
    .toContain("market");
  await page.getByRole("button", { name: "Share this scene" }).click();
  await expect(page.getByText("Scene link copied.")).toBeVisible();
  await expect(page.getByText("5 / 05 DISCOVERIES")).toBeVisible();
  await page.reload();
  await expect(page.getByText("5 / 05 DISCOVERIES")).toBeVisible();
  await page
    .getByRole("button", { name: "Reset this device’s record" })
    .click();
  await page.getByRole("button", { name: "Keep record" }).click();
  await expect(page.getByText("5 / 05 DISCOVERIES")).toBeVisible();
  await page
    .getByRole("button", { name: "Reset this device’s record" })
    .click();
  await page.getByRole("button", { name: "Yes, reset record" }).click();
  await expect(page.getByText("0 / 05 DISCOVERIES")).toBeVisible();
  await page.getByRole("button", { name: /Leonida \/ postcard/ }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Save artwork" }).click();
  expect((await download).suggestedFilename()).toBe("leonida-dusk.png");
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("audacity-discoveries-v3") || "[]"),
    ),
  ).not.toContain("transmission");
});
test("demo address, disabled trading, no fake values, footer disclosures", async ({
  request,
  page,
}) => {
  expect(await (await request.get("/api/market")).json()).toMatchObject({
    status: "prelaunch",
    mint: null,
    price: null,
    marketCap: null,
    holders: null,
    pumpAvailable: false,
    metadata: { symbol: "AUDACITY" },
  });
  expect(await (await request.get("/api/chart")).json()).toMatchObject({
    status: "unavailable",
    candles: [],
  });
  await page.goto("/");
  await expect(page.locator("#contract code")).toHaveText(DEMO_CA);
  await expect(
    page
      .locator("#contract")
      .getByRole("button", { name: "Copy contract address" }),
  ).toBeEnabled();
  await expect(page.locator('a[href*="pump.fun/coin"]')).toHaveCount(0);
  await expect(page.getByText("PRELAUNCH", { exact: true })).toHaveCount(0);
  await expect(page.getByText("CONTRACT REVEAL COMING SOON")).toHaveCount(0);
  await expect(page.locator("header").getByText(/Not affiliated/)).toHaveCount(
    0,
  );
  await expect(page.locator("#legal")).toContainText("Not affiliated");
  await page.goto("/how-to-buy");
  await expect(page.getByRole("link", { name: "Phantom" })).toHaveAttribute(
    "href",
    "https://phantom.com/",
  );
  await expect(
    page.locator("main").getByRole("button", { name: "LAUNCHING SOON" }),
  ).toHaveCount(0);
  expect((await request.get("/api/profile")).status()).toBe(401);
});
test("sound requires opt-in, real playback, volume, route continuity, mute and persistence", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    (window as unknown as { audioContexts: AudioContext[] }).audioContexts = [];
    window.AudioContext = class extends Original {
      constructor(...args: ConstructorParameters<typeof AudioContext>) {
        super(...args);
        (
          window as unknown as { audioContexts: AudioContext[] }
        ).audioContexts.push(this);
      }
    };
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Enable soundtrack" }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { audioContexts: AudioContext[] }).audioContexts
          .length,
    ),
  ).toBe(0);
  await page.getByRole("button", { name: "Enable soundtrack" }).click();
  await expect(
    page.getByRole("button", { name: "Mute soundtrack" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { audioContexts: AudioContext[] })
          .audioContexts[0].state,
    ),
  ).toBe("running");
  await page.getByRole("slider", { name: "Soundtrack volume" }).fill("64");
  await expect(page.getByRole("slider")).toHaveValue("64");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: /The cast/ })
    .click();
  await expect(page).toHaveURL(/\/cast$/);
  await expect(
    page.getByRole("button", { name: "Mute soundtrack" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { audioContexts: AudioContext[] }).audioContexts
          .length,
    ),
  ).toBe(1);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume soundtrack" }),
  ).toBeVisible();
  await expect(page.getByRole("slider")).toHaveValue("64");
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { audioContexts: AudioContext[] }).audioContexts
          .length,
    ),
  ).toBe(0);
  await page.getByRole("button", { name: "Resume soundtrack" }).click();
  await page.getByRole("button", { name: "Mute soundtrack" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { audioContexts: AudioContext[] })
            .audioContexts[0].state,
      ),
    )
    .toBe("suspended");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enable soundtrack" }),
  ).toBeVisible();
});
test("mobile sound and volume stay within the navigation at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Enable soundtrack" }).click();
  await expect(page.getByRole("button", { name: "Mute soundtrack" })).toBeVisible();
  await page.getByRole("slider", { name: "Soundtrack volume" }).fill("55");
  const box = await page.locator(".audio-widget label").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  await page.screenshot({ path: "docs/screenshots/launch/audio-320.png" });
  await page.getByRole("button", { name: "Mute soundtrack" }).click();
});
test("storage failures leave missions and audio controls usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("disabled");
    };
    Storage.prototype.getItem = () => {
      throw new Error("disabled");
    };
    Storage.prototype.removeItem = () => {
      throw new Error("disabled");
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Open dossier" }).click();
  await expect(page.locator(".wanted-meter")).toContainText("1 / 05");
  await page.getByRole("slider").fill("45");
  await expect(page.getByRole("slider")).toHaveValue("45");
});
test("location scenes retain working artwork", async ({ page }) => {
  await page.goto("/");
  const gallery = page.getByRole("group", {
    name: "Explore Leonida locations",
  });
  for (const [name, title] of [
    ["The waterfront", "ROOM FOR ONE MORE."],
    ["After hours", "AFTER DARK, ANYTHING."],
    ["The causeway", "THE LONG WAY HOME."],
  ]) {
    await gallery.getByRole("button", { name: new RegExp(name) }).click();
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});
test("keyboard entry and automated WCAG checks", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByText("Skip to content", { exact: true }),
  ).toBeFocused();
  for (const route of ["/", "/cast", "/markets", "/about", "/how-to-buy"]) {
    await page.goto(route);
    await loadArt(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
