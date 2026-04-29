import { test, expect } from "../../fixtures";
import {
  validateToast,
  validateDatePickerDate,
  clearDatePickerInput,
  typeDatePickerDate,
} from "../../helpers";
import { getProjectSettingsRoute, project } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Periodic Builds page", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-periodic-builds").click();
  });

  test("allows a user to schedule the next build on the current day", async ({
    authenticatedPage: page,
  }) => {
    await page.clock.setFixedTime(new Date(2025, 8, 16));
    await page.reload();
    await page.getByTestId("navitem-periodic-builds").click();
    await page.getByRole("button", { name: "Add periodic build" }).click();
    await validateDatePickerDate(page, "date-picker", {
      year: "2025",
      month: "09",
      day: "16",
    });
    await clearDatePickerInput(page);

    await typeDatePickerDate(page, { year: "2025", month: "01", day: "01" });
    await validateDatePickerDate(page, "date-picker", {
      year: "2025",
      month: "01",
      day: "01",
    });
    await expect(page.getByText("Date must be after")).toBeVisible();
    await clearDatePickerInput(page);

    await typeDatePickerDate(page, { year: "2025", month: "09", day: "20" });
    await validateDatePickerDate(page, "date-picker", {
      year: "2025",
      month: "09",
      day: "20",
    });
    await expect(page.getByText("Date must be after")).toHaveCount(0);
    await clearDatePickerInput(page);

    await typeDatePickerDate(page, { year: "2025", month: "09", day: "16" });
    await validateDatePickerDate(page, "date-picker", {
      year: "2025",
      month: "09",
      day: "16",
    });
    await expect(page.getByText("Date must be after")).toHaveCount(0);
  });

  test("Disables save button when interval is NaN or below minimum and allows saving a number in range", async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole("button", { name: "Add periodic build" }).click();
    const intervalInput = page.getByTestId("interval-input");
    await intervalInput.fill("NaN");
    await page.getByTestId("config-file-input").fill("config.yml");
    await expectSaveButtonEnabled(page, false);
    await expect(page.getByText("Value should be a number.")).toBeVisible();
    await intervalInput.clear();
    await intervalInput.fill("0");
    await expectSaveButtonEnabled(page, false);
    await intervalInput.clear();
    await intervalInput.fill("12");
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });
});
