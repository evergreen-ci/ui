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
