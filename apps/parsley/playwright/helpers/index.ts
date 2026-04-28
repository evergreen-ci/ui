import { expect, Page } from "@playwright/test";

export const addFilter = async (page: Page, filter: string) => {
  await expect(page.getByTestId("searchbar-select")).toBeEnabled();
  await page.getByTestId("searchbar-select").click();
  await page.getByTestId("filter-option").click();
  const searchbarInput = page.getByTestId("searchbar-input");
  await expect(searchbarInput).toBeEnabled();
  await searchbarInput.focus();
  await page.keyboard.type(filter);
  await searchbarInput.press("Control+Enter");
};

export const addHighlight = async (page: Page, highlight: string) => {
  await expect(page.getByTestId("searchbar-select")).toBeEnabled();
  await page.getByTestId("searchbar-select").click();
  await page.getByTestId("highlight-option").click();
  const searchbarInput = page.getByTestId("searchbar-input");
  await expect(searchbarInput).toBeEnabled();
  await searchbarInput.focus();
  await page.keyboard.type(highlight);
  await searchbarInput.press("Control+Enter");
};

export const addSearch = async (page: Page, search: string) => {
  const searchbarInput = page.getByTestId("searchbar-input");
  await expect(searchbarInput).toBeEnabled();
  await searchbarInput.focus();
  await page.keyboard.type(search);
};

export const assertValueCopiedToClipboard = async (
  page: Page,
  value: string,
) => {
  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );
  expect(clipboardText).toBe(value);
};

export const clearBounds = async (page: Page) => {
  await toggleDetailsPanel(page, true);
  await page.getByTestId("range-lower-bound").clear();
  await page.getByTestId("range-upper-bound").clear();
  await toggleDetailsPanel(page, false);
};

export const clickToggle = async (
  page: Page,
  toggleDataCy: string,
  enabled: boolean,
  tab: "search-and-filter" | "log-viewing" = "search-and-filter",
) => {
  await toggleDetailsPanel(page, true);
  if (tab === "log-viewing") {
    await page.locator("button[data-cy='log-viewing-tab']").click();
  }
  await page.getByTestId(toggleDataCy).click();
  await expect(page.getByTestId(toggleDataCy)).toHaveAttribute(
    "aria-checked",
    `${enabled}`,
  );
  await toggleDetailsPanel(page, false);
};

export const editBounds = async (
  page: Page,
  bounds: { upper?: string; lower?: string },
) => {
  await toggleDetailsPanel(page, true);

  if (bounds.upper !== undefined) {
    const upperBound = page.getByTestId("range-upper-bound");
    await expect(upperBound).toBeVisible();
    await upperBound.focus();
    await page.keyboard.type(bounds.upper);
  }

  if (bounds.lower !== undefined) {
    const lowerBound = page.getByTestId("range-lower-bound");
    await expect(lowerBound).toBeVisible();
    await lowerBound.focus();
    await page.keyboard.type(bounds.lower);
  }

  await toggleDetailsPanel(page, false);
};

export const isContainedInViewport = async (page: Page, selector: string) => {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  const viewport = page.viewportSize();

  if (!box || !viewport) {
    throw new Error("Unable to get element or viewport dimensions");
  }

  // All corners of the element must be in the viewport.
  expect(box.y).not.toBeGreaterThan(viewport.height);
  expect(box.y + box.height).not.toBeGreaterThan(viewport.height);
  expect(box.x).not.toBeGreaterThan(viewport.width);
  expect(box.x + box.width).not.toBeGreaterThan(viewport.width);
};

export const isNotContainedInViewport = async (
  page: Page,
  selector: string,
) => {
  const element = page.locator(selector);
  const box = await element.boundingBox();
  const viewport = page.viewportSize();

  if (!box || !viewport) {
    throw new Error("Unable to get element or viewport dimensions");
  }

  // At least one corner of the element must be outside the viewport.
  const conditions = [
    box.y < viewport.height,
    box.y + box.height < viewport.height,
    box.x < viewport.width,
    box.x + box.width < viewport.width,
  ];

  let hasOutOfBoundsValue = false;
  for (let i = 0; i < conditions.length; i++) {
    if (!conditions[i]) {
      hasOutOfBoundsValue = true;
    }
  }

  if (!hasOutOfBoundsValue) {
    throw new Error("Element is contained in the viewport");
  }
};

export const resetDrawerState = async (page: Page) => {
  await page.evaluate(() => {
    localStorage.setItem("drawer-opened", "false");
  });
};

export const toggleDetailsPanel = async (page: Page, open: boolean) => {
  await expect(page.getByTestId("details-button")).toBeEnabled();
  if (open) {
    await expect(page.getByTestId("details-menu")).toBeHidden();
    await page.getByTestId("details-button").click();
    await expect(page.getByTestId("details-menu")).toBeVisible();
  } else {
    await expect(page.getByTestId("details-menu")).toBeVisible();
    await page.getByTestId("details-button").click();
    await expect(page.getByTestId("details-menu")).toBeHidden();
  }
};

export const toggleDrawer = async (page: Page) => {
  await page.locator(`[aria-label="Collapse navigation"]`).click();
};

/**
 * Simulates a paste event
 * @param page The Playwright page object
 * @param selector The selector for the target element
 * @param pasteOptions Options for the paste event
 * @param pasteOptions.pastePayload Simulated data that is on the clipboard
 * @param pasteOptions.pasteFormat The format of the simulated paste payload (default: 'text/plain')
 */
export const paste = async (
  page: Page,
  selector: string,
  pasteOptions: {
    pastePayload: string | object;
    pasteFormat?: string;
  },
) => {
  const { pastePayload, pasteFormat = "text/plain" } = pasteOptions;
  const data =
    pasteFormat === "application/json"
      ? JSON.stringify(pastePayload)
      : pastePayload;

  // Write to the clipboard first, then dispatch paste event,
  await page.evaluate(async (payload) => {
    await navigator.clipboard.writeText(payload as string);
  }, data as string);

  await page.locator(selector).evaluate((element) => {
    const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(pasteEvent);
  });
};

// Re-export shared helpers from the playwright-config package.
export {
  validateToast,
  login,
  logout,
  clickLabelForLocator,
} from "@evg-ui/playwright-config/helpers";
