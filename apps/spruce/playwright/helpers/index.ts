import { Page, Locator, expect } from "@playwright/test";
import { evergreenUrl, users } from "../constants";

type LocatorOptions = Parameters<Page["locator"]>[1];

/**
 * Clears a date picker input by pressing backspace multiple times
 * LG Date Picker does not respond well to .clear()
 * @param page - The Playwright page object
 */
export async function clearDatePickerInput(page: Page): Promise<void> {
  const dayInput = page.locator("input[id='day']");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
}

/**
 * Closes a banner by clicking the X icon
 * @param page - The Playwright page object
 * @param dataCy - The data-cy attribute value of the banner
 */
export async function closeBanner(page: Page, dataCy: string): Promise<void> {
  const banner = page.getByTestId(dataCy);
  await banner.locator("[aria-label='X Icon']").click();
}

/**
 * Gets a locator for an element with the specified data-row-key attribute
 * @param page - The Playwright page object
 * @param value - The data-row-key attribute value
 * @param options - Optional locator options
 * @returns A Playwright locator
 */
export function dataRowKeyLocator(
  page: Page,
  value: string,
  options?: LocatorOptions,
): Locator {
  return page.locator(`[data-row-key=${value}]`, options);
}

/**
 * Gets a locator for an element with the specified data-testid attribute
 * @param page - The Playwright page object
 * @param value - The data-testid attribute value
 * @param options - Optional locator options
 * @returns A Playwright locator
 */
export function dataTestIdLocator(
  page: Page,
  value: string,
  options?: LocatorOptions,
): Locator {
  return page.locator(`[data-testid=${value}]`, options);
}

/**
 * Enters login credentials for the admin user
 * @param page - The Playwright page object
 */
export async function enterLoginCredentials(page: Page): Promise<void> {
  await page.getByTestId("login-username").fill(users.admin.username);
  await page.getByTestId("login-password").fill(users.admin.password);
  await page.getByTestId("login-submit").click();
}

/**
 * Gets an input element by its associated label text
 * Waits for LeafyGreen components to have proper ids (not "undefined")
 * @param page - The Playwright page object
 * @param label - The label text or regex pattern
 * @returns A Playwright locator for the input element
 */
export async function getInputByLabel(
  page: Page,
  label: string | RegExp,
): Promise<Locator> {
  const labelElement = page.getByText(label, { exact: false }).locator("label");

  // Wait until LeafyGreen components have proper IDs.
  await expect(labelElement).toHaveAttribute("for");
  const forAttr = await labelElement.getAttribute("for");
  expect(forAttr).not.toContain("undefined");

  const id = await labelElement.getAttribute("for");
  return page.locator(`#${id}`);
}

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
 * Validates table sort direction by checking for the appropriate sort icon
 * @param page - The Playwright page object
 * @param direction - The expected sort direction (asc, desc, or none)
 */
export async function validateTableSort(
  page: Page,
  direction?: "asc" | "desc" | "none",
): Promise<void> {
  switch (direction) {
    case "asc":
      await expect(
        page.locator("svg[aria-label='Sort Ascending Icon']"),
      ).toBeVisible();
      return;
    case "desc":
      await expect(
        page.locator("svg[aria-label='Sort Descending Icon']"),
      ).toBeVisible();
      return;
    case "none":
    default:
      await expect(
        page.locator("svg[aria-label='Unsorted Icon']"),
      ).toBeVisible();
  }
}

/**
 * Validates a toast message with the specified status and message
 * Optionally closes the toast after validation
 * @param page - The Playwright page object
 * @param status - The expected toast status/variant
 * @param message - The expected toast message
 * @param shouldClose - Whether to close the toast after validation
 */
export async function validateToast(
  page: Page,
  status: string,
  message: string,
  shouldClose: boolean = true,
): Promise<void> {
  const toast = page.getByTestId("toast");
  await expect(toast).toBeVisible();
  await expect(toast).toHaveAttribute("data-variant", status);

  if (message) {
    await expect(toast).toContainText(message);
  }

  if (shouldClose) {
    await toast.locator("button[aria-label='Close Message']").click();
    await expect(toast).toBeHidden();
  }
}

/**
 * Selects an option from a LeafyGreen select component
 * @param page - The Playwright page object
 * @param label - The label of the select input
 * @param option - The option text or regex pattern to select
 */
export async function selectLGOption(
  page: Page,
  label: string,
  option: string | RegExp,
): Promise<void> {
  const input = await getInputByLabel(page, label);
  await input.scrollIntoViewIfNeeded();
  await expect(input).not.toHaveAttribute("aria-disabled", "true");
  await input.click();

  const listbox = page.locator('[role="listbox"]');
  await expect(listbox).toHaveCount(1);
  await listbox.getByText(option).click();
}

/**
 * Opens an expandable card if it's not already open
 * TODO: Usage introduced in DEVPROD-2415 can be deleted after DEVPROD-2608
 * @param page - The Playwright page object
 * @param cardTitle - The title of the expandable card
 */
export async function openExpandableCard(
  page: Page,
  cardTitle: string,
): Promise<void> {
  const cardButton = page
    .getByTestId("expandable-card-title")
    .filter({ hasText: cardTitle })
    .locator('[role="button"]')
    .first();

  const isExpanded = await cardButton.getAttribute("aria-expanded");
  if (isExpanded !== "true") {
    await cardButton.click();
  }
}

/**
 * Validates the values in a date picker component
 * @param page - The Playwright page object
 * @param dataCy - The data-cy attribute value of the date picker
 * @param opts - The expected date values
 * @param opts.year - The expected year value
 * @param opts.month - The expected month value
 * @param opts.day - The expected day value
 */
export async function validateDatePickerDate(
  page: Page,
  dataCy: string,
  { year = "", month = "", day = "" } = {},
): Promise<void> {
  const datePicker = page.getByTestId(dataCy);

  await expect(datePicker.locator("input[id='year']")).toHaveValue(year);
  await expect(datePicker.locator("input[id='month']")).toHaveValue(month);
  await expect(datePicker.locator("input[id='day']")).toHaveValue(day);
}
