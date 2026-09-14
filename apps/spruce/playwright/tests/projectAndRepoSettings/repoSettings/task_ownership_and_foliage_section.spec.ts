import { expect, test } from "../../../fixtures";
import { validateToast } from "../../../helpers";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  projectUseRepoEnabled,
  repo,
} from "../constants";
import { save } from "../utils";

test.describe("Task Ownership and Foliage section", () => {
  const repoOrigin = getRepoSettingsRoute(
    repo,
    ProjectSettingsTabRoutes.TaskOwnershipAndFoliage,
  );
  const projectOrigin = getProjectSettingsRoute(
    projectUseRepoEnabled,
    ProjectSettingsTabRoutes.TaskOwnershipAndFoliage,
  );

  test("can set default mothra teams on the repo and show 'default from repo' values on project page", async ({
    page,
  }) => {
    await page.goto(repoOrigin);

    const defaultMothraTeam = page.getByTestId("default-mothra-team");
    const defaultMothraTeamForBreakingCommit = page.getByTestId(
      "default-mothra-team-for-breaking-commit",
    );

    await defaultMothraTeam.fill("my-team");
    await defaultMothraTeamForBreakingCommit.fill("breaking-team");
    await save(page);
    await validateToast(page, "success", "Successfully updated repo");

    // Visit the project page and verify default from repo placeholders.
    await page.goto(projectOrigin);
    await expect(defaultMothraTeam).toHaveAttribute(
      "placeholder",
      "my-team (Default from repo)",
    );
    await expect(defaultMothraTeamForBreakingCommit).toHaveAttribute(
      "placeholder",
      "breaking-team (Default from repo)",
    );
  });
});
