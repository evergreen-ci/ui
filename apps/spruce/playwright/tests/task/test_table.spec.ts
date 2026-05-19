import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import { clickCheckbox } from "../../helpers";

const TESTS_ROUTE =
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/tests";
const longTestName =
  "suuuuuupppppaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnnnnnnnnnnnnnnnnggggggggggggggggggggggggg name";

const firstPageDisplayNames = [
  "TestFinalizePatch",
  "TestCreateIntermediateProjectRequirements",
  "TestMergeAxisValue",
  "TestStuckHostAuditing",
  "TestHostTaskAuditing",
  "TestProjectEventSuite/TestModifyProjectNonEvent",
  "TestGenerateSuite",
  "TestGenerateSuite/TestSaveNewTasksWithDependencies",
  "TestGenerateSuite/TestValidateNoRedefine",
  "TestSortTasks",
];
const secondPageDisplayNames = [
  "TestDepsMatrixIntegration",
  "TestTaskGroupWithDisplayTask",
  "TestTryUpsert/configNumberMatches",
  "TestGetActivationTimeWithCron/Interval",
  longTestName,
  "TestUpdateVersionAndParserProject",
  "TestSetVersionActivation",
  "TestCreateTaskGroup",
  "TestRetryCommitQueueItems",
  "TestProjectAliasSuite/TestInsertTagsAndNoVariant",
];

