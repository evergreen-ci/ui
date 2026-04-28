import { test, expect } from "../../fixtures";

const versions = {
  0: "5ecedafb562343215a7ff297",
  2: "52a630633ff1227909000021",
  4: "evergreen_33016573166a36bd5f46b4111151899d5c4e95b1",
  5: "5e4ff3abe3c3317e352062e4",
};

const versionRoute = (id: string) => `/version/${id}`;

test.describe("Version route", () => {
  test.describe("Metadata", () => {
    test("Shows patch parameters if they exist", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(versionRoute(versions[0]));
      await expect(page.getByTestId("parameters-modal")).toHaveCount(0);
      await page.getByTestId("parameters-link").click();
      await expect(page.getByTestId("parameters-modal")).toBeVisible();
      await page.getByRole("button", { name: "Close modal" }).click();
      await expect(page.getByTestId("parameters-modal")).toBeHidden();
    });

    test("'Base commit' link in metadata links to version page", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(versionRoute(versions[0]));
      await expect(page.getByTestId("patch-base-commit")).toHaveAttribute(
        "href",
        new RegExp(`/version/${versions[4]}`),
      );
    });

    test("Doesn't show patch parameters if they don't exist", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(versionRoute(versions[2]));
      await expect(page.getByTestId("parameters-link")).toHaveCount(0);
      await expect(page.getByTestId("parameters-modal")).toHaveCount(0);
    });
  });

  test.describe("Build Variants", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(versionRoute(versions[0]));
      const table = page.getByTestId("tasks-table");
      await expect(table).toBeVisible();
      await expect(table).not.toHaveAttribute("data-loading", "true");
    });

    test("Lists the patch's build variants", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page
          .getByTestId("build-variants")
          .getByTestId("patch-build-variant")
          .first(),
      ).toBeVisible();
    });

    test.describe("Grouped Task Status Badge", () => {
      test("Shows tooltip with task's name on hover", async ({
        authenticatedPage: page,
      }) => {
        const statusBadge = page
          .getByTestId("build-variants")
          .getByTestId("grouped-task-status-badge")
          .first();
        await statusBadge.hover();
        await expect(statusBadge).toContainText("1Succeeded");
      });

      test("Navigates to task tab and applies filters when clicking on grouped task status badge", async ({
        authenticatedPage: page,
      }) => {
        await page.getByTestId("changes-tab").first().click();
        await expect(page.getByTestId("task-tab")).toHaveAttribute(
          "aria-selected",
          "false",
        );

        await page
          .getByTestId("build-variants")
          .getByTestId("grouped-task-status-badge")
          .first()
          .click();
        await expect(page.getByTestId("task-tab")).toHaveAttribute(
          "aria-selected",
          "true",
        );
        await expect(page).toHaveURL(
          /sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=success&variant=%5Eubuntu1604%24/,
        );

        await page.getByTestId("status-filter").click();
        await expect(page.getByTestId("status-filter-wrapper")).toBeVisible();
        await expect(page.getByLabel("Succeeded")).toHaveAttribute(
          "aria-checked",
          "true",
        );

        await page.getByTestId("variant-filter").click();
        await expect(
          page.getByTestId("variant-filter-wrapper").locator("input"),
        ).toHaveValue("^ubuntu1604$");
      });

      test("Keeps sorts but not other filters when clicking on grouped task status badge", async ({
        authenticatedPage: page,
      }) => {
        await page.getByTestId("clear-all-filters").click();

        await page.getByTestId("task-name-filter").click();
        const taskNameInput = page
          .getByTestId("task-name-filter-wrapper")
          .locator("input");
        await taskNameInput.focus();
        await taskNameInput.fill("a-task-name");
        await taskNameInput.press("Enter");

        await page
          .getByTestId("build-variants")
          .getByTestId("grouped-task-status-badge")
          .first()
          .click();
        await expect(page).toHaveURL(
          /sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&statuses=success&variant=%5Eubuntu1604%24/,
        );
      });
    });

    test.describe("Build Variant Name", () => {
      test("Navigates to task tab and applies filters when clicking on build variant name", async ({
        authenticatedPage: page,
      }) => {
        await page.getByTestId("clear-all-filters").click();

        await page.getByTestId("changes-tab").first().click();
        await expect(page.getByTestId("task-tab")).toHaveAttribute(
          "aria-selected",
          "false",
        );

        await page.getByTestId("build-variant-display-name").first().click();
        await expect(page.getByTestId("task-tab")).toHaveAttribute(
          "aria-selected",
          "true",
        );
        await expect(page).toHaveURL(
          /sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&variant=%5Eubuntu1604%24/,
        );

        await page.getByTestId("variant-filter").click();
        await expect(
          page.getByTestId("variant-filter-wrapper").locator("input"),
        ).toHaveValue("^ubuntu1604$");
      });

      test("Keeps sorts but not other filters when clicking on build variant name", async ({
        authenticatedPage: page,
      }) => {
        await page.getByTestId("clear-all-filters").click();

        await page.getByTestId("task-name-filter").click();
        const taskNameInput = page
          .getByTestId("task-name-filter-wrapper")
          .locator("input");
        await taskNameInput.focus();
        await taskNameInput.fill("a-task-name");
        await taskNameInput.press("Enter");

        await page.getByTestId("build-variant-display-name").first().click();
        await expect(page).toHaveURL(
          /sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC&variant=%5Eubuntu1604%24/,
        );
      });
    });
  });

  test.describe("Page title", () => {
    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(versionRoute(versions[5]));
    });

    test("Should include a link to Jira", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("page-title").getByRole("link", { name: "EVG-7425" }),
      ).toHaveAttribute("href", "https://jira.example.com/browse/EVG-7425");
    });

    test("Should include a link to GitHub", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("page-title").getByRole("link", {
          name: "https://github.com/evergreen-ci/evergreen/pull/3186",
        }),
      ).toHaveAttribute(
        "href",
        "https://github.com/evergreen-ci/evergreen/pull/3186",
      );
    });
  });
});
