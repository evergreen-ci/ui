import { test, expect } from "../../fixtures";
import { clickRadio, validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
} from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Patch Aliases page", () => {
  const origin = getRepoSettingsRoute(repo);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-patch-aliases").click();
    await expectSaveButtonEnabled(page, false);
    await expect(
      page.getByTestId("patch-aliases-override-radio-box"),
    ).toHaveCount(0);
  });

  test("Saving a patch alias shows a success toast, the alias name in the card title and in the repo defaulted project", async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole("button", { name: "Add patch alias" }).click();
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
    await validateToast(page, "success", "Successfully defaulted page to repo");
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
    await page.getByRole("button", { name: "Add patch trigger alias" }).click();
    await page.getByTestId("pta-alias-input").fill("my-alias");
    await page.getByTestId("project-input").fill("spruce");
    await page.getByTestId("module-input").fill("module_name");
    await page.getByText("Variant/Task", { exact: true }).click();
    await page.getByTestId("variant-regex-input").fill(".*");
    await page.getByTestId("task-regex-input").fill(".*");

    const pullRequestCheckbox = page.getByRole("checkbox", {
      name: "Schedule in GitHub Pull Requests",
    });
    await expect(pullRequestCheckbox).not.toBeChecked();
    await clickRadio(pullRequestCheckbox);
    await expect(pullRequestCheckbox).toBeChecked();

    const mergeQueueCheckbox = page.getByRole("checkbox", {
      name: "Schedule in GitHub Merge Queue",
    });
    await expect(mergeQueueCheckbox).not.toBeChecked();
    await clickRadio(mergeQueueCheckbox);
    await expect(mergeQueueCheckbox).toBeChecked();

    await save(page);
    await validateToast(page, "success", "Successfully updated repo");
    await expectSaveButtonEnabled(page, false);

    await page.getByTestId("navitem-github-commitqueue").click();

    const prTriggerAliases = page.getByTestId("github-pr-trigger-aliases");
    await expect(prTriggerAliases.getByTestId("pta-item")).toHaveCount(1);
    await expect(prTriggerAliases.getByText("my-alias")).toBeVisible();
    await prTriggerAliases.getByTestId("pta-item").hover();
    await expect(page.getByTestId("pta-tooltip")).toHaveCount(1);
    await expect(page.getByTestId("pta-tooltip")).toBeVisible();
    await expect(page.getByTestId("pta-tooltip")).toContainText("spruce");
    await expect(page.getByTestId("pta-tooltip")).toContainText("module_name");
    await expect(page.getByTestId("pta-tooltip")).toContainText(
      "Variant/Task Regex Pairs",
    );

    const mqTriggerAliases = page.getByTestId("github-mq-trigger-aliases");
    await expect(mqTriggerAliases.getByTestId("pta-item")).toHaveCount(1);
    await expect(mqTriggerAliases.getByText("my-alias")).toBeVisible();
    await mqTriggerAliases.getByTestId("pta-item").hover();
    await expect(page.getByTestId("pta-tooltip")).toHaveCount(1);
    await expect(page.getByTestId("pta-tooltip")).toBeVisible();
    await expect(page.getByTestId("pta-tooltip")).toContainText("spruce");
    await expect(page.getByTestId("pta-tooltip")).toContainText("module_name");
    await expect(page.getByTestId("pta-tooltip")).toContainText(
      "Variant/Task Regex Pairs",
    );
  });
});
