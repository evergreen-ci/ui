import { test, expect } from "../../fixtures";
import { clickLabelForLocator, validateToast } from "../../helpers";

const path = "/version/5ecedafb562343215a7ff297";

test.describe("version/restart_modal", () => {
  test.describe("Restarting a patch with Downstream Tasks", () => {
    test("Clicking on the Select Downstream Tasks should show the downstream projects", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/version/5f74d99ab2373627c047c5e5");
      await page.getByTestId("restart-version").click();
      await page
        .getByTestId("select-downstream")
        .getByText("evergreen")
        .first()
        .click();
    });
  });

  test.describe("Restarting a patch", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(path);
      await expect(page.getByTestId("version-restart-modal")).toBeHidden();
      await page.getByTestId("restart-version").click();
      await expect(page.getByTestId("version-restart-modal")).toBeVisible();
    });

    test("Clicking on a variant should toggle an accordion dropdown of tasks", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("variant-accordion").first().click();
      await expect(
        page.getByTestId("version-restart-modal").getByText("dist"),
      ).toBeVisible();
    });

    test("Clicking on a variant checkbox should toggle its textbox and all the associated tasks", async ({
      authenticatedPage: page,
    }) => {
      const taskStatusBadge = page
        .getByTestId("version-restart-modal")
        .getByTestId("task-status-badge");
      await page.getByTestId("variant-accordion").first().click();
      await expect(taskStatusBadge).toContainText("0 of 1 Selected");
      const selectUbuntuCheckbox = page
        .getByTestId("version-restart-modal")
        .getByText("Ubuntu 16.04");
      await selectUbuntuCheckbox.click();
      await expect(taskStatusBadge).toContainText("1 of 1 Selected");
      await selectUbuntuCheckbox.click();
      await expect(taskStatusBadge).toContainText("0 of 1 Selected");
    });

    test("Clicking on a task should toggle its check box and select the task", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("variant-accordion").first().click();
      const taskCheckbox = page
        .getByTestId("version-restart-modal")
        .getByText("dist");
      await taskCheckbox.click();
      await expect(
        page
          .getByTestId("version-restart-modal")
          .getByTestId("task-status-badge"),
      ).toContainText("1 of 1 Selected");
    });

    test("Selecting on the task status filter should toggle the tasks that have matching statuses to it", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("task-status-filter").click();
      const options = page.getByTestId("tree-select-options");
      await expect(options).toBeVisible();
      await clickLabelForLocator(options.getByTestId("all-checkbox"));
      await page.getByTestId("task-status-filter").click();

      await expect(page.getByTestId("version-restart-modal")).toContainText(
        "Are you sure you want to restart the 1 selected tasks?",
      );
      await page.getByTestId("task-status-filter").click();
      await expect(options).toBeVisible();
      await clickLabelForLocator(options.getByTestId("all-checkbox"));
      await page.getByTestId("task-status-filter").click();
    });

    test("Selecting on the base status filter should toggle the tasks that have matching statuses to it", async ({
      authenticatedPage: page,
    }) => {
      const modal = page.getByTestId("version-restart-modal");
      await modal.getByTestId("base-task-status-filter").click();
      const options = page.getByTestId("tree-select-options");
      await expect(options).toBeVisible();
      await clickLabelForLocator(options.getByTestId("succeeded-checkbox"));
      await modal.getByTestId("base-task-status-filter").click();

      await expect(modal.getByTestId("confirmation-message")).toContainText(
        "Are you sure you want to restart the 1 selected tasks?",
      );
      await modal.getByTestId("base-task-status-filter").click();
      await expect(options).toBeVisible();
      await clickLabelForLocator(options.getByTestId("succeeded-checkbox"));
      await modal.getByTestId("base-task-status-filter").click();
    });

    test("Restarting a task should close the modal and display a success message if it occurs successfully.", async ({
      authenticatedPage: page,
    }) => {
      const modal = page.getByTestId("version-restart-modal");
      await modal.getByTestId("variant-accordion").first().click();
      const taskCheckbox = page
        .getByTestId("version-restart-modal")
        .getByText("dist");
      await taskCheckbox.click();
      await modal.getByRole("button", { name: "Restart" }).click();
      await expect(page.getByTestId("version-restart-modal")).toBeHidden();
      await validateToast(page, "success", "Successfully restarted tasks!");
    });
  });

  test.describe("Restarting mainline commits", () => {
    test("should be able to restart scheduled mainline commit tasks", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(
        "/version/spruce_ab494436448fbb1d244833046ea6f6af1544e86d",
      );
      await expect(page.getByTestId("restart-version")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
      await page.getByTestId("restart-version").click();
      await expect(page.getByTestId("version-restart-modal")).toBeVisible();

      const modal = page.getByTestId("version-restart-modal");
      await modal.getByTestId("accordion-toggle").click();
      const taskCheckbox = modal.getByText("check_codegen");

      await taskCheckbox.click();
      const restartButton = modal.getByRole("button", { name: "Restart" });
      await expect(restartButton).toHaveAttribute("aria-disabled", "false");
      await restartButton.click();
      await validateToast(page, "success", "Successfully restarted tasks!");
    });
  });
});
