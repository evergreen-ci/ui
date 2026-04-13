import { test, expect } from "../../fixtures";
import { clickCheckboxByLabel } from "../../helpers";

const MY_PATCHES_ROUTE = "/user/admin/patches";
const BOB_HICKS_PATCHES_ROUTE = "/user/bob.hicks/patches";
const REGULAR_USER_PATCHES_ROUTE = "/user/regular/patches";

test.describe("My Patches Page", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.context().addCookies([
      {
        name: "include-commit-queue-user-patches",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("Redirects user to user patches route from `/user/:id`", async ({
    authenticatedPage: page,
  }) => {
    await page.goto("user/chicken");
    await expect(page).toHaveURL("/user/chicken/patches");
  });

  test("The page title should be 'My Patches' when viewing the logged in users' patches page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(MY_PATCHES_ROUTE);
    await expect(
      page.getByRole("heading", { name: "My Patches" }),
    ).toBeVisible();
  });

  test("The page title should reflect another users patches when viewing another users patches page", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(BOB_HICKS_PATCHES_ROUTE);
    await expect(page.getByText("Bob Hicks's Patches")).toBeVisible();
    await page.goto(REGULAR_USER_PATCHES_ROUTE);
    await expect(page.getByText("Regular User's Patches")).toBeVisible();
  });

  test("Typing in patch description input updates the url, requests patches and renders patches", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(MY_PATCHES_ROUTE);
    const inputVal = "testtest";
    await page.getByTestId("patch-description-input").fill(inputVal);
    expect(page.url()).toContain(`patchName=${inputVal}`);
    await page.getByTestId("patch-description-input").clear();
  });

  test("Inputting a number successfully searches patches", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(MY_PATCHES_ROUTE);
    await page.getByTestId("patch-description-input").fill("3186");
    await expect(page.getByTestId("patch-card")).toHaveCount(1);
    await page.getByTestId("patch-description-input").clear();
  });

  test("Searching for a nonexistent patch shows 'No patches found'", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(MY_PATCHES_ROUTE);
    await page.getByTestId("patch-description-input").fill("satenarstharienht");
    await expect(page.getByText("No patches found")).toBeVisible();
  });

  test("Grouped task status icon should link to version page with appropriate filters", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(MY_PATCHES_ROUTE);
    await expect(
      page.getByTestId("grouped-task-status-badge").nth(1),
    ).toHaveAttribute(
      "href",
      "/version/5ecedafb562343215a7ff297/tasks?statuses=success",
    );
  });

  test.describe("Patch submission selector", () => {
    test("Clicking the patch submission selector updates the URL, and renders patches", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(MY_PATCHES_ROUTE);
      await page.getByTestId("requester-selector").click();
      const cliPatchTitle = "main: EVG-7823 add a commit queue message (#4048)";
      const prPatchTitle =
        "evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)";
      await expect(page.getByTestId("patch-card").first()).toContainText(
        cliPatchTitle,
      );
      await page.getByTestId("github_pull_request-option").click();
      expect(page.url()).toContain("requesters=github_pull_request");
      await expect(page.getByTestId("patch-card").first()).toContainText(
        prPatchTitle,
      );
      await page.getByTestId("patch_request-option").click();
      expect(page.url()).toContain(
        "requesters=github_pull_request,patch_request",
      );
      await expect(page.getByTestId("patch-card").first()).toContainText(
        cliPatchTitle,
      );
      await page.getByTestId("github_pull_request-option").click();
      expect(page.url()).toContain("requesters=patch_request");
      await expect(page.getByTestId("patch-card").first()).toContainText(
        cliPatchTitle,
      );
    });
  });

  test("Changing page size updates URL and renders less than or equal to that many rows", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(`${MY_PATCHES_ROUTE}?limit=10`);
    for (const pageSize of [20, 10, 50, 100]) {
      await page
        .locator("button[aria-labelledby='page-size-select']")
        .first()
        .click();
      await page.getByText(`${pageSize} / page`).first().click();
      const patchCards = page.getByTestId("patch-card");
      const count = await patchCards.count();
      expect(count).toBeLessThanOrEqual(pageSize);
      expect(page.url()).toContain(`limit=${pageSize}`);
    }
  });

  test.describe("Changing page number", () => {
    test("Displays the next page of results and updates URL when right arrow is clicked and next page exists", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${MY_PATCHES_ROUTE}?limit=10`);
      await expect(page.getByTestId("patch-card")).toHaveCount(10);

      const nextPageBtn = page.getByTestId("next-page-button").first();
      await expect(nextPageBtn).toHaveAttribute("aria-disabled", "false");
      await nextPageBtn.click();

      for (const displayName of secondPageDisplayNames) {
        await expect(page.getByText(displayName).first()).toBeVisible();
      }
      expect(page.url()).toContain("page=1");
    });

    test("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${MY_PATCHES_ROUTE}?limit=10&page=1`);
      await expect(page.getByTestId("patch-card")).toHaveCount(10);

      const prevPageBtn = page.getByTestId("prev-page-button").first();
      await expect(prevPageBtn).toHaveAttribute("aria-disabled", "false");
      await prevPageBtn.click();

      for (const displayName of firstPageDisplayNames) {
        await expect(page.getByText(displayName)).toBeVisible();
      }
      expect(page.url()).toContain("page=0");
    });

    test("Should disable pagination when there are no more pages", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(`${MY_PATCHES_ROUTE}?limit=10`);
      await expect(page.getByTestId("patch-card")).toHaveCount(10);

      const prevPageBtn = page.getByTestId("prev-page-button").first();
      await expect(prevPageBtn).toHaveAttribute("aria-disabled", "true");

      await page.goto(`${MY_PATCHES_ROUTE}?page=2`);
      await expect(page.getByTestId("patch-card")).toHaveCount(6);

      const nextPageBtn = page.getByTestId("next-page-button").first();
      await expect(nextPageBtn).toHaveAttribute("aria-disabled", "true");
    });
  });

  test.describe("Clicking on status checkbox requests and renders patches for that status", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(MY_PATCHES_ROUTE);
      await expect(page.getByTestId("patch-card")).toHaveCount(10);
      await page.getByTestId("my-patch-status-select").click();
    });

    const statuses = [
      { display: "Created/Unconfigured", key: "created" },
      { display: "Running", key: "started" },
      { display: "Succeeded", key: "success" },
      { display: "Failed", key: "failed" },
    ];

    test("Clicking on a status checkbox applies the status and clicking again removes it", async ({
      authenticatedPage: page,
    }) => {
      for (const { display, key } of statuses) {
        await clickCheckboxByLabel(page, display); // Click to check
        expect(page.url()).toContain(`statuses=${key}`);

        await clickCheckboxByLabel(page, display); // Click to uncheck
        expect(page.url()).not.toContain(`statuses`);
      }
    });

    test("Clicking on All status checkbox applies all of the statuses and clicking again removes them", async ({
      authenticatedPage: page,
    }) => {
      await clickCheckboxByLabel(page, "All"); // Click to check
      expect(page.url()).toContain(
        "statuses=all,success,created,started,failed",
      );

      await clickCheckboxByLabel(page, "All"); // Click to uncheck
      expect(page.url()).not.toContain("statuses");
    });
  });
});

const firstPageDisplayNames = [
  "main: EVG-7823 add a commit queue message (#4048)",
  "dist",
  "test meee",
  "Patch with display tasks",
  "'evergreen-ci/evergreen' pull request #3186 by bsamek: EVG-7425 Don't send ShouldExit to unprovisioned hosts (https://github.com/evergreen-ci/evergreen/pull/3186)",
  "SERVER-12189 test",
  "testtest",
  "Empty patch to run a lot of osx tasks",
  "the right version of ssl_fips",
  "no description",
];

const secondPageDisplayNames = [
  "SERVER-11333 test run 4",
  "linux-64",
  "linux-64",
  "all",
  "no description",
  "work from code freeze",
  "MCI-832 test run",
  "SERVER-11183 test run 2",
  "SERVER-11183 test run",
  "SERVER-10992 SERVER-11130 test run",
];
