import {
  firstVersion,
  makeCommitHistoryData,
  secondVersion,
} from "../../../src/pages/projectCommits/testData";
import { expect, test } from "../../fixtures";

test.describe("project commit history", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/graphql/query", async (route) => {
      const { operationName, variables } = route.request().postDataJSON();
      if (operationName !== "ProjectCommitHistory") {
        await route.fallback();
        return;
      }

      const isFirstPage = variables.options.maxOrder == null;
      const isEvergreen = variables.projectIdentifier === "evergreen";
      await route.fulfill({
        json: {
          data: makeCommitHistoryData(
            [isFirstPage && isEvergreen ? firstVersion : secondVersion],
            isFirstPage && isEvergreen,
            variables.projectIdentifier,
          ),
        },
      });
    });
    await page.goto("/project/evergreen/commits");
  });

  test("renders commit details and navigates to the version when the hash is clicked", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Project Commits" }),
    ).toBeVisible();
    const row = page.getByTestId("leafygreen-table-row").first();
    await expect(row).toContainText("Add project commit history");
    await expect(row).toContainText("Sophie");
    await expect(row).toContainText("80%");
    await expect(row).toContainText("75%");
    await expect(page.getByRole("columnheader")).toHaveText([
      "Commit",
      "Created",
      "Author",
      "Message",
      "Tasks Finished",
      "Tasks Succeeded",
    ]);

    await row.getByRole("link", { name: "abcdef1" }).click();
    await expect(page).toHaveURL(`/version/${firstVersion.id}/tasks`);
  });

  test("loads the next page and hides the load-more button when there are no more commits", async ({
    page,
  }) => {
    await expect(page.getByTestId("leafygreen-table-row")).toHaveCount(1);
    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().endsWith("/graphql/query") &&
        request.method() === "POST" &&
        request.postDataJSON()?.operationName === "ProjectCommitHistory" &&
        request.postDataJSON()?.variables?.options?.maxOrder === 1,
    );
    await page.getByRole("button", { name: "Show more commits" }).click();
    const request = await requestPromise;
    expect(request.postDataJSON().variables).toEqual({
      projectIdentifier: "evergreen",
      options: { limit: 50, maxOrder: 1 },
    });
    const rows = page.getByTestId("leafygreen-table-row");
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toContainText(firstVersion.message);
    await expect(rows.nth(1)).toContainText(secondVersion.message);
    await expect(
      page.getByRole("button", { name: "Show more commits" }),
    ).toHaveCount(0);
  });

  test("switches projects without keeping the previous project's commits", async ({
    page,
  }) => {
    await expect(page.getByRole("link", { name: "abcdef1" })).toBeVisible();
    await page.getByTestId("project-select").click();
    await page
      .getByTestId("project-display-name")
      .getByText("Spruce", { exact: true })
      .click();

    await expect(page).toHaveURL("/project/spruce/commits");
    await expect(page.getByRole("link", { name: "123456a" })).toBeVisible();
    await expect(page.getByRole("link", { name: "abcdef1" })).toHaveCount(0);
    await expect(page.getByTestId("leafygreen-table-row")).toHaveCount(1);
  });
});
