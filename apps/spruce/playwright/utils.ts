import { Page } from "@playwright/test";

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
