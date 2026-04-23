import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Restarting and scheduling mainline commits", () => {
  test("should be able to schedule inactive mainline commit tasks", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/version/spruce_e695f654c8b4b959d3e12e71696c3e318bcd4c33");
    await expect(page.getByTestId("schedule-patch")).toBeVisible();
    await expect(page.getByTestId("schedule-patch")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("schedule-patch").click();
    await expect(page.getByTestId("schedule-tasks-modal")).toBeVisible();

    const modal = page.getByTestId("schedule-tasks-modal");
    await modal.getByTestId("accordion-toggle").click();
    const taskCheckbox = modal.getByText("check_codegen");
    await taskCheckbox.click();
    await expect(
      modal.getByRole("button", { name: "Schedule" }),
    ).toHaveAttribute("aria-disabled", "false");
    await modal.getByRole("button", { name: "Schedule" }).click();
    await validateToast(page, "success", "Successfully scheduled tasks!");
  });
});
