import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("project section", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/distro/localhost/settings/project");
  });

  test("can update fields and those changes will persist", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    const addExpansionButton = page.getByRole("button", {
      name: "Add expansion",
    });
    await expect(addExpansionButton).toBeEnabled();
    await addExpansionButton.click();

    const newExpansion = page.getByTestId("expansion-item");
    const keyInput = newExpansion.getByLabel("Key");
    await expect(keyInput).toHaveCount(1);
    await keyInput.fill("key-name");

    const valueInput = newExpansion.getByLabel("Value");
    await expect(valueInput).toHaveCount(1);
    await valueInput.fill("my-value");

    await page.getByRole("button", { name: "Add project" }).click();
    await page.getByLabel("Project ID").fill("spruce");

    await save(page);
    await validateToast(page, "success", "Updated distro.");

    await page.reload();
    await expect(keyInput).toHaveCount(1);
    await expect(keyInput).toHaveValue("key-name");
    await expect(valueInput).toHaveCount(1);
    await expect(valueInput).toHaveValue("my-value");

    await expect(page.getByLabel("Project ID")).toHaveValue("spruce");

    await page.getByTestId("delete-item-button").first().click();
    await page.getByTestId("delete-item-button").first().click();
    await save(page);
    await validateToast(page, "success", "Updated distro.");
  });
});
