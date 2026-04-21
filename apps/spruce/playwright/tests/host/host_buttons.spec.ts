import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";

test.describe("Host page restart jasper, reprovision, and update host status buttons", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto("/host/i-0d0ae8b83366d22be");
  });

  test("Should show a toast when jasper restarted", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("restart-jasper-button").click();
    const confirmButton = page.getByRole("button", { name: "Yes" });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await validateToast(page, "success", "Marked Jasper as restarting");
  });

  test("Should show a toast when host is reprovisioned", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("reprovision-button").click();
    const confirmButton = page.getByRole("button", { name: "Yes" });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    await validateToast(page, "success", "Marked host to reprovision");
  });

  test("Should show and hide the modal for update status", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("update-status-button").click();
    await expect(page.getByTestId("update-host-status-modal")).toBeVisible();

    await page.getByTestId("host-status-select").click();
    await page.getByTestId("decommissioned-option").click();
    const modal = page.getByTestId("update-host-status-modal");
    const updateButton = modal.getByRole("button", { name: "Update" });
    await expect(updateButton).toBeEnabled();
    await updateButton.click();

    await validateToast(
      page,
      "success",
      "Status was changed to decommissioned",
    );
    await expect(page.getByTestId("update-host-status-modal")).toBeHidden();
  });
});
