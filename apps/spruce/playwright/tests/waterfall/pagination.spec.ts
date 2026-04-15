import { test, expect } from "../../fixtures";

test.describe("pagination", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/spruce/waterfall");
  });

  test("url query params update as page changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page).toHaveURL("/project/spruce/waterfall");

    await expect(page.getByTestId("version-labels")).toContainText("2ab1c56");

    await page.getByTestId("next-page-button").click();
    await expect(page.getByTestId("version-labels")).toContainText("e391612");
    await expect(page).toHaveURL(/maxOrder/);

    await page.getByTestId("prev-page-button").click();
    await expect(page.getByTestId("version-labels")).toContainText("2ab1c56");
    await expect(page).toHaveURL("/project/spruce/waterfall");
  });

  test("versions update correctly as page changes", async ({
    authenticatedPage: page,
  }) => {
    const firstPageFirstCommit = "2ab1c56";
    const secondPageFirstCommit = "e391612";

    const versionLabels = page.getByTestId("version-labels").locator("> *");

    await expect(versionLabels).toHaveCount(6);
    await expect(versionLabels.nth(0)).toContainText(firstPageFirstCommit);

    await page.getByTestId("next-page-button").click();
    await expect(versionLabels).toHaveCount(5);
    await expect(versionLabels.nth(0)).toContainText(secondPageFirstCommit);

    await page.getByTestId("prev-page-button").click();
    await expect(versionLabels).toHaveCount(6);
    await expect(versionLabels.nth(0)).toContainText(firstPageFirstCommit);
  });

  test("builds update correctly as page changes", async ({
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

    await page.getByTestId("next-page-button").click();
    await expect(buildGroups.nth(0).getByRole("link")).toHaveCount(8);
    await expect(buildGroups.nth(1).getByRole("link")).toHaveCount(0);
    await expect(buildGroups.nth(2).getByRole("link")).toHaveCount(8);
    await expect(buildGroups.nth(3).getByRole("link")).toHaveCount(8);
    await expect(buildGroups.nth(4).getByRole("link")).toHaveCount(1);

    await page.getByTestId("prev-page-button").click();
    await expect(buildGroups.nth(0).getByRole("link")).toHaveCount(1);
    await expect(buildGroups.nth(1).getByRole("link")).toHaveCount(8);
    await expect(buildGroups.nth(2).getByRole("link")).toHaveCount(0);
    await expect(buildGroups.nth(3).getByRole("link")).toHaveCount(1);
    await expect(buildGroups.nth(4).getByRole("link")).toHaveCount(8);
    await expect(buildGroups.nth(5).getByRole("link")).toHaveCount(8);
  });

  test("correctly disables buttons on first and last page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    const nextButton = page.getByTestId("next-page-button");
    await expect(nextButton).toHaveAttribute("aria-disabled", "false");
    await nextButton.click();
    await expect(nextButton).toHaveAttribute("aria-disabled", "false");
    await nextButton.click();
    await expect(nextButton).toHaveAttribute("aria-disabled", "false");
    await nextButton.click();
    await expect(nextButton).toHaveAttribute("aria-disabled", "true");
    const prevButton = page.getByTestId("prev-page-button");
    await expect(prevButton).toHaveAttribute("aria-disabled", "false");
    await prevButton.click();
    await expect(prevButton).toHaveAttribute("aria-disabled", "false");
    await prevButton.click();
    await expect(prevButton).toHaveAttribute("aria-disabled", "false");
    await prevButton.click();
    await expect(prevButton).toHaveAttribute("aria-disabled", "true");
  });

  test.describe("'Jump to most recent commit' button", () => {
    test("returns user to the first page", async ({
      authenticatedPage: page,
    }) => {
      const firstPageFirstCommit = "2ab1c56";
      const versionLabels = page.getByTestId("version-labels").locator("> *");

      await expect(versionLabels).toHaveCount(6);
      await expect(versionLabels.nth(0)).toContainText(firstPageFirstCommit);

      await page.getByTestId("next-page-button").click();
      await expect(versionLabels).toHaveCount(5);
      await expect(page).toHaveURL(/maxOrder/);
      await page.getByTestId("next-page-button").click();
      await expect(page).toHaveURL(/maxOrder/);

      await page.getByTestId("waterfall-menu").click();
      await page.getByTestId("jump-to-most-recent").click();
      await expect(versionLabels.nth(0)).toContainText(firstPageFirstCommit);
      await expect(page).not.toHaveURL(/maxOrder/);
      await expect(page).not.toHaveURL(/minOrder/);
    });
  });

  test("clears minOrder and maxOrder params when reaching the first page", async ({
    authenticatedPage: page,
  }) => {
    const versionLabels = page.getByTestId("version-labels").locator("> *");
    await expect(versionLabels).toHaveCount(6);

    await expect(page.getByTestId("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("next-page-button").click();
    await expect(versionLabels).toHaveCount(5);
    await expect(page).toHaveURL(/maxOrder/);

    await expect(page.getByTestId("next-page-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("prev-page-button").click();
    await expect(versionLabels).toHaveCount(6);
    await expect(page).not.toHaveURL(/maxOrder/);
    await expect(page).not.toHaveURL(/minOrder/);
  });
});
