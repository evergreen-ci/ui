import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("service flags", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings/service-flags");
  });

  test("can interact with and save service flags", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    const checkedCheckboxes = page.locator(
      'input[type="checkbox"][aria-checked="true"]',
    );
    const initialCheckedCount = await checkedCheckboxes.count();

    // Find the first unchecked checkbox.
    const targetCheckbox = page
      .locator('input[type="checkbox"]:not([aria-checked="true"])')
      .first();
    await targetCheckbox.scrollIntoViewIfNeeded();

    // Check it via its label.
    const checkboxId = await targetCheckbox.getAttribute("id");
    await page.locator(`label[for="${checkboxId}"]`).click();

    // Verify checked count increased.
    await expect(checkedCheckboxes).toHaveCount(initialCheckedCount + 1);

    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );

    // Uncheck it again.
    await page.locator(`label[for="${checkboxId}"]`).click();
    await expect(checkedCheckboxes).toHaveCount(initialCheckedCount);
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    // Re-check and save.
    await page.locator(`label[for="${checkboxId}"]`).click();
    await save(page);
    await validateToast(page, "success", "Service flags saved successfully");
    await page.reload();

    await expect(page.locator(`#${checkboxId}`)).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(checkedCheckboxes).toHaveCount(initialCheckedCount + 1);

    // Restore original state.
    await page.locator(`label[for="${checkboxId}"]`).click();
    await save(page);
    await validateToast(page, "success", "Service flags saved successfully");
  });
});
