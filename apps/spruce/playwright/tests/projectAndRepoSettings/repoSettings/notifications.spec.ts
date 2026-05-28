import { test, expect } from "../../../fixtures";
import { validateToast, selectOption } from "../../../helpers";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
  repo,
} from "../constants";
import { save } from "../utils";

test.describe("Repo Notifications", () => {
  const repoNotificationsRoute = getRepoSettingsRoute(
    repo,
    ProjectSettingsTabRoutes.Notifications,
  );
  const projectNotificationsRoute = getProjectSettingsRoute(
    projectUseRepoEnabled,
    ProjectSettingsTabRoutes.Notifications,
  );

  test("adding a subscription to a repo causes it to appear on a branch project's notifications page", async ({
    page,
  }) => {
    await page.goto(repoNotificationsRoute);
    await page.getByRole("button", { name: "Add Subscription" }).click();
    await selectOption(page, "Event", "Any version finishes");
    await selectOption(page, "Notification Method", "Email");
    await page.getByTestId("email-input").fill("test@example.com");
    await save(page);
    await validateToast(page, "success", "Successfully updated repo", true);

    await page.goto(projectNotificationsRoute);
    await expect(
      page.getByTestId("expandable-card").filter({
        hasText: "Version outcome",
      }),
    ).toBeVisible();
  });
});
