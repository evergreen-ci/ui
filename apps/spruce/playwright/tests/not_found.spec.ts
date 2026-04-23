import { test, expect } from "../fixtures";

test.describe("404 Page", () => {
  test("Displays 404 page for routes that do not exist when user is logged in.", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/i-still-dont-exist");
    await expect(page.getByTestId("404")).toBeVisible();
    await page.goto("/patch/5e4ff3abe3c3317e352062e4");
    await expect(page.getByTestId("404")).toBeHidden();
  });
});
