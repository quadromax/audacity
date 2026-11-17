import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  use: {
    baseURL: "http://127.0.0.1:3147",
    browserName: "chromium",
    channel: "msedge",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: "npm run start -- --port 3147",
    url: "http://127.0.0.1:3147",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
