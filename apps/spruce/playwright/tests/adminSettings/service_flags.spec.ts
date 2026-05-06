import { test, expect } from "../../fixtures";
import { clickCheckbox, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("service flags", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings/service-flags");
  });

  test("can interact with and save service flags", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    const checkedCheckboxes = page.locator(
      'input[type="checkbox"][aria-checked="true"]',
    );
    const initialCheckedCount = await checkedCheckboxes.count();

    // Find the first unchecked checkbox and capture a stable locator by id.
    const uncheckedCheckbox = page
      .locator('input[type="checkbox"]:not([aria-checked="true"])')
      .first();
    const checkboxId = await uncheckedCheckbox.getAttribute("id");
    const checkbox = page.locator(`#${checkboxId}`);

    await clickCheckbox(checkbox);

    // Verify checked count increased.
    await expect(checkedCheckboxes).toHaveCount(initialCheckedCount + 1);

    await expect(page.getByTestId("save-settings-button")).toBeEnabled();

    // Uncheck it again.
    await clickCheckbox(checkbox);
    await expect(checkedCheckboxes).toHaveCount(initialCheckedCount);
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    // Re-check and save.
    await clickCheckbox(checkbox);
    await save(page);
    await validateToast(page, "success", "Service flags saved successfully");
    await page.reload();

    await expect(checkbox).toBeChecked();
    await expect(checkedCheckboxes).toHaveCount(initialCheckedCount + 1);

    // Restore original state.
    await clickCheckbox(checkbox);
    await save(page);
    await validateToast(page, "success", "Service flags saved successfully");
  });
});
