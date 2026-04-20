import { expect, Page } from "@playwright/test";
import { evergreenUrl, toastDataCy, users } from "./constants";

/**
 * Logs in a user via API request
 * @param page - The Playwright page object
 * @param user - The user credentials to log in with
 */
export async function login(page: Page, user = users.admin): Promise<void> {
  await page.request.post(`${evergreenUrl}/login`, {
    data: user,
  });
}

/**
 * Logs out the current user
 * @param page - The Playwright page object
 */
export async function logout(page: Page): Promise<void> {
  await page.request.get(`${evergreenUrl}/logout`, {
    maxRedirects: 0,
  });
}

/**
 * Validates a toast message with the specified status and message
 * Optionally closes the toast after validation
 * @param page - The Playwright page object
 * @param status - The expected toast status/variant
 * @param message - The expected toast message
 * @param shouldClose - Whether to close the toast after validation
 */
export const validateToast = async (
  page: Page,
  status: string,
  message: string,
  shouldClose?: boolean,
) => {
  await expect(page.getByTestId(toastDataCy)).toBeVisible();
  await expect(page.getByTestId(toastDataCy)).toHaveAttribute(
    "data-variant",
    status,
  );

  if (message) {
    await expect(page.getByTestId(toastDataCy)).toContainText(message);
  }

  if (shouldClose) {
    await page
      .getByTestId(toastDataCy)
      .locator("button[aria-label='Close Message']")
      .click();
    await expect(page.getByTestId(toastDataCy)).toBeHidden();
  }
};

/**
 * Checkboxes are not visible in LG so they cannot be clicked.
 * We need to click the associated label instead.
 * @param page - The Playwright page object
 * @param name - The name of the checkbox
 */
export const clickCheckboxByLabel = async (page: Page, name: string) => {
  const checkbox = page.getByRole("checkbox", { name });
  const checkboxId = await checkbox.getAttribute("id");
  if (checkboxId) {
    await page.locator(`label[for="${checkboxId}"]`).click();
  } else {
    // Fallback: click the checkbox's parent label if it exists.
    await checkbox.locator("..").locator("label").click();
  }
};
