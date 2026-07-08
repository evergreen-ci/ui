import { test, expect } from "../../../fixtures";
import { clickRadio, validateToast } from "../../../helpers";
import { getProjectSettingsRoute, project } from "../constants";
import { save } from "../utils";

test.describe("Attaching Spruce to a repo", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
  });

  test("Saves and attaches new repo and shows warnings on the Github pages", async ({
    page,
  }) => {
    const repoInput = page.getByTestId("repo-input");
    await repoInput.clear();
    await repoInput.fill("evergreen");
    await expect(page.getByTestId("attach-repo-button")).toBeDisabled();
    await save(page);
    await validateToast(page, "success", "Successfully updated project", true);

    await page.getByRole("button", { name: "Attach to current repo" }).click();
    await page
      .getByTestId("attach-repo-modal")
      .getByRole("button", { name: "Attach" })
      .click();
    await validateToast(page, "success", "Successfully attached to repo");

    await page.getByRole("button", { name: "GitHub" }).click();

    // Pull requests section.
    await page.getByTestId("navitem-pull-requests").click();
    await expect(page.getByTestId("warning-banner")).toHaveCount(2);

    // Commit checks section.
    await page.getByTestId("navitem-commit-checks").click();
    await expect(page.getByTestId("warning-banner")).toHaveCount(0);

    // Merge queue section.
    await page.getByTestId("navitem-merge-queue").click();
    await expect(page.getByTestId("warning-banner")).toHaveCount(1);
    const mergeQueueEnabledRadio = page
      .getByTestId("mq-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(mergeQueueEnabledRadio);
    await expect(page.getByTestId("error-banner")).toHaveCount(1);
  });
});
