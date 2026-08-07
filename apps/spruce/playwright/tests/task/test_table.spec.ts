import { Page, expect, test } from "../../fixtures";
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

  test.beforeEach(async ({ page }) => {
    await visitAndWait(page, TESTS_ROUTE);
  });

  test("count should update to reflect filtered values", async ({ page }) => {
    const nameSortControl = page.getByRole("button", { name: "Sort by Name" });
    await nameSortControl.click();

    const topPagination = page.getByTestId("pagination").first();
    await expect(topPagination.getByText(/20 items/)).toBeVisible();

    const totalCount = page.getByTestId("total-count").first();
    await expect(totalCount).toContainText("20");

    await page.getByTestId("status-treeselect").click();
    const silentFailCheckbox = page.getByRole("checkbox", {
      name: "Silent Fail",
    });
    await clickCheckbox(silentFailCheckbox);
    await expect(topPagination.getByText(/1 item/)).toBeVisible();
    await expect(totalCount).toContainText("20");

    await page.getByTestId("test-name-filter").click();
    const testNameInput = page.getByPlaceholder("Test name regex");
    await testNameInput.fill("hello");
    await testNameInput.press("Enter");

    await expect(topPagination.getByText(/0 items/)).toBeVisible();
    await expect(totalCount).toContainText("20");
  });

  test("Automatically sorts by status in ascending order on page load", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/sorts=STATUS%3AASC/);
  });

  test("Adjusts query params when table headers are clicked", async ({
    page,
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

  test("Supports multiple sorts", async ({ page }) => {
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
    test.beforeEach(async ({ page }) => {
      await visitAndWait(page, TESTS_ROUTE);
    });

    test("Clicking on 'All' checkbox adds all statuses to URL", async ({
      page,
    }) => {
      await page.getByTestId("status-treeselect").click();
      const allCheckbox = page.getByRole("checkbox", { name: "All" });
      await clickCheckbox(allCheckbox);
      await expect(page).toHaveURL(/statuses=all,pass,fail,skip,silentfail/);
    });

    const statuses = [
      { key: "pass", label: "Pass" },
      {
        key: "silentfail",
        label: "Silent Fail",
      },
      { key: "skip", label: "Skip" },
    ];

    test("Checking multiple statuses adds them all to the URL", async ({
      page,
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
      page,
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
      page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10`);
      const topPagination = page.getByTestId("pagination").first();
      const pageSelect = topPagination.getByRole("button", {
        name: /current page/,
      });
      await expect(pageSelect).toHaveText("1");

      const nextPageButton = topPagination.getByRole("button", {
        name: "Next page",
      });
      await nextPageButton.click();
      for (const displayName of secondPageDisplayNames) {
        await expect(page.getByText(displayName).first()).toBeVisible();
      }
      await expect(page).toHaveURL(/page=1/);
    });

    test("Does not update results or URL when right arrow is clicked and next page does not exist", async ({
      page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10&page=1`);
      const topPagination = page.getByTestId("pagination").first();
      const pageSelect = topPagination.getByRole("button", {
        name: /current page/,
      });
      await expect(pageSelect).toHaveText("2");

      const nextPageButton = topPagination.getByRole("button", {
        name: "Next page",
      });
      await expect(nextPageButton).toBeDisabled();
      for (const displayName of secondPageDisplayNames) {
        const exactMatchRegex = new RegExp(`^${displayName}$`);
        await expect(page.getByText(exactMatchRegex)).toBeVisible();
      }
      await expect(page).toHaveURL(/page=1/);
    });

    test("Displays the previous page of results and updates URL when the left arrow is clicked and previous page exists", async ({
      page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10&page=1`);
      const topPagination = page.getByTestId("pagination").first();
      const pageSelect = topPagination.getByRole("button", {
        name: /current page/,
      });
      await expect(pageSelect).toHaveText("2");

      const prevPageButton = topPagination.getByRole("button", {
        name: "Previous page",
      });
      await prevPageButton.click();
      for (const displayName of firstPageDisplayNames) {
        const exactMatchRegex = new RegExp(`^${displayName}$`);
        await expect(page.getByText(exactMatchRegex)).toBeVisible();
      }
      await expect(page).toHaveURL(/page=0/);
    });

    test("Does not update results or URL when left arrow is clicked and previous page does not exist", async ({
      page,
    }) => {
      await visitAndWait(page, `${TESTS_ROUTE}?limit=10&page=0`);
      const topPagination = page.getByTestId("pagination").first();
      const pageSelect = topPagination.getByRole("button", {
        name: /current page/,
      });
      await expect(pageSelect).toHaveText("1");

      const prevPageButton = topPagination.getByRole("button", {
        name: "Previous page",
      });
      await expect(prevPageButton).toBeDisabled();
      for (const displayName of firstPageDisplayNames) {
        const exactMatchRegex = new RegExp(`^${displayName}$`);
        await expect(page.getByText(exactMatchRegex)).toBeVisible();
      }
      await expect(page).toHaveURL(/page=0/);
    });
  });

  test.describe("Changing page limit", () => {
    test("Changing page size updates URL and renders less than or equal to that many rows", async ({
      page,
    }) => {
      for (const pageSize of [20, 50, 100]) {
        await visitAndWait(page, TESTS_ROUTE);
        const topPagination = page.getByTestId("pagination").first();
        const itemsPerPageSelect = topPagination.getByRole("button", {
          name: /Items per page/,
        });
        await itemsPerPageSelect.click();

        const listbox = page.getByRole("listbox");
        await expect(listbox).toBeVisible();
        const option = listbox
          .getByRole("option")
          .filter({ hasText: `${pageSize}` });
        await option.click();

        const rowCount = await page
          .locator("[data-cy=tests-table] tr td:first-child")
          .count();
        expect(rowCount).toBeLessThanOrEqual(pageSize);
        await expect(page).toHaveURL(new RegExp(`limit=${pageSize}`));
      }
    });
  });

  test.describe("Test log links", () => {
    test("Links to Spruce's HTML viewer", async ({ page }) => {
      const htmlLink = page.getByRole("link", { name: "HTML" }).nth(0);
      await expect(htmlLink).toHaveAttribute("href");
      const href = await htmlLink.getAttribute("href");
      expect(href).toContain(
        "/test-html-log?execution=0&testName=TestFinalizePatch#L152",
      );
    });
  });
});
