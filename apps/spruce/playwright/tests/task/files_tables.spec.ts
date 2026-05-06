import { test, expect } from "../../fixtures";

test.describe("files table", () => {
  const FILES_ROUTE = "/task/evergreen_ubuntu1604_89/files";
  const FILES_ROUTE_WITHOUT_FILES =
    "/task/evergreen_ubuntu1604_test_model_commitqueue_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/files";
  const FILES_ROUTE_WITH_ASSOCIATED_LINKS =
    "/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/files?execution=0";

  test("Searching for a non existent value yields 0 results, tables will not render and will display 'No files found'", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(FILES_ROUTE);
    await page.getByTestId("file-search-input").fill("Hello world");
    await expect(page.getByTestId("files-table")).toBeHidden();
    await expect(page.getByTestId("file-link")).toBeHidden();
    await expect(page.getByText("No files found")).toBeVisible();
  });

  test("Searching for a value yields results across multiple tables", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(FILES_ROUTE);
    await page.getByTestId("file-search-input").fill("458");
    await expect(page.getByTestId("file-link")).toHaveCount(4);
  });

  test("Should display 'No files found' after loading a task without files", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(FILES_ROUTE_WITHOUT_FILES);
    await expect(page.getByText("No files found")).toBeVisible();
  });

  test("Should display associated links when a file has them", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(FILES_ROUTE_WITH_ASSOCIATED_LINKS);
    await expect(
      page.getByTestId("file-link").getByText("sample file"),
    ).toBeVisible();

    await expect(page.getByTestId("associated-links-container")).toBeVisible();
    await expect(
      page
        .getByTestId("associated-links-container")
        .getByText("Associated Links"),
    ).toBeVisible();
    await expect(
      page.getByTestId("associated-link").getByText("Documentation"),
    ).toBeVisible();
    await expect(
      page.getByTestId("associated-link").getByText("Test Results"),
    ).toBeVisible();
  });
});
