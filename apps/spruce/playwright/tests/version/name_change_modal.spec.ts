import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Name change modal", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/version/5f74d99ab2373627c047c5e5");
  });

  test("Use the name change modal to change the name of a patch", async ({
    authenticatedPage: page,
  }) => {
    const originalName = "main: EVG-7823 add a commit queue message (#4048)";
    await expect(page.getByText(originalName)).toBeVisible();

    await page.getByTestId("name-change-modal-trigger").click();
    const newName = "a different name";
    await page.locator("textarea").clear();
    await page.locator("textarea").fill(newName);
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.locator("textarea")).toBeHidden();
    await expect(page.getByText(newName)).toBeVisible();
    await validateToast(
      page,
      "success",
      "Patch name was successfully updated.",
    );
  });

  test("The confirm button is disabled when the text area value is empty or greater than 300 characters", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("name-change-modal-trigger").click();
    await page.locator("textarea").clear();
    await expect(page.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await page.locator("textarea").fill("lol");
    await expect(page.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "aria-disabled",
      "false",
    );

    const over300Chars =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    await page.locator("textarea").fill(over300Chars);
    await expect(page.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(
      page.getByText("Value cannot exceed 300 characters"),
    ).toBeVisible();
  });
});
