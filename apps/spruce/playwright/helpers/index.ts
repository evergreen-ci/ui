import { Page, Locator, expect } from "@playwright/test";

/**
 * Selects an option from a LeafyGreen select component
 * @param page - The Playwright page object
 * @param label - The label text of the select input, or `{ testId: string }` to target by data-cy
 * @param option - The option text or regex pattern to select
 * @param options - Additional options for selecting the option
 * @param options.exact - Whether to match the option text exactly (default: false)
 */
export async function selectOption(
  page: Page | Locator,
  label: string | { testId: string },
  option: string | RegExp,
  options?: { exact: boolean },
): Promise<void> {
  const input =
    typeof label === "string"
      ? page.getByLabel(label)
      : page.getByTestId(label.testId);
  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeEnabled();
  await input.click();

  const listbox = page.locator('[role="listbox"]');
  await expect(listbox).toHaveCount(1);
  await listbox.getByText(option, options).click();
}

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

/**
 * Selects a date in a LeafyGreen date picker by navigating the year/month dropdowns
 * and clicking the target day cell.
 * @param page - The Playwright page object
 * @param year - The year to select (e.g., "2025")
 * @param month - The abbreviated month name to select (e.g., "Feb")
 * @param isoDate - The ISO date string of the day cell to click (e.g., "2025-02-28")
 */
export async function selectDatePickerDate(
  page: Page,
  year: string,
  month: string,
  isoDate: string,
): Promise<void> {
  await page.getByTestId("date-picker").click();

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
}

// Re-export shared helpers from the playwright-config package.
export {
  validateToast,
  login,
  logout,
  clickCheckboxByLabel,
  mockGraphQLResponse,
  hasOperationName,
} from "@evg-ui/playwright-config/helpers";
