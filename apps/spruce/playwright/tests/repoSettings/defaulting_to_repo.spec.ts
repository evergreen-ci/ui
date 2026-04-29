import { test, expect } from "../../fixtures";
import { clickCheckbox, clickRadio, validateToast } from "../../helpers";
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
      const defaultToRepoButton = page.getByRole("button", {
        name: "Default to repo on page",
      });
      await expect(defaultToRepoButton).toBeVisible();
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
      await page.getByRole("button", { name: "Add variables" }).click();
      await page.getByTestId("var-name-input").fill("a");
      await page.getByTestId("var-value-input").fill("1");
      await page
        .getByTestId("var-description-input")
        .fill("Description for variable a");
      const privateCheckbox = page.getByRole("checkbox", { name: "Private" });
      await clickCheckbox(privateCheckbox);

      await page.getByRole("button", { name: "Add variables" }).click();
      await page.getByTestId("var-name-input").first().fill("b");
      await page.getByTestId("var-value-input").first().fill("2");
      await page
        .getByTestId("var-description-input")
        .first()
        .fill("Description for variable b");

      await page.getByRole("button", { name: "Add variables" }).click();
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

      await page.getByTestId("promote-vars-button").click();
      await expect(page.getByTestId("promote-vars-modal")).toBeVisible();

      await expect(page.getByTestId("promote-var-checkbox")).toHaveCount(3);
      const variableToPromoteCheckbox = page
        .getByTestId("promote-var-checkbox")
        .first();
      await clickCheckbox(variableToPromoteCheckbox);

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
      const overrideRepoPatchDefinitionRadio = githubSection.getByRole(
        "radio",
        { name: "Override Repo Patch Definition", exact: true },
      );
      await clickRadio(overrideRepoPatchDefinitionRadio);
      await expect(overrideRepoPatchDefinitionRadio).toHaveAttribute(
        "aria-checked",
        "true",
      );

      await expect(
        githubSection.getByTestId("error-banner").filter({
          hasText:
            "A GitHub Patch Definition must be specified for this feature to run.",
        }),
      ).toBeVisible();

      await githubSection
        .getByRole("button", { name: "Add patch definition" })
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
      const enabledRadio = page
        .getByTestId("github-checks-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(enabledRadio);
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
      const overrideRepoPatchDefinitionRadio = page
        .getByTestId("cq-override-radio-box")
        .getByRole("radio", {
          name: "Override Repo Patch Definition",
          exact: true,
        });
      await expect(overrideRepoPatchDefinitionRadio).toHaveAttribute(
        "aria-checked",
        "true",
      );
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
      const prDisabledRadio = page
        .getByTestId("pr-testing-enabled-radio-box")
        .getByRole("radio", { name: "Disabled", exact: true });
      await clickRadio(prDisabledRadio);
      const manualDisabledRadio = page
        .getByTestId("manual-pr-testing-enabled-radio-box")
        .getByRole("radio", { name: "Disabled", exact: true });
      await clickRadio(manualDisabledRadio);
      const githubEnabledRadio = page
        .getByTestId("github-checks-enabled-radio-box")
        .getByRole("radio", { name: "Enabled" });
      await clickRadio(githubEnabledRadio);
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
      const defaultToRepoRadio = page.getByRole("radio", {
        name: "Default to Repo Patch Aliases",
      });
      await expect(defaultToRepoRadio).toHaveAttribute("checked");
    });

    test("Patch aliases added before defaulting to repo patch aliases are cleared", async ({
      authenticatedPage: page,
    }) => {
      const overrideRepoPatchAliasesRadio = page.getByRole("radio", {
        name: "Override Repo Patch Aliases",
      });
      await clickRadio(overrideRepoPatchAliasesRadio);
      await expect(overrideRepoPatchAliasesRadio).toHaveAttribute(
        "aria-checked",
        "true",
      );
      await expectSaveButtonEnabled(page, false);

      await page.getByRole("button", { name: "Add patch alias" }).click();
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
      await page.getByRole("button", { name: "Add task tag" }).click();
      await page
        .getByTestId("task-tags-input")
        .first()
        .fill("alias task tag 3");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");

      const defaultToRepoRadio = page.getByRole("radio", {
        name: "Default to Repo Patch Aliases",
      });
      await clickRadio(defaultToRepoRadio);
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expectSaveButtonEnabled(page, false);

      await clickRadio(overrideRepoPatchAliasesRadio);
      await expect(page.getByTestId("alias-row")).toHaveCount(0);
    });
  });

  test.describe("Virtual Workstation page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-virtual-workstation").click();
    });

    test("Enable git clone", async ({ authenticatedPage: page }) => {
      const githubEnabledRadio = page.getByRole("radio", { name: "Enabled" });
      await clickRadio(githubEnabledRadio);
      await expect(githubEnabledRadio).toBeChecked();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
    });

    test("Add commands", async ({ authenticatedPage: page }) => {
      const defaultToRepoRadio = page.getByRole("radio", {
        name: "Default to repo (disabled)",
      });
      await expect(defaultToRepoRadio).toBeChecked();
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
      await validateToast(page, "success", "Successfully updated repo", true);

      await page.goto(origin);
      await page.getByTestId("navitem-virtual-workstation").click();

      const commandRow = page.getByTestId("command-row");

      await expect(commandRow).toHaveCount(1);
      const commandInput = commandRow.getByRole("textbox", { name: "Command" });
      await expect(commandInput).toHaveValue("a repo command");
      await expect(commandInput).toBeDisabled();

      const overrideRepoCommandsRadio = page.getByRole("radio", {
        name: "Override Repo Commands",
      });
      await clickRadio(overrideRepoCommandsRadio);

      await expect(commandRow).toHaveCount(0);
      await page.getByRole("button", { name: "Add Command" }).click();
      await commandInput.fill("a project command");
      await save(page);
      await validateToast(
        page,
        "success",
        "Successfully updated project",
        true,
      );
      await expect(commandInput).toHaveValue("a project command");
      await expect(commandInput).toBeEnabled();

      const defaultToRepoCommandsRadio = page.getByRole("radio", {
        name: "Default to Repo Commands",
      });
      await clickRadio(defaultToRepoCommandsRadio);
      await expect(commandRow).toHaveCount(1);
      await expect(commandInput).toHaveValue("a repo command");
      await expect(commandInput).toBeDisabled();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");

      await clickRadio(overrideRepoCommandsRadio);
      await expect(commandRow).toHaveCount(0);
    });

    test("Allows overriding without adding a command", async ({
      authenticatedPage: page,
    }) => {
      const overrideRepoCommandsRadio = page.getByRole("radio", {
        name: "Override Repo Commands",
      });
      await clickRadio(overrideRepoCommandsRadio);
      await expect(overrideRepoCommandsRadio).toBeChecked();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(overrideRepoCommandsRadio).toBeChecked();
    });
  });
});
