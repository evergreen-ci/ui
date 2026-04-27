import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("announcements", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const bannerText = page.getByTestId("banner-text");
    await bannerText.clear();
    await bannerText.fill("some more banner text");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");

    await page.reload();
    await expect(bannerText).toHaveValue("some more banner text");
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
