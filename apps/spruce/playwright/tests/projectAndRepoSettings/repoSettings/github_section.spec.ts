import { test, expect } from "../../../fixtures";
import { clickRadio, validateToast } from "../../../helpers";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  projectUseRepoEnabled,
  repo,
} from "../constants";
import { expectSaveButtonEnabled, save } from "../utils";

test.describe("GitHub page", () => {
  const origin = getRepoSettingsRoute(repo);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-github-commitqueue").click();
    await expectSaveButtonEnabled(page, false);
  });

  test.describe("GitHub section", () => {
    test("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", async ({
      authenticatedPage: page,
    }) => {
      const githubChecksEnabledRadio = page
        .getByTestId("github-checks-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(githubChecksEnabledRadio);
      const errorBanner = page.getByTestId("error-banner").filter({
        hasText:
          "A Commit Check Definition must be specified for this feature to run.",
      });
      await expect(errorBanner).toBeVisible();
      const githubChecksDisabledRadio = page
        .getByTestId("github-checks-enabled-radio-box")
        .getByRole("radio", { name: "Disabled", exact: true });
      await clickRadio(githubChecksDisabledRadio);
      await expect(errorBanner).toHaveCount(0);
    });

    test("Allows enabling manual PR testing", async ({
      authenticatedPage: page,
    }) => {
      const enabledRadio = page
        .getByTestId("manual-pr-testing-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(enabledRadio);
      await expect(enabledRadio).toBeChecked();
    });

    test("Saving a patch definition should hide the error banner, success toast and displays disabled patch definitions for the repo", async ({
      authenticatedPage: page,
    }) => {
      const errorBanner = page.getByText(
        "A GitHub Patch Definition must be specified for this feature to run.",
      );
      await expect(errorBanner).toBeVisible();
      await page.getByRole("button", { name: "Add patch definition" }).click();
      await expect(errorBanner).toHaveCount(0);
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("variant-tags-input").first().fill("vtag");
      await page.getByTestId("task-tags-input").first().fill("ttag");
      await expectSaveButtonEnabled(page, true);
      await save(page);
      await validateToast(page, "success", "Successfully updated repo");

      await page.goto(getProjectSettingsRoute(projectUseRepoEnabled));
      await page.getByTestId("navitem-github-commitqueue").click();
      const patchDefAccordion = page
        .getByTestId("accordion-toggle")
        .filter({ hasText: "Repo Patch Definition 1" });
      await patchDefAccordion.click();
      await expect(page.getByTestId("variant-tags-input")).toHaveValue("vtag");
      await expect(page.getByTestId("variant-tags-input")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      await expect(page.getByTestId("task-tags-input")).toHaveValue("ttag");
      await expect(page.getByTestId("task-tags-input")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      await expect(
        page.getByText(
          "A GitHub Patch Definition must be specified for this feature to run.",
        ),
      ).toHaveCount(0);
    });
  });

  test.describe("Merge Queue section", () => {
    test("Enabling merge queue shows hidden inputs and error banner", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByText("Merge Queue Patch Definitions"),
      ).toBeHidden();

      const mergeQueueEnabledRadio = page
        .getByTestId("cq-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(mergeQueueEnabledRadio);

      await expect(
        page.getByText("Merge Queue Patch Definitions"),
      ).toBeVisible();
      await expect(
        page.getByTestId("error-banner").filter({
          hasText:
            "A Merge Queue Patch Definition must be specified for this feature to run.",
        }),
      ).toBeVisible();
    });

    test("Does not show override buttons for merge queue patch definitions", async ({
      authenticatedPage: page,
    }) => {
      const mergeQueueEnabledRadio = page
        .getByTestId("cq-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(mergeQueueEnabledRadio);
      await expect(page.getByTestId("cq-override-radio-box")).toHaveCount(0);
    });

    test("Saves a merge queue definition", async ({
      authenticatedPage: page,
    }) => {
      const mergeQueueEnabledRadio = page
        .getByTestId("cq-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(mergeQueueEnabledRadio);
      await page.getByRole("button", { name: "Add patch definition" }).click();
      await page.getByTestId("variant-tags-input").first().fill("vtag");
      await page.getByTestId("task-tags-input").first().fill("ttag");
      await expectSaveButtonEnabled(page, false);
      await page
        .getByRole("button", { name: "Add merge queue patch definition" })
        .click();
      await page.getByTestId("variant-tags-input").last().fill("cqvtag");
      await page.getByTestId("task-tags-input").last().fill("cqttag");
      await expect(page.getByTestId("warning-banner")).toHaveCount(0);
      await expect(page.getByTestId("error-banner")).toHaveCount(0);
      await save(page);
      await validateToast(page, "success", "Successfully updated repo");
    });
  });
});
