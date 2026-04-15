import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("project banners", () => {
  const projectWithrepotrackerError = "/project/mongodb-mongo-test/waterfall";

  test.describe("repotracker banner", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(projectWithrepotrackerError);
    });

    test("should be able to clear the repotracker error", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("repotracker-error-banner")).toBeVisible();
      await expect(page.getByTestId("repotracker-error-trigger")).toBeVisible();
      await page.getByTestId("repotracker-error-trigger").click();
      await expect(page.getByTestId("repotracker-error-modal")).toBeVisible();
      await page
        .getByLabel("Base Revision")
        .fill("7ad0f0571691fa5063b757762a5b103999290fa8");
      await expect(
        page.getByRole("button", { name: "Confirm" }),
      ).not.toHaveAttribute("aria-disabled", "true");
      await page.getByRole("button", { name: "Confirm" }).click();
      await validateToast(
        page,
        "success",
        "Successfully updated merge base revision",
      );
      await expect(page.getByTestId("repotracker-error-banner")).toBeHidden();
    });
  });
});
