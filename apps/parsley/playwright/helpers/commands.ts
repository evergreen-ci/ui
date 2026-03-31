import { expect, Page } from "@playwright/test";

const user = {
  password: "password",
  username: "admin",
};
const toastDataCy = "toast";

export const getByDataCy = (page: Page, value: string) =>
  page.locator(`[data-cy=${value}]`);

export const addFilter = async (page: Page, filter: string) => {
  await expect(getByDataCy(page, "searchbar-select")).toBeEnabled();
  await getByDataCy(page, "searchbar-select").click();
  await getByDataCy(page, "filter-option").click();
  const searchbarInput = getByDataCy(page, "searchbar-input");
  await expect(searchbarInput).toBeEnabled();
  await searchbarInput.focus();
  await page.keyboard.type(filter);
  await searchbarInput.press("Control+Enter");
};

export const addHighlight = async (page: Page, highlight: string) => {
  await expect(getByDataCy(page, "searchbar-select")).toBeEnabled();
  await getByDataCy(page, "searchbar-select").click();
  await getByDataCy(page, "highlight-option").click();
  const searchbarInput = getByDataCy(page, "searchbar-input");
  await expect(searchbarInput).toBeEnabled();
  await searchbarInput.focus();
  await page.keyboard.type(highlight);
  await searchbarInput.press("Control+Enter");
};

export const addSearch = async (page: Page, search: string) => {
  const searchbarInput = getByDataCy(page, "searchbar-input");
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
  await getByDataCy(page, "range-lower-bound").clear();
  await getByDataCy(page, "range-upper-bound").clear();
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
  await getByDataCy(page, toggleDataCy).click();
  await expect(getByDataCy(page, toggleDataCy)).toHaveAttribute(
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
    const upperBound = getByDataCy(page, "range-upper-bound");
    await expect(upperBound).toBeVisible();
    await upperBound.focus();
    await page.keyboard.type(bounds.upper);
  }

  if (bounds.lower !== undefined) {
    const lowerBound = getByDataCy(page, "range-lower-bound");
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

export const getInputByLabel = async (page: Page, label: string) => {
  const labelElement = page.locator("label", { hasText: label });
  const forAttr = await labelElement.getAttribute("for");
  if (!forAttr) {
    throw new Error(`Label "${label}" does not have a "for" attribute`);
  }
  return page.locator(`#${forAttr}`);
};

export const login = async (page: Page) => {
  await page.request.post("http://localhost:9090/login", {
    data: { username: user.username, password: user.password },
  });
};

export const logout = async (page: Page) => {
  await page.request.get("http://localhost:9090/logout", {
    maxRedirects: 0,
  });
};

export const resetDrawerState = async (page: Page) => {
  await page.evaluate(() => {
    localStorage.setItem("drawer-opened", "false");
  });
};

export const toggleDetailsPanel = async (page: Page, open: boolean) => {
  await expect(getByDataCy(page, "details-button")).toBeEnabled();
  if (open) {
    await expect(getByDataCy(page, "details-menu")).toBeHidden();
    await getByDataCy(page, "details-button").click();
    await expect(getByDataCy(page, "details-menu")).toBeVisible();
  } else {
    await expect(getByDataCy(page, "details-menu")).toBeVisible();
    await getByDataCy(page, "details-button").click();
    await expect(getByDataCy(page, "details-menu")).toBeHidden();
  }
};

export const toggleDrawer = async (page: Page) => {
  await page.locator(`[aria-label="Collapse navigation"]`).click();
};

export const validateToast = async (
  page: Page,
  status: string,
  message: string,
  shouldClose?: boolean,
) => {
  await expect(getByDataCy(page, toastDataCy)).toBeVisible();
  await expect(getByDataCy(page, toastDataCy)).toHaveAttribute(
    "data-variant",
    status,
  );

  if (message) {
    await expect(getByDataCy(page, toastDataCy)).toContainText(message);
  }

  if (shouldClose) {
    await getByDataCy(page, toastDataCy)
      .locator("button[aria-label='Close Message']")
      .click();
    await expect(getByDataCy(page, toastDataCy)).toBeHidden();
  }
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
