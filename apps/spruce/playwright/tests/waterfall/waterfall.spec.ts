import { test, expect } from "../../fixtures";

test.describe("waterfall page", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/spruce/waterfall");
  });

  test.describe("version labels", () => {
    test("shows a git tag label", async ({ authenticatedPage: page }) => {
      const versionLabels = page.getByTestId("version-labels").locator("> *");
      await expect(versionLabels.nth(4)).toContainText("Git Tags: v2.28.5");
    });
  });

  test.describe("inactive commits", () => {
    test("renders an inactive version column, button and broken versions badge", async ({
      authenticatedPage: page,
    }) => {
      const builds = page.getByTestId("build-group");
      const buildGroups = builds.locator("> *");
      const versionLabels = page.getByTestId("version-labels").locator("> *");
      const inactiveButton = versionLabels.nth(2).getByRole("button");

      await expect(inactiveButton).toHaveAttribute(
        "data-cy",
        "inactive-versions-button",
      );
      await expect(page.getByTestId("broken-versions-badge")).toBeVisible();
      await expect(page.getByTestId("broken-versions-badge")).toContainText(
        "1 broken",
      );
      await expect(buildGroups.nth(2)).toHaveAttribute(
        "data-cy",
        "inactive-column",
      );
    });

    test("clicking an inactive versions button renders a inactive versions modal", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("inactive-versions-button").first().click();
      const modal = page.getByTestId("inactive-versions-modal");
      await expect(modal).toBeVisible();
      await expect(modal).toContainText("Broken");
      await expect(modal).toContainText("1 Inactive Version");
      await expect(modal).toContainText("e695f65");
      await expect(modal).toContainText("Mar 2, 2022");
      await expect(modal).toContainText(
        "EVG-16356 Use Build Variant stats to fetch grouped build variants (#1106)",
      );
    });
  });

  test.describe("task grid", () => {
    test("correctly renders child tasks", async ({
      authenticatedPage: page,
    }) => {
      const builds = page.getByTestId("build-group");
      const buildGroups = builds.locator("> *");
      await expect(buildGroups.nth(0).getByRole("link")).toHaveCount(1);
      await expect(buildGroups.nth(1).getByRole("link")).toHaveCount(8);
      await expect(buildGroups.nth(2).getByRole("link")).toHaveCount(0);
      await expect(buildGroups.nth(3).getByRole("link")).toHaveCount(1);
      await expect(buildGroups.nth(4).getByRole("link")).toHaveCount(8);
      await expect(buildGroups.nth(5).getByRole("link")).toHaveCount(8);
    });
  });

  test.describe("task stats tooltip", () => {
    test("shows task stats when clicked", async ({
      authenticatedPage: page,
    }) => {
      await expect(page.getByTestId("task-stats-tooltip")).toBeHidden();
      const tooltipButton = page
        .getByTestId("task-stats-tooltip-button")
        .nth(3);
      await expect(tooltipButton).toHaveAttribute("aria-disabled", "false");
      await tooltipButton.click();
      const tooltip = page.getByTestId("task-stats-tooltip");
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toContainText("Failed");
      await expect(tooltip).toContainText("Succeeded");
    });
  });

  test.describe("pinned build variants", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto("/project/evergreen/waterfall");
    });

    test("clicking the pin button moves the build variant to the top, persist on reload, and unpin on click", async ({
      authenticatedPage: page,
    }) => {
      const buildVariantLinks = page.getByTestId("build-variant-link");
      await expect(buildVariantLinks.nth(0)).toHaveText("Lint");
      await page.getByTestId("pin-button").nth(1).click();
      await expect(buildVariantLinks.nth(0)).toHaveText("Ubuntu 16.04");
      await page.reload();
      await expect(buildVariantLinks.nth(0)).toHaveText("Ubuntu 16.04");
      await page.getByTestId("pin-button").nth(1).click();
      await expect(buildVariantLinks.nth(0)).toHaveText("Lint");
    });
  });
});
