import { test, expect } from "../../fixtures";
import {
  validateToast,
  validateDatePickerDate,
  clearDatePickerInput,
  typeDatePickerDate,
} from "../../helpers";
import { getProjectSettingsRoute, project } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Project Settings when not defaulting to repo", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Does not show a 'Default to Repo' button on page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("default-to-repo-button")).toHaveCount(0);
  });

  test("Shows two radio boxes", async ({ authenticatedPage: page }) => {
    await expect(
      page.getByTestId("enabled-radio-box").locator("> *"),
    ).toHaveCount(2);
  });

  test("Successfully attaches to and detaches from a repo that does not yet exist and shows 'Default to Repo' options", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("attach-repo-button").click();
    await page
      .getByTestId("attach-repo-modal")
      .getByRole("button", { name: "Attach" })
      .click();
    await validateToast(page, "success", "Successfully attached to repo", true);
    await page.getByTestId("attach-repo-button").click();
    await page
      .getByTestId("attach-repo-modal")
      .getByRole("button", { name: "Detach" })
      .click();
    await validateToast(page, "success", "Successfully detached from repo");
  });

  test("Allows enabling Run Every Mainline Commit", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("navitem-general").click();
    await page
      .getByTestId("run-every-mainline-commit-radio-box")
      .getByText("Enabled")
      .click();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
    await expect(
      page
        .getByTestId("run-every-mainline-commit-radio-box")
        .getByLabel("Enabled"),
    ).toHaveAttribute("aria-checked", "true");
  });

  test.describe("Variables page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
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
      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").fill("sample_name");
      await expectSaveButtonEnabled(page, false);
      await page.getByTestId("var-value-input").fill("sample_value");
      await page
        .getByTestId("var-description-input")
        .fill("Sample description");
      await expect(page.getByTestId("var-private-input")).toBeChecked();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(page.getByTestId("var-value-input")).toHaveValue(
        "{REDACTED}",
      );
      await expect(page.getByTestId("var-name-input")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      await expect(page.getByTestId("var-value-input")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      await expect(page.getByTestId("var-private-input")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      await expect(page.getByTestId("var-admin-input")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
      await expect(page.getByTestId("var-description-input")).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });

    test("Typing a duplicate variable name will disable saving and show an error message", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").fill("sample_name");
      await page.getByTestId("var-value-input").fill("sample_value");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await page.getByTestId("add-button").click();
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
      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").first().fill("admin_var");
      await page.getByTestId("var-value-input").first().fill("admin_value");
      await page.locator("label", { hasText: "Admin Only" }).click();
      await expect(page.getByTestId("var-admin-input")).toBeChecked();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
    });

    test("Should persist saved variables and allow deletion", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").fill("sample_name");
      await page.getByTestId("var-value-input").fill("sample_value");
      await page
        .getByTestId("var-description-input")
        .fill("Description for sample_name");
      await page.getByTestId("add-button").click();
      await page.getByTestId("var-name-input").first().fill("sample_name_2");
      await page.getByTestId("var-value-input").first().fill("sample_value");
      await page
        .getByTestId("var-description-input")
        .first()
        .fill("Description for sample_name_2");
      await page.getByTestId("add-button").click();
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
      await expect(
        page.getByTestId("var-description-input").nth(0),
      ).toHaveValue("Description for admin_var");
      await expect(page.getByTestId("var-name-input").nth(1)).toHaveValue(
        "sample_name",
      );
      await expect(
        page.getByTestId("var-description-input").nth(1),
      ).toHaveValue("Description for sample_name");
      await expect(page.getByTestId("var-name-input").nth(2)).toHaveValue(
        "sample_name_2",
      );
      await expect(
        page.getByTestId("var-description-input").nth(2),
      ).toHaveValue("Description for sample_name_2");

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

  test.describe("GitHub page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-github-commitqueue").click();
    });

    test("Allows adding a git tag alias", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("git-tag-enabled-radio-box")
        .getByText("Enabled")
        .click();
      await page
        .getByTestId("add-button")
        .filter({ hasText: "Add Git Tag" })
        .click();
      await page.getByTestId("git-tag-input").fill("myGitTag");
      await page.getByTestId("remote-path-input").fill("./evergreen.yml");

      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(page.getByTestId("remote-path-input")).toHaveValue(
        "./evergreen.yml",
      );
    });
  });

  test.describe("Periodic Builds page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-periodic-builds").click();
    });

    test("allows a user to schedule the next build on the current day", async ({
      authenticatedPage: page,
    }) => {
      await page.clock.setFixedTime(new Date(2025, 8, 16));
      await page.reload();
      await page.getByTestId("navitem-periodic-builds").click();
      await page.getByTestId("add-button").click();
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "09",
        day: "16",
      });
      await clearDatePickerInput(page);

      await typeDatePickerDate(page, { year: "2025", month: "01", day: "01" });
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "01",
        day: "01",
      });
      await expect(page.getByText("Date must be after")).toBeVisible();
      await clearDatePickerInput(page);

      await typeDatePickerDate(page, { year: "2025", month: "09", day: "20" });
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "09",
        day: "20",
      });
      await expect(page.getByText("Date must be after")).toHaveCount(0);
      await clearDatePickerInput(page);

      await typeDatePickerDate(page, { year: "2025", month: "09", day: "16" });
      await validateDatePickerDate(page, "date-picker", {
        year: "2025",
        month: "09",
        day: "16",
      });
      await expect(page.getByText("Date must be after")).toHaveCount(0);
    });

    test("Disables save button when interval is NaN or below minimum and allows saving a number in range", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("add-button").click();
      const intervalInput = page.getByTestId("interval-input");
      await intervalInput.fill("NaN");
      await page.getByTestId("config-file-input").fill("config.yml");
      await expectSaveButtonEnabled(page, false);
      await expect(page.getByText("Value should be a number.")).toBeVisible();
      await intervalInput.clear();
      await intervalInput.fill("0");
      await expectSaveButtonEnabled(page, false);
      await intervalInput.clear();
      await intervalInput.fill("12");
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
    });
  });

  test.describe("Project Triggers page", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.getByTestId("navitem-project-triggers").click();
    });

    test("Saves a project trigger", async ({ authenticatedPage: page }) => {
      await page.getByTestId("add-button").click();
      await expect(page.getByTestId("project-input")).toBeVisible();
      await expect(page.getByTestId("project-input")).toBeEnabled();
      await page.getByTestId("project-input").fill("spruce");
      await page.getByTestId("config-file-input").fill(".evergreen.yml");
    });
  });
});
