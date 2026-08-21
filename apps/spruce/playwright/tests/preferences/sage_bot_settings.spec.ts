// TODO: DEVPROD-33674 - Re-enable and update these tests when GitHub OAuth credentials are implemented.
// The Cursor API key backend endpoints have been removed; the Sage Bot Settings tab will be
// repurposed for GitHub OAuth credentials.
import { expect, test } from "../../fixtures";

test.describe("Sage Bot Settings", () => {
  test("should navigate to Sage Bot Settings from sidebar and display the tab", async ({
    page,
  }) => {
    await page.goto("/preferences/profile");
    await page.getByTestId("sage-bot-settings-nav-tab").click();
    await expect(page).toHaveURL(/\/preferences\/sage-bot-settings/);
  });
});
