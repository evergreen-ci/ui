import { test, expect } from "../../fixtures";
import {
  selectDatePickerDate,
  validateDatePickerDate,
  validateToast,
} from "../../helpers";

test.describe("restart tasks", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings/restart-tasks");
  });

  test("can restart tasks", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("restart-tasks-button")).toBeDisabled();

    await selectDatePickerDate(
      page,
      { year: "2020", month: "Feb", isoDate: "2020-02-01" },
      "start-date-picker",
    );
    await validateDatePickerDate(page, "start-date-picker", {
      year: "2020",
      month: "02",
      day: "01",
    });

    await selectDatePickerDate(
      page,
      { year: "2021", month: "Mar", isoDate: "2021-03-01" },
      "end-date-picker",
    );
    await validateDatePickerDate(page, "end-date-picker", {
      year: "2021",
      month: "03",
      day: "01",
    });

    await expect(page.getByTestId("restart-tasks-button")).toBeEnabled();
    await page.getByTestId("restart-tasks-button").click();

    await expect(page.getByTestId("restart-tasks-modal")).toBeVisible();
    await expect(
      page.getByTestId("restart-tasks-list").locator("li"),
    ).toHaveCount(4);
    await page.getByRole("button", { name: "Confirm" }).click();
    await validateToast(page, "success", "Created job to restart 4 tasks.");
  });
});
