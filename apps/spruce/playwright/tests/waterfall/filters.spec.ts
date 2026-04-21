import { test, expect } from "../../fixtures";
import { validateDatePickerDate, selectDatePickerDate } from "../../helpers";

test.describe("status filtering", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/spruce/waterfall");
  });

  test("filters on failed tasks and fetches additional from the server", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByTestId("inactive-versions-button").first(),
    ).toContainText("1");
    await page.getByTestId("status-filter").click();
    await page.getByTestId("failed-option").click();
    await expect(page.locator("a[data-tooltip]")).toHaveCount(4);
    await expect(page.getByTestId("version-label-active")).toHaveCount(4);
    await expect(page.getByTestId("inactive-versions-button")).toHaveCount(3);
  });
});

test.describe("requester filtering", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/spruce/waterfall");
  });

  test("filters on periodic builds and shows an empty state", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByTestId("inactive-versions-button").first(),
    ).toContainText("1");
    await page.getByTestId("requester-filter").click();
    await page.getByTestId("ad_hoc-option").click();
    await expect(page.getByText("No Results Found")).toBeVisible();
  });

  test("filters on git tags and fetches more from the server", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("requester-filter").click();
    await page.getByTestId("git_tag_request-option").click();

    const inactiveButtons = page.getByTestId("inactive-versions-button");
    await expect(inactiveButtons).toHaveCount(3);
    await expect(inactiveButtons.nth(0)).toContainText("3");
    await expect(inactiveButtons.nth(1)).toContainText("6");
    await expect(inactiveButtons.nth(2)).toContainText("5");
    await expect(page.getByTestId("version-label-active")).toHaveCount(3);
  });

  test("clears requester filters", async ({ authenticatedPage: page }) => {
    await page.getByTestId("requester-filter").click();
    await page.getByTestId("gitter_request-option").click();
    await expect(page.getByTestId("version-label-active")).toHaveCount(4);
    await page
      .getByTestId("requester-filter")
      .getByRole("button", { name: "Clear selection" })
      .click();
    await expect(page.getByTestId("version-label-active")).toHaveCount(5);
  });
});

test.describe("build variant filtering", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/evergreen/waterfall");
  });

  test("submitting a build variant filter updates the url, creates a badge and filters the grid to only show active builds", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);
    await page.getByTestId("build-variant-filter-input").fill("P");
    await page.getByTestId("build-variant-filter-input").press("Enter");

    const filterChip = page.getByTestId("filter-chip");
    await expect(filterChip).toHaveText("Variant: ^P$");
    await expect(page).toHaveURL(/buildVariants=%5EP%24/);
    await expect(page.getByTestId("build-variant-label")).toHaveCount(0);

    const chipDismissButton = filterChip.getByRole("button");
    await expect(chipDismissButton).toBeVisible();
    await chipDismissButton.click();
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);

    await page.getByTestId("build-variant-filter-select").click();
    await expect(page.locator('[role="listbox"]')).toHaveCount(1);
    await page.locator('[role="listbox"]').getByText("Regex").click();

    await page.getByTestId("build-variant-filter-input").fill("Ubuntu");
    await page.getByTestId("build-variant-filter-input").press("Enter");
    await expect(page).toHaveURL(/buildVariants=Ubuntu/);
    await expect(filterChip).toHaveText("Variant: Ubuntu");

    await expect(page.getByTestId("build-variant-label")).toHaveCount(1);
    await expect(page.getByTestId("build-variant-label")).toHaveText(
      "Ubuntu 16.04",
    );
    await page.getByTestId("build-variant-filter-input").fill("P");
    await page.getByTestId("build-variant-filter-input").press("Enter");
    await expect(page).toHaveURL(/buildVariants=Ubuntu,P/);
  });
});

test.describe("task filtering", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/evergreen/waterfall");
  });

  test("with exact match, filters grid squares, removes inactive build variants, creates a badge, and updates the url", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);
    await page.getByTestId("task-filter-input").fill("js-test");
    await page.getByTestId("task-filter-input").press("Enter");

    await expect(page.getByTestId("build-variant-label")).toHaveCount(1);
    await expect(page).toHaveURL(/tasks=%5Ejs%5C-test%24/);
    await expect(page.getByTestId("filter-chip")).toHaveText(
      "Task: ^js\\-test$",
    );
    await expect(page.locator("a[data-tooltip]")).toHaveCount(1);
    await expect(page.locator("a[data-tooltip]")).toHaveAttribute(
      "data-tooltip",
      "js-test - Succeeded",
    );
  });

  test("with regex match, filters grid squares, removes inactive build variants, creates a badge, and updates the url", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);
    await page.getByTestId("task-filter-select").click();
    await expect(page.locator('[role="listbox"]')).toHaveCount(1);
    await page.locator('[role="listbox"]').getByText("Regex").click();

    await page.getByTestId("task-filter-input").fill("agent");
    await page.getByTestId("task-filter-input").press("Enter");

    await expect(page.getByTestId("build-variant-label")).toHaveCount(1);
    await expect(page).toHaveURL(/tasks=agent/);

    const filterChips = page.getByTestId("filter-chip");
    await expect(filterChips.nth(0)).toHaveText("Task: agent");
    await expect(page.locator("a[data-tooltip]")).toHaveCount(1);
    await expect(page.locator("a[data-tooltip]")).toHaveAttribute(
      "data-tooltip",
      "test-agent - Succeeded",
    );

    await page.getByTestId("task-filter-input").fill("lint");
    await page.getByTestId("task-filter-input").press("Enter");
    await expect(page).toHaveURL(/tasks=agent,lint/);
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);
    await expect(filterChips.nth(1)).toHaveText("Task: lint");
    await expect(page.locator("a[data-tooltip]")).toHaveCount(4);
  });

  test("correctly applies build variant and task filters", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("build-variant-filter-select").click();
    await expect(page.locator('[role="listbox"]')).toHaveCount(1);
    await page.locator('[role="listbox"]').getByText("Regex").click();

    await page.getByTestId("task-filter-select").click();
    await expect(page.locator('[role="listbox"]')).toHaveCount(1);
    await page.locator('[role="listbox"]').getByText("Regex").click();

    await page.getByTestId("build-variant-filter-input").fill("Ubuntu");
    await page.getByTestId("build-variant-filter-input").press("Enter");
    await expect(page.getByTestId("build-variant-label")).toHaveCount(1);
    await expect(page.locator("a[data-tooltip]")).toHaveCount(45);
    await page.getByTestId("task-filter-input").fill("agent");
    await page.getByTestId("task-filter-input").press("Enter");
    await expect(page.getByTestId("build-variant-label")).toHaveCount(1);
    await expect(page.locator("a[data-tooltip]")).toHaveCount(1);
    await expect(page.getByTestId("filter-chip")).toHaveCount(2);
  });
});

