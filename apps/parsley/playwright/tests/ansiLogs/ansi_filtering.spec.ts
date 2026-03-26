import { test, expect } from "../../fixtures";
import * as helpers from "../../helpers";

const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

test.describe("Filtering", () => {
  test.describe("Applying filters", () => {
    test.describe("Basic filtering", () => {
      test.beforeEach(async ({ authenticatedPage }) => {
        await helpers.resetDrawerState(authenticatedPage);
        await authenticatedPage.goto(logLink);
        await expect(
          helpers.getByDataCy(authenticatedPage, "paginated-virtual-list"),
        ).toBeVisible();
      });

      test("should not collapse bookmarks and share line", async ({
        authenticatedPage,
      }) => {
        await helpers.getByDataCy(authenticatedPage, "log-link-5").click();
        await helpers.getByDataCy(authenticatedPage, "log-row-6").dblclick();
        await expect(authenticatedPage).toHaveURL(
          /\?bookmarks=0,6,297&shareLine=5/,
        );
        await helpers.addFilter(authenticatedPage, "doesNotMatchAnything");

        const logRows = await authenticatedPage
          .locator("[data-cy^='log-row-']")
          .all();
        for (const row of logRows) {
          const dataCy = await row.getAttribute("data-cy");
          expect(dataCy).toMatch(/log-row-(0|5|6|297)/);
        }
      });

      test("does not corrupt filters that are large numbers", async ({
        authenticatedPage,
      }) => {
        await helpers.addFilter(authenticatedPage, "5553072873648668703");
        await expect(
          helpers.getByDataCy(authenticatedPage, "log-row-0"),
        ).toBeVisible();
        await helpers
          .getByDataCy(authenticatedPage, "log-row-0")
          .dblclick({ force: true });
        await expect(authenticatedPage).toHaveURL(/5553072873648668703/);
        await expect(
          helpers.getByDataCy(authenticatedPage, "filter-5553072873648668703"),
        ).toBeVisible();
      });
    });

    test.describe("Advanced filtering", () => {
      const filter1 = "Warning";
      const filter2 = "storybook";

      test.describe("filtering mode is AND", () => {
        test.beforeEach(async ({ authenticatedPage }) => {
          await helpers.resetDrawerState(authenticatedPage);
        });

        test("should be able to apply two default filters (case insensitive, exact match)", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(`${logLink}?filterLogic=and`);
          await helpers.addFilter(authenticatedPage, filter1);
          await helpers.addFilter(authenticatedPage, filter2);
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=100${filter1},100${filter2}`),
          );

          // Wait for filtered rows to load.
          await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .first()
            .waitFor();

          const logRows = await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .all();
          for (const row of logRows) {
            const text = await row.innerText();
            expect(text.toLowerCase()).toContain(filter1.toLowerCase());
            expect(text.toLowerCase()).toContain(filter2.toLowerCase());
          }
        });

        test("should be able to toggle case sensitivity", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(
            `${logLink}?filterLogic=and&filters=100${filter1},100${filter2}`,
          );
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter1}`)
            .getByText("Sensitive", { exact: true })
            .click();
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=110${filter1},100${filter2}`),
          );

          const logRows = await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .all();
          for (const row of logRows) {
            const text = await row.innerText();
            expect(text).toContain(filter1);
            expect(text.toLowerCase()).toContain(filter2.toLowerCase());
          }
        });

        test("should be able to toggle inverse matching", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(
            `${logLink}?filterLogic=and&filters=110${filter1},100${filter2}`,
          );
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter2}`)
            .getByText("Inverse", { exact: true })
            .click();
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=110${filter1},101${filter2}`),
          );

          const logRows = await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .all();
          for (const row of logRows) {
            const text = await row.innerText();
            expect(text).toContain(filter1);
            expect(text).not.toContain(filter2);
          }
        });

        test("should be able to toggle visibility", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(
            `${logLink}?filterLogic=and&filters=110${filter1},101${filter2}`,
          );
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter1}`)
            .locator('[aria-label="Hide filter"]')
            .click();
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter2}`)
            .locator('[aria-label="Hide filter"]')
            .click();
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=010${filter1},001${filter2}`),
          );
          await expect(
            authenticatedPage.locator("[data-cy^='skipped-lines-row-']"),
          ).toHaveCount(0);
        });
      });

      test.describe("filtering mode is OR", () => {
        test.beforeEach(async ({ authenticatedPage }) => {
          await helpers.resetDrawerState(authenticatedPage);
        });

        test("should be able to apply two default filters (case insensitive, exact match)", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(`${logLink}?filterLogic=or`);
          await helpers.addFilter(authenticatedPage, filter1);
          await helpers.addFilter(authenticatedPage, filter2);
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=100${filter1},100${filter2}`),
          );

          // Wait for filtered rows to load.
          await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .first()
            .waitFor();

          const logRows = await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .all();
          for (const row of logRows) {
            const text = await row.innerText();
            expect(text.toLowerCase()).toMatch(/warning|storybook/);
          }
        });

        test("should be able to toggle case sensitivity", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(
            `${logLink}?filterLogic=or&filters=100${filter1},100${filter2}`,
          );
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter1}`)
            .getByText("Sensitive", { exact: true })
            .click();
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=110${filter1},100${filter2}`),
          );

          const logRows = await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .all();
          for (const row of logRows) {
            const text = await row.innerText();
            const matchesFilter1 = text.includes("Warning");
            const matchesFilter2 = text.toLowerCase().includes("storybook");
            expect(matchesFilter1 || matchesFilter2).toBe(true);
          }
        });

        test("should be able to toggle inverse matching", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(
            `${logLink}?filterLogic=or&filters=110${filter1},100${filter2}`,
          );
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter2}`)
            .getByText("Inverse", { exact: true })
            .click();
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=110${filter1},101${filter2}`),
          );

          const logRows = await authenticatedPage
            .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
            .all();
          for (const row of logRows) {
            const text = await row.innerText();
            const matchesFilter1 = text.includes("Warning");
            const doesNotMatchFilter2 = !text
              .toLowerCase()
              .includes("storybook");
            expect(matchesFilter1 || doesNotMatchFilter2).toBe(true);
          }
        });

        test("should be able to toggle visibility", async ({
          authenticatedPage,
        }) => {
          await authenticatedPage.goto(
            `${logLink}?filterLogic=or&filters=110${filter1},101${filter2}`,
          );
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter1}`)
            .locator('[aria-label="Hide filter"]')
            .click();
          await helpers
            .getByDataCy(authenticatedPage, `filter-${filter2}`)
            .locator('[aria-label="Hide filter"]')
            .click();
          await expect(authenticatedPage).toHaveURL(
            new RegExp(`filters=010${filter1},001${filter2}`),
          );
          await expect(
            authenticatedPage.locator("[data-cy^='skipped-lines-row-']"),
          ).toHaveCount(0);
        });
      });
    });
  });

  test.describe("Deleting and editing filters", () => {
    const filter = "doesNotMatchAnything";

    test.beforeEach(async ({ authenticatedPage }) => {
      await helpers.resetDrawerState(authenticatedPage);
      await authenticatedPage.goto(`${logLink}?filters=100${filter}`);
      await authenticatedPage
        .locator("[data-cy^='skipped-lines-row-']")
        .first()
        .waitFor();
      expect(
        await authenticatedPage
          .locator("[data-cy^='skipped-lines-row-']")
          .count(),
      ).toBeGreaterThan(0);
    });

    test("should be able to edit a filter", async ({ authenticatedPage }) => {
      await helpers
        .getByDataCy(authenticatedPage, `filter-${filter}`)
        .locator('[aria-label="Edit filter"]')
        .click();
      await helpers.getByDataCy(authenticatedPage, "edit-filter-name").clear();
      await helpers
        .getByDataCy(authenticatedPage, "edit-filter-name")
        .fill("running");
      await authenticatedPage.getByRole("button", { name: "Apply" }).click();
      await expect(authenticatedPage).toHaveURL(/filters=100running/);

      const logRows = await authenticatedPage
        .locator("[data-cy^='log-row-']:not([data-bookmarked=true])")
        .all();
      for (const row of logRows) {
        const text = await row.innerText();
        expect(text.toLowerCase()).toContain("running");
      }
    });

    test("should be able to delete a filter", async ({ authenticatedPage }) => {
      await helpers
        .getByDataCy(authenticatedPage, `filter-${filter}`)
        .locator('[aria-label="Delete filter"]')
        .click();
      await expect(authenticatedPage).toHaveURL(/^(?!.*filters)/);
      await expect(
        authenticatedPage.locator("[data-cy^='skipped-lines-row-']"),
      ).toHaveCount(0);
    });
  });

  test.describe("hiding filters", () => {
    const filter1 = "doesNotMatchAnything";
    const filter2 = "doesNotMatchAnything2";

    test("should be able to hide and unhide filters", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.goto(
        `${logLink}?filters=110${filter1},100${filter2}`,
      );
      await authenticatedPage
        .locator("[data-cy^='skipped-lines-row-']")
        .first()
        .waitFor();
      expect(
        await authenticatedPage
          .locator("[data-cy^='skipped-lines-row-']")
          .count(),
      ).toBeGreaterThan(0);
      await helpers.toggleDrawer(authenticatedPage);

      await helpers
        .getByDataCy(authenticatedPage, "all-filters-toggle")
        .click();
      await expect(
        helpers.getByDataCy(authenticatedPage, "all-filters-toggle"),
      ).toHaveAttribute("aria-checked", "false");
      await expect(
        authenticatedPage.locator("[data-cy^='skipped-lines-row-']"),
      ).toHaveCount(0);
      await expect(authenticatedPage).toHaveURL(
        new RegExp(`filters=010${filter1},000${filter2}`),
      );

      await helpers
        .getByDataCy(authenticatedPage, "all-filters-toggle")
        .click();
      await expect(
        helpers.getByDataCy(authenticatedPage, "all-filters-toggle"),
      ).toHaveAttribute("aria-checked", "true");
      expect(
        await authenticatedPage
          .locator("[data-cy^='skipped-lines-row-']")
          .count(),
      ).toBeGreaterThan(0);
      await expect(authenticatedPage).toHaveURL(
        new RegExp(`filters=110${filter1},100${filter2}`),
      );
    });
  });
});
