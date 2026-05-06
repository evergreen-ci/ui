import { test, expect } from "../../fixtures";
import { validateToast, mockGraphQLResponse } from "../../helpers";

const patch = "5ecedafb562343215a7ff297";
const mainlineCommit = "5e4ff3abe3c3317e352062e4";
const versionPath = (id: string) => `/version/${id}`;

test.describe("Action Buttons", () => {
  test.describe("When viewing a patch build", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(versionPath(patch));
    });

    test("Clicking 'Schedule' button shows modal and clicking on 'Cancel' closes it", async ({
      authenticatedPage: page,
    }) => {
      await page.getByRole("button", { name: "Schedule" }).click();
      await expect(page.getByTestId("schedule-tasks-modal")).toBeVisible();
      await page.getByRole("button", { name: "Cancel" }).click();
      await expect(page.getByTestId("schedule-tasks-modal")).toBeHidden();
    });

    test("Clicking ellipses dropdown shows ellipses options", async ({
      authenticatedPage: page,
    }) => {
      const ellipsisButton = page.getByTestId("ellipsis-btn");
      await expect(ellipsisButton).toHaveCount(0);
      await ellipsisButton.click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await ellipsisButton.click();
      await expect(page.getByTestId("card-dropdown")).toHaveCount(0);
    });
  });

  test.describe("Version dropdown options", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(versionPath(patch));
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
    });

    test("Error unscheduling a version shows error toast", async ({
      authenticatedPage: page,
    }) => {
      await mockGraphQLResponse(page, "UnscheduleVersionTasks", {
        data: null,
        errors: [
          {
            message: "There was an error unscheduling tasks",
            path: ["UnscheduleVersionTasks"],
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        ],
      });
      await page
        .getByRole("menuitem", { name: "Unschedule all tasks" })
        .click();
      await page.getByRole("button", { name: "Yes" }).click();
      await validateToast(
        page,
        "error",
        "There was an error unscheduling tasks",
      );
    });

    test("Clicking 'Unschedule' button show popconfirm with abort checkbox and a toast on success", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByRole("menuitem", { name: "Unschedule all tasks" })
        .click();
      await page.getByRole("button", { name: "Yes" }).click();
      await validateToast(
        page,
        "success",
        "All tasks were unscheduled and tasks that already started were aborted",
      );
    });

    test("Clicking 'Set Priority' button shows popconfirm with input and toast on success", async ({
      authenticatedPage: page,
    }) => {
      const priority = "99";
      await page.getByRole("menuitem", { name: "Set patch priority" }).click();
      const patchPriorityInput = page.getByTestId("patch-priority-input");
      await patchPriorityInput.fill(priority);
      await patchPriorityInput.press("Enter");
      await validateToast(page, "success", priority);
    });

    test("Error setting priority shows error toast", async ({
      authenticatedPage: page,
    }) => {
      await mockGraphQLResponse(page, "SetVersionPriority", {
        data: null,
        errors: [
          {
            message: "There was an error setting priority",
            path: ["SetVersionPriority"],
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        ],
      });
      await page.getByRole("menuitem", { name: "Set patch priority" }).click();
      const patchPriorityInput = page.getByTestId("patch-priority-input");
      await patchPriorityInput.fill("80");
      await patchPriorityInput.press("Enter");
      await validateToast(page, "error", "Error updating priority for patch");
    });

    test("Sets priority for multiple tasks when version page table is filtered", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        `${versionPath(mainlineCommit)}/tasks?statuses=failed-umbrella,failed,known-issue`,
      );
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();

      const setTaskPriorityButton = page.getByRole("menuitem", {
        name: "Set task priority",
      });
      await expect(setTaskPriorityButton).toContainText(
        "Set task priority (2)",
      );
      await setTaskPriorityButton.click();
      const taskPriorityInput = page.getByTestId("task-priority-input");
      await taskPriorityInput.fill("10");
      await taskPriorityInput.press("Enter");
      await validateToast(page, "success", "Priority updated for 2 tasks.");
    });

    test("Should be able to reconfigure the patch", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("reconfigure-link")).not.toHaveAttribute(
        "disabled",
      );
      await page.getByTestId("reconfigure-link").click();
      await expect(page).toHaveURL(/configure/);
    });
  });

  test.describe("When viewing a mainline commit", () => {
    test.describe("Version dropdown options", () => {
      test.beforeEach(async ({ authenticatedPage: page }) => {
        await page.goto(versionPath(mainlineCommit));
        await page.getByTestId("ellipsis-btn").click();
        await expect(page.getByTestId("card-dropdown")).toBeVisible();
      });

      test("Reconfigure link is disabled for mainline commits", async ({
        authenticatedPage: page,
      }) => {
        await expect(page.getByTestId("reconfigure-link")).toBeVisible();
        await expect(page.getByTestId("reconfigure-link")).toHaveAttribute(
          "aria-disabled",
          "true",
        );
      });
    });
  });

  test.describe("Include Never-activated Tasks toggle", () => {
    test("sets URL and cookie when toggled on", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(versionPath(patch));
      await page.getByTestId("ellipsis-btn").click();
      await expect(page.getByTestId("card-dropdown")).toBeVisible();
      await page
        .getByTestId("card-dropdown")
        .getByText("Include never-activated tasks")
        .click();
      await expect(page).toHaveURL(/includeNeverActivatedTasks=true/);

      const cookies = await page.context().cookies();
      const cookie = cookies.find(
        (c) => c.name === "include-never-activated-tasks",
      ) ?? { value: "false" };
      expect(cookie.value).toBe("true");
    });
  });
});
