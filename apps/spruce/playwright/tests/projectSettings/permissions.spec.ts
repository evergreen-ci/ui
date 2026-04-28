import { users } from "@evg-ui/playwright-config/constants";
import { test, expect } from "../../fixtures";
import { login, logout } from "../../helpers";
import {
  getProjectSettingsRoute,
  getRepoSettingsRoute,
  projectUseRepoEnabled,
  repo,
} from "./constants";

test.describe("project/repo permissions", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await logout(page);
  });

  test.describe("projects", () => {
    test("disables fields when user lacks edit permissions", async ({
      authenticatedPage: page,
    }) => {
      await login(page, users.privileged);
      await page.goto(getProjectSettingsRoute(projectUseRepoEnabled));
      const settingsPage = page.getByTestId("project-settings-page");
      await expect(
        settingsPage.locator('input[type="radio"]').first(),
      ).toHaveAttribute("aria-disabled", "true");
    });

    test("enables fields if user has edit permissions", async ({
      authenticatedPage: page,
    }) => {
      await login(page, users.admin);
      await page.goto(getProjectSettingsRoute(projectUseRepoEnabled));
      const settingsPage = page.getByTestId("project-settings-page");
      await expect(
        settingsPage.locator('input[type="radio"]').first(),
      ).toHaveAttribute("aria-disabled", "false");
    });
  });

  test.describe("repos", () => {
    test("disables fields when user lacks edit permissions", async ({
      authenticatedPage: page,
    }) => {
      await login(page, users.privileged);
      await page.goto(getRepoSettingsRoute(repo));
      const settingsPage = page.getByTestId("repo-settings-page");
      await expect(
        settingsPage.locator('input[type="radio"]').first(),
      ).toHaveAttribute("aria-disabled", "true");
    });

    test("enables fields if user has edit permissions", async ({
      authenticatedPage: page,
    }) => {
      await login(page, users.admin);
      await page.goto(getRepoSettingsRoute(repo));
      const settingsPage = page.getByTestId("repo-settings-page");
      await expect(
        settingsPage.locator('input[type="radio"]').first(),
      ).toHaveAttribute("aria-disabled", "false");
    });
  });
});
