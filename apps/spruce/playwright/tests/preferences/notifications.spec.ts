import { test, expect } from "../../fixtures";
import { clickLabelForLocator, validateToast } from "../../helpers";

const pageRoute = "/preferences/notifications";

test.describe("preferences/notifications", () => {
  test.describe("global subscription settings", () => {
    test("updating a field should enable the submit button", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pageRoute);
      await expect(
        page.getByTestId("save-profile-changes-button"),
      ).toHaveAttribute("aria-disabled", "true");
      await page.getByTestId("slack-member-id-field").clear();
      await page.getByTestId("slack-member-id-field").fill("12345");
      await expect(
        page.getByTestId("save-profile-changes-button"),
      ).toHaveAttribute("aria-disabled", "false");
    });

    test("saving changes to a field should work", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(pageRoute);
      await page.getByTestId("slack-username-field").clear();
      await page.getByTestId("slack-username-field").fill("slack.user");
      await page.getByTestId("save-profile-changes-button").click();
      await validateToast(page, "success", "Your changes have been saved.");
    });
  });

  test.describe("user subscriptions table", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(pageRoute);
    });

    test("shows all of a user's subscriptions and expands with details", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("subscription-row")).toHaveCount(3);

      await expect(page.getByTestId("regex-selectors")).toHaveCount(0);
      await expect(page.getByTestId("trigger-data")).toHaveCount(0);

      await page
        .getByTestId("subscription-row")
        .nth(0)
        .getByRole("button", { name: "Expand row" })
        .click();
      await expect(page.getByTestId("regex-selectors")).toBeVisible();
      await expect(page.getByTestId("trigger-data")).toHaveCount(0);

      await page
        .getByTestId("subscription-row")
        .nth(2)
        .getByRole("button", { name: "Expand row" })
        .click();
      await expect(page.getByTestId("regex-selectors")).toBeVisible();
      await expect(page.getByTestId("trigger-data")).toBeVisible();
    });

    test("shows the selected count in the 'Delete' button", async ({
      authenticatedPage: page,
    }) => {
      const rowCheckbox = page
        .getByTestId("subscription-row")
        .nth(0)
        .locator("input[type=checkbox]");
      await clickLabelForLocator(rowCheckbox);

      const deleteButton = page.getByTestId("delete-some-button");
      await expect(deleteButton).toContainText("Delete (1)");

      const headerCheckbox = page
        .locator("thead")
        .locator("input[type=checkbox]");
      await clickLabelForLocator(headerCheckbox);
      await expect(deleteButton).toContainText("Delete (3)");

      await clickLabelForLocator(headerCheckbox);
      await expect(deleteButton).toContainText("Delete");
      await expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    });

    test.describe("Deleting subscriptions", () => {
      test("deletes a single subscription", async ({
        authenticatedPage: page,
      }) => {
        const rowCheckbox = page
          .getByTestId("subscription-row")
          .nth(0)
          .locator("input[type=checkbox]");
        await clickLabelForLocator(rowCheckbox);
        await page.getByTestId("delete-some-button").click();
        await validateToast(page, "success", "Deleted 1 subscription.");
        await expect(page.getByTestId("subscription-row")).toHaveCount(2);
      });
    });
  });
});
