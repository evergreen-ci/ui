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
    const restLimits = page.getByTestId("rest-limits");
    await restLimits.getByLabel("User Per Hour", { exact: true }).clear();
    await restLimits.getByLabel("User Per Hour", { exact: true }).fill("1000");
    await restLimits.getByLabel("User Burst", { exact: true }).clear();
    await restLimits.getByLabel("User Burst", { exact: true }).fill("200");
    await restLimits.getByLabel("Service User Per Hour").clear();
    await restLimits.getByLabel("Service User Per Hour").fill("1000");
    await restLimits.getByLabel("Service User Burst").clear();
    await restLimits.getByLabel("Service User Burst").fill("200");
    const gqlLimits = page.getByTestId("graphql-limits");
    await gqlLimits.getByLabel("User Per Hour", { exact: true }).clear();
    await gqlLimits.getByLabel("User Per Hour", { exact: true }).fill("1000");
    await gqlLimits.getByLabel("User Burst", { exact: true }).clear();
    await gqlLimits.getByLabel("User Burst", { exact: true }).fill("200");
    await gqlLimits.getByLabel("Service User Per Hour").clear();
    await gqlLimits.getByLabel("Service User Per Hour").fill("1000");
    await gqlLimits.getByLabel("Service User Burst").clear();
    await gqlLimits.getByLabel("Service User Burst").fill("200");
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
