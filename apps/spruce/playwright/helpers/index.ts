import { Page, Locator, expect } from "@playwright/test";

/**
 * Selects an option from a LeafyGreen select component
 * @param page - The Playwright page object
 * @param label - The label of the select input
 * @param option - The option text or regex pattern to select
 * @param options - Additional options for selecting the option
 * @param options.exact - Whether to match the option text exactly (default: false)
 */
export const selectOption = async (
  page: Page | Locator,
  label: string,
  option: string | RegExp,
  options?: { exact: boolean },
): Promise<void> => {
  const button = page.getByRole("button", { name: label, exact: true });
  await expect(button).toBeEnabled();
  await button.click();
  const listbox = page.locator('[role="listbox"]');
  await expect(listbox).toHaveCount(1);
  await listbox.getByText(option, options).click();
};

/**
 * Clears a date picker input by pressing backspace multiple times
 * LG Date Picker does not respond well to .clear()
 * @param page - The Playwright page object
 */
export const clearDatePickerInput = async (
  page: Page | Locator,
): Promise<void> => {
  const dayInput = page.locator("input[id='day']");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
  await dayInput.press("Backspace");
};

/**
 * Validates the values in a date picker component
 * @param page - The Playwright page object
 * @param dataCy - The data-cy attribute value of the date picker
 * @param opts - The expected date values
 * @param opts.year - The expected year value
 * @param opts.month - The expected month value
 * @param opts.day - The expected day value
 */
export const validateDatePickerDate = async (
  page: Page | Locator,
  dataCy: string,
  { year = "", month = "", day = "" } = {},
): Promise<void> => {
  const datePicker = page.getByTestId(dataCy);

  await expect(datePicker.locator("input[id='year']")).toHaveValue(year);
  await expect(datePicker.locator("input[id='month']")).toHaveValue(month);
  await expect(datePicker.locator("input[id='day']")).toHaveValue(day);
};

/**
 * Selects a date in a LeafyGreen date picker by navigating the year/month dropdowns
 * and clicking the target day cell.
 * @param page - The Playwright page object
 * @param opts - Object describing the date to select
 * @param opts.year - The year to select (e.g., "2025")
 * @param opts.month - The abbreviated month name to select (e.g., "Feb")
 * @param opts.isoDate - The ISO date string of the day cell to click (e.g., "2025-02-28")
 * @param dataCy - The data-cy attribute value of the date picker (default: "date-picker")
 */
export const selectDatePickerDate = async (
  page: Page | Locator,
  { year = "", month = "", isoDate = "" } = {},
  dataCy = "date-picker",
): Promise<void> => {
  await page.getByTestId(dataCy).click();

  const options = page.getByRole("listbox").getByRole("option");

  const yearSelect = page.locator("[aria-label*='Select year' i]");
  await expect(yearSelect).toBeVisible();
  await yearSelect.click();
  await expect(options.getByText(year)).toBeVisible();
  await options.getByText(year).click();

  const monthSelect = page.locator("[aria-label*='Select month' i]");
  await expect(monthSelect).toBeVisible();
  await monthSelect.click();
  await expect(options.getByText(month)).toBeVisible();
  await options.getByText(month).click();

  await page.locator(`[data-iso='${isoDate}']`).click();
};

/**
 * Types a date into a LeafyGreen date picker by filling the year, month, and day inputs.
 * @param page - The Playwright page object
 * @param opts - The expected date values
 * @param opts.year - The year to select (e.g., "2025")
 * @param opts.month - The numerical month value to select (e.g., "02")
 * @param opts.day - The day to select (e.g., "28")
 * @param dataCy - The data-cy attribute value of the date picker (default: "date-picker")
 */
export const typeDatePickerDate = async (
  page: Page | Locator,
  { year = "", month = "", day = "" } = {},
  dataCy = "date-picker",
): Promise<void> => {
  const datePicker = page.getByTestId(dataCy);
  const yearInput = datePicker.locator("input[id='year']");
  const monthInput = datePicker.locator("input[id='month']");
  const dayInput = datePicker.locator("input[id='day']");

  await yearInput.fill(year);
  await monthInput.fill(month);
  await dayInput.fill(day);
};

// Re-export shared helpers from the playwright-config package.
export {
  validateToast,
  login,
  logout,
  clickCheckbox,
  mockGraphQLResponse,
  hasOperationName,
} from "@evg-ui/playwright-config/helpers";
