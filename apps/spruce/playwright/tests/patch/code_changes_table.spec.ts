import { test, expect } from "../../fixtures";

test.describe("Code Changes Table", () => {
  const patchId = "5ecedafb562343215a7ff297";

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(`/version/${patchId}/changes`);
  });

  test("Should display at least one table when there are code changes", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("code-changes-table")).toBeVisible();
  });

  test("Should link to code changes when they exist", async ({
    authenticatedPage: page,
  }) => {
    const fileLinks = page.getByTestId("file-link");

    for (const link of await fileLinks.all()) {
      await expect(link).toHaveAttribute(
        "href",
        `/version/${patchId}/file-diff`,
      );
      await expect(link).toHaveAttribute("href", /file_name=/);
      await expect(link).toHaveAttribute("href", /patch_number=/);
    }

    const htmlDiffBtn = page.getByTestId("html-diff-btn");
    await expect(htmlDiffBtn).toHaveAttribute(
      "href",
      `/version/${patchId}/diff?patch_number=0`,
    );
    await expect(htmlDiffBtn).toHaveAttribute("href", /patch_number=/);

    const rawDiffBtn = page.getByTestId("raw-diff-btn");
    await expect(rawDiffBtn).toHaveAttribute(
      "href",
      `http://localhost:9090/rawdiff/${patchId}?patch_number=0`,
    );
  });
});
