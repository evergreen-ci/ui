import { Page } from "@playwright/test";
import { expect } from "../../fixtures";

export const save = async (page: Page) => {
  const saveButton = page.getByTestId("save-settings-button");
  await saveButton.scrollIntoViewIfNeeded();
  await expect(saveButton).toHaveAttribute("aria-disabled", "false");
  await saveButton.click();

  const saveChangesModal = page.getByTestId("save-changes-modal");
  await expect(saveChangesModal).toBeVisible();
  await saveChangesModal.getByRole("button", { name: "Save changes" }).click();
  await expect(saveChangesModal).toBeHidden();
};

export const expectSaveButtonEnabled = async (
  page: Page,
  isEnabled: boolean = true,
) => {
  const saveButton = page.getByTestId("save-settings-button");
  if (isEnabled) {
    await expect(saveButton).toHaveAttribute("aria-disabled", "false");
  } else {
    await expect(saveButton).toHaveAttribute("aria-disabled", "true");
  }
};
