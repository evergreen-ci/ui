import { test, expect } from "../../../fixtures";
import { clickRadio, validateToast } from "../../../helpers";
import {
  getProjectSettingsRoute,
  project,
  projectUseRepoEnabled,
} from "../constants";
import { save } from "../utils";

const origin = getProjectSettingsRoute(project);

test.describe("general section", () => {
  test.describe("Renaming the identifier", () => {
    test("Update identifier", async ({ authenticatedPage: page }) => {
      await page.goto(origin);
      const warningText =
        "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.";

      await expect(page.getByTestId("input-warning")).toHaveCount(0);
      await page.getByTestId("identifier-input").clear();
      await page.getByTestId("identifier-input").fill("new-identifier");
      await expect(page.getByTestId("input-warning")).toContainText(
        warningText,
      );
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(page).toHaveURL(/new-identifier/);
    });
  });

  test("Allows enabling Run Every Mainline Commit", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-general").click();
    const enableRadio = page
      .getByTestId("run-every-mainline-commit-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(enableRadio);
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
    await expect(enableRadio).toBeChecked();
  });

  test.describe("Stepback bisect setting", () => {
    test.describe("Repo project present", () => {
      const destination = getProjectSettingsRoute(projectUseRepoEnabled);

      test.beforeEach(async ({ authenticatedPage: page }) => {
        await page.goto(destination);
      });

      test("Starts as default to repo", async ({ authenticatedPage: page }) => {
        await expect(
          page
            .getByTestId("stepback-bisect-group")
            .getByRole("radio", { name: "Default to repo" }),
        ).toHaveAttribute("aria-checked", "true");
      });

      test("Clicking on enabled and then save shows a success toast", async ({
        authenticatedPage: page,
      }) => {
        const enableRadio = page
          .getByTestId("stepback-bisect-group")
          .getByRole("radio", { name: "Enabled" });
        await clickRadio(enableRadio);
        await save(page);
        await validateToast(page, "success", "Successfully updated project");
        await page.reload();
        await expect(enableRadio).toHaveAttribute("aria-checked", "true");
      });
    });

    test.describe("Repo project not present", () => {
      const destination = getProjectSettingsRoute(project);

      test.beforeEach(async ({ authenticatedPage: page }) => {
        await page.goto(destination);
      });

      test("Starts as disabled", async ({ authenticatedPage: page }) => {
        await expect(
          page
            .getByTestId("stepback-bisect-group")
            .getByRole("radio", { name: "Disabled", exact: true }),
        ).toHaveAttribute("aria-checked", "true");
      });

      test("Clicking on enabled and then save shows a success toast", async ({
        authenticatedPage: page,
      }) => {
        const enableRadio = page
          .getByTestId("stepback-bisect-group")
          .getByRole("radio", { name: "Enabled" });
        await clickRadio(enableRadio);
        await save(page);
        await validateToast(page, "success", "Successfully updated project");
        await page.reload();
        await expect(enableRadio).toHaveAttribute("aria-checked", "true");
      });
    });
  });
});
