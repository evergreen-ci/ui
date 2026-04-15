import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("host/host_core", () => {
  test.describe("Host load page with nonexistent host", () => {
    test("Should show an error message when navigating to a nonexistent host id", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("host/not-real");
      await validateToast(page, "error", "There was an error loading the host");
    });
  });

  test.describe("Host page title is displayed", () => {
    test("title shows the host name", async ({ authenticatedPage: page }) => {
      await page.goto("host/macos-1014-68.macstadium.build.10gen");
      await expect(page.getByTestId("page-title")).toContainText(
        "Host: macos-1014-68.macstadium.build.10gen",
      );
    });
  });
});