test.describe("Tests Table", () => {
  const visitAndWait = async (page: Page, url: string) => {
    await page.goto(url);
    const table = page.getByTestId("tests-table");
    await expect(table).toBeVisible();
    await expect(table).not.toHaveAttribute("data-loading", "true");
  };

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await visitAndWait(page, TESTS_ROUTE);
  });

  test("count should update to reflect filtered values", async ({
    authenticatedPage: page,
  }) => {
    const nameSortControl = page.getByRole("button", { name: "Sort by Name" });
    await nameSortControl.click();

    const filteredCount = page.getByTestId("filtered-count").first();
    const totalCount = page.getByTestId("total-count").first();

    await expect(filteredCount.getByText("20")).toBeVisible();
    await expect(totalCount.getByText("20")).toBeVisible();

    await page.getByTestId("status-treeselect").click();
    const silentFailCheckbox = page.getByRole("checkbox", {
      name: "Silent Fail",
    });
    await clickCheckbox(silentFailCheckbox);
    await expect(filteredCount.getByText("1")).toBeVisible();
    await expect(totalCount.getByText("20")).toBeVisible();

    await page.getByTestId("test-name-filter").click();
    const testNameInput = page.getByPlaceholder("Test name regex");
    await testNameInput.fill("hello");
    await testNameInput.press("Enter");

    await expect(filteredCount.getByText("0")).toBeVisible();
    await expect(totalCount.getByText("20")).toBeVisible();
  });

  test("Automatically sorts by status in ascending order on page load", async ({
    authenticatedPage: page,
  }) => {
    await expect(page).toHaveURL(/sorts=STATUS%3AASC/);
  });

  test("Adjusts query params when table headers are clicked", async ({
    authenticatedPage: page,
  }) => {
    const nameSortControl = page.getByRole("button", { name: "Sort by Name" });
    const statusSortControl = page.getByRole("button", {
      name: "Sort by Status",
    });
    const durationSortControl = page.getByRole("button", {
      name: "Sort by Time",
    });

    // Clear default status sort
    await statusSortControl.click();
    await statusSortControl.click();
    await expect(page).not.toHaveURL(/sorts/);

    await nameSortControl.click();
    await expect(page).toHaveURL(/sorts=TEST_NAME%3AASC/);

    // Clear name sort
    await nameSortControl.click();
    await nameSortControl.click();
    await expect(page).not.toHaveURL(/sorts/);

    await statusSortControl.click();
    await expect(page).toHaveURL(new RegExp(TESTS_ROUTE));
    await expect(page).toHaveURL(/sorts=STATUS%3AASC/);
    await statusSortControl.click();
    await expect(page).toHaveURL(new RegExp(TESTS_ROUTE));
    await expect(page).toHaveURL(/sorts=STATUS%3ADESC/);

    // Clear status sort
    await statusSortControl.click();
    await expect(page).not.toHaveURL(/sorts/);

    await durationSortControl.click();
    await expect(page).toHaveURL(new RegExp(TESTS_ROUTE));
    await expect(page).toHaveURL(/sorts=DURATION%3AASC/);

    await durationSortControl.click();
    await expect(page).toHaveURL(new RegExp(TESTS_ROUTE));
    await expect(page).toHaveURL(/sorts=DURATION%3ADESC/);
  });

  test("Supports multiple sorts", async ({ authenticatedPage: page }) => {
    const statusSortControl = page.getByRole("button", {
      name: "Sort by Status",
    });
    const durationSortControl = page.getByRole("button", {
      name: "Sort by Time",
    });
    await statusSortControl.click();
    await durationSortControl.click();
    await expect(page).toHaveURL(/sorts=STATUS%3ADESC%3BDURATION%3AASC/);
  });

  test.describe("Test Status Selector", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await visitAndWait(page, TESTS_ROUTE);
    });

    test("Clicking on 'All' checkbox adds all statuses to URL", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("status-treeselect").click();
      const allCheckbox = page.getByRole("checkbox", { name: "All" });
      await clickCheckbox(allCheckbox);
      await expect(page).toHaveURL(/statuses=all,pass,fail,skip,silentfail/);
    });

    const statuses = [
      { label: "Pass", key: "pass" },
      {
        label: "Silent Fail",
        key: "silentfail",
      },
      { label: "Skip", key: "skip" },
    ];

    test("Checking multiple statuses adds them all to the URL", async ({
      authenticatedPage: page,
    }) => {
      await page.getByTestId("status-treeselect").click();
      for (const { label } of statuses) {
        const checkbox = page.getByRole("checkbox", { name: label });
        await clickCheckbox(checkbox);
      }
      await expect(page).toHaveURL(
        new RegExp(`statuses=${statuses.map(({ key }) => key).join(",")}`),
      );
    });
  });

  test.describe("Test Name Filter", () => {
    const testNameInputValue = "group";

    test("Typing in test name filter updates testname query param", async ({
      authenticatedPage: page,
    }) => {
      await visitAndWait(page, TESTS_ROUTE);
      await page.getByTestId("test-name-filter").click();
      const testnameInput = page
        .getByTestId("test-name-filter-wrapper")
        .locator("input");
      await testnameInput.focus();
      await testnameInput.fill(testNameInputValue);
      await testnameInput.press("Enter");
      await expect(page).toHaveURL(
        new RegExp(`testname=${testNameInputValue}`),
      );
    });
  });

  test.describe("Changing page number", () => {
    test("Displays the next page of results and updates URL when right arrow is clicked and next page exists", async ({
      authenticatedPage: page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10`);
      await expect(
        page.getByTestId("pagination").first().getByText("1 / 2"),
      ).toBeVisible();
      const nextPageButton = page.getByTestId("next-page-button").first();
      await nextPageButton.click();
      for (const displayName of secondPageDisplayNames) {
        await expect(page.getByText(displayName).first()).toBeVisible();
      }
      await expect(page).toHaveURL(/page=1/);
    });

    test("Does not update results or URL when right arrow is clicked and next page does not exist", async ({
      authenticatedPage: page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10&page=1`);
      await expect(
        page.getByTestId("pagination").first().getByText("2 / 2"),
      ).toBeVisible();
      await expect(page.getByTestId("next-page-button").first()).toBeDisabled();
      for (const displayName of secondPageDisplayNames) {
        const exactMatchRegex = new RegExp(`^${displayName}$`);
        await expect(page.getByText(exactMatchRegex)).toBeVisible();
      }
      await expect(page).toHaveURL(/page=1/);
    });

    test("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", async ({
      authenticatedPage: page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10&page=1`);
      await expect(
        page.getByTestId("pagination").first().getByText("2 / 2"),
      ).toBeVisible();
      const prevPageButton = page.getByTestId("prev-page-button").first();
      await prevPageButton.click();
      for (const displayName of firstPageDisplayNames) {
        const exactMatchRegex = new RegExp(`^${displayName}$`);
        await expect(page.getByText(exactMatchRegex)).toBeVisible();
      }
      await expect(page).toHaveURL(/page=0/);
    });

    test("Does not update results or URL when left arrow is clicked and previous page does not exist", async ({
      authenticatedPage: page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10&page=0`);
      await expect(
        page.getByTestId("pagination").first().getByText("1 / 2"),
      ).toBeVisible();
      await expect(page.getByTestId("prev-page-button").first()).toBeDisabled();
      for (const displayName of firstPageDisplayNames) {
        const exactMatchRegex = new RegExp(`^${displayName}$`);
        await expect(page.getByText(exactMatchRegex)).toBeVisible();
      }
      await expect(page).toHaveURL(/page=0/);
    });
  });

  test.describe("Changing page limit", () => {
    test("Changing page size updates URL and renders less than or equal to that many rows", async ({
      authenticatedPage: page,
    }) => {
      for (const pageSize of [20, 50, 100]) {
        await visitAndWait(page, TESTS_ROUTE);
        await page
          .locator("button[aria-labelledby='page-size-select']")
          .first()
          .click();
        await page.getByText(`${pageSize} / page`).first().click();
        const rowCount = await page
          .locator("[data-cy=tests-table] tr td:first-child")
          .count();
        expect(rowCount).toBeLessThanOrEqual(pageSize);
        await expect(page).toHaveURL(new RegExp(`limit=${pageSize}`));
      }
    });
  });

  test.describe("Test log links", () => {
    test("Links to Spruce's HTML viewer", async ({
      authenticatedPage: page,
    }) => {
      const htmlLink = page.getByRole("link", { name: "HTML" }).nth(0);
      await expect(htmlLink).toHaveAttribute("href");
      const href = await htmlLink.getAttribute("href");
      expect(href).toContain(
        "/test-html-log?execution=0&testName=TestFinalizePatch#L152",
      );
    });
  });
});
