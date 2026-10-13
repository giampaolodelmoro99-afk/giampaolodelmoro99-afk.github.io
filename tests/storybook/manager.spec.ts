import { expect, test } from "@playwright/test";

test("il manager di Storybook si apre sotto la sua CSP, senza errori né richieste esterne", async ({
  page,
  baseURL,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol !== "data:" && url.origin !== new URL(baseURL ?? "").origin) {
      external.push(request.url());
    }
  });

  await page.goto("/storybook/?path=/docs/fondamenta-introduzione--docs");
  await expect(page.locator('[data-item-id="fondamenta-introduzione--docs"]')).toBeVisible();
  const preview = page.frameLocator("#storybook-preview-iframe");
  await expect(preview.getByRole("heading", { name: "GDM 95" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");

  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
