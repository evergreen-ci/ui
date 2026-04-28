import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("web", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("save-settings-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    // API section.
    const apiSection = page.getByTestId("api-settings");
    await apiSection.getByLabel("HTTP Listen Address").clear();
    await apiSection
      .getByLabel("HTTP Listen Address")
      .fill("http://example.com/api");

    // UI section.
    const uiSection = page.getByTestId("ui-settings");
    await uiSection.getByLabel("UIv2 URL").clear();
    await uiSection.getByLabel("UIv2 URL").fill("http://example.com/ui");

    // Disabled GraphQL Queries section.
    const disabledGQLQueriesSection = page.getByTestId("disabled-gql-queries");
    await disabledGQLQueriesSection
      .getByLabel("Disabled GraphQL Queries")
      .scrollIntoViewIfNeeded();
    await disabledGQLQueriesSection
      .getByLabel("Disabled GraphQL Queries")
      .clear();
    await disabledGQLQueriesSection
      .getByLabel("Disabled GraphQL Queries")
      .fill("query1");
    await disabledGQLQueriesSection
      .getByLabel("Disabled GraphQL Queries")
      .press("Enter");

    await save(page);
    await validateToast(page, "success", "Settings saved successfully");
    await page.reload();

    await expect(apiSection.getByLabel("HTTP Listen Address")).toHaveValue(
      "http://example.com/api",
    );
    await expect(uiSection.getByLabel("UIv2 URL")).toHaveValue(
      "http://example.com/ui",
    );
    await expect(
      disabledGQLQueriesSection
        .getByTestId("filter-chip")
        .filter({ hasText: "query1" }),
    ).toBeVisible();
  });
});
