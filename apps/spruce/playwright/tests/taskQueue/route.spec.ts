import { test, expect } from "../../fixtures";

test.describe("Task Queue", () => {
  test("Sets first distro in list as default if no distro in url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/task-queue");
    await expect(page).toHaveURL(/\/task-queue\/osx-108$/);
    await expect(page.getByText("osx-108").first()).toBeVisible();
  });

  test("Uses distro param in url to query queue and renders table", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/task-queue/osx-108");
    await expect(page.getByTestId("task-queue-table")).toBeVisible();
    await expect(page.getByText("osx-108").first()).toBeVisible();
  });

  test("Selecting a distro queries the queue for that distro", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/task-queue/debian71-test");
    await expect(page.getByText("No tasks found in queue")).toBeVisible();

    await page.getByTestId("distro-dropdown").click();
    const option = page.getByText("osx-108").first();
    await expect(option).toBeVisible();
    await option.click();
    await expect(page.getByTestId("leafygreen-table-row")).toHaveCount(13);
  });

  test("Renders link to host page filtered to that particular distro", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/task-queue/debian71-test");
    const viewHostsLink = page.getByRole("link", { name: "View hosts" });
    await expect(viewHostsLink).toHaveAttribute(
      "href",
      "/hosts?distroId=debian71-test&startedBy=mci",
    );
  });

  test("Searching for a distro shows results that match search term", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("/task-queue/debian71-test");

    const dropdown = page.getByTestId("distro-dropdown");
    await expect(dropdown).toHaveAttribute("aria-disabled", "false");
    await dropdown.click();

    const searchInput = page.getByPlaceholder("Search distros");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("osx");

    const dropdownOptions = page.getByTestId("distro-dropdown-options");
    await expect(dropdownOptions.getByText("debian71-test")).toBeHidden();
    await expect(dropdownOptions.getByText("osx-108")).toBeVisible();
  });

  test("Scrolls to current task if taskId param in url", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "/task-queue/osx-108?taskId=evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );
    await expect(page.getByTestId("task-queue-table")).toBeVisible();
    await expect(page.locator("[data-selected='true']")).toBeVisible();
    await expect(page.locator("[data-selected='true']")).toHaveCount(1);
    await expect(page.locator("[data-selected='true']")).toBeVisible();
  });

  test("Task links goes to Spruce for both patches and mainline commits", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      "/task-queue/osx-108?taskId=evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );

    // patch
    const patchLink = page.getByTestId("current-task-link").nth(0);
    const patchHref = await patchLink.getAttribute("href");
    expect(patchHref).not.toContain("localhost");

    // mainline commit
    const mainlineLink = page.getByTestId("current-task-link").nth(1);
    const mainlineHref = await mainlineLink.getAttribute("href");
    expect(mainlineHref).not.toContain("localhost");
  });
});
