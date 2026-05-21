import { test, expect } from "@playwright/test";

test.describe("Storefront smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /GALLE/i }).first()).toBeVisible();
    await expect(page.getByText(/Ethereal/i).first()).toBeVisible();
  });

  test("shop page lists products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: /Boutique|Shop|Collection/i }).first()).toBeVisible();
  });

  test("cart page is reachable", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator("body")).toContainText(/cart|bag|empty/i);
  });

  test("scent quiz page loads", async ({ page }) => {
    await page.goto("/scent-quiz");
    await expect(page.getByText(/Scent Discovery/i).first()).toBeVisible();
  });
});
