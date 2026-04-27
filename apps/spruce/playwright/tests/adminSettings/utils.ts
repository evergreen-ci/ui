import { Page } from "@playwright/test";
import { expect } from "../../fixtures";

export const save = async (page: Page) => {
  const saveButton = page.getByTestId("save-settings-button");
  await expect(saveButton).toHaveAttribute("aria-disabled", "false");
  await saveButton.click();
};
