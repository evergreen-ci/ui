import { test, expect } from "../../fixtures";

test.describe("Github username banner", () => {
  test("should show the banner on the my patches page if user doesn't have a github username", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("github-username-banner")).toBeVisible();
  });
});
