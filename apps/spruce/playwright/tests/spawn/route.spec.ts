import { test, expect } from "../../fixtures";

test.describe("Navigating to Spawn Host and Spawn Volume pages", () => {
  test("Navigating to /spawn will redirect to /spawn/host", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/spawn");
    await expect(page).toHaveURL("/spawn/host");
  });

  test("Navigating to /spawn/not-a-route will redirect to /spawn/host", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/spawn/not-a-route");
    await expect(page).toHaveURL("/spawn/host");
  });

  test("Clicking on the Volume side nav item will redirect to /spawn/volume", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/spawn/host");
    await page.getByTestId("volume-nav-tab").click();
    await expect(page).toHaveURL("/spawn/volume");
  });

  test("Clicking on the Host side nav item will redirect to /spawn/host", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/spawn/volume");
    await page.getByTestId("host-nav-tab").click();
    await expect(page).toHaveURL("/spawn/host");
  });
});
