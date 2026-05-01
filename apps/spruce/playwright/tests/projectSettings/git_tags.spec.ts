import { clickRadio } from "@evg-ui/playwright-config/helpers";
import { SEEN_GITHUB_NAV_GUIDE_CUE } from "../../../src/constants/cookies";
import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Git Tags project settings when GitHub webhooks are disabled", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: SEEN_GITHUB_NAV_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/project/logkeeper/settings/git-tags");
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();
  });

  test("Git tags page shows a disabled webhooks banner when webhooks are disabled", async ({
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

test.describe("Git Tags project settings when GitHub webhooks are enabled", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: SEEN_GITHUB_NAV_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    await page.goto("/repo/602d70a2b2373672ee493184/settings/git-tags");
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();
  });

  test("Saves successfully when Git Tags are enabled and a Git Tag Definition is provided", async ({
    authenticatedPage: page,
  }) => {
    const gitTagRadioBox = page.getByTestId("git-tag-enabled-radio-box");
    const enabledRadio = gitTagRadioBox.getByRole("radio", { name: "Enabled" });
    await clickRadio(enabledRadio);
    const errorText =
      "A Git Tag Version Definition must be specified for this feature to run.";
    const errorBanner = page.getByTestId("error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(errorText);

    await page
      .getByTestId("add-button")
      .filter({ hasText: "Add git tag" })
      .click();
    await page.getByTestId("git-tag-input").fill("v*");
    await page.getByTestId("remote-path-input").fill("./evergreen.yml");
    await expect(page.getByTestId("error-banner")).toHaveCount(0);

    const saveButton = page.getByTestId("save-settings-button");
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    const modal = page.getByTestId("save-changes-modal");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Save changes" }).click();
    await expect(modal).toBeHidden();
    await validateToast(page, "success", "Successfully updated repo");
  });
});
