import { SEEN_GITHUB_NAV_GUIDE_CUE } from "../../../src/constants/cookies";
import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Pull Requests project settings when GitHub webhooks are disabled", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: SEEN_GITHUB_NAV_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/project/logkeeper/settings/pull-requests");
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("shows a disabled webhooks banner when webhooks are disabled", async ({
    authenticatedPage: page,
  }) => {
    const banner = page.getByTestId("disabled-webhook-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(
      "GitHub features are disabled because the Evergreen GitHub App is not",
    );
  });

  test("disables all interactive elements on the page", async ({
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

test.describe("Pull Requests project settings when GitHub webhooks are enabled", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: SEEN_GITHUB_NAV_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/repo/602d70a2b2373672ee493184/settings/pull-requests");
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("allows enabling manual PR testing", async ({
    authenticatedPage: page,
  }) => {
    const manualEnabledLabel = page
      .getByTestId("manual-pr-testing-enabled-radio-box")
      .locator("label", { hasText: "Enabled" });
    await manualEnabledLabel.scrollIntoViewIfNeeded();
    await manualEnabledLabel.click();
    const manualEnabledRadio = page
      .getByTestId("manual-pr-testing-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await expect(manualEnabledRadio).toBeChecked();
  });

  test("saving a patch definition hides the error banner, shows success toast, and disables repo patch definitions", async ({
    authenticatedPage: page,
  }) => {
    const errorText =
      "A GitHub Patch Definition must be specified for this feature to run.";
    const errorBanner = page.getByText(errorText);
    await expect(errorBanner).toBeVisible();

    await page.getByRole("button", { name: "Add patch definition" }).click();
    await expect(page.getByText(errorText)).toHaveCount(0);
    await page.getByTestId("variant-tags-input").first().fill("vtag");
    await page.getByTestId("task-tags-input").first().fill("ttag");
    const saveButton = page.getByTestId("save-settings-button");
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    const modal = page.getByTestId("save-changes-modal");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Save changes" }).click();
    await expect(modal).toBeHidden();
    await validateToast(page, "success", "Successfully updated repo");

    await page.goto("/project/evergreen/settings/pull-requests");
    const patchDefAccordion = page.getByText("Repo Patch Definition 1");
    await patchDefAccordion.scrollIntoViewIfNeeded();
    await patchDefAccordion.click();
    const variantInput = page.getByTestId("variant-tags-input").first();
    const taskInput = page.getByTestId("task-tags-input").first();

    await expect(variantInput).toHaveValue("vtag");
    await expect(variantInput).toHaveAttribute("aria-disabled", "true");
    await expect(taskInput).toHaveValue("ttag");
    await expect(taskInput).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByText(errorText)).toHaveCount(0);
  });
});
