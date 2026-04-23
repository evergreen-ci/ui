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
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await expect(
      page.getByRole("button", { name: "Add expansion" }),
    ).not.toHaveAttribute("aria-disabled", "true");
    await page.getByRole("button", { name: "Add expansion" }).click();
    await page.getByLabel("Key").fill("key-name");
    await page.getByLabel("Value").fill("my-value");
    await page.getByRole("button", { name: "Add project" }).click();
    await page.getByLabel("Project ID").fill("spruce");

    await save(page);
    await validateToast(page, "success", "Updated distro.");

    await page.reload();
    await expect(page.getByLabel("Key")).toHaveValue("key-name");
    await expect(page.getByLabel("Value")).toHaveValue("my-value");
    await expect(page.getByLabel("Project ID")).toHaveValue("spruce");

    await page.getByTestId("delete-item-button").first().click();
    await page.getByTestId("delete-item-button").first().click();
    await save(page);
    await validateToast(page, "success", "Updated distro.");
  });
});
