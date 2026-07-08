// TODO: DEVPROD-33674 - Re-enable and update these tests when GitHub OAuth credentials are implemented.
// The Cursor API key backend endpoints have been removed; the Sage Bot Settings tab will be
// repurposed for GitHub OAuth credentials.
import { test, expect } from "../../fixtures";

const route = "/preferences/sage-bot-settings";

test.describe("Sage Bot Settings", () => {
  test.skip(
    true,
    "TODO: DEVPROD-33674 - Disabled until GitHub OAuth credentials are implemented",
  );

  test("should navigate to Sage Bot Settings from sidebar and display the tab", async ({
    page,
  }) => {
    await page.goto("/preferences/profile");
    await page.getByTestId("sage-bot-settings-nav-tab").click();
    await expect(page).toHaveURL(/\/preferences\/sage-bot-settings/);
  });

  test("should display the tab content", async ({ page }) => {
    await page.goto(route);
    // TODO: DEVPROD-33674 - Add assertions for GitHub OAuth credential UI
  });
});
