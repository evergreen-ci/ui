import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { test, expect } from "../../fixtures";
import { validateToast, clickCheckboxByLabel } from "../../helpers";

const patchWithoutVersion = "test meee";
const patchWithVersion = "main: EVG-7823 add a commit queue message (#4048)";

test.describe("Dropdown Menu of Patch Actions", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/");
  });

  test("'Reconfigure' link takes user to patch configure page", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithoutVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await expect(page.getByTestId("card-dropdown")).toBeVisible();
    await expect(page.getByTestId("reconfigure-link")).toBeVisible();
    await page.getByTestId("reconfigure-link").click();
    expect(page.url()).toContain("/configure");
  });

  test("'Schedule' link opens modal and clicking on 'Cancel' closes it.", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await page.getByTestId("schedule-patch").click();
    await expect(page.getByTestId("schedule-tasks-modal")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByTestId("schedule-tasks-modal")).toBeHidden();
  });

  test("'Schedule' link is disabled for unfinalized patch", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithoutVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await expect(page.getByTestId("schedule-patch")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("'Unschedule' link opens popconfirm and unschedules patch", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await page.getByTestId("unschedule-patch").click();
    await expect(page.getByTestId("unschedule-patch-popconfirm")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByTestId("unschedule-patch-popconfirm")).toBeHidden();
  });

  test("'Unschedule' link is disabled for unfinalized patch", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithoutVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await expect(page.getByTestId("unschedule-patch")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("'Restart' link shows restart patch modal", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await page.getByTestId("restart-version").click();

    await page.getByTestId("variant-accordion").nth(0).click();
    await page.getByText("asdf").click();

    const restartButton = page
      .getByTestId("version-restart-modal")
      .getByRole("button", { name: "Restart" });
    await expect(restartButton).toHaveAttribute("aria-disabled", "false");
    await restartButton.click();
    await validateToast(page, "success", "Successfully restarted tasks!");
  });

  test("'Restart' link is disabled for unfinalized patch", async ({
    authenticatedPage: page,
  }) => {
    const patchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: patchWithoutVersion });
    await patchCard.getByTestId("patch-card-dropdown").click();
    await expect(page.getByTestId("restart-version")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  test("Toggle patch visibility", async ({ authenticatedPage: page }) => {
    // "Include hidden" checkbox is not checked and patch is visible
    const includeHiddenCheckbox = page.getByRole("checkbox", {
      name: "Include hidden",
    });
    await expect(includeHiddenCheckbox).not.toBeChecked();
    expect(page.url()).not.toContain("hidden=true");
    const targetPatchCard = page
      .getByTestId("patch-card")
      .filter({ hasText: "testtest" });
    await expect(targetPatchCard).toBeVisible();

    // Hide patch card.
    await expect(targetPatchCard.getByTestId("hidden-badge")).toBeHidden();
    await targetPatchCard.getByTestId("patch-card-dropdown").click();
    await page.getByText("Hide patch").click();
    await validateToast(page, "success", "This patch was successfully hidden.");
    await expect(targetPatchCard).toBeHidden();

    // Check "Include hidden" checkbox and unhide patch card.
    await clickCheckboxByLabel(page, "Include hidden");
    const cookies = await page.context().cookies();
    const hiddenCookie = cookies.find((c) => c.name === INCLUDE_HIDDEN_PATCHES);
    expect(hiddenCookie?.value).toBe("true");
    expect(page.url()).toContain("hidden=true");
    await expect(targetPatchCard).toBeVisible();
    await expect(targetPatchCard.getByTestId("hidden-badge")).toBeVisible();
    await targetPatchCard.getByTestId("patch-card-dropdown").click();

    // Test initial state derived from cookie.
    await page.goto("/");
    const cookiesAfterReload = await page.context().cookies();
    const hiddenCookieAfterReload = cookiesAfterReload.find(
      (c) => c.name === INCLUDE_HIDDEN_PATCHES,
    );
    expect(hiddenCookieAfterReload?.value).toBe("true");
    expect(page.url()).not.toContain("hidden=true");
    await expect(targetPatchCard).toBeVisible();
    await expect(targetPatchCard.getByTestId("hidden-badge")).toBeVisible();
    await targetPatchCard.getByTestId("patch-card-dropdown").click();

    // Test unhide button.
    await page.getByText("Unhide patch").click();
    await validateToast(
      page,
      "success",
      "This patch was successfully unhidden.",
    );
    await expect(targetPatchCard).toBeVisible();
    await expect(targetPatchCard.getByTestId("hidden-badge")).toBeHidden();

    // Uncheck "Include hidden" and verify patch card is visible.
    await clickCheckboxByLabel(page, "Include hidden");
    const cookiesAfterUncheck = await page.context().cookies();
    const hiddenCookieAfterUncheck = cookiesAfterUncheck.find(
      (c) => c.name === INCLUDE_HIDDEN_PATCHES,
    );
    expect(hiddenCookieAfterUncheck?.value).toBe("false");
    expect(page.url()).toContain("hidden=false");
    await expect(targetPatchCard).toBeVisible();
  });
});
