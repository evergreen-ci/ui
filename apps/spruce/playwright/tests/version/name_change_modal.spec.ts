import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Name change modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/version/5f74d99ab2373627c047c5e5");
  });

  test("Use the name change modal to change the name of a patch", async ({
    page,
  }) => {
    const originalName = "main: EVG-7823 add a commit queue message (#4048)";
    await expect(page.getByText(originalName)).toBeVisible();

    await page.getByTestId("name-change-modal-trigger").click();
    const newName = "a different name";
    const nameInput = page.locator("textarea");
    await nameInput.clear();
    await nameInput.fill(newName);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(nameInput).toBeHidden();
    await expect(page.getByText(newName)).toBeVisible();
    await validateToast(
      page,
      "success",
      "Patch name was successfully updated.",
    );
  });

  test("The confirm button is disabled when the text area value is empty or greater than 300 characters", async ({
    page,
  }) => {
    await page.getByTestId("name-change-modal-trigger").click();
    const nameInput = page.locator("textarea");
    const confirmButton = page.getByRole("button", { name: "Confirm" });

    await nameInput.clear();
    await expect(confirmButton).toBeDisabled();

    await nameInput.fill("lol");
    await expect(confirmButton).toBeEnabled();

    const over300Chars =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    await nameInput.fill(over300Chars);
    await expect(confirmButton).toBeDisabled();
    await expect(
      page.getByText("Value cannot exceed 300 characters"),
    ).toBeVisible();
  });
});
