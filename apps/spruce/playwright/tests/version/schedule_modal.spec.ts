import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Restarting and scheduling mainline commits", () => {
  test("should be able to schedule inactive mainline commit tasks", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33");

    const schedulePatchButton = page.getByTestId("schedule-patch");
    await expect(schedulePatchButton).toBeVisible();
    await expect(schedulePatchButton).toBeEnabled();
    await schedulePatchButton.click();

    const modal = page.getByTestId("schedule-tasks-modal");
    await expect(modal).toBeVisible();
    await modal.getByTestId("accordion-toggle").click();
    const taskCheckbox = modal.getByText("check_codegen");
    await taskCheckbox.click();

    const scheduleButton = modal.getByRole("button", { name: "Schedule" });
    await expect(scheduleButton).toHaveAttribute("aria-disabled", "false");
    await scheduleButton.click();
    await validateToast(page, "success", "Successfully scheduled tasks!");
  });
});
