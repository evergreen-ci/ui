import { Page } from "@playwright/test";
import { clickLabelForLocator } from "@evg-ui/playwright-config/helpers";
import { expect } from "../../fixtures";

type onSaveOptions = "NONE" | "DECOMMISSION" | "RESTART_JASPER" | "REPROVISION";

export const save = async (page: Page, onSaveValue?: onSaveOptions) => {
  const saveButton = page.getByTestId("save-settings-button");
  await expect(saveButton).not.toHaveAttribute("aria-disabled", "true");
  await saveButton.click();

  if (onSaveValue) {
    const radio = page.locator(`input[value="${onSaveValue}"]`);
    await clickLabelForLocator(radio);
  }

  const modal = page.getByTestId("save-modal");
  const confirmButton = modal.getByRole("button", { name: "Save" });
  await expect(confirmButton).toHaveAttribute("aria-disabled", "false");
  await confirmButton.click();
};
