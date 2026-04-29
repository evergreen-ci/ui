import { test, expect } from "../../fixtures";
import { validateToast, clickCheckbox } from "../../helpers";
import { getProjectSettingsRoute, project } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Variables page", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-variables").click();
  });

  test("Should not have the save button enabled on load", async ({
    authenticatedPage: page,
  }) => {
    await expectSaveButtonEnabled(page, false);
  });

  test("Should not show the move variables button", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("promote-vars-button")).toHaveCount(0);
  });

  test("Should redact and disable private variables on saving", async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").fill("sample_name");
    await expectSaveButtonEnabled(page, false);
    await page.getByTestId("var-value-input").fill("sample_value");
    await page.getByTestId("var-description-input").fill("Sample description");
    const privateCheckbox = page.getByRole("checkbox", {
      name: "Private",
    });
    const adminOnlyCheckbox = page.getByRole("checkbox", {
      name: "Admin Only",
    });
    await expect(privateCheckbox).toBeChecked();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
    await expect(page.getByTestId("var-value-input")).toHaveValue("{REDACTED}");
    await expect(page.getByTestId("var-name-input")).toBeDisabled();
    await expect(page.getByTestId("var-value-input")).toBeDisabled();
    await expect(privateCheckbox).toBeDisabled();
    await expect(adminOnlyCheckbox).toBeEnabled();
    await expect(page.getByTestId("var-description-input")).toBeEnabled();
  });

  test("Typing a duplicate variable name will disable saving and show an error message", async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").fill("sample_name");
    await page.getByTestId("var-value-input").fill("sample_value");
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").first().fill("sample_name");
    await page.getByTestId("var-value-input").first().fill("sample_value_2");
    const errorMessage = page.getByText(
      "Value already appears in project variables.",
    );
    await expect(errorMessage).toBeVisible();
    await expectSaveButtonEnabled(page, false);

    await page.getByTestId("var-name-input").first().fill("sample_name_2");
    await expectSaveButtonEnabled(page, true);
    await expect(errorMessage).toHaveCount(0);
  });

  test("Should correctly save an admin only variable", async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").first().fill("admin_var");
    await page.getByTestId("var-value-input").first().fill("admin_value");
    const adminOnlyCheckbox = page.getByRole("checkbox", {
      name: "Admin Only",
    });
    await clickCheckbox(adminOnlyCheckbox);
    await expect(adminOnlyCheckbox).toBeChecked();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });

  test("Should persist saved variables and allow deletion", async ({
    authenticatedPage: page,
  }) => {
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").fill("sample_name");
    await page.getByTestId("var-value-input").fill("sample_value");
    await page
      .getByTestId("var-description-input")
      .fill("Description for sample_name");
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").first().fill("sample_name_2");
    await page.getByTestId("var-value-input").first().fill("sample_value");
    await page
      .getByTestId("var-description-input")
      .first()
      .fill("Description for sample_name_2");
    await page.getByRole("button", { name: "Add variables" }).click();
    await page.getByTestId("var-name-input").first().fill("admin_var");
    await page.getByTestId("var-value-input").first().fill("admin_value");
    await page
      .getByTestId("var-description-input")
      .first()
      .fill("Description for admin_var");
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await page.reload();
    await expect(page.getByTestId("var-name-input").nth(0)).toHaveValue(
      "admin_var",
    );
    await expect(page.getByTestId("var-description-input").nth(0)).toHaveValue(
      "Description for admin_var",
    );
    await expect(page.getByTestId("var-name-input").nth(1)).toHaveValue(
      "sample_name",
    );
    await expect(page.getByTestId("var-description-input").nth(1)).toHaveValue(
      "Description for sample_name",
    );
    await expect(page.getByTestId("var-name-input").nth(2)).toHaveValue(
      "sample_name_2",
    );
    await expect(page.getByTestId("var-description-input").nth(2)).toHaveValue(
      "Description for sample_name_2",
    );

    await page.getByTestId("delete-item-button").first().click();
    await page.getByTestId("delete-item-button").first().click();
    await page.getByTestId("delete-item-button").first().click();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
    await expect(page.getByTestId("var-name-input")).toHaveCount(0);

    await page.reload();
    await expectSaveButtonEnabled(page, false);
    await expect(page.getByTestId("var-name-input")).toHaveCount(0);
  });
});
