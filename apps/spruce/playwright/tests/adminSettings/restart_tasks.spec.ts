import { test, expect } from "../../fixtures";
import {
  selectDatePickerDate,
  validateDatePickerDate,
  validateToast,
} from "../../helpers";

test.describe("restart tasks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin-settings/restart-tasks");
  });

  test("can restart tasks", async ({ page }) => {
    await expect(page.getByTestId("restart-tasks-button")).toBeDisabled();

    await selectDatePickerDate(
      page,
      { isoDate: "2020-02-01", month: "Feb", year: "2020" },
      "start-date-picker",
    );
    await validateDatePickerDate(page, "start-date-picker", {
      day: "01",
      month: "02",
      year: "2020",
    });

    await selectDatePickerDate(
      page,
      { isoDate: "2021-03-01", month: "Mar", year: "2021" },
      "end-date-picker",
    );
    await validateDatePickerDate(page, "end-date-picker", {
      day: "01",
      month: "03",
      year: "2021",
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
