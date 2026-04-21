import { Page, Locator, expect } from "@playwright/test";

type LocatorOptions = Parameters<Page["locator"]>[1];

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
 * Selects an option from a LeafyGreen select component
 * @param page - The Playwright page object
 * @param label - The label of the select input
 * @param option - The option text or regex pattern to select
 * @param options - Additional options for selecting the option
 * @param options.exact - Whether to match the option text exactly (default: false)
 */
export async function selectOption(
  page: Page,
  label: string,
  option: string | RegExp,
  options?: { exact: boolean },
): Promise<void> {
  const input = page.getByLabel(label);
  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeEnabled();
  await input.click();

  const listbox = page.locator('[role="listbox"]');
  await expect(listbox).toHaveCount(1);
  await listbox.getByText(option, options).click();
}

/**
 * Opens an expandable card if it's not already open
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
} from "@evg-ui/playwright-config/helpers";
