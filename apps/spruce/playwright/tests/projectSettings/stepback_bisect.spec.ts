import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  project,
  projectUseRepoEnabled,
} from "./constants";
import { save } from "./utils";

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
      await page
        .getByTestId("stepback-bisect-group")
        .locator("label", { hasText: "Enable" })
        .click();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");

      await page.reload();

      await expect(
        page
          .getByTestId("stepback-bisect-group")
          .getByRole("radio", { name: "Enable" }),
      ).toHaveAttribute("aria-checked", "true");
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
          .getByRole("radio", { name: "Disable" }),
      ).toHaveAttribute("aria-checked", "true");
    });

    test("Clicking on enabled and then save shows a success toast", async ({
      authenticatedPage: page,
    }) => {
      await page
        .getByTestId("stepback-bisect-group")
        .locator("label", { hasText: "Enable" })
        .click();
      await save(page);
      await validateToast(page, "success", "Successfully updated project");

      await page.reload();

      await expect(
        page
          .getByTestId("stepback-bisect-group")
          .getByRole("radio", { name: "Enable" }),
      ).toHaveAttribute("aria-checked", "true");
    });
  });
});
