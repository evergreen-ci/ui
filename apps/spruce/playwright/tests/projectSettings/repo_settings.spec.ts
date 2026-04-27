import { test, expect } from "../../fixtures";
import { clickLabelForLocator, validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
} from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Repo Settings", () => {
  const origin = getRepoSettingsRoute(repo);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test.describe("General settings page", () => {
    test("Should have the save button disabled on load", async ({
      authenticatedPage: page,
    }) => {
      await expectSaveButtonEnabled(page, false);
    });

    test("Does not show a 'Default to Repo' button on page", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("default-to-repo-button")).toHaveCount(0);
    });

    test("Does not show a 'Move to New Repo' button on page", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("move-repo-button")).toHaveCount(0);
    });

    test("Does not show an Attach/Detach to Repo button on page", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("attach-repo-button")).toHaveCount(0);
    });

    test("Does not show a 'Go to repo settings' link on page", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("attached-repo-link")).toHaveCount(0);
    });

    test("Inputting a display name then clicking save shows a success toast", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("display-name-input").fill("evg");
      await save(page);
      await validateToast(page, "success", "Successfully updated repo");
    });
  });

  test.describe("GitHub page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-github-commitqueue").click();
      await expectSaveButtonEnabled(page, false);
    });

    test.describe("GitHub section", () => {
      test("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", async ({
        authenticatedPage: page,
      }) => {
        const githubChecksEnabledRadio = page
          .getByTestId("github-checks-enabled-radio-box")
          .getByLabel("Enabled");
        await clickLabelForLocator(githubChecksEnabledRadio);
        const errorBanner = page.getByTestId("error-banner").filter({
          hasText:
            "A Commit Check Definition must be specified for this feature to run.",
        });
        await expect(errorBanner).toBeVisible();
        const githubChecksDisabledRadio = page
          .getByTestId("github-checks-enabled-radio-box")
          .getByLabel("Disabled");
        await clickLabelForLocator(githubChecksDisabledRadio);
        await expect(errorBanner).toHaveCount(0);
      });

      test("Allows enabling manual PR testing", async ({
        authenticatedPage: page,
      }) => {
        await page
          .getByTestId("manual-pr-testing-enabled-radio-box")
          .locator("> *")
          .first()
          .click();
      });

      test("Saving a patch definition should hide the error banner, success toast and displays disabled patch definitions for the repo", async ({
        authenticatedPage: page,
      }) => {
        const errorBanner = page.getByText(
          "A GitHub Patch Definition must be specified for this feature to run.",
        );
        await expect(errorBanner).toBeVisible();
        await page
          .getByRole("button", { name: "Add Patch Definition" })
          .click();
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
        await patchDefAccordion.scrollIntoViewIfNeeded();
        await patchDefAccordion.click();
        await expect(page.getByTestId("variant-tags-input")).toHaveValue(
          "vtag",
        );
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
      test.beforeEach(async ({ authenticatedPage: page }) => {
        const mergeQueueEnabledRadio = page
          .getByTestId("cq-enabled-radio-box")
          .getByLabel("Enabled");
        await mergeQueueEnabledRadio.scrollIntoViewIfNeeded();
        await clickLabelForLocator(mergeQueueEnabledRadio);
      });

      test("Enabling merge queue shows hidden inputs and error banner", async ({
        authenticatedPage: page,
      }) => {
        const cqCardFields = page.getByTestId("cq-card").locator("> *");
        await expect(cqCardFields).toHaveCount(2);

        const mergeQueueEnabledRadio = page
          .getByTestId("cq-enabled-radio-box")
          .getByLabel("Enabled");
        await clickLabelForLocator(mergeQueueEnabledRadio);
        await expect(cqCardFields).toHaveCount(3);
        await page
          .getByText("Merge Queue Patch Definitions")
          .scrollIntoViewIfNeeded();
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
          .getByLabel("Enabled");
        await clickLabelForLocator(mergeQueueEnabledRadio);
        await expect(page.getByTestId("cq-override-radio-box")).toHaveCount(0);
      });

      test("Saves a merge queue definition", async ({
        authenticatedPage: page,
      }) => {
        const mergeQueueEnabledRadio = page
          .getByTestId("cq-enabled-radio-box")
          .getByLabel("Enabled");
        await clickLabelForLocator(mergeQueueEnabledRadio);
        await page
          .getByRole("button", { name: "Add Patch Definition" })
          .click();
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

  test.describe("Patch Aliases page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-patch-aliases").click();
      await expectSaveButtonEnabled(page, false);
      await expect(
        page.getByTestId("patch-aliases-override-radio-box"),
      ).toHaveCount(0);
    });

    test("Saving a patch alias shows a success toast, the alias name in the card title and in the repo defaulted project", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("add-button")
        .filter({ hasText: "Add Patch Alias" })
        .click();
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "New Patch Alias" }),
      ).toBeVisible();
      await page.getByTestId("alias-input").fill("my alias name");
      await expectSaveButtonEnabled(page, false);
      await page
        .getByTestId("variant-tags-input")
        .first()
        .fill("alias variant tag");
      await page.getByTestId("task-tags-input").first().fill("alias task tag");
      await save(page);
      await validateToast(page, "success", "Successfully updated repo", true);
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "my alias name" }),
      ).toBeVisible();

      await page.reload();
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "my alias name" }),
      ).toBeVisible();

      await page.goto(
        getProjectSettingsRoute(
          projectUseRepoEnabled,
          ProjectSettingsTabRoutes.Access,
        ),
      );
      await expect(page.getByTestId("default-to-repo-button")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
      await page.getByTestId("default-to-repo-button").click();
      await expect(page.getByTestId("default-to-repo-modal")).toBeVisible();
      await page
        .getByLabel('Type "confirm" to confirm your action')
        .fill("confirm");
      await page
        .getByTestId("default-to-repo-modal")
        .getByRole("button", { name: "Confirm" })
        .click();
      await validateToast(
        page,
        "success",
        "Successfully defaulted page to repo",
      );
      await page.getByTestId("navitem-patch-aliases").click();
      await expect(
        page
          .getByTestId("expandable-card-title")
          .filter({ hasText: "my alias name" }),
      ).toBeVisible();

      const cardTitle = page
        .getByTestId("expandable-card-title")
        .filter({ hasText: "my alias name" });
      await cardTitle.click();
      await expect(
        page.getByTestId("expandable-card").locator("input").first(),
      ).toHaveAttribute("aria-disabled", "true");
    });

    test("Saving a Patch Trigger Alias shows a success toast and updates the Github page", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("add-button")
        .filter({ hasText: "Add Patch Trigger Alias" })
        .click();
      await page.getByTestId("pta-alias-input").fill("my-alias");
      await page.getByTestId("project-input").fill("spruce");
      await page.getByTestId("module-input").fill("module_name");
      await page.getByText("Variant/Task", { exact: true }).click();
      await page.getByTestId("variant-regex-input").fill(".*");
      await page.getByTestId("task-regex-input").fill(".*");

      const githubPRLabel = "Schedule in GitHub Pull Requests";
      const pullRequestCheckbox = page.getByLabel(githubPRLabel);
      await expect(pullRequestCheckbox).not.toBeChecked();
      await clickLabelForLocator(page.getByLabel(githubPRLabel));
      await expect(pullRequestCheckbox).toBeChecked();

      const githubMQLabel = "Schedule in GitHub Merge Queue";
      const mergeQueueCheckbox = page.getByLabel(githubMQLabel);
      await expect(mergeQueueCheckbox).not.toBeChecked();
      await clickLabelForLocator(page.getByLabel(githubMQLabel));
      await expect(mergeQueueCheckbox).toBeChecked();

      await save(page);
      await validateToast(page, "success", "Successfully updated repo");
      await expectSaveButtonEnabled(page, false);

      await page.getByTestId("navitem-github-commitqueue").click();

      await page
        .getByText("Pull Request Trigger Aliases")
        .scrollIntoViewIfNeeded();
      const prTriggerAliases = page.getByTestId("github-pr-trigger-aliases");
      await expect(prTriggerAliases.getByTestId("pta-item")).toHaveCount(1);
      await expect(prTriggerAliases.getByText("my-alias")).toBeVisible();
      await prTriggerAliases.getByTestId("pta-item").hover();
      await expect(page.getByTestId("pta-tooltip")).toHaveCount(1);
      await expect(page.getByTestId("pta-tooltip")).toBeVisible();
      await expect(page.getByTestId("pta-tooltip")).toContainText("spruce");
      await expect(page.getByTestId("pta-tooltip")).toContainText(
        "module_name",
      );
      await expect(page.getByTestId("pta-tooltip")).toContainText(
        "Variant/Task Regex Pairs",
      );

      await page
        .getByText("Merge Queue Trigger Aliases")
        .scrollIntoViewIfNeeded();
      const mqTriggerAliases = page.getByTestId("github-mq-trigger-aliases");
      await expect(mqTriggerAliases.getByTestId("pta-item")).toHaveCount(1);
      await expect(mqTriggerAliases.getByText("my-alias")).toBeVisible();
      await mqTriggerAliases.getByTestId("pta-item").hover();
      await expect(page.getByTestId("pta-tooltip")).toHaveCount(1);
      await expect(page.getByTestId("pta-tooltip")).toBeVisible();
      await expect(page.getByTestId("pta-tooltip")).toContainText("spruce");
      await expect(page.getByTestId("pta-tooltip")).toContainText(
        "module_name",
      );
      await expect(page.getByTestId("pta-tooltip")).toContainText(
        "Variant/Task Regex Pairs",
      );
    });
  });

  test.describe("Virtual Workstation page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-virtual-workstation").click();
    });

    test("Adds two commands and then reorders them", async ({
      authenticatedPage: page,
    }) => {
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("add-button").click();
      await page.getByTestId("command-input").fill("command 1");
      await page.getByTestId("directory-input").fill("mongodb.user.directory");

      await page.getByTestId("add-button").click();
      await page.getByTestId("command-input").nth(1).fill("command 2");
      await save(page);
      await validateToast(page, "success", "Successfully updated repo");
      await page.getByTestId("array-down-button").click();
      await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
      await save(page);
      await validateToast(page, "success", "Successfully updated repo");
      await expect(page.getByTestId("command-input").first()).toHaveValue(
        "command 2",
      );
      await expect(page.getByTestId("command-input").nth(1)).toHaveValue(
        "command 1",
      );
    });
  });
});
