import { test, expect } from "@playwright/test";
import * as helpers from "../../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Filtering", () => {
  test.describe("Applying filters", () => {
    test.describe("Basic filtering", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(logLink);
        await expect(page.getByTestId("paginated-virtual-list")).toBeVisible();
        await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
      });

      test("should not collapse bookmarks and share line", async ({ page }) => {
        await page.getByTestId("log-link-5").click();
        await page.getByTestId("log-row-6").dblclick();
        await expect(page).toHaveURL(/\?bookmarks=0,6,297&shareLine=5/);
        await helpers.addFilter(page, "doesNotMatchAnything");

        const filteredRows = page.locator("[data-cy^='log-row-']");
        await expect(filteredRows).toHaveCount(4);
        const logRows = await filteredRows.all();
        for (const row of logRows) {
          const dataCy = await row.getAttribute("data-cy");
          expect(dataCy).toMatch(/log-row-(0|5|6|297)/);
        }
      });

      test("does not corrupt filters that are large numbers", async ({
        page,
      }) => {
        await helpers.addFilter(page, "5553072873648668703");
        await expect(page.getByTestId("log-row-0")).toBeVisible();
        await page.getByTestId("log-row-0").dblclick();
        await expect(page).toHaveURL(/5553072873648668703/);
        await expect(
          page.getByTestId("filter-5553072873648668703"),
        ).toBeVisible();
      });
    });

    test.describe("Advanced filtering", () => {
      const filter1 = "Warning";
      const filter2 = "storybook";

      test.describe("filtering mode is AND", () => {
        test("should be able to apply two default filters (case insensitive, exact match)", async ({
          page,
        }) => {
          await page.goto(`${logLink}?filterLogic=and`);
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await helpers.addFilter(page, filter1);
          await helpers.addFilter(page, filter2);
          await expect(page).toHaveURL(
            new RegExp(`filters=100${filter1},100${filter2}`),
          );

          const filteredRows = page.locator(
            "[data-cy^='log-row-']:not([data-bookmarked=true])",
          );
          await expect(filteredRows).not.toHaveCount(0);
          const logRows = await filteredRows.all();
          for (const row of logRows) {
            await expect(row).toContainText(filter1, { ignoreCase: true });
            await expect(row).toContainText(filter2, { ignoreCase: true });
          }
        });

        test("should be able to toggle case sensitivity", async ({ page }) => {
          await page.goto(
            `${logLink}?filterLogic=and&filters=100${filter1},100${filter2}`,
          );
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await page
            .getByTestId(`filter-${filter1}`)
            .getByText("Sensitive", { exact: true })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`filters=110${filter1},100${filter2}`),
          );

          const filteredRows = page.locator(
            "[data-cy^='log-row-']:not([data-bookmarked=true])",
          );
          await expect(filteredRows).not.toHaveCount(0);
          const logRows = await filteredRows.all();
          for (const row of logRows) {
            await expect(row).toContainText(filter1, { ignoreCase: false });
            await expect(row).toContainText(filter2, { ignoreCase: true });
          }
        });

        test("should be able to toggle inverse matching", async ({ page }) => {
          await page.goto(
            `${logLink}?filterLogic=and&filters=110${filter1},100${filter2}`,
          );
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await page
            .getByTestId(`filter-${filter2}`)
            .getByText("Inverse", { exact: true })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`filters=110${filter1},101${filter2}`),
          );

          const filteredRows = page.locator(
            "[data-cy^='log-row-']:not([data-bookmarked=true])",
          );
          await expect(filteredRows).not.toHaveCount(0);
          const logRows = await filteredRows.all();
          for (const row of logRows) {
            await expect(row).toContainText(filter1, { ignoreCase: false });
            await expect(row).not.toContainText(filter2, { ignoreCase: true });
          }
        });

        test("should be able to toggle visibility", async ({ page }) => {
          await page.goto(
            `${logLink}?filterLogic=and&filters=110${filter1},101${filter2}`,
          );
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await page
            .getByTestId(`filter-${filter1}`)
            .getByRole("button", { name: "Hide filter" })
            .click();
          await page
            .getByTestId(`filter-${filter2}`)
            .getByRole("button", { name: "Hide filter" })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`filters=010${filter1},001${filter2}`),
          );
          const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
          await expect(skippedLines).toHaveCount(0);
        });
      });

      test.describe("filtering mode is OR", () => {
        test("should be able to apply two default filters (case insensitive, exact match)", async ({
          page,
        }) => {
          await page.goto(`${logLink}?filterLogic=or`);
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await helpers.addFilter(page, filter1);
          await helpers.addFilter(page, filter2);
          await expect(page).toHaveURL(
            new RegExp(`filters=100${filter1},100${filter2}`),
          );

          const filteredRows = page.locator(
            "[data-cy^='log-row-']:not([data-bookmarked=true])",
          );
          await expect(filteredRows).not.toHaveCount(0);
          const logRows = await filteredRows.all();
          for (const row of logRows) {
            await expect(row).toContainText(/warning|storybook/i);
          }
        });

        test("should be able to toggle case sensitivity", async ({ page }) => {
          await page.goto(
            `${logLink}?filterLogic=or&filters=100${filter1},100${filter2}`,
          );
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await page
            .getByTestId(`filter-${filter1}`)
            .getByText("Sensitive", { exact: true })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`filters=110${filter1},100${filter2}`),
          );

          const filteredRows = page.locator(
            "[data-cy^='log-row-']:not([data-bookmarked=true])",
          );
          await expect(filteredRows).not.toHaveCount(0);
          await expect(
            filteredRows
              .filter({ hasNotText: /Warning/ })
              .filter({ hasNotText: /storybook/i }),
          ).toHaveCount(0);
        });

        test("should be able to toggle inverse matching", async ({ page }) => {
          await page.goto(
            `${logLink}?filterLogic=or&filters=110${filter1},100${filter2}`,
          );
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await page
            .getByTestId(`filter-${filter2}`)
            .getByText("Inverse", { exact: true })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`filters=110${filter1},101${filter2}`),
          );

          const filteredRows = page.locator(
            "[data-cy^='log-row-']:not([data-bookmarked=true])",
          );
          await expect(filteredRows).not.toHaveCount(0);
          await expect(
            filteredRows
              .filter({ hasNotText: /Warning/ })
              .filter({ hasText: /storybook/i }),
          ).toHaveCount(0);
        });

        test("should be able to toggle visibility", async ({ page }) => {
          await page.goto(
            `${logLink}?filterLogic=or&filters=110${filter1},101${filter2}`,
          );
          await expect(page.getByTestId("ansi-row")).not.toHaveCount(0);
          await page
            .getByTestId(`filter-${filter1}`)
            .getByRole("button", { name: "Hide filter" })
            .click();
          await page
            .getByTestId(`filter-${filter2}`)
            .getByRole("button", { name: "Hide filter" })
            .click();
          await expect(page).toHaveURL(
            new RegExp(`filters=010${filter1},001${filter2}`),
          );
          const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
          await expect(skippedLines).toHaveCount(0);
        });
      });
    });
  });

  test.describe("Deleting and editing filters", () => {
    const filter = "doesNotMatchAnything";

    test.beforeEach(async ({ page }) => {
      await page.goto(`${logLink}?filters=100${filter}`);
      await expect(page.getByTestId("ansi-row")).toHaveCount(0);
      const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
      await expect(skippedLines).not.toHaveCount(0);
    });

    test("should be able to edit a filter", async ({ page }) => {
      await page
        .getByTestId(`filter-${filter}`)
        .getByRole("button", { name: "Edit filter" })
        .click();
      await page.getByTestId("edit-filter-name").clear();
      await page.getByTestId("edit-filter-name").fill("running");
      await page.getByRole("button", { name: "Apply" }).click();
      await expect(page).toHaveURL(/filters=100running/);

      const filteredRows = page.locator(
        "[data-cy^='log-row-']:not([data-bookmarked=true])",
      );
      await expect(filteredRows).not.toHaveCount(0);
      const logRows = await filteredRows.all();
      for (const row of logRows) {
        await expect(row).toContainText("running", { ignoreCase: true });
      }
    });

    test("should be able to delete a filter", async ({ page }) => {
      await page
        .getByTestId(`filter-${filter}`)
        .getByRole("button", { name: "Delete filter" })
        .click();
      await expect(page).toHaveURL(/^(?!.*filters)/);
      const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
      await expect(skippedLines).toHaveCount(0);
    });
  });

  test.describe("hiding filters", () => {
    const filter1 = "doesNotMatchAnything";
    const filter2 = "doesNotMatchAnything2";

    test("should be able to hide and unhide filters", async ({ page }) => {
      await page.goto(`${logLink}?filters=110${filter1},100${filter2}`);
      await expect(page.getByTestId("ansi-row")).toHaveCount(0);
      const skippedLines = page.locator("[data-cy^='skipped-lines-row-']");
      await expect(skippedLines).not.toHaveCount(0);

      await page.getByTestId("all-filters-toggle").click();
      await expect(page.getByTestId("all-filters-toggle")).not.toBeChecked();
      await expect(skippedLines).toHaveCount(0);
      await expect(page).toHaveURL(
        new RegExp(`filters=010${filter1},000${filter2}`),
      );

      await page.getByTestId("all-filters-toggle").click();
      await expect(page.getByTestId("all-filters-toggle")).toBeChecked();
      await expect(skippedLines).not.toHaveCount(0);
      await expect(page).toHaveURL(
        new RegExp(`filters=110${filter1},100${filter2}`),
      );
    });
  });
});
