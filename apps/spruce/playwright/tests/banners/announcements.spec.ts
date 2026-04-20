import { test, expect } from "fixtures";

test.describe("Announcement overlays", () => {
  test("Should not show a sitewide banner after it has been dismissed", async ({
    authenticatedPage: page,
  }) => {
    // Clear the cookie to make the banner show.
    await page
      .context()
      .clearCookies({ name: "This is an important notification" });
    await page.goto("/");
    const banner = page.getByTestId("sitewide-banner-success");
    await expect(banner).toBeVisible();

    await banner.locator("[aria-label='X Icon']").click();
    await expect(banner).toBeHidden();

    await page.goto("/");
    await expect(banner).toBeHidden();
  });
});
