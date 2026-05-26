import { Page, expect } from "../../fixtures";

export const save = async (page: Page) => {
  const saveButton = page.getByTestId("save-settings-button");
  await expect(saveButton).toBeEnabled();
  await saveButton.click();
};
