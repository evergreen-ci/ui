import { test, expect } from "../../fixtures";
import { closeBanner } from "../../helpers";

test.describe("Announcement overlays", () => {
  test("Should not show a sitewide banner after it has been dismissed", async ({
    authenticatedPage: page,
  }) => {
    // Clear the cookie to make the banner show.
    await page
      .context()
      .clearCookies({ name: "This is an important notification" });
    await page.goto("/");
    await expect(page.getByTestId("sitewide-banner-success")).toBeVisible();
    await closeBanner(page, "sitewide-banner-success");
    await expect(page.getByTestId("sitewide-banner-success")).toBeHidden();
    await page.goto("/");
    await expect(page.getByTestId("sitewide-banner-success")).toBeHidden();
  });

  test("Should close the announcement toast if one exists", async ({
    authenticatedPage: page,
  }) => {
    await page.context().clearCookies({ name: "announcement-toast" });
    await page.goto("/");
    const toast = page.getByTestId("toast");
    await expect(toast).toBeVisible();
    await toast.locator("button").click();
    await page.goto("/");
    await expect(toast).toBeHidden();
  });
});
