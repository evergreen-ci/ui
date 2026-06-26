import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { save } from "./utils";

test.describe("web", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin-settings");
  });

  test("can save after making changes", async ({ page }) => {
    await expect(page.getByTestId("save-settings-button")).toBeDisabled();

    // API section.
    const apiSection = page.getByTestId("api-settings");
    await apiSection.getByLabel("HTTP Listen Address").clear();
    await apiSection
      .getByLabel("HTTP Listen Address")
      .fill("http://example.com/api");

    // Rate Limiting section.
    await page.getByLabel("REST User Per Hour").clear();
    await page.getByLabel("REST User Per Hour").fill("1000");
    await page.getByLabel("REST User Burst").clear();
    await page.getByLabel("REST User Burst").fill("200");
    await page.getByLabel("GraphQL User Per Hour").clear();
    await page.getByLabel("GraphQL User Per Hour").fill("1000");
    await page.getByLabel("GraphQL User Burst").clear();
    await page.getByLabel("GraphQL User Burst").fill("200");
    await page.getByLabel("Complexity Limit").clear();
    await page.getByLabel("Complexity Limit").fill("500");
    await page.getByTestId("elevated-user-ids").fill("user1");
    await page.getByTestId("elevated-user-ids").press("Enter");
    await page.getByTestId("elevated-user-ids").fill("user2");
    await page.getByTestId("elevated-user-ids").press("Enter");

    // UI section.
    const uiSection = page.getByTestId("ui-settings");
    await uiSection.getByLabel("UIv2 URL").clear();
    await uiSection.getByLabel("UIv2 URL").fill("http://example.com/ui");

    // Disabled GraphQL Queries section.
    const disabledGQLQueriesSection = page.getByTestId("disabled-gql-queries");
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
