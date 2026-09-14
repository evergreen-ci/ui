import { expect, test } from "../../../fixtures";
import { validateToast } from "../../../helpers";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
  projectUseRepoEnabled,
} from "../constants";
import { save } from "../utils";

test.describe("Task Ownership and Foliage section", () => {
  const projectOrigin = getProjectSettingsRoute(
    projectUseRepoEnabled,
    ProjectSettingsTabRoutes.TaskOwnershipAndFoliage,
  );

  test("can set default mothra teams on the project", async ({ page }) => {
    await page.goto(projectOrigin);

    await expect(page.getByTestId("project-settings-tab-title")).toContainText(
      "Task Ownership",
    );
    const defaultMothraTeam = page.getByTestId("default-mothra-team");
    const defaultMothraTeamForBreakingCommit = page.getByTestId(
      "default-mothra-team-for-breaking-commit",
    );

    await defaultMothraTeam.fill("my-team");
    await defaultMothraTeamForBreakingCommit.fill("breaking-team");
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await page.reload();
    await expect(defaultMothraTeam).toHaveValue("my-team");
    await expect(defaultMothraTeamForBreakingCommit).toHaveValue(
      "breaking-team",
    );
  });
});
