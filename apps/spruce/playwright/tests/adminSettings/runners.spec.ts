import { test, expect } from "../../fixtures";
import { clickCheckbox, selectOption, validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("runners", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    // Notify section.
    await page.getByLabel("SES Email").clear();
    await page.getByLabel("SES Email").fill("new_email@email.com");

    // Task Limits section.
    await page.getByLabel("Max Hourly Patch Tasks Per User").clear();
    await page.getByLabel("Max Hourly Patch Tasks Per User").fill("9999");

    // Host Init section.
    await page.getByLabel("Max Total Dynamic Hosts").clear();
    await page.getByLabel("Max Total Dynamic Hosts").fill("8888");

    // Scheduler section.
    await selectOption(page, "Rounding Rule", "Round up");

    await page.getByLabel("Default Future Host Fraction").clear();
    await page.getByLabel("Default Future Host Fraction").fill("0.6");

    const groupVersionsCheckbox = page.getByRole("checkbox", {
      name: "Group Versions",
    });
    await clickCheckbox(groupVersionsCheckbox);

    // Repotracker section.
    await page.getByLabel("New Revisions to Fetch").clear();
    await page.getByLabel("New Revisions to Fetch").fill("5");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(page.getByLabel("SES Email")).toHaveValue(
      "new_email@email.com",
    );
    await expect(
      page.getByLabel("Max Hourly Patch Tasks Per User"),
    ).toHaveValue("9999");
    await expect(page.getByLabel("Max Total Dynamic Hosts")).toHaveValue(
      "8888",
    );
    await expect(page.getByLabel("Rounding Rule")).toContainText("Round up");
    await expect(page.getByLabel("Default Future Host Fraction")).toHaveValue(
      "0.6",
    );
    await expect(groupVersionsCheckbox).not.toBeChecked();
    await expect(page.getByLabel("New Revisions to Fetch")).toHaveValue("5");
  });
});
