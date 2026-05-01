import { SEEN_GITHUB_NAV_GUIDE_CUE } from "../../../src/constants/cookies";
import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Commit Checks project settings when GitHub webhooks are disabled", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: SEEN_GITHUB_NAV_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/project/logkeeper/settings/commit-checks");
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("Commit Checks page shows a disabled webhooks banner when webhooks are disabled", async ({
    authenticatedPage: page,
  }) => {
    const banner = page.getByTestId("disabled-webhook-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(
      "GitHub features are disabled because the Evergreen GitHub App is not",
    );
  });

  test("Disables all interactive elements on the page", async ({
    authenticatedPage: page,
  }) => {
    const settingsPage = page.getByTestId("project-settings-page");
    await expect(
      settingsPage.locator('button:not([aria-disabled="true"])'),
    ).toHaveCount(0);
    await expect(page.locator('input:not([aria-disabled="true"])')).toHaveCount(
      0,
    );
  });
});

test.describe("Commit Checks project settings when GitHub webhooks are enabled", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: SEEN_GITHUB_NAV_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/project/spruce/settings/commit-checks");
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("github-checks-enabled-radio-box")
      .locator("label")
      .first()
      .click();

    const errorBanner = page.getByTestId("error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(
      "A Commit Check Definition must be specified for this feature to run.",
    );
    await page
      .getByTestId("github-checks-enabled-radio-box")
      .locator("label")
      .last()
      .click();
    await expect(page.getByTestId("error-banner")).toHaveCount(0);
  });

  test("Saves successfully when Commit Checks are enabled and a Commit Check Definition is provided", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("github-checks-enabled-radio-box")
      .locator("label")
      .first()
      .click();
    await page.getByRole("button", { name: "Add definition" }).click();
    await page.getByTestId("variant-tags-input").first().fill("vtag");
    await page.getByTestId("task-tags-input").first().fill("ttag");
    await expect(page.getByTestId("error-banner")).toHaveCount(0);

    const saveButton = page.getByTestId("save-settings-button");
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    const modal = page.getByTestId("save-changes-modal");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Save changes" }).click();
    await expect(modal).toBeHidden();
    await validateToast(page, "success", "Successfully updated project");
  });
});
