import { expect, test } from "../../fixtures";
import { clickCheckbox, validateToast } from "../../helpers";

const pageRoute = "/preferences/notifications";

test.describe("preferences/notifications", () => {
  test.describe("global subscription settings", () => {
    test("updating a field should enable the submit button", async ({
      page,
    }) => {
      await page.goto(pageRoute);
      await expect(
        page.getByTestId("save-profile-changes-button"),
      ).toHaveAttribute("aria-disabled", "true");
      await page.getByTestId("slack-member-id-field").clear();
      await page.getByTestId("slack-member-id-field").fill("12345");
      await expect(
        page.getByTestId("save-profile-changes-button"),
      ).toBeEnabled();
    });

    test("saving changes to a field should work", async ({ page }) => {
      await page.goto(pageRoute);
      await page.getByTestId("slack-username-field").clear();
      await page.getByTestId("slack-username-field").fill("slack.user");
      await expect(
        page.getByTestId("save-profile-changes-button"),
      ).toBeEnabled();
      await page.getByTestId("save-profile-changes-button").click();
      await validateToast(page, "success", "Your changes have been saved.");
    });
  });

  test.describe("user subscriptions table", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(pageRoute);
    });

    test("shows all of a user's subscriptions and opens their details", async ({
      page,
    }) => {
      const rows = page
        .getByTestId("subscriptions-table")
        .getByTestId("via-table-row");
      const detailsToggle = { name: /^View details for / };
      await expect(rows).toHaveCount(3);
      await expect(rows.getByRole("button", detailsToggle)).toHaveCount(2);

      await expect(page.getByTestId("regex-selectors")).toHaveCount(0);
      await expect(page.getByTestId("trigger-data")).toHaveCount(0);

      await rows.nth(0).getByRole("button", detailsToggle).click();
      await expect(page.getByTestId("regex-selectors")).toBeVisible();
      await expect(page.getByTestId("trigger-data")).toHaveCount(0);

      await rows.nth(2).getByRole("button", detailsToggle).click();
      await expect(page.getByTestId("regex-selectors")).toBeVisible();
      await expect(page.getByTestId("trigger-data")).toBeVisible();
    });

    test("shows the selected count in the 'Delete' button", async ({
      page,
    }) => {
      const rowCheckbox = page
        .getByTestId("subscriptions-table")
        .getByTestId("via-table-row")
        .nth(0)
        .locator("input[type=checkbox]");
      await clickCheckbox(rowCheckbox);

      const deleteButton = page.getByTestId("delete-some-button");
      await expect(deleteButton).toContainText("Delete (1)");

      const headerCheckbox = page
        .locator("thead")
        .locator("input[type=checkbox]");
      await clickCheckbox(headerCheckbox);
      await expect(deleteButton).toContainText("Delete (3)");

      await clickCheckbox(headerCheckbox);
      await expect(deleteButton).toContainText("Delete");
      await expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    });

    test.describe("Deleting subscriptions", () => {
      test("deletes a single subscription", async ({ page }) => {
        const rows = page
          .getByTestId("subscriptions-table")
          .getByTestId("via-table-row");
        await clickCheckbox(rows.nth(0).locator("input[type=checkbox]"));
        await page.getByTestId("delete-some-button").click();
        await validateToast(page, "success", "Deleted 1 subscription.");
        await expect(rows).toHaveCount(2);
      });
    });
  });
});
