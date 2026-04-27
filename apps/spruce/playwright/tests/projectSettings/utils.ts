import { Page } from "@playwright/test";
import { expect } from "../../fixtures";

export const save = async (page: Page) => {
  const saveButton = page.getByTestId("save-settings-button");
  await saveButton.scrollIntoViewIfNeeded();
  await saveButton.click();
};

export const expectSaveButtonEnabled = async (
  page: Page,
  isEnabled: boolean = true,
) => {
  const saveButton = page.getByTestId("save-settings-button");
  if (isEnabled) {
    await expect(saveButton).not.toHaveAttribute("aria-disabled", "true");
  } else {
    await expect(saveButton).toHaveAttribute("aria-disabled", "true");
  }
};
