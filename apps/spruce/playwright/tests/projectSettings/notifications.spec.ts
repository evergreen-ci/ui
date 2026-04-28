import { test, expect } from "../../fixtures";
import { validateToast, selectOption } from "../../helpers";
import { getProjectSettingsRoute, ProjectSettingsTabRoutes } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Notifications", () => {
  const origin = getProjectSettingsRoute(
    "evergreen",
    ProjectSettingsTabRoutes.Notifications,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test("shows correct initial state", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("default-to-repo-button")).toHaveCount(0);
    await expect(page.getByText("No subscriptions are defined.")).toBeVisible();
    await expectSaveButtonEnabled(page, false);
  });

  test("should be able to add a subscription, save it and delete it", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("expandable-card")).toHaveCount(0);
    await expect(
      page.getByTestId("add-button").getByText("Add Subscription"),
    ).toBeVisible();
    await page.getByTestId("add-button").click();
    await expect(page.getByTestId("expandable-card")).toContainText(
      "New Subscription",
    );
    await selectOption(page, "Event", "Any version finishes");
    await selectOption(page, "Notification Method", "Email");
    await page.getByTestId("email-input").fill("mohamed.khelif@mongodb.com");
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await expectSaveButtonEnabled(page, false);
    const subscriptionItem = page.getByTestId("expandable-card");
    await subscriptionItem.scrollIntoViewIfNeeded();
    await expect(subscriptionItem).toBeVisible();
    await expect(subscriptionItem).toContainText(
      "Version outcome  - mohamed.khelif@mongodb.com",
    );
    await page.getByTestId("delete-item-button").click();
    await expect(subscriptionItem).toHaveCount(0);
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });

  test("should not be able to combine a jira comment subscription with a task event", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("expandable-card")).toHaveCount(0);
    await expect(
      page.getByTestId("add-button").getByText("Add Subscription"),
    ).toBeVisible();
    await page.getByTestId("add-button").click();
    const expandableCard = page.getByTestId("expandable-card");
    await expandableCard.scrollIntoViewIfNeeded();
    await expect(expandableCard).toBeVisible();
    await expect(expandableCard).toContainText("New Subscription");
    await selectOption(page, "Event", "Any task finishes");
    await selectOption(page, "Notification Method", "Comment on a JIRA issue");
    await page.getByTestId("jira-comment-input").fill("JIRA-123");
    await expect(
      page.getByText("Subscription type not allowed for tasks in a project."),
    ).toBeVisible();
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await expectSaveButtonEnabled(page, false);
  });

  test("should not be able to save a subscription if an input is invalid", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("add-button").click();
    const expandableCard = page.getByTestId("expandable-card");
    await expandableCard.scrollIntoViewIfNeeded();
    await expect(expandableCard).toBeVisible();
    await expect(expandableCard).toContainText("New Subscription");
    await selectOption(page, "Event", "Any version finishes");
    await selectOption(page, "Notification Method", "Email");
    await page.getByTestId("email-input").fill("Not a real email");
    await expect(
      page.getByText("Value should be a valid email."),
    ).toBeVisible();
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await expectSaveButtonEnabled(page, false);
  });

  test("Setting a project banner displays the banner on the correct pages and unsetting it removes it", async ({
    authenticatedPage: page,
  }) => {
    const bannerText = "This is a project banner!";

    await page.getByTestId("banner-text").clear();
    await page.getByTestId("banner-text").fill(bannerText);
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await expect(page.getByText(bannerText)).toBeVisible();

    const taskRoute =
      "task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
    await page.goto(taskRoute);
    await expect(page.getByText(bannerText)).toBeVisible();

    await page.goto("patch/5e6bb9e23066155a993e0f1b/configure/tasks");
    await expect(page.getByText(bannerText)).toBeVisible();

    await page.goto("version/5e4ff3abe3c3317e352062e4");
    await expect(page.getByText(bannerText)).toBeVisible();

    await page.goto("project/evergreen/waterfall");
    await expect(page.getByText(bannerText)).toBeVisible();

    await page.goto("variant-history/evergreen/ubuntu1604");
    await expect(page.getByText(bannerText)).toBeVisible();

    await page.goto(origin);
    await page.getByTestId("banner-text").clear();
    await save(page);

    await expect(page.getByText(bannerText)).toHaveCount(0);

    await page.goto(taskRoute);
    await expect(page.getByText(bannerText)).toHaveCount(0);

    await page.goto("patch/5e6bb9e23066155a993e0f1b/configure/tasks");
    await expect(page.getByText(bannerText)).toHaveCount(0);

    await page.goto("version/5e4ff3abe3c3317e352062e4");
    await expect(page.getByText(bannerText)).toHaveCount(0);

    await page.goto("project/evergreen/waterfall");
    await expect(page.getByText(bannerText)).toHaveCount(0);

    await page.goto("variant-history/evergreen/ubuntu1604");
    await expect(page.getByText(bannerText)).toHaveCount(0);
  });
});
