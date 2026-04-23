import { Page } from "@playwright/test";
import { expect } from "../../fixtures";

type onSaveOptions = "NONE" | "DECOMMISSION" | "RESTART_JASPER" | "REPROVISION";

export const save = async (page: Page, onSaveValue?: onSaveOptions) => {
  const saveButton = page.getByTestId("save-settings-button");
  await expect(saveButton).not.toHaveAttribute("aria-disabled", "true");
  await saveButton.click();

  if (onSaveValue) {
    const radio = page.locator(`input[value="${onSaveValue}"]`);
    const radioId = await radio.getAttribute("id");
    await page.locator(`label[for="${radioId}"]`).click();
  }

  const modal = page.getByTestId("save-modal");
  const confirmButton = modal.getByRole("button", { name: "Save" });
  await expect(confirmButton).toHaveAttribute("aria-disabled", "false");
  await confirmButton.click();
};
