import { test, expect } from "../../fixtures";
import { clickCheckbox, selectOption, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("background processing", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    // Amboy section.
    await page.getByLabel("Single Worker Name").clear();
    await page.getByLabel("Single Worker Name").fill("new single worker name");

    await page
      .getByTestId("named-queue-list")
      .getByTestId("delete-item-button")
      .first()
      .click();

    // Logger section.
    await selectOption(page, "Default Level", "Alert");

    await page.getByLabel("Redact Keys").fill("aNewRedactedKey");
    await page.getByLabel("Redact Keys").press("Enter");

    const asyncBufferCheckbox = page.getByRole("checkbox", {
      name: "Use asynchronous buffered logger",
    });
    await clickCheckbox(asyncBufferCheckbox);

    // Notification Rate Limits section.
    const timeIntervalInput = page.getByLabel("Time Interval (secs)", {
      exact: true,
    });
    await timeIntervalInput.clear();
    await timeIntervalInput.fill("1");

    // Triggers section.
    await page.getByLabel("Distro for Generated Tasks").clear();
    await page.getByLabel("Distro for Generated Tasks").fill("localhost");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("Single Worker Name")).toHaveValue(
      "new single worker name",
    );
    await expect(page.getByLabel("Default Level")).toContainText("Alert");
    await expect(
      page.getByTestId("logger").getByTestId("filter-chip"),
    ).toHaveCount(4);
    await expect(
      page
        .getByTestId("logger")
        .getByTestId("filter-chip")
        .filter({ hasText: "aNewRedactedKey" }),
    ).toBeVisible();
    await expect(asyncBufferCheckbox).not.toBeChecked();
    await expect(timeIntervalInput).toHaveValue("1");
    await expect(page.getByLabel("Distro for Generated Tasks")).toHaveValue(
      "localhost",
    );

    // Ensure that Notify SES Input has not changed.
    await expect(page.getByLabel("SES Email")).toHaveValue(
      "evg-sender@email.com",
    );
  });
});