test.describe("date filter", () => {
  test("url query params update when date filter is applied", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/spruce/waterfall");
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();
    await expect(page).toHaveURL("/project/spruce/waterfall");

    await selectDatePickerDate(page, "2022", "Feb", "2022-02-28");
    await expect(page).toHaveURL(/date=2022-02-28/);
    await validateDatePickerDate(page, "date-picker", {
      year: "2022",
      month: "02",
      day: "28",
    });

    const activeVersion = page.getByTestId("version-label-active").nth(0);
    await expect(activeVersion.getByText("e391612")).toBeVisible();
    await expect(activeVersion).toHaveAttribute("data-highlighted", "true");
  });

  test("date is cleared when paginating", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/spruce/waterfall?date=2022-02-28");
    await validateDatePickerDate(page, "date-picker", {
      year: "2022",
      month: "02",
      day: "28",
    });
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();
    await expect(page.getByTestId("prev-page-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("prev-page-button").click();
    await validateDatePickerDate(page, "date-picker");
    await expect(page).not.toHaveURL(/date/);
  });

  test("versions update correctly when date filter is applied", async ({
    authenticatedPage: page,
  }) => {
    const commit20220228 = "e391612";
    const commit20220303 = "2c9056d";

    await page.goto("/project/spruce/waterfall?date=2022-02-28");
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();

    const versionLabels = page.getByTestId("version-labels").locator("> *");
    await expect(versionLabels).toHaveCount(5);
    await expect(versionLabels.nth(0)).toContainText(commit20220228);

    await page.goto("/project/spruce/waterfall?date=2022-03-03");
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();
    await expect(versionLabels).toHaveCount(6);
    await expect(versionLabels.nth(0)).toContainText(commit20220303);
  });
});

test.describe("revision filtering", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/project/spruce/waterfall");
  });

  test("filters by git commit", async ({ authenticatedPage: page }) => {
    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("git-commit-search").click();
    await expect(page.getByTestId("git-commit-search-modal")).toBeVisible();
    await page.getByLabel("Git Commit Hash").fill("ab49443");
    await page.getByLabel("Git Commit Hash").press("Enter");
    await expect(page.getByTestId("git-commit-search-modal")).toBeHidden();

    const targetVersion = page.getByTestId("version-label-active").nth(1);
    await expect(targetVersion.getByText("ab49443")).toBeVisible();
    await expect(targetVersion).toHaveAttribute("data-highlighted", "true");
  });

  test("should highlight a commit if it is passed into the url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/spruce/waterfall?revision=ab49443");
    const targetVersion = page.getByTestId("version-label-active").nth(1);
    await expect(targetVersion.getByText("ab49443")).toBeVisible();
    await expect(targetVersion).toHaveAttribute("data-highlighted", "true");
  });
});

test.describe("project selection", () => {
  test("selects a project and applies current task filters", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/project/spruce/waterfall");
    await page.getByTestId("status-filter").click();
    await page.getByTestId("test-timed-out-option").click();
    await page.locator("body").click();
    await page.getByTestId("project-select").click();
    await page
      .getByTestId("project-select-options")
      .getByText("evergreen smoke test")
      .click();
    await expect(page).toHaveURL(
      "/project/evergreen/waterfall?statuses=test-timed-out",
    );
  });
});

test.describe("clear all filters button", () => {
  test("clicking the clear filters button clears all parameters except for minOrder & maxOrder", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "/project/spruce/waterfall?buildVariants=ubuntu&maxOrder=1235&requesters=gitter_request&statuses=success&tasks=test",
    );
    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("clear-all-filters").click();

    await expect(page).not.toHaveURL(/buildVariants/);
    await expect(page).not.toHaveURL(/tasks/);
    await expect(page).not.toHaveURL(/statuses/);
    await expect(page).not.toHaveURL(/requesters/);
    await expect(page).toHaveURL(/maxOrder=1235/);
  });
});
