import { expect, Locator, Page } from "@playwright/test";
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

const clickHiddenElementByLabel = async (locator: Locator) => {
  await expect(locator).not.toHaveAttribute("id", /undefined/);
  const id = await locator.getAttribute("id");
  await locator.page().locator(`label[for="${id}"]`).click();
}

/**
 * Checkboxes are not visible in LG so they cannot be clicked directly.
 * This helper clicks the associated label instead, via the associated id attribute.
 * @param locator - A locator pointing to the checkbox
 */
export const clickCheckbox = async (locator: Locator) => {
  await clickHiddenElementByLabel(locator);
};

/**
 * Radio options are not visible in LG so they cannot be clicked directly.
 * This helper clicks the associated label instead, via the associated id attribute.
 * @param locator - A locator pointing to the radio button
 */
export const clickRadio = async (locator: Locator) => {
  await clickHiddenElementByLabel(locator);
};

type ResponseData = {
  errors: Array<{
    message: string;
    path: string[];
    extensions: { code: string };
  }> | null;
  data: unknown;
};

/**
 * Helper function to mock GraphQL response.
 * @param page - The Playwright page object
 * @param operationName - name of the operation to mock
 * @param responseData - The mock response data
 */
export async function mockGraphQLResponse(
  page: Page,
  operationName: string,
  responseData: ResponseData,
) {
  await page.route("**/graphql/query", async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();
    if (postData?.operationName === operationName) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          errors: responseData.errors,
          data: responseData.data,
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Helper function to check if a GraphQL request has a specific operation name
 * @param postData - The GraphQL request post data
 * @param operationName - The operation name to check for
 * @returns True if the request has the specified operation name
 */
export function hasOperationName(
  postData: unknown,
  operationName: string,
): boolean {
  return (
    typeof postData === "object" &&
    postData !== null &&
    "operationName" in postData &&
    (postData as { operationName: string }).operationName === operationName
  );
}
