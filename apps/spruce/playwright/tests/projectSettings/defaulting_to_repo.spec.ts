import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
} from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Project Settings when defaulting to repo", () => {
  const origin = getProjectSettingsRoute(projectUseRepoEnabled);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test.describe("General Settings page", () => {
    test("Save button is disabled on load and shows a link to the repo", async ({
      authenticatedPage: page,
    }) => {
      await expectSaveButtonEnabled(page, false);
      await expect(page.getByTestId("attached-repo-link")).toHaveAttribute(
        "href",
        `${getRepoSettingsRoute(repo)}`,
      );
    });

    test("Preserves edits to the form when navigating between settings tabs and does not show a warning modal", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("spawn-host-input")).toHaveValue("/path");
      await page.getByTestId("spawn-host-input").fill("/path/test");
      await expectSaveButtonEnabled(page, true);
      await page.getByTestId("navitem-access").click();
      await expect(page.getByTestId("navigation-warning-modal")).toHaveCount(0);
      await page.getByTestId("navitem-general").click();
      await expect(page.getByTestId("spawn-host-input")).toHaveValue(
        "/path/test",
      );
      await expectSaveButtonEnabled(page, true);
    });

    test("Shows a 'Default to Repo' button on page", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("default-to-repo-button")).toBeVisible();
    });

    test("Shows only two radio boxes even when rendering a project that inherits from repo", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("enabled-radio-box").locator("> *"),
      ).toHaveCount(2);
    });

    test("Does not default to repo value for display name", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("display-name-input")).not.toHaveAttribute(
        "placeholder",
      );
    });

    test("Shows a navigation warning modal that lists the general page when navigating away from project settings", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("spawn-host-input").fill("/path/test");
      await expectSaveButtonEnabled(page, true);
      await page.getByText("My Patches").click();
      await expect(page.getByTestId("navigation-warning-modal")).toBeVisible();
      await expect(page.getByTestId("unsaved-pages").locator("li")).toHaveCount(
        1,
      );
      await page.keyboard.press("Escape");
    });

    test("Shows the repo value for Batch Time", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("batch-time-input")).toHaveAttribute(
        "placeholder",
        /.+/,
      );
    });

    test("Clicking on save button should show a success toast", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("spawn-host-input").fill("/path/test");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
    });

    test("Saves when batch time is updated", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("batch-time-input").clear();
      await page.getByTestId("batch-time-input").fill("12");
      await save(page);
      await expect(page.getByTestId("batch-time-input")).toHaveValue("12");
      await validateToast(
        page,
        "success",
        "Successfully updated project",
        true,
      );

      await page.getByTestId("batch-time-input").clear();
      await save(page);
      await expect(page.getByTestId("batch-time-input")).toHaveAttribute(
        "placeholder",
        "60 (Default from repo)",
      );
      await validateToast(
        page,
        "success",
        "Successfully updated project",
        true,
      );

      await page.getByTestId("attached-repo-link").click();
      await expect(page.getByTestId("batch-time-input")).toHaveValue("60");
      await page.getByTestId("batch-time-input").clear();
      await save(page);
      await expect(page.getByTestId("batch-time-input")).toHaveValue("0");
      await validateToast(page, "success", "Successfully updated repo", true);
      await page.goto(origin);
      await expect(page.getByTestId("batch-time-input")).toHaveAttribute(
        "placeholder",
        "0 (Default from repo)",
      );

      await page.goto(getProjectSettingsRoute(project));
      await expect(page.getByTestId("batch-time-input")).toHaveValue("60");
      await page.getByTestId("batch-time-input").clear();
      await save(page);
      await expect(page.getByTestId("batch-time-input")).toHaveValue("0");
      await validateToast(page, "success", "Successfully updated project");
    });
  });

  test.describe("Variables page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-variables").click();
      await expectSaveButtonEnabled(page, false);
    });

    test("Successfully saves variables and then promotes them using the promote variables modal", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").fill("a");
      await page.getByTestId("var-value-input").fill("1");
      await page
        .getByTestId("var-description-input")
        .fill("Description for variable a");
      await page.locator("label", { hasText: "Private" }).click();

      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").first().fill("b");
      await page.getByTestId("var-value-input").first().fill("2");
      await page
        .getByTestId("var-description-input")
        .first()
        .fill("Description for variable b");

      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").first().fill("c");
      await page.getByTestId("var-value-input").first().fill("3");
      await page
        .getByTestId("var-description-input")
        .first()
        .fill("Description for variable c");

      await save(page);
      await validateToast(
        page,
        "success",
        "Successfully updated project",
        true,
      );

      await expect(page.getByTestId("promote-vars-modal")).toHaveCount(0);
      await page.getByTestId("promote-vars-button").click();
      await expect(page.getByTestId("promote-vars-modal")).toBeVisible();

      const variableToPromote = page
        .getByTestId("promote-var-checkbox")
        .first();
      const checkboxId = await variableToPromote.getAttribute("id");
      await page.locator(`label[for="${checkboxId}"]`).click();

      await page.getByRole("button", { name: "Move 1 variable" }).click();
      await validateToast(
        page,
        "success",
        "Successfully moved variables to repo",
      );
    });
  });

  test.describe("GitHub page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-github-commitqueue").click();
    });

    test("Should not have the save button enabled on load", async ({
      authenticatedPage: page,
    }) => {
      await expectSaveButtonEnabled(page, false);
    });

    test("Allows overriding repo patch definitions", async ({
      authenticatedPage: page,
    }) => {
      const githubSection = page.getByTestId("github-card");
      await githubSection
        .getByText("Override Repo Patch Definition", { exact: true })
        .click();
      await expect(
        githubSection.getByLabel("Override Repo Patch Definition", {
          exact: true,
        }),
      ).toBeChecked();

      await expect(
        githubSection.getByTestId("error-banner").filter({
          hasText:
            "A GitHub Patch Definition must be specified for this feature to run.",
        }),
      ).toBeVisible();

      await githubSection
        .getByRole("button", { name: "Add Patch Definition" })
        .click();
      await githubSection.getByText("Variant Regex").click();
      await githubSection.getByTestId("variant-input").fill(".*");
      await expectSaveButtonEnabled(page, false);

      await githubSection.getByText("Variant Tags").click();
      await githubSection.getByText("Variant Regex").click();
      await expect(githubSection.getByTestId("variant-input")).toHaveValue(
        ".*",
      );
      await githubSection.getByText("Task Regex").click();
      await githubSection.getByTestId("task-input").fill(".*");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
    });

    test("Shows a warning banner when a commit check definition does not exist", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("github-checks-enabled-radio-box")
        .scrollIntoViewIfNeeded();
      await page
        .getByTestId("github-checks-enabled-radio-box")
        .locator("label", { hasText: "Enabled" })
        .click();
      await expect(
        page.getByTestId("warning-banner").filter({
          hasText:
            "This feature will only run if a Commit Check Definition is defined in the project or repo.",
        }),
      ).toBeVisible();
    });

    test("Disables Authorized Users section based on repo settings", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByText("Authorized Users")).toHaveCount(0);
      await expect(page.getByText("Authorized Teams")).toHaveCount(0);
    });

    test("Defaults to overriding repo since a patch definition is defined", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("cq-override-radio-box").locator("input").first(),
      ).toBeChecked();
    });

    test("Shows the existing patch definition", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("variant-input").last()).toHaveValue(
        "^ubuntu1604$",
      );
      await expect(page.getByTestId("task-input").last()).toHaveValue(
        "^smoke-test-endpoints$",
      );
    });

    test("Returns an error on save because no commit check definitions are defined", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page
          .getByTestId("pr-testing-enabled-radio-box")
          .getByText("Default to repo (enabled)"),
      ).toBeVisible();
      await page
        .getByTestId("pr-testing-enabled-radio-box")
        .locator("label", { hasText: /^Disabled$/ })
        .click();
      await page
        .getByTestId("manual-pr-testing-enabled-radio-box")
        .locator("label", { hasText: /^Disabled$/ })
        .click();
      await page
        .getByTestId("github-checks-enabled-radio-box")
        .locator("label", { hasText: /^Enabled$/ })
        .click();
      await save(page);
      await validateToast(
        page,
        "error",
        "There was an error saving the project",
      );
    });

    test("Defaults to repo and shows the repo's disabled patch definition", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page
          .getByTestId("accordion-toggle")
          .filter({ hasText: "Repo Patch Definition 1" }),
      ).toHaveCount(0);

      await page.goto(getRepoSettingsRoute(repo));
      await page.getByTestId("navitem-github-commitqueue").click();
      await page.getByRole("button", { name: "Add Patch Definition" }).click();
      await page.getByTestId("variant-tags-input").first().fill("vtag");
      await page.getByTestId("task-tags-input").first().fill("ttag");
      await save(page);
      await validateToast(page, "success", "Successfully updated repo", true);

      await page.goto(origin);
      await page.getByTestId("navitem-github-commitqueue").click();
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
      await page.getByTestId("accordion-toggle").scrollIntoViewIfNeeded();
      await expect(
        page
          .getByTestId("accordion-toggle")
          .filter({ hasText: "Repo Patch Definition 1" }),
      ).toBeVisible();
    });
  });

  test.describe("Patch Aliases page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-patch-aliases").click();
      await expectSaveButtonEnabled(page, false);
    });

    test("Defaults to repo patch aliases", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByLabel("Default to Repo Patch Aliases"),
      ).toHaveAttribute("checked");
    });

    test("Patch aliases added before defaulting to repo patch aliases are cleared", async ({
      authenticatedPage: page,
    }) => {
      await page
        .locator("label", { hasText: "Override Repo Patch Aliases" })
        .click();
      await expect(
        page.getByLabel("Override Repo Patch Aliases"),
      ).toHaveAttribute("aria-checked", "true");
      await expectSaveButtonEnabled(page, false);

      await page
        .getByTestId("add-button")
        .filter({ hasText: "Add Patch Alias" })
        .click();
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("alias-input").fill("my overriden alias name");
      await page
        .getByTestId("variant-tags-input")
        .first()
        .fill("alias variant tag 2");
      await page
        .getByTestId("task-tags-input")
        .first()
        .fill("alias task tag 2");
      await page.getByRole("button", { name: "Add Task Tag" }).click();
      await page
        .getByTestId("task-tags-input")
        .first()
        .fill("alias task tag 3");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");

      await page
        .locator("label", { hasText: "Default to Repo Patch Aliases" })
        .click();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expectSaveButtonEnabled(page, false);

      await page
        .locator("label", { hasText: "Override Repo Patch Aliases" })
        .click();
      await expect(page.getByTestId("alias-row")).toHaveCount(0);
    });
  });

  test.describe("Virtual Workstation page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-virtual-workstation").click();
    });

    test("Enable git clone", async ({ authenticatedPage: page }) => {
      await page.locator("label", { hasText: "Enabled" }).click();
      await expect(page.getByLabel("Enabled")).toBeChecked();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
    });

    test("Add commands", async ({ authenticatedPage: page }) => {
      await expect(page.getByLabel("Default to repo (disabled)")).toBeChecked();
      await expect(page.getByTestId("command-row")).toHaveCount(0);

      await page.getByTestId("attached-repo-link").click();
      await expect(page).toHaveURL(
        new RegExp(
          getRepoSettingsRoute(
            repo,
            ProjectSettingsTabRoutes.VirtualWorkstation,
          ),
        ),
      );
      await page.getByRole("button", { name: "Add Command" }).click();
      await page.getByTestId("command-input").fill("a repo command");
      await save(page);
      await validateToast(page, "success", "Successfully updated repo");

      await page.goto(origin);
      await page.getByTestId("navitem-virtual-workstation").click();
      await expect(
        page
          .getByTestId("command-row")
          .locator("textarea", { hasText: "a repo command" }),
      ).toHaveAttribute("aria-disabled", "true");

      await page
        .locator("label", { hasText: "Override Repo Commands" })
        .click();
      await expect(page.getByTestId("command-row")).toHaveCount(0);
      await page.getByRole("button", { name: "Add Command" }).click();
      await page.getByTestId("command-input").fill("a project command");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(
        page
          .getByTestId("command-row")
          .locator("textarea", { hasText: "a project command" }),
      ).toHaveAttribute("aria-disabled", "false");

      await page
        .locator("label", { hasText: "Default to Repo Commands" })
        .click();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(
        page
          .getByTestId("command-row")
          .locator("textarea", { hasText: "a repo command" }),
      ).toHaveAttribute("aria-disabled", "true");

      await page
        .locator("label", { hasText: "Override Repo Commands" })
        .click();
      await expect(page.getByTestId("command-row")).toHaveCount(0);
    });

    test("Allows overriding without adding a command", async ({
      authenticatedPage: page,
    }) => {
      await page
        .locator("label", { hasText: "Override Repo Commands" })
        .click();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(page.getByLabel("Override Repo Commands")).toBeChecked();
    });
  });
});
