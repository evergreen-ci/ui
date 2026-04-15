import { SEEN_WATERFALL_ONBOARDING_TUTORIAL } from "constants/cookies";
import { test, expect } from "../../fixtures";

test.describe("onboarding", () => {
  test("can go through all steps of the walkthrough", async ({
    authenticatedPage: page,
    context,
  }) => {
    await context.clearCookies({
      name: SEEN_WATERFALL_ONBOARDING_TUTORIAL,
    });
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);

    await expect(page.getByTestId("walkthrough-backdrop")).toBeVisible();
    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("New Layout", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("Reimagined Task Statuses")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("Pin Build Variants")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("Jump to Date")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("Search by Git Hash")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("Summary View")).toBeVisible();
    await page.getByRole("button", { name: "Get started" }).click();

    await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();
    await expect(page.getByTestId("walkthrough-backdrop")).toBeHidden();

    await page.close();
  });

  test("can restart the walkthrough", async ({ authenticatedPage: page }) => {
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);
    await expect(page.getByTestId("walkthrough-backdrop")).toBeHidden();
    await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();

    await page.getByTestId("waterfall-menu").click();
    await page.getByTestId("restart-walkthrough").click();
    await expect(page.getByTestId("walkthrough-backdrop")).toBeVisible();
    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("New Layout", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
  });

  test("can end walkthrough early using the dismiss button", async ({
    authenticatedPage: page,
    context,
  }) => {
    await context.clearCookies({
      name: SEEN_WATERFALL_ONBOARDING_TUTORIAL,
    });
    await page.goto("/project/evergreen/waterfall");
    await expect(page.getByTestId("waterfall-skeleton")).toBeHidden();
    await expect(page.getByTestId("build-variant-label")).toHaveCount(2);

    await expect(page.getByTestId("walkthrough-backdrop")).toBeVisible();
    await expect(page.getByTestId("walkthrough-guide-cue")).toBeVisible();
    await expect(page.getByText("New Layout", { exact: true })).toBeVisible();

    await page.locator('[aria-label="Close Tooltip"]').click();
    await expect(page.getByTestId("walkthrough-guide-cue")).toBeHidden();
    await expect(page.getByTestId("walkthrough-backdrop")).toBeHidden();

    await page.close();
  });
});
