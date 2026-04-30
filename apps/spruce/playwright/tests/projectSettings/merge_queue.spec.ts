import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Merge Queue project settings when GitHub webhooks are disabled", () => {
  const origin = "/project/logkeeper/settings/merge-queue";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("Merge Queue page shows a disabled webhooks banner when webhooks are disabled", async ({
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

test.describe("Merge Queue project settings when GitHub webhooks are enabled", () => {
  const origin = "/project/spruce/settings/merge-queue";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("Enabling merge queue shows hidden inputs and error banner", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("mq-enabled-radio-box")
      .locator("label", { hasText: "Enabled" })
      .click();
    await expect(page.getByText("Merge Queue Patch Definitions")).toBeVisible();

    const errorBanner = page.getByTestId("error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(
      "A Merge Queue Patch Definition must be specified for this feature to run.",
    );
  });

  test("Saves a merge queue definition", async ({
    authenticatedPage: page,
  }) => {
    await page
      .getByTestId("mq-enabled-radio-box")
      .locator("label", { hasText: "Enabled" })
      .click();
    await page
      .getByRole("button", { name: "Add merge queue patch definition" })
      .click();
    await page.getByTestId("variant-tags-input").first().fill("vtag");
    await page.getByTestId("task-tags-input").first().fill("ttag");

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
