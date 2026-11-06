import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://localhost:${port}`;
const visual = /visual\.spec\.ts$/;
const keyboard = /keyboard\.spec\.ts$/;
const touch = /touch\.spec\.ts$/;
const performance = /performance\.spec\.ts$/;
const wide = /(window-drag|context-menu)\.spec\.ts$/;
const touchDrag = /touch-drag\.spec\.ts$/;

// Modalità di layout (ADR-0007): i test @desktop presuppongono le finestre
// sovrapposte e girano solo con il desktop largo; i test @mobile girano solo
// nella modalità mobile (da 320 a 767 px e con i telefoni emulati).
const desktopOnly = /@desktop/;
const mobileOnly = /@mobile/;

const viewports = [
  { name: "chromium-320", width: 320, height: 640 },
  { name: "chromium-375", width: 375, height: 667 },
  { name: "chromium-768", width: 768, height: 1024 },
  { name: "chromium-1024", width: 1024, height: 768 },
  { name: "chromium-1440", width: 1440, height: 900 },
];

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? [["github"], ["html", { open: "never" }]] : [["list"]],
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: "disabled" },
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    ...viewports.map(({ name, width, height }) => ({
      name,
      use: { ...devices["Desktop Chrome"], viewport: { width, height } },
      testIgnore: [touch, touchDrag, performance, ...(width < 768 ? [wide] : [])],
      grepInvert: width < 768 ? desktopOnly : mobileOnly,
    })),
    {
      name: "touch-pixel-7",
      use: { ...devices["Pixel 7"] },
      testIgnore: [visual, keyboard, performance, wide],
      grepInvert: desktopOnly,
    },
    {
      name: "touch-iphone-14",
      use: { ...devices["iPhone 14"] },
      testIgnore: [visual, keyboard, performance, wide, touchDrag],
      grepInvert: desktopOnly,
    },
    {
      name: "performance",
      testMatch: performance,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "storybook",
      testDir: "tests/storybook",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 768 },
        launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] },
      },
    },
    {
      name: "firefox-1440",
      use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
      testIgnore: [visual, touch, touchDrag, performance],
      grepInvert: mobileOnly,
    },
  ],
  webServer: {
    command: "node scripts/preview.mjs",
    url: baseURL,
    reuseExistingServer: !process.env["CI"],
    env: { PORT: String(port) },
  },
});
