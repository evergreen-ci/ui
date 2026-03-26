import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Parsley AI", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(logLink);
  });

  test("opens the AI drawer and logs in", async ({ authenticatedPage }) => {
    await authenticatedPage.locator("[data-cy^='log-row-']").first().waitFor();
    expect(
      await helpers.getByDataCy(authenticatedPage, "ansi-row").count(),
    ).toBeGreaterThan(0);

    const parsleyAIButton = authenticatedPage.getByRole("button", {
      name: "Parsley AI",
    });
    await expect(parsleyAIButton).toBeEnabled();
    await parsleyAIButton.click();

    // Mock the login endpoint.
    await authenticatedPage.route(
      "http://localhost:8080/login",
      async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            message: "Logged in successfully, you may close this window",
          }),
          contentType: "application/json",
        });
      },
    );

    // Stub window.open so the login popup doesn't navigate to a server
    // that isn't running in CI. The polling fetch from beginPollingAuth()
    // is still intercepted above.
    await authenticatedPage.evaluate(() => {
      window.open = () => null;
    });

    const loginPromise = authenticatedPage.waitForResponse(
      "http://localhost:8080/login",
    );
    await authenticatedPage.getByRole("button", { name: "Log in" }).click();
    await loginPromise;

    await expect(
      authenticatedPage.getByText("Suggested Prompts"),
    ).toBeVisible();
  });
});
