import { test, expect } from "../../fixtures";
import { selectOption, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("task section", () => {
  test.describe("static provider", () => {
    test("should not show tunable options", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/distro/localhost/settings/task");
      await selectOption(page, "Task Planner Version", "Tunable");
      await expect(page.getByTestId("tunable-options")).toHaveCount(0);
    });
  });

  test.describe("docker provider", () => {
    test("should not show tunable options", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/distro/ubuntu1604-container-test/settings/task");
      await selectOption(page, "Task Planner Version", "Tunable");
      await expect(page.getByTestId("tunable-options")).toHaveCount(0);
    });
  });

  test.describe("ec2 provider", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/distro/ubuntu1804-workstation/settings/task");
    });

    test("should only show tunable options if planner version is tunable", async ({
      authenticatedPage: page,
    }) => {
      await selectOption(page, "Task Planner Version", "Tunable");
      await expect(page.getByTestId("tunable-options")).toBeVisible();
    });

    test("should surface warnings for invalid number inputs", async ({
      authenticatedPage: page,
    }) => {
      await selectOption(page, "Task Planner Version", "Tunable");
      await page.getByLabel("Patch Factor").clear();
      await page.getByLabel("Patch Factor").fill("500");
      await expect(page.getByText("Value should be <= 100.")).toBeVisible();
      await page.getByLabel("Patch Factor").clear();
      await page.getByLabel("Patch Factor").fill("-500");
      await expect(page.getByText("Value should be >= 0.")).toBeVisible();
    });

    test("can update fields and those changes will persist", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      await selectOption(page, "Task Finder Version", "Parallel");
      await selectOption(page, "Task Planner Version", "Tunable");
      await selectOption(
        page,
        "Task Dispatcher Version",
        "Revised with dependencies",
      );
      await save(page);
      await validateToast(page, "success", "Updated distro.");

      await page.reload();
      await expect(page.getByLabel("Task Finder Version")).toContainText(
        "Parallel",
      );
      await expect(page.getByLabel("Task Planner Version")).toContainText(
        "Tunable",
      );
      await expect(page.getByLabel("Task Dispatcher Version")).toContainText(
        "Revised with dependencies",
      );

      await selectOption(page, "Task Finder Version", "Legacy");
      await selectOption(page, "Task Planner Version", "Tunable");
      await selectOption(
        page,
        "Task Dispatcher Version",
        "Revised with dependencies",
      );
      await save(page);
      await validateToast(page, "success", "Updated distro.");
    });
  });
});
