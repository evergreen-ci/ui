import { Page } from "@playwright/test";
import { test, expect } from "../../fixtures";
import { clickCheckbox, validateToast } from "../../helpers";

const hostsRoute = "/hosts";

const selectAllHosts = async (page: Page) => {
  const headerCheckbox = page.locator("thead").locator("input[type=checkbox]");
  await clickCheckbox(headerCheckbox);
  const bodyCheckboxes = page.locator("tbody").locator("input[type=checkbox]");
  await expect(bodyCheckboxes).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    await expect(bodyCheckboxes.nth(i)).toBeChecked();
  }
};

test.describe("Select hosts in hosts page table", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(
      `${hostsRoute}?distroId=ubuntu1604-large&page=0&statuses=running`,
    );
    const table = page.getByTestId("hosts-table");
    await expect(table).toBeVisible();
    await expect(table).toHaveAttribute("data-loading", "false");
    await expect(page.getByTestId("update-status-button")).toBeDisabled();
    await expect(page.getByTestId("restart-jasper-button")).toBeDisabled();
    await expect(page.getByTestId("reprovision-button")).toBeDisabled();
  });

  test("Selecting hosts enables action buttons", async ({
    authenticatedPage: page,
  }) => {
    await selectAllHosts(page);
    await expect(page.getByTestId("update-status-button")).toBeEnabled();
    await expect(page.getByTestId("restart-jasper-button")).toBeEnabled();
    await expect(page.getByTestId("reprovision-button")).toBeEnabled();
  });

  test("Can restart jasper for selected hosts", async ({
    authenticatedPage: page,
  }) => {
    await selectAllHosts(page);
    const restartJasperButton = page.getByTestId("restart-jasper-button");
    await expect(restartJasperButton).toBeEnabled();
    await restartJasperButton.click();
    await expect(
      page.getByTestId("restart-jasper-button-popover"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();
    await validateToast(page, "success", "Marked Jasper as restarting");
  });

  test("Can reprovision selected hosts", async ({
    authenticatedPage: page,
  }) => {
    await selectAllHosts(page);
    const reprovisionButton = page.getByTestId("reprovision-button");
    await expect(reprovisionButton).toBeEnabled();
    await reprovisionButton.click();
    await expect(page.getByTestId("reprovision-button-popover")).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();
    await validateToast(page, "success", "Marked hosts to reprovision");
  });

  test("Can update status for selected hosts", async ({
    authenticatedPage: page,
  }) => {
    await selectAllHosts(page);
    const updateStatusButton = page.getByTestId("update-status-button");
    await expect(updateStatusButton).toBeEnabled();
    await updateStatusButton.click();

    await page.getByTestId("host-status-select").click();
    await page.getByTestId("terminated-option").click();
    await page.getByTestId("host-status-notes").fill("notes");

    const modal = page.getByTestId("update-host-status-modal");
    await expect(modal).toBeVisible();
    await modal.getByRole("button", { name: "Update" }).click();
    await expect(modal).toBeHidden();
    await validateToast(page, "success", "Status was changed to terminated");
  });
});
