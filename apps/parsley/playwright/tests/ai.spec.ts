import { test, expect } from "@playwright/test";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Parsley AI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(logLink);
  });

  test("opens the AI drawer and logs in", async ({ page }) => {
    await page.locator("[data-cy^='log-row-']").first().waitFor();
    expect(await page.getByTestId("ansi-row").count()).toBeGreaterThan(0);

    const parsleyAIButton = page.getByRole("button", {
      name: "Parsley AI",
    });
    await expect(parsleyAIButton).toBeEnabled();
    await parsleyAIButton.click();

    // Mock the login endpoint.
    await page.route("http://localhost:8080/login", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          message: "Logged in successfully, you may close this window",
        }),
        contentType: "application/json",
      });
    });

    // Stub window.open so the login popup doesn't navigate to a server
    // that isn't running in CI. The polling fetch from beginPollingAuth()
    // is still intercepted above.
    await page.evaluate(() => {
      window.open = () => null;
    });

    const loginPromise = page.waitForResponse("http://localhost:8080/login");
    await page.getByRole("button", { name: "Log in" }).click();
    await loginPromise;

    await expect(page.getByText("Suggested Prompts")).toBeVisible();
  });
});
